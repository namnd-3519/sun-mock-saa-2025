"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IconChevronDown } from "@/components/icons/icon-chevron-down";
import type { ProfileMessages } from "@/i18n/profile-messages";
import { PROFILE_KUDOS_BOXES, type ProfileKudosBox } from "@/lib/kudos/profile-queries";
import { profileBoxHref } from "@/lib/profile/parse-profile-box";

type ProfileBoxMenuProps = {
  box: ProfileKudosBox;
  counts: Record<ProfileKudosBox, number | null>;
  messages: ProfileMessages;
};

/** C.3 dropdown: switches the list between "Đã nhận (N)" and "Đã gửi (N)" via `?box=`. */
export function ProfileBoxMenu({ box, counts, messages }: ProfileBoxMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const label = (value: ProfileKudosBox) =>
    messages.boxes[value].replace("{count}", counts[value] === null ? "—" : String(counts[value]));

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative self-start md:self-auto">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`${messages.boxLabel}: ${label(box)}`}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded border border-brand-border bg-brand-accent/10 px-6 py-4 text-base leading-6 font-bold tracking-[0.15px] text-white hover:bg-brand-accent/40"
      >
        {label(box)}
        <IconChevronDown />
      </button>
      {open ? (
        <ul className="absolute right-0 z-20 mt-2 flex min-w-full flex-col rounded border border-brand-border bg-brand-container-2 p-1.5">
          {PROFILE_KUDOS_BOXES.map((value) => (
            <li key={value}>
              <Link
                href={profileBoxHref(value)}
                scroll={false}
                aria-current={value === box ? "true" : undefined}
                onClick={() => setOpen(false)}
                className="block rounded px-4 py-3 text-base leading-6 font-bold whitespace-nowrap text-white hover:bg-brand-accent/10 aria-[current]:text-brand-accent"
              >
                {label(value)}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
