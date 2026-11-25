import { PROFILE_PATH } from "@/lib/auth/auth-paths";
import type { ProfileKudosBox } from "@/lib/kudos/profile-queries";

export const DEFAULT_PROFILE_BOX: ProfileKudosBox = "received";

/** `?box=sent` selects the sent list; anything else falls back to the received list. */
export function parseProfileBox(params: Record<string, string | string[] | undefined>): ProfileKudosBox {
  const raw = params.box;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === "sent" ? "sent" : DEFAULT_PROFILE_BOX;
}

export function profileBoxHref(box: ProfileKudosBox): string {
  return box === DEFAULT_PROFILE_BOX ? PROFILE_PATH : `${PROFILE_PATH}?box=${box}`;
}
