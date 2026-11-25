"use client";

import type { KudosMessages } from "@/i18n/kudos-messages";
import type { KudosCursor, KudosFilters } from "@/lib/kudos/kudos-types";
import type { KudosCardView } from "@/lib/kudos-live/kudos-card-view";
import { KudosPostCard } from "./kudos-post-card";
import { useKudosFeed } from "./use-kudos-feed";

type KudosFeedProps = {
  initial: { items: KudosCardView[]; nextCursor: KudosCursor | null };
  filters: KudosFilters;
  messages: KudosMessages;
};

/** C.2 Danh sách lời cảm ơn: live feed with infinite scroll, empty and error states. */
export function KudosFeed({ initial, filters, messages }: KudosFeedProps) {
  const { items, status, retry, sentinelRef } = useKudosFeed({ initial, filters });

  if (items.length === 0 && status !== "loading") {
    return <p className="w-full py-10 text-center text-xl font-bold text-white">{messages.empty}</p>;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <ul className="flex w-full flex-col gap-6">
        {items.map((card) => (
          <li key={card.id}>
            <KudosPostCard card={card} filters={filters} messages={messages} />
          </li>
        ))}
      </ul>
      <div ref={sentinelRef} aria-hidden="true" className="h-px" />
      {status === "loading" ? (
        <p role="status" className="text-center text-base font-bold text-[#999]">
          {messages.loadingMore}
        </p>
      ) : null}
      {status === "error" ? (
        <div role="alert" className="flex flex-col items-center gap-3 text-center text-base font-bold text-white">
          <p>{messages.loadError}</p>
          <button type="button" onClick={() => void retry()} className="rounded border border-brand-border px-4 py-2 text-brand-accent hover:bg-brand-accent/10">
            {messages.retry}
          </button>
        </div>
      ) : null}
    </div>
  );
}
