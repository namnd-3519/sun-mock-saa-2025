import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { kudosEn } from "@/i18n/kudos-messages";
import type { KudosFilters } from "@/lib/kudos/kudos-types";
import { KudosFilterButtons } from "./kudos-filter-buttons";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

const hashtags = [
  { id: "h1", name: "teamwork" },
  { id: "h2", name: "kindness" },
];
const departments = [{ id: "d1", code: "CEVC1" }];

function renderBar(filters: KudosFilters = {}, tags = hashtags) {
  render(<KudosFilterButtons filters={filters} hashtags={tags} departments={departments} messages={kudosEn} />);
}

describe("KudosFilterButtons", () => {
  beforeEach(() => {
    push.mockReset();
    window.history.replaceState(null, "", "/kudos");
  });

  it("filters by hashtag and keeps the other params", async () => {
    window.history.replaceState(null, "", "/kudos?department=d1");
    renderBar({ departmentId: "d1" });
    const button = screen.getByRole("button", { name: kudosEn.filterHashtag });
    expect(button).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(button);
    expect(screen.getByRole("option", { name: "#teamwork" })).toHaveFocus();
    await userEvent.click(screen.getByRole("option", { name: "#kindness" }));
    expect(push).toHaveBeenCalledWith("/kudos?department=d1&hashtag=h2", { scroll: false });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  it("clears the filter when the selected option is picked again", async () => {
    window.history.replaceState(null, "", "/kudos?hashtag=h1");
    renderBar({ hashtagId: "h1" });
    const button = screen.getByRole("button", { name: kudosEn.filterHashtag });
    expect(button).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(button);
    const selected = screen.getByRole("option", { name: "#teamwork" });
    expect(selected).toHaveAttribute("aria-selected", "true");
    await userEvent.click(selected);
    expect(push).toHaveBeenCalledWith("/kudos", { scroll: false });
  });

  it("filters by department", async () => {
    renderBar();
    await userEvent.click(screen.getByRole("button", { name: kudosEn.filterDepartment }));
    await userEvent.click(screen.getByRole("option", { name: "CEVC1" }));
    expect(push).toHaveBeenCalledWith("/kudos?department=d1", { scroll: false });
  });

  it("shows the empty label when there is nothing to pick", async () => {
    renderBar({}, []);
    await userEvent.click(screen.getByRole("button", { name: kudosEn.filterHashtag }));
    expect(screen.getByText(kudosEn.filterEmpty)).toBeInTheDocument();
  });

  it("supports keyboard navigation and dismissal", async () => {
    renderBar();
    const button = screen.getByRole("button", { name: kudosEn.filterHashtag });
    button.focus();
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: "#kindness" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(push).toHaveBeenCalledWith("/kudos?hashtag=h2", { scroll: false });
    await userEvent.keyboard("{ArrowUp}");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(button).toHaveFocus();
    await userEvent.click(button);
    await userEvent.click(document.body);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("offers Clear filters only while a filter is active", () => {
    renderBar();
    expect(screen.queryByRole("link", { name: kudosEn.clearFilters })).not.toBeInTheDocument();
    renderBar({ hashtagId: "h1" });
    expect(screen.getByRole("link", { name: kudosEn.clearFilters })).toHaveAttribute("href", "/kudos");
  });
});
