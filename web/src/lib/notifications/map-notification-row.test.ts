import { describe, expect, it } from "vitest";
import { mapNotificationRow } from "./map-notification-row";
import type { NotificationRow } from "./notification-types";

const base = {
  id: "n1",
  recipient_id: "u1",
  created_at: "2026-11-25T10:00:00Z",
  is_read: false,
} satisfies Partial<NotificationRow>;

describe("mapNotificationRow", () => {
  it("maps kudos_received with the sender name", () => {
    const row = { ...base, type: "kudos_received", payload: { kudosId: "k1", senderName: "An" } } as const;
    expect(mapNotificationRow(row)).toEqual({
      id: "n1",
      createdAt: "2026-11-25T10:00:00Z",
      isRead: false,
      type: "kudos_received",
      kudosId: "k1",
      senderName: "An",
    });
  });

  it("keeps a null sender name (anonymous kudos without nickname)", () => {
    const row = { ...base, type: "kudos_received", payload: { kudosId: "k1", senderName: null } } as const;
    expect(mapNotificationRow(row)).toMatchObject({ senderName: null });
  });

  it("maps heart_received with the actor name", () => {
    const row = {
      ...base,
      is_read: true,
      type: "heart_received",
      payload: { kudosId: "k2", actorId: "u2", actorName: "Binh" },
    } as const;
    expect(mapNotificationRow(row)).toMatchObject({
      type: "heart_received",
      kudosId: "k2",
      actorName: "Binh",
      isRead: true,
    });
  });

  it("maps secret_box_available", () => {
    const row = { ...base, type: "secret_box_available", payload: { boxId: "b1" } } as const;
    expect(mapNotificationRow(row)).toMatchObject({ type: "secret_box_available", boxId: "b1" });
  });

  it("drops rows with an unknown type or a malformed payload", () => {
    const unknown = { ...base, type: "kudos_hidden", payload: { kudosId: "k1" } };
    expect(mapNotificationRow(unknown as unknown as NotificationRow)).toBeNull();
    const malformed = { ...base, type: "kudos_received", payload: ["x"] } as const;
    expect(mapNotificationRow(malformed as unknown as NotificationRow)).toBeNull();
    const missingId = { ...base, type: "secret_box_available", payload: {} } as const;
    expect(mapNotificationRow(missingId)).toBeNull();
  });
});
