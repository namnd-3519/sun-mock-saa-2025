// Stars (hoa thị) shown next to a Sunner, derived from received kudos (Live board B.3.2):
// 1 star at 10 kudos, 2 at 20, 3 at 50.
const STAR_THRESHOLDS = [50, 20, 10] as const;

export function starsForReceivedCount(received: number): 0 | 1 | 2 | 3 {
  if (received >= STAR_THRESHOLDS[0]) return 3;
  if (received >= STAR_THRESHOLDS[1]) return 2;
  if (received >= STAR_THRESHOLDS[2]) return 1;
  return 0;
}
