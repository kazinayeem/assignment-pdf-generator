import type { CareerOutlook, RoadmapDefinition, SalaryBand } from "../types";
import { ALL_COMPANIES, CAREER_LADDER, SALARY_REGIONS } from "./constants";
import { ROADMAP_DEFINITIONS } from "../catalog";

const REGION_MULTIPLIERS: Record<string, number> = {
  Bangladesh: 1,
  India: 1.2,
  Europe: 3.5,
  "United Kingdom": 3.8,
  Canada: 3.6,
  Australia: 3.7,
  "United States": 5.5,
  "Middle East": 3.2,
};

function formatSalary(base: number, mult: number): string {
  const v = Math.round(base * mult);
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `৳${v.toLocaleString()}`;
}

function generateSalaries(def: RoadmapDefinition): SalaryBand[] {
  const base = def.category === "ai" ? 55000 : def.category === "role" ? 45000 : 38000;
  return SALARY_REGIONS.map((region) => {
    const m = REGION_MULTIPLIERS[region] ?? 1;
    return {
      region,
      entry: formatSalary(base * 0.7, m),
      mid: formatSalary(base, m),
      senior: formatSalary(base * 1.6, m),
      lead: formatSalary(base * 2.2, m),
      architect: formatSalary(base * 2.8, m),
      freelanceHourly: formatSalary(Math.round(base / 160), m) + "/hr",
      remote: formatSalary(base * 1.3, m),
    };
  });
}

export function generateCareerOutlook(def: RoadmapDefinition): CareerOutlook {
  const skills = def.nodeDefs.slice(0, 8).map((n) => n.title);
  return {
    overview: `${def.title} professionals design, build, and maintain solutions using ${skills.slice(0, 3).join(", ")} and related technologies. Demand is ${def.demand.replace("-", " ")} with ${def.jobMarket} job market activity globally and in Bangladesh.`,
    responsibilities: [
      `Implement and maintain ${def.shortTitle} solutions`,
      "Collaborate with cross-functional teams",
      "Write clean, tested, documented code",
      "Participate in code reviews and architecture discussions",
      "Debug production issues and improve reliability",
      "Stay current with industry best practices",
    ],
    industries: ["Technology", "Fintech", "E-commerce", "Healthcare", "Education", "Telecom", "Startups", "Enterprise SaaS"],
    remoteOpportunities: `High — many ${def.title} roles offer remote or hybrid arrangements globally.`,
    freelanceOpportunities: "Strong on platforms like Toptal, Upwork, and direct contracts for ${def.shortTitle} specialists.",
    startupOpportunities: "Startups hire ${def.title} roles early for MVP development and rapid iteration.",
    enterpriseOpportunities: "Large enterprises need ${def.title} expertise for scalable systems and compliance.",
    topHiringCompanies: ALL_COMPANIES.slice(0, 20),
    requiredSkills: skills,
    futureDemand: def.demand === "very-high" ? "Accelerating over the next 5–10 years" : "Steady growth expected",
    marketGrowth: def.jobMarket === "high" ? "8–15% annual growth in relevant job postings" : "Moderate growth in niche segments",
    automationRisk: def.category === "ai" ? "Low — AI augments rather than replaces" : "Low to moderate — creative and architectural skills remain valuable",
    certifications: getCertSuggestions(def),
    dailyWorkflow: [
      "Stand-up and sprint planning",
      "Feature development or learning",
      "Code review and documentation",
      "Testing and deployment",
      "Stakeholder sync as needed",
    ],
    teamStructure: "Typically works within squads of 4–8 engineers with PM, design, and QA partners.",
    careerLadder: [...CAREER_LADDER],
    salaries: generateSalaries(def),
    salaryDisclaimer:
      "Salaries vary by company, experience, location, and market conditions. Figures are approximate ranges for planning purposes only.",
  };
}

function getCertSuggestions(def: RoadmapDefinition): string[] {
  const map: Partial<Record<string, string[]>> = {
    cloud: ["AWS Solutions Architect", "Azure Administrator", "GCP Professional Cloud Architect"],
    devops: ["CKA", "CKAD", "Terraform Associate", "AWS DevOps Engineer"],
    security: ["CompTIA Security+", "CEH", "OSCP"],
    ai: ["TensorFlow Developer", "AWS ML Specialty", "DeepLearning.AI"],
    data: ["Google Data Analytics", "dbt Analytics Engineering"],
  };
  return map[def.category] ?? ["Relevant vendor certifications", "Portfolio-based credibility"];
}

export function generateLearningPath(def: RoadmapDefinition) {
  const related = ROADMAP_DEFINITIONS.filter(
    (r) => r.slug !== def.slug && (r.category === def.category || r.languages.some((l) => def.languages.includes(l)))
  )
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 6);

  return {
    nextRoadmaps: related.map((r) => ({
      slug: r.slug,
      title: r.title,
      reason: `Complements ${def.title} with ${r.category} skills`,
    })),
    prerequisites: def.prerequisites,
    advancedTopics: def.nodeDefs.filter((n) => n.difficulty === "advanced").map((n) => n.title),
    relatedTechnologies: [...new Set([...def.languages, ...def.tags])].slice(0, 10),
  };
}

export function generatePortfolioChecklist() {
  return [
    { id: "beginner-1", label: "Beginner Project 1", level: "beginner", required: true },
    { id: "beginner-2", label: "Beginner Project 2", level: "beginner", required: true },
    { id: "beginner-3", label: "Beginner Project 3", level: "beginner", required: true },
    { id: "beginner-4", label: "Beginner Project 4", level: "beginner", required: true },
    { id: "beginner-5", label: "Beginner Project 5", level: "beginner", required: true },
    { id: "intermediate-1", label: "Intermediate Project 1", level: "intermediate", required: true },
    { id: "intermediate-2", label: "Intermediate Project 2", level: "intermediate", required: true },
    { id: "intermediate-3", label: "Intermediate Project 3", level: "intermediate", required: true },
    { id: "intermediate-4", label: "Intermediate Project 4", level: "intermediate", required: true },
    { id: "intermediate-5", label: "Intermediate Project 5", level: "intermediate", required: true },
    { id: "advanced-1", label: "Advanced Project 1", level: "advanced", required: true },
    { id: "advanced-2", label: "Advanced Project 2", level: "advanced", required: true },
    { id: "advanced-3", label: "Advanced Project 3", level: "advanced", required: true },
    { id: "production", label: "Production-Ready Project", level: "production", required: true },
    { id: "open-source", label: "Open Source Contribution", level: "open-source", required: true },
    { id: "portfolio-site", label: "Portfolio Website", level: "portfolio", required: true },
    { id: "resume", label: "Resume", level: "career", required: true },
    { id: "linkedin", label: "LinkedIn Profile", level: "career", required: true },
    { id: "github", label: "GitHub Profile", level: "career", required: true },
  ];
}
