import { expect, test } from "@playwright/test";
import { getMessages } from "@/i18n/messages";

const vi = getMessages("vi");

test("homepage renders header, hero, countdown, awards, kudos promo and footer", async ({ page }) => {
  await page.goto("/");
  const header = page.getByRole("banner");
  await expect(header.getByRole("navigation", { name: vi.nav.main })).toBeVisible();
  await expect(header.getByRole("link", { name: vi.nav.kudos })).toHaveAttribute("href", "/kudos");

  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { level: 1, name: vi.home.rootFurtherAlt })).toBeVisible();
  await expect(main.getByRole("timer")).toBeVisible();
  await expect(main.getByText(vi.home.venueValue)).toBeVisible();
  await expect(main.getByRole("link", { name: vi.home.aboutAwards })).toHaveAttribute("href", "/awards");

  const awards = main.getByRole("region", { name: vi.home.awardsTitle });
  await expect(awards.getByRole("listitem")).toHaveCount(6);
  await expect(awards.getByRole("heading", { level: 3, name: "Top Talent" })).toBeVisible();

  await expect(main.getByRole("heading", { level: 2, name: "Sun* Kudos" })).toBeVisible();
  await expect(page.getByRole("contentinfo").getByText(vi.footer.copyright)).toBeVisible();
});

test("an award card opens its detail on the awards page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /^Top Project Leader/ }).click();
  await expect(page).toHaveURL(/\/awards#top-project-leader$/);
});
