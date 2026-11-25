import { KudosDataError, throwIfError } from "./kudos-error";
import type { CreateKudosInput, KudosClient } from "./kudos-types";
import { validateKudosInput } from "./validate-kudos-input";

/** Sends a kudos through the create_kudos RPC. Returns the new kudos id. */
export async function createKudos(
  client: KudosClient,
  senderId: string,
  input: CreateKudosInput,
): Promise<string> {
  const invalid = validateKudosInput(input, senderId);
  if (invalid) throw new KudosDataError(invalid);

  const anonymousName = input.anonymousName?.trim();
  const title = input.title?.trim();
  const { data, error } = await client.rpc("create_kudos", {
    p_recipient_id: input.recipientId,
    p_content: input.content,
    p_hashtag_ids: [...new Set(input.hashtagIds)],
    p_image_paths: input.imagePaths ?? [],
    p_is_anonymous: input.isAnonymous ?? false,
    ...(anonymousName ? { p_anonymous_name: anonymousName } : {}),
    ...(title ? { p_title: title } : {}),
  });
  throwIfError(error);
  if (!data) throw new KudosDataError("unknown", "create_kudos returned no id");
  return data;
}

/** Adds the signed-in user's heart. The server sets the weight and forbids self-likes. */
export async function likeKudos(client: KudosClient, kudosId: string): Promise<void> {
  const { error } = await client.from("kudos_likes").insert({ kudos_id: kudosId });
  throwIfError(error);
}

/** Removes the signed-in user's heart (RLS limits the delete to their own like). */
export async function unlikeKudos(client: KudosClient, kudosId: string): Promise<void> {
  const { error } = await client.from("kudos_likes").delete().eq("kudos_id", kudosId);
  throwIfError(error);
}
