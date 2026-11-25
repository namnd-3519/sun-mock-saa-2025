import { expect, test, type Page } from "@playwright/test";
import { getMessages } from "@/i18n/messages";
import { storageStatePath } from "./support/e2e-users";
import { hashtagByIndex, runMarker, seedKudos } from "./support/kudos-seed";

const k = getMessages("vi").kudos;

function heartOf(page: Page, marker: string) {
  const card = page.getByRole("region", { name: k.allTitle }).locator("article", { hasText: marker });
  return card.getByRole("button", { name: new RegExp(`${k.hearts}$`) });
}

test("receiver likes and unlikes; the sender sees the count live", async ({ browser }) => {
  const marker = runMarker("like");
  await seedKudos({ from: "sender", to: "receiver", content: marker, hashtagId: (await hashtagByIndex(0)).id });

  const receiver = await browser.newContext({ storageState: storageStatePath("receiver") });
  const sender = await browser.newContext({ storageState: storageStatePath("sender") });
  const receiverPage = await receiver.newPage();
  const senderPage = await sender.newPage();
  await receiverPage.goto("/kudos");
  await senderPage.goto("/kudos");

  const heart = heartOf(receiverPage, marker);
  const senderHeart = heartOf(senderPage, marker);
  await expect(heart).toHaveAccessibleName(`0 ${k.hearts}`);
  // The sender cannot like their own kudos.
  await expect(senderHeart).toBeDisabled();

  await heart.click();
  await expect(heart).toHaveAttribute("aria-pressed", "true");
  await expect(heart).toHaveAccessibleName(`1 ${k.hearts}`);
  await expect(senderHeart).toHaveAccessibleName(`1 ${k.hearts}`);

  await receiverPage.reload();
  await expect(heart).toHaveAccessibleName(`1 ${k.hearts}`);

  await heart.click();
  await expect(heart).toHaveAttribute("aria-pressed", "false");
  await expect(heart).toHaveAccessibleName(`0 ${k.hearts}`);
  await expect(senderHeart).toHaveAccessibleName(`0 ${k.hearts}`);

  await receiver.close();
  await sender.close();
});
