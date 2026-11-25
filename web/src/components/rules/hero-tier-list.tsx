import type { RulesMessages } from "@/i18n/rules-messages";
import { HeroBadgePill } from "./hero-badge-pill";
import { HERO_TIERS } from "./rules-badge-names";

type HeroTierListProps = { tiers: RulesMessages["tiers"] };

/** The four Hero tiers: pill + sender range on one line, description below (frame "content"). */
export function HeroTierList({ tiers }: HeroTierListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {tiers.map((tier, i) => (
        <li key={HERO_TIERS[i]} className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <HeroBadgePill name={HERO_TIERS[i]} legend={i === HERO_TIERS.length - 1} />
            <span className="text-base leading-6 font-bold tracking-[0.5px] text-white">{tier.range}</span>
          </div>
          <p className="text-justify text-sm leading-5 font-bold tracking-[0.1px] text-white">{tier.body}</p>
        </li>
      ))}
    </ul>
  );
}
