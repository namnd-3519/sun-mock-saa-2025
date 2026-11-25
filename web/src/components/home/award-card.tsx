import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRight } from "@/components/icons/icon-arrow-up-right";
import { getAwardHref, type AwardCategory } from "@/lib/home/award-categories";

type AwardCardProps = { award: AwardCategory; description: string; detailsLabel: string };

const FRAME_SIZE = 336;

/** C2.x card: picture, title, 2-line description and "Chi tiết", all linking to the category. */
export function AwardCard({ award, description, detailsLabel }: AwardCardProps) {
  const { nameImage } = award;
  return (
    <Link
      href={getAwardHref(award.slug)}
      className="group flex flex-col gap-6 rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-brand-accent shadow-[var(--shadow-nav-glow)] transition-[translate,box-shadow] duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_8px_16px_rgb(0_0_0/0.35),0_0_16px_#fae287]">
        <Image
          src="/images/home/award-frame.jpg"
          alt=""
          fill
          sizes="(min-width: 1024px) 336px, 50vw"
          className="object-cover"
        />
        <Image
          src={nameImage.src}
          alt=""
          width={nameImage.width}
          height={nameImage.height}
          className="absolute top-1/2 left-1/2 -translate-1/2"
          style={{ width: `${(nameImage.width / FRAME_SIZE) * 100}%`, height: "auto" }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg leading-7 text-brand-accent md:text-2xl md:leading-8">{award.title}</h3>
        <p className="line-clamp-2 text-sm leading-5 tracking-[0.5px] text-white md:text-base md:leading-6">
          {description}
        </p>
        <span className="flex items-center gap-1 py-4 text-base leading-6 font-medium tracking-[0.15px] text-white group-hover:text-brand-accent">
          {detailsLabel}
          <IconArrowUpRight />
        </span>
      </div>
    </Link>
  );
}
