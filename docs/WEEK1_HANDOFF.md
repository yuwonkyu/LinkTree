# Week 1 Handoff

## Done in this step

1. Next 16 convention migration (`middleware` -> `proxy`)
2. Supabase schema/RLS/sample seed SQL prepared
3. Route cleanup check performed

## Changed files

- proxy.ts
- supabase/week1_profiles.sql
- WEEK1_HANDOFF.md
- middleware.ts (deleted)

## SQL execution order (Supabase SQL Editor)

1. Run all statements in `supabase/week1_profiles.sql`
2. Verify table and policies
3. Verify sample row with slug `sample-gym`

## What you do next

1. Supabase project creation
- Create a project in Supabase dashboard
- Open SQL Editor and execute `supabase/week1_profiles.sql`

2. `.env.local` values check
- `NEXT_PUBLIC_SUPABASE_URL`: Project Settings -> API -> Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`): Project Settings -> API -> public key

3. Runtime verification
- Run `npm run dev`
- Open `/sample-gym`
- Confirm page rendering and data match expected sample content

4. Auth owner test (dashboard readiness)
- Replace test owner id in SQL with a real `auth.users.id` when needed
- Confirm RLS owner read/update policies work for authenticated owner
