import type { KudosMessages } from "@/i18n/kudos-messages";
import { KudosSectionHeader } from "./kudos-section-header";
import { IconSearch } from "./kudos-icons";

type SpotlightBoardProps = { total: number; names: string[]; messages: KudosMessages };

// Deterministic scatter so server and client render the same layout.
function spot(index: number) {
  const left = (index * 37 + 11) % 86;
  const top = (index * 53 + 23) % 70;
  return { left: `${left + 5}%`, top: `${top + 18}%` };
}

/**
 * B.6 header + B.7 Spotlight: total kudos (B.7.1) and recent recipients' names.
 * Pan/zoom (B.7.2) and the Sunner search (B.7.3) are not wired yet (no task owns them).
 */
export function SpotlightBoard({ total, names, messages }: SpotlightBoardProps) {
  return (
    <section aria-labelledby="spotlight-board" className="mx-auto flex w-full max-w-[1152px] flex-col gap-10 px-4 md:px-10 lg:px-0">
      <KudosSectionHeader id="spotlight-board" caption={messages.sectionCaption} title={messages.spotlightTitle} />
      <div className="relative h-[420px] w-full overflow-hidden rounded-[47px] border border-brand-border bg-[radial-gradient(circle_at_50%_50%,#0b2a3a_0%,#00101a_70%)] md:h-[548px]">
        <div className="absolute top-6 left-6 right-6 z-10 flex flex-wrap items-center justify-between gap-4">
          <p className="text-2xl leading-[44px] font-bold text-white md:text-4xl">
            {total.toLocaleString("vi-VN")} {messages.kudosCount}
          </p>
          <div className="flex h-[39px] w-[219px] items-center gap-2.5 rounded-full border border-brand-border bg-brand-accent/10 px-3 text-[11px] font-medium text-white">
            <IconSearch size={16} />
            <span>{messages.searchPlaceholder}</span>
          </div>
        </div>
        <ul aria-hidden="true">
          {names.map((name, index) => (
            <li
              key={`${name}-${index}`}
              style={spot(index)}
              className="absolute max-w-[160px] truncate text-xs font-bold tracking-[0.2px] text-white/80"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
