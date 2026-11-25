import { expect, test } from "@playwright/test";
import { getMessages } from "@/i18n/messages";
import { openPopup } from "./support/ui";

const vi = getMessages("vi");
const en = getMessages("en");

test("VN/EN switch re-renders the page and persists in the NEXT_LOCALE cookie", async ({ page, context }) => {
  await context.clearCookies({ name: "NEXT_LOCALE" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page.getByRole("heading", { level: 2, name: vi.home.awardsTitle })).toBeVisible();

  await openPopup(page.getByRole("button", { name: `${vi.language.label}: VN` }));
  await page.getByRole("option", { name: vi.language.en }).click();
  await expect(page.getByRole("heading", { level: 2, name: en.home.awardsTitle })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  const cookie = (await context.cookies()).find((c) => c.name === "NEXT_LOCALE");
  expect(cookie?.value).toBe("en");

  await page.reload();
  await expect(page.getByRole("heading", { level: 2, name: en.home.awardsTitle })).toBeVisible();
  await page.goto("/kudos");
  await expect(page.getByRole("heading", { level: 1, name: en.kudos.heroTitle })).toBeVisible();

  await openPopup(page.getByRole("button", { name: `${en.language.label}: EN` }));
  await page.getByRole("option", { name: en.language.vi }).click();
  await expect(page.getByRole("heading", { level: 1, name: vi.kudos.heroTitle })).toBeVisible();
  await context.clearCookies({ name: "NEXT_LOCALE" });
});
