"use client";

import { useState } from "react";
import type { KudosMessages } from "@/i18n/kudos-messages";
import type { KudosFilters } from "@/lib/kudos/kudos-types";
import type { KudosCardView } from "@/lib/kudos-live/kudos-card-view";
import { canGoNext, canGoPrev, clampSlide, slideLabel } from "@/lib/kudos-live/highlight-carousel";
import { HighlightKudosCard } from "./highlight-kudos-card";
import { IconChevronLeft, IconChevronRight } from "./kudos-icons";

type HighlightCarouselProps = { cards: KudosCardView[]; filters: KudosFilters; messages: KudosMessages };

// Card width 528px (B.3), narrower on phones; gap 24px (B.2.3).
const CARD = "min(528px, calc(100vw - 32px))";
const arrowClass =
  "flex items-center justify-center rounded p-2.5 text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30";

/** B.2 carousel + B.5 pager. Remounted (key) when the filters change, so it restarts at 1. */
export function HighlightCarousel({ cards, filters, messages }: HighlightCarouselProps) {
  const [index, setIndex] = useState(0);
  const total = cards.length;
  const go = (next: number) => setIndex(clampSlide(next, total));
  const prev = (size: number, className: string) => (
    <button type="button" onClick={() => go(index - 1)} disabled={!canGoPrev(index)} aria-label={messages.prev} className={className}>
      <IconChevronLeft size={size} />
    </button>
  );
  const next = (size: number, className: string) => (
    <button type="button" onClick={() => go(index + 1)} disabled={!canGoNext(index, total)} aria-label={messages.next} className={className}>
      <IconChevronRight size={size} />
    </button>
  );

  return (
    <div className="flex w-full flex-col gap-10" aria-roledescription="carousel">
      <div className="relative w-full overflow-hidden">
        <ul
          className="flex items-center gap-6 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(calc(50% - ${CARD} / 2 - ${index} * (${CARD} + 24px)))` }}
        >
          {cards.map((card, position) => (
            <li
              key={card.id}
              aria-hidden={position !== index}
              inert={position !== index}
              style={{ width: CARD }}
              className={`shrink-0 transition-opacity duration-500 ${position === index ? "opacity-100" : "opacity-40"}`}
            >
              <HighlightKudosCard card={card} filters={filters} messages={messages} />
            </li>
          ))}
        </ul>
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[400px] items-center bg-[linear-gradient(90deg,#00101a_50%,rgb(255_255_255/0)_100%)] pl-20 lg:flex">
          {prev(60, `${arrowClass} pointer-events-auto size-20`)}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[400px] items-center justify-end bg-[linear-gradient(270deg,#00101a_50%,rgb(255_255_255/0)_100%)] pr-10 lg:flex">
          {next(60, `${arrowClass} pointer-events-auto size-20`)}
        </div>
      </div>
      <nav className="flex items-center justify-center gap-8" aria-label={messages.highlightTitle}>
        {prev(28, `${arrowClass} size-12`)}
        <span className="text-[28px] leading-9 font-bold text-[#999]" aria-live="polite">
          {slideLabel(index, total)}
        </span>
        {next(28, `${arrowClass} size-12`)}
      </nav>
    </div>
  );
}
