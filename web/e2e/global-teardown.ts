import { cleanupE2EData } from "./support/admin";

// Leaves the shared local database as the suite found it (users stay for reuse).
export default async function globalTeardown(): Promise<void> {
  await cleanupE2EData();
}
