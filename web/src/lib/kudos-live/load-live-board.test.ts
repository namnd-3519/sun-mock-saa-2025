import { beforeEach, describe, expect, it, vi } from "vitest";
import type { KudosCard, KudosClient } from "@/lib/kudos/kudos-types";
import { FIRST_PAGE_SIZE, loadLiveBoard } from "./load-live-board";

const q = vi.hoisted(() => ({
  listHighlightKudos: vi.fn(),
  listKudosFeed: vi.fn(),
  countKudos: vi.fn(),
  listHashtags: vi.fn(),
  listDepartments: vi.fn(),
  getMyKudosStats: vi.fn(),
  listRecentGiftReceivers: vi.fn(),
  withKudosImageUrls: vi.fn(),
}));
vi.mock("@/lib/kudos/kudos-queries", () => q);
vi.mock("@/lib/kudos/reference-data", () => q);
vi.mock("@/lib/kudos/secret-box", () => q);
vi.mock("./kudos-card-view", () => q);

const client = {} as KudosClient;
const card = (id: string, fullName: string | null) => ({ id, recipient: { fullName } }) as unknown as KudosCard;
const cursor = { createdAt: "2025-11-01T00:00:00Z", id: "k3" };

beforeEach(() => {
  vi.clearAllMocks();
  q.listHighlightKudos.mockResolvedValue([card("k1", "An"), card("k2", null)]);
  q.listKudosFeed.mockResolvedValue({ items: [card("k3", "An"), card("k4", "Binh")], nextCursor: cursor });
  q.countKudos.mockResolvedValue(42);
  q.getMyKudosStats.mockResolvedValue({ received: 1 });
  q.listRecentGiftReceivers.mockResolvedValue([{ id: "g1" }]);
  q.listHashtags.mockResolvedValue([{ id: "h1", name: "team" }]);
  q.listDepartments.mockResolvedValue([{ id: "d1", code: "D1" }]);
  q.withKudosImageUrls.mockImplementation(async (_c, cards: KudosCard[]) =>
    cards.map((c) => ({ ...c, imageUrls: [] })),
  );
});

describe("loadLiveBoard", () => {
  it("loads every section with the filters and a first page of the feed", async () => {
    const filters = { hashtagId: "h1" };
    const board = await loadLiveBoard(client, filters);
    expect(q.listHighlightKudos).toHaveBeenCalledWith(client, filters);
    expect(q.listKudosFeed).toHaveBeenCalledWith(client, { filters, limit: FIRST_PAGE_SIZE });
    expect(q.countKudos).toHaveBeenCalledWith(client, filters);
    expect(board.highlight.map((c) => c.id)).toEqual(["k1", "k2"]);
    expect(board.feed).toEqual({ items: expect.any(Array), nextCursor: cursor });
    expect(board.feed.items.map((c) => c.imageUrls)).toEqual([[], []]);
    expect(board.total).toBe(42);
    expect(board.stats).toEqual({ received: 1 });
    expect(board.giftReceivers).toEqual([{ id: "g1" }]);
    expect(board.hashtags).toEqual([{ id: "h1", name: "team" }]);
    expect(board.departments).toEqual([{ id: "d1", code: "D1" }]);
  });

  it("lists each named recipient once for the spotlight", async () => {
    const board = await loadLiveBoard(client, {});
    expect(board.spotlightNames).toEqual(["An", "Binh"]);
  });

  it("still renders when the sidebar and filter lists fail", async () => {
    q.getMyKudosStats.mockRejectedValue(new Error("stats"));
    q.listRecentGiftReceivers.mockRejectedValue(new Error("gifts"));
    q.listHashtags.mockRejectedValue(new Error("tags"));
    q.listDepartments.mockRejectedValue(new Error("deps"));
    const board = await loadLiveBoard(client, {});
    expect(board).toMatchObject({ stats: null, giftReceivers: [], hashtags: [], departments: [] });
    expect(board.total).toBe(42);
  });

  it("throws when the feed itself fails", async () => {
    q.listKudosFeed.mockRejectedValue(new Error("feed down"));
    await expect(loadLiveBoard(client, {})).rejects.toThrow("feed down");
  });
});
