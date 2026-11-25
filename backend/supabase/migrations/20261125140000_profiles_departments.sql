-- Departments and user profiles for Sun* Kudos.
-- A profile row is created for every auth user (Google sign-in) by trigger.

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (char_length(code) between 1 and 100),
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text check (full_name is null or char_length(full_name) <= 200),
  avatar_url text check (avatar_url is null or char_length(avatar_url) <= 2048),
  department_id uuid references public.departments (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_department_id_idx on public.profiles (department_id);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  )
  on conflict (id) do nothing;
  return new;
exception when others then
  -- A profile problem must never block sign-in; log it and let the auth insert succeed.
  raise warning 'handle_new_user failed for %: %', new.id, sqlerrm;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Backfill users who signed in before this migration.
insert into public.profiles (id, email, full_name, avatar_url)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name'),
  coalesce(u.raw_user_meta_data ->> 'avatar_url', u.raw_user_meta_data ->> 'picture')
from auth.users u
on conflict (id) do nothing;

-- RLS: signed-in users read everything; they may only edit a few columns of their own row.
alter table public.departments enable row level security;
alter table public.profiles enable row level security;

revoke all on public.departments, public.profiles from anon, authenticated;
grant select on public.departments to authenticated;
-- email is personal data no screen shows for other users; a user's own email is in the session.
grant select (id, full_name, avatar_url, department_id, created_at, updated_at)
  on public.profiles to authenticated;
grant update (full_name, avatar_url, department_id) on public.profiles to authenticated;

create policy departments_select_authenticated on public.departments
  for select to authenticated using (true);

create policy profiles_select_authenticated on public.profiles
  for select to authenticated using (true);

create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));
