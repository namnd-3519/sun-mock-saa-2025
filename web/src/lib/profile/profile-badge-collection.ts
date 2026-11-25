import { Constants } from "@/lib/supabase/database.types";
import type { SecretBadge } from "@/lib/kudos/kudos-types";

export type BadgeSlot = { badge: SecretBadge; collected: boolean };

/**
 * A.3 "Bộ sưu tập icon của tôi": one slot per Secret Box badge, in enum order.
 * A badge opened at least once is collected; the others stay gray.
 */
export function badgeCollection(opened: readonly SecretBadge[]): BadgeSlot[] {
  const owned = new Set(opened);
  return Constants.public.Enums.secret_badge.map((badge) => ({ badge, collected: owned.has(badge) }));
}
