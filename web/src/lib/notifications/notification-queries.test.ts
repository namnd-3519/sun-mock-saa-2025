import { describe, expect, it } from "vitest";
import { createFakeKudosClient } from "@/lib/kudos/fake-kudos-client";
import { cursorFilter } from "@/lib/kudos/kudos-queries";
import { KudosDataError } from "@/lib/kudos/kudos-error";
import {
  countUnreadNotifications,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "./notification-queries";

const row = (id: string, createdAt: string) => ({
  id,
  recipient_id: "u1",
  type: "secret_box_available",
  payload: { boxId: `b-${id}` },
  is_read: false,
  created_at: createdAt,
});

describe("listNotifications", () => {
  it("reads newest first with the keyset cursor and limit", async () => {
    const cursor = { createdAt: "2026-11-25T10:00:00+00:00", id: "n9" };
    const { client, calls } = createFakeKudosClient({ data: [] });
    await listNotifications(client, { cursor, limit: 3 });
    expect(calls).toEqual([
      { method: "from", args: ["notifications"] },
      { method: "select", args: ["id, recipient_id, type, payload, is_read, created_at"] },
      { method: "or", args: [cursorFilter(cursor)] },
      { method: "order", args: ["created_at", { ascending: false }] },
      { method: "order", args: ["id", { ascending: false }] },
      { method: "limit", args: [3] },
    ]);
  });

  it("returns a next cursor only when the page is full", async () => {
    const full = createFakeKudosClient({
      data: [row("n2", "2026-11-25T10:00:00Z"), row("n1", "2026-11-25T09:00:00Z")],
    });
    const page = await listNotifications(full.client, { limit: 2 });
    expect(page.items.map((item) => item.id)).toEqual(["n2", "n1"]);
    expect(page.nextCursor).toEqual({ createdAt: "2026-11-25T09:00:00Z", id: "n1" });

    const short = createFakeKudosClient({ data: [row("n1", "2026-11-25T09:00:00Z")] });
    expect((await listNotifications(short.client, { limit: 2 })).nextCursor).toBeNull();
  });

  it("defaults to 10 per page and skips rows it cannot display", async () => {
    const { client, calls } = createFakeKudosClient({
      data: [{ ...row("n1", "2026-11-25T09:00:00Z"), type: "kudos_hidden" }],
    });
    const page = await listNotifications(client);
    expect(calls.at(-1)).toEqual({ method: "limit", args: [10] });
    expect(page.items).toEqual([]);
  });

  it("throws a typed error", async () => {
    const { client } = createFakeKudosClient({ error: { code: "42501", message: "denied" } });
    await expect(listNotifications(client)).rejects.toBeInstanceOf(KudosDataError);
  });
});

describe("countUnreadNotifications", () => {
  it("counts unread rows with a head request", async () => {
    const { client, calls } = createFakeKudosClient({ count: 4 });
    await expect(countUnreadNotifications(client)).resolves.toBe(4);
    expect(calls).toEqual([
      { method: "from", args: ["notifications"] },
      { method: "select", args: ["id", { count: "exact", head: true }] },
      { method: "eq", args: ["is_read", false] },
    ]);
  });
});

describe("mark read", () => {
  it("marks one notification through the RPC", async () => {
    const { client, calls } = createFakeKudosClient({ data: true });
    await expect(markNotificationRead(client, "n1")).resolves.toBe(true);
    expect(calls).toEqual([{ method: "rpc", args: ["mark_notification_read", { p_id: "n1" }] }]);
  });

  it("marks all and returns how many changed", async () => {
    const { client, calls } = createFakeKudosClient({ data: 3 });
    await expect(markAllNotificationsRead(client)).resolves.toBe(3);
    expect(calls).toEqual([{ method: "rpc", args: ["mark_all_notifications_read"] }]);
  });

  it("throws when the RPC fails", async () => {
    const { client } = createFakeKudosClient({ error: { message: "boom" } });
    await expect(markAllNotificationsRead(client)).rejects.toBeInstanceOf(KudosDataError);
  });
});
