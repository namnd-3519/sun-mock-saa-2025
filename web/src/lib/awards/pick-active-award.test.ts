import { describe, expect, it } from "vitest";
import { LOCALES } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { AWARD_CATEGORIES } from "@/lib/home/award-categories";
import { pickActiveAward } from "./pick-active-award";

const SECTIONS = [
  { id: "top-talent", top: 600 },
  { id: "top-project", top: 1300 },
  { id: "mvp", top: 2000 },
];

describe("pickActiveAward", () => {
  it("keeps the first award active before any section reaches the offset", () => {
    expect(pickActiveAward(SECTIONS, 120)).toBe("top-talent");
  });

  it("picks the last section whose top has passed the offset", () => {
    const scrolled = SECTIONS.map((s) => ({ ...s, top: s.top - 1250 }));
    expect(pickActiveAward(scrolled, 120)).toBe("top-project");
  });

  it("returns undefined when there are no sections", () => {
    expect(pickActiveAward([], 120)).toBeUndefined();
  });
});

describe("awards page messages", () => {
  it("has a detail with at least one prize for every award in both locales", () => {
    for (const locale of LOCALES) {
      const { details } = getMessages(locale).awardsPage;
      for (const award of AWARD_CATEGORIES) {
        const detail = details[award.descriptionKey];
        expect(detail.description.length).toBeGreaterThan(0);
        expect(detail.prizes.length).toBeGreaterThan(0);
      }
    }
  });
});
