import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { resolveAuthRedirect } from "@/lib/auth/resolve-auth-redirect";
import { readSupabaseEnv } from "./supabase-env";

// Refreshes the Supabase session cookies on every page request and applies
// the route guard. Pattern from the Supabase SSR guide for Next.js proxy.
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const { url, publishableKey } = readSupabaseEnv();
  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet, headers) => {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        for (const [key, value] of Object.entries(headers ?? {})) {
          response.headers.set(key, value);
        }
      },
    },
  });

  // getClaims verifies the JWT and refreshes an expired session.
  const { data } = await supabase.auth.getClaims();
  const target = resolveAuthRedirect({
    pathname: request.nextUrl.pathname,
    search: request.nextUrl.search,
    isSignedIn: Boolean(data?.claims?.sub),
  });
  if (!target) return response;

  const redirect = NextResponse.redirect(new URL(target, request.url));
  for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
  return redirect;
}
