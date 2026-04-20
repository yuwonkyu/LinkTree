-- InstaLink Week 2: 회원가입 트리거 + auth 관련 RLS
-- Execute in Supabase SQL Editor (week1_profiles.sql 이후에 실행)

-- ─────────────────────────────────────────────
-- 1. 회원가입 시 profiles 자동 생성 트리거
-- ─────────────────────────────────────────────

-- slug 후보 생성 함수 (이메일 앞부분 + 4자리 랜덤 숫자)
create or replace function public.generate_slug_from_email(email text)
returns text
language plpgsql
as $$
declare
  base text;
  candidate text;
  suffix text;
  attempt int := 0;
begin
  -- 이메일 @ 앞부분만 추출, 영숫자·하이픈만 허용
  base := lower(regexp_replace(split_part(email, '@', 1), '[^a-z0-9]', '-', 'g'));
  base := regexp_replace(base, '-+', '-', 'g');
  base := trim(both '-' from base);
  if length(base) < 2 then
    base := 'user';
  end if;

  loop
    suffix := lpad(floor(random() * 9000 + 1000)::text, 4, '0');
    candidate := base || '-' || suffix;

    exit when not exists (
      select 1 from public.profiles where slug = candidate
    );

    attempt := attempt + 1;
    if attempt > 20 then
      candidate := 'user-' || extract(epoch from now())::bigint::text;
      exit;
    end if;
  end loop;

  return candidate;
end;
$$;

-- 새 auth.users 행 생성 시 profiles 행 자동 생성
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_slug text;
begin
  new_slug := public.generate_slug_from_email(new.email);

  insert into public.profiles (
    id,
    slug,
    owner_id,
    name,
    shop_name,
    tagline,
    services,
    reviews,
    is_active
  ) values (
    gen_random_uuid(),
    new_slug,
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    '',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    false   -- 온보딩 완료 후 true로 변경
  )
  on conflict (owner_id) do nothing;   -- 중복 방지

  return new;
end;
$$;

-- 트리거 등록 (이미 있으면 교체)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ─────────────────────────────────────────────
-- 2. profiles 테이블에 owner_id UNIQUE 제약 추가
--    (1인 1계정 1페이지 구조)
-- ─────────────────────────────────────────────
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_owner_id_unique'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_owner_id_unique unique (owner_id);
  end if;
end $$;


-- ─────────────────────────────────────────────
-- 3. 대시보드용 RLS 확인 (week1에서 이미 설정됐지만 누락 대비)
-- ─────────────────────────────────────────────

-- 본인 row 읽기 (대시보드에서 본인 데이터 조회)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'profiles' and policyname = 'Owner read own profiles'
  ) then
    create policy "Owner read own profiles"
    on public.profiles
    for select
    to authenticated
    using ((select auth.uid()) = owner_id);
  end if;
end $$;

-- 본인 row 수정 (대시보드 저장)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'profiles' and policyname = 'Owner update own profiles'
  ) then
    create policy "Owner update own profiles"
    on public.profiles
    for update
    to authenticated
    using ((select auth.uid()) = owner_id)
    with check ((select auth.uid()) = owner_id);
  end if;
end $$;

-- 본인 row 삽입 (트리거 실패 대비 수동 생성 허용)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'profiles' and policyname = 'Owner insert own profiles'
  ) then
    create policy "Owner insert own profiles"
    on public.profiles
    for insert
    to authenticated
    with check ((select auth.uid()) = owner_id);
  end if;
end $$;
