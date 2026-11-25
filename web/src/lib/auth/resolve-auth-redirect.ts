import { LOGIN_PATH, isPublicPath, sanitizeNextPath } from "./auth-paths";

type AuthRedirectInput = {
  pathname: string;
  search: string;
  isSignedIn: boolean;
};

// Returns the path to redirect to, or null to let the request through.
export function resolveAuthRedirect({
  pathname,
  search,
  isSignedIn,
}: AuthRedirectInput): string | null {
  if (pathname === LOGIN_PATH) {
    if (!isSignedIn) return null;
    return sanitizeNextPath(new URLSearchParams(search).get("next"));
  }
  if (isPublicPath(pathname) || isSignedIn) return null;
  if (pathname === "/") return LOGIN_PATH;
  const next = encodeURIComponent(`${pathname}${search}`);
  return `${LOGIN_PATH}?next=${next}`;
}
