// Highlight Kudos carousel (MoMorph B.2/B.5): arrows disabled at both ends, pager "n/total".

export function clampSlide(index: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(Math.max(index, 0), total - 1);
}

export function canGoPrev(index: number): boolean {
  return index > 0;
}

export function canGoNext(index: number, total: number): boolean {
  return index < total - 1;
}

export function slideLabel(index: number, total: number): string {
  return total === 0 ? "0/0" : `${index + 1}/${total}`;
}
