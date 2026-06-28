"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, Target, Send, TrendingUp, BookOpen, Bell } from "lucide-react";
import { CareerPageHeader } from "./career-page-header";
import { useCareerStore } from "@/lib/career-store";

export function AnalyticsClient() {
  const { resumeScore, atsScore, skillProgress, getStats, mockResults, applications } = useCareerStore();
  const stats = getStats();

  const interviewReadiness = useMemo(() => {
    const avgMock = mockResults.length ? mockResults.reduce((a, r) => a + r.score, 0) / mockResults.length : 0;
    const avgSkill = skillProgress.reduce((a, s) => a + s.progress, 0) / (skillProgress.length || 1);
    return Math.round(avgMock * 0.5 + avgSkill * 0.5);
  }, [mockResults, skillProgress]);

  const successRate = stats.totalApplications > 0
    ? Math.round((stats.interviews / stats.totalApplications) * 100)
    : 0;

  const offerRate = stats.totalApplications > 0
    ? Math.round((stats.offers / stats.totalApplications) * 100)
    : 0;

  const metrics = [
    { label: "Resume Score", value: resumeScore || "—", suffix: resumeScore ? "/100" : "", icon: Target, color: "from-[#6D5DF6] to-[#8B5CF6]" },
    { label: "ATS Score", value: atsScore || "—", suffix: atsScore ? "/100" : "", icon: BarChart3, color: "from-[#F59E0B] to-[#EF4444]" },
    { label: "Interview Readiness", value: interviewReadiness, suffix: "%", icon: BookOpen, color: "from-[#10B981] to-[#06B6D4]" },
    { label: "Applications Sent", value: stats.totalApplications, suffix: "", icon: Send, color: "from-[#06B6D4] to-[#3B82F6]" },
    { label: "Interview Success Rate", value: successRate, suffix: "%", icon: TrendingUp, color: "from-[#8B5CF6] to-[#6D5DF6]" },
    { label: "Offer Rate", value: offerRate, suffix: "%", icon: TrendingUp, color: "from-[#10B981] to-[#34D399]" },
  ];

  const notifications = useMemo(() => {
    const items: string[] = [];
    if (stats.upcomingDeadlines > 0) items.push(`${stats.upcomingDeadlines} application deadline(s) this week`);
    if (resumeScore < 70 && resumeScore > 0) items.push("Resume score below 70 — consider improvements");
    if (atsScore < 70 && atsScore > 0) items.push("ATS score below 70 — run ATS checker for suggestions");
    if (interviewReadiness < 50) items.push("Interview readiness low — try mock interviews");
    const upcoming = applications.filter((a) => a.interviewDate);
    if (upcoming.length) items.push(`${upcoming.length} upcoming interview(s)`);
    if (items.length === 0) items.push("You're on track! Keep building skills and applying.");
    return items;
  }, [stats, resumeScore, atsScore, interviewReadiness, applications]);

  return (
    <div>
      <CareerPageHeader title="Career Analytics" description="Track resume scores, application metrics, interview readiness, and skill progress." icon={BarChart3} badge="Performance Dashboard" />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {metrics.map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">{m.label}</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                    {m.value}<span className="text-base text-slate-400">{m.suffix}</span>
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                  <m.icon size={18} className="text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="font-bold text-lg mb-4">Skill Progress</h3>
            <div className="space-y-4">
              {skillProgress.map((s) => (
                <div key={s.skill}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-300">{s.skill}</span>
                    <span className="text-slate-400 tabular-nums">{s.progress}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.progress}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-[#6D5DF6] to-[#06B6D4]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Bell size={18} className="text-[#6D5DF6]" /> Notifications</h3>
            <ul className="space-y-3">
              {notifications.map((n) => (
                <li key={n} className="text-sm p-3 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300">{n}</li>
              ))}
            </ul>
          </div>
        </div>

        {mockResults.length > 0 && (
          <div className="glass-card p-6">
            <h3 className="font-bold text-lg mb-4">Mock Interview History</h3>
            <div className="space-y-2">
              {mockResults.slice(0, 10).map((r) => (
                <div key={r.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-white/5 text-sm">
                  <span className="capitalize">{r.category} · {r.questionsAnswered} questions</span>
                  <span className="font-bold text-[#6D5DF6]">{r.score}/100</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
