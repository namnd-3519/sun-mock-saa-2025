"use client";

import Link from "next/link";
import type { WriteKudosMessages } from "@/i18n/write-kudos-messages";
import { KUDOS_LIMITS } from "@/lib/kudos/kudos-limits";
import type { Hashtag } from "@/lib/kudos/kudos-types";
import { KUDOS_PATH } from "@/lib/navigation/site-nav";
import { CloseIcon, SendIcon } from "./compose-icons";
import { FieldError, FieldLabel, INPUT_CLASS, borderFor } from "./field-label";
import { HashtagPicker } from "./hashtag-picker";
import { ImagePicker } from "./image-picker";
import { MessageEditor } from "./message-editor";
import { RecipientPicker } from "./recipient-picker";
import { useWriteKudos } from "./use-write-kudos";

type WriteKudosFormProps = { senderId: string; hashtags: Hashtag[]; messages: WriteKudosMessages };

const ROW = "flex w-full flex-col gap-4 sm:flex-row sm:items-start";
const LABEL_COL = "sm:w-[146px] sm:pt-3.5";

/** "Viết KUDO" modal (MoMorph ihQ26W78P2): A title … H footer. */
export function WriteKudosForm({ senderId, hashtags, messages: m }: WriteKudosFormProps) {
  const form = useWriteKudos(senderId, m);
  const { draft } = form;
  const recipientError = form.errorFor("recipient");
  const titleError = form.errorFor("title");
  const contentError = form.errorFor("content");
  const hashtagError = form.errorFor("hashtags");
  const anonymousError = form.errorFor("anonymousName");

  return (
    <form
      noValidate
      aria-labelledby="write-kudos-heading"
      aria-busy={form.submitting}
      onSubmit={(event) => {
        event.preventDefault();
        void form.submit();
      }}
      className="flex w-full max-w-[752px] flex-col gap-8 rounded-3xl bg-[#fff8e1] p-6 text-brand-bg sm:p-10"
    >
      <h1 id="write-kudos-heading" className="text-center text-2xl font-bold sm:text-[32px] sm:leading-10">
        {m.heading}
      </h1>

      <div>
        <div className={ROW}>
          <FieldLabel htmlFor="kudos-recipient" text={m.recipient} required className={LABEL_COL} />
          <RecipientPicker
            client={form.client}
            inputId="kudos-recipient"
            errorId="kudos-recipient-error"
            value={draft.recipient}
            invalid={Boolean(recipientError)}
            senderId={senderId}
            messages={m}
            onChange={(recipient) => form.update({ recipient })}
            onBlur={() => form.touch("recipient")}
          />
        </div>
        <FieldError id="kudos-recipient-error" message={recipientError} />
      </div>

      <div className={ROW}>
        <FieldLabel htmlFor="kudos-title" text={m.title} required className={LABEL_COL} />
        <div className="min-w-0 flex-1">
          <input
            id="kudos-title"
            value={draft.title}
            maxLength={KUDOS_LIMITS.titleMax}
            placeholder={m.titlePlaceholder}
            aria-invalid={Boolean(titleError)}
            aria-describedby={titleError ? "kudos-title-error" : "kudos-title-hint"}
            onChange={(event) => form.update({ title: event.target.value })}
            onBlur={() => form.touch("title")}
            className={`${INPUT_CLASS} ${borderFor(Boolean(titleError))}`}
          />
          <FieldError id="kudos-title-error" message={titleError} />
          <p id="kudos-title-hint" className="mt-4 text-base leading-6 font-bold tracking-[0.15px] whitespace-pre-line text-[#999]">
            {m.titleHint}
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-6">
        <div>
          <MessageEditor
            id="kudos-content"
            errorId="kudos-content-error"
            value={draft.content}
            invalid={Boolean(contentError)}
            maxLength={KUDOS_LIMITS.contentMax}
            messages={m}
            onChange={(content) => form.update({ content })}
            onBlur={() => form.touch("content")}
          />
          <FieldError id="kudos-content-error" message={contentError} />
        </div>

        <div>
          <div className={ROW}>
            <FieldLabel id="kudos-hashtag-label" text={m.hashtag} required className="sm:w-[108px] sm:pt-2.5" />
            <HashtagPicker
              options={hashtags}
              value={draft.hashtags}
              invalid={Boolean(hashtagError)}
              errorId="kudos-hashtag-error"
              messages={m}
              onChange={(value) => {
                form.update({ hashtags: value });
                form.touch("hashtags");
              }}
            />
          </div>
          <FieldError id="kudos-hashtag-error" message={hashtagError} />
        </div>

        <div>
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
            <FieldLabel text={m.image} className="sm:w-[74px]" />
            <ImagePicker images={form.images} messages={m} onAdd={form.addImages} onRemove={form.removeImage} />
          </div>
          <FieldError id="kudos-image-error" message={form.imageError ?? undefined} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex cursor-pointer items-center gap-4 text-lg leading-7 font-bold text-[#999] sm:text-[22px]">
          <input
            type="checkbox"
            checked={draft.isAnonymous}
            onChange={(event) => form.update({ isAnonymous: event.target.checked })}
            className="size-6 shrink-0 cursor-pointer rounded border border-[#999] accent-brand-bg"
          />
          {m.anonymous}
        </label>
        {draft.isAnonymous && (
          <div>
            <input
              value={draft.anonymousName}
              maxLength={KUDOS_LIMITS.anonymousNameMax}
              aria-label={m.anonymousName}
              placeholder={m.anonymousName}
              aria-invalid={Boolean(anonymousError)}
              onChange={(event) => form.update({ anonymousName: event.target.value })}
              onBlur={() => form.touch("anonymousName")}
              className={`${INPUT_CLASS} ${borderFor(Boolean(anonymousError))}`}
            />
            <FieldError id="kudos-anonymous-error" message={anonymousError} />
          </div>
        )}
      </div>

      {form.submitError && (
        <p role="alert" className="rounded-lg border border-[#cf1322] bg-[#cf1322]/10 px-4 py-3 text-base font-bold text-[#cf1322]">
          {form.submitError}
        </p>
      )}

      <div className="flex w-full gap-6">
        <Link
          href={KUDOS_PATH}
          className="flex h-[60px] shrink-0 items-center gap-2 rounded border border-brand-border bg-brand-accent/10 px-10 text-base leading-6 font-bold tracking-[0.15px] hover:bg-brand-accent/30"
        >
          {m.cancel}
          <CloseIcon className="size-6" />
        </Link>
        <button
          type="submit"
          disabled={!form.canSubmit}
          className="flex h-[60px] flex-1 items-center justify-center gap-2 rounded-lg bg-brand-accent p-4 text-[22px] leading-7 font-bold hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {form.submitting ? m.submitting : m.submit}
          <SendIcon className="size-6" />
        </button>
      </div>
    </form>
  );
}
