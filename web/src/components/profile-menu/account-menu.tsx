import type { Messages } from "@/i18n/messages";
import { getIsAdmin } from "@/lib/auth/get-is-admin";
import { ProfileMenu } from "./profile-menu";
import { getProfileMenuItems } from "./profile-menu-items";

type AccountMenuProps = { label: string; messages: Messages["profileMenu"] };

/** Streams the account menu once the user's role is known (request time). */
export async function AccountMenu({ label, messages }: AccountMenuProps) {
  const items = getProfileMenuItems(messages, await getIsAdmin());
  return <ProfileMenu label={label} items={items} />;
}
