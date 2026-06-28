import { buildUniversity } from "./builder";
import { UNIVERSITY_ENRICHMENTS } from "./enrichments";
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

export function filterUniversities(filters: UniversityFilters): University[] {
  return UNIVERSITIES.filter((u) => {
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const match =
        u.name.toLowerCase().includes(q) ||
        u.shortName.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q) ||
        u.district.toLowerCase().includes(q) ||
        u.specialization.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filters.type && filters.type !== "all" && u.type !== filters.type) return false;
    if (filters.division && filters.division !== "all" && u.division !== filters.division) return false;
    if (filters.district && u.district !== filters.district) return false;
    if (filters.department && !u.programs.some((p) => p.department === filters.department)) return false;
    if (filters.maxBudget && u.tuition.estimatedGraduationCost > filters.maxBudget) return false;
    if (filters.scholarship && u.scholarships.length === 0) return false;
    if (filters.hostel && !u.facilities.hostel) return false;
    if (filters.evening && !u.tags.includes("evening") && !u.programs.some((p) => p.shifts.includes("evening"))) return false;
    if (filters.online && !u.tags.includes("online") && !u.programs.some((p) => p.shifts.includes("online"))) return false;
    if (filters.minRanking && (!u.rankings.national || u.rankings.national > filters.minRanking)) return false;
    return true;
  });
}

export function getUniversityStats() {
  return {
    total: UNIVERSITIES.length,
    public: UNIVERSITIES.filter((u) => u.type === "public").length,
    private: UNIVERSITIES.filter((u) => u.type === "private").length,
    international: UNIVERSITIES.filter((u) => u.type === "international").length,
    withHostel: UNIVERSITIES.filter((u) => u.facilities.hostel).length,
    divisions: getDivisions().length,
  };
}

export function recommendUniversities(input: RecommendationInput, limit = 8): University[] {
  const scored = UNIVERSITIES.map((u) => {
    let score = 0;

    // GPA eligibility
    if (input.sscGpa >= u.admission.sscGpaMin) score += 15;
    if (input.hscGpa >= u.admission.hscGpaMin) score += 15;

    // Budget fit
    if (input.budget >= u.tuition.estimatedGraduationCost) score += 20;
    else if (input.budget >= u.tuition.estimatedGraduationCost * 0.7) score += 10;

    // Division preference
    if (input.division === "any" || u.division === input.division) score += 10;

    // Subject / program match
    const subject = input.preferredSubject.toLowerCase();
    if (u.programs.some((p) => p.department.toLowerCase().includes(subject) || p.name.toLowerCase().includes(subject))) {
      score += 20;
    }

    // Career goal
    const goal = input.careerGoal.toLowerCase();
    if (goal.includes("engineer") && (u.specialization.includes("Engineering") || u.specialization.includes("STEM"))) score += 10;
    if (goal.includes("business") && u.programs.some((p) => p.department === "BBA")) score += 10;
    if (goal.includes("research") && (u.rankings.research ?? 0) >= 70) score += 10;

    // Campus preference
    if (input.preferredCampus === "urban" && ["Dhaka", "Chattogram"].includes(u.division)) score += 5;
    if (input.preferredCampus === "suburban" && !["Dhaka"].includes(u.city)) score += 5;

    // Ranking boost
    if (u.rankings.national && u.rankings.national <= 20) score += 10;

    // Employability
    score += (u.career.employmentRate ?? 70) / 20;

    return { university: u, score };
  });

  return scored
    .filter((s) => s.score > 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.university);
}

export function getAverageRating(university: University): number {
  if (university.reviews.length === 0) return 4.0;
  return university.reviews.reduce((a, r) => a + r.rating, 0) / university.reviews.length;
}

export { UNIVERSITY_SEEDS };
