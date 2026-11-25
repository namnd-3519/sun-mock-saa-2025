-- RLS for profiles, departments and hashtags: allowed and denied paths.
begin;
create extension if not exists pgtap with schema extensions;
select plan(17);

insert into auth.users (id, email, aud, role, raw_user_meta_data) values
  ('a1111111-1111-4111-8111-111111111111', 'a@sun.test', 'authenticated', 'authenticated',
   '{"full_name":"Alice A","avatar_url":"https://img.test/a.png"}'),
  ('b2222222-2222-4222-8222-222222222222', 'b@sun.test', 'authenticated', 'authenticated',
   '{"name":"Bob B","picture":"https://img.test/b.png"}');

select results_eq(
  $$select full_name, avatar_url from public.profiles
    where id = 'a1111111-1111-4111-8111-111111111111'$$,
  $$values ('Alice A'::text, 'https://img.test/a.png'::text)$$,
  'trigger creates a profile from full_name/avatar_url metadata'
);
select results_eq(
  $$select full_name, avatar_url from public.profiles
    where id = 'b2222222-2222-4222-8222-222222222222'$$,
  $$values ('Bob B'::text, 'https://img.test/b.png'::text)$$,
  'trigger falls back to name/picture metadata'
);

select lives_ok(
  $$insert into auth.users (id, email, aud, role)
    values ('c3333333-3333-4333-8333-333333333333', null, 'authenticated', 'authenticated')$$,
  'sign-up without metadata or email does not raise'
);
select ok(
  exists (select 1 from public.profiles where id = 'c3333333-3333-4333-8333-333333333333'
          and full_name is null),
  'profile created with empty name when metadata is missing'
);
select lives_ok(
  $$insert into public.profiles (id) values ('a1111111-1111-4111-8111-111111111111')
    on conflict (id) do nothing$$,
  'existing profile is kept on a repeated insert path'
);
-- -------------------------------------------------------------------------
-- anon sees nothing
set local role anon;
select throws_ok('select count(*) from public.profiles', '42501', null, 'anon cannot read profiles');
select throws_ok('select count(*) from public.departments', '42501', null, 'anon cannot read departments');
select throws_ok('select count(*) from public.hashtags', '42501', null, 'anon cannot read hashtags');
reset role;

-- signed in as Alice
set local role authenticated;
set local request.jwt.claims = '{"sub":"a1111111-1111-4111-8111-111111111111","role":"authenticated"}';

select ok((select count(*) >= 2 from public.profiles), 'authenticated reads all profiles');
select throws_ok(
  $$select email from public.profiles$$, '42501', null,
  'authenticated cannot read profile emails'
);
select ok((select count(*) = 50 from public.departments where code in (
  select code from public.departments)), 'authenticated reads seeded departments');
select ok((select count(*) >= 10 from public.hashtags), 'authenticated reads seeded hashtags');

select lives_ok(
  $$update public.profiles
      set full_name = 'Alice Updated',
          department_id = (select id from public.departments where code = 'CEVC2')
    where id = 'a1111111-1111-4111-8111-111111111111'$$,
  'user updates own name and department'
);
update public.profiles set full_name = 'Hacked' where id = 'b2222222-2222-4222-8222-222222222222';
select throws_ok(
  $$update public.profiles set email = 'x@evil.test'
    where id = 'a1111111-1111-4111-8111-111111111111'$$,
  '42501', null, 'user cannot change own email'
);
select throws_ok(
  $$insert into public.hashtags (name) values ('NewTag')$$,
  '42501', null, 'user cannot create hashtags'
);
select throws_ok(
  $$delete from public.departments$$, '42501', null, 'user cannot delete departments'
);
reset role;

select results_eq(
  $$select full_name from public.profiles where id in (
      'a1111111-1111-4111-8111-111111111111', 'b2222222-2222-4222-8222-222222222222')
    order by email$$,
  $$values ('Alice Updated'::text), ('Bob B'::text)$$,
  'own update applied, update of another profile matched no row'
);

select * from finish();
rollback;
