"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Messages } from "@/i18n/messages";
import { getRemainingTime, type RemainingTime } from "@/lib/prelaunch/countdown";
import { CountdownUnit } from "./countdown-unit";

type CountdownTimerProps = {
  launchAtMs: number;
  initial: RemainingTime;
  messages: Messages["countdown"];
};

export function CountdownTimer({ launchAtMs, initial, messages }: CountdownTimerProps) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(initial);

  useEffect(() => {
    const launchAt = new Date(launchAtMs);
    const tick = () => {
      const next = getRemainingTime(new Date(), launchAt);
      setRemaining(next);
      // At zero the server gate opens: re-render the requested route.
      if (next.totalMs === 0) {
        window.clearInterval(id);
        router.refresh();
      }
    };
    const id = window.setInterval(tick, 1000);
    tick();
    return () => window.clearInterval(id);
  }, [launchAtMs, router]);

  return (
    <div role="timer" className="flex items-center gap-4 md:gap-[60px]">
      <CountdownUnit value={remaining.days} label={messages.days} />
      <CountdownUnit value={remaining.hours} label={messages.hours} />
      <CountdownUnit value={remaining.minutes} label={messages.minutes} />
    </div>
  );
}
