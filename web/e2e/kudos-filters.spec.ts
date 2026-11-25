import { expect, test } from "@playwright/test";
import { getMessages } from "@/i18n/messages";
import { RECEIVER_DEPARTMENT } from "./support/e2e-users";
import { hashtagByIndex, runMarker, seedKudos } from "./support/kudos-seed";
import { openPopup } from "./support/ui";

const k = getMessages("vi").kudos;

test("hashtag and department filters narrow the board and can be cleared", async ({ page }) => {
  const [tagA, tagB] = [await hashtagByIndex(0), await hashtagByIndex(1)];
  const toReceiver = runMarker("filter-a");
  const toSignout = runMarker("filter-b");
  // The receiver has a department; the sign-out user has none.
  await seedKudos({ from: "sender", to: "receiver", content: toReceiver, hashtagId: tagA.id });
  await seedKudos({ from: "sender", to: "signout", content: toSignout, hashtagId: tagB.id });

  await page.goto("/kudos");
  const board = page.getByRole("region", { name: k.allTitle });
  const cardA = board.locator("article", { hasText: toReceiver });
  const cardB = board.locator("article", { hasText: toSignout });
  await expect(cardA).toBeVisible();
  await expect(cardB).toBeVisible();

  await openPopup(page.getByRole("button", { name: k.filterHashtag, exact: true }));
  await page.getByRole("listbox", { name: k.filterHashtag }).getByRole("option", { name: tagB.name }).click();
  await expect(page).toHaveURL(new RegExp(`hashtag=${tagB.id}`));
  await expect(cardB).toBeVisible();
  await expect(cardA).toHaveCount(0);

  // Picking the selected hashtag again clears it.
  await openPopup(page.getByRole("button", { name: k.filterHashtag, exact: true }));
  await page.getByRole("listbox", { name: k.filterHashtag }).getByRole("option", { name: tagB.name }).click();
  await expect(page).not.toHaveURL(/hashtag=/);
  await expect(cardA).toBeVisible();

  await openPopup(page.getByRole("button", { name: k.filterDepartment, exact: true }));
  await page
    .getByRole("listbox", { name: k.filterDepartment })
    .getByRole("option", { name: RECEIVER_DEPARTMENT, exact: true })
    .click();
  await expect(page).toHaveURL(/department=/);
  await expect(cardA).toBeVisible();
  await expect(cardB).toHaveCount(0);
});
