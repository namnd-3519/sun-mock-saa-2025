import Image from "next/image";
import Link from "next/link";
import type { KudosMessages } from "@/i18n/kudos-messages";
import { IconPen } from "@/components/icons/icon-pen";
import { WRITE_KUDOS_PATH } from "@/lib/navigation/site-nav";
import { IconSearch } from "./kudos-icons";

const pillClass =
  "flex h-[72px] items-center gap-4 rounded-[68px] border border-brand-border bg-brand-accent/10 px-4 py-6 text-base leading-6 font-bold tracking-[0.15px] text-white";

/**
 * A KV Kudos: title + Kudos logo; A.1 "write kudos" pill (opens the Viết Kudo screen; task #19
 * may swap the link for its dialog) and the Sunner search pill (visual only for now).
 */
export function KudosHero({ messages }: { messages: KudosMessages }) {
  return (
    <section className="flex w-full flex-col gap-16">
      <div className="mx-auto flex w-full max-w-[1152px] flex-col gap-2.5 px-4 md:px-10 lg:px-0">
        <h1 className="text-2xl leading-8 font-bold text-brand-accent md:text-4xl md:leading-[44px]">
          {messages.heroTitle}
        </h1>
        <Image
          src="/images/home/kudos-logo.png"
          alt="Sun* Kudos"
          width={364}
          height={72}
          priority
          style={{ height: "auto" }}
          className="w-[280px] md:w-[520px]"
        />
      </div>
      <div className="mx-auto flex w-full max-w-[1152px] flex-col gap-4 px-4 md:px-10 lg:flex-row lg:justify-between lg:px-0">
        <Link href={WRITE_KUDOS_PATH} className={`${pillClass} lg:w-[738px] hover:bg-brand-accent/40`}>
          <IconPen width={24} height={24} />
          <span className="truncate">{messages.writePlaceholder}</span>
        </Link>
        <div className={`${pillClass} lg:w-[381px]`}>
          <IconSearch />
          <span className="truncate">{messages.searchPlaceholder}</span>
        </div>
      </div>
    </section>
  );
}
