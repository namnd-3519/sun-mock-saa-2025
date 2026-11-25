"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getKudosById, listKudosFeed } from "@/lib/kudos/kudos-queries";
import type { KudosClient, KudosCursor, KudosFilters } from "@/lib/kudos/kudos-types";
import { withKudosImageUrls, type KudosCardView } from "@/lib/kudos-live/kudos-card-view";
import { appendPage, mergeFreshHead, prependKudos } from "@/lib/kudos-live/kudos-feed-state";
import {
  createKudosLiveSubscription,
  type ChannelLike,
  type RealtimeLike,
} from "@/lib/kudos-live/kudos-live-subscription";
import { createSupabaseBrowserClient } from "@/lib/supabase/create-supabase-browser-client";

export const FEED_PAGE_SIZE = 10;

export type FeedStatus = "idle" | "loading" | "error" | "done";

type UseKudosFeedOptions = {
  initial: { items: KudosCardView[]; nextCursor: KudosCursor | null };
  filters: KudosFilters;
};

function realtimeOf(client: KudosClient): RealtimeLike {
  return {
    channel(name) {
      const channel = client.channel(name);
      // RealtimeChannel's overloaded `on` is wider than ChannelLike; only INSERT is used.
      return { channel: channel as unknown as ChannelLike, remove: () => void client.removeChannel(channel) };
    },
  };
}

/**
 * All Kudos feed: infinite scroll (keyset cursor) plus Realtime inserts merged on top.
 * The caller remounts it (key) when the filters change.
 */
export function useKudosFeed({ initial, filters: filtersProp }: UseKudosFeedOptions) {
  const client = useMemo(() => createSupabaseBrowserClient(), []);
  // Frozen for this mount: a filter change remounts the feed (key), new prop objects do not.
  const [filters] = useState(filtersProp);
  const [items, setItems] = useState(initial.items);
  const [cursor, setCursor] = useState(initial.nextCursor);
  const [status, setStatus] = useState<FeedStatus>(initial.nextCursor ? "idle" : "done");
  const busy = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (busy.current || !cursor) return;
    busy.current = true;
    setStatus("loading");
    try {
      const page = await listKudosFeed(client, { filters, cursor, limit: FEED_PAGE_SIZE });
      const views = await withKudosImageUrls(client, page.items);
      setItems((current) => appendPage(current, views));
      setCursor(page.nextCursor);
      setStatus(page.nextCursor ? "idle" : "done");
    } catch {
      setStatus("error");
    } finally {
      busy.current = false;
    }
  }, [client, cursor, filters]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || status !== "idle") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) void loadMore();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore, status]);

  useEffect(() => {
    let cancelled = false;
    const onInsert = async (id: string) => {
      // The event only carries the id: refetch through kudos_feed (masked sender, filters).
      const card = await getKudosById(client, id, filters);
      if (!card || cancelled) return;
      const [view] = await withKudosImageUrls(client, [card]);
      if (view && !cancelled) setItems((current) => prependKudos(current, view));
    };
    const onReady = async () => {
      const page = await listKudosFeed(client, { filters, limit: FEED_PAGE_SIZE });
      const views = await withKudosImageUrls(client, page.items);
      if (!cancelled) setItems((current) => mergeFreshHead(current, views));
    };
    const live = createKudosLiveSubscription(
      realtimeOf(client),
      (id) => void onInsert(id).catch(() => undefined),
      () => void onReady().catch(() => undefined),
    );
    // Realtime must run as the signed-in user so RLS applies to change events.
    void (async () => {
      const { data } = await client.auth.getSession();
      if (data.session) await client.realtime.setAuth(data.session.access_token);
      if (!cancelled) live.setFilters(filters);
    })();
    return () => {
      cancelled = true;
      live.stop();
    };
  }, [client, filters]);

  return { items, status, retry: loadMore, sentinelRef };
}
