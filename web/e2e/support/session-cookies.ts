import { createServerClient } from "@supabase/ssr";
import type { BrowserContext } from "@playwright/test";
import { readLocalSupabaseEnv } from "./local-supabase-env";

type Cookie = Parameters<BrowserContext["addCookies"]>[0][number];

/**
 * Test-only sign-in: password sign-in with @supabase/ssr in the Playwright (Node) process.
 * The cookies it would set are handed to the browser context, exactly as the app's own
 * OAuth callback would have set them. The app has no route or flag for this.
 */
export async function signInCookies(
  email: string,
  password: string,
  baseURL: string,
): Promise<Cookie[]> {
  const { url, publishableKey } = readLocalSupabaseEnv();
  const jar = new Map<string, string>();
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => [...jar].map(([name, value]) => ({ name, value })),
      setAll: (cookies) => {
        for (const { name, value } of cookies) {
          if (value) jar.set(name, value);
          else jar.delete(name);
        }
      },
    },
  });
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`E2E sign-in failed for ${email}: ${error.message}`);
  if (jar.size === 0) throw new Error("E2E sign-in produced no session cookie");
  const { hostname } = new URL(baseURL);
  return [...jar].map(([name, value]) => ({
    name,
    value,
    domain: hostname,
    path: "/",
    httpOnly: false,
    secure: false,
    sameSite: "Lax" as const,
    expires: Math.floor(Date.now() / 1000) + 3600,
  }));
}
