import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateVenue } from '../scripts/lib/catalog.mjs';
import { Report } from '../scripts/lib/errors.mjs';
import { extractDeclarative } from '../scripts/lib/adapters/declarative.mjs';
import { extractManual } from '../scripts/lib/adapters/manual.mjs';

// 실제 어댑터에 합성 문구를 입력하여 회차·날짜 순서 혼동을 재현합니다.
// 합성 날짜는 테스트 전용이며 카탈로그 일정의 근거로 사용하지 않습니다.
function cfp(id) {
  const raw = JSON.parse(readFileSync(new URL('../catalog/venues/' + id + '.json', import.meta.url), 'utf8'));
  const report = new Report();
  const venue = validateVenue(raw, report, id);
  assert.ok(report.ok, report.format());
  return structuredClone(venue.cfp);
}

function extract(input, text) {
  const result = extractDeclarative(input, text);
  assert.ok(result.ok, result.errors.join('\n'));
  return result.rounds;
}

test('SIGMOD는 반복되는 제출 문구를 해당 회차 안에서만 읽는다', () => {
  const input = cfp('sigmod');
  input.edition.year = 2099;
  const months = ['January', 'April', 'July', 'October'];
  const text = months.map((month, i) =>
    'RESEARCH PAPER SUBMISSION ROUND ' + (i + 1) +
    ' (All Deadlines are 11:59 PM AoE) ' + month +
    ' 10, 2098: Abstract submission & declaration of COIs ' +
    month + ' 17, 2098: Paper submission'
  ).join(' ');
  const rounds = extract(input, text);
  assert.deepEqual(rounds.map(r => r.milestones[1].at.slice(0, 10)),
    ['2098-01-17', '2098-04-17', '2098-07-17', '2098-10-17']);
  // 해당 회차가 사라지면 다른 회차 날짜를 대신 가져오지 않아야 합니다.
  assert.equal(extractDeclarative(input, text.replace('ROUND 4', 'ROUND X')).ok, false);
});

test('CVPR의 열 단위 표에서 등록일과 논문 마감을 구분한다', () => {
  const input = cfp('cvpr');
  input.edition.year = 2099;
  const text = 'News January 1, 2098 Important Dates ' +
    'Paper Registration Deadline*: Submission Deadline*: Supplementary Materials Deadline: ' +
    'Reviews Released: Rebuttal Period: Final Decisions: November 10, 2098 AOE ' +
    'November 16, 2098 AOE The submission deadline is November 16th, 2098. ' +
    'Supplementary materials can be submitted until November 23rd, 2098.';
  const dates = extract(input, text)[0].milestones.map(m => m.at.slice(0, 10));
  assert.deepEqual(dates, ['2098-11-10', '2098-11-16', '2098-11-23']);
});

test('ICDE의 두 표 열과 Pacific Time 서머타임을 구분한다', () => {
  const input = cfp('icde');
  const text = 'First Round Second Round Submission due June 11, 2026 November 11, 2026 ' +
    'Camera-ready copy due October 10, 2026 March 10, 2027';
  const rounds = extract(input, text);
  assert.equal(rounds[0].milestones[0].at, '2026-06-11T17:00:00-07:00');
  assert.equal(rounds[1].milestones[0].at, '2026-11-11T17:00:00-08:00');
  assert.equal(rounds[1].milestones[1].at, '2027-03-10T17:00:00-08:00');
});

test('CIKM은 날짜 뒤 라벨을 사용하고 다음 항목의 날짜를 섞지 않는다', () => {
  const input = cfp('cikm');
  input.edition.year = 2099;
  const text = 'May 16, 2098 – Abstract Submission Deadline ' +
    'May 23, 2098 – Full Paper Submission Deadline ' +
    'August 7, 2098 – Notification of Acceptance ' +
    'August 23, 2098 – Camera-Ready Submission Deadline';
  const dates = extract(input, text)[0].milestones.map(m => m.at.slice(0, 10));
  assert.deepEqual(dates, ['2098-05-16', '2098-05-23', '2098-08-07', '2098-08-23']);
});

test('VLDB의 월별 규칙은 12회이며 모든 마감이 현지 오후 5시이다', () => {
  const input = cfp('vldb');
  const result = extractManual(input);
  assert.ok(result.ok, result.errors.join('\n'));
  assert.equal(result.rounds.length, 12);
  for (const round of result.rounds) {
    const [abstract, paper] = round.milestones;
    assert.equal(abstract.at.slice(8, 10), '25');
    assert.equal(paper.at.slice(8, 10), '01');
    assert.ok(Date.parse(abstract.at) < Date.parse(paper.at));
    for (const m of [abstract, paper]) {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'America/Los_Angeles', hourCycle: 'h23',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      }).formatToParts(new Date(m.at));
      const get = type => parts.find(p => p.type === type).value;
      assert.equal(get('hour') + ':' + get('minute'), '17:00');
      assert.equal(get('year') + '-' + get('month') + '-' + get('day'), m.at.slice(0, 10));
    }
  }
  // 2026년 11월 회차는 초록과 논문 사이에 서머타임이 종료됩니다.
  const november = result.rounds.find(r => r.id === 'month-2026-11');
  assert.ok(november.milestones[0].at.endsWith('-07:00'));
  assert.ok(november.milestones[1].at.endsWith('-08:00'));
});
