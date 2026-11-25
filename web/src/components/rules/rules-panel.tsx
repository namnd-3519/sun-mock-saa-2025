import type { RulesMessages } from "@/i18n/rules-messages";
import { CollectableIconGrid } from "./collectable-icon-grid";
import { HeroTierList } from "./hero-tier-list";
import { RulesActions } from "./rules-actions";

type RulesPanelProps = { messages: RulesMessages };

const HEADING = "text-[22px] leading-7 font-bold text-brand-accent";
const BODY = "text-justify text-base leading-6 font-bold tracking-[0.5px] text-white";

// "Thể Lệ" panel (3204:6052): 553px wide, #00070C, padding 24/40/40, 40px between content and buttons.
export function RulesPanel({ messages: m }: RulesPanelProps) {
  return (
    <section
      aria-labelledby="rules-title"
      className="flex w-full max-w-[553px] flex-col gap-10 bg-brand-container-2 px-4 pt-6 pb-10 sm:px-10"
    >
      <div className="flex flex-col gap-6">
        <h1 id="rules-title" className="text-[34px] leading-[44px] font-bold text-brand-accent sm:text-[45px] sm:leading-[52px]">
          {m.title}
        </h1>
        <div className="flex flex-col gap-4">
          <h2 className={HEADING}>{m.receiverHeading}</h2>
          <p className={BODY}>{m.receiverBody}</p>
          <HeroTierList tiers={m.tiers} />
          <h2 className={HEADING}>{m.senderHeading}</h2>
          <p className={BODY}>{m.senderBody}</p>
          <CollectableIconGrid label={m.badgesLabel} />
          <p className={BODY}>{m.collectNote}</p>
          <h2 className="text-2xl leading-8 font-bold text-brand-accent">{m.nationalHeading}</h2>
          <p className={BODY}>{m.nationalBody}</p>
        </div>
      </div>
      <RulesActions closeLabel={m.close} writeKudosLabel={m.writeKudos} />
    </section>
  );
}
