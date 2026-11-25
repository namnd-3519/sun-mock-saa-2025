import { KUDOS_LIMITS } from "@/lib/kudos/kudos-limits";
import type { CreateKudosInput, Hashtag, ProfileSearchResult } from "@/lib/kudos/kudos-types";

/** Form state of the Write Kudo screen (MoMorph ihQ26W78P2). Images are kept apart as Files. */
export type KudosDraft = {
  recipient: ProfileSearchResult | null;
  title: string;
  content: string;
  hashtags: Hashtag[];
  isAnonymous: boolean;
  anonymousName: string;
};

export type DraftField = "recipient" | "title" | "content" | "hashtags" | "anonymousName";
export type DraftErrorCode = "required" | "tooLong" | "tooMany" | "self";
export type DraftErrors = Partial<Record<DraftField, DraftErrorCode>>;

export function emptyKudosDraft(): KudosDraft {
  return { recipient: null, title: "", content: "", hashtags: [], isAnonymous: false, anonymousName: "" };
}

function checkText(value: string, max: number): DraftErrorCode | undefined {
  const length = value.trim().length;
  if (length === 0) return "required";
  if (length > max) return "tooLong";
  return undefined;
}

/** Field-level rules (mirror of create_kudos, plus the design's required title). */
export function validateKudosDraft(draft: KudosDraft, senderId: string): DraftErrors {
  const errors: DraftErrors = {};
  if (!draft.recipient) errors.recipient = "required";
  else if (draft.recipient.id === senderId) errors.recipient = "self";

  const title = checkText(draft.title, KUDOS_LIMITS.titleMax);
  if (title) errors.title = title;
  const content = checkText(draft.content, KUDOS_LIMITS.contentMax);
  if (content) errors.content = content;

  if (draft.hashtags.length < KUDOS_LIMITS.hashtagsMin) errors.hashtags = "required";
  else if (draft.hashtags.length > KUDOS_LIMITS.hashtagsMax) errors.hashtags = "tooMany";

  if (draft.isAnonymous && draft.anonymousName.trim().length > KUDOS_LIMITS.anonymousNameMax) {
    errors.anonymousName = "tooLong";
  }
  return errors;
}

/** "Gửi" stays disabled until every required field has a value (spec H.2). */
export function isDraftComplete(draft: KudosDraft): boolean {
  return Boolean(draft.recipient && draft.title.trim() && draft.content.trim() && draft.hashtags.length > 0);
}

export function draftToInput(draft: KudosDraft, imagePaths: string[]): CreateKudosInput {
  const anonymousName = draft.anonymousName.trim();
  return {
    recipientId: draft.recipient?.id ?? "",
    title: draft.title.trim(),
    content: draft.content,
    hashtagIds: draft.hashtags.map((tag) => tag.id),
    imagePaths,
    isAnonymous: draft.isAnonymous,
    anonymousName: draft.isAnonymous && anonymousName ? anonymousName : null,
  };
}
