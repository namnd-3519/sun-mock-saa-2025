import Link from "next/link";
import type { ReactNode, Ref } from "react";

type FabActionLinkProps = {
  href: string;
  icon: ReactNode;
  label: string;
  onNavigate: () => void;
  linkRef?: Ref<HTMLAnchorElement>;
  className?: string;
};

// A/B (Sv7DFwBw1h): 64px tall, #FFEA9E, radius 4, padding 16, gap 8, 24/32 bold dark label.
const BASE =
  "flex h-16 items-center gap-2 rounded bg-brand-accent p-4 text-2xl leading-8 font-bold whitespace-nowrap text-brand-bg shadow-[var(--shadow-nav-glow)] transition-[box-shadow,filter] duration-200 hover:shadow-[var(--shadow-fab-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent";

/** One expanded quick action of the floating action button. */
export function FabActionLink({ href, icon, label, onNavigate, linkRef, className = "" }: FabActionLinkProps) {
  return (
    <Link ref={linkRef} href={href} onClick={onNavigate} className={`${BASE} ${className}`}>
      <span className="flex size-6 shrink-0 items-center justify-center">{icon}</span>
      {label}
    </Link>
  );
}
