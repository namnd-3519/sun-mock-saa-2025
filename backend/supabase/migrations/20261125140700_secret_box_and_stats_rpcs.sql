-- Secret box opening and the signed-in user's Kudos statistics (Live board sidebar D.1).

-- Maps a uniform number in [0, 1) to a badge. Odds from the "Open secret box" spec:
-- Stay Gold 30%, Flow to Horizon 25%, Touch of Light 20%, Beyond the Boundary 10%,
-- Revival 10%, Root Further 5%.
create function public.pick_secret_badge(p_roll double precision)
returns public.secret_badge
language sql
immutable
set search_path = ''
as $$
  select case
    when p_roll < 0.30 then 'stay_gold'::public.secret_badge
    when p_roll < 0.55 then 'flow_to_horizon'::public.secret_badge
    when p_roll < 0.75 then 'touch_of_light'::public.secret_badge
    when p_roll < 0.85 then 'beyond_the_boundary'::public.secret_badge
    when p_roll < 0.95 then 'revival'::public.secret_badge
    else 'root_further'::public.secret_badge
  end;
$$;

create function public.open_secret_box()
returns table (box_id uuid, badge public.secret_badge)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_box uuid;
  v_badge public.secret_badge := public.pick_secret_badge(random());
begin
  if v_user is null then
    raise exception 'secret_box.not_authenticated' using errcode = '42501';
  end if;

  select b.id into v_box
  from public.secret_boxes b
  where b.owner_id = v_user and b.opened_at is null
  order by b.created_at, b.id
  limit 1
  for update skip locked;

  if v_box is null then
    raise exception 'secret_box.none_unopened' using errcode = 'P0002';
  end if;

  update public.secret_boxes b
  set badge = v_badge, opened_at = now()
  where b.id = v_box;

  return query select v_box, v_badge;
end;
$$;

-- Hearts a user has received. The ONLY place of the attribution rule (spec C.4.1 is
-- ambiguous): today hearts go to the kudos sender. Flip it here in one migration if needed.
create function public.hearts_received_by(p_user_id uuid)
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(sum(l.weight), 0)::bigint
  from public.kudos_likes l
  join public.kudos k on k.id = l.kudos_id
  where k.sender_id = p_user_id;
$$;

create function public.get_my_kudos_stats()
returns table (
  kudos_received bigint,
  kudos_sent bigint,
  hearts_received bigint,
  boxes_opened bigint,
  boxes_unopened bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select count(*) from public.kudos k where k.recipient_id = auth.uid()),
    (select count(*) from public.kudos k where k.sender_id = auth.uid()),
    public.hearts_received_by(auth.uid()),
    (select count(*) from public.secret_boxes b
      where b.owner_id = auth.uid() and b.opened_at is not null),
    (select count(*) from public.secret_boxes b
      where b.owner_id = auth.uid() and b.opened_at is null)
  where auth.uid() is not null;
$$;

revoke execute on function public.hearts_received_by(uuid) from public, anon, authenticated;
revoke execute on function public.pick_secret_badge(double precision) from public, anon;
revoke execute on function public.open_secret_box() from public, anon;
revoke execute on function public.get_my_kudos_stats() from public, anon;
grant execute on function public.pick_secret_badge(double precision) to authenticated;
grant execute on function public.open_secret_box() to authenticated;
grant execute on function public.get_my_kudos_stats() to authenticated;
