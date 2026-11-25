import type { Messages } from "@/i18n/messages";
import { getRemainingTime } from "@/lib/prelaunch/countdown";
import { CountdownBackground } from "./countdown-background";
import { CountdownTimer } from "./countdown-timer";

type CountdownViewProps = {
  now: Date;
  launchAt: Date;
  messages: Messages["countdown"];
};

export function CountdownView({ now, launchAt, messages }: CountdownViewProps) {
  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-x-clip bg-brand-bg">
      <CountdownBackground />
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 md:px-36">
        <h1 className="text-center text-2xl font-bold leading-8 text-white md:text-4xl md:leading-[48px]">
          {messages.title}
        </h1>
        <CountdownTimer
          launchAtMs={launchAt.getTime()}
          initial={getRemainingTime(now, launchAt)}
          messages={messages}
        />
      </main>
    </div>
  );
}
