type ClaimsLike = { app_metadata?: Record<string, unknown> | null } | null | undefined;

/**
 * Admin rule: `app_metadata.role === "admin"` on the verified JWT claims.
 * Only `app_metadata` counts; `user_metadata` is editable by the user.
 */
export function isAdmin(claims: ClaimsLike): boolean {
  return claims?.app_metadata?.role === "admin";
}
