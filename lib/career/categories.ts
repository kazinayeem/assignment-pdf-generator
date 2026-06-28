import type { CareerToolCategory } from "./types";

export const CAREER_CATEGORIES: { id: CareerToolCategory; label: string; emoji: string }[] = [
  { id: "resume", label: "Resume & Profile", emoji: "📄" },
  { id: "applications", label: "Applications", emoji: "💼" },
  { id: "interview", label: "Interview Prep", emoji: "🎯" },
  { id: "growth", label: "Career Growth", emoji: "🚀" },
  { id: "analytics", label: "Analytics", emoji: "📊" },
];

export function getCareerCategory(id: CareerToolCategory) {
  return CAREER_CATEGORIES.find((c) => c.id === id);
}

export const FEATURED_CAREER_TOOLS = (tools: { featured?: boolean }[]) =>
  tools.filter((t) => t.featured);

export const POPULAR_CAREER_TOOLS = (tools: { popular?: boolean }[]) =>
  tools.filter((t) => t.popular);
