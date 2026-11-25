import { expect, test as setup } from "@playwright/test";
import { assertEmailProviderEnabled, cleanupE2EData, upsertUser } from "./support/admin";
import { E2E_USERS, storageStatePath, type E2EUserKey } from "./support/e2e-users";
import { signInCookies } from "./support/session-cookies";

// Seeds the test users and stores a signed-in browser state per user.
// The sign-out user is signed in by its own spec (sign-out revokes all its sessions).
const SHARED_USERS: E2EUserKey[] = ["sender", "receiver"];

setup("seed e2e users and store signed-in state", async ({ browser, baseURL }) => {
  await assertEmailProviderEnabled();
  await cleanupE2EData();
  // The sign-out user only needs to exist here (other specs send kudos to it).
  await upsertUser("signout");
  for (const key of SHARED_USERS) {
    const { password } = await upsertUser(key);
    const context = await browser.newContext();
    await context.addCookies(await signInCookies(E2E_USERS[key].email, password, baseURL!));
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).not.toHaveURL(/\/login/);
    await context.storageState({ path: storageStatePath(key) });
    await context.close();
  }
});
