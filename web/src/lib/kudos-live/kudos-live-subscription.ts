import type { KudosFilters } from "@/lib/kudos/kudos-types";
import { kudosFiltersKey } from "./kudos-filters";

type InsertPayload = { new: Record<string, unknown> };

export type ChannelLike = {
  on(type: "postgres_changes", filter: object, handler: (payload: InsertPayload) => void): ChannelLike;
  subscribe(callback?: (status: string) => void): unknown;
};

/** Minimal Realtime surface (adapter over SupabaseClient; a fake in tests). */
export type RealtimeLike = { channel(name: string): { channel: ChannelLike; remove(): void } };

export type KudosLiveSubscription = { setFilters(filters: KudosFilters): void; stop(): void };

const INSERTS = { event: "INSERT", schema: "public", table: "kudos" } as const;

/**
 * One Realtime channel for new kudos, re-created whenever the filters change so a late event
 * from the previous filter set can never reach the current view.
 */
export function createKudosLiveSubscription(
  realtime: RealtimeLike,
  onInsert: (id: string, filters: KudosFilters) => void,
  /** Called each time the channel (re)joins, to catch up on kudos missed meanwhile. */
  onReady?: (filters: KudosFilters) => void,
): KudosLiveSubscription {
  let current: { key: string; remove(): void } | null = null;
  let serial = 0;

  function stop() {
    current?.remove();
    current = null;
  }

  function setFilters(filters: KudosFilters) {
    const key = kudosFiltersKey(filters);
    if (current?.key === key) return;
    stop();
    const token = { key, active: true };
    const { channel, remove } = realtime.channel(`kudos-live-${++serial}`);
    channel
      .on("postgres_changes", INSERTS, (payload) => {
        const id = payload.new.id;
        if (token.active && typeof id === "string") onInsert(id, filters);
      })
      .subscribe((status) => {
        if (token.active && status === "SUBSCRIBED") onReady?.(filters);
      });
    current = {
      key,
      remove: () => {
        token.active = false;
        remove();
      },
    };
  }

  return { setFilters, stop };
}
