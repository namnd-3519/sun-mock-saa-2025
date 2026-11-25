"use client";

import { useEffect, useState } from "react";
import type { HomeMessages } from "@/i18n/home-messages";
import { getRemainingTime, padTwoDigits, type RemainingTime } from "@/lib/prelaunch/countdown";

type HomeCountdownProps = {
  eventAtMs: number;
  initial: RemainingTime;
  messages: HomeMessages;
};

// B1.3 digit tile: 51x82, translucent gradient with a thin yellow border.
function DigitTile({ digit }: { digit: string }) {
  return (
    <div className="relative flex h-14 w-9 items-center justify-center md:h-[82px] md:w-[51px]">
      <div className="absolute inset-0 rounded-lg border-[0.5px] border-brand-accent bg-[linear-gradient(180deg,#fff_0%,rgb(255_255_255/0.1)_100%)] opacity-50 backdrop-blur-[16.64px]" />
      <span className="relative font-digital text-[34px] leading-none text-white md:text-[49px]">
        {digit}
      </span>
    </div>
  );
}

function CountdownTile({ value, label }: { value: number; label: string }) {
  const digits = padTwoDigits(value);
  return (
    <div className="flex flex-col items-start gap-2 md:gap-3.5">
      <div className="flex gap-1.5 md:gap-3.5" aria-hidden="true">
        <DigitTile digit={digits[0]} />
        <DigitTile digit={digits[1]} />
      </div>
      <span aria-hidden="true" className="text-base leading-6 font-bold text-white md:text-2xl md:leading-8">
        {label}
      </span>
      <span className="sr-only">{`${digits} ${label}`}</span>
    </div>
  );
}

/** B1: "Coming soon" and days/hours/minutes to the event; at zero it holds 00 and hides the subtitle. */
export function HomeCountdown({ eventAtMs, initial, messages }: HomeCountdownProps) {
  const [remaining, setRemaining] = useState(initial);

  useEffect(() => {
    const eventAt = new Date(eventAtMs);
    const tick = () => {
      const next = getRemainingTime(new Date(), eventAt);
      setRemaining(next);
      if (next.totalMs === 0) window.clearInterval(id);
    };
    const id = window.setInterval(tick, 1000);
    tick();
    return () => window.clearInterval(id);
  }, [eventAtMs]);

  return (
    <div className="flex flex-col items-start gap-4">
      {remaining.totalMs > 0 && (
        <p className="text-xl leading-8 font-bold text-white md:text-2xl">{messages.comingSoon}</p>
      )}
      <div role="timer" className="flex items-center gap-6 md:gap-10">
        <CountdownTile value={remaining.days} label={messages.days} />
        <CountdownTile value={remaining.hours} label={messages.hours} />
        <CountdownTile value={remaining.minutes} label={messages.minutes} />
      </div>
    </div>
  );
}
