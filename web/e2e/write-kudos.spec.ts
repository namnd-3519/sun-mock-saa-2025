import { expect, test } from "@playwright/test";
import { getMessages } from "@/i18n/messages";
import { E2E_USERS } from "./support/e2e-users";
import { runMarker } from "./support/kudos-seed";

const vi = getMessages("vi");
const w = vi.writeKudos;

test("compose form shows required-field errors and keeps Gửi disabled", async ({ page }) => {
  await page.goto("/kudos/new");
  const form = page.getByRole("form", { name: w.heading });
  // Touch (focus then leave) recipient, title and message without filling them.
  await form.getByRole("combobox", { name: w.recipient }).focus();
  await form.getByRole("textbox", { name: w.title }).focus();
  await form.getByRole("textbox", { name: w.messageLabel }).focus();
  await form.getByRole("textbox", { name: w.title }).focus();
  await expect(form.getByText(w.fieldErrors.required)).toHaveCount(3);
  await expect(form.getByRole("button", { name: w.submit, exact: true })).toBeDisabled();
});

test("a valid kudos is sent and appears on the board", async ({ page }) => {
  const marker = runMarker("write");
  await page.goto("/kudos/new");
  const form = page.getByRole("form", { name: w.heading });

  await form.getByRole("combobox", { name: w.recipient }).fill(E2E_USERS.receiver.fullName);
  await page.getByRole("option", { name: new RegExp(E2E_USERS.receiver.fullName) }).click();
  await form.getByRole("textbox", { name: w.title }).fill("E2E title");
  await form.getByRole("textbox", { name: w.messageLabel }).fill(marker);
  await form.getByRole("button", { name: /^Hashtag/ }).click();
  await page.getByRole("listbox").getByRole("option").first().click();
  await page.keyboard.press("Escape");

  const submit = form.getByRole("button", { name: w.submit, exact: true });
  await expect(submit).toBeEnabled();
  await submit.click();

  await expect(page).toHaveURL(/\/kudos$/);
  const board = page.getByRole("region", { name: vi.kudos.allTitle });
  await expect(board.locator("article", { hasText: marker })).toBeVisible();
});
