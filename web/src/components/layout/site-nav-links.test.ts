import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getMessages } from "@/i18n/messages";
import { getFooterNavItems, getHeaderNavItems } from "@/lib/navigation/site-nav";
import { SiteNavLinks, type SiteNavLinksProps } from "./site-nav-links";

const nav = getMessages("vi").nav;

// vitest runs in node without a DOM, so read the anchors from the static markup.
function readLinks(html: string) {
  return [...html.matchAll(/<a ([^>]*)>(.*?)<\/a>/g)].map(([, attrs, text]) => ({
    href: /href="([^"]*)"/.exec(attrs)?.[1] ?? "",
    current: /aria-current="([^"]*)"/.exec(attrs)?.[1] ?? null,
    className: /class="([^"]*)"/.exec(attrs)?.[1] ?? "",
    text,
  }));
}

function render(props: Partial<SiteNavLinksProps>) {
  const html = renderToStaticMarkup(
    createElement(SiteNavLinks, {
      items: getHeaderNavItems(nav),
      activePath: "/",
      variant: "header",
      ariaLabel: nav.main,
      ...props,
    }),
  );
  return { html, links: readLinks(html) };
}

describe("SiteNavLinks", () => {
  it("renders a labelled nav with the header links in order", () => {
    const { html, links } = render({});
    expect(html).toContain('<nav aria-label="Điều hướng chính">');
    expect(links.map((l) => [l.href, l.text])).toEqual([
      ["/", "About SAA 2025"],
      ["/awards", "Awards Information"],
      ["/kudos", "Sun* Kudos"],
    ]);
  });

  it("marks only the current page's link as selected, in yellow with an underline", () => {
    const { links } = render({ activePath: "/kudos/42" });
    expect(links.map((l) => l.current)).toEqual([null, null, "page"]);
    expect(links[2].className).toContain("text-brand-accent");
    expect(links[2].className).toContain("border-b");
    expect(links[0].className).toContain("text-white");
    expect(links[0].className).not.toContain("border-b");
  });

  it("gives every link the hover highlight", () => {
    for (const link of render({ activePath: null }).links) {
      expect(link.current).toBeNull();
      expect(link.className).toContain("hover:bg-brand-accent/10");
    }
  });

  it("uses the larger footer type and the extra footer link", () => {
    const { links } = render({ variant: "footer", items: getFooterNavItems(nav) });
    expect(links).toHaveLength(4);
    expect(links[3]).toMatchObject({ href: "/rules", text: "Tiêu chuẩn chung" });
    expect(links[0].className).toContain("text-base");
  });
});
