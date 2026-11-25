import Image from "next/image";
import Link from "next/link";
import type { HomeMessages } from "@/i18n/home-messages";
import { IconArrowUpRight } from "@/components/icons/icon-arrow-up-right";
import { getRemainingTime } from "@/lib/prelaunch/countdown";
import { AWARDS_PATH, KUDOS_PATH } from "@/lib/navigation/site-nav";
import { HomeCountdown } from "./home-countdown";

type HomeHeroProps = { now: Date; eventAt: Date; messages: HomeMessages };

// B3: both buttons share one state model — outlined when normal, yellow on hover/focus.
const CTA =
  "flex items-center gap-2 rounded-lg border border-brand-border bg-brand-accent/10 px-6 py-4 text-lg leading-7 font-bold text-white transition-colors duration-200 hover:border-brand-accent hover:bg-brand-accent hover:text-brand-bg focus-visible:border-brand-accent focus-visible:bg-brand-accent focus-visible:text-brand-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent md:text-[22px]";

function EventDetail({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex items-baseline gap-1">
      <span className="text-base leading-6 font-bold tracking-[0.15px] text-white">{label}</span>
      <span className="text-xl leading-8 font-bold text-brand-accent md:text-2xl">{value}</span>
    </p>
  );
}

/** Key visual block (3.5): Root Further logo, countdown (B1), event info (B2) and CTAs (B3). */
export function HomeHero({ now, eventAt, messages }: HomeHeroProps) {
  return (
    <section className="flex flex-col items-start gap-10">
      <h1>
        <Image
          src="/images/home/root-further.png"
          alt={messages.rootFurtherAlt}
          width={451}
          height={200}
          priority
          style={{ height: "auto" }}
          className="w-[280px] md:w-[451px]"
        />
      </h1>
      <div className="flex flex-col items-start gap-4">
        <HomeCountdown
          eventAtMs={eventAt.getTime()}
          initial={getRemainingTime(now, eventAt)}
          messages={messages}
        />
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-x-[60px] gap-y-2">
            <EventDetail label={messages.timeLabel} value={messages.timeValue} />
            <EventDetail label={messages.venueLabel} value={messages.venueValue} />
          </div>
          <p className="text-base leading-6 font-bold tracking-[0.5px] text-white">
            {messages.broadcast}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 md:gap-10">
        <Link href={AWARDS_PATH} className={CTA}>
          {messages.aboutAwards}
          <IconArrowUpRight />
        </Link>
        <Link href={KUDOS_PATH} className={CTA}>
          {messages.aboutKudos}
          <IconArrowUpRight />
        </Link>
      </div>
    </section>
  );
}
