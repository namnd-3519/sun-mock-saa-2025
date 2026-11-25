import { KudosDataError, type KudosErrorCode } from "@/lib/kudos/kudos-error";
import { buildKudosImagePath } from "@/lib/kudos/kudos-images";
import { KUDOS_IMAGES_BUCKET } from "@/lib/kudos/kudos-limits";
import { createKudos } from "@/lib/kudos/kudos-mutations";
import type { KudosClient } from "@/lib/kudos/kudos-types";
import { draftToInput, validateKudosDraft, type DraftField, type KudosDraft } from "./kudos-draft";

const FIELD_CODES: Record<DraftField, KudosErrorCode> = {
  recipient: "invalid_recipient",
  title: "invalid_title",
  content: "invalid_content",
  hashtags: "invalid_hashtags",
  anonymousName: "invalid_anonymous_name",
};

type ImageFile = Pick<File, "name" | "type">;

/**
 * Write Kudo submit: validates, uploads the images into "<uid>/" of kudos-images, then creates
 * the kudos through the create_kudos RPC. Uploaded images are removed again if a later step fails.
 */
export async function submitKudosDraft(
  client: KudosClient,
  senderId: string,
  draft: KudosDraft,
  images: ImageFile[],
  newId: () => string = () => crypto.randomUUID(),
): Promise<string> {
  const firstError = Object.keys(validateKudosDraft(draft, senderId))[0] as DraftField | undefined;
  if (firstError) throw new KudosDataError(FIELD_CODES[firstError]);

  const bucket = client.storage.from(KUDOS_IMAGES_BUCKET);
  const uploaded: string[] = [];
  const cleanUp = async () => {
    if (uploaded.length > 0) await bucket.remove(uploaded).catch(() => undefined);
  };

  try {
    for (const image of images) {
      const path = buildKudosImagePath(senderId, image.name, newId());
      const { error } = await bucket.upload(path, image as File, { contentType: image.type, upsert: false });
      if (error) throw new KudosDataError("invalid_images", error.message);
      uploaded.push(path);
    }
    return await createKudos(client, senderId, draftToInput(draft, uploaded));
  } catch (error) {
    await cleanUp();
    throw error;
  }
}
