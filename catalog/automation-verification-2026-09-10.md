# ISWC·CoRL·VLDB 자동화 검증 — 2026-09-10

기존 수동 어댑터 3개를 선언형으로 전환했습니다. 공식 페이지의 현재 회차를 매일 다시 읽으며, 새 회차의 날짜를 추정하지 않습니다.

- ISWC: 공식 HTML에서 해시가 바뀌는 앱·연구 모듈을 발견하고 정적 문자열 추출.
- CoRL: 공식 iframe 원본인 data-code 속성의 important_dates 객체를 구문 분석. 원격 코드 실행 없음.
- VLDB: 공식 첫·마지막 날짜, 월별 일자와 시각을 읽어 12개 회차 생성. IANA 서머타임 적용.
- `npm test`: 81개 통과. 기존 수동 VLDB 테스트 1개를 자동화 테스트로 교체하고 원본 변경·실패 복구·허용 호스트·DST 등을 검증.
- `npm run refresh`: 21개 성공, 실패 0개, 날짜 변경 0개. 기존 UID를 유지해 중복 알림을 만들지 않음.
- `npm run validate`: 오류 0개, 기존 예시 이력 보존 경고 26개.
- `npm run build`: 29개 venue, upcoming 33개.
- probe의 강제 종료를 자연 종료로 바꿔 Windows 네트워크 핸들 종료 충돌을 방지. 아래 세 실행 모두 종료 코드 0.
- 추가한 acorn은 코드를 실행하지 않는 JavaScript 구문 분석기입니다. 설치 중 audit 경고는 기존 nodemailer의 높은 심각도 취약점 1개로 확인됐으며, 별도 메이저 업데이트가 필요해 이번 수집 자동화 범위에서는 변경하지 않았습니다.

실패하면 이전 일정을 보존하고 needs-verification으로 표시합니다. ISWC·CoRL의 시각·시간대 문구가 바뀌거나 반복 규칙을 확실히 해석할 수 없으면 성공으로 처리하지 않습니다.

## iswc

`npm run probe -- --venue iswc` (exit 0)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue iswc

ISWC · ISWC 2026 · source ok
  round research (full)
    abstract      dated         2026-05-02T23:59:00-12:00  "2 May 2026"  [verified]
    paper         dated         2026-05-07T23:59:00-12:00  "7 May 2026"  [verified]
    notification  dated         2026-07-16T23:59:00-12:00  "16 July 2026"  [verified]
    camera-ready  dated         2026-08-06T23:59:00-12:00  "6 August 2026"  [verified]
```

## corl

`npm run probe -- --venue corl` (exit 0)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue corl

CoRL · CoRL 2026 · source ok
  round main (full)
    abstract      dated         2026-05-25T23:59:00-12:00  "2026-05-25"  [verified]
    paper         dated         2026-05-28T23:59:00-12:00  "2026-05-28"  [verified]
    camera-ready  dated         2026-10-12T23:59:00-12:00  "2026-10-12"  [verified]
```

## vldb

`npm run probe -- --venue vldb` (exit 0)

```text
> paperradar@1.0.0 probe
> node scripts/probe.mjs --venue vldb

VLDB · VLDB 2027 / PVLDB Volume 20 · source ok
  round month-2026-04 (full)
    abstract      dated         2026-03-25T17:00:00-07:00  "2026-03-25 (official monthly rule)"  [verified]
    paper         dated         2026-04-01T17:00:00-07:00  "2026-04-01 (official monthly rule)"  [verified]
  round month-2026-05 (full)
    abstract      dated         2026-04-25T17:00:00-07:00  "2026-04-25 (official monthly rule)"  [verified]
    paper         dated         2026-05-01T17:00:00-07:00  "2026-05-01 (official monthly rule)"  [verified]
  round month-2026-06 (full)
    abstract      dated         2026-05-25T17:00:00-07:00  "2026-05-25 (official monthly rule)"  [verified]
    paper         dated         2026-06-01T17:00:00-07:00  "2026-06-01 (official monthly rule)"  [verified]
  round month-2026-07 (full)
    abstract      dated         2026-06-25T17:00:00-07:00  "2026-06-25 (official monthly rule)"  [verified]
    paper         dated         2026-07-01T17:00:00-07:00  "2026-07-01 (official monthly rule)"  [verified]
  round month-2026-08 (full)
    abstract      dated         2026-07-25T17:00:00-07:00  "2026-07-25 (official monthly rule)"  [verified]
    paper         dated         2026-08-01T17:00:00-07:00  "2026-08-01 (official monthly rule)"  [verified]
  round month-2026-09 (full)
    abstract      dated         2026-08-25T17:00:00-07:00  "2026-08-25 (official monthly rule)"  [verified]
    paper         dated         2026-09-01T17:00:00-07:00  "2026-09-01 (official monthly rule)"  [verified]
  round month-2026-10 (full)
    abstract      dated         2026-09-25T17:00:00-07:00  "2026-09-25 (official monthly rule)"  [verified]
    paper         dated         2026-10-01T17:00:00-07:00  "2026-10-01 (official monthly rule)"  [verified]
  round month-2026-11 (full)
    abstract      dated         2026-10-25T17:00:00-07:00  "2026-10-25 (official monthly rule)"  [verified]
    paper         dated         2026-11-01T17:00:00-08:00  "2026-11-01 (official monthly rule)"  [verified]
  round month-2026-12 (full)
    abstract      dated         2026-11-25T17:00:00-08:00  "2026-11-25 (official monthly rule)"  [verified]
    paper         dated         2026-12-01T17:00:00-08:00  "2026-12-01 (official monthly rule)"  [verified]
  round month-2027-01 (full)
    abstract      dated         2026-12-25T17:00:00-08:00  "2026-12-25 (official monthly rule)"  [verified]
    paper         dated         2027-01-01T17:00:00-08:00  "2027-01-01 (official monthly rule)"  [verified]
  round month-2027-02 (full)
    abstract      dated         2027-01-25T17:00:00-08:00  "2027-01-25 (official monthly rule)"  [verified]
    paper         dated         2027-02-01T17:00:00-08:00  "2027-02-01 (official monthly rule)"  [verified]
  round month-2027-03 (full)
    abstract      dated         2027-02-25T17:00:00-08:00  "2027-02-25 (official monthly rule)"  [verified]
    paper         dated         2027-03-01T17:00:00-08:00  "2027-03-01 (official monthly rule)"  [verified]
```
