@AGENTS.md

# InstaLink — 프로젝트 규칙 (에이전트 필독)

## 프로젝트 개요
소상공인(카페·미용실·PT·필라테스 등)을 위한 인스타그램 프로필 링크 랜딩페이지 SaaS.
링크트리 대신 서비스 소개 + 후기 + 카카오 문의까지 한 번에 담는 1페이지 사이트를 제공한다.

## 핵심 목표 (지금 작업 중인 것)
하드코딩된 `/sample`, `/sample2` 페이지 구조를
→ Supabase DB 기반 `/[slug]` 동적 라우팅으로 전환한다.
사장님이 대시보드에서 직접 편집 → 저장 즉시 본인 페이지에 반영되는 셀프서비스 SaaS.

## 기술 스택
- **Framework**: Next.js App Router (TypeScript)
- **DB + Auth**: Supabase
- **이미지**: Cloudinary (현재도 사용 중 — URL 형식 유지)
- **결제**: 토스페이먼츠 (빌링키 방식, 3~4주차 작업)
- **배포**: Vercel

## 디렉토리 규칙
```
app/
  [slug]/          ← 고객 공개 페이지 (동적 라우팅)
    page.tsx
  dashboard/       ← 로그인한 사장님 편집 페이지
    page.tsx
  api/
    profile/       ← Supabase CRUD API
components/
  ProfilePage.tsx  ← 기존 sample 페이지 UI를 컴포넌트화
  Editor.tsx       ← 대시보드 편집 UI
lib/
  supabase.ts      ← Supabase 클라이언트
  types.ts         ← Profile 타입 정의
```

## Supabase 테이블 구조 (profiles)
```sql
id           uuid primary key
slug         text unique not null   -- URL 식별자 (예: "myshop")
owner_id     uuid references auth.users
name         text                   -- 사장님/가게 이름
shop_name    text                   -- 상호명
tagline      text                   -- 한 줄 소개
description  text                   -- 본문 소개
kakao_url    text                   -- 카카오 오픈채팅 링크
instagram_id text                   -- 인스타 아이디
location     text                   -- 위치
hours        text                   -- 운영시간
image_url    text                   -- Cloudinary 이미지 URL
services     jsonb                  -- [{name, price, note}]
reviews      jsonb                  -- [{text, author}]
is_active    boolean default true   -- 결제 상태 연동
created_at   timestamptz default now()
```

## 코드 작성 규칙
- `any` 타입 절대 금지 — 반드시 `lib/types.ts`의 타입 사용
- 고객 데이터를 코드에 하드코딩 금지 — 반드시 DB에서 조회
- 기존 CSS 클래스명·디자인 변경 금지 (UI는 현재 sample 페이지와 동일하게 유지)
- 이미지는 반드시 `next/image`의 `<Image>` 컴포넌트 사용
- Cloudinary URL 이외의 외부 이미지 도메인 추가 금지
- 서버 컴포넌트 기본, 클라이언트 컴포넌트는 `'use client'` 명시
- 환경변수는 `.env.local` 사용, 코드에 키 하드코딩 금지

## 환경변수 목록
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=
```

## 하면 안 되는 것
- `/sample`, `/sample2` 파일 삭제 (레퍼런스용으로 유지)
- 기존 디자인·폰트·색상 변경
- `pages/` 디렉토리 방식으로 롤백
- 불필요한 패키지 추가 (현재 스택으로 해결 가능한 것은 추가 패키지 사용 금지)
