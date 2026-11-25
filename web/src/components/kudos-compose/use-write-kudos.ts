"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { WriteKudosMessages } from "@/i18n/write-kudos-messages";
import { KudosDataError } from "@/lib/kudos/kudos-error";
import { emptyKudosDraft, isDraftComplete, validateKudosDraft, type DraftField, type KudosDraft } from "@/lib/kudos-compose/kudos-draft";
import { pickImageFiles } from "@/lib/kudos-compose/kudos-image-files";
import { submitKudosDraft } from "@/lib/kudos-compose/submit-kudos-draft";
import { KUDOS_PATH } from "@/lib/navigation/site-nav";
import { createSupabaseBrowserClient } from "@/lib/supabase/create-supabase-browser-client";
import type { DraftImage } from "./image-picker";

/** State and submit flow of the Write Kudo form. */
export function useWriteKudos(senderId: string, messages: WriteKudosMessages) {
  const router = useRouter();
  const client = useMemo(() => createSupabaseBrowserClient(), []);
  const [draft, setDraft] = useState<KudosDraft>(emptyKudosDraft);
  const [images, setImages] = useState<DraftImage[]>([]);
  const [touched, setTouched] = useState<Partial<Record<DraftField, boolean>>>({});
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // Object URLs of the previews are released when the form goes away.
  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);
  useEffect(() => () => imagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl)), []);

  const errors = validateKudosDraft(draft, senderId);
  const errorFor = (field: DraftField) => {
    const code = showAllErrors || touched[field] ? errors[field] : undefined;
    return code ? messages.fieldErrors[code] : undefined;
  };

  const update = (patch: Partial<KudosDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setSubmitError(null);
  };

  const touch = (field: DraftField) => setTouched((current) => ({ ...current, [field]: true }));

  const addImages = (files: File[]) => {
    const { accepted, rejected } = pickImageFiles(images.length, files);
    setImageError(rejected ? messages.imageErrors[rejected] : null);
    const added = accepted.map((file) => ({ id: crypto.randomUUID(), file, previewUrl: URL.createObjectURL(file) }));
    setImages((current) => [...current, ...added]);
  };

  const removeImage = (id: string) => {
    const removed = images.find((image) => image.id === id);
    if (removed) URL.revokeObjectURL(removed.previewUrl);
    setImages((current) => current.filter((image) => image.id !== id));
    setImageError(null);
  };

  const submit = async () => {
    setShowAllErrors(true);
    if (Object.keys(errors).length > 0 || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitKudosDraft(client, senderId, draft, images.map((image) => image.file));
      router.push(KUDOS_PATH);
    } catch (error) {
      const code = error instanceof KudosDataError ? error.code : "unknown";
      const text = (messages.submitErrors as Record<string, string>)[code] ?? messages.submitErrors.unknown;
      setSubmitError(text);
      setSubmitting(false);
    }
  };

  return {
    client,
    draft,
    images,
    update,
    touch,
    errorFor,
    addImages,
    removeImage,
    imageError,
    submit,
    submitting,
    submitError,
    canSubmit: isDraftComplete(draft) && !submitting,
  };
}
