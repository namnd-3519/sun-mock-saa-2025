export type SectionTop = { id: string; top: number };

/**
 * Scroll spy for the category menu (C): the active award is the last section whose
 * top edge has scrolled above `offset` (px from the viewport top); before the first
 * one is reached, the first award stays active.
 */
export function pickActiveAward(sections: SectionTop[], offset: number): string | undefined {
  let active = sections[0]?.id;
  for (const section of sections) {
    if (section.top <= offset) active = section.id;
  }
  return active;
}

