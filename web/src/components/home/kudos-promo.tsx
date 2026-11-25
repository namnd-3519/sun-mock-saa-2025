import Image from "next/image";
import Link from "next/link";
import type { HomeMessages } from "@/i18n/home-messages";
import { IconArrowUpRight } from "@/components/icons/icon-arrow-up-right";
import { KUDOS_PATH } from "@/lib/navigation/site-nav";

/** D1/D2: Sun* Kudos promo card with its "Chi tiết" button (D2.1). */
export function KudosPromo({ messages }: { messages: HomeMessages }) {
  return (
    <section className="relative isolate mx-auto flex w-full max-w-[1120px] flex-col gap-10 overflow-hidden rounded-2xl bg-[#0f0f0f] px-6 py-10 lg:min-h-[500px] lg:flex-row lg:items-center lg:justify-between lg:py-[46px] lg:pr-[84px] lg:pl-16">
      <Image
        src="/images/home/kudos-bg.jpg"
        alt=""
        fill
        sizes="(min-width: 1120px) 1120px, 100vw"
        className="-z-10 object-cover"
      />
      <div className="flex max-w-[457px] flex-col items-start gap-8">
        <div className="flex flex-col gap-4">
          <p className="text-lg leading-8 font-bold text-white md:text-2xl">{messages.kudosCaption}</p>
          <h2 className="text-4xl leading-[44px] font-bold tracking-[-0.25px] text-brand-accent md:text-[57px] md:leading-16">
            {messages.kudosTitle}
          </h2>
          <div className="text-justify text-base leading-6 font-bold tracking-[0.5px] text-white">
            <p>{messages.kudosHighlight}</p>
            <p>{messages.kudosBody}</p>
          </div>
        </div>
        <Link
          href={KUDOS_PATH}
          className="flex items-center gap-2 rounded p-4 text-base leading-6 font-bold tracking-[0.15px] text-brand-bg bg-brand-accent transition-shadow duration-200 hover:shadow-[var(--shadow-nav-glow)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
        >
          {messages.details}
          <IconArrowUpRight />
        </Link>
      </div>
      <Image
        src="/images/home/kudos-logo.png"
        alt="Sun* Kudos"
        width={364}
        height={72}
        style={{ height: "auto" }}
        className="w-[240px] self-center md:w-[364px]"
      />
    </section>
  );
}
