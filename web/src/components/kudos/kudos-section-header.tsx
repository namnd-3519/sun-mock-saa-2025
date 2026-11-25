import type { ReactNode } from "react";

type KudosSectionHeaderProps = { caption: string; title: string; id?: string; children?: ReactNode };

/** B.1 / B.6 / C.1 "Header Giải thưởng": caption, divider, big title, optional controls. */
export function KudosSectionHeader({ caption, title, id, children }: KudosSectionHeaderProps) {
  return (
    <header className="flex w-full flex-col gap-4">
      <p className="text-lg leading-8 font-bold text-white md:text-2xl">{caption}</p>
      <hr className="border-0 border-t border-brand-divider" />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
        <h2
          id={id}
          className="text-4xl leading-[44px] font-bold tracking-[-0.25px] text-brand-accent md:text-[57px] md:leading-16"
        >
          {title}
        </h2>
        {children}
      </div>
    </header>
  );
}
