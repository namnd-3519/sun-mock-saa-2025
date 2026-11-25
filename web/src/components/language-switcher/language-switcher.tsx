"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { IconChevronDown } from "@/components/icons/icon-chevron-down";
import { LanguageMenu } from "./language-menu";
import { LocaleFlag } from "./locale-flag";
import { getOptionAction } from "./option-navigation";
import { saveLocaleCookie } from "./save-locale-cookie";

export type LanguageSwitcherProps = {
  locale: Locale;
  messages: Messages["language"];
};

/**
 * Shared VN/EN language dropdown. Saves the choice in the NEXT_LOCALE cookie
 * and refreshes the route so server components re-render in the new locale.
 */
export function LanguageSwitcher({ locale, messages }: LanguageSwitcherProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (open) optionRefs.current[LOCALES.indexOf(locale)]?.focus();
  }, [open, locale]);

  function close() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  function select(next: Locale) {
    close();
    if (next === locale) return;
    saveLocaleCookie(next);
    router.refresh();
  }

  function handleButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
    }
  }

  function handleOptionKeyDown(event: KeyboardEvent<HTMLLIElement>, index: number) {
    const action = getOptionAction(event.key, index, LOCALES.length);
    if (!action) return;
    if (action.type !== "dismiss") event.preventDefault();
    if (action.type === "focus") optionRefs.current[action.index]?.focus();
    if (action.type === "select") select(LOCALES[action.index]);
    if (action.type === "close") close();
    if (action.type === "dismiss") setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`${messages.label}: ${LOCALE_LABELS[locale]}`}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={handleButtonKeyDown}
        className="flex h-14 w-[108px] cursor-pointer items-center justify-between rounded p-4 text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent aria-expanded:bg-white/10"
      >
        <span className="flex items-center gap-1">
          <LocaleFlag locale={locale} />
          <span className="text-base leading-6 font-bold tracking-[0.15px]">
            {LOCALE_LABELS[locale]}
          </span>
        </span>
        <IconChevronDown
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <LanguageMenu
          id={listId}
          locale={locale}
          messages={messages}
          optionRefs={optionRefs}
          onSelect={select}
          onOptionKeyDown={handleOptionKeyDown}
        />
      )}
    </div>
  );
}
