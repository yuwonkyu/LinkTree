# InstaLink SaaS 로드맵

> 1인 사업자·프리랜서를 위한 링크 페이지 SaaS  
> 타겟: PT 트레이너 · 필라테스/요가 강사 · 미용실/네일 · 프리랜서 · 카페  
> 목표: 12달 후 월 30~80만원 passive income

---

## 현황 분석 (2026-04-20 기준)

### Week 1 완료(동적 공개 페이지 전환)
- `app/[slug]/page.tsx` 구현 완료
- `components/ProfilePage.tsx` 추출 완료
- `lib/types.ts`, `lib/supabase.ts` 구성 완료
- Supabase SQL/RLS/샘플 데이터 스크립트 작성 완료 (`supabase/week1_profiles.sql`)
- Next.js 16 파일 컨벤션 반영 완료 (`proxy.ts`)

### 잘 된 것
- Next.js App Router + TypeScript 기반 견고한 구조
- 6개 테마 완성 (light, dark, ucc, softsage, warmlinen, energysteel)
- Profile 컴포넌트 재사용 구조 완성
- Cloudinary 이미지 연동 완료
- Vercel 배포 환경 구성 완료
- 실제 고객 샘플 4개 운영 중 (sample, sample2, jhj, kku)

### 남은 것 (SaaS 전환에 필요한 것)
- `users.ts` 정적 데이터 → Supabase DB 마이그레이션
- 회원가입/로그인 (Supabase Auth)
- 고객용 프로필 편집 대시보드
- 토스페이먼츠 월 구독 결제
- 관리자(뀨님) 대시보드

---

## Phase 0 — 인프라 준비 (1~2주)

**목표: DB 스키마 설계 + 환경 세팅 완료**

### Supabase 테이블 설계

```sql
-- 사용자 계정 (Supabase Auth와 연동)
profiles
  id          uuid PK (auth.users.id와 동일)
  email       text
  slug        text UNIQUE  -- URL: instalink.kr/slug
  plan        text         -- 'free' | 'basic' | 'pro'
  plan_expires_at  timestamptz
  billing_key text         -- 토스페이먼츠 빌링키
  created_at  timestamptz

-- 페이지 데이터
pages
  id          uuid PK
  profile_id  uuid FK → profiles.id
  name        text
  brand_name  text
  role        text
  intro       text
  location    text
  availability text
  cta_label   text
  kakao_url   text
  instagram_url text
  instagram_urls text[]
  links       jsonb        -- [{label, url}]
  image_src   text         -- Cloudinary URL
  og_image_src text
  theme       text
  highlight_color text
  options     jsonb        -- showReviews, showServices 등
  updated_at  timestamptz

-- 서비스 목록
services
  id          uuid PK
  page_id     uuid FK → pages.id
  name        text
  price       text
  note        text
  vat         boolean
  sort_order  int

-- 후기
reviews
  id          uuid PK
  page_id     uuid FK → pages.id
  author      text
  content     text
  sort_order  int

-- 구독/결제 이력
subscriptions
  id          uuid PK
  profile_id  uuid FK → profiles.id
  plan        text
  amount      int          -- 원 단위
  status      text         -- 'active' | 'cancelled' | 'failed'
  started_at  timestamptz
  next_billing_at timestamptz
  cancelled_at    timestamptz
```

### 작업 목록
- [ ] Supabase 프로젝트 생성 + 위 스키마 적용
- [ ] `.env.local` 환경변수 설정 (SUPABASE_URL, SUPABASE_ANON_KEY, TOSS_SECRET_KEY 등)
- [ ] `next.config.ts`에 Supabase 도메인 허용 추가
- [ ] Row Level Security(RLS) 정책 설정 (본인 데이터만 수정 가능)
- [ ] GitHub Actions CI 파이프라인 기본 설정

---

## Phase 1 — MVP 런칭 (1~3달)

### 1-1. DB 마이그레이션 (1~2주)

**`users.ts` → Supabase 전환**

현재 `/[username]/page.tsx`에서 `getUserByUsername()` 호출 → Supabase 쿼리로 교체

```typescript
// 변경 전
const user = getUserByUsername(username);

// 변경 후
const { data: user } = await supabase
  .from('pages')
  .select('*, services(*), reviews(*), profiles(plan)')
  .eq('slug', username)
  .single();
```

- [ ] `@/lib/supabase.ts` 클라이언트 생성
- [ ] `/[slug]/page.tsx` DB 조회로 전환
- [ ] 기존 샘플 데이터 Supabase에 시드(seed) 삽입
- [ ] 404 처리 (slug 없으면 not-found 페이지)

---

### 1-2. 회원가입 / 로그인 (1주)

**Supabase Auth 기반 (이메일+비번 또는 카카오 소셜)**

```
/auth/signup   - 회원가입 (이름, 이메일, 비번, 업종 선택)
/auth/login    - 로그인
/auth/callback - OAuth 콜백
```

- [ ] Supabase Auth 이메일 로그인 설정
- [ ] 카카오 소셜 로그인 추가 (고객층이 카카오 친숙)
- [ ] 회원가입 시 `profiles` + `pages` 기본 레코드 자동 생성
- [ ] 미들웨어로 `/dashboard` 보호 (로그인 필요)

---

### 1-3. 온보딩 마법사 (1주)

**가입 직후 3단계 설정**

```
Step 1: 업종 선택
  → PT/헬스 → energysteel 테마 기본 추천
  → 필라테스/요가 → softsage 기본 추천
  → 미용/네일 → warmlinen 기본 추천
  → 카페 → light 기본 추천
  → 프리랜서/크리에이터 → ucc 기본 추천

Step 2: 기본 정보 입력
  → 이름, 브랜드명, 역할, 소개, 위치

Step 3: 링크/연락처 설정
  → 카카오 오픈채팅 URL, 인스타그램 URL
  → 내 페이지 URL 확인: instalink.kr/내slug
```

- [ ] `/onboarding` 멀티스텝 폼 (React state로 단계 관리)
- [ ] 업종별 기본 서비스 템플릿 자동 삽입 (PT → "PT 1회 50,000원" 등)
- [ ] 완료 후 내 페이지 미리보기 링크 제공

---

### 1-4. 프로필 편집 대시보드 (2주)

**고객이 직접 편집하는 `/dashboard`**

```
/dashboard
  ├── 내 페이지 미리보기 (iframe or 새 탭)
  ├── 기본 정보 편집 (이름, 소개, 위치 등)
  ├── 서비스 관리 (추가/수정/삭제/순서 변경)
  ├── 후기 관리 (추가/삭제)
  ├── 이미지 업로드 (Cloudinary 직접 업로드)
  ├── 테마 선택 (6개 테마 미리보기 카드)
  └── 링크/SNS 설정
```

- [ ] `/dashboard` 레이아웃 + 사이드바
- [ ] 서비스 CRUD (drag-and-drop 정렬은 Phase 2에서)
- [ ] Cloudinary Upload Widget 연동 (이미지 직접 업로드)
- [ ] 테마 선택 UI (클릭하면 미리보기 변경)
- [ ] 저장 시 Supabase upsert

---

### 1-5. 토스페이먼츠 구독 결제 (1~2주)

**플랜 설계**

| 플랜 | 가격 | 기능 |
|------|------|------|
| Free | 0원 | 기본 프로필, 1개 테마(light), 서비스 3개까지 |
| Basic | 29,000원/월 | 모든 테마, 서비스 무제한, 후기 무제한 |
| Pro | 49,000원/월 | Basic + 방문자 통계, 멀티 링크, 우선 지원 |

**결제 흐름 (빌링키 방식)**

```
1. /billing 페이지에서 플랜 선택
2. 토스페이먼츠 카드 등록 → 빌링키 발급
3. 서버에서 빌링키 Supabase 저장
4. 매월 자동 결제 (GitHub Actions cron or Vercel cron)
5. 결제 성공 → plan 업데이트 / 실패 → 이메일 알림
```

```
/billing          - 플랜 선택 + 결제 수단 등록
/billing/success  - 결제 완료
/billing/fail     - 결제 실패
/api/billing/issue-key    - 빌링키 발급
/api/billing/charge       - 정기 결제 실행
/api/billing/cancel       - 구독 취소
```

- [ ] 토스페이먼츠 SDK 연동 (`@tosspayments/payment-widget-sdk`)
- [ ] `/api/billing/issue-key` 빌링키 발급 + Supabase 저장
- [ ] `/api/billing/charge` 정기 결제 API
- [ ] Vercel Cron Jobs로 매월 1일 자동 결제
- [ ] 결제 실패 시 이메일 알림 (Resend 사용)
- [ ] 구독 취소 플로우

---

### 1-6. 관리자 대시보드 (1주)

**뀨님 전용 `/admin`**

```
/admin
  ├── 전체 고객 목록 (slug, 플랜, 결제 상태, 가입일)
  ├── 고객 검색 + 필터 (업종별, 플랜별)
  ├── 고객 페이지 직접 편집 (대신 수정해주기)
  ├── 수동 플랜 변경 (무료 체험 부여 등)
  └── 월별 매출 현황
```

- [ ] `/admin` 라우트 (뀨님 이메일만 접근 가능)
- [ ] 전체 고객 목록 테이블
- [ ] 플랜 수동 변경 기능
- [ ] 간단한 매출 요약 카드

---

## Phase 2 — 자동화 확장 (4~8달)

### 에이전트 자동화
- Claude Code + GitHub Actions 파이프라인 구성
- 고객 온보딩 이메일 자동화 (Resend + Vercel cron)
- 결제 실패 재시도 자동화

### 콘텐츠 자동화
- 업종별 서비스 문구 AI 추천 (Claude API)
- 소개글 초안 자동 생성 → 고객 검수만

### SaaS 운영 자동화
- 구독 갱신/취소 알림 자동 발송
- 방문자 통계 대시보드 (Supabase 조회수 트래킹)
- 고객 만족도 자동 수집 (결제 후 30일 이메일)

### 기능 추가
- 예약 링크 연동 (네이버 예약, 카카오 예약)
- 링크 클릭 트래킹 (어느 CTA가 클릭됐는지)
- 커스텀 도메인 연결 (Pro 플랜)

---

## Phase 3 — Passive Income 수확 (9~12달)

### SEO 최적화
- 고객 페이지 자동 OG 이미지 생성 (Vercel OG)
- 구글 검색에 "서울 강남 PT 트레이너 링크" 노출 유도
- 업종별 랜딩페이지 생성 (블로그 SEO 트래픽)

### 수익 확장
- 연 결제 할인 (월 29,000원 → 연 290,000원 = 2달 무료)
- 레퍼럴 프로그램 (소개한 고객이 가입 시 1달 무료)
- 대량 계약 (헬스장 체인 5개 페이지 묶음 할인)

---

## 목표 수익 시뮬레이션

```
6달 목표: 고객 10명
  Basic 7명 × 29,000 = 203,000원
  Pro   3명 × 49,000 = 147,000원
  합계: 350,000원/월

12달 목표: 고객 20~30명
  Basic 15명 × 29,000 = 435,000원
  Pro   10명 × 49,000 = 490,000원
  합계: 925,000원/월 ← 목표 초과 달성 가능
```

---

## 즉시 시작할 작업 순서 (이번 주)

1. **Supabase 프로젝트 생성** + 스키마 적용
2. **`/[slug]/page.tsx`** Supabase 연동으로 교체 (현재 users.ts → DB)
3. **기존 샘플 데이터 seed 삽입** (sample, sample2, jhj, kku)
4. **`.env.local` 설정**

이 4개만 완료하면 현재 서비스는 동일하게 작동하면서 SaaS 기반 완성.
