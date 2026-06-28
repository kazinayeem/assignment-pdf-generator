import type { UniversityRanking } from "./types";

/** Times Higher Education World University Rankings — Bangladesh 801–1000 band */
export const THE_RANKINGS_SOURCE =
  "Times Higher Education World University Rankings";

const THE_801_1000: Partial<UniversityRanking> = {
  verified: true,
  theSource: THE_RANKINGS_SOURCE,
  theWorld: 801,
  theWorldDisplay: "801-1000",
};

/** Five Bangladeshi institutions in THE World 801–1000 tier (top national bracket). */
export const THE_WORLD_RANKINGS: Record<string, Partial<UniversityRanking>> = {
  "university-of-dhaka": THE_801_1000,
  diu: THE_801_1000,
  nsu: THE_801_1000,
  "jahangirnagar-university": THE_801_1000,
  gau: THE_801_1000,
};

export function getTheRankedBangladesh(): { slug: string; rankings: Partial<UniversityRanking> }[] {
  return Object.entries(THE_WORLD_RANKINGS).map(([slug, rankings]) => ({ slug, rankings }));
}
