import { expect, type Locator } from "@playwright/test";

/**
 * Opens a popup trigger (aria-expanded). Retries the click because a click that lands
 * before React hydrates the dev-server page is lost.
 */
export async function openPopup(trigger: Locator): Promise<void> {
  await expect(async () => {
    if ((await trigger.getAttribute("aria-expanded")) !== "true") await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true", { timeout: 1_000 });
  }).toPass({ timeout: 15_000 });
}
