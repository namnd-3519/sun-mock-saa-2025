import { throwIfError } from "@/lib/kudos/kudos-error";
import { cursorFilter } from "@/lib/kudos/kudos-queries";
import type { KudosClient } from "@/lib/kudos/kudos-types";
import { mapNotificationRow } from "./map-notification-row";
import type { AppNotification, NotificationCursor, NotificationPage } from "./notification-types";

const TABLE = "notifications";
const COLUMNS = "id, recipient_id, type, payload, is_read, created_at";
export const NOTIFICATIONS_PAGE_SIZE = 10;

/** The signed-in user's notifications (RLS), newest first, keyset-paged. */
export async function listNotifications(
  client: KudosClient,
  options: { cursor?: NotificationCursor | null; limit?: number } = {},
): Promise<NotificationPage> {
  const limit = options.limit ?? NOTIFICATIONS_PAGE_SIZE;
  let query = client.from(TABLE).select(COLUMNS);
  if (options.cursor) query = query.or(cursorFilter(options.cursor));
  const { data, error } = await query
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(limit);
  throwIfError(error);
  const rows = data ?? [];
  const last = rows.at(-1);
  const nextCursor =
    rows.length === limit && last ? { createdAt: last.created_at, id: last.id } : null;
  const items = rows.map(mapNotificationRow).filter((item): item is AppNotification => !!item);
  return { items, nextCursor };
}

/** Unread count for the header bell; the server count is the only source of truth. */
export async function countUnreadNotifications(client: KudosClient): Promise<number> {
  const { count, error } = await client
    .from(TABLE)
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);
  throwIfError(error);
  return count ?? 0;
}

/** False when the notification is not the signed-in user's. */
export async function markNotificationRead(client: KudosClient, id: string): Promise<boolean> {
  const { data, error } = await client.rpc("mark_notification_read", { p_id: id });
  throwIfError(error);
  return data === true;
}

/** Idempotent: returns 0 when nothing was unread. */
export async function markAllNotificationsRead(client: KudosClient): Promise<number> {
  const { data, error } = await client.rpc("mark_all_notifications_read");
  throwIfError(error);
  return data ?? 0;
}
