import { COLLECTABLE_ICONS } from "./rules-badge-names";

type CollectableIconGridProps = { label: string };

// "Danh sách huy hiệu": 24px + 24px side padding, rows of three spread apart, 16px row gap.
// Each icon is a 64px circle with a 2px white border and an 80px-wide 11–12px label.
// Slot: MoMorph has no image files, so the circles use a CSS fallback until the art is exported.
export function CollectableIconGrid({ label }: CollectableIconGridProps) {
  return (
    <ul aria-label={label} className="grid grid-cols-3 justify-between gap-4 px-6 sm:px-12">
      {COLLECTABLE_ICONS.map((name) => (
        <li key={name} className="flex flex-col items-center gap-2 justify-self-center">
          <span
            aria-hidden="true"
            className="size-16 rounded-full border-2 border-white bg-[radial-gradient(circle_at_35%_30%,#fff3c6,#998c5f_55%,#00101a)]"
          />
          <span className="w-20 text-center text-[11px] leading-4 font-bold tracking-[0.5px] text-white">
            {name}
          </span>
        </li>
      ))}
    </ul>
  );
}
