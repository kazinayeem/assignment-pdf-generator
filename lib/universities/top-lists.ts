import { getQsDisplayRank, getTuitionSortValue, isQsRanked } from "./format";
import { UNIVERSITIES } from "./index";
import type { TopListKey, University } from "./types";

function avgRating(u: University): number | null {
  if (u.reviews.length === 0) return null;
  return u.reviews.reduce((a, r) => a + r.rating, 0) / u.reviews.length;
}

const POPULAR_SLUGS = [
  "buet", "university-of-dhaka", "brac-university", "nsu", "diu",
  "uiu", "sust", "ruet", "kuet", "aiub",
];

export const TOP_LIST_KEYS: TopListKey[] = [
  "public", "private", "engineering", "business", "medical",
  "research", "qs-ranked", "affordable", "popular", "recent",
];

function byWebometrics(a: University, b: University): number {
  const aw = a.rankings.webometrics ?? Number.MAX_SAFE_INTEGER;
  const bw = b.rankings.webometrics ?? Number.MAX_SAFE_INTEGER;
  if (aw !== bw) return aw - bw;
  return a.name.localeCompare(b.name);
}

function byQs(a: University, b: University): number {
  const ar = getQsDisplayRank(a.rankings) ?? Number.MAX_SAFE_INTEGER;
  const br = getQsDisplayRank(b.rankings) ?? Number.MAX_SAFE_INTEGER;
  return ar - br;
}

export function getTopUniversities(key: TopListKey, limit = 10): University[] {
  let list: University[];

  switch (key) {
    case "public":
      list = UNIVERSITIES.filter((u) => u.type === "public").sort(byWebometrics);
      break;
    case "private":
      list = UNIVERSITIES.filter((u) => u.type === "private").sort(byQs);
      break;
    case "engineering":
      list = UNIVERSITIES.filter((u) => u.category === "engineering").sort(byWebometrics);
      break;
    case "business":
      list = UNIVERSITIES.filter((u) => u.category === "business" || u.programs.some((p) => p.department === "BBA")).sort(byQs);
      break;
    case "medical":
      list = UNIVERSITIES.filter((u) => u.category === "medical" || u.specialization.toLowerCase().includes("medical")).sort(byWebometrics);
      break;
    case "research":
      list = [...UNIVERSITIES]
        .filter((u) => u.rankings.verified && (u.rankings.webometrics != null || u.facilities.researchCenters != null))
        .sort((a, b) => (b.facilities.researchCenters ?? 0) - (a.facilities.researchCenters ?? 0) || byWebometrics(a, b));
      break;
    case "qs-ranked":
      list = UNIVERSITIES.filter((u) => isQsRanked(u.rankings)).sort(byQs);
      break;
    case "affordable":
      list = [...UNIVERSITIES]
        .filter((u) => {
          const cost = u.tuition.graduationCostMin ?? u.tuition.estimatedGraduationCost;
          return cost != null && cost <= 500000;
        })
        .sort((a, b) => getTuitionSortValue(a) - getTuitionSortValue(b));
      break;
    case "popular":
      list = POPULAR_SLUGS
        .map((s) => UNIVERSITIES.find((u) => u.slug === s))
        .filter(Boolean) as University[];
      break;
    case "recent":
      list = [...UNIVERSITIES].sort((a, b) => b.established - a.established);
      break;
    default:
      list = UNIVERSITIES;
  }

  if (key === "popular") return list.slice(0, limit);

  const rated = list.sort((a, b) => (avgRating(b) ?? 0) - (avgRating(a) ?? 0));
  return rated.slice(0, limit);
}
