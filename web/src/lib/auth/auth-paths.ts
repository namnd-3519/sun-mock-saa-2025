export const LOGIN_PATH = "/login";
// The homepage (About SAA 2025) is where users land after signing in.
export const AFTER_LOGIN_PATH = "/";
// Own profile page (task #17) and the admin dashboard (route not built yet).
export const PROFILE_PATH = "/profile";
export const ADMIN_DASHBOARD_PATH = "/admin";
export const CALLBACK_PATH = "/auth/callback";
export const SIGN_OUT_PATH = "/auth/sign-out";
export const COUNTDOWN_PATH = "/countdown";

const AUTH_ROUTE_PREFIX = "/auth/";

export function isPublicPath(pathname: string): boolean {
  return (
    pathname === LOGIN_PATH ||
    pathname === COUNTDOWN_PATH ||
    pathname.startsWith(AUTH_ROUTE_PREFIX)
  );
}

// Accepts only same-origin relative paths so `next` cannot become an open redirect.
export function sanitizeNextPath(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) {
    return AFTER_LOGIN_PATH;
  }
  const { pathname } = new URL(raw, "http://local.invalid");
  if (isPublicPath(pathname)) return AFTER_LOGIN_PATH;
  return raw;
}
