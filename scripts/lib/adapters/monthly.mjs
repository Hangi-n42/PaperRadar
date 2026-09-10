// 매번 공식 반복 규칙을 읽어 월별 마감을 전개합니다. 추정 날짜는 만들지 않습니다.
import { compilePattern } from '../catalog.mjs';
import { parseDateText, daysInMonth, normalizeTime, toIsoWithOffset, partsInTimeZone } from '../dates.mjs';

function capture(pattern, text, label) {
  const { regex } = compilePattern(pattern);
  const values = [...text.matchAll(new RegExp(regex.source, 'gi'))].map(m => m[1]?.trim());
  if (values.length !== 1 || !values[0]) throw new Error(label + ': expected exactly one rule');
  return values[0];
}

// DST 전환의 중복·존재하지 않는 현지 시각은 검증 실패로 처리합니다.
export function zonedDeadline(date, time, timeZone) {
  const normalized = normalizeTime(time);
  if (!normalized) throw new Error('invalid local time');
  const [hour, minute, second] = normalized.split(':').map(Number);
  const wall = Date.UTC(date.year, date.month - 1, date.day, hour, minute, second);
  const formatter = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' });
  const offsets = new Set([-36, 0, 36].map(h => {
    const label = formatter.formatToParts(new Date(wall + h * 3600000)).find(p => p.type === 'timeZoneName').value;
    return label === 'GMT' ? '+00:00' : label.replace('GMT', '');
  }));
  const valid = [...offsets].filter(offset => {
    const p = partsInTimeZone(toIsoWithOffset(date, normalized, offset), timeZone);
    return p.year === date.year && p.month === date.month && p.day === date.day && p.hour === hour && p.minute === minute;
  });
  if (valid.length !== 1) throw new Error('ambiguous or nonexistent local time');
  const offset = valid[0];
  const at = toIsoWithOffset(date, normalized, offset);
  const label = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' })
    .formatToParts(new Date(at)).find(p => p.type === 'timeZoneName').value;
  return { at, tzLabel: label, tzOffset: offset, tzConfirmed: true };
}

export function extractMonthly(cfp, text) {
  try {
    const rule = cfp.recurrence;
    if (!new RegExp(rule.timezonePattern, 'i').test(text)) throw new Error('timezone rule not found');
    const start = parseDateText(capture(rule.startPattern, text, 'start'));
    const end = parseDateText(capture(rule.endPattern, text, 'end'));
    const paperDay = Number(capture(rule.paperDayPattern, text, 'paper day'));
    const abstractDay = Number(capture(rule.abstractDayPattern, text, 'abstract day'));
    const clock = capture(rule.timePattern, text, 'time').match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!clock || Number(clock[1]) < 1 || Number(clock[1]) > 12 || Number(clock[2]) > 59) throw new Error('invalid rule time');
    const time = String(Number(clock[1]) % 12 + (/pm/i.test(clock[3]) ? 12 : 0)).padStart(2, '0') + ':' + clock[2];
    if (!start || !end || !Number.isInteger(paperDay) || !Number.isInteger(abstractDay)
        || paperDay < 1 || paperDay > 31 || abstractDay < 1 || abstractDay > 31) throw new Error('invalid monthly boundary/day');
    const first = start.year * 12 + start.month - 1, last = end.year * 12 + end.month - 1;
    if (last < first || last - first >= 24 || start.year < cfp.edition.year - 1 || end.year > cfp.edition.year
        || start.day !== paperDay || end.day !== paperDay) throw new Error('implausible monthly range');
    const rounds = [];
    for (let month = first; month <= last; month++) {
      const year = Math.floor(month / 12), number = month % 12 + 1;
      const previous = month - 1;
      const dates = {
        abstract: { year: Math.floor(previous / 12), month: previous % 12 + 1, day: abstractDay },
        paper: { year, month: number, day: paperDay },
      };
      const milestones = ['abstract', 'paper'].map(type => {
        const date = dates[type];
        if (date.day > daysInMonth(date.year, date.month)) throw new Error('monthly day does not exist');
        const converted = zonedDeadline(date, time, rule.timeZone);
        return { type, state: 'dated', ...converted, sourceText: converted.at.slice(0, 10) + ' (official monthly rule)', verification: 'verified' };
      });
      const suffix = year + '-' + String(number).padStart(2, '0');
      rounds.push({ id: 'month-' + suffix, label: suffix, track: cfp.rounds[0].track, milestones });
    }
    return { ok: true, rounds, errors: [] };
  } catch (err) {
    return { ok: false, rounds: [], errors: [err.message] };
  }
}
