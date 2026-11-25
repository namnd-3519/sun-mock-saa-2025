import { describe, expect, it, vi } from "vitest";
import type { ChangePayload, RealtimeLike } from "./kudos-live-subscription";
import { subscribeKudosLikes } from "./kudos-likes-subscription";

function fakeRealtime() {
  const state: { filter?: unknown; handler?: (payload: ChangePayload) => void; removed: boolean } = {
    removed: false,
  };
  const realtime: RealtimeLike = {
    channel() {
      const channel = {
        on(_type: string, filter: unknown, handler: (payload: ChangePayload) => void) {
          state.filter = filter;
          state.handler = handler;
          return channel;
        },
        subscribe: () => channel,
      };
      return { channel, remove: () => void (state.removed = true) };
    },
  };
  return { realtime, state };
}

describe("subscribeKudosLikes", () => {
  it("listens to every kudos_likes change and reports the kudos id", () => {
    const { realtime, state } = fakeRealtime();
    const onChange = vi.fn();
    subscribeKudosLikes(realtime, onChange);
    expect(state.filter).toEqual({ event: "*", schema: "public", table: "kudos_likes" });
    state.handler?.({ new: { kudos_id: "k1", user_id: "u1" } });
    state.handler?.({ new: {}, old: { kudos_id: "k2", user_id: "u1" } });
    state.handler?.({ new: {} });
    expect(onChange.mock.calls).toEqual([["k1"], ["k2"]]);
  });

  it("stops delivering events once stopped", () => {
    const { realtime, state } = fakeRealtime();
    const onChange = vi.fn();
    const stop = subscribeKudosLikes(realtime, onChange);
    stop();
    state.handler?.({ new: { kudos_id: "k1" } });
    expect(onChange).not.toHaveBeenCalled();
    expect(state.removed).toBe(true);
  });
});
