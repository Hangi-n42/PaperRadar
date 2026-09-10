# Adding a venue to the catalog

Every venue is one file: `catalog/venues/<id>.json`. It says **what** the
venue is (identity, field, links) and **how to read its deadlines** (the `cfp`
block). Once a venue is in the catalog, anyone can track it by listing its
field or id in `config/radar.yaml`.

## 1. Scaffold

```bash
npm run new-venue -- --id myconf --acronym MyConf \
  --name "International Conference on My Topic" --type conference \
  --fields systems,cloud --url https://myconf.org/2027/cfp --year 2027
```

Field ids come from `catalog/fields.json`; add a field there first if none
fits. `--type` is `conference`, `journal` or `workshop`. For a journal without
deadlines omit `--url` — it becomes `submission: rolling` and is listed without
tracking.

## 2. Pick an adapter

### `declarative` — automated (preferred)

Each dated milestone has a regex that is run against the **plain text** of the
CFP page (tags removed, whitespace collapsed to single spaces). Write
`{{DATE}}` where the date is; it expands to a pattern that understands
`April 15, 2026`, `15 April 2026`, `Apr. 15th, 2026`, `2026-04-15`,
`Wednesday, April 15, 2026` and similar. The pattern must contain exactly one
capture group, which `{{DATE}}` provides.

```json
"cfp": {
  "adapter": "declarative",
  "url": "https://myconf.org/2027/cfp",
  "allowedHosts": ["myconf.org"],
  "edition": { "year": 2027, "label": "MyConf 2027", "event": { "start": "2027-06-01", "end": "2027-06-04", "location": "Seoul, Korea" } },
  "timezone": { "label": "AoE", "time": "23:59" },
  "rounds": [
    { "id": "main", "label": "Main", "track": "full",
      "milestones": [
        { "type": "abstract", "pattern": "Abstract registration[\\s\\S]{0,60}?{{DATE}}" },
        { "type": "paper",    "pattern": "Full paper submission[\\s\\S]{0,60}?{{DATE}}" },
        { "type": "notification", "state": "tba" }
      ] }
  ]
}
```

Rules the refresh step applies:

- the captured year must be `edition.year` or the year before;
- within a round, `abstract ≤ paper ≤ notification ≤ camera-ready`;
- if **any** dated milestone fails, the whole edition is left as it was and
  marked *Verification needed* — nothing partial is ever stored.

Options per milestone: `time` (`"17:00"`), `tz` (`"KST"`, `"PST"`, or
`"+09:00"`), `dateFormat` (`"dmy"`/`"mdy"` for numeric dates like
`15/04/2026`), `label` (`{ko, en}`, required for `type: other`),
`state: tba | not-required`.

If the page states **no timezone at all**, write `"timezone": { "label": "unspecified" }`.
AoE is assumed for display, the site says so, and **no reminder is sent** for
those dates — we do not wake people up on an assumption. A per-milestone `tz`
overrides this.

Milestone types: `abstract`, `paper`, `camera-ready` and `other` are things an
author must do — they define "next deadline" and trigger reminders.
`notification` and `event` are informational: shown and exported to calendars,
never reminded.

Skipping an extended deadline: when a page lists the old and the new date
(`Paper submission: April 23, 2026 May 7, 2026`), consume the first one
explicitly so the second is captured:
`"Paper submission:\\s*[A-Z][a-z]+ \\d{1,2}, \\d{4}\\s*{{DATE}}"`.

Multiple rounds (`spring`/`fall`, `round-1`/`round-2`) and tracks
(`track: short`, `poster`, `special-issue`, `doctoral`, `industry`) are just
more entries in `rounds`. Use round-specific context in the pattern so the
right date is matched, e.g. `Fall cycle[\s\S]{0,200}?Paper submission\s*{{DATE}}`.

### `manual` — a person reads the page

For pages that render dates with JavaScript, block automated access, or are
plain images. Dates count as **Verified** because a person confirmed them, and
the date of that check is shown on the site.

```json
"cfp": {
  "adapter": "manual",
  "url": "https://myconf.org/2027/cfp",
  "edition": { "year": 2027, "label": "MyConf 2027" },
  "timezone": { "label": "AoE", "time": "23:59" },
  "rounds": [
    { "id": "main",
      "milestones": [
        { "type": "abstract", "date": "2027-01-10", "verifiedAt": "2026-09-02" },
        { "type": "paper",    "date": "2027-01-17", "verifiedAt": "2026-09-02" }
      ] }
  ]
}
```

### `none` — listed, not tracked

`"cfp": { "adapter": "none", "url": "https://…" }` (or `"cfp": null`). The
venue appears with its links and rankings but without deadlines.

## 3. Write and test the patterns

```bash
npm run probe -- https://myconf.org/2027/cfp              # every date on the page, with the text before it
npm run probe -- https://myconf.org/2027/cfp --grep deadline
npm run probe -- https://myconf.org/2027/cfp --pattern "Full paper submission[\s\S]{0,60}?{{DATE}}"
npm run probe -- --venue myconf                            # run the adapter exactly like the daily refresh
```

Typical pitfalls:

- **Two dates on one line** (`Abstract: March 1 · Paper: March 8`) — anchor
  on the label and keep the gap short: `Paper:\s*{{DATE}}`.
- **The same label in several tables** (main track and workshops) — include
  the section heading in the pattern with `[\s\S]{0,300}?`.
- **Numeric dates** — `03/08/2027` is ambiguous; set `dateFormat`.
- **"11:59 PM EST"** — set `time` and `tz` on the milestone or the edition.
- **Dates only in a PDF or image** — use the `manual` adapter.

## 4. Validate and try it

```bash
npm run validate
npm run refresh -- --only myconf
npm run build && npm run dev
```

## 5. Rankings (optional)

Add the venue id to `catalog/rankings/<scheme>.json` → `entries` if the
scheme ranks it. Never invent a tier; leave it out if unsure.

## 6. Open a pull request

Checklist:

- [ ] `npm test`, `npm run validate` pass
- [ ] `npm run probe -- --venue <id>` shows the expected dates
- [ ] `url` is the **official** CFP / important-dates page, and `allowedHosts` matches it
- [ ] `edition.label`, `year` and `event` are correct
- [ ] Manual entries have `verifiedAt` = the day you checked

## Field guide to the schema

| Key | Required | Notes |
|---|---|---|
| `id` | yes | lowercase, digits, hyphens; equals the file name |
| `acronym`, `name` | yes | display name and official full name |
| `type` | yes | `conference` / `journal` / `workshop` |
| `fields` | yes | ids from `catalog/fields.json` |
| `topics` | no | free-text keywords for search |
| `homepage` | no | permanent home page |
| `parent` | no | hosting conference for workshops (display only) |
| `note` | no | string or `{ko, en}` shown on the card |
| `submission` | no | `cfp` (default) or `rolling` (default for journals) |
| `cfp` | no | adapter block described above |

## Following a venue into its next edition

A venue file tracks one edition. When that edition's deadlines have all passed,
PaperRadar can look for the next one by itself — if the venue publishes each
edition at a URL that differs only by the year:

```json
"cfp": {
  "url": "https://2027.eurosys.org/cfp.html",
  "allowedHosts": ["2027.eurosys.org"],
  "rollover": {
    "url": "https://{year}.eurosys.org/cfp.html",
    "allowedHosts": ["{year}.eurosys.org"],
    "maxAhead": 2
  }
}
```

`{year}` becomes `2028`; use `{yy}` where the site uses two digits
(`ppopp28.sigplan.org`). A host with no placeholder is kept as-is, which is
right for `www.asplos-conference.org/asplos{year}/cfp/`.

`npm run validate` refuses a template that does not reproduce the tracked
`url` at the current `edition.year`, so rollover can never start reading a
different page than the one the adapter was written against.

### When it fires

Only when the tracked edition has **no author deadline left in the future**
(abstract, paper, camera-ready — a pending notification date does not count),
or when its page has gone. Then the next year is fetched, under an allow-list
expanded for that year alone.

### What it takes to be adopted

All of these, or the probe is discarded and tried again tomorrow:

1. the page is reachable and parses with this venue's own patterns;
2. it yields at least one **future** author deadline;
3. not every date on it is older than the current edition — this is what
   rejects a next-year page that is still a copy of the last CFP;
4. the year is at most `maxAhead` (≤ 5) ahead, and no more than two calendar
   years from today.

On adoption the venue file's `url`, `allowedHosts` and `edition` are rewritten
and committed, the previous edition stays in `data/schedules.json` as history,
and the digest reports it under **📅 새 회차 추적 시작 / Now tracking the next
edition**. `edition.event` is cleared: the new edition's dates and location are
not known from the CFP page.

### When it cannot help

Venues that change host between editions (`hpdc.sci.utah.edu/2026/` →
somewhere else entirely) will simply never find a candidate. That is not a
failure; the source keeps its normal status and a human updates the file.
Check what would happen with `npm run probe -- --venue <id>`.
# 동적 페이지 원본과 월별 반복 마감

선언형 어댑터는 일반 HTML 외에 아래 원본 형식을 지원합니다. 공식 코드의 실행 없이 `acorn` 구문 분석기로 정적 데이터만 읽습니다.

- `cfp.source.format: javascript-strings`: 현재 JavaScript 모듈의 문자열 리터럴을 소스 순서대로 연결합니다. 주석은 제외합니다.
- `cfp.source.follow`: 원본 문서에서 다음 참조를 캡처하는 정규식 목록입니다(최대 3단계, 각 패턴 캡처 1개). 서로 다른 참조가 여러 개이거나 없으면 실패합니다. 상대 URL은 현재 응답 URL을 기준으로 해석하며 모든 요청과 리다이렉트는 `allowedHosts`로 제한합니다. 해시가 붙은 URL을 직접 고정하지 마세요.
- `cfp.source.format: embedded-json`: `attribute` 속성의 HTML 엔티티를 해독하고 내부 script에서 `variable` 이름의 정적 객체를 읽습니다. 예: CoRL의 `attribute: data-code`, `variable: important_dates`. 숫자·문자열·중첩 객체만 허용하며 함수 호출·계산 프로퍼티·중복 키는 거절합니다. 패턴은 객체의 JSON 문자열에 적용됩니다.
- `cfp.guards`: 추출 전에 반드시 존재해야 하는 정규식 목록입니다(캡처 0개). 공식 시간대·시각이 유지되는지 확인할 때 사용합니다.

`cfp.recurrence`는 `kind: monthly`를 지원합니다. 날짜를 카탈로그에 미리 전개하지 않고 매 갱신마다 공식 규칙을 읽습니다.

| 속성 | 의미 |
|---|---|
| `startPattern`, `endPattern` | 첫·마지막 논문 마감 날짜 (`{{DATE}}`, 캡처 1개) |
| `paperDayPattern` | 매월 논문 마감의 일(day) 숫자 |
| `abstractDayPattern` | 전월 초록 마감의 일(day) 숫자 |
| `timePattern` | 공식 시각 `h:mm AM/PM` |
| `timezonePattern` | 공식 시간대·서머타임 문구 (캡처 0개) |
| `timeZone` | 공식 근거에 대응하는 IANA 시간대 |

날짜 외 숫자·시각 패턴도 캡처가 정확히 1개여야 합니다. 반복 규칙은 한 개의 `abstract`, `paper` milestone을 가진 round 템플릿을 사용합니다. 생성되는 round ID는 `month-YYYY-MM`이며, 기존 수동 VLDB 일정과 UID를 유지합니다. 회차 연도와 맞지 않는 범위, 24회를 초과하는 범위, 존재하지 않는 날짜, DST의 중복·누락 현지 시각은 실패합니다. 반복 규칙과 연도 rollover는 함께 사용할 수 없습니다.

실제 구성 예시는 `catalog/venues/iswc.json`, `corl.json`, `vldb.json`을 참고하세요. 원본 로딩과 규칙 추출은 기존과 동일하게 회차 전체가 성공해야 반영되며, 실패 시 이전 날짜를 `needs-verification`으로 보존합니다. 저널 상시 투고와 미발표 회차 날짜를 이 규칙으로 추정해서는 안 됩니다.
