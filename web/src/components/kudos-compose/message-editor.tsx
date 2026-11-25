"use client";

import { useRef, useState } from "react";
import type { WriteKudosMessages } from "@/i18n/write-kudos-messages";
import { STANDARDS_PATH } from "@/lib/navigation/site-nav";
import { insertLink } from "@/lib/kudos-compose/link-input";
import { applyMessageFormat, type MessageFormat } from "@/lib/kudos-compose/message-format";
import { AddLinkDialog } from "./add-link-dialog";
import { BoldIcon, ItalicIcon, LinkIcon, NumberedListIcon, QuoteIcon, StrikeIcon } from "./compose-icons";

type ToolKind = MessageFormat | "link";
type Selection = { start: number; end: number };

const TOOLS: { format: ToolKind; Icon: (p: { className?: string }) => React.ReactNode }[] = [
  { format: "bold", Icon: BoldIcon },
  { format: "italic", Icon: ItalicIcon },
  { format: "strike", Icon: StrikeIcon },
  { format: "numbered", Icon: NumberedListIcon },
  // C.5 Link: opens the Addlink Box (MoMorph OyDLDuSGEa).
  { format: "link", Icon: LinkIcon },
  { format: "quote", Icon: QuoteIcon },
];

type MessageEditorProps = {
  id: string;
  errorId: string;
  value: string;
  invalid: boolean;
  maxLength: number;
  messages: WriteKudosMessages;
  onChange: (value: string) => void;
  onBlur: () => void;
};

/** C toolbar + D textarea + D.1 hint. */
export function MessageEditor({ id, errorId, value, invalid, maxLength, messages, onChange, onBlur }: MessageEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [linkSelection, setLinkSelection] = useState<Selection | null>(null);
  const border = invalid ? "border-[#cf1322]" : "border-brand-border";

  const restoreSelection = ({ start, end }: Selection) =>
    requestAnimationFrame(() => {
      ref.current?.focus();
      ref.current?.setSelectionRange(start, end);
    });

  const format = (kind: ToolKind) => {
    const area = ref.current;
    if (!area) return;
    if (kind === "link") {
      setLinkSelection({ start: area.selectionStart, end: area.selectionEnd });
      return;
    }
    const next = applyMessageFormat(value, area.selectionStart, area.selectionEnd, kind);
    onChange(next.value);
    restoreSelection(next);
  };

  const closeLink = (next: Selection) => {
    setLinkSelection(null);
    restoreSelection(next);
  };

  return (
    <div className="flex w-full flex-col items-end gap-1">
      <div className="flex w-full flex-col">
        <div role="toolbar" aria-label={messages.toolbarLabel} aria-controls={id} className="flex h-10 w-full">
          {TOOLS.map(({ format: kind, Icon }, index) => (
            <button
              key={kind}
              type="button"
              title={messages.toolbar[kind]}
              aria-label={messages.toolbar[kind]}
              onClick={() => format(kind)}
              className={`flex h-10 w-14 items-center justify-center border border-r-0 ${border} text-brand-bg hover:bg-brand-accent/40 ${index === 0 ? "rounded-tl-lg" : ""}`}
            >
              <Icon className="size-6" />
            </button>
          ))}
          <a
            href={STANDARDS_PATH}
            target="_blank"
            rel="noreferrer"
            className={`flex h-10 flex-1 items-center justify-end rounded-tr-lg border ${border} px-4 text-base leading-6 font-bold tracking-[0.15px] text-[#e46060] underline`}
          >
            {messages.communityStandards}
          </a>
        </div>
        <textarea
          id={id}
          ref={ref}
          value={value}
          maxLength={maxLength}
          aria-label={messages.messageLabel}
          aria-invalid={invalid}
          aria-describedby={invalid ? errorId : undefined}
          placeholder={messages.messagePlaceholder}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          className={`h-[200px] min-h-[120px] w-full resize-y rounded-b-lg border border-t-0 ${border} bg-white px-6 py-2 text-base leading-6 font-bold tracking-[0.15px] text-brand-bg placeholder:text-[#999] focus:outline-2 focus:outline-brand-border`}
        />
      </div>
      {linkSelection && (
        <AddLinkDialog
          initialText={value.slice(linkSelection.start, linkSelection.end)}
          messages={messages.addLink}
          onClose={() => closeLink(linkSelection)}
          onSave={(text, url) => {
            const next = insertLink(value, linkSelection.start, linkSelection.end, text, url);
            onChange(next.value);
            closeLink(next);
          }}
        />
      )}
      <p className="w-full text-center text-base leading-6 font-bold tracking-[0.5px] text-brand-bg">{messages.mentionHint}</p>
    </div>
  );
}
