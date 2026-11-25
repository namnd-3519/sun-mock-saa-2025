import type { Database } from "@/lib/supabase/database.types";

export type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];

type Base = { id: string; createdAt: string; isRead: boolean };

/** One notification, typed by its kind. Names are snapshots taken when it was created. */
export type AppNotification =
  | (Base & { type: "kudos_received"; kudosId: string; senderName: string | null })
  | (Base & { type: "heart_received"; kudosId: string; actorName: string | null })
  | (Base & { type: "secret_box_available"; boxId: string });

export type NotificationCursor = { createdAt: string; id: string };

export type NotificationPage = {
  items: AppNotification[];
  nextCursor: NotificationCursor | null;
};
