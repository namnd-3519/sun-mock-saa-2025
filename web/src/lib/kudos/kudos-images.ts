import { throwIfError } from "./kudos-error";
import { KUDOS_IMAGES_BUCKET } from "./kudos-limits";
import type { KudosClient } from "./kudos-types";

/** Storage path for a new kudos image: always inside the uploader's own folder. */
export function buildKudosImagePath(userId: string, fileName: string, id = crypto.randomUUID()) {
  const extension = /\.([a-z0-9]{1,5})$/i.exec(fileName)?.[1]?.toLowerCase() ?? "img";
  return `${userId}/${id}.${extension}`;
}

/** Signed URLs for the private kudos-images bucket, in the order of `paths`. */
export async function createKudosImageUrls(
  client: KudosClient,
  paths: string[],
  expiresInSeconds = 3600,
): Promise<string[]> {
  if (paths.length === 0) return [];
  const { data, error } = await client.storage
    .from(KUDOS_IMAGES_BUCKET)
    .createSignedUrls(paths, expiresInSeconds);
  throwIfError(error);
  const byPath = new Map((data ?? []).map((item) => [item.path, item.signedUrl]));
  return paths.map((path) => byPath.get(path) ?? "");
}
