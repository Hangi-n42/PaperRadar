# 연구 분야 맞춤 카탈로그

2026-09-10에 공식 출처를 확인하여 구성했습니다. 추천 대상은 연구 주제와 CFP의 범위를 대조한 후보이며, 개별 논문의 채택 가능성이나 학회 등급을 보장하지 않습니다.

## 연구 범위

- `column-type-annotation`: 컬럼 유형 주석 / Column Type Annotation
- `semantic-table-interpretation`: 표의 의미 해석 / Semantic Table Interpretation
- `diffusion-models`: 확산 모델 / Diffusion Models
- `hyperspherical-representation-learning`: 초구면 표현학습 / Hyperspherical Representation Learning
- `semantic-dependency-modeling`: 의미 의존 관계 모델링 (데이터·자연어) / Semantic Dependency Modeling (data and language)
- `data-centric-robotics`: 데이터 중심 로보틱스 / Data-Centric Robotics
- `semantic-data-management`: 시맨틱 데이터 관리 / Semantic Data Management
- `multimodal-representation-learning`: 멀티모달 표현학습 / Multimodal Representation Learning

Semantic Dependency Modeling은 데이터 간 의미 관계와 자연어 의미 의존 구문 분석을 모두 포함합니다. 초구면 표현학습은 독립된 학회 분야라기보다 표현학습·기하학적 학습 방법론으로 보아 ICLR, ICML, NeurIPS, JMLR, TMLR, TPAMI에 연결했습니다. 로봇 분야 후보는 데이터·학습·멀티모달 정책을 실제 로봇 문제에 적용하는 연구를 대상으로 합니다.

## 구성

- 학술대회 19개, 저널 7개, 워크숍·챌린지 3개: 총 29개.
- 기존 시스템·에너지 중심 항목 68개를 제거하고 NeurIPS, ICML, ICLR은 재작성했습니다.
- 선언형 어댑터 21개, 일정 미확인 1개, 상시 투고 저널 7개. ISWC·CoRL·VLDB도 자동 갱신합니다.
- 지난 회차의 확인된 날짜는 이력으로 남깁니다. 아직 발표되지 않은 다음 회차 날짜는 추정하지 않습니다.
- `config/radar.yaml`의 8개 분야 선택으로 이 카탈로그 전체를 포함합니다.

| 대상 | 유형 | 추적 회차 | 방식 | 출처 |
|---|---|---|---|---|
| [ACL](venues/acl.json) | conference | ACL 2026 | declarative | [공식 출처](https://2026.aclweb.org/) |
| [COLING](venues/coling.json) | conference | COLING 2027 | declarative | [공식 출처](https://2027.coling-iccl.org/) |
| [NAACL](venues/naacl.json) | conference | NAACL 2027 | declarative | [공식 출처](https://2027.naacl.org/calls/main_conference_papers/) |
| [CIKM](venues/cikm.json) | conference | CIKM 2026 | declarative | [공식 출처](https://cikm2026.diag.uniroma1.it/full-research-papers/) |
| [CoRL](venues/corl.json) | conference | CoRL 2026 | declarative | [공식 출처](https://2026.corl.org/contributions/instruction-for-authors) |
| [CVPR](venues/cvpr.json) | conference | CVPR 2027 | declarative | [공식 출처](https://cvpr.thecvf.com/Conferences/2027/CallForPapers) |
| [EMNLP](venues/emnlp.json) | conference | EMNLP 2026 | declarative | [공식 출처](https://2026.emnlp.org/) |
| [ESWC](venues/eswc.json) | conference | ESWC 2026 | declarative | [공식 출처](https://2026.eswc-conferences.org/calls/papers-research-track/) |
| [ICDE](venues/icde.json) | conference | ICDE 2027 | declarative | [공식 출처](https://icde2027.github.io/important-dates.html) |
| [ICLR](venues/iclr.json) | conference | ICLR 2027 | declarative | [공식 출처](https://iclr.cc/Conferences/2027/AuthorGuidelines) |
| [ICML](venues/icml.json) | conference | ICML 2026 | declarative | [공식 출처](https://icml.cc/Conferences/2026/CallForPapers) |
| [ICRA](venues/icra.json) | conference | ICRA 2027 | declarative | [공식 출처](https://2027.ieee-icra.org/announcements/call-for-technical-papers/) |
| [ISWC](venues/iswc.json) | conference | ISWC 2026 | declarative | [공식 출처](https://iswc2026.semanticweb.org/#/calls/research) |
| [KDD](venues/kdd.json) | conference | KDD 2027 | declarative | [공식 출처](https://kdd2027.kdd.org/research-track-call-for-papers/) |
| [NeurIPS](venues/neurips.json) | conference | NeurIPS 2026 | declarative | [공식 출처](https://neurips.cc/Conferences/2026/CallForPapers) |
| [RSS](venues/rss.json) | conference | RSS 2026 | declarative | [공식 출처](https://roboticsconference.org/information/cfp/) |
| [SIGMOD](venues/sigmod.json) | conference | SIGMOD 2027 | declarative | [공식 출처](https://2027.sigmod.org/calls_papers_sigmod_research.shtml) |
| [VLDB](venues/vldb.json) | conference | VLDB 2027 / PVLDB Volume 20 | declarative | [공식 출처](https://www.vldb.org/2027/submission-guidelines.html) |
| [WWW](venues/www.json) | conference | WWW 2027 | declarative | [공식 출처](https://www2027.thewebconf.org/research-track-papers/) |
| [DMLR](venues/dmlr.json) | journal | — | 상시 투고 | [공식 출처](https://data.mlr.press/) |
| [JMLR](venues/jmlr.json) | journal | — | 상시 투고 | [공식 출처](https://www.jmlr.org/author-info.html) |
| [RA-L](venues/ral.json) | journal | — | 상시 투고 | [공식 출처](https://www.ieee-ras.org/publications/ra-l/ra-l-information-for-authors/) |
| [SWJ](venues/swj.json) | journal | — | 상시 투고 | [공식 출처](https://www.semantic-web-journal.net/authors) |
| [TKDE](venues/tkde.json) | journal | — | 상시 투고 | [공식 출처](https://www.computer.org/digital-library/journals/tk/cfp-ieee-transactions-on-knowledge-data-engineering) |
| [TMLR](venues/tmlr.json) | journal | — | 상시 투고 | [공식 출처](https://www.jmlr.org/tmlr/) |
| [TPAMI](venues/tpami.json) | journal | — | 상시 투고 | [공식 출처](https://www.computer.org/digital-library/journals/tp/cfp-ieee-pattern-analysis-machine-intelligence) |
| [BeNTo](venues/bento.json) | workshop | BeNTo 2026 | declarative | [공식 출처](https://bento-neurips.github.io/) |
| [Scaling H2R](venues/scaling-h2r.json) | workshop | Scaling H2R 2026 | declarative | [공식 출처](https://scaling-h2r-corl.github.io/) |
| [SemTab](venues/semtab.json) | workshop | — | none | [공식 출처](https://www.cs.ox.ac.uk/isg/challenges/sem-tab/) |

## 예외와 유지관리

- ISWC: 공식 HTML → 현재 앱 모듈 → 연구 트랙 모듈의 참조를 매번 따라가고 문자열을 정적으로 읽습니다. 파일명 해시가 바뀌어도 추적하며 코드를 실행하지 않습니다.
- CoRL: 공식 페이지의 `data-code`에 들어 있는 iframe 원본에서 `important_dates` 객체를 읽습니다. JavaScript 구문 분석으로 주석을 제외하며 실행식은 거절합니다.
- VLDB: 공식 월별 규칙의 시작·종료 날짜, 논문일, 전월 초록일, 시각을 매번 읽습니다. 공식 Pacific Time 문구를 확인하고 `America/Los_Angeles`의 날짜별 서머타임을 적용합니다.
- 세 곳 모두 자동 확인 실패 시 이전 날짜를 보존하고 `needs-verification`으로 표시합니다. 지원하지 않는 페이지 구조 변경이나 새 회차의 CFP는 어댑터 수정이 필요할 수 있습니다.
- SemTab: 표·컬럼 주석 벤치마크 챌린지를 기존 유형 체계의 workshop으로 분류했습니다. 공식 시리즈 페이지에서 2026 공지를 확인하지 못해 `adapter: none`으로 두었습니다.
- ICRA: CFP의 PST 표기를 그대로 적용했습니다. IEEE RAS의 다른 안내는 Pacific time이라고 표현하므로 실제 제출 시스템도 확인해야 합니다.
- ICDE: 공식 Pacific Time 17:00을 날짜별 PDT/PST로 환산합니다. 대략적인 일정이라고 명시된 통보일은 제외했습니다.
- BeNTo: 주최 측이 변경 가능한 잠정 일정으로 표시합니다. 확정되지 않은 행사일은 넣지 않았습니다.
- ACL: 2026 회차를 이력으로 등록했습니다. [ACL 2027](https://2027.aclweb.org/)의 투고 날짜는 확인 시점에 TBA입니다.
- NAACL·COLING: ARR 투고와 학회 커밋은 별도 단계입니다. 같은 ARR 회차를 쓰며 두 학회에 동시 커밋할 수 없습니다.
- 저널: 일반 논문은 `submission: rolling`, `cfp: null`입니다. 특집호 마감이나 학회 발표 신청 마감까지 뜻하지 않습니다.
- 연도 전환 규칙은 검증되지 않았으므로 추가하지 않았습니다. 새로운 공식 CFP가 나오면 회차와 어댑터를 갱신해야 합니다.

## 등급 출처

- [CCF 인공지능 분야](https://www.ccf.org.cn/Academic_Evaluation/AI/): `rankings/ccf-ai.json`
- [CCF 데이터베이스·데이터마이닝·정보검색 분야](https://www.ccf.org.cn/Academic_Evaluation/DM_CS/): `rankings/ccf-data.json`

2026-09-10에 각 공식 페이지에 표시된 등급만 전사했습니다. 두 파일은 같은 CCF 체계의 분야별 목록이며, 목록 판본 연도를 임의로 붙이지 않았습니다. 기존 예시 KIISE·CORE·SJR 파일은 교체했습니다. 학회 등급은 정규 논문에 대한 참고 정보로, 단편·Findings·워크숍에 상속하지 않습니다. 이 목록에 등급이 없다는 것은 낮은 등급이라는 뜻이 아닙니다.

## 재검증

```powershell
npm run probe -- --venue iclr
npm run probe -- --venue sigmod
npm run probe -- --venue vldb
npm run refresh
npm run validate
npm test
npm run build
npm run doctor
```

초기 수동 구성 결과는 [초기 검증 보고서](verification-2026-09-10.md)에, 이후 자동화 결과는 [자동화 검증 보고서](automation-verification-2026-09-10.md)에 기록합니다. 스키마와 어댑터 작성 규칙은 [기존 안내](../docs/adding-a-venue.md)를 따릅니다.

기존 `data/` 이력은 손으로 삭제하지 않습니다. `refresh`로 새 일정을 생성하며, 카탈로그에서 제거된 대상의 과거 데이터는 남아 검증 경고가 발생할 수 있습니다. 사이트 선택 대상에서는 제외됩니다.
