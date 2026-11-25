"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { KudosMessages } from "@/i18n/kudos-messages";
import type { KudosStats } from "@/lib/kudos/kudos-types";
import { OpenGiftButton } from "./open-gift-button";
import { OpenSecretBoxDialog } from "./open-secret-box-dialog";

type OpenSecretBoxActionProps = { label: string; stats: KudosStats | null; messages: KudosMessages["secretBox"] };

/**
 * "Mở quà" (Live board D.1.8) / "Mở Secret Box" (Profile B.6) and its dialog. After an open the
 * server components refresh, so stats, the badge collection and the gift receivers list update.
 */
export function OpenSecretBoxAction({ label, stats, messages }: OpenSecretBoxActionProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const unopened = stats?.boxesUnopened ?? 0;
  return (
    <>
      <OpenGiftButton label={label} disabled={unopened === 0} onOpen={() => setOpen(true)} />
      {open ? (
        <OpenSecretBoxDialog
          unopened={unopened}
          messages={messages}
          onOpened={() => router.refresh()}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
