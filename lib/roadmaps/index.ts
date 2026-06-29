import { enrichRoadmapDefinition } from "./enrich";
import { getRoadmapDefinition, ROADMAP_DEFINITIONS } from "./catalog";
import type { Roadmap } from "./types";

const cache = new Map<string, Roadmap>();

export function getRoadmap(slug: string): Roadmap | undefined {
  if (cache.has(slug)) return cache.get(slug);
  const def = getRoadmapDefinition(slug);
  if (!def) return undefined;
  const roadmap = enrichRoadmapDefinition(def);
  cache.set(slug, roadmap);
  return roadmap;
}

export function getAllRoadmaps(): Roadmap[] {
  return ROADMAP_DEFINITIONS.map((def) => getRoadmap(def.slug)!);
}

export function searchRoadmaps(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return ROADMAP_DEFINITIONS;
  return ROADMAP_DEFINITIONS.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q)) ||
      r.languages.some((l) => l.toLowerCase().includes(q))
  );
}

export function recommendRoadmaps(opts: {
  careerGoal?: string | null;
  favoriteTech?: string[];
  completedSlugs?: string[];
  limit?: number;
}) {
  const { careerGoal, favoriteTech = [], completedSlugs = [], limit = 6 } = opts;
  const scored = ROADMAP_DEFINITIONS.map((r) => {
    let score = r.popularity;
    if (r.featured) score += 10;
    if (careerGoal && r.title.toLowerCase().includes(careerGoal.toLowerCase())) score += 25;
    if (favoriteTech.some((t) => r.languages.some((l) => l.toLowerCase().includes(t.toLowerCase())))) score += 15;
    if (completedSlugs.includes(r.slug)) score -= 50;
    if (r.beginnerFriendly) score += 5;
    return { roadmap: r, score };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.roadmap);
}

export { ROADMAP_DEFINITIONS, ROADMAP_SLUGS, ROADMAP_CATEGORIES, getRoadmapCatalog } from "./catalog";
