"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import { IconUser } from "@/components/icons/icon-user";
import { getOptionAction } from "@/components/language-switcher/option-navigation";
import type { ProfileMenuItem } from "./profile-menu-items";
import { ProfileMenuList } from "./profile-menu-list";

type ProfileMenuProps = { label: string; items: ProfileMenuItem[] };

/**
 * Header account dropdown: Profile, Dashboard (admins only) and Logout.
 * Opens and closes on click without animation; closes on outside click and Escape.
 */
export function ProfileMenu({ label, items }: ProfileMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (open) itemRefs.current[0]?.focus();
  }, [open]);

  function close() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  function handleButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
    }
  }

  function handleItemKeyDown(event: KeyboardEvent<HTMLElement>, index: number) {
    const action = getOptionAction(event.key, index, items.length);
    // Enter and Space keep their native link/submit behavior.
    if (!action || action.type === "select") return;
    if (action.type !== "dismiss") event.preventDefault();
    if (action.type === "focus") itemRefs.current[action.index]?.focus();
    if (action.type === "close") close();
    if (action.type === "dismiss") setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={handleButtonKeyDown}
        className="flex size-10 cursor-pointer items-center justify-center rounded border border-brand-border p-2.5 text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent aria-expanded:bg-white/10"
      >
        <IconUser />
      </button>
      {open && (
        <ProfileMenuList
          id={menuId}
          label={label}
          items={items}
          pathname={pathname}
          itemRefs={itemRefs}
          onItemKeyDown={handleItemKeyDown}
          onNavigate={() => setOpen(false)}
        />
      )}
    </div>
  );
}
