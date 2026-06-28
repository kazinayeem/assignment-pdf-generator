import type { UniversityReview } from "./types";

const KEYS = {
  favorites: "campusflow-uni-favorites",
  bookmarks: "campusflow-uni-bookmarks",
  recentlyViewed: "campusflow-uni-recent",
  compareLater: "campusflow-uni-compare-later",
  reviews: "campusflow-uni-reviews",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getFavorites(): string[] {
  return read<string[]>(KEYS.favorites, []);
}

export function toggleFavorite(slug: string): string[] {
  const current = getFavorites();
  const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
  write(KEYS.favorites, next);
  return next;
}

export function isFavorite(slug: string): boolean {
  return getFavorites().includes(slug);
}

export function getBookmarks(): string[] {
  return read<string[]>(KEYS.bookmarks, []);
}

export function toggleBookmark(slug: string): string[] {
  const current = getBookmarks();
  const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
  write(KEYS.bookmarks, next);
  return next;
}

export function getRecentlyViewed(): string[] {
  return read<string[]>(KEYS.recentlyViewed, []);
}

export function addRecentlyViewed(slug: string, max = 8): string[] {
  const current = getRecentlyViewed().filter((s) => s !== slug);
  const next = [slug, ...current].slice(0, max);
  write(KEYS.recentlyViewed, next);
  return next;
}

export function getCompareLater(): string[] {
  return read<string[]>(KEYS.compareLater, []);
}

export function toggleCompareLater(slug: string): string[] {
  const current = getCompareLater();
  const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug].slice(0, 4);
  write(KEYS.compareLater, next);
  return next;
}

export function getUserReviews(slug: string): UniversityReview[] {
  const all = read<Record<string, UniversityReview[]>>(KEYS.reviews, {});
  return all[slug] ?? [];
}

export function addUserReview(slug: string, review: UniversityReview): UniversityReview[] {
  const all = read<Record<string, UniversityReview[]>>(KEYS.reviews, {});
  const list = [review, ...(all[slug] ?? [])];
  all[slug] = list;
  write(KEYS.reviews, all);
  return list;
}

export function getAllUserReviews(): Record<string, UniversityReview[]> {
  return read<Record<string, UniversityReview[]>>(KEYS.reviews, {});
}
