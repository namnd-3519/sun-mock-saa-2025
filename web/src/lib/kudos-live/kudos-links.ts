import { KUDOS_PATH } from "@/lib/navigation/site-nav";

// No kudos detail screen exists in MoMorph: "Xem chi tiết" and Copy Link point at the card's
// anchor on the Live board until a detail page is designed.
export function kudosAnchorId(id: string): string {
  return `kudos-${id}`;
}

export function kudosDetailHref(id: string): string {
  return `${KUDOS_PATH}#${kudosAnchorId(id)}`;
}

export function kudosShareUrl(origin: string, id: string): string {
  return `${origin}${kudosDetailHref(id)}`;
}

/** Profile page slot (task "Profile bản thân", #17). */
export function profileHref(userId: string): string {
  return `/profile/${userId}`;
}
