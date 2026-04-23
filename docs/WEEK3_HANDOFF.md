# Week 3 Handoff — 프로필 편집 대시보드

## Done in this step

1. **theme 컬럼** — `profiles` 테이블에 `theme text default 'light'` 추가
2. **타입 업데이트** — `lib/types.ts`에 `Theme` 타입 + `profile.theme` 필드 추가
3. **공개 페이지 테마 적용** — `app/[slug]/page.tsx`에 `theme-{name}` 클래스 적용
4. **서버 액션** — `saveProfile` (저장 시 `is_active = true`로 공개 전환)
5. **EditForm 클라이언트 컴포넌트** — 기본정보·이미지·테마·서비스·후기 편집 UI
6. **편집 페이지** — `/dashboard/edit` (서버 컴포넌트 → EditForm에 데이터 전달)
7. **대시보드 편집 버튼** — "준비 중" → `/dashboard/edit` 실제 링크로 활성화

## Changed / Created files

| 파일 | 변경 |
|------|------|
| `supabase/week3_theme.sql` | 신규 — theme 컬럼 마이그레이션 |
| `lib/types.ts` | 수정 — Theme 타입 + profile.theme 추가 |
| `app/[slug]/page.tsx` | 수정 — theme 클래스 적용 |
| `app/dashboard/edit/actions.ts` | 신규 — saveProfile 서버 액션 |
| `app/dashboard/edit/EditForm.tsx` | 신규 — 편집 폼 클라이언트 컴포넌트 |
| `app/dashboard/edit/page.tsx` | 신규 — 편집 페이지 |
| `app/dashboard/page.tsx` | 수정 — 편집하기 버튼 활성화 |

---

## Supabase 설정 (직접 실행 필요)

### SQL 실행

Supabase 대시보드 → SQL Editor에서 `supabase/week3_theme.sql` 실행

```sql
alter table public.profiles
  add column if not exists theme text not null default 'light';
```

---

## Cloudinary 설정 (이미지 업로드 사용 시)

### 1. Upload Preset 생성

Cloudinary 대시보드 → Settings → Upload → Upload presets → Add upload preset
- **Preset name**: `instalink_unsigned`
- **Signing Mode**: `Unsigned`
- 저장

### 2. .env.local에 추가

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=디이스티엔오티  (기존 사용 중인 cloud name)
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=instalink_unsigned
```

> 이미지 업로드를 지금 당장 쓰지 않아도 편집 폼 자체는 동작합니다.

---

## 테스트 체크리스트

### 편집 폼

- [ ] `http://localhost:3000/dashboard` → "편집하기" 버튼 클릭
- [ ] `/dashboard/edit` 편집 페이지 진입 확인
- [ ] 기본 정보 (이름, 브랜드명, 한 줄 소개 등) 입력
- [ ] 테마 카드 클릭 → 선택 표시 변경 확인
- [ ] 서비스 추가 → 목록에 나타남 확인
- [ ] 서비스 삭제 → 목록에서 제거 확인
- [ ] 후기 추가 → 목록에 나타남 확인
- [ ] "저장하고 페이지 공개하기" 클릭 → `/dashboard`로 이동

### 공개 페이지 확인

- [ ] 저장 후 `/대시보드에서 내 링크`로 이동
- [ ] 입력한 정보가 공개 페이지에 반영됐는지 확인
- [ ] 선택한 테마가 적용됐는지 확인 (`dark`, `energysteel` 등)
- [ ] Supabase Table Editor → `profiles` → `is_active = true`로 변경됐는지 확인

### 이미지 업로드 (Cloudinary 설정 완료 후)

- [ ] 편집 페이지 → "이미지 업로드" 클릭 → Cloudinary 위젯 열림
- [ ] 이미지 선택 후 업로드 → 미리보기 표시
- [ ] 저장 후 공개 페이지에 이미지 반영 확인

---

## 다음 단계 (4주차)

- 토스페이먼츠 구독 결제 (`/billing`)
- Free / Basic / Pro 플랜 구분
- 빌링키 발급 + Supabase 저장
- Vercel Cron Jobs 자동 결제
