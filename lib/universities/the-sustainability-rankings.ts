import type { TheSustainabilityRanking } from "./types";

export const THE_SUSTAINABILITY_2026_SOURCE =
  "Times Higher Education Impact Rankings 2026";

/** THE Sustainability Impact Ratings 2026 — Bangladesh performers */
export const THE_SUSTAINABILITY_2026: Record<string, TheSustainabilityRanking> = {
  diu: {
    year: 2026,
    source: THE_SUSTAINABILITY_2026_SOURCE,
    globalRank: 87,
    globalDisplay: "87",
    nationalRank: 1,
    sdgHighlights: [
      { goal: 17, name: "Partnerships for the Goals", globalRank: 4 },
      { goal: 4, name: "Quality Education", globalRank: 12 },
    ],
  },
  gau: {
    year: 2026,
    source: THE_SUSTAINABILITY_2026_SOURCE,
    nationalLabel: "Public University Leader",
  },
  "green-university": {
    year: 2026,
    source: THE_SUSTAINABILITY_2026_SOURCE,
    globalRank: 401,
    globalDisplay: "401-600",
    nationalRank: 3,
  },
  iubat: {
    year: 2026,
    source: THE_SUSTAINABILITY_2026_SOURCE,
    nationalRank: 9,
  },
  ulab: {
    year: 2026,
    source: THE_SUSTAINABILITY_2026_SOURCE,
    globalRank: 801,
    globalDisplay: "801-1000",
    nationalRank: 12,
    privateRank: 8,
  },
  "state-university": {
    year: 2026,
    source: THE_SUSTAINABILITY_2026_SOURCE,
    nationalRank: 13,
    privateRank: 9,
  },
};

export function getTheSustainabilityRanked2026(): { slug: string; ranking: TheSustainabilityRanking }[] {
  return Object.entries(THE_SUSTAINABILITY_2026)
    .map(([slug, ranking]) => ({ slug, ranking }))
    .sort((a, b) => (a.ranking.nationalRank ?? 999) - (b.ranking.nationalRank ?? 999));
}
