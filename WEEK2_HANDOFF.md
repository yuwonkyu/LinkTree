# Week 2 Handoff — Supabase Auth 기반 회원가입/로그인

## Done in this step

1. **Supabase DB 트리거** — 회원가입 시 `profiles` 행 자동 생성
2. **서버 액션** — `signUp` / `signIn` / `signOut`
3. **회원가입 페이지** — `/auth/signup`
4. **로그인 페이지** — `/auth/login`
5. **OAuth/이메일 확인 콜백** — `/auth/callback`
6. **미들웨어 업데이트** — `/dashboard`, `/admin` 접근 시 비로그인이면 로그인으로 리다이렉트
7. **대시보드 기본 페이지** — `/dashboard` (내 페이지 링크 + 준비 중 기능 목록)

## Changed / Created files

| 파일                         | 변경                       |
| ---------------------------- | -------------------------- |
| `supabase/week2_auth.sql`    | 신규 — DB 트리거 + RLS     |
| `app/auth/actions.ts`        | 신규 — 서버 액션           |
| `app/auth/signup/page.tsx`   | 신규                       |
| `app/auth/login/page.tsx`    | 신규                       |
| `app/auth/callback/route.ts` | 신규                       |
| `app/dashboard/layout.tsx`   | 신규 — 보호 레이아웃       |
| `app/dashboard/page.tsx`     | 신규                       |
| `proxy.ts`                   | 수정 — 인증 보호 로직 추가 |

---

## Supabase 설정 (직접 실행 필요)

### 1. SQL 실행

Supabase 대시보드 → SQL Editor에서 `supabase/week2_auth.sql` 전체 실행

> week1_profiles.sql이 이미 실행된 상태여야 합니다.

### 2. 이메일 확인 설정 (선택)

Supabase 대시보드 → Authentication → Email → **Confirm email** 옵션:

- **켜기** (권장): 가입 후 이메일 확인 필요 → `/auth/signup?success=1` 안내 메시지 표시
- **끄기** (빠른 테스트): 가입 즉시 로그인 가능 → `/auth/callback` 거치지 않고 바로 대시보드

### 3. Redirect URL 허용 (이메일 확인 켤 경우)

Supabase 대시보드 → Authentication → URL Configuration:

- **Site URL**: `https://kku-ui.vercel.app` (또는 실제 도메인)
- **Redirect URLs** 추가: `https://kku-ui.vercel.app/auth/callback`

### 4. .env.local 확인

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...  (또는 PUBLISHABLE_KEY)
NEXT_PUBLIC_SITE_URL=https://kku-ui.vercel.app
```

> `NEXT_PUBLIC_SITE_URL`은 대시보드 내 "내 페이지 보기" 링크 생성에 사용됩니다.

---

## 테스트 체크리스트

### 회원가입

- [ ] `http://localhost:3000/auth/signup` 접속
- [ ] 이름·이메일·비밀번호 입력 후 가입하기
- [ ] 이메일 확인 ON → 받은 편지함 확인 → 링크 클릭 → `/dashboard` 이동
- [ ] 이메일 확인 OFF → 가입 직후 `/dashboard` 이동
- [ ] Supabase 대시보드 → Table Editor → `profiles` 테이블에 새 행 생성 확인
  - `owner_id` = 방금 가입한 `auth.users.id`
  - `slug` = `이메일앞부분-1234` 형태
  - `is_active` = `false`

### 로그인

- [ ] `http://localhost:3000/auth/login` 접속
- [ ] 가입한 이메일·비밀번호로 로그인 → `/dashboard` 이동
- [ ] 잘못된 비밀번호 입력 → 오류 메시지 표시

### 라우트 보호

- [ ] 로그아웃 상태에서 `/dashboard` 직접 접속 → `/auth/login?redirectTo=/dashboard` 리다이렉트
- [ ] 로그인 상태에서 `/auth/login` 직접 접속 → `/dashboard` 리다이렉트

### 대시보드

- [ ] 로그인 후 `/dashboard`에서 내 슬러그 URL 확인
- [ ] "내 페이지 보기" 링크 클릭 → 공개 프로필 페이지 이동 (is_active=false이면 준비 중 화면)
- [ ] 우측 상단 "로그아웃" 클릭 → `/auth/login`으로 이동

---

## 다음 단계 (3주차)

- `/dashboard/edit` — 프로필 편집 폼 (이름, 소개, 테마, 서비스·후기 CRUD)
- 편집 저장 시 `is_active = true`로 변경
- 이미지 업로드 (Cloudinary Upload Widget)
- 테마 선택 미리보기 UI
