import { predictAdmissionForUniversity } from "./admission-predictor";
import { getUniversityDepartments } from "./departments";
import type { AdmissionPredictorInput, University } from "./types";
import { formatTuitionRange } from "./format";

const tuitionLabels = {
  unavailable: "Contact university",
  variesByDepartment: "Varies by department",
  startingFrom: "From",
  estimated: "estimated",
};

export function generateUniversitySummary(university: University): string {
  if (university.aiSummary) return university.aiSummary;

  const qs = university.rankings.qsWorld ?? university.rankings.qsAsia;
  const ranking = qs ? `QS-ranked institution` : "UGC-approved institution";
  const tuition = formatTuitionRange(university.tuition, tuitionLabels);
  const programs = university.programs.slice(0, 3).map((p) => p.department).join(", ");

  return `${university.name} is a ${university.type} ${ranking} established in ${university.established}, located in ${university.city}. ` +
    `Known for ${university.specialization}, it offers programs including ${programs || "multiple disciplines"}. ` +
    `Tuition: ${tuition}. ` +
    `${university.facilities.hostel ? "On-campus hostel available. " : ""}` +
    `${university.scholarships.length > 0 ? "Scholarships and waivers available. " : ""}` +
    `Verify latest admission requirements on the official website.`;
}

export function generateDepartmentSummary(university: University, deptSlug: string): string {
  const dept = getUniversityDepartments(university).find((d) => d.slug === deptSlug);
  if (!dept) return "Department information not available.";

  const levels = [...new Set(dept.programs.map((p) => p.level))].join(", ");
  const duration = dept.programs[0]?.durationYears;

  return `${dept.name} at ${university.shortName} is part of ${dept.faculty}. ` +
    `Offers ${levels} programs${duration ? ` over ${duration} years` : ""}. ` +
    `${dept.researchAreas.length > 0 ? `Research areas: ${dept.researchAreas.join(", ")}. ` : ""}` +
    `${dept.careerOpportunities.length > 0 ? `Career paths include ${dept.careerOpportunities.slice(0, 3).join(", ")}. ` : ""}` +
    `Check official curriculum and admission circular for current requirements.`;
}

export function generateCareerRecommendation(university: University, careerGoal: string): string[] {
  const goal = careerGoal.toLowerCase();
  const recs: string[] = [];

  if (goal.includes("engineer") || goal.includes("software") || goal.includes("tech")) {
    if (university.category === "engineering") recs.push("Strong engineering curriculum aligned with your goal");
    recs.push(...university.career.topRecruiters.slice(0, 3).map((r) => `Recruiter: ${r}`));
  }
  if (goal.includes("business") || goal.includes("mba")) {
    recs.push("Consider BBA/MBA programs and internship opportunities");
  }
  if (university.career.internshipPartners.length > 0) {
    recs.push(`Internship partners: ${university.career.internshipPartners.slice(0, 2).join(", ")}`);
  }
  if (recs.length === 0) recs.push("Explore department-specific career services on campus");

  return recs;
}

export function generateAdmissionGuide(university: University, input: AdmissionPredictorInput): string[] {
  const prediction = predictAdmissionForUniversity(input, university);
  const guide = [
    ...prediction.eligibility,
    ...prediction.reasons,
    `Estimated chance: ${prediction.chance} (${prediction.confidence}% confidence)`,
  ];
  if (university.admission.applyUrl) guide.push(`Apply at: ${university.admission.applyUrl}`);
  return guide;
}

export function generateScholarshipSuggestions(university: University, avgGpa: number): string[] {
  const suggestions: string[] = [];
  if (university.tuition.waiverPolicy) suggestions.push(university.tuition.waiverPolicy);
  for (const s of university.scholarships) suggestions.push(s);
  if (avgGpa >= 5.0 && university.tuition.scholarshipPercent) {
    suggestions.push(`Eligible for up to ${university.tuition.scholarshipPercent}% waiver based on GPA`);
  }
  if (suggestions.length === 0) suggestions.push("Contact financial aid office for available scholarships");
  return suggestions;
}
