import type { HomeMessages } from "@/i18n/home-messages";
import { AWARDS_PATH } from "@/lib/navigation/site-nav";

export type AwardCategory = {
  slug: string;
  title: string;
  descriptionKey: keyof HomeMessages["awards"];
  nameImage: { src: string; width: number; height: number };
};

// Order and names from the MoMorph award list (C2.1–C2.6). Name images are the
// design's title artwork, sized at 1x as in the frame.
export const AWARD_CATEGORIES: AwardCategory[] = [
  {
    slug: "top-talent",
    title: "Top Talent",
    descriptionKey: "topTalent",
    nameImage: { src: "/images/home/name-top-talent.png", width: 221, height: 35 },
  },
  {
    slug: "top-project",
    title: "Top Project",
    descriptionKey: "topProject",
    nameImage: { src: "/images/home/name-top-project.png", width: 232, height: 35 },
  },
  {
    slug: "top-project-leader",
    title: "Top Project Leader",
    descriptionKey: "topProjectLeader",
    nameImage: { src: "/images/home/name-top-project-leader.png", width: 232, height: 64 },
  },
  {
    slug: "best-manager",
    title: "Best Manager",
    descriptionKey: "bestManager",
    nameImage: { src: "/images/home/name-best-manager.png", width: 232, height: 30 },
  },
  {
    slug: "signature-2025-creator",
    title: "Signature 2025 - Creator",
    descriptionKey: "signatureCreator",
    nameImage: { src: "/images/home/name-signature-creator.png", width: 232, height: 54 },
  },
  {
    slug: "mvp",
    title: "MVP (Most Valuable Person)",
    descriptionKey: "mvp",
    nameImage: { src: "/images/home/name-mvp.png", width: 116, height: 52 },
  },
];

/** Awards Information page, scrolled to the category by its hash. */
export function getAwardHref(slug: string): string {
  return `${AWARDS_PATH}#${slug}`;
}
