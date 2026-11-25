-- Notifications generated from Kudos events (MoMorph "Tất cả thông báo").
-- Rows are written only by the triggers below (security definer); users read and mark read
-- their own rows. Payloads are snapshots for display and never carry an anonymous sender.

create type public.notification_type as enum (
  'kudos_received',
  'heart_received',
  'secret_box_available'
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  type public.notification_type not null,
  payload jsonb not null default '{}'::jsonb,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_recipient_created_idx
  on public.notifications (recipient_id, created_at desc, id desc);
create index notifications_recipient_unread_idx
  on public.notifications (recipient_id) where not is_read;
-- One heart notification per (kudos, liker): unlike + like again does not notify twice.
create unique index notifications_heart_once_idx
  on public.notifications (recipient_id, (payload ->> 'kudosId'), (payload ->> 'actorId'))
  where type = 'heart_received';

alter table public.notifications enable row level security;

revoke all on public.notifications from anon, authenticated;
grant select on public.notifications to authenticated;

create policy notifications_select_own on public.notifications
  for select to authenticated
  using (recipient_id = (select auth.uid()));

-- The ONLY place of the hearts attribution rule (spec C.4.1 is ambiguous): today hearts go to
-- the kudos sender. Used by hearts_received_by and the heart_received notification.
create function public.heart_recipient_of(p_kudos_id uuid)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select k.sender_id from public.kudos k where k.id = p_kudos_id;
$$;

create or replace function public.hearts_received_by(p_user_id uuid)
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(sum(l.weight), 0)::bigint
  from public.kudos_likes l
  where public.heart_recipient_of(l.kudos_id) = p_user_id;
$$;

create function public.notify_kudos_received()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text;
begin
  if new.is_anonymous then
    v_name := new.anonymous_name;
  else
    select p.full_name into v_name from public.profiles p where p.id = new.sender_id;
  end if;

  insert into public.notifications (recipient_id, type, payload)
  values (
    new.recipient_id,
    'kudos_received',
    jsonb_build_object('kudosId', new.id, 'isAnonymous', new.is_anonymous, 'senderName', v_name)
  );
  return null;
end;
$$;

create function public.notify_heart_received()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_recipient uuid := public.heart_recipient_of(new.kudos_id);
  v_name text;
begin
  if v_recipient is null or v_recipient = new.user_id then
    return null;
  end if;

  select p.full_name into v_name from public.profiles p where p.id = new.user_id;

  insert into public.notifications (recipient_id, type, payload)
  values (
    v_recipient,
    'heart_received',
    jsonb_build_object('kudosId', new.kudos_id, 'actorId', new.user_id, 'actorName', v_name)
  )
  on conflict (recipient_id, (payload ->> 'kudosId'), (payload ->> 'actorId'))
    where type = 'heart_received'
  do nothing;
  return null;
end;
$$;

create function public.notify_secret_box_available()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.notifications (recipient_id, type, payload)
  values (new.owner_id, 'secret_box_available', jsonb_build_object('boxId', new.id));
  return null;
end;
$$;

create trigger kudos_notify_received
after insert on public.kudos
for each row execute function public.notify_kudos_received();

create trigger kudos_likes_notify_heart
after insert on public.kudos_likes
for each row execute function public.notify_heart_received();

create trigger secret_boxes_notify_available
after insert on public.secret_boxes
for each row execute function public.notify_secret_box_available();

-- Marks one of the signed-in user's notifications read. False when it is not theirs.
create function public.mark_notification_read(p_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.notifications n
  set is_read = true
  where n.id = p_id and n.recipient_id = auth.uid();
  return found;
end;
$$;

-- Marks every unread notification of the signed-in user read; returns how many changed.
create function public.mark_all_notifications_read()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  update public.notifications n
  set is_read = true
  where n.recipient_id = auth.uid() and not n.is_read;
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke execute on function public.heart_recipient_of(uuid) from public, anon, authenticated;
revoke execute on function public.hearts_received_by(uuid) from public, anon, authenticated;
revoke execute on function public.notify_kudos_received() from public, anon, authenticated;
revoke execute on function public.notify_heart_received() from public, anon, authenticated;
revoke execute on function public.notify_secret_box_available() from public, anon, authenticated;
revoke execute on function public.mark_notification_read(uuid) from public, anon;
revoke execute on function public.mark_all_notifications_read() from public, anon;
grant execute on function public.mark_notification_read(uuid) to authenticated;
grant execute on function public.mark_all_notifications_read() to authenticated;

-- The header bell only refetches its count on change, so the payload is not published.
alter publication supabase_realtime
  add table public.notifications (id, recipient_id, is_read, created_at);
