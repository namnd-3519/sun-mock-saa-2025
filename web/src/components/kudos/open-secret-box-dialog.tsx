"use client";

import { useEffect, useReducer, useRef } from "react";
import { createPortal } from "react-dom";
import type { KudosMessages } from "@/i18n/kudos-messages";
import { KudosDataError } from "@/lib/kudos/kudos-error";
import { openSecretBox } from "@/lib/kudos/secret-box";
import {
  canOpenSecretBox,
  formatUnopenedCount,
  initialSecretBoxState,
  secretBoxReducer,
} from "@/lib/kudos/secret-box-rule";
import { badgeLabel } from "@/lib/kudos-live/kudos-format";
import { createSupabaseBrowserClient } from "@/lib/supabase/create-supabase-browser-client";
import { SecretBoxArt } from "./secret-box-art";

type OpenSecretBoxDialogProps = {
  unopened: number;
  messages: KudosMessages["secretBox"];
  onOpened: () => void;
  onClose: () => void;
};

type ErrorKey = keyof KudosMessages["secretBox"]["errors"];
const errorKey = (code: string): ErrorKey =>
  code === "no_unopened_box" || code === "not_authenticated" ? code : "unknown";

/**
 * Open secret box - chưa mở (MoMorph J3-4YFIpMM): A title + close, B hint, C clickable box,
 * D unopened count. Mounted only while open, as a native modal <dialog> portaled to <body>.
 */
export function OpenSecretBoxDialog({ unopened, messages: m, onOpened, onClose }: OpenSecretBoxDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [state, dispatch] = useReducer(secretBoxReducer, unopened, initialSecretBoxState);
  const canOpen = canOpenSecretBox(state);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => dialog?.close();
  }, []);

  const open = async () => {
    if (!canOpen) return;
    dispatch({ type: "start" });
    try {
      const { badge } = await openSecretBox(createSupabaseBrowserClient());
      dispatch({ type: "success", badge });
      onOpened();
    } catch (error) {
      dispatch({ type: "failure", code: error instanceof KudosDataError ? error.code : "unknown" });
      if (error instanceof KudosDataError && error.code === "no_unopened_box") onOpened();
    }
  };

  return createPortal(
    <dialog
      ref={ref}
      aria-labelledby="secret-box-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-[652px] rounded-[12.729px] bg-brand-bg p-0 text-white backdrop:bg-brand-bg/80"
    >
      <div className="flex flex-col items-center gap-[22.275px] px-[12.729px] py-[23.866px]">
        <div className="relative flex w-full max-w-[626px] items-center justify-center px-8">
          <h2 id="secret-box-title" className="text-center text-lg font-bold text-brand-accent sm:text-[25.457px] sm:leading-[31.822px]">
            {m.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={m.close}
            className="absolute right-0 flex size-8 items-center justify-center rounded text-white hover:bg-white/10"
          >
            <svg viewBox="0 0 19 19" className="size-[19px]" aria-hidden="true">
              <path d="M2 2l15 15M17 2L2 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <hr className="w-full max-w-[626px] border-0 border-t border-brand-divider" />

        {state.unopened > 0 ? (
          <p className="text-[12.729px] leading-[19.093px] font-bold tracking-[0.398px] text-white">{m.hint}</p>
        ) : null}

        <button
          type="button"
          onClick={open}
          disabled={!canOpen}
          aria-busy={state.phase === "opening"}
          aria-label={state.phase === "opening" ? m.opening : m.openBox}
          className="relative aspect-square w-full max-w-[557px] rounded-full transition-transform enabled:hover:scale-[1.02] disabled:cursor-not-allowed"
        >
          <SecretBoxArt dimmed={state.unopened === 0 && state.phase !== "opened"} />
          {state.phase === "opening" ? (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="size-12 animate-spin rounded-full border-4 border-brand-accent border-t-transparent" />
            </span>
          ) : null}
        </button>

        <p role="status" className="min-h-7 text-center text-lg leading-7 font-bold text-brand-accent">
          {state.phase === "opened" && state.badge ? m.received.replace("{badge}", badgeLabel(state.badge)) : null}
        </p>
        {state.error ? (
          <p role="alert" className="text-center text-base text-brand-error">
            {m.errors[errorKey(state.error)]}
          </p>
        ) : null}

        <hr className="w-full max-w-[626px] border-0 border-t border-brand-divider" />
        <p className="flex items-center gap-[6.364px]">
          <span className="text-[28.639px] leading-[35.004px] font-bold text-brand-accent">
            {formatUnopenedCount(state.unopened)}
          </span>
          <span className="text-[12.729px] leading-[19.093px] font-bold tracking-[0.398px] text-white">{m.unopened}</span>
        </p>
      </div>
    </dialog>,
    document.body,
  );
}
