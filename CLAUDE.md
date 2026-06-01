# CLAUDE.md

이 파일은 Claude Code가 이 프로젝트에서 작업할 때 따르는 규칙과 컨텍스트입니다.

---

## 프로젝트 개요

여행 중 쓴 금액을 기록하고, 카테고리별로 한눈에 파악하는 웹 앱입니다.

- **배포**: https://trip-wallet-ten.vercel.app
- **저장소**: https://github.com/youngmi14/trip-wallet

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | React 18 + TypeScript (strict) |
| Build | Vite |
| UI | shadcn/ui + Tailwind CSS v3 |
| Chart | Recharts |
| Package Manager | pnpm |
| 데이터 저장 | localStorage |
| Deploy | Vercel (main 브랜치 push 시 자동 재배포) |

---

## 프로젝트 구조

```
src/
├── App.tsx                  # 루트 컴포넌트, 전역 상태 관리
├── components/
│   ├── ui/                  # shadcn/ui 기본 컴포넌트 (직접 수정 지양)
│   ├── ExpenseForm.tsx      # 지출 추가/수정 다이얼로그
│   ├── ExpenseItem.tsx      # 개별 지출 항목 (React.memo 적용)
│   ├── ExpenseList.tsx      # 날짜별 그룹핑 목록
│   └── SummaryPanel.tsx     # 총액 + 카테고리별 원형 차트
├── hooks/
│   └── useExpenses.ts       # 지출 CRUD + localStorage 연동
├── types/
│   └── index.ts             # 공유 타입, 상수, formatAmount 유틸
└── lib/
    └── utils.ts             # cn() 유틸 (Tailwind 클래스 병합)
```

---

## 공통 명령어

```bash
pnpm dev        # 개발 서버 실행 (http://localhost:5173)
pnpm build      # 프로덕션 빌드 (TypeScript 검사 포함)
pnpm preview    # 빌드 결과 로컬 미리보기
git push        # Vercel 자동 재배포 트리거
```

---

## 코드 규칙

### TypeScript

- `any` 타입 금지 — 불명확한 타입은 `unknown` 사용
- type-only import는 반드시 `import type` 구문 사용
- Props 인터페이스 이름은 `Props`로 통일 (`ComponentNameProps` 형식 사용 금지)
- barrel file(`index.ts`) 금지 — 항상 개별 파일에서 직접 import
- 객체 정의는 `interface` 우선, union/intersection/mapped type은 `type` 사용
- 상수는 `UPPER_CASE`로 명명

### React

- 함수형 컴포넌트만 사용, 클래스 컴포넌트 금지
- 재사용 로직은 커스텀 훅(`src/hooks/`)으로 추출
- 목록 아이템 컴포넌트는 `React.memo` 적용
- 자식 컴포넌트에 전달되는 함수는 `useCallback`으로 참조 안정화
- 비용이 높은 계산은 `useMemo`로 메모이제이션
- list 렌더링 시 `key`는 반드시 안정적인 고유 id 사용 (index 사용 금지)
- Props drilling이 3단계 이상이면 조합(Composition) 패턴 또는 Context 검토

### 코드 품질

- 매직 넘버는 의미 있는 상수명으로 추출
- 복잡한 조건식에는 변수명을 붙여 의도를 드러내기
- 중첩 삼항 연산자 금지 → if문으로 풀어쓰기
- 함수/훅은 하나의 책임만 담당 (Single Responsibility)
- 숨은 부수 효과(side effect) 금지 — 함수 이름·파라미터·반환값으로 드러낼 것
- 함께 수정되는 파일은 같은 디렉토리에 배치

---

## Claude 행동 규칙

- **파일 단위로 변경**: 한 번에 하나의 파일씩 변경하고 확인 기회를 준다
- **요청한 것만 변경**: 명시적으로 요청하지 않은 수정은 하지 않는다
- **기존 코드 보존**: 관련 없는 코드·기능을 건드리지 않는다
- **정보 검증**: 추측하지 않고 코드를 직접 확인한 뒤 작업한다
- **단일 청크 편집**: 같은 파일의 변경은 여러 단계로 나누지 않고 한 번에 제공한다
- **불필요한 확인 금지**: 이미 컨텍스트에 있는 정보를 다시 묻지 않는다
- **변경 요약 금지**: 변경 내용은 diff로 확인 가능하므로 별도 요약하지 않는다

---

## 하지 말아야 할 것

| 금지 사항 | 이유 |
|-----------|------|
| `any` 타입 사용 | 타입 안전성 파괴 |
| `console.log` 커밋 | 프로덕션 코드 오염 |
| 미사용 코드·주석 처리된 코드 커밋 | 코드베이스 오염 |
| barrel file(`index.ts`) 생성 | 불필요한 간접 참조, 번들 최적화 방해 |
| 빌드 에러 상태로 커밋 | `pnpm build` 통과 후에만 커밋 |
| 매직 넘버 직접 사용 | 의도 불명확, 수정 시 누락 위험 |
| 중첩 삼항 연산자 | 가독성 저하 |
| list의 key에 index 사용 | 순서 변경 시 리렌더 버그 유발 |
| 사과 표현 사용 | 불필요한 감정 표현 |
| 변경 내용 요약 작성 | diff로 확인 가능 |

---

## 향후 작업 시 주의사항

| 작업 | 함께 수정해야 할 것 |
|------|-------------------|
| 외부 API 추가 (환율, 날씨 등) | `vercel.json`의 `connect-src`에 해당 도메인 추가 |

**이유:** CSP `connect-src 'self'`로 설정되어 있어 외부 도메인으로의 fetch/XHR 요청이 차단됨.

예) 환율 API 추가 시:
```json
"connect-src 'self' https://api.exchangerate-api.com"
```
