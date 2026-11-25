-- kudos_feed: read model for the Live board, Profile and kudos detail.
-- Runs with the owner's rights (not security_invoker) so it can read kudos.sender_id, and masks
-- it for anonymous kudos unless the viewer is the sender. Only signed-in users may select it.

create function public.kudos_person_json(p_profile_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'id', p.id,
    'full_name', p.full_name,
    'avatar_url', p.avatar_url,
    'department_code', d.code,
    'kudos_received_count',
      (select count(*) from public.kudos r where r.recipient_id = p.id)
  )
  from public.profiles p
  left join public.departments d on d.id = p.department_id
  where p.id = p_profile_id;
$$;

revoke execute on function public.kudos_person_json(uuid) from public, anon;
grant execute on function public.kudos_person_json(uuid) to authenticated;

create view public.kudos_feed
with (security_barrier = true)
as
select
  k.id,
  k.created_at,
  k.content,
  k.title,
  k.is_anonymous,
  k.anonymous_name,
  (k.sender_id = auth.uid()) as is_mine,
  case
    when k.is_anonymous and k.sender_id is distinct from auth.uid() then null
    else k.sender_id
  end as sender_id,
  case
    when k.is_anonymous and k.sender_id is distinct from auth.uid() then null
    else public.kudos_person_json(k.sender_id)
  end as sender,
  k.recipient_id,
  public.kudos_person_json(k.recipient_id) as recipient,
  rp.department_id as recipient_department_id,
  coalesce(
    (select jsonb_agg(jsonb_build_object('id', h.id, 'name', h.name) order by h.name)
       from public.kudos_hashtags kh
       join public.hashtags h on h.id = kh.hashtag_id
      where kh.kudos_id = k.id),
    '[]'::jsonb
  ) as hashtags,
  coalesce(
    (select array_agg(kh.hashtag_id) from public.kudos_hashtags kh where kh.kudos_id = k.id),
    '{}'::uuid[]
  ) as hashtag_ids,
  coalesce(
    (select array_agg(i.storage_path order by i.position)
       from public.kudos_images i where i.kudos_id = k.id),
    '{}'::text[]
  ) as image_paths,
  (select count(*) from public.kudos_likes l where l.kudos_id = k.id) as like_count,
  exists (
    select 1 from public.kudos_likes l
    where l.kudos_id = k.id and l.user_id = auth.uid()
  ) as liked_by_me
from public.kudos k
join public.profiles rp on rp.id = k.recipient_id
where auth.uid() is not null;

revoke all on public.kudos_feed from public, anon, authenticated;
grant select on public.kudos_feed to authenticated;
