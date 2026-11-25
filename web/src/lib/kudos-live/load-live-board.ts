import { countKudos, listHighlightKudos, listKudosFeed } from "@/lib/kudos/kudos-queries";
import type { GiftReceiver, KudosClient, KudosFilters, KudosStats } from "@/lib/kudos/kudos-types";
import { getMyKudosStats, listRecentGiftReceivers } from "@/lib/kudos/secret-box";
import { withKudosImageUrls, type KudosCardView } from "./kudos-card-view";

export const FIRST_PAGE_SIZE = 10;

export type LiveBoardData = {
  highlight: KudosCardView[];
  feed: { items: KudosCardView[]; nextCursor: { createdAt: string; id: string } | null };
  total: number;
  spotlightNames: string[];
  stats: KudosStats | null;
  giftReceivers: GiftReceiver[];
};

/** Everything the first render of /kudos needs, fetched in parallel. Feed errors throw. */
export async function loadLiveBoard(client: KudosClient, filters: KudosFilters): Promise<LiveBoardData> {
  const [highlight, page, total, stats, giftReceivers] = await Promise.all([
    listHighlightKudos(client, filters),
    listKudosFeed(client, { filters, limit: FIRST_PAGE_SIZE }),
    countKudos(client, filters),
    // The sidebar must not take the board down: it shows "—" without stats.
    getMyKudosStats(client).catch(() => null),
    listRecentGiftReceivers(client).catch(() => []),
  ]);
  const [highlightViews, feedViews] = await Promise.all([
    withKudosImageUrls(client, highlight),
    withKudosImageUrls(client, page.items),
  ]);
  const names = [...highlight, ...page.items].flatMap((card) => card.recipient.fullName ?? []);
  return {
    highlight: highlightViews,
    feed: { items: feedViews, nextCursor: page.nextCursor },
    total,
    spotlightNames: [...new Set(names)],
    stats,
    giftReceivers,
  };
}
