import { describe, expect, it } from "vitest";
import type { KudosClient } from "@/lib/kudos/kudos-types";
import type { KudosDraft } from "./kudos-draft";
import { submitKudosDraft } from "./submit-kudos-draft";

type Calls = { method: string; args: unknown[] }[];

function fakeClient(opts: { rpc?: { data?: unknown; error?: unknown }; uploadError?: unknown } = {}) {
  const calls: Calls = [];
  const client = {
    rpc: async (fn: string, args: unknown) => {
      calls.push({ method: "rpc", args: [fn, args] });
      return { data: opts.rpc?.data ?? null, error: opts.rpc?.error ?? null };
    },
    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, _file: unknown, options: unknown) => {
          calls.push({ method: "upload", args: [bucket, path, options] });
          return { data: opts.uploadError ? null : { path }, error: opts.uploadError ?? null };
        },
        remove: async (paths: string[]) => {
          calls.push({ method: "remove", args: [bucket, paths] });
          return { data: [], error: null };
        },
      }),
    },
  };
  return { client: client as unknown as KudosClient, calls };
}

const sender = "me";
const draft: KudosDraft = {
  recipient: { id: "u2", fullName: "An", avatarUrl: null, departmentId: null },
  title: "Hero",
  content: "Thanks",
  hashtags: [{ id: "h1", name: "teamwork" }],
  isAnonymous: false,
  anonymousName: "",
};
const image = { name: "Photo.PNG", type: "image/png", size: 10 } as File;
const ids = () => "fixed-id";

describe("submitKudosDraft", () => {
  it("uploads images into the sender folder, then calls create_kudos with their paths", async () => {
    const { client, calls } = fakeClient({ rpc: { data: "k1" } });
    await expect(submitKudosDraft(client, sender, draft, [image], ids)).resolves.toBe("k1");
    expect(calls).toEqual([
      { method: "upload", args: ["kudos-images", "me/fixed-id.png", { contentType: "image/png", upsert: false }] },
      {
        method: "rpc",
        args: [
          "create_kudos",
          {
            p_recipient_id: "u2",
            p_content: "Thanks",
            p_hashtag_ids: ["h1"],
            p_image_paths: ["me/fixed-id.png"],
            p_is_anonymous: false,
            p_title: "Hero",
          },
        ],
      },
    ]);
  });

  it("rejects an invalid draft without touching the server", async () => {
    const { client, calls } = fakeClient();
    await expect(submitKudosDraft(client, sender, { ...draft, title: "" }, [], ids)).rejects.toMatchObject({
      code: "invalid_title",
    });
    expect(calls).toEqual([]);
  });

  it("stops and cleans up when an image upload fails", async () => {
    const { client, calls } = fakeClient({ uploadError: { message: "too big" } });
    await expect(submitKudosDraft(client, sender, draft, [image], ids)).rejects.toMatchObject({
      code: "invalid_images",
    });
    expect(calls.map((c) => c.method)).toEqual(["upload"]);
  });

  it("removes uploaded images when create_kudos fails", async () => {
    const { client, calls } = fakeClient({
      rpc: { error: { code: "22023", message: "kudos.invalid_recipient" } },
    });
    await expect(submitKudosDraft(client, sender, draft, [image], ids)).rejects.toMatchObject({
      code: "invalid_recipient",
    });
    expect(calls.at(-1)).toEqual({ method: "remove", args: ["kudos-images", ["me/fixed-id.png"]] });
  });
});
