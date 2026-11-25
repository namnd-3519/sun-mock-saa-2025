-- Live board: broadcast likes and unlikes through Supabase Realtime for live heart counts.
-- The column list (primary key, needed for DELETE events) is not a security control: Realtime
-- payloads may carry every column granted to authenticated, which is fine since likes are
-- readable by every signed-in user. Clients use the event only for kudos_id and refetch
-- like_count through the kudos_feed view (RLS applies, anon receives nothing).
do $$
begin
  if exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'kudos_likes'
  ) then
    alter publication supabase_realtime drop table public.kudos_likes;
  end if;
  alter publication supabase_realtime add table public.kudos_likes (kudos_id, user_id);
end;
$$;
