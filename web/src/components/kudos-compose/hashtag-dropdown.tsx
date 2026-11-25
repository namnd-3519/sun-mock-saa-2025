"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { getOptionAction } from "@/components/language-switcher/option-navigation";
import { isHashtagOptionDisabled } from "@/lib/kudos-compose/hashtag-selection";
import type { Hashtag } from "@/lib/kudos/kudos-types";
import { CheckCircleIcon } from "./compose-icons";

type HashtagDropdownProps = {
  id: string;
  label: string;
  emptyLabel: string;
  options: Hashtag[];
  value: Hashtag[];
  onToggle: (tag: Hashtag) => void;
  /** Escape: close and return focus to the trigger. */
  onClose: () => void;
  /** Tab: close without moving focus. */
  onDismiss: () => void;
};

const OPTION_CLASS =
  "flex h-10 w-full shrink-0 cursor-pointer items-center justify-between gap-0.5 rounded-xs px-4 text-left text-base leading-6 font-bold tracking-[0.15px] text-white outline-none transition-colors duration-200 hover:bg-brand-accent/10 focus-visible:bg-brand-accent/10 focus-visible:[text-shadow:var(--shadow-nav-glow)] aria-selected:bg-brand-accent/20 aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:hover:bg-transparent";

/**
 * Dropdown list hashtag (MoMorph p9zO-c4a4x): multi-select listbox under "+ Hashtag".
 * Selected rows get the tinted background and a check circle; the list stays open between picks,
 * and unselected rows are disabled once the max (5) is reached.
 */
export function HashtagDropdown({ id, label, emptyLabel, options, value, onToggle, onClose, onDismiss }: HashtagDropdownProps) {
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIds = new Set(value.map((tag) => tag.id));

  useEffect(() => {
    optionRefs.current[0]?.focus();
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const action = getOptionAction(event.key, index, options.length);
    // Enter and Space keep their native button behavior (click → toggle).
    if (!action || action.type === "select") return;
    if (action.type !== "dismiss") event.preventDefault();
    if (action.type === "focus") optionRefs.current[action.index]?.focus();
    if (action.type === "close") onClose();
    if (action.type === "dismiss") onDismiss();
  }

  return (
    <div
      id={id}
      role="listbox"
      aria-label={label}
      aria-multiselectable="true"
      className="absolute top-full left-0 z-20 mt-1 flex max-h-[421px] w-[318px] max-w-[calc(100vw-2rem)] flex-col overflow-y-auto rounded-lg border border-brand-border bg-brand-container-2 p-1.5 shadow-lg"
    >
      {options.length === 0 ? <p className="px-4 py-2 text-base leading-6 text-white/70">{emptyLabel}</p> : null}
      {options.map((tag, index) => {
        const selected = selectedIds.has(tag.id);
        const disabled = isHashtagOptionDisabled(value, tag);
        return (
          <button
            key={tag.id}
            ref={(node) => {
              optionRefs.current[index] = node;
            }}
            type="button"
            role="option"
            aria-selected={selected}
            aria-disabled={disabled || undefined}
            tabIndex={-1}
            onClick={() => {
              if (!disabled) onToggle(tag);
            }}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={OPTION_CLASS}
          >
            <span className="min-w-0 truncate">#{tag.name}</span>
            {/* A.2: check circle when selected, an empty 24px slot otherwise to keep the layout stable. */}
            <span className="size-6 shrink-0">{selected ? <CheckCircleIcon className="size-6 text-white" /> : null}</span>
          </button>
        );
      })}
    </div>
  );
}
