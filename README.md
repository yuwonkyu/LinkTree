# LinkTree

1인 사업자·프리랜서를 위한 링크 페이지 서비스입니다.  
PT 트레이너, 필라테스 강사, 미용실, 프리랜서 등 누구든 링크 하나로 자신을 소개하고 고객 상담까지 연결할 수 있습니다.

## 주요 기능

- 개인 프로필 페이지 (`/username`)
- 서비스·가격 안내
- 카카오톡 상담 연결 CTA
- 인스타그램 링크 연결
- 모바일 우선 반응형 UI
- 다중 테마 지원 (라이트/다크/브랜드 테마)

## 기술 스택

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4
- Vercel

## 테마 가이드

### 현재 지원 테마

- light: 기본 라이트 테마
- dark: 다크 테마
- ucc: 강한 명도·대비 기반 트렌디 테마
- softsage: 필라테스/웰니스에 어울리는 차분한 세이지 테마
- warmlinen: 고급 브랜딩 느낌의 따뜻한 리넨 테마
- energysteel: PT/피트니스용 고대비 스틸 테마

### 고객 데이터에서 테마 적용

사용자 옵션의 theme 값을 지정하면 해당 테마가 적용됩니다.

예시

```ts
options: {
	theme: "softsage",
}
```

테마 값은 다음 타입에 정의되어 있습니다.

- data/mockData.ts 의 ProfileOptions.theme

### 테마 스타일 위치

- 공통 스타일: app/globals.css
- 테마 스타일 모음: app/themes.css
- 테마 클래스 분기: app/[username]/page.tsx

### 새 테마 추가 방법

1. app/themes.css 에 .theme-테마명 블록 추가
2. data/mockData.ts 의 ProfileOptions.theme 유니온 타입에 테마명 추가
3. app/[username]/page.tsx 의 themeClass 분기에 클래스 매핑 추가
4. data/users.ts 의 각 사용자 options.theme 에 테마 지정

### 판매용 템플릿 운영 팁

- 직군별 기본 추천
	- PT: energysteel
	- 필라테스: softsage
	- 프리미엄 브랜딩: warmlinen
- 서비스/후기/CTA/인스타/위치는 데이터가 없으면 자동으로 숨김 처리됩니다.
- 필요 시 options.showServices, options.showReviews, options.showCTA, options.showInstagram, options.showLocation 으로 강제 노출/숨김을 제어할 수 있습니다.

## 저작권 및 사용 제한

본 저장소의 모든 소스코드, 디자인, 문구, 이미지 및 기타 산출물의 저작권은 프로젝트 소유자에게 있습니다.  
무단 복제·배포·수정·재사용 및 상업적 이용을 금지합니다.

All rights reserved. Unauthorized use is strictly prohibited.

## 개발 실행

```bash
npm install
npm run dev
```
