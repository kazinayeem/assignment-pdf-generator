"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Achievement, Certificate, ExamResult, LeaderboardEntry, QuizDifficulty } from "./learning/types";

interface ExamState {
  examResults: ExamResult[];
  seenQuestionIds: string[];
  certificates: Certificate[];
  achievements: Achievement[];
  studyMinutes: number;
  studyStreak: number;
  lastStudyDate: string;
  topicScores: Record<string, { correct: number; total: number; attempts: number }>;
  studentName: string;

  recordExam: (result: Omit<ExamResult, "id" | "completedAt">) => ExamResult;
  markQuestionsSeen: (ids: string[]) => void;
  addStudyMinutes: (minutes: number) => void;
  setStudentName: (name: string) => void;
  issueCertificate: (cert: Omit<Certificate, "id" | "issuedAt">) => Certificate;
  unlockAchievement: (achievement: Omit<Achievement, "unlockedAt">) => void;
  getAverageScore: (subjectSlug?: string) => number;
  getStrongTopics: (subjectSlug: string) => string[];
  getWeakTopics: (subjectSlug: string) => string[];
  getLeaderboard: (scope: "global" | "weekly" | "monthly") => LeaderboardEntry[];
}

const uid = () => Math.random().toString(36).slice(2, 11);

const DEFAULT_ACHIEVEMENTS: Omit<Achievement, "unlockedAt">[] = [
  { id: "first-quiz", title: "First Steps", description: "Complete your first quiz", icon: "🎯" },
  { id: "streak-7", title: "Week Warrior", description: "7-day study streak", icon: "🔥" },
  { id: "perfect-score", title: "Perfect Score", description: "Score 100% on any exam", icon: "💯" },
  { id: "os-master", title: "OS Scholar", description: "Pass OS final assessment", icon: "🖥️" },
  { id: "certified", title: "Certified Learner", description: "Earn your first certificate", icon: "📜" },
];

const DEMO_LEADERBOARD: LeaderboardEntry[] = [
  { id: "1", name: "Aisha Rahman", score: 2840, examsTaken: 42, streak: 12, university: "BUET", department: "CSE" },
  { id: "2", name: "Karim Hassan", score: 2650, examsTaken: 38, streak: 8, university: "NSU", department: "CSE" },
  { id: "3", name: "Fatima Khan", score: 2480, examsTaken: 35, streak: 15, university: "IUT", department: "SWE" },
  { id: "4", name: "Rafi Ahmed", score: 2310, examsTaken: 30, streak: 5, university: "DU", department: "CSE" },
  { id: "5", name: "Nadia Islam", score: 2180, examsTaken: 28, streak: 9, university: "BRAC", department: "CSE" },
];

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      examResults: [],
      seenQuestionIds: [],
      certificates: [],
      achievements: [],
      studyMinutes: 0,
      studyStreak: 0,
      lastStudyDate: "",
      topicScores: {},
      studentName: "Student",

      recordExam: (result) => {
        const full: ExamResult = { ...result, id: uid(), completedAt: new Date().toISOString() };
        set((s) => {
          const today = new Date().toISOString().split("T")[0];
          const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
          let streak = s.studyStreak;
          if (s.lastStudyDate === today) streak = streak;
          else if (s.lastStudyDate === yesterday) streak = streak + 1;
          else streak = 1;

          const topicScores = { ...s.topicScores };
          Object.entries(result.topicBreakdown).forEach(([topic, data]) => {
            const key = `${result.subjectSlug}:${topic}`;
            const prev = topicScores[key] ?? { correct: 0, total: 0, attempts: 0 };
            topicScores[key] = {
              correct: prev.correct + (data as { correct: number; total: number }).correct,
              total: prev.total + (data as { correct: number; total: number }).total,
              attempts: prev.attempts + 1,
            };
          });

          return {
            examResults: [full, ...s.examResults].slice(0, 100),
            studyStreak: streak,
            lastStudyDate: today,
            topicScores,
          };
        });

        if (full.percentage === 100) get().unlockAchievement(DEFAULT_ACHIEVEMENTS[2]);
        if (get().examResults.length === 1) get().unlockAchievement(DEFAULT_ACHIEVEMENTS[0]);
        if (full.passed && full.mode === "final-assessment" && full.subjectSlug === "os") {
          get().unlockAchievement(DEFAULT_ACHIEVEMENTS[3]);
        }

        return full;
      },

      markQuestionsSeen: (ids) =>
        set((s) => ({
          seenQuestionIds: [...new Set([...s.seenQuestionIds, ...ids])].slice(-500),
        })),

      addStudyMinutes: (minutes) => {
        set((s) => ({ studyMinutes: s.studyMinutes + minutes }));
        const streak = get().studyStreak;
        if (streak >= 7) get().unlockAchievement(DEFAULT_ACHIEVEMENTS[1]);
      },

      setStudentName: (name) => set({ studentName: name }),

      issueCertificate: (cert) => {
        const full: Certificate = { ...cert, id: `CF-${uid().toUpperCase()}`, issuedAt: new Date().toISOString() };
        set((s) => ({ certificates: [full, ...s.certificates] }));
        get().unlockAchievement(DEFAULT_ACHIEVEMENTS[4]);
        return full;
      },

      unlockAchievement: (achievement) =>
        set((s) => {
          if (s.achievements.some((a) => a.id === achievement.id)) return s;
          return {
            achievements: [...s.achievements, { ...achievement, unlockedAt: new Date().toISOString() }],
          };
        }),

      getAverageScore: (subjectSlug) => {
        const results = get().examResults.filter((r) => !subjectSlug || r.subjectSlug === subjectSlug);
        if (!results.length) return 0;
        return Math.round(results.reduce((a, r) => a + r.percentage, 0) / results.length);
      },

      getStrongTopics: (subjectSlug) => {
        const scores = get().topicScores;
        return Object.entries(scores)
          .filter(([k]) => k.startsWith(`${subjectSlug}:`))
          .map(([k, v]) => ({ topic: k.split(":")[1], rate: v.total > 0 ? v.correct / v.total : 0 }))
          .filter((t) => t.rate >= 0.7)
          .sort((a, b) => b.rate - a.rate)
          .slice(0, 5)
          .map((t) => t.topic);
      },

      getWeakTopics: (subjectSlug) => {
        const scores = get().topicScores;
        return Object.entries(scores)
          .filter(([k]) => k.startsWith(`${subjectSlug}:`))
          .map(([k, v]) => ({ topic: k.split(":")[1], rate: v.total > 0 ? v.correct / v.total : 0 }))
          .filter((t) => t.rate < 0.5 && t.rate > 0)
          .sort((a, b) => a.rate - b.rate)
          .slice(0, 5)
          .map((t) => t.topic);
      },

      getLeaderboard: (scope) => {
        const userScore = get().examResults.reduce((a, r) => a + r.percentage * 10, 0);
        const user: LeaderboardEntry = {
          id: "you",
          name: get().studentName,
          score: userScore,
          examsTaken: get().examResults.length,
          streak: get().studyStreak,
        };
        const board = [...DEMO_LEADERBOARD];
        if (scope === "weekly") return board.map((e, i) => ({ ...e, score: Math.round(e.score * (0.2 + i * 0.05)) }));
        if (scope === "monthly") return board;
        return [user, ...board].sort((a, b) => b.score - a.score);
      },
    }),
    { name: "campusflow-exam" }
  )
);

export const QUIZ_DIFFICULTIES: { id: QuizDifficulty | "all"; label: string }[] = [
  { id: "all", label: "All Levels" },
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
  { id: "expert", label: "Expert" },
];
