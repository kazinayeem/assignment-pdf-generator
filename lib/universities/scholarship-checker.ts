import { getUniversity } from "./index";
import type { ScholarshipCheckInput, ScholarshipOffer } from "./types";

export function checkScholarshipEligibility(input: ScholarshipCheckInput): ScholarshipOffer[] {
  const university = getUniversity(input.universitySlug);
  if (!university) return [];

  const offers: ScholarshipOffer[] = [];
  const avgGpa = (input.sscGpa + input.hscGpa) / 2;

  if (university.tuition.waiverPolicy) {
    const waiverMax = university.tuition.scholarshipPercent;
    const eligible = avgGpa >= 3.5;
    let waiverPercent: number | null = null;

    if (avgGpa >= 5.0 && waiverMax != null) waiverPercent = waiverMax;
    else if (avgGpa >= 4.8 && waiverMax != null) waiverPercent = Math.round(waiverMax * 0.8);
    else if (avgGpa >= 4.5 && waiverMax != null) waiverPercent = Math.round(waiverMax * 0.5);
    else if (avgGpa >= 4.0 && waiverMax != null) waiverPercent = Math.round(waiverMax * 0.25);

    offers.push({
      name: "GPA-based Tuition Waiver",
      type: "waiver",
      waiverPercent,
      eligible: eligible && waiverPercent != null,
      documents: ["SSC/HSC marksheets", "Admission confirmation", "NID"],
      deadline: university.admission.applicationDeadline,
      description: university.tuition.waiverPolicy,
    });
  }

  if (input.incomeRange === "low") {
    offers.push({
      name: "Need-based Financial Aid",
      type: "need-based",
      waiverPercent: null,
      eligible: university.financialAid.length > 0 || university.type === "public",
      documents: ["Income certificate", "SSC/HSC marksheets", "Application form"],
      deadline: university.admission.applicationDeadline,
      description: university.financialAid[0] ?? "Contact university financial aid office",
    });
  }

  if (avgGpa >= 4.5) {
    offers.push({
      name: "Merit Scholarship",
      type: "merit",
      waiverPercent: avgGpa >= 5.0 ? 100 : avgGpa >= 4.8 ? 50 : 25,
      eligible: university.scholarships.length > 0 || university.tuition.scholarshipPercent != null,
      documents: ["SSC/HSC marksheets", "Merit certificate if applicable"],
      deadline: university.admission.applicationDeadline,
      description: university.scholarships[0] ?? "Merit-based scholarship available",
    });
  }

  university.scholarships.forEach((s) => {
    offers.push({
      name: s,
      type: "merit",
      waiverPercent: null,
      eligible: avgGpa >= 3.5,
      documents: ["SSC/HSC marksheets", "Application form"],
      deadline: university.admission.applicationDeadline,
      description: s,
    });
  });

  return offers;
}
