"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KudosCursor } from "@/lib/kudos/kudos-types";
import { listProfileKudos, type ProfileKudosBox } from "@/lib/kudos/profile-queries";
import { withKudosImageUrls, type KudosCardView } from "@/lib/kudos-live/kudos-card-view";
import { appendPage } from "@/lib/kudos-live/kudos-feed-state";
import { PROFILE_PAGE_SIZE } from "@/lib/profile/load-own-profile";
import { createSupabaseBrowserClient } from "@/lib/supabase/create-supabase-browser-client";
import type { FeedStatus } from "@/components/kudos/use-kudos-feed";

type UseProfileKudosOptions = {
  userId: string;
  box: ProfileKudosBox;
  initial: { items: KudosCardView[]; nextCursor: KudosCursor | null };
};

/** Profile D: infinite scroll (keyset cursor) over the owner's received or sent kudos. */
export function useProfileKudos({ userId, box, initial }: UseProfileKudosOptions) {
  const client = useMemo(() => createSupabaseBrowserClient(), []);
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
      const page = await listProfileKudos(client, { userId, box, cursor, limit: PROFILE_PAGE_SIZE });
      const views = await withKudosImageUrls(client, page.items);
      setItems((current) => appendPage(current, views));
      setCursor(page.nextCursor);
      setStatus(page.nextCursor ? "idle" : "done");
    } catch {
      setStatus("error");
    } finally {
      busy.current = false;
    }
  }, [box, client, cursor, userId]);

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

  return { items, status, retry: loadMore, sentinelRef };
}
