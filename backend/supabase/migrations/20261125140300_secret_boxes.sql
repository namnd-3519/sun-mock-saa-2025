-- Secret boxes: each box opens once and yields one random badge.
-- Boxes are granted by the service role (admin); users only open their own via the
-- open_secret_box RPC. Opened boxes are public to signed-in users (latest gift receivers list);
-- unopened boxes are visible to their owner only.

create type public.secret_badge as enum (
  'stay_gold',
  'flow_to_horizon',
  'beyond_the_boundary',
  'root_further',
  'touch_of_light',
  'revival'
);

create table public.secret_boxes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  badge public.secret_badge,
  opened_at timestamptz,
  created_at timestamptz not null default now(),
  constraint secret_boxes_opened_consistent check ((badge is null) = (opened_at is null))
);

create index secret_boxes_owner_id_idx on public.secret_boxes (owner_id, opened_at);
create index secret_boxes_opened_at_idx on public.secret_boxes (opened_at desc)
  where opened_at is not null;

alter table public.secret_boxes enable row level security;

revoke all on public.secret_boxes from anon, authenticated;
grant select on public.secret_boxes to authenticated;

create policy secret_boxes_select_own_or_opened on public.secret_boxes
  for select to authenticated
  using (owner_id = (select auth.uid()) or opened_at is not null);
