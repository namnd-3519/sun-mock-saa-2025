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
