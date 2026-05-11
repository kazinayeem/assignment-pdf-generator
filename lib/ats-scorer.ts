import type { CVData } from "./cv-types";

export interface ATSResult {
  score: number; // 0–100
  grade: "A" | "B" | "C" | "D" | "F";
  checks: ATSCheck[];
}

export interface ATSCheck {
  label: string;
  passed: boolean;
  tip: string;
  weight: number;
}

export function scoreATS(cv: CVData): ATSResult {
  const checks: ATSCheck[] = [
    {
      label: "Full name present",
      passed: cv.personal.fullName.trim().length > 2,
      tip: "Add your full name to the personal section.",
      weight: 10,
    },
    {
      label: "Email address",
      passed: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cv.personal.email),
      tip: "Add a valid email address.",
      weight: 10,
    },
    {
      label: "Phone number",
      passed: cv.personal.phone.trim().length >= 7,
      tip: "Add a phone number for recruiters to contact you.",
      weight: 5,
    },
    {
      label: "Professional summary",
      passed: cv.summary.trim().split(/\s+/).length >= 20,
      tip: "Write a summary of at least 20 words describing your professional background.",
      weight: 10,
    },
    {
      label: "Work experience",
      passed: cv.experience.length > 0,
      tip: "Add at least one work experience entry.",
      weight: 15,
    },
    {
      label: "Experience bullet points",
      passed: cv.experience.some((e) => e.bullets.some((b) => b.trim().length > 10)),
      tip: "Add descriptive bullet points to your experience entries.",
      weight: 10,
    },
    {
      label: "Education",
      passed: cv.education.length > 0,
      tip: "Add your educational background.",
      weight: 10,
    },
    {
      label: "Skills section",
      passed: cv.skills.length >= 3,
      tip: "Add at least 3 skills. ATS systems scan for keyword matches.",
      weight: 15,
    },
    {
      label: "Job title / headline",
      passed: cv.personal.title.trim().length > 2,
      tip: "Add a professional title (e.g. 'Software Engineer').",
      weight: 5,
    },
    {
      label: "LinkedIn profile",
      passed: cv.personal.linkedin.trim().length > 5,
      tip: "Add your LinkedIn URL to increase credibility.",
      weight: 5,
    },
    {
      label: "Action verbs in experience",
      passed: cv.experience.some((e) =>
        e.bullets.some((b) =>
          /^(led|built|developed|designed|managed|created|improved|increased|reduced|launched|delivered|implemented|architected|optimized|collaborated|mentored)/i.test(
            b.trim()
          )
        )
      ),
      tip: "Start bullet points with strong action verbs (Led, Built, Developed, etc.).",
      weight: 5,
    },
  ];

  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const earnedWeight = checks
    .filter((c) => c.passed)
    .reduce((s, c) => s + c.weight, 0);

  const score = Math.round((earnedWeight / totalWeight) * 100);

  const grade =
    score >= 90 ? "A" :
    score >= 75 ? "B" :
    score >= 60 ? "C" :
    score >= 45 ? "D" : "F";

  return { score, grade, checks };
}
