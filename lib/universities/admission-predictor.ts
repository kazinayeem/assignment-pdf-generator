import { UNIVERSITIES, getUniversity } from "./index";
import type {
  AdmissionChance,
  AdmissionPredictorInput,
  AdmissionPrediction,
  University,
} from "./types";

function chanceFromScore(score: number): AdmissionChance {
  if (score >= 85) return "very-high";
  if (score >= 70) return "high";
  if (score >= 50) return "medium";
  if (score >= 30) return "low";
  return "very-low";
}

export function predictAdmissionForUniversity(
  input: AdmissionPredictorInput,
  university: University
): AdmissionPrediction {
  let score = 0;
  const reasons: string[] = [];
  const eligibility: string[] = [];

  const sscMin = university.admission.sscGpaMin;
  const hscMin = university.admission.hscGpaMin;

  if (sscMin != null) {
    eligibility.push(`SSC GPA minimum: ${sscMin}`);
    if (input.sscGpa >= sscMin) {
      score += 25;
      reasons.push(`SSC GPA ${input.sscGpa} meets requirement (${sscMin})`);
    } else {
      score += Math.max(0, 25 - (sscMin - input.sscGpa) * 20);
      reasons.push(`SSC GPA ${input.sscGpa} below requirement (${sscMin})`);
    }
  } else {
    score += 15;
    reasons.push("SSC requirement not published — verify on official site");
  }

  if (hscMin != null) {
    eligibility.push(`HSC GPA minimum: ${hscMin}`);
    if (input.hscGpa >= hscMin) {
      score += 25;
      reasons.push(`HSC GPA ${input.hscGpa} meets requirement (${hscMin})`);
    } else {
      score += Math.max(0, 25 - (hscMin - input.hscGpa) * 20);
      reasons.push(`HSC GPA ${input.hscGpa} below requirement (${hscMin})`);
    }
  } else {
    score += 15;
  }

  const subject = input.preferredSubject.toLowerCase();
  if (university.programs.some((p) =>
    p.department.toLowerCase().includes(subject) || p.name.toLowerCase().includes(subject)
  )) {
    score += 15;
    reasons.push(`Offers ${input.preferredSubject} programs`);
  }

  const cost = university.tuition.graduationCostMin ?? university.tuition.estimatedGraduationCost;
  if (cost != null) {
    eligibility.push(`Estimated cost from ৳${cost.toLocaleString()}`);
    if (input.budget >= cost) {
      score += 15;
      reasons.push("Budget covers estimated tuition");
    } else if (input.budget >= cost * 0.7) {
      score += 8;
      reasons.push("Budget partially covers tuition — scholarships may help");
    } else {
      reasons.push("Budget may be insufficient for full program cost");
    }
  } else if (university.type === "public") {
    score += 10;
    reasons.push("Public university — typically affordable");
  }

  if (input.typePreference === "any" || university.type === input.typePreference) {
    score += 5;
  }

  if (input.preferredCity && (
    university.city.toLowerCase().includes(input.preferredCity.toLowerCase()) ||
    university.division.toLowerCase().includes(input.preferredCity.toLowerCase())
  )) {
    score += 5;
    reasons.push(`Located in preferred area (${university.city})`);
  }

  if (input.quota && input.quota !== "none" && university.type === "public") {
    score += 8;
    reasons.push("Quota may improve admission chances at public universities");
    eligibility.push("Quota benefits vary — check official circular");
  }

  if (university.admission.isOpen === true) {
    score += 5;
    eligibility.push("Admission currently open");
  } else if (university.admission.isOpen === false) {
    score -= 5;
    eligibility.push("Admission may be closed — check official portal");
  }

  const confidence = Math.min(95, Math.max(35, score + (university.tuition.verified ? 5 : 0)));

  return {
    university,
    chance: chanceFromScore(score),
    confidence,
    reasons,
    eligibility,
  };
}

export function predictAdmission(input: AdmissionPredictorInput): {
  primary: AdmissionPrediction | null;
  alternatives: AdmissionPrediction[];
} {
  const primaryUni = input.preferredUniversitySlug
    ? getUniversity(input.preferredUniversitySlug)
    : undefined;

  const primary = primaryUni ? predictAdmissionForUniversity(input, primaryUni) : null;

  const allPredictions = UNIVERSITIES
    .filter((u) => u.slug !== input.preferredUniversitySlug)
    .map((u) => predictAdmissionForUniversity(input, u))
    .filter((p) => p.chance !== "very-low")
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 6);

  return { primary, alternatives: allPredictions };
}
