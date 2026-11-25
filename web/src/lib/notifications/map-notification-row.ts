import type { AppNotification, NotificationRow } from "./notification-types";

type Payload = Record<string, unknown>;

function asPayload(value: unknown): Payload | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Payload) : null;
}

function text(payload: Payload, key: string): string | null {
  const value = payload[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

/** Row → typed notification; null for a type this client does not know or a broken payload. */
export function mapNotificationRow(row: NotificationRow): AppNotification | null {
  const payload = asPayload(row.payload);
  if (!payload) return null;
  const base = { id: row.id, createdAt: row.created_at, isRead: row.is_read };
  switch (row.type) {
    case "kudos_received": {
      const kudosId = text(payload, "kudosId");
      return kudosId
        ? { ...base, type: row.type, kudosId, senderName: text(payload, "senderName") }
        : null;
    }
    case "heart_received": {
      const kudosId = text(payload, "kudosId");
      return kudosId
        ? { ...base, type: row.type, kudosId, actorName: text(payload, "actorName") }
        : null;
    }
    case "secret_box_available": {
      const boxId = text(payload, "boxId");
      return boxId ? { ...base, type: row.type, boxId } : null;
    }
    default:
      return null;
  }
}
