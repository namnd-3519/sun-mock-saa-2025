import { KUDOS_LIMITS } from "@/lib/kudos/kudos-limits";
import type { Hashtag } from "@/lib/kudos/kudos-types";

/** True when no more hashtags may be added (spec: max 5). */
export function isHashtagSelectionFull(value: Hashtag[]): boolean {
  return value.length >= KUDOS_LIMITS.hashtagsMax;
}

/** An unselected option is disabled once the selection is full; selected ones stay clickable to remove. */
export function isHashtagOptionDisabled(value: Hashtag[], tag: Hashtag): boolean {
  return isHashtagSelectionFull(value) && !value.some((item) => item.id === tag.id);
}

/** Multi-select toggle: removes a selected tag, adds an unselected one unless the max is reached. */
export function toggleHashtag(value: Hashtag[], tag: Hashtag): Hashtag[] {
  if (value.some((item) => item.id === tag.id)) return value.filter((item) => item.id !== tag.id);
  if (isHashtagSelectionFull(value)) return value;
  return [...value, tag];
}
