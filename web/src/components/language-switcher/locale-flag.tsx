import type { ComponentType, SVGProps } from "react";
import type { Locale } from "@/i18n/config";
import { IconFlagGb } from "@/components/icons/icon-flag-gb";
import { IconFlagVn } from "@/components/icons/icon-flag-vn";

const FLAGS: Record<Locale, ComponentType<SVGProps<SVGSVGElement>>> = {
  vi: IconFlagVn,
  en: IconFlagGb,
};

export function LocaleFlag({ locale }: { locale: Locale }) {
  const Icon = FLAGS[locale];
  return (
    <span className="flex size-6 items-center justify-center">
      <Icon />
    </span>
  );
}
