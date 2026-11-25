"use client";

import { IconGift } from "./kudos-icons";

type OpenGiftButtonProps = { label: string; disabled: boolean; onOpen?: () => void };

/** D.1.8 "Mở quà": disabled without unopened boxes; the dialog comes with task #18. */
export function OpenGiftButton({ label, disabled, onOpen }: OpenGiftButtonProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={disabled}
      className="flex h-[60px] w-full items-center justify-center gap-2 rounded-lg bg-brand-accent p-4 text-[22px] leading-7 font-bold text-brand-bg transition-shadow hover:shadow-[var(--shadow-nav-glow)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none"
    >
      {label}
      <IconGift />
    </button>
  );
}
