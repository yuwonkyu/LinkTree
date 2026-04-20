-- InstaLink Week 1: 샘플 데이터 시드
-- week1_profiles.sql 실행 후에 실행하세요.
-- owner_id는 아무 UUID나 넣어도 됩니다 (FK 제약 없음).

insert into public.profiles (
  slug,
  owner_id,
  name,
  shop_name,
  tagline,
  description,
  kakao_url,
  instagram_id,
  location,
  hours,
  image_url,
  services,
  reviews,
  is_active
)
values (
  'sample-gym',
  '00000000-0000-0000-0000-000000000001',
  '뀨 PT',
  'Sample gym',
  '체형교정 · 다이어트 · 1:1 PT',
  E'✔ 체형교정 + 다이어트 전문\n✔ 초보자도 부담 없이 시작 가능',
  'https://open.kakao.com/o/sample',
  'kku._.ui',
  '서울 성수동 샘플빌딩 Sample gym',
  '평일 06:00 ~ 22:00',
  'https://res.cloudinary.com/diicetn0t/image/upload/v1776168782/pt_trainer_bchy7b.png',
  '[
    {"name": "PT 1회", "price": "50,000원"},
    {"name": "PT 10회", "price": "450,000원"}
  ]'::jsonb,
  '[
    {"text": "운동이 처음이었는데 자세를 정말 꼼꼼하게 봐주셔서 부담 없이 시작할 수 있었어요.", "author": "30대 여성 회원"},
    {"text": "퇴근 후에도 일정 조율이 편했고, 짧은 기간에도 몸이 가벼워진 게 느껴졌습니다.", "author": "직장인 회원"}
  ]'::jsonb,
  true
)
on conflict (slug) do update
set
  name        = excluded.name,
  shop_name   = excluded.shop_name,
  tagline     = excluded.tagline,
  description = excluded.description,
  kakao_url   = excluded.kakao_url,
  instagram_id = excluded.instagram_id,
  location    = excluded.location,
  hours       = excluded.hours,
  image_url   = excluded.image_url,
  services    = excluded.services,
  reviews     = excluded.reviews,
  is_active   = excluded.is_active;
