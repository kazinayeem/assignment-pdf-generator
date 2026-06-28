import type { University } from "./types";

export type EmployabilityMetrics = {
  score: number;
  internshipScore: number;
  industryScore: number;
  salaryScore: number;
  placementScore: number;
  researchScore: number;
  exchangeScore: number;
  careerSupportScore: number;
  verified: boolean;
};

export function computeEmployability(university: University): EmployabilityMetrics {
  const verified = university.career.verified;
  const partners = university.career.internshipPartners.length;
  const recruiters = university.career.topRecruiters.length;
  const exchange = university.exchangePrograms.length;
  const research = university.facilities.researchCenters ?? 0;

  const internshipScore = Math.min(100, partners * 15 + (university.career.internshipPartners.length > 0 ? 20 : 0));
  const industryScore = Math.min(100, recruiters * 12);
  const salaryScore = university.career.avgStartingSalary
    ? Math.min(100, Math.round(university.career.avgStartingSalary / 1000))
    : 40;
  const placementScore = university.career.employmentRate ?? 50;
  const researchScore = Math.min(100, research * 8 + (university.rankings.webometrics ? 20 : 0));
  const exchangeScore = Math.min(100, exchange * 25);
  const careerSupportScore = university.career.topRecruiters.length > 0 ? 70 : 40;

  const score = Math.round(
    (internshipScore * 0.15 +
      industryScore * 0.15 +
      salaryScore * 0.15 +
      placementScore * 0.2 +
      researchScore * 0.15 +
      exchangeScore * 0.1 +
      careerSupportScore * 0.1)
  );

  return {
    score,
    internshipScore,
    industryScore,
    salaryScore,
    placementScore,
    researchScore,
    exchangeScore,
    careerSupportScore,
    verified,
  };
}
