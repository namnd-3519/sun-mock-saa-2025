-- create_kudos: the only write path for kudos, their hashtags and images (atomic, validated).
-- Errors are raised with a stable "kudos.<code>" message the web layer maps to UI text.

create function public.create_kudos(
  p_recipient_id uuid,
  p_content text,
  p_hashtag_ids uuid[],
  p_image_paths text[] default '{}',
  p_is_anonymous boolean default false,
  p_anonymous_name text default null,
  p_title text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sender uuid := auth.uid();
  v_hashtags uuid[];
  v_images text[] := coalesce(p_image_paths, '{}');
  v_anonymous_name text := nullif(btrim(coalesce(p_anonymous_name, '')), '');
  v_title text := nullif(btrim(coalesce(p_title, '')), '');
  v_kudos_id uuid;
begin
  if v_sender is null then
    raise exception 'kudos.not_authenticated' using errcode = '42501';
  end if;

  if p_recipient_id is null
    or p_recipient_id = v_sender
    or not exists (select 1 from public.profiles p where p.id = p_recipient_id) then
    raise exception 'kudos.invalid_recipient' using errcode = '22023';
  end if;

  if p_content is null or char_length(btrim(p_content)) not between 1 and 5000 then
    raise exception 'kudos.invalid_content' using errcode = '22023';
  end if;

  select coalesce(array_agg(distinct h), '{}') into v_hashtags
  from unnest(coalesce(p_hashtag_ids, '{}')) as h
  where h is not null;

  if cardinality(v_hashtags) not between 1 and 5
    or (select count(*) from public.hashtags t where t.id = any (v_hashtags))
       <> cardinality(v_hashtags) then
    raise exception 'kudos.invalid_hashtags' using errcode = '22023';
  end if;

  if cardinality(v_images) > 5
    or exists (
      select 1 from unnest(v_images) as path
      where path is null
        or char_length(path) not between 1 and 512
        or split_part(path, '/', 1) <> v_sender::text
        or split_part(path, '/', 2) = ''
    ) then
    raise exception 'kudos.invalid_images' using errcode = '22023';
  end if;

  if (p_is_anonymous and v_anonymous_name is not null and char_length(v_anonymous_name) > 50)
    or (not coalesce(p_is_anonymous, false) and v_anonymous_name is not null) then
    raise exception 'kudos.invalid_anonymous_name' using errcode = '22023';
  end if;

  if v_title is not null and char_length(v_title) > 100 then
    raise exception 'kudos.invalid_title' using errcode = '22023';
  end if;

  insert into public.kudos (
    sender_id, recipient_id, content, title, is_anonymous, anonymous_name
  )
  values (
    v_sender, p_recipient_id, p_content, v_title,
    coalesce(p_is_anonymous, false), v_anonymous_name
  )
  returning id into v_kudos_id;

  insert into public.kudos_hashtags (kudos_id, hashtag_id)
  select v_kudos_id, h from unnest(v_hashtags) as h;

  insert into public.kudos_images (kudos_id, storage_path, position)
  select v_kudos_id, path, (ord - 1)::smallint
  from unnest(v_images) with ordinality as i (path, ord);

  return v_kudos_id;
end;
$$;

revoke execute on function public.create_kudos(uuid, text, uuid[], text[], boolean, text, text)
  from public, anon;
grant execute on function public.create_kudos(uuid, text, uuid[], text[], boolean, text, text)
  to authenticated;
