# Week 4 Handoff — 토스페이먼츠 구독 결제

## 완료 항목

| 파일 | 내용 |
|------|------|
| `supabase/week4_billing.sql` | profiles에 plan/billing_key 컬럼 + subscriptions 테이블 |
| `lib/types.ts` | Plan 타입, PLAN_META, Subscription 타입 추가 |
| `app/billing/page.tsx` | 플랜 선택 페이지 |
| `app/billing/BillingClient.tsx` | 토스 SDK 연동 클라이언트 컴포넌트 |
| `app/billing/success/page.tsx` | authKey→billingKey 교환 + 즉시 결제 + DB 저장 |
| `app/billing/fail/page.tsx` | 결제 실패 안내 |
| `app/api/billing/charge/route.ts` | Vercel Cron 월 1일 자동결제 |
| `app/api/billing/cancel/route.ts` | 구독 취소 API |
| `vercel.json` | Cron 스케줄 (매월 1일 02:00 UTC) |
| `proxy.ts` | /billing 인증 보호 추가 |
| `app/dashboard/page.tsx` | 플랜 카드 + 업그레이드 링크 |

---

## 즉시 실행할 것

### 1. npm install
```bash
npm install @tosspayments/tosspayments-js
```

### 2. Supabase SQL 실행
`supabase/week4_billing.sql` 전체 실행

### 3. .env.local 추가
```
# 토스페이먼츠 (https://developers.tosspayments.com)
NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY=test_ck_...
TOSSPAYMENTS_SECRET_KEY=test_sk_...

# Supabase Service Role (Cron 결제용 — 절대 공개 금지)
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Vercel Cron 인증 (임의 난수 문자열)
CRON_SECRET=your-random-secret-here
```

### 4. Vercel 환경변수에도 동일하게 추가
Vercel 대시보드 → Project Settings → Environment Variables

---

## 토스페이먼츠 설정

1. https://developers.tosspayments.com 가입
2. 테스트 키 발급 (Dashboard → API 키)
   - 클라이언트 키 → `NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY`
   - 시크릿 키 → `TOSSPAYMENTS_SECRET_KEY`
3. 실제 결제 전 테스트 모드로 검증

---

## 결제 흐름

```
사용자 → /billing → 플랜 선택 → 토스 카드 등록 팝업
→ 토스 → /billing/success?authKey=...&plan=basic
→ 서버: authKey → billingKey 교환 (Toss API)
→ 서버: 즉시 첫 결제 실행 (Toss API)
→ 서버: DB 업데이트 (plan, billing_key, subscription 생성)
→ /dashboard (업그레이드 완료)

매월 1일 02:00 UTC:
Vercel Cron → /api/billing/charge
→ active 구독 조회 → billingKey로 자동 결제
→ 성공: next_billing_at 갱신 / 실패: plan → free
```

---

## 테스트 체크리스트

- [ ] `npm run dev` 정상 실행
- [ ] `/billing` 접속 → 3개 플랜 카드 표시
- [ ] Basic 플랜 "시작하기" → 토스 카드 등록 팝업 열림
- [ ] 테스트 카드로 결제 (`4330000000000000`)
- [ ] `/billing/success` → `/dashboard` 리다이렉트
- [ ] 대시보드에서 플랜이 "basic"으로 변경됨 확인
- [ ] Supabase `subscriptions` 테이블에 결제 이력 생성 확인
- [ ] Free 다운그레이드 → plan 초기화 확인

---

## 다음 단계 (5주차)

- `/admin` 관리자 대시보드 (뀨님 전용)
  - 전체 고객 목록
  - 수동 플랜 변경
  - 월별 매출 요약
