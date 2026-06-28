"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CompletedTopic {
  topicId: string;
  completedAt: string;
  score?: number;
}

export interface BookmarkedTopic {
  topicId: string;
  bookmarkedAt: string;
}

export interface RecentActivity {
  topicId: string;
  action: "view" | "complete" | "quiz" | "practice";
  timestamp: string;
}

export interface LearningPathProgress {
  pathId: string;
  completedModules: string[];
  currentModule: string;
  startedAt: string;
}

interface AlgoState {
  completedTopics: CompletedTopic[];
  bookmarkedTopics: BookmarkedTopic[];
  recentActivity: RecentActivity[];
  learningPaths: LearningPathProgress[];
  searchHistory: string[];
  quizScores: Record<string, number>;

  completeTopic: (topicId: string, score?: number) => void;
  isTopicCompleted: (topicId: string) => boolean;
  toggleBookmark: (topicId: string) => void;
  isBookmarked: (topicId: string) => boolean;
  addActivity: (topicId: string, action: RecentActivity["action"]) => void;
  getRecentActivity: (limit?: number) => RecentActivity[];
  getLearningPath: (pathId: string) => LearningPathProgress | undefined;
  updateLearningPath: (pathId: string, moduleId: string) => void;
  addSearch: (query: string) => void;
  getQuizScore: (topicId: string) => number;
  setQuizScore: (topicId: string, score: number) => void;
  getTotalCompleted: () => number;
  getCompletionPercent: () => number;
}

const TOTAL_TOPICS = 14;

export const useAlgoStore = create<AlgoState>()(
  persist(
    (set, get) => ({
      completedTopics: [],
      bookmarkedTopics: [],
      recentActivity: [],
      learningPaths: [],
      searchHistory: [],
      quizScores: {},

      completeTopic: (topicId, score) =>
        set((state) => {
          const exists = state.completedTopics.find((c) => c.topicId === topicId);
          if (exists) return state;
          return {
            completedTopics: [
              ...state.completedTopics,
              { topicId, completedAt: new Date().toISOString(), score },
            ],
            recentActivity: [
              {
                topicId,
                action: "complete" as const,
                timestamp: new Date().toISOString(),
              },
              ...state.recentActivity,
            ].slice(0, 50),
          };
        }),

      isTopicCompleted: (topicId) =>
        get().completedTopics.some((c) => c.topicId === topicId),

      toggleBookmark: (topicId) =>
        set((state) => {
          const exists = state.bookmarkedTopics.find((b) => b.topicId === topicId);
          if (exists) {
            return {
              bookmarkedTopics: state.bookmarkedTopics.filter(
                (b) => b.topicId !== topicId
              ),
            };
          }
          return {
            bookmarkedTopics: [
              ...state.bookmarkedTopics,
              { topicId, bookmarkedAt: new Date().toISOString() },
            ],
          };
        }),

      isBookmarked: (topicId) =>
        get().bookmarkedTopics.some((b) => b.topicId === topicId),

      addActivity: (topicId, action) =>
        set((state) => ({
          recentActivity: [
            { topicId, action, timestamp: new Date().toISOString() },
            ...state.recentActivity,
          ].slice(0, 50),
        })),

      getRecentActivity: (limit = 10) =>
        get().recentActivity.slice(0, limit),

      getLearningPath: (pathId) =>
        get().learningPaths.find((p) => p.pathId === pathId),

      updateLearningPath: (pathId, moduleId) =>
        set((state) => {
          const existing = state.learningPaths.find((p) => p.pathId === pathId);
          if (existing) {
            return {
              learningPaths: state.learningPaths.map((p) =>
                p.pathId === pathId
                  ? {
                      ...p,
                      completedModules: p.completedModules.includes(moduleId)
                        ? p.completedModules
                        : [...p.completedModules, moduleId],
                      currentModule: moduleId,
                    }
                  : p
              ),
            };
          }
          return {
            learningPaths: [
              ...state.learningPaths,
              {
                pathId,
                completedModules: [moduleId],
                currentModule: moduleId,
                startedAt: new Date().toISOString(),
              },
            ],
          };
        }),

      addSearch: (query) =>
        set((state) => ({
          searchHistory: [
            query,
            ...state.searchHistory.filter((s) => s !== query),
          ].slice(0, 10),
        })),

      getQuizScore: (topicId) => get().quizScores[topicId] || 0,

      setQuizScore: (topicId, score) =>
        set((state) => ({
          quizScores: { ...state.quizScores, [topicId]: score },
        })),

      getTotalCompleted: () => get().completedTopics.length,

      getCompletionPercent: () =>
        Math.round((get().completedTopics.length / TOTAL_TOPICS) * 100),
    }),
    {
      name: "algo-store",
    }
  )
);
