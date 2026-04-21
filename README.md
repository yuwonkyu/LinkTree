# InstaLink

> 소상공인을 위한 인스타그램 프로필 링크 페이지 SaaS  
> PT 트레이너 · 필라테스 강사 · 헤어 디자이너 · 카페 사장님이  
> **링크 하나**로 서비스 소개 + 가격 + 후기 + 카카오 상담까지 연결합니다.

🔗 **서비스 주소**: [instalink.vercel.app](https://instalink.vercel.app)  
📌 **예시 페이지**: `/sample` · `/sample2` · `/sample3`

---

## 서비스 소개 (SaaS)

| 플랜 | 가격 | 주요 기능 |
|------|------|-----------|
| Free | 무료 | 기본 프로필, 서비스 3개, 후기 3개 |
| Basic | 29,000원/월 | 테마 6종, 무제한 서비스·후기, 방문자 통계 |
| Pro | 49,000원/월 | Basic 전체 + AI 문구 추천, 우선 지원 |

**지원 업종**: PT/헬스 · 필라테스/요가 · 미용실/네일 · 카페 · 프리랜서  
**지원 테마**: light · dark · ucc · softsage · warmlinen · energysteel

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 (CSS variable 기반) |
| DB / Auth | Supabase (PostgreSQL + Row-Level Security) |
| 이미지 | Cloudinary (next/image 연동) |
| 결제 | 토스페이먼츠 (빌링키 방식) |
| 배포 | Vercel |

---

## 디렉토리 구조

```
app/
  page.tsx               ← 랜딩 페이지
  [slug]/page.tsx        ← 공개 프로필 페이지 (동적 라우팅)
  dashboard/             ← 사장님 대시보드
    page.tsx
    edit/
      page.tsx
      EditForm.tsx       ← 편집 폼 (ThemeSelector·ServiceManager·ReviewManager 조합)
      actions.ts         ← Server Actions (saveProfile)
  auth/
    login/page.tsx
    signup/page.tsx
    actions.ts           ← signIn / signUp Server Actions
  billing/               ← 토스페이먼츠 결제
  admin/                 ← 관리자 페이지
  for/[category]/        ← 업종별 SEO 랜딩

components/
  ProfilePage.tsx        ← 공개 프로필 렌더링 컴포넌트
  dashboard/
    ThemeSelector.tsx    ← 테마 선택 UI
    ServiceManager.tsx   ← 서비스 추가·수정·삭제
    ReviewManager.tsx    ← 후기 추가·수정·삭제
  auth/
    AuthCard.tsx         ← 로그인·회원가입 공통 레이아웃

lib/
  types.ts               ← 핵심 타입 (Profile, Service, Review, Theme, Plan …)
  supabase.ts            ← Supabase 클라이언트 (서버/브라우저)

data/
  users.ts               ← 로컬 폴백 샘플 데이터 (Supabase 미연결 시)

supabase/                ← SQL 마이그레이션 (RLS, 트리거, 시드)
```

---

## 로컬 개발 시작

### 1. 환경변수 설정

`.env.local` 파일을 프로젝트 루트에 생성하세요.

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=instalink_unsigned
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. 패키지 설치 및 실행

```bash
npm install
npm run dev
```

### 3. 샘플 페이지 확인

```
http://localhost:3000/sample    # 라이트 테마 — 여성 PT 트레이너
http://localhost:3000/sample2   # 다크 테마  — 필라테스 강사
http://localhost:3000/sample3   # 웜리넨 테마 — 헤어 디자이너
```

> Supabase 미연결 상태에서도 `data/users.ts`의 로컬 폴백 데이터로 위 페이지를 확인할 수 있습니다.

---

## 테마 가이드

### 현재 지원 테마

| ID | 이름 | 어울리는 업종 |
|----|------|---------------|
| `light` | 라이트 | 범용 |
| `dark` | 다크 | 피트니스, 크리에이터 |
| `ucc` | UCC | 강렬한 브랜딩, 크리에이터 |
| `softsage` | 소프트세이지 | 필라테스, 웰니스 |
| `warmlinen` | 웜리넨 | 헤어, 네일, 고급 뷰티 |
| `energysteel` | 에너지스틸 | PT, 스포츠 |

### 새 테마 추가 방법

1. `app/themes.css` 에 `.theme-{name}` 블록 추가
2. `lib/types.ts` 의 `Theme` 유니온에 테마명 추가
3. `components/dashboard/ThemeSelector.tsx` 의 `THEMES` 배열에 항목 추가

---

## Supabase 스키마 요약

```sql
profiles (
  id           uuid primary key,
  slug         text unique,          -- URL 식별자 (/myshop)
  owner_id     uuid,                 -- auth.users 참조
  name         text,
  shop_name    text,
  tagline      text,
  description  text,
  kakao_url    text,
  instagram_id text,
  location     text,
  hours        text,
  image_url    text,                 -- Cloudinary URL
  theme        text,
  plan         text default 'free',
  services     jsonb,               -- [{name, price, note}]
  reviews      jsonb,               -- [{text, author}]
  is_active    boolean default true,
  created_at   timestamptz
)
```

> 전체 SQL (RLS 정책, 트리거, 시드)은 `supabase/` 디렉토리를 참고하세요.

---

## 저작권

본 저장소의 모든 소스코드, 디자인, 문구의 저작권은 프로젝트 소유자에게 있습니다.  
무단 복제·배포·상업적 이용을 금지합니다.

All rights reserved. Unauthorized use is strictly prohibited.
