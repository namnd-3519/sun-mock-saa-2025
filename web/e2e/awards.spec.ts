import { expect, test } from "@playwright/test";
import { getMessages } from "@/i18n/messages";

const m = getMessages("vi").awardsPage;

test("awards page lists every category with its detail", async ({ page }) => {
  await page.goto("/awards");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(m.title);
  const menu = page.getByRole("navigation", { name: m.categoriesLabel });
  await expect(menu.getByRole("link")).toHaveCount(6);
  for (const name of ["Top Talent", "Top Project", "Best Manager", "MVP (Most Valuable Person)"]) {
    const region = page.getByRole("region", { name, exact: true });
    await expect(region.getByRole("heading", { level: 2, name, exact: true })).toBeVisible();
    await expect(region.getByRole("heading", { name: m.quantityLabel })).toBeVisible();
    await expect(region.getByRole("heading", { name: m.valueLabel })).toBeVisible();
  }
});

test("picking a category scrolls to it and marks it current", async ({ page }) => {
  await page.goto("/awards");
  const menu = page.getByRole("navigation", { name: m.categoriesLabel });
  const link = menu.getByRole("link", { name: "Best Manager" });
  await link.click();
  await expect(link).toHaveAttribute("aria-current", "location");
  await expect(page.getByRole("region", { name: "Best Manager" })).toBeInViewport();
});
