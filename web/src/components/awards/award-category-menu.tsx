"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { IconTarget } from "@/components/icons/icon-target";
import { pickActiveAward } from "@/lib/awards/pick-active-award";

type MenuItem = { slug: string; label: string };

// Sticky header (80px) plus breathing room: a section counts as reached past this line.
const SPY_OFFSET = 160;

const ITEM =
  "flex items-center gap-1 p-4 text-sm leading-5 font-bold tracking-[0.25px] whitespace-nowrap transition-[background-color,color,text-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent lg:whitespace-normal";
const ACTIVE = "border-b border-brand-accent text-brand-accent [text-shadow:var(--shadow-nav-glow)]";
const IDLE = "rounded text-white hover:bg-brand-accent/10 hover:[text-shadow:var(--shadow-nav-glow)]";

/** C: category menu; follows the scroll position and smooth-scrolls to a category on click. */
export function AwardCategoryMenu({ items, ariaLabel }: { items: MenuItem[]; ariaLabel: string }) {
  const [active, setActive] = useState<string | undefined>(items[0]?.slug);

  useEffect(() => {
    const update = () => {
      const tops = items.flatMap(({ slug }) => {
        const el = document.getElementById(slug);
        return el ? [{ id: slug, top: el.getBoundingClientRect().top }] : [];
      });
      setActive(pickActiveAward(tops, SPY_OFFSET));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [items]);

  const goTo = (event: MouseEvent<HTMLAnchorElement>, slug: string) => {
    const target = document.getElementById(slug);
    if (!target) return;
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", `#${slug}`);
    setActive(slug);
  };

  return (
    <nav aria-label={ariaLabel} className="lg:sticky lg:top-[104px] lg:w-[178px] lg:shrink-0">
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-4 lg:overflow-visible lg:px-0">
        {items.map(({ slug, label }) => {
          const isActive = slug === active;
          return (
            <li key={slug} className="shrink-0">
              <a
                href={`#${slug}`}
                aria-current={isActive ? "location" : undefined}
                onClick={(event) => goTo(event, slug)}
                className={`${ITEM} ${isActive ? ACTIVE : IDLE}`}
              >
                <IconTarget className="shrink-0" />
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
