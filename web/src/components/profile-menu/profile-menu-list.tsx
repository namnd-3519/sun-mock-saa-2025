"use client";

import Link from "next/link";
import type { KeyboardEvent, RefObject } from "react";
import { IconChevronRight } from "@/components/icons/icon-chevron-right";
import { IconGrid } from "@/components/icons/icon-grid";
import { IconUser } from "@/components/icons/icon-user";
import { isActiveItem, type ProfileMenuIcon, type ProfileMenuItem } from "./profile-menu-items";

type ProfileMenuListProps = {
  id: string;
  label: string;
  items: ProfileMenuItem[];
  pathname: string;
  itemRefs: RefObject<(HTMLElement | null)[]>;
  onItemKeyDown: (event: KeyboardEvent<HTMLElement>, index: number) => void;
  onNavigate: () => void;
};

const ICONS: Record<ProfileMenuIcon, typeof IconUser> = {
  user: IconUser,
  grid: IconGrid,
  "chevron-right": IconChevronRight,
};

const ITEM_BASE =
  "flex h-14 w-full cursor-pointer items-center gap-1 rounded-sm p-4 text-base leading-6 font-bold tracking-[0.15px] whitespace-nowrap text-white outline-none transition-colors duration-200 hover:bg-brand-accent/10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-accent";
const ITEM_ACTIVE = "bg-brand-accent/10 [text-shadow:var(--shadow-nav-glow)]";

/** Open state of the account dropdown, styled from MoMorph frames z4sCl3_Qtk / 54rekaCHG1. */
export function ProfileMenuList({
  id,
  label,
  items,
  pathname,
  itemRefs,
  onItemKeyDown,
  onNavigate,
}: ProfileMenuListProps) {
  return (
    <ul
      id={id}
      role="menu"
      aria-label={label}
      className="absolute top-full right-0 z-30 mt-1 flex flex-col rounded-lg border border-brand-border bg-brand-container-2 p-1.5 shadow-lg"
    >
      {items.map((item, index) => {
        const Icon = ICONS[item.icon];
        const active = isActiveItem(item, pathname);
        const common = {
          ref: (node: HTMLElement | null) => {
            itemRefs.current[index] = node;
          },
          role: "menuitem",
          tabIndex: -1,
          onKeyDown: (event: KeyboardEvent<HTMLElement>) => onItemKeyDown(event, index),
          className: `${ITEM_BASE} ${active ? ITEM_ACTIVE : ""}`,
        };
        const content = (
          <>
            <span>{item.label}</span>
            <Icon className="shrink-0" />
          </>
        );
        return (
          <li key={item.id} role="none">
            {item.kind === "link" ? (
              <Link
                {...common}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={onNavigate}
              >
                {content}
              </Link>
            ) : (
              <form action={item.action} method="post">
                <button {...common} type="submit">
                  {content}
                </button>
              </form>
            )}
          </li>
        );
      })}
    </ul>
  );
}
