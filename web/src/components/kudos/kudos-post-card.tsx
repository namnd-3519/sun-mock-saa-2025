import type { KudosMessages } from "@/i18n/kudos-messages";
import type { KudosFilters } from "@/lib/kudos/kudos-types";
import type { KudosCardView } from "@/lib/kudos-live/kudos-card-view";
import { formatKudosTime } from "@/lib/kudos-live/kudos-format";
import { kudosAnchorId } from "@/lib/kudos-live/kudos-links";
import { CopyLinkButton } from "./copy-link-button";
import { KudosCardDivider, KudosPeopleRow, type KudosCardSlots } from "./kudos-card-parts";
import { KudosHashtags } from "./kudos-hashtags";
import { KudosHearts } from "./kudos-hearts";

const MAX_IMAGES = 5;

type KudosPostCardProps = KudosCardSlots & {
  card: KudosCardView;
  filters: KudosFilters;
  messages: KudosMessages;
};

/** C.3 KUDO Post: one kudos in the All Kudos feed. */
export function KudosPostCard({ card, filters, messages, onToggleLike, likePending }: KudosPostCardProps) {
  return (
    <article
      id={kudosAnchorId(card.id)}
      className="flex w-full scroll-mt-28 flex-col gap-4 rounded-3xl bg-[#fff8e1] px-4 pt-6 pb-4 md:px-10 md:pt-10"
    >
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
        <div className="rounded-xl border border-brand-accent bg-brand-accent/40 px-6 py-4">
          <p className="line-clamp-5 text-justify text-xl leading-8 font-bold whitespace-pre-line text-brand-bg">
            {card.content}
          </p>
        </div>
        {card.imageUrls.length > 0 ? (
          <ul className="flex flex-wrap items-center gap-4">
            {card.imageUrls.slice(0, MAX_IMAGES).map((url, index) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noreferrer" className="block">
                  {/* Signed Supabase Storage URL: next/image is not configured for it. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`${index + 1}`}
                    className="size-[88px] rounded-[18px] border border-brand-border bg-white object-cover"
                  />
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        <KudosHashtags hashtags={card.hashtags} filters={filters} />
      </div>
      <KudosCardDivider />
      <div className="flex w-full items-center justify-between gap-6">
        <CopyLinkButton kudosId={card.id} label={messages.copyLink} copiedLabel={messages.copied} />
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
