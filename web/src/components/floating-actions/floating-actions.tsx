"use client";

import Image from "next/image";
import { useEffect, useId, useReducer, useRef } from "react";
import type { Messages } from "@/i18n/messages";
import { IconClose } from "@/components/icons/icon-close";
import { IconPen } from "@/components/icons/icon-pen";
import { STANDARDS_PATH, WRITE_KUDOS_PATH } from "@/lib/navigation/site-nav";
import { FabActionLink } from "./fab-action-link";
import { fabReducer } from "./fab-state";

export type FloatingActionsProps = { messages: Messages["fab"] };

// MM_MEDIA_LOGO (20x18): the SAA artwork, no separate media file on MoMorph.
const saaIcon = <Image src="/images/home/saa-logo.png" alt="" width={20} height={18} />;

/**
 * Floating action button: collapsed pill (MoMorph _hphd32jN2) that expands into
 * "Thể lệ", "Viết KUDOS" and a red cancel button (MoMorph Sv7DFwBw1h).
 */
export function FloatingActions({ messages }: FloatingActionsProps) {
  const [open, dispatch] = useReducer(fabReducer, false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstActionRef = useRef<HTMLAnchorElement>(null);
  // Cancel and Escape hand focus back to the pill; outside clicks and links do not.
  const restoreFocus = useRef(false);
  const menuId = useId();

  function close(event: "cancel" | "escape") {
    restoreFocus.current = true;
    dispatch(event);
  }

  useEffect(() => {
    if (!open) {
      if (restoreFocus.current) triggerRef.current?.focus();
      restoreFocus.current = false;
      return;
    }
    firstActionRef.current?.focus();
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) dispatch("outside");
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close("escape");
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const navigate = () => dispatch("navigate");

  return (
    <div
      ref={rootRef}
      className="fixed right-4 bottom-6 z-40 flex flex-col items-end gap-5 lg:right-[19px] lg:bottom-[130px]"
    >
      {open && (
        <div id={menuId} role="group" aria-label={messages.actions} className="flex flex-col items-end gap-5">
          <FabActionLink
            linkRef={firstActionRef}
            href={STANDARDS_PATH}
            icon={saaIcon}
            label={messages.rules}
            onNavigate={navigate}
            className="min-w-[149px]"
          />
          <FabActionLink
            href={WRITE_KUDOS_PATH}
            icon={<IconPen />}
            label={messages.writeKudos}
            onNavigate={navigate}
            className="min-w-[214px] hover:brightness-105"
          />
        </div>
      )}
      {open ? (
        <button
          type="button"
          aria-label={messages.close}
          aria-controls={menuId}
          aria-expanded="true"
          onClick={() => close("cancel")}
          className="flex size-14 cursor-pointer items-center justify-center rounded-full bg-[#d4271d] p-4 text-white shadow-[0_4px_4px_rgb(0_0_0/0.25)] transition-shadow duration-200 hover:shadow-[var(--shadow-fab-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
        >
          <IconClose />
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          aria-label={messages.open}
          aria-expanded="false"
          onClick={() => dispatch("toggle")}
          className="flex h-16 w-[106px] cursor-pointer items-center gap-2 rounded-full bg-brand-accent p-4 text-brand-bg shadow-[var(--shadow-nav-glow)] transition-shadow duration-200 hover:shadow-[var(--shadow-fab-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
        >
          <span className="flex items-center gap-2" aria-hidden="true">
            <IconPen />
            <span className="text-2xl leading-8 font-bold">/</span>
          </span>
          <span className="flex size-6 items-center justify-center">{saaIcon}</span>
        </button>
      )}
    </div>
  );
}
