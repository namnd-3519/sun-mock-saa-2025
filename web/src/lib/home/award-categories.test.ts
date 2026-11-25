import { describe, expect, it } from "vitest";
import { LOCALES } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { AWARD_CATEGORIES, getAwardHref } from "./award-categories";

describe("AWARD_CATEGORIES", () => {
  it("lists the six categories of the spec in order", () => {
    expect(AWARD_CATEGORIES.map((award) => award.title)).toEqual([
      "Top Talent",
      "Top Project",
      "Top Project Leader",
      "Best Manager",
      "Signature 2025 - Creator",
      "MVP (Most Valuable Person)",
    ]);
  });

  it("uses unique URL-safe slugs", () => {
    const slugs = AWARD_CATEGORIES.map((award) => award.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("has a description for every category in every language", () => {
    for (const locale of LOCALES) {
      const { awards } = getMessages(locale).home;
      for (const award of AWARD_CATEGORIES) {
        expect(awards[award.descriptionKey].trim()).not.toBe("");
      }
    }
  });

  it("matches the spec's Top Talent description", () => {
    expect(getMessages("vi").home.awards.topTalent).toBe(
      "Vinh danh top cá nhân xuất sắc trên mọi phương diện",
    );
  });
});

describe("getAwardHref", () => {
  it("opens Awards Information scrolled to the category", () => {
    expect(getAwardHref("top-talent")).toBe("/awards#top-talent");
  });
});
