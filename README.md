# Trip Wallet — 여행 지출 관리

여행 중 쓴 금액을 기록하고, 카테고리별·날짜별로 한눈에 파악하는 웹 앱입니다.
외화로 기록한 지출을 원화로 환산해 실제 예산을 관리할 수 있습니다.

**[https://trip-wallet-ten.vercel.app](https://trip-wallet-ten.vercel.app)**

---

## 주요 기능

### 지출 기록
- **추가/수정/삭제** — 날짜, 카테고리, 사용처, 금액, 메모 입력
- **날짜별 그룹핑** — 최신 날짜 순으로 정렬된 지출 목록

### 지출 요약
- **총 지출 합산** — 실시간 금액 계산
- **카테고리별 원형 차트** — 식비, 교통, 숙박, 쇼핑, 관광/입장료, 기타
- **비율 표시** — 카테고리별 금액과 전체 대비 %

### 통화 및 환율
- **11개 통화 지원** — KRW, USD, JPY, EUR, GBP, CNY, THB, VND, SGD, HKD, AUD
- **원화 환산** — 외화 선택 시 총 지출의 원화 환산 금액 표시
- **현재 환율 불러오기** — 버튼 한 번으로 실시간 환율 자동 입력
- **직접 입력** — 실제 환전한 환율을 수동으로 입력 가능
- **환율 저장** — 통화별 환율을 기억해 다음에도 유지

### 기타
- **반응형 디자인** — 모바일/PC 모두 최적화
- **데이터 자동 저장** — 브라우저 localStorage, 새로고침 후에도 유지
- **초기화** — 전체 지출 내역 일괄 삭제

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| UI | shadcn/ui + Tailwind CSS |
| Chart | Recharts |
| Package Manager | pnpm |
| Deploy | Vercel |

---

## 로컬 실행

```bash
git clone https://github.com/youngmi14/trip-wallet.git
cd trip-wallet
pnpm install
pnpm dev
```

`http://localhost:5173` 에서 확인

모바일 테스트가 필요한 경우:
```bash
pnpm dev --host
# 출력된 Network 주소를 폰 브라우저에서 접속
```
