export const LOGIN_PATH = "/login";
export const AFTER_LOGIN_PATH = "/todo";
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
