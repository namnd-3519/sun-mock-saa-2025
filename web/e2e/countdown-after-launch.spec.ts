import { expect, test } from "@playwright/test";
import { getMessages } from "@/i18n/messages";

const m = getMessages("vi").countdown;

// The main server's SAA_LAUNCH_AT is in the past: the gate is open.
test("after launch /countdown sends users home and pages render normally", async ({ page }) => {
  await page.goto("/countdown");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText(m.title)).toHaveCount(0);
  await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toBeVisible();
});
