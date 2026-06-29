import { BRAND, PDF_BRAND } from "@/lib/brand";

export const ABOUT_STATS = [
  { key: "devTools", value: 100, suffix: "+" },
  { key: "roadmaps", value: 50, suffix: "+" },
  { key: "interviewQuestions", value: 5000, suffix: "+" },
  { key: "universities", value: 300, suffix: "+" },
  { key: "calculators", value: 100, suffix: "+" },
  { key: "students", value: 10000, suffix: "+" },
  { key: "atsScore", value: 95, suffix: "%" },
  { key: "freeForever", value: 100, suffix: "%" },
] as const;

export const STORY_STEPS = ["idea", "research", "development", "launch", "community", "future"] as const;
export const COMPANY_TIMELINE = ["founded", "firstProduct", "bornoflow", "devtools", "roadmaps", "university", "ai", "future"] as const;

export const VALUE_KEYS = ["innovation", "quality", "community", "learning", "openSource", "trust", "engineering", "accessibility"] as const;

export const TECH_STACK = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind",
  "Node.js",
  "MongoDB",
  "PostgreSQL",
  "Docker",
  "AWS",
  "Vercel",
  "AI",
] as const;

export const ECOSYSTEM_PRODUCTS = [
  { id: "bornosoft", emoji: "🏢", href: BRAND.companyUrl, external: true, status: "live" as const },
  { id: "bornoflow", emoji: "🌊", href: "/", status: "live" as const },
  { id: "bornoMaps", emoji: "🗺️", href: "/roadmaps", status: "live" as const },
  { id: "bornoAi", emoji: "🤖", href: "/tools", status: "comingSoon" as const },
  { id: "bornoCareer", emoji: "💼", href: "/career", status: "live" as const },
  { id: "bornoUni", emoji: "🏫", href: "/universities", status: "live" as const },
  { id: "bornoDev", emoji: "💻", href: "/developer-tools", status: "live" as const },
  { id: "resumeBuilder", emoji: "📝", href: "/cv-builder", status: "live" as const },
  { id: "assignmentStudio", emoji: "📄", href: "/assignment", status: "live" as const },
  { id: "interviewHub", emoji: "🎯", href: "/interview", status: "live" as const },
  { id: "developerTools", emoji: "🛠️", href: "/developer-tools", status: "live" as const },
  { id: "universityExplorer", emoji: "🎓", href: "/universities", status: "live" as const },
] as const;

export const COMMUNITY_STATS = [
  { key: "students", value: 10000, suffix: "+" },
  { key: "universities", value: 300, suffix: "+" },
  { key: "projects", value: 500, suffix: "+" },
  { key: "contributors", value: 2, suffix: "" },
  { key: "countries", value: 12, suffix: "+" },
] as const;

export const COMPARISON_ROWS = ["structured", "tools", "career", "free", "community", "ai"] as const;

export const GITHUB_REPO = PDF_BRAND.github;
