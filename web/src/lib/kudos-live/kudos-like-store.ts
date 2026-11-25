import { KudosDataError } from "@/lib/kudos/kudos-error";
import { likeKudos, unlikeKudos } from "@/lib/kudos/kudos-mutations";
import type { KudosCard, KudosClient } from "@/lib/kudos/kudos-types";

export type LikeState = Pick<KudosCard, "likeCount" | "likedByMe">;
export type LikeCard = LikeState & Pick<KudosCard, "id" | "isMine">;
export type LikeSnapshot = {
  /** Like state per kudos id, overriding what the server rendered. */
  states: Record<string, LikeState>;
  /** Kudos whose toggle is in flight (heart temporarily disabled, C.4). */
  pending: Record<string, true>;
};
export type LikeWriter = (kudosId: string, like: boolean) => Promise<void>;
export type ToggleOutcome = "done" | "ignored" | "failed";

/** Writes the like; a duplicate like (23505) already holds, so it counts as success. */
export async function writeKudosLike(client: KudosClient, kudosId: string, like: boolean): Promise<void> {
  if (!like) return unlikeKudos(client, kudosId);
  try {
    await likeKudos(client, kudosId);
  } catch (error) {
    if (error instanceof KudosDataError && error.code === "already_liked") return;
    throw error;
  }
}

function flip(state: LikeState): LikeState {
  return {
    likedByMe: !state.likedByMe,
    likeCount: Math.max(0, state.likeCount + (state.likedByMe ? -1 : 1)),
  };
}

/**
 * Like state shared by every card on the Live board: optimistic toggle with rollback, one write
 * in flight per kudos, and server snapshots (Realtime) applied when no toggle is pending.
 * Shaped for useSyncExternalStore.
 */
export function createLikeStore(write: LikeWriter, onError?: (error: unknown) => void) {
  let snapshot: LikeSnapshot = { states: {}, pending: {} };
  const listeners = new Set<() => void>();

  function commit(id: string, state: LikeState, pending: boolean) {
    const nextPending = { ...snapshot.pending };
    if (pending) nextPending[id] = true;
    else delete nextPending[id];
    snapshot = { states: { ...snapshot.states, [id]: state }, pending: nextPending };
    listeners.forEach((listener) => listener());
  }

  async function toggle(card: LikeCard): Promise<ToggleOutcome> {
    if (card.isMine || snapshot.pending[card.id]) return "ignored";
    const before = snapshot.states[card.id] ?? { likeCount: card.likeCount, likedByMe: card.likedByMe };
    const after = flip(before);
    commit(card.id, after, true);
    try {
      await write(card.id, after.likedByMe);
      commit(card.id, after, false);
      return "done";
    } catch (error) {
      commit(card.id, before, false);
      onError?.(error);
      return "failed";
    }
  }

  function sync(id: string, state: LikeState) {
    if (!snapshot.pending[id]) commit(id, state, false);
  }

  return {
    toggle,
    sync,
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
  };
}

export type LikeStore = ReturnType<typeof createLikeStore>;
