import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RoadmapsUserState, RoadmapProgress } from "./types";

const todayKey = () => new Date().toISOString().slice(0, 10);

function defaultProgress(): RoadmapProgress {
  return {
    completedNodeIds: [],
    bookmarked: false,
    quizScores: {},
    lastVisitedAt: null,
    studyMinutes: 0,
    interviewPracticedIds: [],
    codingSolvedIds: [],
    portfolioCompleted: {},
    mockInterviewDone: false,
    resumeReady: false,
    githubReady: false,
    linkedinReady: false,
  };
}

type RoadmapsStore = RoadmapsUserState & {
  toggleNodeComplete: (slug: string, nodeId: string) => void;
  isNodeComplete: (slug: string, nodeId: string) => boolean;
  getRoadmapProgress: (slug: string) => RoadmapsUserState["progress"][string];
  toggleBookmark: (slug: string) => void;
  recordVisit: (slug: string) => void;
  addStudyMinutes: (minutes: number) => void;
  setQuizScore: (slug: string, nodeId: string, score: number) => void;
  setCareerGoal: (goal: string | null) => void;
  toggleFavoriteTech: (tech: string) => void;
  setDailyGoal: (minutes: number) => void;
  setWeeklyGoal: (minutes: number) => void;
  markInterviewPracticed: (slug: string, questionId: string) => void;
  markCodingSolved: (slug: string, problemId: string) => void;
  togglePortfolioItem: (slug: string, itemId: string) => void;
  setReadinessFlag: (slug: string, flag: "mockInterviewDone" | "resumeReady" | "githubReady" | "linkedinReady", value: boolean) => void;
};

export const useRoadmapsStore = create<RoadmapsStore>()(
  persist(
    (set, get) => ({
      progress: {},
      bookmarks: [],
      recentSlugs: [],
      dailyGoalMinutes: 60,
      weeklyGoalMinutes: 300,
      studyMinutesToday: 0,
      studyMinutesWeek: 0,
      streakDays: 0,
      lastStudyDate: null,
      favoriteTech: [],
      careerGoal: null,

      getRoadmapProgress: (slug) => ({ ...defaultProgress(), ...get().progress[slug] }),

      isNodeComplete: (slug, nodeId) =>
        get().progress[slug]?.completedNodeIds.includes(nodeId) ?? false,

      toggleNodeComplete: (slug, nodeId) =>
        set((s) => {
          const current = s.progress[slug] ?? defaultProgress();
          const completed = current.completedNodeIds.includes(nodeId)
            ? current.completedNodeIds.filter((id) => id !== nodeId)
            : [...current.completedNodeIds, nodeId];
          return {
            progress: {
              ...s.progress,
              [slug]: { ...current, completedNodeIds: completed, lastVisitedAt: new Date().toISOString() },
            },
          };
        }),

      toggleBookmark: (slug) =>
        set((s) => {
          const bookmarked = s.bookmarks.includes(slug);
          const bookmarks = bookmarked ? s.bookmarks.filter((b) => b !== slug) : [...s.bookmarks, slug];
          const progress = s.progress[slug] ?? defaultProgress();
          return {
            bookmarks,
            progress: { ...s.progress, [slug]: { ...progress, bookmarked: !bookmarked } },
          };
        }),

      recordVisit: (slug) =>
        set((s) => {
          const recent = [slug, ...s.recentSlugs.filter((r) => r !== slug)].slice(0, 8);
          const progress = s.progress[slug] ?? defaultProgress();
          return {
            recentSlugs: recent,
            progress: {
              ...s.progress,
              [slug]: { ...progress, lastVisitedAt: new Date().toISOString() },
            },
          };
        }),

      addStudyMinutes: (minutes) =>
        set((s) => {
          const today = todayKey();
          let streak = s.streakDays;
          if (s.lastStudyDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            streak = s.lastStudyDate === yesterday.toISOString().slice(0, 10) ? streak + 1 : 1;
          }
          return {
            studyMinutesToday: s.lastStudyDate === today ? s.studyMinutesToday + minutes : minutes,
            studyMinutesWeek: s.studyMinutesWeek + minutes,
            streakDays: streak,
            lastStudyDate: today,
          };
        }),

      setQuizScore: (slug, nodeId, score) =>
        set((s) => {
          const current = s.progress[slug] ?? defaultProgress();
          return {
            progress: {
              ...s.progress,
              [slug]: { ...current, quizScores: { ...current.quizScores, [nodeId]: score } },
            },
          };
        }),

      setCareerGoal: (goal) => set({ careerGoal: goal }),
      toggleFavoriteTech: (tech) =>
        set((s) => ({
          favoriteTech: s.favoriteTech.includes(tech)
            ? s.favoriteTech.filter((t) => t !== tech)
            : [...s.favoriteTech, tech],
        })),
      setDailyGoal: (minutes) => set({ dailyGoalMinutes: minutes }),
      setWeeklyGoal: (minutes) => set({ weeklyGoalMinutes: minutes }),

      markInterviewPracticed: (slug, questionId) =>
        set((s) => {
          const current = s.progress[slug] ?? defaultProgress();
          const ids = current.interviewPracticedIds.includes(questionId)
            ? current.interviewPracticedIds
            : [...current.interviewPracticedIds, questionId];
          return { progress: { ...s.progress, [slug]: { ...current, interviewPracticedIds: ids } } };
        }),

      markCodingSolved: (slug, problemId) =>
        set((s) => {
          const current = s.progress[slug] ?? defaultProgress();
          const ids = current.codingSolvedIds.includes(problemId)
            ? current.codingSolvedIds
            : [...current.codingSolvedIds, problemId];
          return { progress: { ...s.progress, [slug]: { ...current, codingSolvedIds: ids } } };
        }),

      togglePortfolioItem: (slug, itemId) =>
        set((s) => {
          const current = s.progress[slug] ?? defaultProgress();
          const portfolioCompleted = {
            ...current.portfolioCompleted,
            [itemId]: !current.portfolioCompleted[itemId],
          };
          return { progress: { ...s.progress, [slug]: { ...current, portfolioCompleted } } };
        }),

      setReadinessFlag: (slug, flag, value) =>
        set((s) => {
          const current = s.progress[slug] ?? defaultProgress();
          return { progress: { ...s.progress, [slug]: { ...current, [flag]: value } } };
        }),
    }),
    { name: "campusflow-roadmaps-v1" }
  )
);

export function getRoadmapCompletionPercent(slug: string, totalNodes: number): number {
  const state = useRoadmapsStore.getState();
  const completed = state.progress[slug]?.completedNodeIds.length ?? 0;
  if (!totalNodes) return 0;
  return Math.round((completed / totalNodes) * 100);
}
