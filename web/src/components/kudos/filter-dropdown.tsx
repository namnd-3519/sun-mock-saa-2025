"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { IconChevronDown } from "@/components/icons/icon-chevron-down";
import { getOptionAction } from "@/components/language-switcher/option-navigation";

export type FilterOption = { id: string; label: string };

type FilterDropdownProps = {
  label: string;
  options: FilterOption[];
  selectedId?: string;
  /** Called with the picked id, or null when the selected option is clicked again (toggle off). */
  onSelect: (id: string | null) => void;
  emptyLabel?: string;
  /** Width of the open list; the department frame is narrower than the hashtag one. */
  listClassName?: string;
};

const BUTTON_CLASS =
  "flex cursor-pointer items-center gap-2 rounded border border-brand-border bg-brand-accent/10 p-4 text-base leading-6 font-bold tracking-[0.15px] text-white hover:bg-brand-accent/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent aria-pressed:border-brand-accent";
const OPTION_CLASS =
  "flex h-14 w-full cursor-pointer items-center rounded-sm p-4 text-left text-base leading-6 font-bold tracking-[0.5px] whitespace-nowrap text-white outline-none transition-colors duration-200 hover:bg-brand-accent/10 hover:[text-shadow:var(--shadow-nav-glow)] focus-visible:bg-brand-accent/10 focus-visible:[text-shadow:var(--shadow-nav-glow)] aria-selected:bg-brand-accent/10 aria-selected:[text-shadow:var(--shadow-nav-glow)]";

/**
 * Board filter dropdown (MoMorph JWpsISMAaM): trigger button plus a scrollable listbox.
 * Picking an option closes the list; picking the selected one again clears the filter.
 * Shared by the Hashtag (#13) and Phòng ban (#14) filters.
 */
export function FilterDropdown({
  label,
  options,
  selectedId,
  onSelect,
  emptyLabel,
  listClassName = "min-w-[215px]",
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listId = useId();
  const selectedIndex = options.findIndex((option) => option.id === selectedId);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (open) optionRefs.current[Math.max(selectedIndex, 0)]?.focus();
  }, [open, selectedIndex]);

  function close() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  function choose(id: string) {
    close();
    onSelect(id === selectedId ? null : id);
  }

  function handleButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
    }
  }

  function handleOptionKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const action = getOptionAction(event.key, index, options.length);
    // Enter and Space keep their native button behavior (click → choose).
    if (!action || action.type === "select") return;
    if (action.type !== "dismiss") event.preventDefault();
    if (action.type === "focus") optionRefs.current[action.index]?.focus();
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
        aria-pressed={Boolean(selectedId)}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={handleButtonKeyDown}
        className={BUTTON_CLASS}
      >
        {label}
        <IconChevronDown className={open ? "rotate-180" : undefined} />
      </button>
      {open && (
        <div
          id={listId}
          role="listbox"
          aria-label={label}
          className={`absolute top-full right-0 z-30 mt-1 flex max-h-[410px] flex-col overflow-y-auto rounded-lg border border-brand-border bg-brand-container-2 p-1.5 shadow-lg ${listClassName}`}
        >
          {options.length === 0 && emptyLabel ? (
            <p className="p-4 text-base leading-6 whitespace-nowrap text-white/70">{emptyLabel}</p>
          ) : null}
          {options.map((option, index) => (
            <button
              key={option.id}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              type="button"
              role="option"
              aria-selected={option.id === selectedId}
              tabIndex={-1}
              onClick={() => choose(option.id)}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
              className={OPTION_CLASS}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
