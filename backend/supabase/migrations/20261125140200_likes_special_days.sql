-- Hearts (likes) on kudos.
-- One like per user per kudos (primary key). The kudos sender cannot like their own kudos.
-- A like made on an admin-configured special day weighs 2 hearts instead of 1; the weight is
-- stored so that an unlike revokes exactly what was granted.

create table public.special_days (
  day date primary key,
  note text check (note is null or char_length(note) <= 200),
  created_at timestamptz not null default now()
);

create table public.kudos_likes (
  kudos_id uuid not null references public.kudos (id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  weight smallint not null default 1 check (weight in (1, 2)),
  created_at timestamptz not null default now(),
  primary key (kudos_id, user_id)
);

create index kudos_likes_user_id_idx on public.kudos_likes (user_id);

-- Weight is decided by the server clock (Vietnam calendar day), never by the client.
create function public.set_kudos_like_weight()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.weight := case
    when exists (
      select 1 from public.special_days d
      where d.day = (now() at time zone 'Asia/Ho_Chi_Minh')::date
    ) then 2
    else 1
  end;
  new.created_at := now();
  return new;
end;
$$;

revoke execute on function public.set_kudos_like_weight() from public, anon, authenticated;

create trigger kudos_likes_set_weight
before insert on public.kudos_likes
for each row execute function public.set_kudos_like_weight();

alter table public.special_days enable row level security;
alter table public.kudos_likes enable row level security;

revoke all on public.special_days, public.kudos_likes from anon, authenticated;
grant select on public.special_days, public.kudos_likes to authenticated;
grant insert (kudos_id) on public.kudos_likes to authenticated;
grant delete on public.kudos_likes to authenticated;

create policy special_days_select_authenticated on public.special_days
  for select to authenticated using (true);

create policy kudos_likes_select_authenticated on public.kudos_likes
  for select to authenticated using (true);

create policy kudos_likes_insert_own on public.kudos_likes
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and not public.is_kudos_sender(kudos_id)
  );

create policy kudos_likes_delete_own on public.kudos_likes
  for delete to authenticated
  using (user_id = (select auth.uid()));
