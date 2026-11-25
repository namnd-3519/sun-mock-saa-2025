import type { ChangePayload, RealtimeLike } from "./kudos-live-subscription";

const LIKE_CHANGES = { event: "*", schema: "public", table: "kudos_likes" } as const;

function kudosIdOf(payload: ChangePayload): string | null {
  const id = payload.new?.kudos_id ?? payload.old?.kudos_id;
  return typeof id === "string" ? id : null;
}

/**
 * Live like counts: one Realtime channel for every like and unlike. The event only names the
 * kudos; the caller refetches its count through kudos_feed. Returns the stop function.
 */
export function subscribeKudosLikes(realtime: RealtimeLike, onChange: (kudosId: string) => void): () => void {
  let active = true;
  const { channel, remove } = realtime.channel("kudos-likes-live");
  channel
    .on("postgres_changes", LIKE_CHANGES, (payload) => {
      const id = kudosIdOf(payload);
      if (active && id) onChange(id);
    })
    .subscribe();
  return () => {
    active = false;
    remove();
  };
}
