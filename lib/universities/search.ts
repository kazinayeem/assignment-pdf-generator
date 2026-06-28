import type { SearchSuggestion, University } from "./types";

export type SearchMatch = {
  university: University;
  score: number;
  matchedFields: string[];
};

function tokenize(query: string): string[] {
  return query.toLowerCase().trim().split(/\s+/).filter(Boolean);
}

function fieldMatches(value: string, tokens: string[]): boolean {
  const lower = value.toLowerCase();
  return tokens.every((t) => lower.includes(t));
}

function scoreMatch(university: University, tokens: string[]): SearchMatch | null {
  const matchedFields: string[] = [];
  let score = 0;

  const checks: { field: string; value: string; weight: number }[] = [
    { field: "name", value: university.name, weight: 100 },
    { field: "shortName", value: university.shortName, weight: 90 },
    { field: "city", value: university.city, weight: 60 },
    { field: "district", value: university.district, weight: 55 },
    { field: "division", value: university.division, weight: 50 },
    { field: "specialization", value: university.specialization, weight: 40 },
  ];

  for (const { field, value, weight } of checks) {
    if (fieldMatches(value, tokens)) {
      matchedFields.push(field);
      score += weight;
      if (value.toLowerCase().startsWith(tokens[0])) score += 20;
    }
  }

  for (const program of university.programs) {
    const programFields = [
      { field: "department", value: program.department },
      { field: "program", value: program.name },
      { field: "subject", value: program.faculty },
    ];
    for (const { field, value } of programFields) {
      if (fieldMatches(value, tokens)) {
        matchedFields.push(field);
        score += 45;
      }
    }
  }

  if (matchedFields.length === 0) return null;
  return { university, score, matchedFields };
}

export function searchUniversities(universities: University[], query: string): SearchMatch[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return universities.map((u) => ({ university: u, score: 0, matchedFields: [] }));

  return universities
    .map((u) => scoreMatch(u, tokens))
    .filter((m): m is SearchMatch => m != null)
    .sort((a, b) => b.score - a.score);
}

export function getSearchSuggestions(universities: University[], query: string, limit = 8): SearchSuggestion[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const suggestions: SearchSuggestion[] = [];
  const seen = new Set<string>();

  const add = (s: SearchSuggestion) => {
    const key = `${s.type}:${s.label}`;
    if (seen.has(key)) return;
    seen.add(key);
    suggestions.push(s);
  };

  for (const u of universities) {
    if (fieldMatches(u.name, tokens) || fieldMatches(u.shortName, tokens)) {
      add({
        type: "university",
        label: u.name,
        sublabel: u.shortName,
        slug: u.slug,
        matchField: fieldMatches(u.shortName, tokens) ? "shortName" : "name",
      });
    }
    if (fieldMatches(u.city, tokens) || fieldMatches(u.district, tokens) || fieldMatches(u.division, tokens)) {
      add({
        type: "location",
        label: `${u.city}, ${u.division}`,
        sublabel: u.name,
        slug: u.slug,
        matchField: "location",
      });
    }
    for (const p of u.programs) {
      if (fieldMatches(p.department, tokens)) {
        add({
          type: "department",
          label: p.department,
          sublabel: u.shortName,
          slug: u.slug,
          matchField: "department",
        });
      }
      if (fieldMatches(p.name, tokens)) {
        add({
          type: "program",
          label: p.name,
          sublabel: u.shortName,
          slug: u.slug,
          matchField: "program",
        });
      }
    }
    if (suggestions.length >= limit) break;
  }

  return suggestions.slice(0, limit);
}

export function highlightText(text: string, query: string): { text: string; highlighted: boolean }[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [{ text, highlighted: false }];

  const pattern = new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(pattern);

  return parts.map((part) => ({
    text: part,
    highlighted: tokens.some((t) => part.toLowerCase() === t.toLowerCase()),
  }));
}
