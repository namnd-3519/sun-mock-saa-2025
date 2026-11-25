-- Kudos (thank-you posts), their hashtags and attached images.
-- Writes go through the create_kudos RPC only. Every signed-in user reads every kudos, but
-- kudos.sender_id is not granted to clients: anonymous senders are exposed only through the
-- masking kudos_feed view.

create table public.hashtags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 1 and 50),
  created_at timestamptz not null default now()
);

create table public.kudos (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles (id) on delete cascade,
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  content text not null check (char_length(btrim(content)) between 1 and 5000),
  title text check (title is null or char_length(btrim(title)) between 1 and 100),
  is_anonymous boolean not null default false,
  anonymous_name text check (
    anonymous_name is null
    or (is_anonymous and char_length(btrim(anonymous_name)) between 1 and 50)
  ),
  created_at timestamptz not null default now(),
  constraint kudos_no_self check (sender_id <> recipient_id)
);

create index kudos_sender_id_idx on public.kudos (sender_id);
create index kudos_recipient_id_idx on public.kudos (recipient_id);
create index kudos_created_at_id_idx on public.kudos (created_at desc, id desc);

create table public.kudos_hashtags (
  kudos_id uuid not null references public.kudos (id) on delete cascade,
  hashtag_id uuid not null references public.hashtags (id) on delete restrict,
  primary key (kudos_id, hashtag_id)
);

create index kudos_hashtags_hashtag_id_idx on public.kudos_hashtags (hashtag_id);

create table public.kudos_images (
  id uuid primary key default gen_random_uuid(),
  kudos_id uuid not null references public.kudos (id) on delete cascade,
  storage_path text not null check (char_length(storage_path) between 1 and 512),
  position smallint not null check (position between 0 and 4),
  created_at timestamptz not null default now(),
  unique (kudos_id, position)
);

alter table public.hashtags enable row level security;
alter table public.kudos enable row level security;
alter table public.kudos_hashtags enable row level security;
alter table public.kudos_images enable row level security;

revoke all on public.hashtags, public.kudos, public.kudos_hashtags, public.kudos_images
  from anon, authenticated;

grant select on public.hashtags, public.kudos_hashtags, public.kudos_images to authenticated;
grant select (id, recipient_id, content, title, is_anonymous, anonymous_name, created_at)
  on public.kudos to authenticated;

create policy hashtags_select_authenticated on public.hashtags
  for select to authenticated using (true);

create policy kudos_select_authenticated on public.kudos
  for select to authenticated using (true);

create policy kudos_hashtags_select_authenticated on public.kudos_hashtags
  for select to authenticated using (true);

create policy kudos_images_select_authenticated on public.kudos_images
  for select to authenticated using (true);

-- True when the signed-in user sent the given kudos. Runs as owner because clients cannot read
-- kudos.sender_id.
create function public.is_kudos_sender(p_kudos_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.kudos k
    where k.id = p_kudos_id and k.sender_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_kudos_sender(uuid) from public, anon;
grant execute on function public.is_kudos_sender(uuid) to authenticated;
