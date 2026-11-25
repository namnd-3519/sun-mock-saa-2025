-- RLS for kudos_likes: one like per user per kudos, no self-like, weight from special days.
begin;
create extension if not exists pgtap with schema extensions;
select plan(13);

insert into auth.users (id, email, aud, role) values
  ('a1111111-1111-4111-8111-111111111111', 'a@sun.test', 'authenticated', 'authenticated'),
  ('b2222222-2222-4222-8222-222222222222', 'b@sun.test', 'authenticated', 'authenticated'),
  ('c3333333-3333-4333-8333-333333333333', 'c@sun.test', 'authenticated', 'authenticated');

-- Alice -> Bob kudos (inserted as owner for setup)
insert into public.kudos (id, sender_id, recipient_id, content) values
  ('d4444444-4444-4444-8444-444444444444', 'a1111111-1111-4111-8111-111111111111',
   'b2222222-2222-4222-8222-222222222222', 'Thanks Bob');

set local role authenticated;
set local request.jwt.claims = '{"sub":"b2222222-2222-4222-8222-222222222222","role":"authenticated"}';

select lives_ok(
  $$insert into public.kudos_likes (kudos_id) values ('d4444444-4444-4444-8444-444444444444')$$,
  'recipient likes the kudos'
);
select throws_ok(
  $$insert into public.kudos_likes (kudos_id) values ('d4444444-4444-4444-8444-444444444444')$$,
  '23505', null, 'second like by the same user is rejected'
);
select throws_ok(
  $$insert into public.kudos_likes (kudos_id, user_id)
    values ('d4444444-4444-4444-8444-444444444444', 'c3333333-3333-4333-8333-333333333333')$$,
  '42501', null, 'cannot like on behalf of another user'
);
select throws_ok(
  $$insert into public.kudos_likes (kudos_id, weight) values ('d4444444-4444-4444-8444-444444444444', 2)$$,
  '42501', null, 'client cannot choose the like weight'
);
select is(
  (select weight from public.kudos_likes where user_id = 'b2222222-2222-4222-8222-222222222222'),
  1::smallint, 'normal day like weighs 1'
);
select throws_ok(
  $$update public.kudos_likes set weight = 2$$, '42501', null, 'likes cannot be updated'
);
select results_eq(
  $$select like_count, liked_by_me from public.kudos_feed
    where id = 'd4444444-4444-4444-8444-444444444444'$$,
  $$values (1::bigint, true)$$,
  'feed shows like count and liked_by_me'
);

-- Alice is the sender: self-like denied, cannot remove Bob's like
set local request.jwt.claims = '{"sub":"a1111111-1111-4111-8111-111111111111","role":"authenticated"}';
select throws_ok(
  $$insert into public.kudos_likes (kudos_id) values ('d4444444-4444-4444-8444-444444444444')$$,
  '42501', null, 'sender cannot like own kudos'
);
delete from public.kudos_likes where kudos_id = 'd4444444-4444-4444-8444-444444444444';
select is(
  (select count(*) from public.kudos_likes where kudos_id = 'd4444444-4444-4444-8444-444444444444')::int,
  1, 'cannot delete another user''s like'
);
reset role;

-- Special day: Carol's like weighs 2
insert into public.special_days (day) values ((now() at time zone 'Asia/Ho_Chi_Minh')::date)
on conflict (day) do nothing;
set local role authenticated;
set local request.jwt.claims = '{"sub":"c3333333-3333-4333-8333-333333333333","role":"authenticated"}';
insert into public.kudos_likes (kudos_id) values ('d4444444-4444-4444-8444-444444444444');
select is(
  (select weight from public.kudos_likes where user_id = 'c3333333-3333-4333-8333-333333333333'),
  2::smallint, 'special day like weighs 2'
);
select throws_ok(
  $$insert into public.special_days (day) values ('2030-01-01')$$,
  '42501', null, 'users cannot configure special days'
);

-- Bob unlikes
set local request.jwt.claims = '{"sub":"b2222222-2222-4222-8222-222222222222","role":"authenticated"}';
delete from public.kudos_likes where kudos_id = 'd4444444-4444-4444-8444-444444444444';
select is(
  (select count(*) from public.kudos_likes where kudos_id = 'd4444444-4444-4444-8444-444444444444')::int,
  1, 'user removes own like only'
);
reset role;

set local role anon;
select throws_ok('select count(*) from public.kudos_likes', '42501', null, 'anon cannot read likes');
reset role;

select * from finish();
rollback;
