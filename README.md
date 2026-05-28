# Trip Wallet — 여행 지출 관리

여행 중 쓴 금액을 기록하고, 카테고리별로 한눈에 파악하는 웹 앱입니다.

**[https://trip-wallet-ten.vercel.app](https://trip-wallet-ten.vercel.app)**

---

## 주요 기능

- **지출 추가/수정/삭제** — 날짜, 카테고리, 사용처, 금액, 메모 입력
- **날짜별 그룹핑** — 날짜 순으로 정렬된 지출 목록
- **카테고리별 원형 차트** — 식비, 교통, 숙박, 쇼핑, 관광/입장료, 기타
- **총 지출 합산** — 실시간 금액 계산
- **11개 통화 지원** — KRW, USD, JPY, EUR, GBP, CNY, THB, VND, SGD, HKD, AUD
- **데이터 영속화** — 브라우저 localStorage에 자동 저장

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| UI | shadcn/ui + Tailwind CSS |
| Chart | Recharts |
| Deploy | Vercel |

## 로컬 실행

```bash
git clone https://github.com/youngmi14/trip-wallet.git
cd trip-wallet
pnpm install
pnpm dev
```

`http://localhost:5173` 에서 확인
