import Link from "next/link";
import type { KudosMessages } from "@/i18n/kudos-messages";
import type { KudosFilters } from "@/lib/kudos/kudos-types";
import type { KudosCardView } from "@/lib/kudos-live/kudos-card-view";
import { formatKudosTime } from "@/lib/kudos-live/kudos-format";
import { kudosDetailHref } from "@/lib/kudos-live/kudos-links";
import { CopyLinkButton } from "./copy-link-button";
import { KudosCardDivider, KudosPeopleRow, type KudosCardSlots } from "./kudos-card-parts";
import { KudosHashtags } from "./kudos-hashtags";
import { KudosHearts } from "./kudos-hearts";
import { IconArrowUpRight } from "@/components/icons/icon-arrow-up-right";

type HighlightKudosCardProps = KudosCardSlots & {
  card: KudosCardView;
  filters: KudosFilters;
  messages: KudosMessages;
};

/** B.3 KUDO - Highlight: carousel card, content clamped to 3 lines. */
export function HighlightKudosCard({ card, filters, messages, onToggleLike, likePending }: HighlightKudosCardProps) {
  return (
    <article className="flex w-full flex-col gap-4 rounded-2xl border-4 border-brand-accent bg-[#fff8e1] px-4 pt-6 pb-4 md:px-6">
      <KudosPeopleRow card={card} messages={messages} />
      <KudosCardDivider />
      <div className="flex w-full flex-col gap-4">
        <time dateTime={card.createdAt} className="text-base leading-6 font-bold tracking-[0.5px] text-[#999]">
          {formatKudosTime(card.createdAt)}
        </time>
        {card.title ? (
          <p className="text-center text-base leading-6 font-bold tracking-[0.5px] text-brand-bg">
            {card.title}
          </p>
        ) : null}
        <Link
          href={kudosDetailHref(card.id)}
          className="block h-[120px] rounded-xl border border-brand-accent bg-brand-accent/40 px-6 py-4"
        >
          <p className="line-clamp-3 text-justify text-xl leading-8 font-bold text-brand-bg">{card.content}</p>
        </Link>
        <KudosHashtags hashtags={card.hashtags} filters={filters} />
      </div>
      <KudosCardDivider />
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CopyLinkButton kudosId={card.id} label={messages.copyLink} copiedLabel={messages.copied} />
          <Link
            href={kudosDetailHref(card.id)}
            className="flex h-14 items-center gap-1 rounded p-4 text-base leading-6 font-bold tracking-[0.15px] text-brand-bg hover:bg-brand-accent/40"
          >
            {messages.details}
            <IconArrowUpRight />
          </Link>
        </div>
        <KudosHearts
          count={card.likeCount}
          liked={card.likedByMe}
          disabled={card.isMine || Boolean(likePending)}
          label={messages.hearts}
          onToggle={onToggleLike ? () => onToggleLike(card) : undefined}
        />
      </div>
    </article>
  );
}
