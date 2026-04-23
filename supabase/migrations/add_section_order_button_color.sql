-- 섹션 순서 커스텀 (Pro 전용) + 버튼 컬러 커스텀 (Pro 전용) 컬럼 추가
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS section_order text[]  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS button_color  text    DEFAULT NULL;
