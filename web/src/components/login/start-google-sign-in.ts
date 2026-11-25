import type { SignInWithOAuthCredentials } from "@supabase/supabase-js";
import { CALLBACK_PATH, AFTER_LOGIN_PATH, sanitizeNextPath } from "@/lib/auth/auth-paths";
import { createSupabaseBrowserClient } from "@/lib/supabase/create-supabase-browser-client";

export type OAuthClient = {
  auth: {
    signInWithOAuth(
      credentials: SignInWithOAuthCredentials,
    ): Promise<{ error: unknown }>;
  };
};

type StartGoogleSignInOptions = {
  next?: string | null;
  client?: OAuthClient;
  origin?: string;
};

// Starts the Supabase Google OAuth (PKCE) flow. On success the browser leaves
// for Google, so this only resolves just before navigation; it throws when
// Supabase refuses to start the flow.
export async function startGoogleSignIn({
  next,
  client = createSupabaseBrowserClient(),
  origin = window.location.origin,
}: StartGoogleSignInOptions = {}): Promise<void> {
  const redirectTo = new URL(CALLBACK_PATH, origin);
  const safeNext = sanitizeNextPath(next);
  if (next && safeNext !== AFTER_LOGIN_PATH) {
    redirectTo.searchParams.set("next", safeNext);
  }
  const { error } = await client.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: redirectTo.toString() },
  });
  if (error) throw error;
}
