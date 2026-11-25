"use client";

import { useRef } from "react";
import type { WriteKudosMessages } from "@/i18n/write-kudos-messages";
import { KUDOS_LIMITS } from "@/lib/kudos/kudos-limits";
import { KUDOS_IMAGE_TYPES } from "@/lib/kudos-compose/kudos-image-files";
import { AddButton } from "./add-button";
import { CloseIcon } from "./compose-icons";

export type DraftImage = { id: string; file: File; previewUrl: string };

type ImagePickerProps = {
  images: DraftImage[];
  messages: WriteKudosMessages;
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
};

/** F: 80px thumbnails with a red "x" (F.2–F.4) and "+ Image" (F.5), hidden at 5 images. */
export function ImagePicker({ images, messages, onAdd, onRemove }: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-4">
      {images.map((image) => (
        <div key={image.id} className="relative size-20 shrink-0 border border-brand-border bg-white">
          {/* Local blob preview: next/image cannot optimise object URLs. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.previewUrl} alt={image.file.name} className="size-full border border-brand-accent object-cover" />
          <button
            type="button"
            aria-label={`${messages.removeImage} ${image.file.name}`}
            onClick={() => onRemove(image.id)}
            className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-[#d4271d] text-white"
          >
            <CloseIcon className="size-[14px]" />
          </button>
        </div>
      ))}
      {images.length < KUDOS_LIMITS.imagesMax && (
        <AddButton label={messages.addImage} note={messages.maxFive} onClick={() => inputRef.current?.click()} />
      )}
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        accept={KUDOS_IMAGE_TYPES.join(",")}
        onChange={(event) => {
          onAdd(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />
    </div>
  );
}
