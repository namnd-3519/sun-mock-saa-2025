import type { KudosMessages } from "@/i18n/kudos-messages";
import type { Hashtag, KudosFilters } from "@/lib/kudos/kudos-types";
import type { KudosCardView } from "@/lib/kudos-live/kudos-card-view";
import { kudosFiltersKey } from "@/lib/kudos-live/kudos-filters";
import { HighlightCarousel } from "./highlight-carousel";
import { KudosFilterButtons } from "./kudos-filter-buttons";
import { KudosSectionHeader } from "./kudos-section-header";

type HighlightSectionProps = {
  cards: KudosCardView[];
  filters: KudosFilters;
  hashtags: Hashtag[];
  messages: KudosMessages;
};

/** B Highlight: top 5 most-liked kudos, with the board filters. */
export function HighlightSection({ cards, filters, hashtags, messages }: HighlightSectionProps) {
  return (
    <section aria-labelledby="highlight-kudos" className="flex w-full flex-col gap-10">
      <div className="mx-auto w-full max-w-[1152px] px-4 md:px-10 lg:px-0">
        <KudosSectionHeader id="highlight-kudos" caption={messages.sectionCaption} title={messages.highlightTitle}>
          <KudosFilterButtons filters={filters} hashtags={hashtags} messages={messages} />
        </KudosSectionHeader>
      </div>
      {cards.length === 0 ? (
        <p className="px-4 text-center text-xl font-bold text-white">{messages.empty}</p>
      ) : (
        <HighlightCarousel key={kudosFiltersKey(filters)} cards={cards} filters={filters} messages={messages} />
      )}
    </section>
  );
}
