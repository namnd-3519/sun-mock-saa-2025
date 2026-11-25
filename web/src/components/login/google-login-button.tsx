"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IconGoogle } from "./icon-google";
import { IconSpinner } from "./icon-spinner";
import { startGoogleSignIn } from "./start-google-sign-in";

type GoogleLoginButtonProps = {
  label: string;
  loadingLabel: string;
  errorMessage: string;
};

type Status = "idle" | "loading" | "error";

export function GoogleLoginButton({
  label,
  loadingLabel,
  errorMessage,
}: GoogleLoginButtonProps) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const inFlight = useRef(false);
  const isLoading = status === "loading";

  async function handleClick() {
    if (inFlight.current) return;
    inFlight.current = true;
    setStatus("loading");
    try {
      await startGoogleSignIn();
      router.push("/todo");
    } catch {
      inFlight.current = false;
      setStatus("error");
    }
  }

  return (
    <div className="w-full max-w-[305px]">
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        aria-busy={isLoading}
        className="flex h-[60px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-accent px-6 py-4 text-[22px] leading-7 font-bold text-brand-bg transition-[background-color,opacity] duration-200 hover:bg-brand-accent/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span>{isLoading ? loadingLabel : label}</span>
        {isLoading ? <IconSpinner className="animate-spin" /> : <IconGoogle />}
      </button>
      <div role="alert" className="min-h-9">
        {status === "error" && (
          <p className="mt-3 text-base leading-6 font-bold text-brand-error">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
