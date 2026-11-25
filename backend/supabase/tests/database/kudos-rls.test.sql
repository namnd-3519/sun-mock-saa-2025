-- RLS and create_kudos RPC for kudos, hashtags links, images and the kudos_feed view.
begin;
create extension if not exists pgtap with schema extensions;
select plan(22);

insert into auth.users (id, email, aud, role, raw_user_meta_data) values
  ('a1111111-1111-4111-8111-111111111111', 'a@sun.test', 'authenticated', 'authenticated', '{"full_name":"Alice"}'),
  ('b2222222-2222-4222-8222-222222222222', 'b@sun.test', 'authenticated', 'authenticated', '{"full_name":"Bob"}'),
  ('c3333333-3333-4333-8333-333333333333', 'c@sun.test', 'authenticated', 'authenticated', '{"full_name":"Carol"}');

create temp table tags on commit drop as
  select array_agg(id order by name) as ids from public.hashtags;
grant select on tags to authenticated;

-- Alice (A) writes
set local role authenticated;
set local request.jwt.claims = '{"sub":"a1111111-1111-4111-8111-111111111111","role":"authenticated"}';

select lives_ok(
  $$select public.create_kudos(
      'b2222222-2222-4222-8222-222222222222', 'Thanks Bob!',
      (select ids[1:2] from tags),
      array['a1111111-1111-4111-8111-111111111111/one.png',
            'a1111111-1111-4111-8111-111111111111/two.png'])$$,
  'user creates a kudos with hashtags and images'
);
select lives_ok(
  $$select public.create_kudos(
      'c3333333-3333-4333-8333-333333333333', 'Secret thanks',
      (select ids[3:3] from tags), '{}', true, 'A fan')$$,
  'user creates an anonymous kudos'
);
select throws_ok(
  $$select public.create_kudos('a1111111-1111-4111-8111-111111111111', 'me', (select ids[1:1] from tags))$$,
  '22023', 'kudos.invalid_recipient', 'cannot send kudos to self'
);
select throws_ok(
  $$select public.create_kudos('b2222222-2222-4222-8222-222222222222', 'x', '{}')$$,
  '22023', 'kudos.invalid_hashtags', 'at least one hashtag required'
);
select throws_ok(
  $$select public.create_kudos('b2222222-2222-4222-8222-222222222222', 'x', (select ids[1:6] from tags))$$,
  '22023', 'kudos.invalid_hashtags', 'at most five hashtags'
);
select throws_ok(
  $$select public.create_kudos('b2222222-2222-4222-8222-222222222222', 'x',
      array[gen_random_uuid()])$$,
  '22023', 'kudos.invalid_hashtags', 'unknown hashtag rejected'
);
select throws_ok(
  $$select public.create_kudos('b2222222-2222-4222-8222-222222222222', '   ', (select ids[1:1] from tags))$$,
  '22023', 'kudos.invalid_content', 'blank content rejected'
);
select throws_ok(
  $$select public.create_kudos('b2222222-2222-4222-8222-222222222222', 'x', (select ids[1:1] from tags),
      array['b2222222-2222-4222-8222-222222222222/stolen.png'])$$,
  '22023', 'kudos.invalid_images', 'image outside own folder rejected'
);
select throws_ok(
  $$select public.create_kudos('b2222222-2222-4222-8222-222222222222', 'x', (select ids[1:1] from tags),
      '{}', false, 'Name without anonymity')$$,
  '22023', 'kudos.invalid_anonymous_name', 'anonymous name only with anonymous flag'
);
select throws_ok(
  $$insert into public.kudos (sender_id, recipient_id, content)
    values ('a1111111-1111-4111-8111-111111111111', 'b2222222-2222-4222-8222-222222222222', 'direct')$$,
  '42501', null, 'direct insert into kudos denied'
);
select throws_ok(
  $$insert into public.kudos_hashtags (kudos_id, hashtag_id)
    select id, (select ids[5] from tags) from public.kudos limit 1$$,
  '42501', null, 'direct insert into kudos_hashtags denied'
);
select throws_ok(
  $$update public.kudos set content = 'edited'$$, '42501', null, 'update of kudos denied'
);
select is(
  (select is_mine from public.kudos_feed where content = 'Secret thanks'), true,
  'sender sees own anonymous kudos as mine'
);

-- Bob (B) reads
set local request.jwt.claims = '{"sub":"b2222222-2222-4222-8222-222222222222","role":"authenticated"}';

select is((select count(*) from public.kudos where content in ('Thanks Bob!', 'Secret thanks'))::int, 2, 'every user reads every kudos');
select throws_ok(
  $$select sender_id from public.kudos$$, '42501', null, 'kudos.sender_id is not readable'
);
select results_eq(
  $$select sender_id, sender is null, anonymous_name, is_mine from public.kudos_feed
    where content = 'Secret thanks'$$,
  $$values (null::uuid, true, 'A fan'::text, false)$$,
  'feed masks the anonymous sender for others'
);
select is(
  (select sender ->> 'full_name' from public.kudos_feed where content = 'Thanks Bob!'),
  'Alice', 'feed shows a named sender'
);
select results_eq(
  $$select cardinality(hashtag_ids), jsonb_array_length(hashtags), cardinality(image_paths)
    from public.kudos_feed where content = 'Thanks Bob!'$$,
  $$values (2, 2, 2)$$,
  'feed returns hashtags and images'
);
select is(
  (select (recipient ->> 'kudos_received_count')::int from public.kudos_feed
    where content = 'Thanks Bob!'),
  1, 'feed returns the recipient received count'
);
reset role;

-- anon
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
select throws_ok('select count(*) from public.kudos_feed', '42501', null, 'anon cannot read kudos_feed');
select throws_ok('select count(*) from public.kudos', '42501', null, 'anon cannot read kudos');
select throws_ok(
  $$select public.create_kudos('b2222222-2222-4222-8222-222222222222', 'x', '{}')$$,
  '42501', null, 'anon cannot call create_kudos'
);
reset role;

select * from finish();
rollback;
