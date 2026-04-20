-- InstaLink Week 1: profiles schema + RLS + sample seed
-- Execute in Supabase SQL Editor

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text,
  shop_name text,
  tagline text,
  description text,
  kakao_url text,
  instagram_id text,
  location text,
  hours text,
  image_url text,
  services jsonb not null default '[]'::jsonb,
  reviews jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists profiles_owner_id_idx on public.profiles (owner_id);
create index if not exists profiles_is_active_idx on public.profiles (is_active);

alter table public.profiles enable row level security;

-- Public profile pages: anyone can read only active profiles
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
    and policyname = 'Public read active profiles'
  ) then
    create policy "Public read active profiles"
    on public.profiles
    for select
    to anon, authenticated
    using (is_active = true);
  end if;
end $$;

-- Dashboard owner reads own rows (required for update to work under RLS)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
    and policyname = 'Owner read own profiles'
  ) then
    create policy "Owner read own profiles"
    on public.profiles
    for select
    to authenticated
    using ((select auth.uid()) = owner_id);
  end if;
end $$;

-- Dashboard owner updates own rows only
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
    and policyname = 'Owner update own profiles'
  ) then
    create policy "Owner update own profiles"
    on public.profiles
    for update
    to authenticated
    using ((select auth.uid()) = owner_id)
    with check ((select auth.uid()) = owner_id);
  end if;
end $$;

-- Allow owners to insert their own rows from dashboard
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
    and policyname = 'Owner insert own profiles'
  ) then
    create policy "Owner insert own profiles"
    on public.profiles
    for insert
    to authenticated
    with check ((select auth.uid()) = owner_id);
  end if;
end $$;

-- Allow owners to delete their own rows
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
    and policyname = 'Owner delete own profiles'
  ) then
    create policy "Owner delete own profiles"
    on public.profiles
    for delete
    to authenticated
    using ((select auth.uid()) = owner_id);
  end if;
end $$;

-- STEP 7 sample data (/sample based)
-- NOTE: Replace owner_id with a real auth.users.id when testing through dashboard.
insert into public.profiles (
  id,
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
  gen_random_uuid(),
  'sample-gym',
  '00000000-0000-0000-0000-000000000000',
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
  owner_id = excluded.owner_id,
  name = excluded.name,
  shop_name = excluded.shop_name,
  tagline = excluded.tagline,
  description = excluded.description,
  kakao_url = excluded.kakao_url,
  instagram_id = excluded.instagram_id,
  location = excluded.location,
  hours = excluded.hours,
  image_url = excluded.image_url,
  services = excluded.services,
  reviews = excluded.reviews,
  is_active = excluded.is_active;
