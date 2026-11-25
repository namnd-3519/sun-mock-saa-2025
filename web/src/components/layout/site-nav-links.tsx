"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { isActivePath, type NavItem } from "@/lib/navigation/site-nav";

export type SiteNavLinksProps = {
  items: NavItem[];
  activePath: string | null;
  variant: "header" | "footer";
  ariaLabel: string;
};

const BASE =
  "flex items-center rounded p-4 font-bold whitespace-nowrap transition-[background-color,color,text-shadow] duration-200 hover:bg-brand-accent/10 hover:[text-shadow:var(--shadow-nav-glow)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent";
const SIZE = {
  header: "text-sm leading-5 tracking-[0.1px]",
  footer: "text-base leading-6 tracking-[0.15px]",
};
// Selected (A1.2): yellow text, glow and underline.
const SELECTED =
  "rounded-none border-b border-brand-accent text-brand-accent [text-shadow:var(--shadow-nav-glow)]";

// A selected link scrolls back to the top instead of reloading its own page.
function scrollToTop(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/** Presentational nav list shared by the header (A1) and the footer (7). */
export function SiteNavLinks({ items, activePath, variant, ariaLabel }: SiteNavLinksProps) {
  return (
    <nav aria-label={ariaLabel}>
      <ul
        className={`flex flex-wrap items-center ${variant === "header" ? "gap-2 xl:gap-6" : "gap-2 lg:gap-12"}`}
      >
        {items.map((item) => {
          const active = isActivePath(activePath, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={active ? scrollToTop : undefined}
                className={`${BASE} ${SIZE[variant]} ${active ? SELECTED : "text-white"}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
