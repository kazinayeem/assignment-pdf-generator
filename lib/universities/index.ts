import { buildUniversity } from "./builder";
import { UNIVERSITY_ENRICHMENTS } from "./enrichments";
import { getTuitionSortValue, isQsRanked } from "./format";
import { searchUniversities } from "./search";
import { UNIVERSITY_SEEDS } from "./seeds";
import type {
  RecommendationInput,
  University,
  UniversityFilters,
  UniversityType,
} from "./types";

export const UNIVERSITIES: University[] = UNIVERSITY_SEEDS.map((seed) =>
  buildUniversity(seed, UNIVERSITY_ENRICHMENTS[seed.slug])
);

export const PAGE_SIZE = 24;

export function getUniversity(slug: string): University | undefined {
  return UNIVERSITIES.find((u) => u.slug === slug);
}

export function getUniversitySlugs(): string[] {
  return UNIVERSITIES.map((u) => u.slug);
}

export function getUniversitiesByType(type: UniversityType): University[] {
  return UNIVERSITIES.filter((u) => u.type === type);
}

export function getDivisions(): string[] {
  return [...new Set(UNIVERSITIES.map((u) => u.division))].sort();
}

export function getDistricts(division?: string): string[] {
  const list = division && division !== "all"
    ? UNIVERSITIES.filter((u) => u.division === division)
    : UNIVERSITIES;
  return [...new Set(list.map((u) => u.district))].sort();
}

export function getDepartments(): string[] {
  const depts = new Set<string>();
  UNIVERSITIES.forEach((u) => u.programs.forEach((p) => depts.add(p.department)));
  return [...depts].sort();
}

export function getAverageRating(university: University): number | null {
  if (university.reviews.length === 0) return null;
  return university.reviews.reduce((a, r) => a + r.rating, 0) / university.reviews.length;
}

function matchesCategory(u: University, category: UniversityFilters["category"]): boolean {
  if (!category || category === "all") return true;
  return u.category === category;
}

function sortUniversities(list: University[], sort?: UniversityFilters["sort"]): University[] {
  const sorted = [...list];
  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => b.established - a.established);
    case "oldest":
      return sorted.sort((a, b) => a.established - b.established);
    case "tuition-asc":
      return sorted.sort((a, b) => getTuitionSortValue(a) - getTuitionSortValue(b));
    case "tuition-desc":
      return sorted.sort((a, b) => getTuitionSortValue(b) - getTuitionSortValue(a));
    case "rating":
      return sorted.sort((a, b) => (getAverageRating(b) ?? 0) - (getAverageRating(a) ?? 0));
    case "qs-rank": {
      return sorted.sort((a, b) => {
        const aRank = a.rankings.qsWorld ?? a.rankings.qsAsia ?? Number.MAX_SAFE_INTEGER;
        const bRank = b.rankings.qsWorld ?? b.rankings.qsAsia ?? Number.MAX_SAFE_INTEGER;
        return aRank - bRank;
      });
    }
    case "name":
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
}

export function filterUniversities(filters: UniversityFilters): University[] {
  let list = UNIVERSITIES;

  if (filters.query) {
    list = searchUniversities(list, filters.query).map((m) => m.university);
  }

  list = list.filter((u) => {
    if (filters.type && filters.type !== "all" && u.type !== filters.type) return false;
    if (filters.division && filters.division !== "all" && u.division !== filters.division) return false;
    if (filters.district && u.district !== filters.district) return false;
    if (filters.department && !u.programs.some((p) => p.department === filters.department)) return false;
    if (filters.program && !u.programs.some((p) => p.name.toLowerCase().includes(filters.program!.toLowerCase()))) return false;
    if (filters.subject && !u.programs.some((p) =>
      p.faculty.toLowerCase().includes(filters.subject!.toLowerCase()) ||
      p.department.toLowerCase().includes(filters.subject!.toLowerCase())
    )) return false;
    if (!matchesCategory(u, filters.category)) return false;

    if (filters.maxBudget) {
      const cost = u.tuition.graduationCostMin ?? u.tuition.estimatedGraduationCost;
      if (cost != null && cost > filters.maxBudget) return false;
      if (cost == null && !u.tuition.verified) return false;
    }

    if (filters.scholarship && u.scholarships.length === 0 && !u.tuition.waiverPolicy) return false;
    if (filters.hostel && !u.facilities.hostel) return false;
    if (filters.evening && !u.tags.includes("evening") && !u.programs.some((p) => p.shifts.includes("evening"))) return false;
    if (filters.online && !u.tags.includes("online") && !u.programs.some((p) => p.shifts.includes("online"))) return false;
    if (filters.admissionOpen && u.admission.isOpen !== true) return false;
    if (filters.qsRanked && !isQsRanked(u.rankings)) return false;
    if (filters.top10 && (!u.rankings.webometrics || u.rankings.webometrics > 10)) return false;
    if (filters.budgetFriendly) {
      const cost = u.tuition.graduationCostMin ?? u.tuition.estimatedGraduationCost;
      if (cost == null || cost > 500000) return false;
    }
    if (filters.highestRated) {
      const rating = getAverageRating(u);
      if (rating == null || rating < 4) return false;
    }

    return true;
  });

  return sortUniversities(list, filters.sort);
}

export function paginateUniversities(universities: University[], page: number, pageSize = PAGE_SIZE) {
  const total = universities.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: universities.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    total,
    totalPages,
  };
}

export function getUniversityStats() {
  return {
    total: UNIVERSITIES.length,
    public: UNIVERSITIES.filter((u) => u.type === "public").length,
    private: UNIVERSITIES.filter((u) => u.type === "private").length,
    international: UNIVERSITIES.filter((u) => u.type === "international").length,
    withHostel: UNIVERSITIES.filter((u) => u.facilities.hostel).length,
    qsRanked: UNIVERSITIES.filter((u) => isQsRanked(u.rankings)).length,
    divisions: getDivisions().length,
  };
}

export function recommendUniversities(input: RecommendationInput, limit = 8): University[] {
  const scored = UNIVERSITIES.map((u) => {
    let score = 0;

    if (u.admission.sscGpaMin != null && input.sscGpa >= u.admission.sscGpaMin) score += 15;
    if (u.admission.hscGpaMin != null && input.hscGpa >= u.admission.hscGpaMin) score += 15;

    const cost = u.tuition.graduationCostMin ?? u.tuition.estimatedGraduationCost;
    if (cost != null) {
      if (input.budget >= cost) score += 20;
      else if (input.budget >= cost * 0.7) score += 10;
    } else if (u.type === "public") score += 10;

    if (input.division === "any" || u.division === input.division) score += 10;

    const subject = input.preferredSubject.toLowerCase();
    if (u.programs.some((p) => p.department.toLowerCase().includes(subject) || p.name.toLowerCase().includes(subject))) {
      score += 20;
    }

    const goal = input.careerGoal.toLowerCase();
    if (goal.includes("engineer") && u.category === "engineering") score += 10;
    if (goal.includes("business") && u.category === "business") score += 10;
    if (goal.includes("research") && u.rankings.verified) score += 5;

    if (input.preferredCampus === "urban" && ["Dhaka", "Chattogram"].includes(u.division)) score += 5;
    if (input.preferredCampus === "suburban" && u.city !== "Dhaka") score += 5;

    if (isQsRanked(u.rankings)) score += 10;
    if (u.tuition.verified) score += 5;

    return { university: u, score };
  });

  return scored
    .filter((s) => s.score > 15)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.university);
}

export { UNIVERSITY_SEEDS };
