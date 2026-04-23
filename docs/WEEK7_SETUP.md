# 7주차 완료 — 설정 체크리스트

## 새로 추가된 기능
- ✅ AI 콘텐츠 추천 (태그라인 3개, 소개글, 서비스 목록)
- ✅ SEO OG 이미지 자동 생성 (프로필별 1200×630 썸네일)
- ✅ 가입 30일 만족도 이메일 (매일 09:00 KST 자동 발송)

---

## .env.local 에 추가할 항목

```env
ANTHROPIC_API_KEY=sk-ant-api03-...
```

Anthropic Console → https://console.anthropic.com/settings/keys 에서 발급

---

## Vercel 환경변수 추가

Vercel Dashboard → 프로젝트 → Settings → Environment Variables

| 이름 | 값 |
|------|-----|
| `ANTHROPIC_API_KEY` | sk-ant-api03-... |

추가 후 **Redeploy** 필요.

---

## AI 추천 테스트 방법

1. `/dashboard/edit` 접속
2. "업종" 드롭다운에서 카테고리 선택
3. 태그라인 옆 **✨ AI 추천** 클릭 → 3가지 태그라인 중 하나 선택
4. 소개글 옆 **✨ AI 작성** 클릭 → 소개글 자동 완성
5. 서비스 섹션 **✨ AI로 서비스 목록 채우기** 클릭 → 서비스 3~5개 자동 추가

---

## OG 이미지 확인 방법

브라우저에서 직접 접속:
```
https://your-domain.vercel.app/[slug]/opengraph-image
```

또는 카카오톡에 링크 공유 시 자동으로 썸네일 노출.

---

## Cron 일정

| 엔드포인트 | 주기 | 역할 |
|-----------|------|------|
| `/api/billing/charge` | 매월 1일 02:00 UTC | 자동 결제 |
| `/api/satisfaction` | 매일 09:00 UTC | 30일 만족도 이메일 |
