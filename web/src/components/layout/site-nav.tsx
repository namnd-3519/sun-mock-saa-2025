"use client";

import { usePathname } from "next/navigation";
import { SiteNavLinks, type SiteNavLinksProps } from "./site-nav-links";

/** Nav links with the selected item taken from the current route. */
export function SiteNav(props: Omit<SiteNavLinksProps, "activePath">) {
  return <SiteNavLinks {...props} activePath={usePathname()} />;
}
