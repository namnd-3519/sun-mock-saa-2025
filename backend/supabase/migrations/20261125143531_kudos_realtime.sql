-- Live board: broadcast new kudos through Supabase Realtime.
-- The publication carries only (id, created_at): sender_id and content never travel over
-- Realtime, whatever the column grants. Clients use the event only for the id and refetch the
-- row through the masking kudos_feed view (RLS applies, anon receives nothing).
-- Re-adding the table replaces any earlier all-columns entry (e.g. one made in the dashboard).
do $$
begin
  if exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'kudos'
  ) then
    alter publication supabase_realtime drop table public.kudos;
  end if;
  alter publication supabase_realtime add table public.kudos (id, created_at);
end;
$$;
