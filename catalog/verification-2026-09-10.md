# 카탈로그 검증 — 2026-09-10

Windows / Node 24.16.0에서 실제 실행한 결과입니다. 공식 출처와 선정 설명은 [카탈로그 안내](README.md)에 있습니다.

## 결과

- 카탈로그: 29개 (학술대회 19, 저널 7, 워크숍·챌린지 3), 연구 분야 8개, CCF 분야별 등급 목록 2개.
- 선언형 18개는 공식 페이지에서 전체 날짜가 `verified`로 추출되었습니다. 수동 3개는 공식 페이지에서 확인하여 등록한 값을 검사했습니다.
- 수동 항목 ISWC·CoRL·VLDB의 `verifiedAt`은 모두 `2026-09-10`입니다. VLDB는 공식 월별 규칙을 12회로 전개하며 Pacific Time의 서머타임을 반영했습니다.
- 상시 투고 저널 7개는 `cfp: null`이며 날짜 추출 대상이 아닙니다. SemTab은 새 회차의 공식 마감을 확인하지 못해 `adapter: none`이며 날짜를 비워 두었습니다.
- `npm run refresh`: 종료 코드 0, `ok 21 · failed 0 · changes 94`. `data/`는 이 명령으로만 갱신했습니다.
- `npm run validate`: 종료 코드 0, 오류 0개·경고 26개. 경고는 삭제된 예시 venue의 과거 일정 보존이며 현재 선택 대상에는 포함되지 않습니다.
- `npm test`: 종료 코드 0, 71개 통과·실패 0개. 추가한 회귀 검사 5개는 SIGMOD 회차, CVPR 열 순서, ICDE 회차·시간대, CIKM 날짜 뒤 라벨, VLDB 월별 서머타임을 검증합니다.
- `npm run build`: 종료 코드 0, 29 venues, 33 upcoming, 214 calendar events, 39 feeds.
- `npm run doctor`: 종료 코드 0. `site.baseUrl`과 로컬 Google Chat webhook은 비어 있습니다. 배포·알림 전송은 수행하지 않았습니다.

## 개별 probe 실행의 제한

21개 모두 날짜 추출 결과를 출력했으나, 그중 13개 명령은 출력 후 Windows Node/libuv 종료 오류로 종료 코드 1을 반환했습니다. 따라서 개별 명령이 모두 정상 종료했다고 판단하지 않습니다. ACL을 터미널 모드로 재실행해도 같은 오류가 발생했습니다.

같은 어댑터를 사용하는 전체 `refresh`는 오류 없이 종료하여 94개 일정을 저장했습니다. 이번 카탈로그 작업에서는 CLI 런타임 코드를 변경하지 않았습니다. 아래에는 오류를 포함한 실제 probe 출력을 그대로 남겼습니다.

## venue별 실제 추출 결과

### acl

명령: `npm run probe -- --venue acl` · 종료 코드: 1 · [어댑터와 공식 CFP URL](venues/acl.json)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue acl

ACL · ACL 2026 · source ok
  round main (full)
    paper         dated         2026-01-05T23:59:00-12:00  "January 5, 2026"  [verified]
    other         dated         2026-03-14T23:59:00-12:00  "March 14, 2026"  [verified]
    notification  dated         2026-04-04T23:59:00-12:00  "April 4, 2026"  [verified]
    camera-ready  dated         2026-04-19T23:59:00-12:00  "April 19, 2026"  [verified]
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 94
```

### bento

명령: `npm run probe -- --venue bento` · 종료 코드: 1 · [어댑터와 공식 CFP URL](venues/bento.json)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue bento

BeNTo · BeNTo 2026 · source ok
  round main (full)
    paper         dated         2026-09-05T23:59:00-12:00  "Sep 5, 2026"  [verified]
    notification  dated         2026-09-28T23:59:00-12:00  "Sep 28, 2026"  [verified]
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 94
```

### cikm

명령: `npm run probe -- --venue cikm` · 종료 코드: 0 · [어댑터와 공식 CFP URL](venues/cikm.json)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue cikm

CIKM · CIKM 2026 · source ok
  round main (full)
    abstract      dated         2026-05-16T23:59:00-12:00  "May 16, 2026"  [verified]
    paper         dated         2026-05-23T23:59:00-12:00  "May 23, 2026"  [verified]
    notification  dated         2026-08-07T23:59:00-12:00  "August 7, 2026"  [verified]
    camera-ready  dated         2026-08-23T23:59:00-12:00  "August 23, 2026"  [verified]
```

### coling

명령: `npm run probe -- --venue coling` · 종료 코드: 1 · [어댑터와 공식 CFP URL](venues/coling.json)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue coling

COLING · COLING 2027 · source ok
  round main (full)
    paper         dated         2026-10-12T23:59:00-12:00  "Monday October 12, 2026"  [verified]
    other         dated         2026-12-23T23:59:00-12:00  "Wednesday December 23, 2026"  [verified]
    notification  dated         2027-02-10T23:59:00-12:00  "Wednesday February 10, 2027"  [verified]
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 94
```

### corl

명령: `npm run probe -- --venue corl` · 종료 코드: 0 · [어댑터와 공식 CFP URL](venues/corl.json)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue corl

CoRL · CoRL 2026 · source manual
  round main (full)
    abstract      dated         2026-05-25T23:59:00-12:00  "2026-05-25"  [verified]
    paper         dated         2026-05-28T23:59:00-12:00  "2026-05-28"  [verified]
    camera-ready  dated         2026-10-12T23:59:00-12:00  "2026-10-12"  [verified]
```

### cvpr

명령: `npm run probe -- --venue cvpr` · 종료 코드: 0 · [어댑터와 공식 CFP URL](venues/cvpr.json)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue cvpr

CVPR · CVPR 2027 · source ok
  round main (full)
    abstract      dated         2026-11-10T23:59:00-12:00  "Nov 10, 2026"  [verified]
    paper         dated         2026-11-16T23:59:00-12:00  "November 16th, 2026"  [verified]
    other         dated         2026-11-23T23:59:00-12:00  "November 23rd, 2026"  [verified]
```

### emnlp

명령: `npm run probe -- --venue emnlp` · 종료 코드: 1 · [어댑터와 공식 CFP URL](venues/emnlp.json)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue emnlp

EMNLP · EMNLP 2026 · source ok
  round main (full)
    paper         dated         2026-05-25T23:59:00-12:00  "May 25, 2026"  [verified]
    other         dated         2026-08-02T23:59:00-12:00  "August 2, 2026"  [verified]
    notification  dated         2026-08-20T23:59:00-12:00  "August 20, 2026"  [verified]
    camera-ready  dated         2026-08-30T23:59:00-12:00  "August 30, 2026"  [verified]
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 94
```

### eswc

명령: `npm run probe -- --venue eswc` · 종료 코드: 1 · [어댑터와 공식 CFP URL](venues/eswc.json)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue eswc

ESWC · ESWC 2026 · source ok
  round main (full)
    abstract      dated         2025-11-27T23:59:00-12:00  "November 27, 2025"  [verified]
    paper         dated         2025-12-04T23:59:00-12:00  "December 4, 2025"  [verified]
    notification  dated         2026-02-12T23:59:00-12:00  "February 12, 2026"  [verified]
    camera-ready  dated         2026-03-11T23:59:00-12:00  "March 11, 2026"  [verified]
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 94
```

### icde

명령: `npm run probe -- --venue icde` · 종료 코드: 1 · [어댑터와 공식 CFP URL](venues/icde.json)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue icde

ICDE · ICDE 2027 · source ok
  round round-1 (full)
    paper         dated         2026-06-11T17:00:00-07:00  "June 11, 2026"  [verified]
    camera-ready  dated         2026-10-10T17:00:00-07:00  "October 10, 2026"  [verified]
  round round-2 (full)
    paper         dated         2026-11-11T17:00:00-08:00  "November 11, 2026"  [verified]
    camera-ready  dated         2027-03-10T17:00:00-08:00  "March 10, 2027"  [verified]
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 94
```

### iclr

명령: `npm run probe -- --venue iclr` · 종료 코드: 0 · [어댑터와 공식 CFP URL](venues/iclr.json)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue iclr

ICLR · ICLR 2027 · source ok
  round main (full)
    abstract      dated         2026-09-18T23:59:00-12:00  "Sep 18, 2026"  [verified]
    paper         dated         2026-09-25T23:59:00-12:00  "Sep 25, 2026"  [verified]
```

### icml

명령: `npm run probe -- --venue icml` · 종료 코드: 0 · [어댑터와 공식 CFP URL](venues/icml.json)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue icml

ICML · ICML 2026 · source ok
  round main (full)
    abstract      dated         2026-01-23T23:59:00-12:00  "January 23, 2026"  [verified]
    paper         dated         2026-01-28T23:59:00-12:00  "January 28, 2026"  [verified]
```

### icra

명령: `npm run probe -- --venue icra` · 종료 코드: 1 · [어댑터와 공식 CFP URL](venues/icra.json)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue icra

ICRA · ICRA 2027 · source ok
  round main (full)
    paper         dated         2026-09-15T23:59:00-08:00  "September 15, 2026"  [verified]
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 94
```

### iswc

명령: `npm run probe -- --venue iswc` · 종료 코드: 0 · [어댑터와 공식 CFP URL](venues/iswc.json)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue iswc

ISWC · ISWC 2026 · source manual
  round research (full)
    abstract      dated         2026-05-02T23:59:00-12:00  "2026-05-02"  [verified]
    paper         dated         2026-05-07T23:59:00-12:00  "2026-05-07"  [verified]
    notification  dated         2026-07-16T23:59:00-12:00  "2026-07-16"  [verified]
    camera-ready  dated         2026-08-06T23:59:00-12:00  "2026-08-06"  [verified]
```

### kdd

명령: `npm run probe -- --venue kdd` · 종료 코드: 1 · [어댑터와 공식 CFP URL](venues/kdd.json)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue kdd

KDD · KDD 2027 · source ok
  round cycle-1 (full)
    abstract      dated         2026-07-19T23:59:00-12:00  "July 19, 2026"  [verified]
    paper         dated         2026-07-26T23:59:00-12:00  "July 26, 2026"  [verified]
    notification  dated         2026-11-14T23:59:00-12:00  "November 14, 2026"  [verified]
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 94
```

### naacl

명령: `npm run probe -- --venue naacl` · 종료 코드: 1 · [어댑터와 공식 CFP URL](venues/naacl.json)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue naacl

NAACL · NAACL 2027 · source ok
  round main (full)
    paper         dated         2026-10-12T23:59:00-12:00  "October 12, 2026"  [verified]
    other         dated         2026-12-23T23:59:00-12:00  "December 23, 2026"  [verified]
    notification  dated         2027-02-10T23:59:00-12:00  "February 10, 2027"  [verified]
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 94
```

### neurips

명령: `npm run probe -- --venue neurips` · 종료 코드: 1 · [어댑터와 공식 CFP URL](venues/neurips.json)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue neurips

NeurIPS · NeurIPS 2026 · source ok
  round main (full)
    abstract      dated         2026-05-04T23:59:00-12:00  "May 4, 2026"  [verified]
    paper         dated         2026-05-06T23:59:00-12:00  "May 6, 2026"  [verified]
    notification  dated         2026-09-24T23:59:00-12:00  "September 24, 2026"  [verified]
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 94
```

### rss

명령: `npm run probe -- --venue rss` · 종료 코드: 1 · [어댑터와 공식 CFP URL](venues/rss.json)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue rss

RSS · RSS 2026 · source ok
  round main (full)
    abstract      dated         2026-01-23T23:59:00-12:00  "January 23, 2026"  [verified]
    paper         dated         2026-01-30T23:59:00-12:00  "January 30, 2026"  [verified]
    notification  dated         2026-04-27T23:59:00-12:00  "April 27, 2026"  [verified]
    camera-ready  dated         2026-05-11T23:59:00-12:00  "May 11, 2026"  [verified]
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 94
```

### scaling-h2r

명령: `npm run probe -- --venue scaling-h2r` · 종료 코드: 1 · [어댑터와 공식 CFP URL](venues/scaling-h2r.json)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue scaling-h2r

Scaling H2R · Scaling H2R 2026 · source ok
  round main (full)
    paper         dated         2026-10-07T23:59:00-12:00  "Oct 7, 2026"  [verified]
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 94
```

### sigmod

명령: `npm run probe -- --venue sigmod` · 종료 코드: 0 · [어댑터와 공식 CFP URL](venues/sigmod.json)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue sigmod

SIGMOD · SIGMOD 2027 · source ok
  round round-1 (full)
    abstract      dated         2026-01-10T23:59:00-12:00  "January 10, 2026"  [verified]
    paper         dated         2026-01-17T23:59:00-12:00  "January 17, 2026"  [verified]
  round round-2 (full)
    abstract      dated         2026-04-10T23:59:00-12:00  "April 10, 2026"  [verified]
    paper         dated         2026-04-17T23:59:00-12:00  "April 17, 2026"  [verified]
  round round-3 (full)
    abstract      dated         2026-07-10T23:59:00-12:00  "July 10, 2026"  [verified]
    paper         dated         2026-07-17T23:59:00-12:00  "July 17, 2026"  [verified]
  round round-4 (full)
    abstract      dated         2026-10-10T23:59:00-12:00  "October 10, 2026"  [verified]
    paper         dated         2026-10-17T23:59:00-12:00  "October 17, 2026"  [verified]
```

### vldb

명령: `npm run probe -- --venue vldb` · 종료 코드: 0 · [어댑터와 공식 CFP URL](venues/vldb.json)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue vldb

VLDB · VLDB 2027 / PVLDB Volume 20 · source manual
  round month-2026-04 (full)
    abstract      dated         2026-03-25T17:00:00-07:00  "2026-03-25"  [verified]
    paper         dated         2026-04-01T17:00:00-07:00  "2026-04-01"  [verified]
  round month-2026-05 (full)
    abstract      dated         2026-04-25T17:00:00-07:00  "2026-04-25"  [verified]
    paper         dated         2026-05-01T17:00:00-07:00  "2026-05-01"  [verified]
  round month-2026-06 (full)
    abstract      dated         2026-05-25T17:00:00-07:00  "2026-05-25"  [verified]
    paper         dated         2026-06-01T17:00:00-07:00  "2026-06-01"  [verified]
  round month-2026-07 (full)
    abstract      dated         2026-06-25T17:00:00-07:00  "2026-06-25"  [verified]
    paper         dated         2026-07-01T17:00:00-07:00  "2026-07-01"  [verified]
  round month-2026-08 (full)
    abstract      dated         2026-07-25T17:00:00-07:00  "2026-07-25"  [verified]
    paper         dated         2026-08-01T17:00:00-07:00  "2026-08-01"  [verified]
  round month-2026-09 (full)
    abstract      dated         2026-08-25T17:00:00-07:00  "2026-08-25"  [verified]
    paper         dated         2026-09-01T17:00:00-07:00  "2026-09-01"  [verified]
  round month-2026-10 (full)
    abstract      dated         2026-09-25T17:00:00-07:00  "2026-09-25"  [verified]
    paper         dated         2026-10-01T17:00:00-07:00  "2026-10-01"  [verified]
  round month-2026-11 (full)
    abstract      dated         2026-10-25T17:00:00-07:00  "2026-10-25"  [verified]
    paper         dated         2026-11-01T17:00:00-08:00  "2026-11-01"  [verified]
  round month-2026-12 (full)
    abstract      dated         2026-11-25T17:00:00-08:00  "2026-11-25"  [verified]
    paper         dated         2026-12-01T17:00:00-08:00  "2026-12-01"  [verified]
  round month-2027-01 (full)
    abstract      dated         2026-12-25T17:00:00-08:00  "2026-12-25"  [verified]
    paper         dated         2027-01-01T17:00:00-08:00  "2027-01-01"  [verified]
  round month-2027-02 (full)
    abstract      dated         2027-01-25T17:00:00-08:00  "2027-01-25"  [verified]
    paper         dated         2027-02-01T17:00:00-08:00  "2027-02-01"  [verified]
  round month-2027-03 (full)
    abstract      dated         2027-02-25T17:00:00-08:00  "2027-02-25"  [verified]
    paper         dated         2027-03-01T17:00:00-08:00  "2027-03-01"  [verified]
```

### www

명령: `npm run probe -- --venue www` · 종료 코드: 1 · [어댑터와 공식 CFP URL](venues/www.json)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue www

WWW · WWW 2027 · source ok
  round full (full)
    abstract      dated         2026-10-18T23:59:00-12:00  "18 October 2026"  [verified]
    paper         dated         2026-10-25T23:59:00-12:00  "25 October 2026"  [verified]
    notification  dated         2027-01-04T23:59:00-12:00  "04 January 2027"  [verified]
    camera-ready  dated         2027-01-31T23:59:00-12:00  "31 January 2027"  [verified]
  round short (short)
    abstract      dated         2026-11-09T23:59:00-12:00  "9 November 2026"  [verified]
    paper         dated         2026-11-16T23:59:00-12:00  "16 November 2026"  [verified]
    notification  dated         2027-01-04T23:59:00-12:00  "04 January 2027"  [verified]
    camera-ready  dated         2027-01-31T23:59:00-12:00  "31 January 2027"  [verified]
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 94
```

## validate 실제 결과

```text
> paperradar@1.0.0 validate
> node scripts/validate.mjs

WARN   data/schedules.json.venues.asplos: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.ccgrid: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.cluster: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.eesp: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.euro-par: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.eurosys: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.hotcarbon: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.hotinfra: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.hotos: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.hpdc: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.icdcs: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.icpp: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.ics: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.ieee-cloud: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.igsc: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.ipdps: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.micro: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.middleware: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.nsdi: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.osdi: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.ppopp: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.sigcomm: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.sigmetrics: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.socc: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.sosp: venue is no longer in the catalog (stale data kept)
WARN   data/schedules.json.venues.sustain-hpc: venue is no longer in the catalog (stale data kept)
catalog: 29 venues, 8 fields, 2 rankings
tracked: 29 venues (conference 19, workshop 3, journal 7)
adapters: declarative 18, manual 3, none 8
schedules: 21/29 tracked venues have data (updated 2026-09-10T07:28:43Z)
result: OK — 0 errors, 26 warnings
```

## build 실제 결과

```text
> paperradar@1.0.0 build
> node scripts/build.mjs

built dist/ — 29 venues, 33 upcoming, 214 calendar events, 39 feeds
```

## doctor 실제 결과

```text
> paperradar@1.0.0 doctor
> node scripts/doctor.mjs

Runtime
  ✔ Node 24.16.0

Config
  ✔ config/radar.yaml found
  ✔ site "PaperRadar" · languages ko/en · timezone Asia/Seoul
  · site.baseUrl is empty — reminders will not link to the site. This checkout would publish to https://hangi-n42.github.io/PaperRadar/
  ✔ rankings shown: ccf-ai, ccf-data

Tracked venues (29)
  ACL          conference  declarative  ACL 2026                ccf-ai:A
  BeNTo        workshop    declarative  BeNTo 2026
  CIKM         conference  declarative  CIKM 2026
  COLING       conference  declarative  COLING 2027             ccf-ai:B
  CoRL         conference  manual       CoRL 2026
  CVPR         conference  declarative  CVPR 2027               ccf-ai:A
  DMLR         journal     none         —                        (not tracked)
  EMNLP        conference  declarative  EMNLP 2026              ccf-ai:B
  ESWC         conference  declarative  ESWC 2026
  ICDE         conference  declarative  ICDE 2027
  ICLR         conference  declarative  ICLR 2027
  ICML         conference  declarative  ICML 2026               ccf-ai:A
  ICRA         conference  declarative  ICRA 2027               ccf-ai:B
  ISWC         conference  manual       ISWC 2026
  JMLR         journal     none         —                       ccf-ai:A (not tracked)
  KDD          conference  declarative  KDD 2027
  NAACL        conference  declarative  NAACL 2027              ccf-ai:B
  NeurIPS      conference  declarative  NeurIPS 2026            ccf-ai:A
  RA-L         journal     none         —                        (not tracked)
  RSS          conference  declarative  RSS 2026
  Scaling H2R  workshop    declarative  Scaling H2R 2026
  SemTab       workshop    none         —                        (not tracked)
  SIGMOD       conference  declarative  SIGMOD 2027
  SWJ          journal     none         —                        (not tracked)
  TKDE         journal     none         —                        (not tracked)
  TMLR         journal     none         —                        (not tracked)
  TPAMI        journal     none         —                       ccf-ai:A (not tracked)
  VLDB         conference  manual       VLDB 2027 / PVLDB Volume 20
  WWW          conference  declarative  WWW 2027
  · 8 venue(s) have no cfp adapter yet — see docs/adding-a-venue.md

Data
  ✔ data/schedules.json updated 2026-09-10T07:28:43Z · 21/29 tracked venues have data

Reminder channels (google-chat) · 30/15/3/0 days before · ko
  · GOOGLE_CHAT_WEBHOOK_URL is empty. Store the webhook URL as a repository secret (Settings → Secrets and variables → Actions). If you name that secret GOOGLE_CHAT_WEBHOOK_URL, it is picked up as is; if you prefer another name, set the repository *variable* GOOGLE_CHAT_SECRET_NAME to that name. Locally, put GOOGLE_CHAT_WEBHOOK_URL=… in .env.
  · (locally this only means reminders dry-run; in GitHub it is a repository secret — docs/setup-google-chat.md)

Result: ready. Next: npm run refresh && npm run build && npm run dev
```
