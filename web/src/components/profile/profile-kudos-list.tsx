"use client";

import { useKudosLikes } from "@/components/kudos/kudos-likes-provider";
import { KudosPostCard } from "@/components/kudos/kudos-post-card";
import type { KudosMessages } from "@/i18n/kudos-messages";
import type { KudosCursor } from "@/lib/kudos/kudos-types";
import type { ProfileKudosBox } from "@/lib/kudos/profile-queries";
import type { KudosCardView } from "@/lib/kudos-live/kudos-card-view";
import { useProfileKudos } from "./use-profile-kudos";

type ProfileKudosListProps = {
  userId: string;
  box: ProfileKudosBox;
  initial: { items: KudosCardView[]; nextCursor: KudosCursor | null };
  emptyMessage: string;
  messages: KudosMessages;
};

const NO_FILTERS = {};

/** D Post all: the owner's received or sent kudos, Live board cards with the like toggle. */
export function ProfileKudosList({ userId, box, initial, emptyMessage, messages }: ProfileKudosListProps) {
  const { items, status, retry, sentinelRef } = useProfileKudos({ userId, box, initial });
  const likes = useKudosLikes();

  if (items.length === 0 && status !== "loading") {
    return <p className="w-full py-10 text-center text-xl font-bold text-white">{emptyMessage}</p>;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <ul className="flex w-full flex-col gap-6">
        {items.map((card) => (
          <li key={card.id}>
            <KudosPostCard
              card={likes.view(card)}
              filters={NO_FILTERS}
              messages={messages}
              onToggleLike={likes.toggle}
              likePending={likes.isPending(card.id)}
            />
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
