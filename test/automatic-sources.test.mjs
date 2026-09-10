import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateVenue } from '../scripts/lib/catalog.mjs';
import { Report } from '../scripts/lib/errors.mjs';
import { sourceText, fetchCfp } from '../scripts/lib/source.mjs';
import { fetchSource } from '../scripts/lib/fetch.mjs';
import { extractDeclarative } from '../scripts/lib/adapters/declarative.mjs';
import { zonedDeadline } from '../scripts/lib/adapters/monthly.mjs';
import { refreshVenue } from '../scripts/lib/refresh.mjs';
import { fakeFetch } from './helpers.mjs';

// 아래 자료는 변경 감지를 검증하는 합성 원본이며 실제 일정 근거가 아닙니다.
export function monthlyText({ start = 'April 1, 2026', end = 'March 1, 2027', day = 1, abstract = 25, time = '5:00 PM' } = {}) {
  return 'A rolling deadline occurs on the ' + day + 'st of each month , ' + time +
    ' Pacific Time (Daylight Savings observed according to the US calendar) with mandatory abstract submission by ' + abstract +
    'th of the previous month. The first monthly submission deadline for PVLDB Volume 20 is ' + start + '. The final deadline is ' + end + '.';
}
function venue(id) {
  const v = JSON.parse(readFileSync(new URL('../catalog/venues/' + id + '.json', import.meta.url)));
  const report = new Report();
  const out = validateVenue(v, report, id);
  assert.ok(report.ok, report.format());
  return out;
}
const iswcScript = dates => [
  'globalThis.DO_NOT_EXECUTE = true;',
  '// "Abstract submission due" "b" "1 January 2000"',
  ...['Abstract submission due', 'Full paper submission due', 'Notifications', 'Camera-ready papers due']
    .map((label, i) => 'f(' + JSON.stringify(label) + ', f("b",' + JSON.stringify(dates[i]) + '));'),
  'f("All deadlines are",f("b","23:59 AoE"));',
].join('\n');
const iswcDates = ['2 May 2026', '7 May 2026', '16 July 2026', '6 August 2026'];
function embedded(expression) {
  const code = '<script>const important_dates = ' + expression + '; globalThis.DO_NOT_EXECUTE = true;</script>';
  return '<div data-code="' + code.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '"></div>';
}
const corlData = { 'abstract-deadline': { time: '2026-05-25 23:59', zone: -12, zone_text: 'AoE' },
  'full-paper-submission': { time: '2026-05-28 23:59', zone: -12, zone_text: 'AoE' },
  'camera-ready': { time: '2026-10-12 23:59', zone: -12, zone_text: 'AoE' } };

test('ISWC 모듈 해시가 바뀌어도 참조를 따라가며 변경된 날짜를 읽고 코드는 실행하지 않는다', async () => {
  const v = venue('iswc'), base = 'https://iswc2026.semanticweb.org/';
  const dates = [...iswcDates]; dates[1] = '8 May 2026';
  const map = {
    [v.cfp.url]: { body: '<script src="./assets/index-NEW.js"></script>' },
    [base + 'assets/index-NEW.js']: { body: 'import("./Research-NEW.js");' },
    [base + 'assets/Research-NEW.js']: { body: iswcScript(dates) },
  };
  const result = await refreshVenue(v, undefined, { now: '2026-09-10T00:00:00Z', fetchImpl: fakeFetch(map) });
  assert.equal(result.failure, null);
  assert.equal(result.schedule.editions[0].rounds[0].milestones[1].at, '2026-05-08T23:59:00-12:00');
  assert.equal(globalThis.DO_NOT_EXECUTE, undefined);
});

test('수집 참조 누락·중복·허용되지 않은 호스트는 실패한다', async () => {
  const v = venue('iswc');
  for (const body of ['', '<script src="a.js"></script><script src="b.js"></script>', '<script src="https://evil.example/x.js"></script>']) {
    const calls = [];
    const result = await fetchCfp(v.cfp, { fetchImpl: async url => {
      calls.push(url); return { ok: true, status: 200, url, text: async () => body || '<p>no script</p>' };
    } });
    assert.equal(result.ok, false);
    assert.deepEqual(calls, [v.cfp.url]);
  }
});

test('리다이렉트는 허용되지 않은 호스트로 요청하기 전에 차단한다', async () => {
  const calls = [];
  const result = await fetchSource('https://ok.example/a', { allowedHosts: ['ok.example'], fetchImpl: async url => {
    calls.push(url); return { status: 302, headers: new Headers({ location: 'https://evil.example/' }) };
  } });
  assert.equal(result.ok, false);
  assert.deepEqual(calls, ['https://ok.example/a']);
});

test('허용된 상대 리다이렉트는 처리하고 순환은 제한한다', async () => {
  let count = 0;
  const fetchImpl = async url => { count++; return url.endsWith('/a')
    ? { status: 302, headers: new Headers({ location: '/b' }) }
    : { ok: true, status: 200, url, text: async () => 'ok' }; };
  assert.equal((await fetchSource('https://ok.example/a', { allowedHosts: ['ok.example'], fetchImpl })).ok, true);
  assert.equal(count, 2);
  const loop = await fetchSource('https://ok.example/a', { allowedHosts: ['ok.example'], fetchImpl: async () =>
    ({ status: 302, headers: new Headers({ location: '/a' }) }) });
  assert.match(loop.error, /too many/);
});

test('CoRL의 내장 객체는 주석·후행 쉼표를 처리하고 날짜 변경을 감지한다', () => {
  const cfp = venue('corl').cfp;
  const data = structuredClone(corlData); data['full-paper-submission'].time = '2026-05-29 23:59';
  const expression = JSON.stringify(data).replace(/}$/, ', /* ignored */ }');
  const result = extractDeclarative(cfp, sourceText(embedded(expression), cfp.source));
  assert.equal(result.ok, true);
  assert.equal(result.rounds[0].milestones[1].at, '2026-05-29T23:59:00-12:00');
  assert.equal(globalThis.DO_NOT_EXECUTE, undefined);
});

test('내장 객체의 실행식·중복 선언은 거절하고 시간대 변경도 감지한다', () => {
  const cfp = venue('corl').cfp;
  assert.throws(() => sourceText(embedded('{value: fetch("https://evil.example/")}'), cfp.source), /static/);
  assert.throws(() => sourceText(embedded('{}') + embedded('{}'), cfp.source), /exactly one/);
  const data = structuredClone(corlData); data['abstract-deadline'].zone = 0;
  assert.equal(extractDeclarative(cfp, sourceText(embedded(JSON.stringify(data)), cfp.source)).ok, false);
});

test('VLDB는 공식 범위에서 12회 생성하고 전월 초록·연도 경계·DST를 반영한다', () => {
  const r = extractDeclarative(venue('vldb').cfp, monthlyText());
  assert.ok(r.ok, r.errors.join('; '));
  assert.equal(r.rounds.length, 12);
  assert.equal(r.rounds[0].milestones[0].at, '2026-03-25T17:00:00-07:00');
  assert.equal(r.rounds[7].milestones[0].at, '2026-10-25T17:00:00-07:00');
  assert.equal(r.rounds[7].milestones[1].at, '2026-11-01T17:00:00-08:00');
  assert.equal(r.rounds[11].milestones[1].at, '2027-03-01T17:00:00-08:00');
});

test('월별 일자·시각·기간 변경은 원본에서 읽고 잘못된 규칙은 거절한다', () => {
  const cfp = venue('vldb').cfp;
  const changed = extractDeclarative(cfp, monthlyText({ start: 'May 2, 2026', end: 'June 2, 2026', day: 2, abstract: 24, time: '4:30 PM' }));
  assert.ok(changed.ok);
  assert.equal(changed.rounds.length, 2);
  assert.equal(changed.rounds[0].milestones[0].at, '2026-04-24T16:30:00-07:00');
  assert.equal(changed.rounds[0].milestones[1].at, '2026-05-02T16:30:00-07:00');
  for (const text of [
    monthlyText().replace('Pacific Time (Daylight Savings observed according to the US calendar)', 'UTC'),
    monthlyText({ abstract: 31 }), monthlyText({ start: 'April 1, 2028' }),
    monthlyText({ time: '13:00 PM' }), monthlyText() + monthlyText(),
  ]) assert.equal(extractDeclarative(cfp, text).ok, false);
});

test('IANA 변환은 DST 누락 시각과 중복 시각을 임의 선택하지 않는다', () => {
  assert.throws(() => zonedDeadline({ year: 2026, month: 3, day: 8 }, '02:30', 'America/Los_Angeles'), /nonexistent/);
  assert.throws(() => zonedDeadline({ year: 2026, month: 11, day: 1 }, '01:30', 'America/Los_Angeles'), /ambiguous/);
});

test('자동 원본 실패 시 기존 일정 보존·재확인 표시, 복구 시 변경 로그를 기록한다', async () => {
  const v = venue('vldb');
  const run = (text, previous) => refreshVenue(v, previous, { now: '2026-09-10T00:00:00Z', fetchImpl: fakeFetch({ [v.cfp.url]: { body: text } }) });
  const good = await run(monthlyText());
  const failed = await run('missing rules', good.schedule);
  const before = good.schedule.editions[0].rounds[0].milestones[0];
  const after = failed.schedule.editions[0].rounds[0].milestones[0];
  assert.ok(failed.failure);
  assert.equal(after.at, before.at);
  assert.equal(after.verification, 'needs-verification');
  const restored = await run(monthlyText({ abstract: 24 }), failed.schedule);
  assert.equal(restored.failure, null);
  assert.ok(restored.changes.some(c => c.kind === 'changed'));
  assert.ok(restored.changes.some(c => c.kind === 'recovered'));
});

test('잘못된 source·guard·recurrence 설정은 검증에서 차단한다', () => {
  for (const mutate of [
    v => { v.cfp.source = { format: 'execute' }; },
    v => { v.cfp.source = { format: 'html', follow: ['(a)(b)'] }; },
    v => { v.cfp.guards = ['(']; },
    v => { v.cfp.recurrence.timeZone = 'Unknown/Zone'; },
    v => { v.cfp.recurrence.startPattern = '(a)(b)'; },
    v => { v.cfp.rounds[0].milestones[0].state = 'tba'; },
    v => { v.cfp.adapter = 'manual'; },
  ]) {
    const v = JSON.parse(readFileSync(new URL('../catalog/venues/vldb.json', import.meta.url)));
    mutate(v);
    const report = new Report(); validateVenue(v, report, 'invalid');
    assert.equal(report.ok, false);
  }
});
