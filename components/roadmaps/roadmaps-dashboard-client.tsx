"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, Bookmark, Clock, Flame, Target, TrendingUp, Award, Activity,
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, card, badge } from "@/lib/design-system";
import { ROADMAP_DEFINITIONS } from "@/lib/roadmaps";
import { useRoadmapsStore, getRoadmapCompletionPercent } from "@/lib/roadmaps/store";
import { cn } from "@/lib/utils";

export function RoadmapsDashboardClient() {
  const { t } = useTranslation("roadmaps");
  const {
    progress,
    bookmarks,
    recentSlugs,
    dailyGoalMinutes,
    weeklyGoalMinutes,
    studyMinutesToday,
    studyMinutesWeek,
    streakDays,
    setCareerGoal,
    careerGoal,
  } = useRoadmapsStore();

  const stats = useMemo(() => {
    let topicsCompleted = 0;
    let totalQuiz = 0;
    let quizSum = 0;
    for (const p of Object.values(progress)) {
      topicsCompleted += p.completedNodeIds.length;
      for (const score of Object.values(p.quizScores)) {
        totalQuiz++;
        quizSum += score;
      }
    }
    return {
      topicsCompleted,
      avgQuiz: totalQuiz ? Math.round(quizSum / totalQuiz) : 0,
      activeRoadmaps: Object.keys(progress).filter((s) => (progress[s]?.completedNodeIds.length ?? 0) > 0).length,
    };
  }, [progress]);

  const inProgress = useMemo(
    () =>
      ROADMAP_DEFINITIONS.filter((r) => {
        const completed = progress[r.slug]?.completedNodeIds.length ?? 0;
        const pct = r.nodeDefs.length ? Math.round((completed / r.nodeDefs.length) * 100) : 0;
        return pct > 0 && pct < 100;
      }).slice(0, 6),
    [progress]
  );

  return (
    <div className={cn(spacing.container, "py-8 sm:py-12 max-w-[1400px]")}>
      <motion.div {...animation.fadeUp} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Target, label: t("dashboard.topicsDone"), value: stats.topicsCompleted },
          { icon: BarChart3, label: t("dashboard.quizScore"), value: `${stats.avgQuiz}%` },
          { icon: Flame, label: t("dashboard.streak"), value: `${streakDays}d` },
          { icon: Clock, label: t("dashboard.studyToday"), value: `${studyMinutesToday}m` },
        ].map((s) => (
          <div key={s.label} className={cn(card.base, "p-4")}>
            <s.icon size={18} className="text-brand mb-2" />
            <p className="text-[10px] uppercase font-bold text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className={cn(card.base, "p-5")}>
          <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-brand" />
            {t("dashboard.goals")}
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{t("dashboard.dailyGoal")}</span>
                <span>{studyMinutesToday}/{dailyGoalMinutes} min</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full"
                  style={{ width: `${Math.min(100, (studyMinutesToday / dailyGoalMinutes) * 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{t("dashboard.weeklyGoal")}</span>
                <span>{studyMinutesWeek}/{weeklyGoalMinutes} min</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-brand-accent rounded-full"
                  style={{ width: `${Math.min(100, (studyMinutesWeek / weeklyGoalMinutes) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={cn(card.base, "p-5")}>
          <h2 className="text-sm font-bold mb-3">{t("dashboard.careerGoal")}</h2>
          <input
            type="text"
            value={careerGoal ?? ""}
            onChange={(e) => setCareerGoal(e.target.value || null)}
            placeholder={t("dashboard.careerGoalPlaceholder")}
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm mb-3"
          />
          <p className="text-xs text-muted-foreground">{t("dashboard.careerGoalHint")}</p>
        </div>
      </div>

      {inProgress.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Activity size={18} />
            {t("dashboard.continue")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {inProgress.map((r) => {
              const pct = getRoadmapCompletionPercent(r.slug, r.nodeDefs.length);
              return (
                <Link key={r.slug} href={`/roadmaps/${r.slug}`} className={cn(card.base, card.hover, "p-4 block")}>
                  <p className="font-bold text-sm mb-2">{r.title}</p>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-brand rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{pct}% complete</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <section className={cn(card.base, "p-5")}>
          <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Bookmark size={16} />
            {t("dashboard.bookmarks")}
          </h2>
          {bookmarks.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("dashboard.noBookmarks")}</p>
          ) : (
            <ul className="space-y-2">
              {bookmarks.map((slug) => {
                const r = ROADMAP_DEFINITIONS.find((x) => x.slug === slug);
                if (!r) return null;
                return (
                  <li key={slug}>
                    <Link href={`/roadmaps/${slug}`} className="text-sm font-medium text-brand hover:underline">
                      {r.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className={cn(card.base, "p-5")}>
          <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Award size={16} />
            {t("dashboard.recent")}
          </h2>
          {recentSlugs.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("dashboard.noRecent")}</p>
          ) : (
            <ul className="space-y-2">
              {recentSlugs.map((slug) => {
                const r = ROADMAP_DEFINITIONS.find((x) => x.slug === slug);
                if (!r) return null;
                return (
                  <li key={slug} className="flex items-center justify-between">
                    <Link href={`/roadmaps/${slug}`} className="text-sm font-medium text-brand hover:underline">
                      {r.title}
                    </Link>
                    <span className={badge.muted}>
                      {getRoadmapCompletionPercent(slug, r.nodeDefs.length)}%
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
