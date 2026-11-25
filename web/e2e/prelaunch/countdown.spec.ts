import { expect, test } from "@playwright/test";
import { getMessages } from "@/i18n/messages";
import { PRELAUNCH_AT } from "../support/launch-times";

const m = getMessages("vi").countdown;
const launchMs = new Date(PRELAUNCH_AT).getTime();
const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

// This project's server has SAA_LAUNCH_AT in the future; the browser clock is fixed.
test("before launch every route shows the countdown, ticking with the clock", async ({ page }) => {
  // 2 days, 3 hours, 4 minutes and 30 seconds before launch.
  await page.clock.install({ time: launchMs - (2 * DAY + 3 * 60 * MINUTE + 4.5 * MINUTE) });
  await page.goto("/login");
  await expect(page.getByText(m.title)).toBeVisible();
  const timer = page.getByRole("timer");
  await expect(timer).toContainText(`02 ${m.days}`);
  await expect(timer).toContainText(`03 ${m.hours}`);
  await expect(timer).toContainText(`04 ${m.minutes}`);
  await expect(page.getByRole("button", { name: getMessages("vi").login.button })).toHaveCount(0);

  await page.clock.runFor(MINUTE);
  await expect(timer).toContainText(`03 ${m.minutes}`);
});

test("before launch /countdown renders the countdown instead of redirecting", async ({ page }) => {
  await page.goto("/countdown");
  await expect(page).toHaveURL(/\/countdown$/);
  await expect(page.getByRole("timer")).toBeVisible();
});
