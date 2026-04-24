# InstaLink 1주차 작업 지시 프롬프트

# Claude Code 터미널에 아래 내용을 그대로 붙여넣어 실행하세요.

---

## 실행 방법

1. 터미널에서 InstaLink 레포 폴더로 이동
2. `claude` 명령어로 Claude Code 실행
3. 아래 [PROMPT] 내용을 복사해서 붙여넣기

---

[PROMPT]

이 프로젝트는 InstaLink SaaS야. CLAUDE.md를 먼저 읽고 전체 규칙을 파악해줘.

지금 `/sample`, `/sample2` 페이지는 고객 데이터가 하드코딩되어 있어.
이걸 Supabase DB 기반 `/[slug]` 동적 라우팅 구조로 전환하는 게 이번 주 목표야.

아래 순서대로 작업해줘. 각 단계 완료 후 반드시 확인 메시지 출력해줘.

---

### STEP 1 — 의존성 설치 및 환경 확인

```
현재 package.json을 읽고 Supabase가 설치되어 있는지 확인해.
없으면 설치해: npm install @supabase/supabase-js @supabase/ssr
설치 후 현재 Next.js 버전도 알려줘.
```

### STEP 2 — 타입 정의 생성

```
lib/types.ts 파일을 만들고 아래 Profile 타입을 정의해:

export type Service = {
  name: string
  price: string
  note?: string
}

export type Review = {
  text: string
  author: string
}

export type Profile = {
  id: string
  slug: string
  owner_id: string
  name: string
  shop_name: string
  tagline: string
  description?: string
  kakao_url: string
  instagram_id: string
  location: string
  hours: string
  image_url: string
  services: Service[]
  reviews: Review[]
  is_active: boolean
  created_at: string
}
```

### STEP 3 — Supabase 클라이언트 생성

```
lib/supabase.ts 파일을 만들어.
서버 컴포넌트용 클라이언트와 클라이언트 컴포넌트용 클라이언트를 분리해서 작성해.
환경변수는 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 사용.
```

### STEP 4 — ProfilePage 컴포넌트 추출

```
현재 /sample/page.tsx의 UI 구조를 분석해서
components/ProfilePage.tsx 컴포넌트로 추출해.

Props 타입: Profile (lib/types.ts에서 import)
하드코딩된 데이터는 전부 props로 받도록 변경.
디자인·클래스명·구조는 절대 변경하지 마.
```

### STEP 5 — 동적 라우팅 페이지 생성

```
app/[slug]/page.tsx를 생성해.

동작 방식:
1. slug 파라미터로 Supabase profiles 테이블에서 데이터 조회
2. is_active가 false면 "서비스 준비 중" 페이지 반환
3. 데이터 없으면 notFound() 반환
4. 정상이면 ProfilePage 컴포넌트에 데이터 전달

서버 컴포넌트로 작성. generateMetadata도 함께 작성해 (SEO용).
```

### STEP 6 — Supabase SQL 스키마 출력

```
CLAUDE.md의 테이블 구조를 기반으로
Supabase SQL Editor에 바로 붙여넣을 수 있는 CREATE TABLE 쿼리를 출력해줘.
RLS(Row Level Security) 정책도 포함해:
- 공개 페이지: 누구나 is_active=true인 데이터 조회 가능
- 대시보드: owner_id가 본인인 데이터만 수정 가능
```

### STEP 7 — 샘플 데이터 INSERT 쿼리 출력

```
현재 /sample 페이지 데이터를 기반으로
Supabase에 바로 넣을 수 있는 INSERT 쿼리를 만들어줘.
slug는 "sample-gym"으로 설정.
owner_id는 '00000000-0000-0000-0000-000000000000' (테스트용 임시값).
```

---

모든 단계 완료 후:

1. 변경된 파일 목록 출력
2. 다음에 뀨91님이 해야 할 것 목록 출력:
   - Supabase 프로젝트 생성 방법
   - .env.local에 넣을 값 확인 방법
   - SQL 실행 순서

[END PROMPT]

---

## 1주차 완료 후 체크리스트

- [x] `lib/types.ts` 생성됨
- [x] `lib/supabase.ts` 생성됨
- [x] `components/ProfilePage.tsx` 생성됨 (디자인 동일)
- [x] `app/[slug]/page.tsx` 생성됨
- [x] Supabase SQL 쿼리 복사해서 실행함
- [x] `kku-ui.vercel.app/sample-gym` 접속 시 기존 sample 페이지와 동일하게 보임
- [x] `.env.local` 환경변수 입력 완료

---

## 2주차 예고 (에디터 대시보드)

1주차가 완료되면 다음 프롬프트에서 대시보드 에디터 작업을 시작합니다.
사장님이 로그인 후 본인 페이지를 직접 편집하는 UI를 만들 예정이에요.
