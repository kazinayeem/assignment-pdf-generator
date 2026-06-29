import type { InterviewCategory, RoadmapDifficulty } from "../types";
import { PDF_BRAND } from "@/lib/brand";

export const INTERVIEW_CATEGORIES: { id: InterviewCategory; label: string }[] = [
  { id: "theory", label: "Theory Questions" },
  { id: "practical", label: "Practical Questions" },
  { id: "coding", label: "Coding Questions" },
  { id: "scenario", label: "Scenario Questions" },
  { id: "debugging", label: "Debugging Questions" },
  { id: "design", label: "Design Questions" },
  { id: "architecture", label: "Architecture Questions" },
  { id: "behavioral", label: "Behavioral Questions" },
  { id: "hr", label: "HR Questions" },
];

export const DIFFICULTY_LEVELS: RoadmapDifficulty[] = ["beginner", "intermediate", "advanced", "expert"];

export const GLOBAL_COMPANIES = [
  "Google", "Microsoft", "Amazon", "Meta", "Netflix", "Apple", "Cloudflare", "Stripe", "Uber", "Airbnb",
  "Spotify", "Atlassian", "Datadog", "OpenAI", "Anthropic", "Palantir", "Oracle", "IBM", "Intel", "NVIDIA",
  "Cisco", "Samsung", "Tesla", "SpaceX", "Toptal", "GitLab", "HashiCorp", "Vercel", "Supabase", "DigitalOcean",
] as const;

export const BD_COMPANIES = [
  "Brain Station 23", "BJIT", "Enosis", "TigerIT", "REVE Systems", "Datasoft", "Selise", "Therap",
  "Craftsmen", "Apsis Solutions", "Battery Low Interactive", "Kaz Software", "Rokomari", "Pathao", "bKash",
  "Nagad", "SSL Wireless", "Robi", "Grameenphone", "Banglalink", "Shajgoj", "ShareTrip", "ShopUp",
  "10 Minute School",
] as const;

export const ALL_COMPANIES = [...GLOBAL_COMPANIES, ...BD_COMPANIES];

export const SALARY_REGIONS = [
  "Bangladesh", "India", "Europe", "United Kingdom", "Canada", "Australia", "United States", "Middle East",
] as const;

export const CAREER_LADDER = [
  "Intern", "Junior Engineer", "Software Engineer", "Senior Engineer", "Lead Engineer",
  "Staff Engineer", "Principal Engineer", "Engineering Manager", "Director", "VP Engineering", "CTO",
] as const;

export const PORTFOLIO_ITEMS = [
  { id: "beginner-1", label: "Beginner Project 1", level: "beginner" },
  { id: "beginner-2", label: "Beginner Project 2", level: "beginner" },
  { id: "beginner-3", label: "Beginner Project 3", level: "beginner" },
  { id: "beginner-4", label: "Beginner Project 4", level: "beginner" },
  { id: "beginner-5", label: "Beginner Project 5", level: "beginner" },
  { id: "intermediate-1", label: "Intermediate Project 1", level: "intermediate" },
  { id: "intermediate-2", label: "Intermediate Project 2", level: "intermediate" },
  { id: "intermediate-3", label: "Intermediate Project 3", level: "intermediate" },
  { id: "intermediate-4", label: "Intermediate Project 4", level: "intermediate" },
  { id: "intermediate-5", label: "Intermediate Project 5", level: "intermediate" },
  { id: "advanced-1", label: "Advanced Project 1", level: "advanced" },
  { id: "advanced-2", label: "Advanced Project 2", level: "advanced" },
  { id: "advanced-3", label: "Advanced Project 3", level: "advanced" },
  { id: "production", label: "Production-Ready Project", level: "production" },
  { id: "open-source", label: "Open Source Contribution", level: "open-source" },
  { id: "portfolio-site", label: "Portfolio Website", level: "portfolio" },
  { id: "resume", label: "Resume", level: "career" },
  { id: "linkedin", label: "LinkedIn Profile", level: "career" },
  { id: "github", label: "GitHub Profile", level: "career" },
] as const;

export const READINESS_KEYS = [
  "topicsCompleted",
  "projectsCompleted",
  "interviewPracticed",
  "codingSolved",
  "portfolioReady",
  "resumeReady",
  "githubReady",
  "linkedinReady",
  "mockInterviewCompleted",
] as const;

export const PDF_VERSION = PDF_BRAND.version;
export const PDF_AUTHOR = PDF_BRAND.author;
export const PDF_AUTHOR_URL = PDF_BRAND.authorUrl;
export const PDF_GITHUB = PDF_BRAND.github;
export const PDF_PLATFORM = PDF_BRAND.platform;
export const PDF_COMPANY = PDF_BRAND.company;
