"use client";

import type { KeyboardEvent, RefObject } from "react";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { LocaleFlag } from "./locale-flag";

type LanguageMenuProps = {
  id: string;
  locale: Locale;
  messages: Messages["language"];
  optionRefs: RefObject<(HTMLLIElement | null)[]>;
  onSelect: (locale: Locale) => void;
  onOptionKeyDown: (event: KeyboardEvent<HTMLLIElement>, index: number) => void;
};

/** Open state of the language dropdown, styled from MoMorph frame hUyaaugye2. */
export function LanguageMenu({
  id,
  locale,
  messages,
  optionRefs,
  onSelect,
  onOptionKeyDown,
}: LanguageMenuProps) {
  return (
    <ul
      id={id}
      role="listbox"
      aria-label={messages.label}
      className="absolute top-full right-0 z-30 mt-1 flex flex-col rounded-lg border border-brand-border bg-brand-container-2 p-1.5 shadow-lg"
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
            aria-label={messages[option]}
            lang={option}
            tabIndex={-1}
            onClick={() => onSelect(option)}
            onKeyDown={(event) => onOptionKeyDown(event, index)}
            className={`flex h-14 w-[110px] cursor-pointer items-center gap-1 rounded-sm p-4 text-base leading-6 font-bold tracking-[0.15px] text-white outline-none transition-colors duration-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-accent ${
              selected ? "bg-brand-accent/20" : "hover:bg-brand-accent/10"
            }`}
          >
            <LocaleFlag locale={option} />
            <span>{LOCALE_LABELS[option]}</span>
          </li>
        );
      })}
    </ul>
  );
}
