import { beforeEach, describe, expect, it, vi } from "vitest";
import type { KudosCard, KudosClient } from "@/lib/kudos/kudos-types";
import { loadOwnProfile, PROFILE_PAGE_SIZE } from "./load-own-profile";

const q = vi.hoisted(() => ({
  getProfileSummary: vi.fn(),
  listProfileKudos: vi.fn(),
  getMyKudosStats: vi.fn(),
  listBadgesOf: vi.fn(),
  withKudosImageUrls: vi.fn(),
}));
vi.mock("@/lib/kudos/profile-queries", () => q);
vi.mock("@/lib/kudos/secret-box", () => q);
vi.mock("@/lib/kudos-live/kudos-card-view", () => q);

const client = {} as KudosClient;
const profile = { id: "u1", fullName: "An" };
const cursor = { createdAt: "2025-11-01T00:00:00Z", id: "k2" };

beforeEach(() => {
  vi.clearAllMocks();
  q.getProfileSummary.mockResolvedValue(profile);
  q.getMyKudosStats.mockResolvedValue({ received: 3 });
  q.listBadgesOf.mockResolvedValue(["revival"]);
  q.listProfileKudos.mockResolvedValue({ items: [{ id: "k1" } as KudosCard], nextCursor: cursor });
  q.withKudosImageUrls.mockImplementation(async (_c, cards: KudosCard[]) =>
    cards.map((c) => ({ ...c, imageUrls: ["u"] })),
  );
});

describe("loadOwnProfile", () => {
  it("loads the profile, stats, badge collection and the first page of the box", async () => {
    const data = await loadOwnProfile(client, "u1", "sent");
    expect(q.getProfileSummary).toHaveBeenCalledWith(client, "u1");
    expect(q.listBadgesOf).toHaveBeenCalledWith(client, "u1");
    expect(q.listProfileKudos).toHaveBeenCalledWith(client, { userId: "u1", box: "sent", limit: PROFILE_PAGE_SIZE });
    expect(data).toMatchObject({
      profile,
      stats: { received: 3 },
      box: "sent",
      kudos: { items: [{ id: "k1", imageUrls: ["u"] }], nextCursor: cursor },
    });
    expect(data?.badges.filter((slot) => slot.collected).map((slot) => slot.badge)).toEqual(["revival"]);
    expect(data?.badges.length).toBeGreaterThan(1);
  });

  it("returns null without a profile row", async () => {
    q.getProfileSummary.mockResolvedValue(null);
    await expect(loadOwnProfile(client, "u1", "received")).resolves.toBeNull();
    expect(q.withKudosImageUrls).not.toHaveBeenCalled();
  });

  it("shows no stats and gray badges when those queries fail", async () => {
    q.getMyKudosStats.mockRejectedValue(new Error("stats"));
    q.listBadgesOf.mockRejectedValue(new Error("badges"));
    const data = await loadOwnProfile(client, "u1", "received");
    expect(data?.stats).toBeNull();
    expect(data?.badges.every((slot) => !slot.collected)).toBe(true);
  });

  it("throws when the kudos list fails", async () => {
    q.listProfileKudos.mockRejectedValue(new Error("list down"));
    await expect(loadOwnProfile(client, "u1", "received")).rejects.toThrow("list down");
  });
});
