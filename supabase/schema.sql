-- ============================================================
-- Study Tracker database
-- Run this whole file once in Supabase: SQL Editor -> New query -> Run.
-- It is safe to run again: it won't duplicate anything or delete data.
-- ============================================================


-- ------------------------------------------------------------
-- 1. Tables
-- ------------------------------------------------------------

-- One row per subject (Biology, Maths, ...).
create table if not exists public.subjects (
  -- Who owns this row. auth.users is Supabase's built-in list of accounts.
  -- "default auth.uid()" fills it in with the logged-in user automatically.
  -- "on delete cascade": if the account is deleted, its subjects go too.
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- The id the app creates (crypto.randomUUID()).
  id text not null check (char_length(id) between 1 and 64),
  name text not null check (char_length(name) between 1 and 40),
  color text not null check (color ~ '^#[0-9A-Fa-f]{6}$'),
  weekly_goal_hours numeric not null default 0 check (weekly_goal_hours between 0 and 100),
  created_at timestamptz not null default now(),
  -- A row is identified by (owner + id), so two accounts can never clash.
  primary key (user_id, id)
);

-- One row per finished study session.
create table if not exists public.sessions (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id text not null check (char_length(id) between 1 and 64),
  subject_id text not null,
  started_at timestamptz not null,
  ended_at timestamptz not null,
  primary key (user_id, id),
  check (ended_at >= started_at),
  -- The session's subject must belong to the SAME user.
  -- Deleting a subject also deletes its sessions (like the app does today).
  foreign key (user_id, subject_id) references public.subjects (user_id, id) on delete cascade
);

-- Makes "delete a subject and its sessions" fast.
create index if not exists sessions_user_subject_idx on public.sessions (user_id, subject_id);


-- ------------------------------------------------------------
-- 2. Who may use the tables at all
-- ------------------------------------------------------------
-- "authenticated" = someone who is logged in. "anon" = not logged in.
-- Logged-out visitors get no access at all.
revoke all on public.subjects, public.sessions from anon;
grant select, insert, update, delete on public.subjects, public.sessions to authenticated;


-- ------------------------------------------------------------
-- 3. Row Level Security (RLS): which ROWS each user may touch
-- ------------------------------------------------------------
-- With RLS on, every row is hidden unless a policy below allows it.
alter table public.subjects enable row level security;
alter table public.sessions enable row level security;

-- auth.uid() is the id of the user making the request.
-- "using"      = which existing rows you can see / change / delete.
-- "with check" = what a new or changed row must look like to be saved.
-- (select auth.uid()) is written this way so Postgres works it out once
-- per request instead of once per row: same result, faster.

-- subjects
drop policy if exists "Users can view their own subjects" on public.subjects;
create policy "Users can view their own subjects"
  on public.subjects for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can add their own subjects" on public.subjects;
create policy "Users can add their own subjects"
  on public.subjects for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own subjects" on public.subjects;
create policy "Users can update their own subjects"
  on public.subjects for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own subjects" on public.subjects;
create policy "Users can delete their own subjects"
  on public.subjects for delete to authenticated
  using ((select auth.uid()) = user_id);

-- sessions
drop policy if exists "Users can view their own sessions" on public.sessions;
create policy "Users can view their own sessions"
  on public.sessions for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can add their own sessions" on public.sessions;
create policy "Users can add their own sessions"
  on public.sessions for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own sessions" on public.sessions;
create policy "Users can update their own sessions"
  on public.sessions for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own sessions" on public.sessions;
create policy "Users can delete their own sessions"
  on public.sessions for delete to authenticated
  using ((select auth.uid()) = user_id);
