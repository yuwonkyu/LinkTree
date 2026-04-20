-- InstaLink Week 6: 방문자 통계
-- profiles에 view_count 추가 + anon이 호출 가능한 RPC 함수

alter table public.profiles
  add column if not exists view_count int not null default 0;

-- anon/authenticated 누구나 호출 가능한 조회수 증가 함수
create or replace function public.increment_view_count(profile_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles
  set view_count = view_count + 1
  where slug = profile_slug and is_active = true;
$$;

grant execute on function public.increment_view_count(text) to anon, authenticated;
