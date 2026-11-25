-- Realtime publication for kudos_likes: membership and replica identity for DELETE events.
begin;
create extension if not exists pgtap with schema extensions;
select plan(2);

select is(
  (select attnames::text[] from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'kudos_likes'),
  array['kudos_id', 'user_id']::text[],
  'kudos_likes publishes only kudos_id and user_id'
);
select is(
  (select relreplident::text from pg_class where oid = 'public.kudos_likes'::regclass),
  'd',
  'kudos_likes keeps the primary key as replica identity (DELETE events carry kudos_id)'
);

select * from finish();
rollback;
