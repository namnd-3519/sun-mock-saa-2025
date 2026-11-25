import { createKudosImageUrls } from "@/lib/kudos/kudos-images";
import type { KudosCard, KudosClient } from "@/lib/kudos/kudos-types";

/** A feed card plus signed URLs for its attached images (same order as `imagePaths`). */
export type KudosCardView = KudosCard & { imageUrls: string[] };

/** Signs every card's images in one storage call. */
export async function withKudosImageUrls(
  client: KudosClient,
  cards: KudosCard[],
): Promise<KudosCardView[]> {
  const paths = cards.flatMap((card) => card.imagePaths);
  const urls = await createKudosImageUrls(client, paths);
  let offset = 0;
  return cards.map((card) => {
    const imageUrls = urls.slice(offset, offset + card.imagePaths.length).filter(Boolean);
    offset += card.imagePaths.length;
    return { ...card, imageUrls };
  });
}
