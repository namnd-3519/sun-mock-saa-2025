import type { ReactNode } from "react";
import type { AwardDetail, AwardsMessages } from "@/i18n/awards-messages-vi";
import { IconDiamond } from "@/components/icons/icon-diamond";
import { IconLicense } from "@/components/icons/icon-license";
import { IconTarget } from "@/components/icons/icon-target";
import type { AwardCategory } from "@/lib/home/award-categories";
import { AwardPicture } from "./award-picture";

type AwardDetailSectionProps = {
  award: AwardCategory;
  detail: AwardDetail;
  labels: Pick<AwardsMessages, "quantityLabel" | "valueLabel" | "or">;
  /** Odd cards in the design put the picture on the right. */
  pictureRight: boolean;
  isLast: boolean;
};

const HEADING = "text-xl leading-8 font-bold text-brand-accent md:text-2xl";
const BIG_NUMBER = "text-3xl leading-[44px] font-bold text-white md:text-4xl";
const SMALL = "text-sm leading-5 font-bold tracking-[0.1px] text-white";
const DIVIDER = <div className="h-px bg-brand-divider" />;

function LabelRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="shrink-0 text-white">{icon}</span>
      {children}
    </div>
  );
}

/** D.x: one award with picture (D.x.1) and content (D.x.2): description, quantity, value. */
export function AwardDetailSection({ award, detail, labels, pictureRight, isLast }: AwardDetailSectionProps) {
  return (
    <section
      id={award.slug}
      aria-labelledby={`${award.slug}-title`}
      className="flex scroll-mt-[104px] flex-col gap-20"
    >
      <div className={`flex flex-col gap-10 md:flex-row md:items-start ${pictureRight ? "md:flex-row-reverse" : ""}`}>
        <AwardPicture award={award} />
        <div className="flex min-w-0 flex-1 flex-col gap-8 lg:max-w-[480px]">
          <div className="flex flex-col gap-6">
            <LabelRow icon={<IconTarget />}>
              <h2 id={`${award.slug}-title`} className={HEADING}>
                {award.title}
              </h2>
            </LabelRow>
            <div className="flex flex-col gap-6 text-justify text-base leading-6 font-bold tracking-[0.5px] whitespace-pre-line text-white">
              {detail.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          {DIVIDER}
          <LabelRow icon={<IconDiamond />}>
            <h3 className={HEADING}>{labels.quantityLabel}</h3>
            <p className="flex items-center gap-2">
              <span className={BIG_NUMBER}>{detail.quantity}</span>
              <span className={`${SMALL} max-w-[60px]`}>{detail.unit}</span>
            </p>
          </LabelRow>
          {DIVIDER}
          {detail.prizes.map((prize, index) => (
            <div key={prize.value} className="flex flex-col gap-8">
              {index > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm leading-5 font-bold tracking-[0.1px] text-brand-divider">
                    {labels.or}
                  </span>
                  <div className="h-px flex-1 bg-brand-divider" />
                </div>
              )}
              <div className="flex flex-col gap-4">
                <LabelRow icon={<IconLicense />}>
                  <h3 className={HEADING}>{labels.valueLabel}</h3>
                </LabelRow>
                <p className={BIG_NUMBER}>{prize.value}</p>
                {prize.note && <p className={SMALL}>{prize.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
      {!isLast && <div className="h-px bg-brand-divider" />}
    </section>
  );
}
