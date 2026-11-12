-- =====================================================================
-- 울산 스탬프 투어 (STEPLESS IN ULSAN) Supabase 테이블 & 보안 정책(RLS)
-- 프로젝트: Stepless in Ulsan (jkvbbrnlszqavgmixtlz, ap-northeast-2) 적용 완료
-- =====================================================================

create table if not exists public.stamp_reviews (
  id uuid primary key default gen_random_uuid(),
  place_id text not null check (char_length(place_id) between 1 and 80),
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null check (char_length(author_name) between 1 and 40),
  rating smallint not null check (rating >= 1 and rating <= 5),
  comment text not null default '' check (char_length(comment) <= 300),
  created_at timestamptz not null default now()
);

create index if not exists idx_stamp_reviews_place_created
  on public.stamp_reviews (place_id, created_at desc);

create index if not exists idx_stamp_reviews_user_id
  on public.stamp_reviews (user_id);

alter table public.stamp_reviews enable row level security;

create policy "Anyone can read stamp reviews"
  on public.stamp_reviews
  for select
  to anon, authenticated
  using (true);

create policy "Authenticated users can insert own review"
  on public.stamp_reviews
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own review"
  on public.stamp_reviews
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create table if not exists public.user_stamps (
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id text not null check (char_length(place_id) between 1 and 80),
  stamped_at timestamptz not null default now(),
  primary key (user_id, place_id)
);

alter table public.user_stamps enable row level security;

create policy "Users can read own stamps"
  on public.user_stamps
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert own stamps"
  on public.user_stamps
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own stamps"
  on public.user_stamps
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant usage on schema public to anon, authenticated;
grant select on public.stamp_reviews to anon, authenticated;
grant insert, delete on public.stamp_reviews to authenticated;
grant select, insert, update on public.user_stamps to authenticated;
