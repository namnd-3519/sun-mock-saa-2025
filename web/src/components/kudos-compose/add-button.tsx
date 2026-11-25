import { PlusIcon } from "./compose-icons";

type AddButtonProps = { label: string; note: string; onClick: () => void; expanded?: boolean; describedBy?: string };

/** E.2 "+ Hashtag" / F.5 "+ Image": 48px outlined button with a "Tối đa 5" note. */
export function AddButton({ label, note, onClick, expanded, describedBy }: AddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      aria-describedby={describedBy}
      className="flex h-12 shrink-0 items-center gap-1 rounded-lg border border-brand-border bg-white px-2 py-1 text-left hover:bg-brand-accent/30"
    >
      <PlusIcon className="size-6 text-brand-border" />
      <span className="flex flex-col">
        <span className="text-base leading-5 font-bold text-brand-bg">{label}</span>
        <span className="text-[11px] leading-4 font-bold tracking-[0.5px] text-[#999]">{note}</span>
      </span>
    </button>
  );
}
