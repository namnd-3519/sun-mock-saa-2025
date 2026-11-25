import { describe, expect, it } from "vitest";
import { getMessages } from "@/i18n/messages";
import { getFooterNavItems, getHeaderNavItems, isActivePath } from "./site-nav";

describe("getHeaderNavItems", () => {
  it("lists the three header links from the spec, About SAA 2025 being the homepage", () => {
    expect(getHeaderNavItems(getMessages("vi").nav)).toEqual([
      { href: "/", label: "About SAA 2025" },
      { href: "/awards", label: "Awards Information" },
      { href: "/kudos", label: "Sun* Kudos" },
    ]);
  });
});

describe("getFooterNavItems", () => {
  it("adds the general standards link after the header links", () => {
    const items = getFooterNavItems(getMessages("vi").nav);
    expect(items.map((item) => item.href)).toEqual(["/", "/awards", "/kudos", "/rules"]);
    expect(items[3].label).toBe("Tiêu chuẩn chung");
    expect(getFooterNavItems(getMessages("en").nav)[3].label).toBe("General standards");
  });
});

describe("isActivePath", () => {
  it("selects the homepage link only on the homepage", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/kudos", "/")).toBe(false);
  });

  it("selects a section link on its page and its sub-pages", () => {
    expect(isActivePath("/kudos", "/kudos")).toBe(true);
    expect(isActivePath("/kudos/123", "/kudos")).toBe(true);
    expect(isActivePath("/kudos-archive", "/kudos")).toBe(false);
    expect(isActivePath("/awards", "/kudos")).toBe(false);
  });

  it("selects nothing while the path is unknown", () => {
    expect(isActivePath(null, "/")).toBe(false);
  });
});
