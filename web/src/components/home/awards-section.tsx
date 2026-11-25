import type { HomeMessages } from "@/i18n/home-messages";
import { AWARD_CATEGORIES } from "@/lib/home/award-categories";
import { AwardCard } from "./award-card";

/** C1 header + C2 award grid (2 columns on mobile/tablet, 3 on desktop). */
export function AwardsSection({ messages }: { messages: HomeMessages }) {
  return (
    <section className="flex flex-col gap-12 lg:gap-20" aria-labelledby="awards-title">
      <header className="flex flex-col gap-4">
        <p className="text-lg leading-8 font-bold text-white md:text-2xl">{messages.awardsCaption}</p>
        <div className="h-px bg-brand-divider" />
        <h2
          id="awards-title"
          className="text-4xl leading-[44px] font-bold tracking-[-0.25px] text-brand-accent md:text-[57px] md:leading-16"
        >
          {messages.awardsTitle}
        </h2>
      </header>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-8 lg:grid-cols-3 lg:gap-x-[108px] lg:gap-y-20">
        {AWARD_CATEGORIES.map((award) => (
          <li key={award.slug}>
            <AwardCard
              award={award}
              description={messages.awards[award.descriptionKey]}
              detailsLabel={messages.details}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
