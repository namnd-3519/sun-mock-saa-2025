"use client";

import { useId, useState } from "react";
import type { WriteKudosMessages } from "@/i18n/write-kudos-messages";
import { KUDOS_LIMITS } from "@/lib/kudos/kudos-limits";
import type { Hashtag } from "@/lib/kudos/kudos-types";
import { AddButton } from "./add-button";
import { CloseIcon } from "./compose-icons";

type HashtagPickerProps = {
  options: Hashtag[];
  value: Hashtag[];
  invalid: boolean;
  errorId: string;
  messages: WriteKudosMessages;
  onChange: (value: Hashtag[]) => void;
};

/**
 * E.2 Tag Group: chips with "x" plus a plain checkbox list behind "+ Hashtag".
 * Slot: the "Dropdown list hashtag" screen (#21) restyles the list.
 */
export function HashtagPicker({ options, value, invalid, errorId, messages, onChange }: HashtagPickerProps) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const selectedIds = new Set(value.map((tag) => tag.id));
  const full = value.length >= KUDOS_LIMITS.hashtagsMax;

  const toggle = (tag: Hashtag) => {
    if (selectedIds.has(tag.id)) onChange(value.filter((item) => item.id !== tag.id));
    else if (!full) onChange([...value, tag]);
  };

  return (
    <div
      className="relative flex min-w-0 flex-1 flex-wrap items-center gap-2"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      {value.map((tag) => (
        <span key={tag.id} className="flex h-8 items-center gap-1 rounded-full border border-brand-border bg-white pr-1 pl-3 text-sm font-bold text-brand-bg">
          #{tag.name}
          <button type="button" aria-label={`${messages.removeHashtag} #${tag.name}`} onClick={() => toggle(tag)} className="rounded-full p-0.5 hover:bg-brand-accent/40">
            <CloseIcon className="size-4" />
          </button>
        </span>
      ))}
      {!full && (
        <AddButton
          label={messages.addHashtag}
          note={messages.maxFive}
          expanded={open}
          describedBy={invalid ? errorId : undefined}
          onClick={() => setOpen((current) => !current)}
        />
      )}
      {open && (
        <ul id={listId} aria-label={messages.hashtag} className="absolute top-full left-0 z-20 mt-1 max-h-64 w-72 overflow-y-auto rounded-lg border border-brand-border bg-white py-1 shadow-lg">
          {options.map((tag) => {
            const checked = selectedIds.has(tag.id);
            return (
              <li key={tag.id}>
                <label className="flex cursor-pointer items-center gap-3 px-4 py-2 text-base font-bold text-brand-bg hover:bg-brand-accent/40">
                  <input type="checkbox" checked={checked} disabled={!checked && full} onChange={() => toggle(tag)} className="size-4 accent-brand-bg" />
                  #{tag.name}
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
