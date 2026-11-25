"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent,
  type SVGProps,
} from "react";
import { useRouter } from "next/navigation";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { IconChevronDown } from "./icon-chevron-down";
import { IconFlagGb } from "./icon-flag-gb";
import { IconFlagVn } from "./icon-flag-vn";
import { saveLocaleCookie } from "./save-locale-cookie";

const FLAGS: Record<Locale, ComponentType<SVGProps<SVGSVGElement>>> = {
  vi: IconFlagVn,
  en: IconFlagGb,
};

type LanguageSwitcherProps = { locale: Locale; messages: Messages["language"] };

function Flag({ locale }: { locale: Locale }) {
  const Icon = FLAGS[locale];
  return (
    <span className="flex size-6 items-center justify-center">
      <Icon />
    </span>
  );
}

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

  function focusOption(index: number) {
    const last = LOCALES.length - 1;
    optionRefs.current[Math.min(Math.max(index, 0), last)]?.focus();
  }

  function handleButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
    }
  }

  function handleOptionKeyDown(event: KeyboardEvent<HTMLLIElement>, index: number) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusOption(index + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusOption(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusOption(0);
        break;
      case "End":
        event.preventDefault();
        focusOption(LOCALES.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        select(LOCALES[index]);
        break;
      case "Escape":
        event.preventDefault();
        close();
        break;
      case "Tab":
        setOpen(false);
        break;
    }
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
          <Flag locale={locale} />
          <span className="text-base leading-6 font-bold tracking-[0.15px]">
            {LOCALE_LABELS[locale]}
          </span>
        </span>
        <IconChevronDown
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={messages.label}
          className="absolute top-full right-0 mt-1 w-44 overflow-hidden rounded border border-brand-divider bg-brand-bg py-1 shadow-lg"
        >
          {LOCALES.map((option, index) => {
            const selected = option === locale;
            return (
              <li
                key={option}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                role="option"
                aria-selected={selected}
                tabIndex={-1}
                onClick={() => select(option)}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
                className={`flex cursor-pointer items-center gap-3 px-4 py-3 text-base leading-6 font-bold outline-none hover:bg-white/10 focus-visible:bg-white/15 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-accent ${
                  selected ? "bg-white/10 text-brand-accent" : "text-white"
                }`}
              >
                <Flag locale={option} />
                <span>{messages[option]}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
