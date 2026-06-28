"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ApplicationStatus,
  CareerActivity,
  JobApplication,
  MockInterviewResult,
  SavedJob,
  SkillProgress,
} from "./career/types";

interface CareerState {
  applications: JobApplication[];
  savedJobs: SavedJob[];
  favorites: string[];
  recent: string[];
  skillProgress: SkillProgress[];
  activities: CareerActivity[];
  mockResults: MockInterviewResult[];
  resumeScore: number;
  atsScore: number;

  addApplication: (app: Omit<JobApplication, "id">) => void;
  updateApplication: (id: string, data: Partial<JobApplication>) => void;
  removeApplication: (id: string) => void;
  addSavedJob: (job: Omit<SavedJob, "id" | "savedAt">) => void;
  removeSavedJob: (id: string) => void;
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  addRecent: (slug: string) => void;
  addActivity: (action: string, detail: string) => void;
  setResumeScore: (score: number) => void;
  setAtsScore: (score: number) => void;
  updateSkillProgress: (skill: string, progress: number, category: string) => void;
  addMockResult: (result: Omit<MockInterviewResult, "id" | "date">) => void;
  getStats: () => {
    totalApplications: number;
    interviews: number;
    offers: number;
    rejections: number;
    upcomingDeadlines: number;
  };
}

const uid = () => Math.random().toString(36).slice(2, 11);

const DEFAULT_SKILLS: SkillProgress[] = [
  { skill: "Data Structures", progress: 45, category: "Technical" },
  { skill: "System Design", progress: 20, category: "Technical" },
  { skill: "React / Next.js", progress: 60, category: "Frontend" },
  { skill: "Communication", progress: 70, category: "Soft Skills" },
  { skill: "Resume / ATS", progress: 55, category: "Career" },
];

export const useCareerStore = create<CareerState>()(
  persist(
    (set, get) => ({
      applications: [],
      savedJobs: [],
      favorites: [],
      recent: [],
      skillProgress: DEFAULT_SKILLS,
      activities: [],
      mockResults: [],
      resumeScore: 0,
      atsScore: 0,

      addApplication: (app) =>
        set((s) => ({
          applications: [{ ...app, id: uid() }, ...s.applications],
          activities: [
            { id: uid(), action: "Applied", detail: `${app.role} at ${app.company}`, timestamp: new Date().toISOString() },
            ...s.activities,
          ].slice(0, 30),
        })),

      updateApplication: (id, data) =>
        set((s) => ({
          applications: s.applications.map((a) => (a.id === id ? { ...a, ...data } : a)),
        })),

      removeApplication: (id) =>
        set((s) => ({ applications: s.applications.filter((a) => a.id !== id) })),

      addSavedJob: (job) =>
        set((s) => ({
          savedJobs: [{ ...job, id: uid(), savedAt: new Date().toISOString() }, ...s.savedJobs],
        })),

      removeSavedJob: (id) =>
        set((s) => ({ savedJobs: s.savedJobs.filter((j) => j.id !== id) })),

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

      addActivity: (action, detail) =>
        set((s) => ({
          activities: [
            { id: uid(), action, detail, timestamp: new Date().toISOString() },
            ...s.activities,
          ].slice(0, 30),
        })),

      setResumeScore: (score) => set({ resumeScore: score }),
      setAtsScore: (score) => set({ atsScore: score }),

      updateSkillProgress: (skill, progress, category) =>
        set((s) => {
          const exists = s.skillProgress.find((sk) => sk.skill === skill);
          if (exists) {
            return {
              skillProgress: s.skillProgress.map((sk) =>
                sk.skill === skill ? { ...sk, progress } : sk
              ),
            };
          }
          return { skillProgress: [...s.skillProgress, { skill, progress, category }] };
        }),

      addMockResult: (result) =>
        set((s) => ({
          mockResults: [
            { ...result, id: uid(), date: new Date().toISOString() },
            ...s.mockResults,
          ].slice(0, 20),
        })),

      getStats: () => {
        const apps = get().applications;
        const now = Date.now();
        const week = 7 * 24 * 60 * 60 * 1000;
        return {
          totalApplications: apps.length,
          interviews: apps.filter((a) =>
            ["interview", "technical", "hr-round"].includes(a.status)
          ).length,
          offers: apps.filter((a) => ["offer", "accepted"].includes(a.status)).length,
          rejections: apps.filter((a) => a.status === "rejected").length,
          upcomingDeadlines: apps.filter((a) => {
            if (!a.deadline) return false;
            const d = new Date(a.deadline).getTime();
            return d > now && d - now < week;
          }).length,
        };
      },
    }),
    { name: "campusflow-career" }
  )
);

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: "Applied",
  "under-review": "Under Review",
  interview: "Interview",
  technical: "Technical Round",
  "hr-round": "HR Round",
  offer: "Offer",
  rejected: "Rejected",
  accepted: "Accepted",
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  applied: "bg-blue-500/10 text-blue-600",
  "under-review": "bg-amber-500/10 text-amber-600",
  interview: "bg-violet-500/10 text-violet-600",
  technical: "bg-indigo-500/10 text-indigo-600",
  "hr-round": "bg-purple-500/10 text-purple-600",
  offer: "bg-emerald-500/10 text-emerald-600",
  rejected: "bg-red-500/10 text-red-600",
  accepted: "bg-green-500/10 text-green-700",
};
