import Image from "next/image";
import type { AwardsMessages } from "@/i18n/awards-messages-vi";

/** KV "Root Further" logo and A: the page title block (caption, divider, gold heading). */
export function AwardsTitle({ messages }: { messages: AwardsMessages }) {
  return (
    <div className="flex flex-col gap-16 lg:gap-[120px]">
      <Image
        src="/images/home/root-further.png"
        alt={messages.rootFurtherAlt}
        width={338}
        height={150}
        priority
        style={{ height: "auto" }}
        className="w-[220px] md:w-[338px]"
      />
      <header className="flex flex-col gap-4">
        <p className="text-center text-lg leading-8 font-bold text-white md:text-2xl">
          {messages.caption}
        </p>
        <div className="h-px bg-brand-divider" />
        <h1 className="text-center text-4xl leading-[44px] font-bold tracking-[-0.25px] text-brand-accent md:text-[57px] md:leading-16">
          {messages.title}
        </h1>
      </header>
    </div>
  );
}
