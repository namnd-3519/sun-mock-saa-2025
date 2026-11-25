-- Secret boxes (RLS + open_secret_box), badge odds, my stats and the kudos-images bucket.
begin;
create extension if not exists pgtap with schema extensions;
select plan(19);

insert into auth.users (id, email, aud, role) values
  ('a1111111-1111-4111-8111-111111111111', 'a@sun.test', 'authenticated', 'authenticated'),
  ('b2222222-2222-4222-8222-222222222222', 'b@sun.test', 'authenticated', 'authenticated');

-- Admin grants 2 boxes to Alice, 1 to Bob; Alice sent one kudos that Bob liked.
insert into public.secret_boxes (owner_id, created_at) values
  ('a1111111-1111-4111-8111-111111111111', now() - interval '2 days'),
  ('a1111111-1111-4111-8111-111111111111', now() - interval '1 day'),
  ('b2222222-2222-4222-8222-222222222222', now());
insert into public.kudos (id, sender_id, recipient_id, content) values
  ('d4444444-4444-4444-8444-444444444444', 'a1111111-1111-4111-8111-111111111111',
   'b2222222-2222-4222-8222-222222222222', 'Thanks Bob');
insert into public.kudos_likes (kudos_id, user_id) values
  ('d4444444-4444-4444-8444-444444444444', 'b2222222-2222-4222-8222-222222222222');

select is(public.pick_secret_badge(0.0), 'stay_gold'::public.secret_badge, 'roll 0.00 -> stay_gold');
select is(public.pick_secret_badge(0.2999), 'stay_gold'::public.secret_badge, 'roll 0.30- -> stay_gold');
select is(public.pick_secret_badge(0.30), 'flow_to_horizon'::public.secret_badge, 'roll 0.30 -> flow_to_horizon');
select is(public.pick_secret_badge(0.55), 'touch_of_light'::public.secret_badge, 'roll 0.55 -> touch_of_light');
select is(public.pick_secret_badge(0.75), 'beyond_the_boundary'::public.secret_badge, 'roll 0.75 -> beyond_the_boundary');
select is(public.pick_secret_badge(0.85), 'revival'::public.secret_badge, 'roll 0.85 -> revival');
select is(public.pick_secret_badge(0.95), 'root_further'::public.secret_badge, 'roll 0.95 -> root_further');

set local role authenticated;
set local request.jwt.claims = '{"sub":"a1111111-1111-4111-8111-111111111111","role":"authenticated"}';

select results_eq(
  $$select kudos_received, kudos_sent, hearts_received, boxes_opened, boxes_unopened
    from public.get_my_kudos_stats()$$,
  $$values (0::bigint, 1::bigint, 1::bigint, 0::bigint, 2::bigint)$$,
  'stats before opening (hearts credited to the kudos sender)'
);
select throws_ok(
  $$insert into public.secret_boxes (owner_id) values ('a1111111-1111-4111-8111-111111111111')$$,
  '42501', null, 'user cannot grant themselves a box'
);
select throws_ok(
  $$update public.secret_boxes set badge = 'revival', opened_at = now()$$,
  '42501', null, 'user cannot open a box by direct update'
);
select is(
  (select count(*) from public.secret_boxes where owner_id = 'b2222222-2222-4222-8222-222222222222')::int,
  0, 'another user''s unopened box is invisible'
);
select lives_ok('select * from public.open_secret_box()', 'user opens own box');
select lives_ok('select * from public.open_secret_box()', 'user opens second box');
select throws_ok(
  'select * from public.open_secret_box()', 'P0002', 'secret_box.none_unopened',
  'no unopened box left'
);
select results_eq(
  $$select boxes_opened, boxes_unopened from public.get_my_kudos_stats()$$,
  $$values (2::bigint, 0::bigint)$$,
  'stats after opening'
);

-- Bob sees Alice's opened boxes (latest gift receivers list)
set local request.jwt.claims = '{"sub":"b2222222-2222-4222-8222-222222222222","role":"authenticated"}';
select is(
  (select count(*) from public.secret_boxes
    where owner_id = 'a1111111-1111-4111-8111-111111111111' and badge is not null)::int,
  2, 'opened boxes of others are visible'
);

-- Storage: own folder only
select lives_ok(
  $$insert into storage.objects (bucket_id, name, owner_id)
    values ('kudos-images', 'b2222222-2222-4222-8222-222222222222/pic.png', 'b2222222-2222-4222-8222-222222222222')$$,
  'upload into own folder allowed'
);
select throws_ok(
  $$insert into storage.objects (bucket_id, name)
    values ('kudos-images', 'a1111111-1111-4111-8111-111111111111/pic.png')$$,
  '42501', null, 'upload into another user''s folder denied'
);
reset role;

set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
select is(
  (select count(*) from storage.objects where bucket_id = 'kudos-images')::int, 0,
  'anon cannot read kudos images'
);
reset role;

select * from finish();
rollback;
