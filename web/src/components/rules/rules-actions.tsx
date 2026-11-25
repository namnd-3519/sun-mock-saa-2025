"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconClose } from "@/components/icons/icon-close";
import { IconPen } from "@/components/icons/icon-pen";
import { HOME_PATH, WRITE_KUDOS_PATH } from "@/lib/navigation/site-nav";

type RulesActionsProps = { closeLabel: string; writeKudosLabel: string };

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent";

/** B: "Đóng" goes back to the previous page (home when opened directly); "Viết KUDOS" opens the form. */
export function RulesActions({ closeLabel, writeKudosLabel }: RulesActionsProps) {
  const router = useRouter();
  const close = () => {
    if (window.history.length > 1) router.back();
    else router.push(HOME_PATH);
  };
  return (
    <div className="flex w-full gap-4">
      <button
        type="button"
        onClick={close}
        className={`flex h-14 shrink-0 cursor-pointer items-center justify-center gap-2 rounded border border-brand-border bg-brand-accent/10 p-4 text-base leading-6 font-bold tracking-[0.5px] text-white transition-colors duration-200 hover:bg-brand-accent/20 ${FOCUS}`}
      >
        <IconClose className="size-6 shrink-0" />
        {closeLabel}
      </button>
      <Link
        href={WRITE_KUDOS_PATH}
        className={`flex h-14 flex-1 items-center justify-center gap-2 rounded bg-brand-accent p-4 text-base leading-6 font-bold tracking-[0.5px] text-brand-bg transition-shadow duration-200 hover:shadow-[var(--shadow-fab-hover)] ${FOCUS}`}
      >
        <IconPen className="size-6 shrink-0" />
        {writeKudosLabel}
      </Link>
    </div>
  );
}
