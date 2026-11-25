import { describe, expect, it } from "vitest";
import { createFakeKudosClient, methodsOf } from "./fake-kudos-client";
import { KudosDataError } from "./kudos-error";
import {
  countKudos,
  cursorFilter,
  getKudosById,
  getKudosLikeState,
  listHighlightKudos,
  listKudosFeed,
} from "./kudos-queries";

const row = (id: string, createdAt: string) => ({
  id,
  created_at: createdAt,
  content: "c",
  title: null,
  is_anonymous: false,
  anonymous_name: null,
  is_mine: false,
  sender_id: null,
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

describe("listKudosFeed", () => {
  it("applies filters, cursor, order and limit", async () => {
    const { client, calls } = createFakeKudosClient({ data: [row("k2", "2026-11-01T00:00:00Z")] });
    await listKudosFeed(client, {
      filters: { hashtagId: "h1", departmentId: "d1" },
      cursor: { createdAt: "2026-11-02T00:00:00+00:00", id: "k3" },
      limit: 2,
    });
    expect(calls).toEqual([
      { method: "from", args: ["kudos_feed"] },
      { method: "select", args: ["*"] },
      { method: "contains", args: ["hashtag_ids", ["h1"]] },
      { method: "eq", args: ["recipient_department_id", "d1"] },
      { method: "or", args: [cursorFilter({ createdAt: "2026-11-02T00:00:00+00:00", id: "k3" })] },
      { method: "order", args: ["created_at", { ascending: false }] },
      { method: "order", args: ["id", { ascending: false }] },
      { method: "limit", args: [2] },
    ]);
  });

  it("returns a next cursor only for a full page", async () => {
    const full = createFakeKudosClient({
      data: [row("k2", "2026-11-02T00:00:00Z"), row("k1", "2026-11-01T00:00:00Z")],
    });
    const page = await listKudosFeed(full.client, { limit: 2 });
    expect(page.nextCursor).toEqual({ createdAt: "2026-11-01T00:00:00Z", id: "k1" });

    const partial = createFakeKudosClient({ data: [row("k1", "2026-11-01T00:00:00Z")] });
    expect((await listKudosFeed(partial.client, { limit: 2 })).nextCursor).toBeNull();
  });

  it("throws a typed error", async () => {
    const { client } = createFakeKudosClient({ error: { code: "42501", message: "denied" } });
    await expect(listKudosFeed(client)).rejects.toBeInstanceOf(KudosDataError);
  });
});

describe("cursorFilter", () => {
  it("quotes timestamps so PostgREST parses + and :", () => {
    expect(cursorFilter({ createdAt: "2026-11-02T00:00:00+00:00", id: "k3" })).toBe(
      'created_at.lt."2026-11-02T00:00:00+00:00",and(created_at.eq."2026-11-02T00:00:00+00:00",id.lt."k3")',
    );
  });
});

describe("listHighlightKudos", () => {
  it("orders by hearts and takes five by default", async () => {
    const { client, calls } = createFakeKudosClient({ data: [] });
    await listHighlightKudos(client, { hashtagId: "h1" });
    expect(methodsOf(calls)).toEqual(["from", "select", "contains", "order", "order", "limit"]);
    expect(calls[3].args).toEqual(["like_count", { ascending: false }]);
    expect(calls[5].args).toEqual([5]);
  });
});

describe("countKudos / getKudosById", () => {
  it("counts with a head request", async () => {
    const { client, calls } = createFakeKudosClient({ count: 388 });
    expect(await countKudos(client)).toBe(388);
    expect(calls[1]).toEqual({ method: "select", args: ["id", { count: "exact", head: true }] });
  });

  it("returns null when the kudos does not exist", async () => {
    const { client } = createFakeKudosClient({ data: null });
    expect(await getKudosById(client, "missing")).toBeNull();
  });

  it("applies the Live board filters when given", async () => {
    const { client, calls } = createFakeKudosClient({ data: null });
    await getKudosById(client, "k1", { hashtagId: "h1", departmentId: "d1" });
    expect(methodsOf(calls)).toEqual(["from", "select", "contains", "eq", "eq", "maybeSingle"]);
    expect(calls[2].args).toEqual(["hashtag_ids", ["h1"]]);
    expect(calls[4].args).toEqual(["id", "k1"]);
  });
});

describe("getKudosLikeState", () => {
  it("reads only the count and the viewer's like through kudos_feed", async () => {
    const { client, calls } = createFakeKudosClient({ data: { like_count: 7, liked_by_me: true } });
    await expect(getKudosLikeState(client, "k1")).resolves.toEqual({ likeCount: 7, likedByMe: true });
    expect(calls.slice(0, 3)).toEqual([
      { method: "from", args: ["kudos_feed"] },
      { method: "select", args: ["like_count, liked_by_me"] },
      { method: "eq", args: ["id", "k1"] },
    ]);
  });

  it("returns null when the kudos is not visible", async () => {
    const { client } = createFakeKudosClient({ data: null });
    await expect(getKudosLikeState(client, "k1")).resolves.toBeNull();
  });
});
