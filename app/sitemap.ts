import type { MetadataRoute } from "next";
import { getAllRoutes } from "@/lib/knowledge/loader";

const BASE_URL = "https://bornosoft-cover.vercel.app";

const STATIC_ROUTES = [
  "/",
  "/cv-builder",
  "/lab-report",
  "/routine-builder",
  "/result",
  "/login",
  "/privacy-policy",
  "/tools",
  "/tools/os",
  "/tools/dsa",
  "/tools/algorithms",
  "/tools/network",
  "/tools/database",
  "/tools/security",
  "/tools/arch",
  "/tools/theory-of-computing",
  "/tools/data-science",
  "/tools/devops",
  "/tools/exam",
  "/tools/learning/progress",
  "/tools/learning/leaderboard",
  "/career",
  "/career/ats-checker",
  "/career/cover-letter",
  "/career/portfolio",
  "/career/linkedin",
  "/career/github-readme",
  "/career/internship-tracker",
  "/career/job-tracker",
  "/career/salary-calculator",
  "/career/interview",
  "/career/roadmaps",
  "/career/analytics",
  "/interview",
  "/interview/companies",
  "/interview/notes",
  "/interview/resources",
  "/interview/archive",
  "/interview/upcoming",
  "/interview/search",
  "/interview/snippets",
  "/developer-tools",
  "/calculators",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticEntries = STATIC_ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" as const : "monthly" as const,
    priority: path === "/" ? 1 : path.startsWith("/interview") || path.startsWith("/career") ? 0.8 : 0.7,
  }));

  const knowledgeEntries = getAllRoutes()
    .filter((route) => route !== "/interview")
    .map((route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticEntries, ...knowledgeEntries];
}
