import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AwardCategoryMenu } from "./award-category-menu";

const items = [
  { slug: "top-talent", label: "Top Talent" },
  { slug: "top-project", label: "Top Project" },
];

function renderMenu(tops: Record<string, number>) {
  for (const [slug, top] of Object.entries(tops)) {
    const section = document.createElement("section");
    section.id = slug;
    section.getBoundingClientRect = () => ({ top }) as DOMRect;
    section.scrollIntoView = vi.fn();
    document.body.append(section);
  }
  render(<AwardCategoryMenu items={items} ariaLabel="Award categories" />);
}

const link = (name: string) => screen.getByRole("link", { name });

describe("AwardCategoryMenu", () => {
  afterEach(() => document.querySelectorAll("section").forEach((section) => section.remove()));

  it("marks the first category until a later section scrolls past the header", () => {
    renderMenu({ "top-talent": 400, "top-project": 900 });
    expect(link("Top Talent")).toHaveAttribute("aria-current", "location");
    const project = document.getElementById("top-project") as HTMLElement;
    project.getBoundingClientRect = () => ({ top: 100 }) as DOMRect;
    act(() => void window.dispatchEvent(new Event("scroll")));
    expect(link("Top Project")).toHaveAttribute("aria-current", "location");
    expect(link("Top Talent")).not.toHaveAttribute("aria-current");
  });

  it("scrolls to a category on click, honoring reduced motion", async () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as never;
    renderMenu({ "top-talent": 400, "top-project": 900 });
    await userEvent.click(link("Top Project"));
    const project = document.getElementById("top-project") as HTMLElement;
    expect(project.scrollIntoView).toHaveBeenCalledWith({ behavior: "auto", block: "start" });
    expect(window.location.hash).toBe("#top-project");
    expect(link("Top Project")).toHaveAttribute("aria-current", "location");
  });
});
