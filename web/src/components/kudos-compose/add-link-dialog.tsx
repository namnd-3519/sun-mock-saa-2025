"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { WriteKudosMessages } from "@/i18n/write-kudos-messages";
import { LINK_LIMITS, validateLinkInput, validateLinkText, validateLinkUrl } from "@/lib/kudos-compose/link-input";
import { CloseIcon, LinkIcon } from "./compose-icons";
import { FieldError, INPUT_CLASS, borderFor } from "./field-label";

type AddLinkDialogProps = {
  initialText: string;
  messages: WriteKudosMessages["addLink"];
  onSave: (text: string, url: string) => void;
  onClose: () => void;
};

const ROW = "flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4";
const LABEL = "shrink-0 text-[22px] leading-7 font-bold text-brand-bg sm:min-w-[47px]";

/**
 * Addlink Box (MoMorph OyDLDuSGEa): A title, B Text, C Link, D Hủy/Lưu. Mounted only while open; a
 * native modal <dialog> portaled to <body> so its own form never nests in the Write Kudo form.
 */
export function AddLinkDialog({ initialText, messages: m, onSave, onClose }: AddLinkDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [text, setText] = useState(initialText);
  const [url, setUrl] = useState("");
  const [touched, setTouched] = useState({ text: false, url: false });
  const textError = touched.text ? validateLinkText(text) : undefined;
  const urlError = touched.url ? validateLinkUrl(url) : undefined;

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => dialog?.close();
  }, []);

  // Closing the dialog (StrictMode or Activity effect cleanup) blurs its field: not a user blur.
  const touch = (field: "text" | "url") => {
    if (ref.current?.open) setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const save = () => {
    setTouched({ text: true, url: true });
    const result = validateLinkInput({ text, url });
    if (result.ok) onSave(result.text, result.url);
  };

  return createPortal(
    <dialog
      ref={ref}
      aria-labelledby="add-link-heading"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-[752px] rounded-3xl bg-[#fff8e1] p-0 text-brand-bg backdrop:bg-brand-bg/80"
    >
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation(); // React bubbles portal events to the Write Kudo form.
          save();
        }}
        className="flex flex-col gap-8 p-6 sm:p-10"
      >
        <h2 id="add-link-heading" className="text-2xl font-bold sm:text-[32px] sm:leading-10">
          {m.heading}
        </h2>

        <div>
          <div className={ROW}>
            <label htmlFor="add-link-text" className={LABEL}>
              {m.text}
            </label>
            <input
              id="add-link-text"
              autoFocus
              value={text}
              maxLength={LINK_LIMITS.textMax}
              aria-required="true"
              aria-invalid={Boolean(textError)}
              aria-describedby={textError ? "add-link-text-error" : undefined}
              onChange={(event) => setText(event.target.value)}
              onBlur={() => touch("text")}
              className={`${INPUT_CLASS} ${borderFor(Boolean(textError))} min-w-0 flex-1`}
            />
          </div>
          <FieldError id="add-link-text-error" message={textError && m.textErrors[textError]} />
        </div>

        <div>
          <div className={ROW}>
            <label htmlFor="add-link-url" className={LABEL}>
              {m.link}
            </label>
            <div className="relative min-w-0 flex-1">
              <input
                id="add-link-url"
                type="url"
                inputMode="url"
                value={url}
                maxLength={LINK_LIMITS.urlMax}
                aria-required="true"
                aria-invalid={Boolean(urlError)}
                aria-describedby={urlError ? "add-link-url-error" : undefined}
                onChange={(event) => setUrl(event.target.value)}
                onBlur={() => touch("url")}
                className={`${INPUT_CLASS} ${borderFor(Boolean(urlError))} pr-14`}
              />
              <LinkIcon className="pointer-events-none absolute top-4 right-6 size-6" />
            </div>
          </div>
          <FieldError id="add-link-url-error" message={urlError && m.urlErrors[urlError]} />
        </div>

        <div className="flex w-full gap-6">
          <button
            type="button"
            onClick={onClose}
            className="flex h-[60px] shrink-0 items-center gap-2 rounded border border-brand-border bg-brand-accent/10 px-10 text-base leading-6 font-bold tracking-[0.15px] hover:bg-brand-accent/30"
          >
            {m.cancel}
            <CloseIcon className="size-6" />
          </button>
          <button
            type="submit"
            className="flex h-[60px] flex-1 items-center justify-center gap-2 rounded-lg bg-brand-accent p-4 text-[22px] leading-7 font-bold hover:brightness-95"
          >
            {m.save}
            <LinkIcon className="size-6" />
          </button>
        </div>
      </form>
    </dialog>,
    document.body,
  );
}
