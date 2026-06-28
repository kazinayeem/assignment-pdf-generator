"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type HistoryEntry = {
  slug: string;
  title: string;
  inputs: Record<string, number | string>;
  result: string;
  timestamp: string;
};

interface CalculatorsState {
  favorites: string[];
  recent: string[];
  history: HistoryEntry[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  addRecent: (slug: string) => void;
  addHistory: (entry: Omit<HistoryEntry, "timestamp">) => void;
  clearHistory: () => void;
}

export const useCalculatorsStore = create<CalculatorsState>()(
  persist(
    (set, get) => ({
      favorites: [],
      recent: [],
      history: [],

      toggleFavorite: (slug) =>
        set((s) => ({
          favorites: s.favorites.includes(slug)
            ? s.favorites.filter((f) => f !== slug)
            : [...s.favorites, slug],
        })),

      isFavorite: (slug) => get().favorites.includes(slug),

      addRecent: (slug) =>
        set((s) => ({
          recent: [slug, ...s.recent.filter((r) => r !== slug)].slice(0, 12),
        })),

      addHistory: (entry) =>
        set((s) => ({
          history: [
            { ...entry, timestamp: new Date().toISOString() },
            ...s.history,
          ].slice(0, 50),
        })),

      clearHistory: () => set({ history: [] }),
    }),
    { name: "campusflow-calculators" }
  )
);
