import { describe, expect, it, vi } from "vitest";
import type { KudosClient } from "@/lib/kudos/kudos-types";
import { authorizeRealtime, realtimeOf } from "./supabase-realtime-adapter";

function fakeClient(session: { access_token: string } | null) {
  const channel = { on: vi.fn(), subscribe: vi.fn() };
  const client = {
    channel: vi.fn(() => channel),
    removeChannel: vi.fn(async () => "ok"),
    auth: { getSession: vi.fn(async () => ({ data: { session } })) },
    realtime: { setAuth: vi.fn(async () => undefined) },
  };
  return { client, channel, kudosClient: client as unknown as KudosClient };
}

describe("realtimeOf", () => {
  it("opens a named channel and removes that same channel", () => {
    const { client, channel, kudosClient } = fakeClient(null);
    const opened = realtimeOf(kudosClient).channel("kudos-live");
    expect(client.channel).toHaveBeenCalledWith("kudos-live");
    expect(opened.channel).toBe(channel);
    expect(client.removeChannel).not.toHaveBeenCalled();
    opened.remove();
    expect(client.removeChannel).toHaveBeenCalledWith(channel);
  });
});

describe("authorizeRealtime", () => {
  it("passes the signed-in user's access token to Realtime", async () => {
    const { client, kudosClient } = fakeClient({ access_token: "jwt-1" });
    await authorizeRealtime(kudosClient);
    expect(client.realtime.setAuth).toHaveBeenCalledWith("jwt-1");
  });

  it("leaves Realtime alone without a session", async () => {
    const { client, kudosClient } = fakeClient(null);
    await authorizeRealtime(kudosClient);
    expect(client.realtime.setAuth).not.toHaveBeenCalled();
  });
});
