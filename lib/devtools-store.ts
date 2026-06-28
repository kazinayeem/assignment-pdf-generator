"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DevToolsState {
  favorites: string[];
  recent: string[];
  usageCounts: Record<string, number>;
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  addRecent: (slug: string) => void;
  incrementUsage: (slug: string) => void;
  getUsageCount: (slug: string) => number;
}

export const useDevToolsStore = create<DevToolsState>()(
  persist(
    (set, get) => ({
      favorites: [],
      recent: [],
      usageCounts: {},

      toggleFavorite: (slug) =>
        set((s) => ({
          favorites: s.favorites.includes(slug)
            ? s.favorites.filter((f) => f !== slug)
            : [...s.favorites, slug],
        })),

      isFavorite: (slug) => get().favorites.includes(slug),

      addRecent: (slug) =>
        set((s) => ({
          recent: [slug, ...s.recent.filter((r) => r !== slug)].slice(0, 16),
        })),

      incrementUsage: (slug) =>
        set((s) => ({
          usageCounts: {
            ...s.usageCounts,
            [slug]: (s.usageCounts[slug] ?? 0) + 1,
          },
        })),

      getUsageCount: (slug) => get().usageCounts[slug] ?? 0,
    }),
    { name: "campusflow-devtools" }
  )
);
