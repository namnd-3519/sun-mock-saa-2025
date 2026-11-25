import { describe, expect, it } from "vitest";
import { createFakeKudosClient } from "./fake-kudos-client";
import { KudosDataError } from "./kudos-error";
import { cursorFilter } from "./kudos-queries";
import { getProfileSummary, listProfileKudos } from "./profile-queries";

const row = (id: string, createdAt: string) => ({
  id,
  created_at: createdAt,
  content: "c",
  title: null,
  is_anonymous: false,
  anonymous_name: null,
  is_mine: true,
  sender_id: "me",
  sender: null,
  recipient_id: "r1",
  recipient: null,
  recipient_department_id: null,
  hashtags: [],
  hashtag_ids: [],
  image_paths: [],
  like_count: 0,
  liked_by_me: false,
});

const ORDER_AND_LIMIT = (limit: number) => [
  { method: "order", args: ["created_at", { ascending: false }] },
  { method: "order", args: ["id", { ascending: false }] },
  { method: "limit", args: [limit] },
];

describe("listProfileKudos", () => {
  it("lists received kudos by recipient, newest first", async () => {
    const { client, calls } = createFakeKudosClient({ data: [] });
    await listProfileKudos(client, { userId: "me", box: "received" });
    expect(calls).toEqual([
      { method: "from", args: ["kudos_feed"] },
      { method: "select", args: ["*"] },
      { method: "eq", args: ["recipient_id", "me"] },
      ...ORDER_AND_LIMIT(10),
    ]);
  });

  it("lists sent kudos by the (masked) sender id and applies the cursor", async () => {
    const cursor = { createdAt: "2026-11-02T00:00:00+00:00", id: "k3" };
    const { client, calls } = createFakeKudosClient({ data: [] });
    await listProfileKudos(client, { userId: "me", box: "sent", cursor, limit: 2 });
    expect(calls).toEqual([
      { method: "from", args: ["kudos_feed"] },
      { method: "select", args: ["*"] },
      { method: "eq", args: ["sender_id", "me"] },
      { method: "or", args: [cursorFilter(cursor)] },
      ...ORDER_AND_LIMIT(2),
    ]);
  });

  it("maps rows and returns a next cursor only for a full page", async () => {
    const full = createFakeKudosClient({
      data: [row("k2", "2026-11-02T00:00:00Z"), row("k1", "2026-11-01T00:00:00Z")],
    });
    const page = await listProfileKudos(full.client, { userId: "me", box: "sent", limit: 2 });
    expect(page.items.map((card) => [card.id, card.isMine])).toEqual([["k2", true], ["k1", true]]);
    expect(page.nextCursor).toEqual({ createdAt: "2026-11-01T00:00:00Z", id: "k1" });

    const short = createFakeKudosClient({ data: [row("k1", "2026-11-01T00:00:00Z")] });
    expect((await listProfileKudos(short.client, { userId: "me", box: "sent", limit: 2 })).nextCursor).toBeNull();
  });

  it("throws a KudosDataError on a query error", async () => {
    const { client } = createFakeKudosClient({ error: { code: "42501", message: "denied" } });
    await expect(listProfileKudos(client, { userId: "me", box: "received" })).rejects.toBeInstanceOf(KudosDataError);
  });
});

describe("getProfileSummary", () => {
  it("selects the profile with its department code", async () => {
    const { client, calls } = createFakeKudosClient({
      data: { id: "me", full_name: "An", avatar_url: null, department: { code: "CEVC3" } },
    });
    await expect(getProfileSummary(client, "me")).resolves.toEqual({
      id: "me",
      fullName: "An",
      avatarUrl: null,
      departmentCode: "CEVC3",
    });
    expect(calls).toEqual([
      { method: "from", args: ["profiles"] },
      { method: "select", args: ["id, full_name, avatar_url, department:departments(code)"] },
      { method: "eq", args: ["id", "me"] },
      { method: "maybeSingle", args: [] },
    ]);
  });

  it("returns null without a profile and a null department code without a department", async () => {
    expect(await getProfileSummary(createFakeKudosClient({ data: null }).client, "x")).toBeNull();
    const noDept = createFakeKudosClient({ data: { id: "me", full_name: null, avatar_url: null, department: null } });
    expect((await getProfileSummary(noDept.client, "me"))?.departmentCode).toBeNull();
  });
});
