import type { KudosClient, KudosCursor, KudosStats } from "@/lib/kudos/kudos-types";
import { getProfileSummary, listProfileKudos, type ProfileKudosBox, type ProfileSummary } from "@/lib/kudos/profile-queries";
import { getMyKudosStats, listBadgesOf } from "@/lib/kudos/secret-box";
import { withKudosImageUrls, type KudosCardView } from "@/lib/kudos-live/kudos-card-view";
import { badgeCollection, type BadgeSlot } from "./profile-badge-collection";

export const PROFILE_PAGE_SIZE = 10;

export type OwnProfileData = {
  profile: ProfileSummary;
  stats: KudosStats | null;
  badges: BadgeSlot[];
  box: ProfileKudosBox;
  kudos: { items: KudosCardView[]; nextCursor: KudosCursor | null };
};

/** First render of /profile for the signed-in user; null without a profile row. List errors throw. */
export async function loadOwnProfile(
  client: KudosClient,
  userId: string,
  box: ProfileKudosBox,
): Promise<OwnProfileData | null> {
  const [profile, stats, opened, page] = await Promise.all([
    getProfileSummary(client, userId),
    // Stats and badges must not take the page down: they show "—" / gray icons instead.
    getMyKudosStats(client).catch(() => null),
    listBadgesOf(client, userId).catch(() => []),
    listProfileKudos(client, { userId, box, limit: PROFILE_PAGE_SIZE }),
  ]);
  if (!profile) return null;
  const items = await withKudosImageUrls(client, page.items);
  return {
    profile,
    stats,
    badges: badgeCollection(opened),
    box,
    kudos: { items, nextCursor: page.nextCursor },
  };
}
