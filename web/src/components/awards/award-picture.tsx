import Image from "next/image";
import type { AwardCategory } from "@/lib/home/award-categories";

const FRAME_SIZE = 336;

/** D.x.1: 336×336 award frame with the category's name artwork centered on it. */
export function AwardPicture({ award }: { award: AwardCategory }) {
  const { nameImage } = award;
  return (
    <div className="relative aspect-square w-full max-w-[336px] shrink-0 overflow-hidden rounded-3xl border border-brand-accent shadow-[var(--shadow-nav-glow)]">
      <Image
        src="/images/home/award-frame.jpg"
        alt=""
        fill
        sizes="(min-width: 768px) 336px, 100vw"
        className="object-cover"
      />
      <Image
        src={nameImage.src}
        alt={award.title}
        width={nameImage.width}
        height={nameImage.height}
        className="absolute top-1/2 left-1/2 -translate-1/2"
        style={{ width: `${(nameImage.width / FRAME_SIZE) * 100}%`, height: "auto" }}
      />
    </div>
  );
}
