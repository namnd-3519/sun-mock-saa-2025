"use client";

import { useEffect, useState } from "react";
import { kudosShareUrl } from "@/lib/kudos-live/kudos-links";
import { IconLink } from "./kudos-icons";

type CopyLinkButtonProps = { kudosId: string; label: string; copiedLabel: string };

/** C.4.2 Copy Link: copies the kudos URL and shows "Link copied — ready to share!". */
export function CopyLinkButton({ kudosId, label, copiedLabel }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(kudosShareUrl(window.location.origin, kudosId));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="flex h-14 items-center gap-1 rounded p-4 text-base leading-6 font-bold tracking-[0.15px] text-brand-bg hover:bg-brand-accent/40 focus-visible:outline-2 focus-visible:outline-brand-bg"
      >
        {label}
        <IconLink />
      </button>
      {copied ? (
        <p
          role="status"
          className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-brand-border bg-brand-container-2 px-6 py-3 text-base font-bold text-white shadow-lg"
        >
          {copiedLabel}
        </p>
      ) : null}
    </>
  );
}
