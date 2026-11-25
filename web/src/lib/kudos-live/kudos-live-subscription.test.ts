import { describe, expect, it, vi } from "vitest";
import { createKudosLiveSubscription, type RealtimeLike } from "./kudos-live-subscription";

function fakeRealtime() {
  const channels: {
    name: string;
    handler?: (payload: { new: Record<string, unknown> }) => void;
    status?: (status: string) => void;
    removed: boolean;
  }[] = [];
  const realtime: RealtimeLike = {
    channel(name) {
      const entry: (typeof channels)[number] = { name, removed: false };
      channels.push(entry);
      const channel = {
        on(_type: string, _filter: unknown, handler: typeof entry.handler) {
          entry.handler = handler;
          return channel;
        },
        subscribe(callback?: (status: string) => void) {
          entry.status = callback;
          return channel;
        },
      };
      return { channel, remove: () => void (entry.removed = true) };
    },
  };
  return { realtime, channels };
}

describe("createKudosLiveSubscription", () => {
  it("subscribes once per filter set and passes inserted ids with the filters", () => {
    const { realtime, channels } = fakeRealtime();
    const onInsert = vi.fn();
    const live = createKudosLiveSubscription(realtime, onInsert);
    live.setFilters({ hashtagId: "h1" });
    live.setFilters({ hashtagId: "h1" });
    expect(channels).toHaveLength(1);
    channels[0].handler?.({ new: { id: "k9" } });
    expect(onInsert).toHaveBeenCalledWith("k9", { hashtagId: "h1" });
  });

  it("tears down and re-subscribes when the filters change", () => {
    const { realtime, channels } = fakeRealtime();
    const live = createKudosLiveSubscription(realtime, vi.fn());
    live.setFilters({});
    live.setFilters({ departmentId: "d1" });
    expect(channels).toHaveLength(2);
    expect(channels[0].removed).toBe(true);
    expect(channels[1].removed).toBe(false);
  });

  it("ignores events without an id and stops on demand", () => {
    const { realtime, channels } = fakeRealtime();
    const onInsert = vi.fn();
    const live = createKudosLiveSubscription(realtime, onInsert);
    live.setFilters({});
    channels[0].handler?.({ new: {} });
    expect(onInsert).not.toHaveBeenCalled();
    live.stop();
    expect(channels[0].removed).toBe(true);
    channels[0].handler?.({ new: { id: "late" } });
    expect(onInsert).not.toHaveBeenCalled();
  });
});

describe("createKudosLiveSubscription onReady", () => {
  it("reports each (re)join of the current channel only", () => {
    const { realtime, channels } = fakeRealtime();
    const onReady = vi.fn();
    const live = createKudosLiveSubscription(realtime, vi.fn(), onReady);
    live.setFilters({});
    live.setFilters({ hashtagId: "h1" });
    channels[0].status?.("SUBSCRIBED");
    channels[1].status?.("CHANNEL_ERROR");
    channels[1].status?.("SUBSCRIBED");
    expect(onReady).toHaveBeenCalledTimes(1);
    expect(onReady).toHaveBeenCalledWith({ hashtagId: "h1" });
  });
});
