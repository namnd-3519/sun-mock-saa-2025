import { describe, expect, it, vi } from "vitest";
import { KudosDataError } from "@/lib/kudos/kudos-error";
import { createFakeKudosClient } from "@/lib/kudos/fake-kudos-client";
import { createLikeStore, writeKudosLike, type LikeCard } from "./kudos-like-store";

const card: LikeCard = { id: "k1", likeCount: 3, likedByMe: false, isMine: false };

function deferred() {
  let resolve!: () => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("writeKudosLike", () => {
  it("inserts a like and deletes on unlike", async () => {
    const liked = createFakeKudosClient();
    await writeKudosLike(liked.client, "k1", true);
    expect(liked.calls.map((call) => call.method)).toEqual(["from", "insert"]);
    const unliked = createFakeKudosClient();
    await writeKudosLike(unliked.client, "k1", false);
    expect(unliked.calls.map((call) => call.method)).toEqual(["from", "delete", "eq"]);
  });

  it("treats a duplicate like (23505) as success", async () => {
    const { client } = createFakeKudosClient({ error: { code: "23505", message: "duplicate key" } });
    await expect(writeKudosLike(client, "k1", true)).resolves.toBeUndefined();
  });

  it("rejects when the caller is not signed in (anon has no grant)", async () => {
    const { client } = createFakeKudosClient({ error: { code: "42501", message: "permission denied" } });
    await expect(writeKudosLike(client, "k1", true)).rejects.toMatchObject({ code: "forbidden" });
  });
});

describe("createLikeStore", () => {
  it("likes optimistically, marks the kudos pending, then settles", async () => {
    const write = deferred();
    const store = createLikeStore(vi.fn(() => write.promise));
    const done = store.toggle(card);
    expect(store.getSnapshot().states.k1).toEqual({ likeCount: 4, likedByMe: true });
    expect(store.getSnapshot().pending.k1).toBe(true);
    write.resolve();
    await expect(done).resolves.toBe("done");
    expect(store.getSnapshot().pending.k1).toBeUndefined();
    expect(store.getSnapshot().states.k1).toEqual({ likeCount: 4, likedByMe: true });
  });

  it("unlikes a liked kudos", async () => {
    const write = vi.fn(async () => undefined);
    const store = createLikeStore(write);
    await store.toggle({ ...card, likeCount: 1, likedByMe: true });
    expect(write).toHaveBeenCalledWith("k1", false);
    expect(store.getSnapshot().states.k1).toEqual({ likeCount: 0, likedByMe: false });
  });

  it("ignores a second toggle while the first is in flight (double-like)", async () => {
    const write = deferred();
    const writer = vi.fn(() => write.promise);
    const store = createLikeStore(writer);
    const first = store.toggle(card);
    await expect(store.toggle(card)).resolves.toBe("ignored");
    write.resolve();
    await first;
    expect(writer).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot().states.k1).toEqual({ likeCount: 4, likedByMe: true });
  });

  it("toggles from the stored state, not the stale card, after settling", async () => {
    const writer = vi.fn(async () => undefined);
    const store = createLikeStore(writer);
    await store.toggle(card);
    await store.toggle(card);
    expect(writer.mock.calls).toEqual([["k1", true], ["k1", false]]);
    expect(store.getSnapshot().states.k1).toEqual({ likeCount: 3, likedByMe: false });
  });

  it("rolls back and reports the error when the write fails (unauthenticated)", async () => {
    const onError = vi.fn();
    const error = new KudosDataError("forbidden");
    const store = createLikeStore(vi.fn(async () => Promise.reject(error)), onError);
    await expect(store.toggle(card)).resolves.toBe("failed");
    expect(store.getSnapshot().states.k1).toEqual({ likeCount: 3, likedByMe: false });
    expect(store.getSnapshot().pending.k1).toBeUndefined();
    expect(onError).toHaveBeenCalledWith(error);
  });

  it("never lets the sender like their own kudos", async () => {
    const writer = vi.fn(async () => undefined);
    const store = createLikeStore(writer);
    await expect(store.toggle({ ...card, isMine: true })).resolves.toBe("ignored");
    expect(writer).not.toHaveBeenCalled();
  });

  it("applies server snapshots, but not over a pending toggle", async () => {
    const write = deferred();
    const store = createLikeStore(vi.fn(() => write.promise));
    store.sync("k2", { likeCount: 9, likedByMe: false });
    expect(store.getSnapshot().states.k2).toEqual({ likeCount: 9, likedByMe: false });
    const pending = store.toggle(card);
    store.sync("k1", { likeCount: 3, likedByMe: false });
    expect(store.getSnapshot().states.k1).toEqual({ likeCount: 4, likedByMe: true });
    write.resolve();
    await pending;
  });

  it("notifies subscribers and keeps the count at zero or above", async () => {
    const store = createLikeStore(vi.fn(async () => undefined));
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    await store.toggle({ ...card, likeCount: 0, likedByMe: true });
    expect(store.getSnapshot().states.k1.likeCount).toBe(0);
    expect(listener).toHaveBeenCalled();
    unsubscribe();
  });
});
