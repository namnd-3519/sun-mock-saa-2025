import type { Messages } from "@/i18n/messages";
import { GoogleLoginButton } from "./google-login-button";

export function LoginIntro({ messages }: { messages: Messages["login"] }) {
  return (
    <div className="mx-auto flex w-full max-w-[1152px] flex-col gap-10 lg:gap-20">
      <h1 className="max-w-[451px] text-[56px] leading-[1.1] font-bold tracking-tight text-white sm:text-[80px] sm:leading-[100px]">
        ROOT FURTHER
      </h1>
      <div className="flex w-full max-w-[496px] flex-col gap-6 lg:pl-4">
        <div className="text-xl leading-10 font-bold tracking-[0.5px] text-white">
          <p>{messages.subtitle}</p>
          <p>{messages.tagline}</p>
        </div>
        <GoogleLoginButton
          label={messages.button}
          loadingLabel={messages.loading}
          errorMessage={messages.error}
        />
      </div>
    </div>
  );
}
