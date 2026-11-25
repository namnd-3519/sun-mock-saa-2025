import { KudosDataError, throwIfError } from "./kudos-error";
import type { GiftReceiver, KudosClient, KudosStats, OpenedBox } from "./kudos-types";

/** Opens the signed-in user's oldest unopened box; the server draws the badge. */
export async function openSecretBox(client: KudosClient): Promise<OpenedBox> {
  const { data, error } = await client.rpc("open_secret_box");
  throwIfError(error);
  const row = data?.[0];
  if (!row) throw new KudosDataError("no_unopened_box");
  return { boxId: row.box_id, badge: row.badge };
}

/** Sidebar statistics of the signed-in user (Live board D.1, Profile). */
export async function getMyKudosStats(client: KudosClient): Promise<KudosStats> {
  const { data, error } = await client.rpc("get_my_kudos_stats");
  throwIfError(error);
  const row = data?.[0];
  if (!row) throw new KudosDataError("not_authenticated");
  return {
    kudosReceived: row.kudos_received,
    kudosSent: row.kudos_sent,
    heartsReceived: row.hearts_received,
    boxesOpened: row.boxes_opened,
    boxesUnopened: row.boxes_unopened,
  };
}

/** "10 Sunner nhận quà mới nhất": latest opened boxes with their owner. */
export async function listRecentGiftReceivers(
  client: KudosClient,
  limit = 10,
): Promise<GiftReceiver[]> {
  const { data, error } = await client
    .from("secret_boxes")
    .select("id, badge, opened_at, owner:profiles(id, full_name, avatar_url)")
    .not("opened_at", "is", null)
    .order("opened_at", { ascending: false })
    .limit(limit);
  throwIfError(error);
  return (data ?? []).flatMap((row) =>
    row.badge && row.opened_at
      ? [
          {
            boxId: row.id,
            badge: row.badge,
            openedAt: row.opened_at,
            owner: row.owner
              ? { id: row.owner.id, fullName: row.owner.full_name, avatarUrl: row.owner.avatar_url }
              : null,
          },
        ]
      : [],
  );
}

/** Badges a Sunner collected (Profile "bộ sưu tập icon"), oldest first. */
export async function listBadgesOf(client: KudosClient, userId: string) {
  const { data, error } = await client
    .from("secret_boxes")
    .select("badge, opened_at")
    .eq("owner_id", userId)
    .not("opened_at", "is", null)
    .order("opened_at");
  throwIfError(error);
  return (data ?? []).flatMap((row) => (row.badge ? [row.badge] : []));
}
