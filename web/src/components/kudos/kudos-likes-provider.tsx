"use client";

import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { getKudosLikeState } from "@/lib/kudos/kudos-queries";
import type { KudosCard } from "@/lib/kudos/kudos-types";
import { createLikeStore, writeKudosLike, type LikeSnapshot, type LikeStore } from "@/lib/kudos-live/kudos-like-store";
import { subscribeKudosLikes } from "@/lib/kudos-live/kudos-likes-subscription";
import { authorizeRealtime, realtimeOf } from "@/lib/kudos-live/supabase-realtime-adapter";
import { createSupabaseBrowserClient } from "@/lib/supabase/create-supabase-browser-client";

type LikesContextValue = { snapshot: LikeSnapshot; toggle: LikeStore["toggle"] };

const LikesContext = createContext<LikesContextValue | null>(null);
const ERROR_TOAST_MS = 3000;

/**
 * One like state for every card on the Live board (Highlight + All Kudos): optimistic toggle,
 * rollback with a toast on failure, and live counts from other Sunners through Realtime.
 */
export function KudosLikesProvider({ errorMessage, children }: { errorMessage: string; children: ReactNode }) {
  const client = useMemo(() => createSupabaseBrowserClient(), []);
  // > 0 while the error toast shows; bumped by each failure so the timer restarts.
  const [errorToast, setErrorToast] = useState(0);
  const store = useMemo(
    () => createLikeStore((id, like) => writeKudosLike(client, id, like), () => setErrorToast((count) => count + 1)),
    [client],
  );
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

  useEffect(() => {
    let stop: (() => void) | null = null;
    let cancelled = false;
    const refresh = async (id: string) => {
      const state = await getKudosLikeState(client, id);
      if (state && !cancelled) store.sync(id, state);
    };
    void (async () => {
      await authorizeRealtime(client);
      if (cancelled) return;
      stop = subscribeKudosLikes(realtimeOf(client), (id) => void refresh(id).catch(() => undefined));
    })();
    return () => {
      cancelled = true;
      stop?.();
    };
  }, [client, store]);

  useEffect(() => {
    if (!errorToast) return;
    const timer = window.setTimeout(() => setErrorToast(0), ERROR_TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [errorToast]);

  const value = useMemo(() => ({ snapshot, toggle: store.toggle }), [snapshot, store]);
  return (
    <LikesContext.Provider value={value}>
      {children}
      {errorToast ? (
        <p
          role="alert"
          className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-brand-border bg-brand-container-2 px-6 py-3 text-base font-bold text-white shadow-lg"
        >
          {errorMessage}
        </p>
      ) : null}
    </LikesContext.Provider>
  );
}

/** Card view with the shared like state applied; read-only hearts outside the provider. */
export function useKudosLikes() {
  const context = useContext(LikesContext);
  return useMemo(
    () => ({
      view<T extends KudosCard>(card: T): T {
        const state = context?.snapshot.states[card.id];
        return state ? { ...card, ...state } : card;
      },
      isPending: (id: string) => Boolean(context?.snapshot.pending[id]),
      toggle: context ? (card: KudosCard) => void context.toggle(card) : undefined,
    }),
    [context],
  );
}
