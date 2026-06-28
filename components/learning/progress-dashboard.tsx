"use client";

import { motion } from "framer-motion";
import { BookOpen, Trophy, Flame, Clock, Target, Award, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useExamStore } from "@/lib/exam-store";
import { useLearningStore } from "@/lib/learning-store";
import { ALL_SUBJECT_REGISTRIES } from "@/lib/learning/topics-registry";

export function ProgressDashboard() {
  const { examResults, getAverageScore, getStrongTopics, getWeakTopics, studyMinutes, studyStreak, achievements, certificates } = useExamStore();
  const { completedLessons } = useLearningStore();

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Learning Progress</h1>
        <p className="text-slate-500">Track your quizzes, exams, streaks, and achievements</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Lessons Completed", value: completedLessons.length, icon: BookOpen },
          { label: "Exams Taken", value: examResults.length, icon: Target },
          { label: "Average Score", value: `${getAverageScore()}%`, icon: TrendingUp },
          { label: "Study Streak", value: `${studyStreak} days`, icon: Flame },
          { label: "Study Hours", value: `${Math.round(studyMinutes / 60)}h`, icon: Clock },
          { label: "Certificates", value: certificates.length, icon: Award },
          { label: "Achievements", value: achievements.length, icon: Trophy },
          { label: "Passed Exams", value: examResults.filter((r) => r.passed).length, icon: Trophy },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass-card p-4 sm:p-5">
            <s.icon size={20} className="text-brand mb-2" />
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {ALL_SUBJECT_REGISTRIES.map((subject) => {
        const strong = getStrongTopics(subject.slug);
        const weak = getWeakTopics(subject.slug);
        const avg = getAverageScore(subject.slug);
        if (!strong.length && !weak.length && !avg) return null;
        return (
          <div key={subject.slug} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">{subject.title}</h3>
              <Link href={`/tools/exam/${subject.slug}`} className="text-sm text-brand hover:underline">Take Exam →</Link>
            </div>
            {avg > 0 && <p className="text-sm text-slate-500 mb-3">Average score: <strong>{avg}%</strong></p>}
            <div className="grid sm:grid-cols-2 gap-4">
              {strong.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase text-emerald-600 mb-2">Strong Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {strong.map((t) => <span key={t} className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs">{t}</span>)}
                  </div>
                </div>
              )}
              {weak.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase text-amber-600 mb-2">Weak Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {weak.map((t) => <span key={t} className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs">{t}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {achievements.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-4">Achievements & Badges</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {achievements.map((a) => (
              <div key={a.id} className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 text-center">
                <span className="text-2xl">{a.icon}</span>
                <p className="font-semibold text-sm mt-2">{a.title}</p>
                <p className="text-xs text-slate-400">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {examResults.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-4">Recent Exams</h3>
          <div className="space-y-2">
            {examResults.slice(0, 10).map((r) => (
              <div key={r.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-white/5 text-sm">
                <span className="capitalize">{r.subjectSlug} · {r.mode.replace(/-/g, " ")}</span>
                <span className={r.passed ? "text-emerald-600 font-bold" : "text-slate-500"}>{r.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
