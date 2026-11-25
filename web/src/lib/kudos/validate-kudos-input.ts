import type { KudosErrorCode } from "./kudos-error";
import { KUDOS_LIMITS } from "./kudos-limits";
import type { CreateKudosInput } from "./kudos-types";

/**
 * Client-side mirror of the create_kudos RPC rules, for instant form feedback.
 * Returns the first failing rule, or null when the input is valid. The RPC stays authoritative.
 */
export function validateKudosInput(
  input: CreateKudosInput,
  senderId: string,
): KudosErrorCode | null {
  if (!input.recipientId || input.recipientId === senderId) return "invalid_recipient";

  const content = input.content.trim();
  if (content.length < 1 || content.length > KUDOS_LIMITS.contentMax) return "invalid_content";

  const hashtags = new Set(input.hashtagIds.filter(Boolean));
  if (hashtags.size < KUDOS_LIMITS.hashtagsMin || hashtags.size > KUDOS_LIMITS.hashtagsMax) {
    return "invalid_hashtags";
  }

  const images = input.imagePaths ?? [];
  const ownFolder = `${senderId}/`;
  if (
    images.length > KUDOS_LIMITS.imagesMax ||
    images.some((path) => !path.startsWith(ownFolder) || path.length === ownFolder.length)
  ) {
    return "invalid_images";
  }

  const anonymousName = input.anonymousName?.trim() ?? "";
  if (anonymousName && !input.isAnonymous) return "invalid_anonymous_name";
  if (anonymousName.length > KUDOS_LIMITS.anonymousNameMax) return "invalid_anonymous_name";

  if ((input.title?.trim().length ?? 0) > KUDOS_LIMITS.titleMax) return "invalid_title";

  return null;
}
