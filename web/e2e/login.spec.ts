import { expect, test } from "@playwright/test";
import { getMessages } from "@/i18n/messages";
import { upsertUser } from "./support/admin";
import { E2E_USERS } from "./support/e2e-users";
import { signInCookies } from "./support/session-cookies";
import { openPopup } from "./support/ui";

const vi = getMessages("vi");

test.describe("signed out", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("protected routes redirect to login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login$/);
    await page.goto("/kudos");
    await expect(page).toHaveURL(/\/login\?next=%2Fkudos$/);
    await expect(page.getByRole("button", { name: vi.login.button })).toBeVisible();
  });
});

test("signed-in user is sent from /login to the homepage", async ({ page }) => {
  await page.goto("/login");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("button", { name: vi.nav.account })).toBeVisible();
});

test.describe("sign in and sign out", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("signs in, signs out from the account menu, then is locked out", async ({ page, context, baseURL }) => {
    // Sign-out revokes every session of the user, so it uses its own account.
    const { password } = await upsertUser("signout");
    await context.addCookies(await signInCookies(E2E_USERS.signout.email, password, baseURL!));
    await page.goto("/");
    await expect(page).toHaveURL(/\/$/);

    await openPopup(page.getByRole("button", { name: vi.nav.account }));
    await page.getByRole("menuitem", { name: vi.profileMenu.logout }).click();
    await expect(page).toHaveURL(/\/login$/);

    await page.goto("/kudos");
    await expect(page).toHaveURL(/\/login\?next=%2Fkudos$/);
  });
});
