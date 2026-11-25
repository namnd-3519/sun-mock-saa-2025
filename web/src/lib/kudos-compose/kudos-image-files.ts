import { KUDOS_LIMITS } from "@/lib/kudos/kudos-limits";

// Mirrors the kudos-images bucket (allowed_mime_types, file_size_limit 5 MB).
export const KUDOS_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
export const KUDOS_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export type ImageRejection = "type" | "size" | "count";

type FileLike = { name: string; type: string; size: number };

/** Keeps the files that fit the bucket rules and the 5-image cap; reports the first rejection. */
export function pickImageFiles<T extends FileLike>(
  existingCount: number,
  files: T[],
): { accepted: T[]; rejected: ImageRejection | null } {
  const accepted: T[] = [];
  let rejected: ImageRejection | null = null;
  for (const file of files) {
    let reason: ImageRejection | null = null;
    if (!(KUDOS_IMAGE_TYPES as readonly string[]).includes(file.type)) reason = "type";
    else if (file.size > KUDOS_IMAGE_MAX_BYTES) reason = "size";
    else if (existingCount + accepted.length >= KUDOS_LIMITS.imagesMax) reason = "count";
    if (reason) rejected ??= reason;
    else accepted.push(file);
  }
  return { accepted, rejected };
}
