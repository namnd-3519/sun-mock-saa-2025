"use client";

import { useEffect, useId, useState } from "react";
import { KudosAvatar } from "@/components/kudos/kudos-avatar";
import type { WriteKudosMessages } from "@/i18n/write-kudos-messages";
import { searchProfiles } from "@/lib/kudos/reference-data";
import type { KudosClient, ProfileSearchResult } from "@/lib/kudos/kudos-types";
import { ChevronDownIcon } from "./compose-icons";
import { INPUT_CLASS, borderFor } from "./field-label";

type RecipientPickerProps = {
  client: KudosClient;
  inputId: string;
  errorId: string;
  value: ProfileSearchResult | null;
  invalid: boolean;
  senderId: string;
  messages: WriteKudosMessages;
  onChange: (value: ProfileSearchResult | null) => void;
  onBlur: () => void;
};

/** B.2: autocomplete of Sunners by name (searchProfiles); the sender is left out. */
export function RecipientPicker({ client, inputId, errorId, value, invalid, senderId, messages, onChange, onBlur }: RecipientPickerProps) {
  const listId = useId();
  const [query, setQuery] = useState(value?.fullName ?? "");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<ProfileSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || value) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      const found = await searchProfiles(client, query).catch(() => []);
      if (cancelled) return;
      setResults(found.filter((profile) => profile.id !== senderId));
      setLoading(false);
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [client, open, query, senderId, value]);

  const select = (profile: ProfileSearchResult) => {
    onChange(profile);
    setQuery(profile.fullName ?? "");
    setOpen(false);
  };

  return (
    <div className="relative min-w-0 flex-1">
      <input
        id={inputId}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-invalid={invalid}
        aria-describedby={invalid ? errorId : undefined}
        autoComplete="off"
        value={query}
        placeholder={messages.recipientPlaceholder}
        onChange={(event) => {
          setQuery(event.target.value);
          if (value) onChange(null);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setTimeout(() => setOpen(false), 150);
          onBlur();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
          if (event.key === "Enter" && open && results[0] && !value) {
            event.preventDefault();
            select(results[0]);
          }
        }}
        className={`${INPUT_CLASS} ${borderFor(invalid)} pr-14`}
      />
      <ChevronDownIcon className="pointer-events-none absolute top-4 right-6 size-6 text-brand-bg" />
      {open && !value && query.trim() && (
        <ul id={listId} role="listbox" className="absolute inset-x-0 top-[60px] z-20 max-h-64 overflow-y-auto rounded-lg border border-brand-border bg-white py-1 shadow-lg">
          {loading && results.length === 0 && <li className="px-6 py-3 text-[#999]">{messages.searching}</li>}
          {!loading && results.length === 0 && <li className="px-6 py-3 text-[#999]">{messages.recipientEmpty}</li>}
          {results.map((profile) => (
            <li
              key={profile.id}
              role="option"
              aria-selected={false}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => select(profile)}
              className="flex cursor-pointer items-center gap-3 px-6 py-2 font-bold text-brand-bg hover:bg-brand-accent/40"
            >
              <KudosAvatar src={profile.avatarUrl} name={profile.fullName} size={32} />
              {profile.fullName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
