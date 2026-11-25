import { padTwoDigits } from "@/lib/prelaunch/countdown";

type CountdownUnitProps = { value: number; label: string };

function DigitBox({ digit }: { digit: string }) {
  return (
    <div className="relative flex h-16 w-10 items-center justify-center md:h-[123px] md:w-[77px]">
      <div className="absolute inset-0 rounded-xl border-[0.75px] border-brand-accent bg-[linear-gradient(180deg,#fff_0%,rgb(255_255_255/0.1)_100%)] opacity-50 backdrop-blur-[25px]" />
      <span className="relative font-digital text-[38px] leading-none text-white md:text-[74px]">
        {digit}
      </span>
    </div>
  );
}

export function CountdownUnit({ value, label }: CountdownUnitProps) {
  const digits = padTwoDigits(value);
  return (
    <div className="flex flex-col items-start gap-2 md:gap-[21px]">
      <div className="flex gap-2 md:gap-[21px]" aria-hidden="true">
        <DigitBox digit={digits[0]} />
        <DigitBox digit={digits[1]} />
      </div>
      <span aria-hidden="true" className="text-base font-bold leading-6 text-white md:text-4xl md:leading-[48px]">
        {label}
      </span>
      <span className="sr-only">{`${digits} ${label}`}</span>
    </div>
  );
}
