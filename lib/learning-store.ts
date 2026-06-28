"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LearningState {
  bookmarked: string[];
  pinnedSubjects: string[];
  recentLessons: { href: string; title: string; visitedAt: string }[];
  completedLessons: string[];
  toggleBookmark: (href: string) => void;
  isBookmarked: (href: string) => boolean;
  togglePinSubject: (slug: string) => void;
  isPinnedSubject: (slug: string) => boolean;
  addRecentLesson: (href: string, title: string) => void;
  markCompleted: (href: string) => void;
  isCompleted: (href: string) => boolean;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      bookmarked: [],
      pinnedSubjects: [],
      recentLessons: [],
      completedLessons: [],

      toggleBookmark: (href) =>
        set((s) => ({
          bookmarked: s.bookmarked.includes(href)
            ? s.bookmarked.filter((h) => h !== href)
            : [...s.bookmarked, href],
        })),

      isBookmarked: (href) => get().bookmarked.includes(href),

      togglePinSubject: (slug) =>
        set((s) => ({
          pinnedSubjects: s.pinnedSubjects.includes(slug)
            ? s.pinnedSubjects.filter((x) => x !== slug)
            : [...s.pinnedSubjects, slug],
        })),

      isPinnedSubject: (slug) => get().pinnedSubjects.includes(slug),

      addRecentLesson: (href, title) =>
        set((s) => ({
          recentLessons: [
            { href, title, visitedAt: new Date().toISOString() },
            ...s.recentLessons.filter((r) => r.href !== href),
          ].slice(0, 8),
        })),

      markCompleted: (href) =>
        set((s) => ({
          completedLessons: s.completedLessons.includes(href)
            ? s.completedLessons
            : [...s.completedLessons, href],
        })),

      isCompleted: (href) => get().completedLessons.includes(href),
    }),
    { name: "campusflow-learning" }
  )
);
