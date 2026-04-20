-- Week 12: 연간 결제 + 레퍼럴 프로그램

-- subscriptions 테이블에 billing_period 컬럼 추가 (monthly | annual)
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS billing_period text NOT NULL DEFAULT 'monthly'
    CHECK (billing_period IN ('monthly', 'annual'));

-- profiles 테이블에 referral_code, referred_by 컬럼 추가
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by   text;  -- 가입 시 입력한 추천인 코드

-- 기존 유저에게 랜덤 8자리 코드 자동 생성
UPDATE public.profiles
SET referral_code = upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8))
WHERE referral_code IS NULL;

-- 레퍼럴 이벤트 기록 테이블
CREATE TABLE IF NOT EXISTS public.referral_events (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referee_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reward_given  boolean NOT NULL DEFAULT false,  -- 추천인에게 1개월 무료 지급 여부
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.referral_events ENABLE ROW LEVEL SECURITY;

-- 본인이 추천한 이벤트만 조회 가능
CREATE POLICY "referral_events_select_own"
  ON public.referral_events FOR SELECT
  USING (
    referrer_id IN (
      SELECT id FROM public.profiles WHERE owner_id = auth.uid()
    )
  );

-- 서비스 롤(API)만 INSERT 가능 (클라이언트 직접 삽입 방지)
CREATE POLICY "referral_events_insert_service"
  ON public.referral_events FOR INSERT
  WITH CHECK (false);  -- anon/authenticated 직접 INSERT 불가 → service role만 가능
