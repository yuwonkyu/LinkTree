-- Week 13: 만족도 피드백 저장 + 구독 갱신 알림 준비

-- 만족도 피드백 기록 테이블 (이메일 링크 클릭 시 저장)
CREATE TABLE IF NOT EXISTS public.feedback_ratings (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug       text NOT NULL,
  rating     text NOT NULL CHECK (rating IN ('good', 'bad')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback_ratings ENABLE ROW LEVEL SECURITY;

-- 일반 사용자 직접 접근 불가 — 서버(service role)만 INSERT/SELECT
CREATE POLICY "feedback_ratings_deny_all"
  ON public.feedback_ratings FOR ALL
  USING (false)
  WITH CHECK (false);
