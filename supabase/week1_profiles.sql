-- InstaLink Week 1: profiles schema + RLS
-- Execute in Supabase SQL Editor

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────
-- 1. profiles 테이블
-- ─────────────────────────────────────────────
-- owner_id는 RLS에서 auth.uid()로 보호하므로 FK 제약 없이 uuid만 저장합니다.
-- (FK를 걸면 샘플 데이터 삽입 시 auth.users에 실제 유저가 있어야 해서 불편합니다.)

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  owner_id uuid not null,
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

-- ─────────────────────────────────────────────
-- 2. RLS 정책
-- ─────────────────────────────────────────────

-- 공개 읽기: is_active = true인 프로필은 누구나 조회 가능
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

-- 본인 프로필 읽기 (대시보드에서 본인 데이터 조회, is_active 무관)
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

-- 본인 프로필 수정
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

-- 본인 프로필 삽입 (회원가입 트리거 보완용)
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

-- 본인 프로필 삭제
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
