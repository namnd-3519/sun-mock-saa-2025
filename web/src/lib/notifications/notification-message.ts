import type { NotificationsMessages } from "@/i18n/notifications-messages";
import type { AppNotification } from "./notification-types";

/** Message parts: an optional bold name followed by the localized text. */
export type NotificationMessage = { strong: string | null; text: string };

/** Localized message from the type and the stored payload (language switch applies to old rows). */
export function formatNotificationMessage(
  item: AppNotification,
  m: NotificationsMessages,
): NotificationMessage {
  switch (item.type) {
    case "kudos_received":
      return { strong: item.senderName ?? m.anonymous, text: m.kudosReceived };
    case "heart_received":
      return { strong: item.actorName ?? m.someone, text: m.heartReceived };
    case "secret_box_available":
      return { strong: null, text: m.secretBoxAvailable };
  }
}

/** Accessible name of the header bell, including the unread count when there is one. */
export function formatBellLabel(label: string, m: NotificationsMessages, unread: number): string {
  if (unread <= 0) return label;
  return `${label}, ${m.bellUnread.replace("{count}", String(unread))}`;
}
