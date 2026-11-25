import { describe, expect, it, vi } from "vitest";
import type { KudosCard, KudosClient } from "@/lib/kudos/kudos-types";
import { withKudosImageUrls } from "./kudos-card-view";

const card = (id: string, imagePaths: string[]) => ({ id, imagePaths }) as unknown as KudosCard;

function storageClient(signed: Record<string, string>) {
  const createSignedUrls = vi.fn(async (paths: string[]) => ({
    data: paths.flatMap((path) => (signed[path] ? [{ path, signedUrl: signed[path] }] : [])),
    error: null,
  }));
  const client = { storage: { from: () => ({ createSignedUrls }) } } as unknown as KudosClient;
  return { client, createSignedUrls };
}

describe("withKudosImageUrls", () => {
  it("signs all images in one call and hands each card its own urls in order", async () => {
    const { client, createSignedUrls } = storageClient({ a: "A", b: "B", c: "C" });
    const views = await withKudosImageUrls(client, [card("k1", ["a", "b"]), card("k2", []), card("k3", ["c"])]);
    expect(createSignedUrls).toHaveBeenCalledTimes(1);
    expect(createSignedUrls).toHaveBeenCalledWith(["a", "b", "c"], 3600);
    expect(views.map((view) => [view.id, view.imageUrls])).toEqual([
      ["k1", ["A", "B"]],
      ["k2", []],
      ["k3", ["C"]],
    ]);
  });

  it("drops images that could not be signed without shifting the next card", async () => {
    const { client } = storageClient({ b: "B", c: "C" });
    const views = await withKudosImageUrls(client, [card("k1", ["a", "b"]), card("k2", ["c"])]);
    expect(views.map((view) => view.imageUrls)).toEqual([["B"], ["C"]]);
  });

  it("skips storage entirely when no card has images", async () => {
    const { client, createSignedUrls } = storageClient({});
    const views = await withKudosImageUrls(client, [card("k1", [])]);
    expect(createSignedUrls).not.toHaveBeenCalled();
    expect(views[0].imageUrls).toEqual([]);
  });
});
