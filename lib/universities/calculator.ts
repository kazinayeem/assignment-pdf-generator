import { UNIVERSITIES } from "./index";
import { predictAdmissionForUniversity } from "./admission-predictor";
import type {
  AdmissionPredictorInput,
  RecommendationInput,
  RecommendationResult,
  TuitionCalculationInput,
  TuitionCalculationResult,
  University,
} from "./types";

const n = (v: number | null | undefined) => v ?? 0;

export function calculateTuition(
  university: University,
  input: TuitionCalculationInput
): TuitionCalculationResult {
  const t = university.tuition;
  const creditsRemaining = Math.max(0, (t.creditHours ?? input.creditsPerSemester * input.semesters) - input.creditsCompleted);

  const admissionFee = n(t.admissionFee);
  const registrationFee = n(t.registrationFee);
  const perCredit = n(t.perCreditFee);
  const perCreditTotal = perCredit * creditsRemaining;

  const perSemesterBase =
    n(t.semesterFee) +
    input.creditsPerSemester * perCredit +
    n(t.labFee) +
    n(t.developmentFee) +
    n(t.libraryFee) +
    n(t.examFee);

  const semesterFees = perSemesterBase * input.semesters;
  const subtotal = admissionFee + registrationFee + perCreditTotal + semesterFees;

  const scholarshipDiscount = Math.round(subtotal * (input.scholarshipPercent / 100));
  const afterScholarship = subtotal - scholarshipDiscount;
  const waiverDiscount = Math.round(afterScholarship * (input.waiverPercent / 100));
  const academicTotal = afterScholarship - waiverDiscount;

  const months = input.semesters * 4;
  const livingCost = input.includeLiving ? 15000 * months : 0;
  const hostelCost = input.includeHostel ? 6000 * months : 0;
  const transportCost = input.includeTransport ? 3000 * months : 0;
  const foodCost = input.includeFood ? 8000 * months : 0;
  const grandTotal = academicTotal + livingCost + hostelCost + transportCost + foodCost;
  const monthlyInstallment = months > 0 ? Math.round(grandTotal / months) : 0;

  return {
    admissionFee,
    registrationFee,
    perCreditTotal,
    semesterFees,
    scholarshipDiscount,
    waiverDiscount,
    academicTotal,
    livingCost,
    hostelCost,
    transportCost,
    foodCost,
    grandTotal,
    monthlyInstallment,
    verified: t.verified,
  };
}

export function recommendUniversitiesV2(input: RecommendationInput, limit = 8): RecommendationResult[] {
  const predictorBase: AdmissionPredictorInput = {
    sscGpa: input.sscGpa,
    hscGpa: input.hscGpa,
    group: "science",
    preferredSubject: input.preferredSubject,
    preferredCity: input.preferredCity ?? "",
    budget: input.budget,
    typePreference: input.typePreference ?? "any",
  };

  return UNIVERSITIES.map((u) => {
    let match = 0;
    const reasons: string[] = [];

    if (input.typePreference && input.typePreference !== "any" && u.type === input.typePreference) {
      match += 12;
      reasons.push(`Matches ${input.typePreference} preference`);
    }

    const subject = input.preferredSubject.toLowerCase();
    if (u.programs.some((p) => p.department.toLowerCase().includes(subject))) {
      match += 20;
      reasons.push(`Strong ${input.preferredSubject} programs`);
    }

    if (input.division === "any" || u.division === input.division) {
      match += 10;
      reasons.push("Location preference match");
    }

    if (input.preferredCity && u.city.toLowerCase().includes(input.preferredCity.toLowerCase())) {
      match += 8;
      reasons.push(`In ${input.preferredCity}`);
    }

    const cost = u.tuition.graduationCostMin ?? u.tuition.estimatedGraduationCost;
    if (cost != null && input.budget >= cost) {
      match += 15;
      reasons.push("Within budget");
    } else if (u.type === "public") {
      match += 8;
      reasons.push("Affordable public option");
    }

    if (input.hostelNeeded && u.facilities.hostel) {
      match += 8;
      reasons.push("Hostel available");
    }

    if (input.scholarshipNeeded && (u.scholarships.length > 0 || u.tuition.waiverPolicy)) {
      match += 8;
      reasons.push("Scholarship/waiver available");
    }

    const goal = input.careerGoal.toLowerCase();
    if (goal.includes("engineer") && u.category === "engineering") {
      match += 10;
      reasons.push("Aligns with engineering career goal");
    }

    const prediction = predictAdmissionForUniversity(predictorBase, u);
    match += Math.round(prediction.confidence * 0.2);

    return {
      university: u,
      matchPercent: Math.min(98, match),
      admissionChance: prediction.chance,
      estimatedCost: cost,
      reasons: reasons.slice(0, 4),
    };
  })
    .filter((r) => r.matchPercent > 25)
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, limit);
}
