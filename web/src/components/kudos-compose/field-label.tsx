type FieldLabelProps = { htmlFor?: string; id?: string; text: string; required?: boolean; className?: string };

/** B.1 / E.1 / F.1 title: 22px bold label with the red required asterisk. */
export function FieldLabel({ htmlFor, id, text, required, className = "" }: FieldLabelProps) {
  return (
    <label htmlFor={htmlFor} id={id} className={`flex shrink-0 items-start gap-0.5 text-[22px] leading-7 font-bold text-brand-bg ${className}`}>
      {text}
      {required && (
        <span aria-hidden="true" className="text-base leading-5 text-[#cf1322]">
          *
        </span>
      )}
    </label>
  );
}

/** Red inline message under a field; ids feed aria-describedby. */
export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-sm font-bold text-[#cf1322]">
      {message}
    </p>
  );
}

export const INPUT_CLASS =
  "h-14 w-full rounded-lg border bg-white px-6 text-base leading-6 font-bold tracking-[0.15px] text-brand-bg placeholder:text-[#999] focus:outline-2 focus:outline-brand-border";

export function borderFor(invalid: boolean): string {
  return invalid ? "border-[#cf1322]" : "border-brand-border";
}
