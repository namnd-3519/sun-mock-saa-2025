"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { KudosMessages } from "@/i18n/kudos-messages";
import type { PersonSummary } from "@/lib/kudos/kudos-types";
import { PersonHoverCardContent } from "./person-hover-card-content";
import {
  HOVER_CARD_TRIGGER_ATTR,
  isHoverPointer,
  nextHoverCardOpen,
  type HoverCardEvent,
} from "./person-hover-card-state";

type PersonHoverCardProps = {
  person: PersonSummary;
  isSelf: boolean;
  messages: KudosMessages;
  /** Side the card hugs on narrow screens so it stays inside the viewport (sender start, recipient end). */
  align?: "start" | "end";
  children: ReactNode;
};

const ALIGN_CLASS = {
  start: "left-0 md:left-1/2 md:-translate-x-1/2",
  end: "right-0 md:right-auto md:left-1/2 md:-translate-x-1/2",
} as const;

/**
 * Opens the profile preview while the avatar or name is hovered or focused; Escape, blur and
 * leaving close it. On touch a tap on the avatar toggles it instead of following the link.
 * `data-open` lets the avatar switch to its hover ring (B_Avatar khi hover).
 */
export function PersonHoverCard({ person, isSelf, messages, align = "start", children }: PersonHoverCardProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pointerType = useRef("mouse");
  // A tap focuses the link before its click: that focus must not open the card the tap toggles.
  const touchPressing = useRef(false);
  const send = (event: HoverCardEvent) => setOpen((current) => nextHoverCardOpen(current, event));

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div
      ref={rootRef}
      data-open={open}
      className="group/person relative flex w-full max-w-[235px] flex-col items-center"
      onPointerDown={(event) => {
        pointerType.current = event.pointerType;
        touchPressing.current = !isHoverPointer(event.pointerType);
      }}
      onPointerEnter={(event) => {
        if (isHoverPointer(event.pointerType)) send("pointer-enter");
      }}
      onPointerLeave={(event) => {
        if (isHoverPointer(event.pointerType)) send("pointer-leave");
      }}
      onFocus={() => {
        if (!touchPressing.current) send("focus");
      }}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) send("blur");
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") send("escape");
      }}
      onClickCapture={(event) => {
        touchPressing.current = false;
        // detail 0 = keyboard activation: Enter follows the link as usual.
        if (event.detail === 0 || isHoverPointer(pointerType.current)) return;
        const trigger = (event.target as Element).closest(`[${HOVER_CARD_TRIGGER_ATTR}]`);
        if (!trigger) return;
        event.preventDefault();
        send("tap");
      }}
    >
      {children}
      {open ? (
        <div className={`absolute top-full z-40 pt-2 ${ALIGN_CLASS[align]}`} data-testid="person-hover-card">
          <PersonHoverCardContent person={person} isSelf={isSelf} messages={messages} />
        </div>
      ) : null}
    </div>
  );
}
