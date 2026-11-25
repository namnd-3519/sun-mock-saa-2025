"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { WriteKudosMessages } from "@/i18n/write-kudos-messages";
import { isHashtagSelectionFull, toggleHashtag } from "@/lib/kudos-compose/hashtag-selection";
import type { Hashtag } from "@/lib/kudos/kudos-types";
import { AddButton } from "./add-button";
import { CloseIcon } from "./compose-icons";
import { HashtagDropdown } from "./hashtag-dropdown";

type HashtagPickerProps = {
  options: Hashtag[];
  value: Hashtag[];
  invalid: boolean;
  errorId: string;
  messages: WriteKudosMessages;
  onChange: (value: Hashtag[]) => void;
};

/**
 * E.2 Tag Group: removable chips plus the "+ Hashtag" trigger that opens the
 * multi-select "Dropdown list hashtag" (#21). The trigger hides once 5 tags are picked
 * and the list is closed; chips still remove tags.
 */
export function HashtagPicker({ options, value, invalid, errorId, messages, onChange }: HashtagPickerProps) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const full = isHashtagSelectionFull(value);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const toggle = (tag: Hashtag) => onChange(toggleHashtag(value, tag));

  return (
    <div ref={rootRef} className="relative flex min-w-0 flex-1 flex-wrap items-center gap-2">
      {value.map((tag) => (
        <span key={tag.id} className="flex h-8 items-center gap-1 rounded-full border border-brand-border bg-white pr-1 pl-3 text-sm font-bold text-brand-bg">
          #{tag.name}
          <button type="button" aria-label={`${messages.removeHashtag} #${tag.name}`} onClick={() => toggle(tag)} className="rounded-full p-0.5 hover:bg-brand-accent/40">
            <CloseIcon className="size-4" />
          </button>
        </span>
      ))}
      {(!full || open) && (
        <AddButton
          ref={triggerRef}
          label={messages.addHashtag}
          note={messages.maxFive}
          expanded={open}
          hasPopup="listbox"
          controls={open ? listId : undefined}
          describedBy={invalid ? errorId : undefined}
          onClick={() => setOpen((current) => !current)}
        />
      )}
      {open && (
        <HashtagDropdown
          id={listId}
          label={messages.hashtag}
          emptyLabel={messages.hashtagEmpty}
          options={options}
          value={value}
          onToggle={toggle}
          onClose={() => {
            setOpen(false);
            triggerRef.current?.focus();
          }}
          onDismiss={() => setOpen(false)}
        />
      )}
    </div>
  );
}
