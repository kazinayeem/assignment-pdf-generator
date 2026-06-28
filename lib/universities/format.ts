import type { TuitionInfo, University, UniversityRanking } from "./types";

export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return "—";
  return `৳${amount.toLocaleString("en-BD")}`;
}

export function formatCompactCurrency(amount: number | null | undefined): string {
  if (amount == null) return "—";
  if (amount >= 1_000_000) return `৳${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `৳${(amount / 1_000).toFixed(0)}K`;
  return formatCurrency(amount);
}

export function formatCount(value: number | null | undefined, unavailable = "N/A"): string {
  if (value == null) return unavailable;
  return value.toLocaleString("en-BD");
}

export function formatRanking(
  rank: number | null | undefined,
  notRankedLabel = "Not Ranked"
): string {
  if (rank == null) return notRankedLabel;
  return `#${rank}`;
}

export function getQsDisplayRank(rankings: UniversityRanking): number | null {
  return rankings.qsWorld ?? rankings.qsAsia ?? rankings.qs ?? null;
}

export function isQsRanked(rankings: UniversityRanking): boolean {
  return getQsDisplayRank(rankings) != null;
}

export function formatTuitionRange(tuition: TuitionInfo, labels: {
  unavailable: string;
  variesByDepartment: string;
  startingFrom: string;
  estimated: string;
}): string {
  if (!tuition.verified) {
    if (tuition.variesByDepartment) return labels.variesByDepartment;
    return labels.unavailable;
  }

  const min = tuition.graduationCostMin ?? tuition.estimatedGraduationCost;
  const max = tuition.graduationCostMax;

  if (min != null && max != null && max !== min) {
    return `${formatCompactCurrency(min)} – ${formatCompactCurrency(max)}`;
  }
  if (min != null) return `${labels.startingFrom} ${formatCompactCurrency(min)}`;
  if (tuition.totalPerSemester != null) {
    const suffix = tuition.verified ? "" : ` (${labels.estimated})`;
    return `${formatCurrency(tuition.totalPerSemester)}/sem${suffix}`;
  }
  return labels.unavailable;
}

export function formatStartingCost(tuition: TuitionInfo, labels: {
  unavailable: string;
  perCredit: string;
}): string {
  if (tuition.perCreditFee != null) {
    const max = tuition.perCreditFeeMax;
    if (max != null && max !== tuition.perCreditFee) {
      return `${formatCurrency(tuition.perCreditFee)} – ${formatCurrency(max)} ${labels.perCredit}`;
    }
    return `${formatCurrency(tuition.perCreditFee)} ${labels.perCredit}`;
  }
  if (tuition.totalPerSemester != null) return formatCurrency(tuition.totalPerSemester);
  return labels.unavailable;
}

export function getTuitionSortValue(university: University): number {
  const { tuition } = university;
  if (!tuition.verified) return Number.MAX_SAFE_INTEGER;
  return tuition.graduationCostMin ?? tuition.estimatedGraduationCost ?? tuition.totalPerSemester ?? Number.MAX_SAFE_INTEGER;
}

export function inferCategory(specialization: string): import("./types").SpecializationCategory {
  const s = specialization.toLowerCase();
  if (s.includes("engineer") || s.includes("technology") || s.includes("stem")) return "engineering";
  if (s.includes("medical") || s.includes("health") || s.includes("pharma")) return "medical";
  if (s.includes("business") || s.includes("management") || s.includes("commerce")) return "business";
  if (s.includes("science") || s.includes("agriculture")) return "science";
  return "general";
}
