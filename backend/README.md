# backend

Local Supabase project (database, auth, realtime) in `supabase/`. Run the CLI from this folder:
`supabase start`, `supabase status`, `supabase migration up`. One local instance is shared by
everyone on the machine; do not run `supabase stop` or `supabase db reset` while others use it.

## Enable Google sign-in locally

The web Login screen signs in with Google through Supabase Auth. The provider is configured in
`supabase/config.toml` (`[auth.external.google]`) but ships with `enabled = false`, because
`supabase start` fails when it is enabled without credentials.

1. In Google Cloud Console, create an OAuth client of type **Web application**.
2. Add the authorized redirect URI `http://localhost:54321/auth/v1/callback`
   (also `http://127.0.0.1:54321/auth/v1/callback` if you open the app on 127.0.0.1).
3. Copy `supabase/.env.example` to `supabase/.env` (git-ignored) and set
   `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID` and `SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET`.
4. Set `enabled = true` under `[auth.external.google]` in `supabase/config.toml`.
5. Restart Supabase so Auth picks up the change: `supabase stop && supabase start`
   (tell the other users of the shared instance first).

The web app returns from Google to `http://localhost:3000/auth/callback`, which is covered by
`additional_redirect_urls` in `config.toml`. Any Google account may sign in (no domain limit).

## Kudos data model

Migrations in `supabase/migrations/` create the Kudos schema (profiles, departments, hashtags,
kudos, kudos_hashtags, kudos_images, kudos_likes, special_days, secret_boxes), RLS, the
`create_kudos` / `open_secret_box` / `get_my_kudos_stats` RPCs, the `kudos_feed` view, the
private `kudos-images` bucket and the department/hashtag reference data.

- Apply new migrations: `supabase migration up` (never `db reset` on the shared instance).
- RLS tests (pgTAP, each file rolls back, no data left behind): `supabase test db`, or
  `./scripts/run-db-tests-with-psql.sh` when the pg_prove image cannot be pulled.
- Regenerate web types after a schema change:
  `supabase gen types typescript --local --schema public > ../web/src/lib/supabase/database.types.ts`.

Notes: `kudos.sender_id` and `profiles.email` are not readable by clients; read kudos through
`kudos_feed`, which hides the sender of anonymous kudos. Secret boxes are granted by the service
role only. The hearts-attribution rule lives only in `public.hearts_received_by`.
