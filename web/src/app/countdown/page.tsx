import { connection } from "next/server";
import { redirect } from "next/navigation";
import { isPrelaunch } from "@/lib/prelaunch/countdown";
import { getLaunchAt } from "@/lib/prelaunch/launch-time";

export const instant = false;

// Before launch the root layout renders the countdown for every route, this one included.
// Once the gate is open this URL has nothing left to show, so it sends users home.
export default async function CountdownPage() {
  await connection();
  if (isPrelaunch(new Date(), getLaunchAt())) return null;
  redirect("/");
}
