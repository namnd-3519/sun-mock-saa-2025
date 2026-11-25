import { describe, expect, it } from "vitest";
import { createFakeKudosClient } from "./fake-kudos-client";
import { createKudosImageUrls, buildKudosImagePath } from "./kudos-images";
import { createKudos, likeKudos, unlikeKudos } from "./kudos-mutations";
import { escapeLikePattern, searchProfiles } from "./reference-data";
import { getMyKudosStats, openSecretBox } from "./secret-box";

const sender = "u1";

describe("createKudos", () => {
  it("calls create_kudos with trimmed optional fields and unique hashtags", async () => {
    const { client, calls } = createFakeKudosClient({ data: "new-id" });
    const id = await createKudos(client, sender, {
      recipientId: "u2",
      content: "Thanks",
      hashtagIds: ["h1", "h1", "h2"],
      isAnonymous: true,
      anonymousName: "  Fan ",
      title: "  ",
    });
    expect(id).toBe("new-id");
    expect(calls[0]).toEqual({
      method: "rpc",
      args: [
        "create_kudos",
        {
          p_recipient_id: "u2",
          p_content: "Thanks",
          p_hashtag_ids: ["h1", "h2"],
          p_image_paths: [],
          p_is_anonymous: true,
          p_anonymous_name: "Fan",
        },
      ],
    });
  });

  it("rejects invalid input before calling the server", async () => {
    const { client, calls } = createFakeKudosClient();
    await expect(
      createKudos(client, sender, { recipientId: sender, content: "x", hashtagIds: ["h1"] }),
    ).rejects.toMatchObject({ code: "invalid_recipient" });
    expect(calls).toEqual([]);
  });

  it("maps server errors", async () => {
    const { client } = createFakeKudosClient({ error: { code: "22023", message: "kudos.invalid_hashtags" } });
    await expect(
      createKudos(client, sender, { recipientId: "u2", content: "x", hashtagIds: ["h1"] }),
    ).rejects.toMatchObject({ code: "invalid_hashtags" });
  });
});

describe("likes", () => {
  it("inserts only the kudos id (server sets user and weight)", async () => {
    const { client, calls } = createFakeKudosClient();
    await likeKudos(client, "k1");
    expect(calls).toEqual([
      { method: "from", args: ["kudos_likes"] },
      { method: "insert", args: [{ kudos_id: "k1" }] },
    ]);
  });

  it("maps a duplicate like", async () => {
    const { client } = createFakeKudosClient({ error: { code: "23505", message: "duplicate" } });
    await expect(likeKudos(client, "k1")).rejects.toMatchObject({ code: "already_liked" });
  });

  it("deletes by kudos id", async () => {
    const { client, calls } = createFakeKudosClient();
    await unlikeKudos(client, "k1");
    expect(calls.map((c) => c.method)).toEqual(["from", "delete", "eq"]);
  });
});

describe("profile search", () => {
  it("escapes wildcards and never selects email", async () => {
    const { client, calls } = createFakeKudosClient({ data: [] });
    await searchProfiles(client, " 50%_off ");
    expect(calls[1].args[0]).not.toContain("email");
    expect(calls[2]).toEqual({ method: "ilike", args: ["full_name", "%50\\%\\_off%"] });
    expect(escapeLikePattern("a\\b")).toBe("a\\\\b");
  });

  it("skips empty queries and rejects queries over 100 chars", async () => {
    const { client, calls } = createFakeKudosClient();
    expect(await searchProfiles(client, "  ")).toEqual([]);
    await expect(searchProfiles(client, "x".repeat(101))).rejects.toMatchObject({ code: "invalid_search" });
    expect(calls).toEqual([]);
  });
});

describe("secret box and stats", () => {
  it("returns the opened badge", async () => {
    const { client } = createFakeKudosClient({ data: [{ box_id: "b1", badge: "revival" }] });
    expect(await openSecretBox(client)).toEqual({ boxId: "b1", badge: "revival" });
  });

  it("maps no unopened box", async () => {
    const { client } = createFakeKudosClient({ error: { code: "P0002", message: "secret_box.none_unopened" } });
    await expect(openSecretBox(client)).rejects.toMatchObject({ code: "no_unopened_box" });
  });

  it("maps stats", async () => {
    const { client } = createFakeKudosClient({
      data: [{ kudos_received: 1, kudos_sent: 2, hearts_received: 3, boxes_opened: 4, boxes_unopened: 5 }],
    });
    expect(await getMyKudosStats(client)).toEqual({
      kudosReceived: 1,
      kudosSent: 2,
      heartsReceived: 3,
      boxesOpened: 4,
      boxesUnopened: 5,
    });
  });
});

describe("kudos images", () => {
  it("builds a path in the uploader's folder", () => {
    expect(buildKudosImagePath("u1", "Photo.JPG", "abc")).toBe("u1/abc.jpg");
    expect(buildKudosImagePath("u1", "noext", "abc")).toBe("u1/abc.img");
  });

  it("returns signed URLs in input order", async () => {
    const { client, calls } = createFakeKudosClient({
      data: [
        { path: "u1/b.png", signedUrl: "https://s/b" },
        { path: "u1/a.png", signedUrl: "https://s/a" },
      ],
    });
    expect(await createKudosImageUrls(client, ["u1/a.png", "u1/b.png"])).toEqual(["https://s/a", "https://s/b"]);
    expect(calls[0].args).toEqual(["kudos-images", ["u1/a.png", "u1/b.png"], 3600]);
  });
});
