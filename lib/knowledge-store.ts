"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface KnowledgeState {
  bookmarks: string[];
  readArticles: string[];
  readingProgress: Record<string, number>;
  recentRoutes: string[];
  favorites: string[];

  toggleBookmark: (route: string) => void;
  isBookmarked: (route: string) => boolean;
  markRead: (route: string) => void;
  isRead: (route: string) => boolean;
  setProgress: (route: string, percent: number) => void;
  addRecent: (route: string) => void;
  toggleFavorite: (route: string) => void;
  isFavorite: (route: string) => boolean;
}

export const useKnowledgeStore = create<KnowledgeState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      readArticles: [],
      readingProgress: {},
      recentRoutes: [],
      favorites: [],

      toggleBookmark: (route) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(route)
            ? s.bookmarks.filter((r) => r !== route)
            : [...s.bookmarks, route],
        })),

      isBookmarked: (route) => get().bookmarks.includes(route),

      markRead: (route) =>
        set((s) => ({
          readArticles: s.readArticles.includes(route) ? s.readArticles : [...s.readArticles, route],
          readingProgress: { ...s.readingProgress, [route]: 100 },
        })),

      isRead: (route) => get().readArticles.includes(route),

      setProgress: (route, percent) =>
        set((s) => ({
          readingProgress: { ...s.readingProgress, [route]: percent },
          ...(percent >= 90 && !s.readArticles.includes(route)
            ? { readArticles: [...s.readArticles, route] }
            : {}),
        })),

      addRecent: (route) =>
        set((s) => ({
          recentRoutes: [route, ...s.recentRoutes.filter((r) => r !== route)].slice(0, 20),
        })),

      toggleFavorite: (route) =>
        set((s) => ({
          favorites: s.favorites.includes(route)
            ? s.favorites.filter((r) => r !== route)
            : [...s.favorites, route],
        })),

      isFavorite: (route) => get().favorites.includes(route),
    }),
    { name: "campusflow-knowledge" }
  )
);
