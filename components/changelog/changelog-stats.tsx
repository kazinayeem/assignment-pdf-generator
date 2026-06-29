"use client";

import { motion } from "framer-motion";
import type { ChangelogStats } from "@/lib/changelog/types";
import { useTranslation } from "@/lib/i18n/provider";
import { AnimatedCounter } from "./changelog-motion";
import { cn } from "@/lib/utils";

const STAT_KEYS: (keyof ChangelogStats)[] = [
  "totalReleases",
  "totalFeatures",
  "bugFixes",
  "performanceImprovements",
  "contributors",
  "commits",
  "linesChanged",
  "roadmapsAdded",
  "devToolsAdded",
  "universitiesAdded",
  "interviewQuestionsAdded",
  "learningTopicsAdded",
];

export function ChangelogStatsBar({ stats }: { stats: ChangelogStats }) {
  const { t } = useTranslation("changelog");

  return (
    <section className="border-b border-border bg-muted/30">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">{t("stats.title")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {STAT_KEYS.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                "rounded-xl border border-border/60 bg-card/60 backdrop-blur p-4",
                "hover:border-brand/25 hover:shadow-md hover:shadow-brand/5 transition-all"
              )}
            >
              <p className="text-2xl font-extrabold text-foreground tabular-nums">
                <AnimatedCounter value={stats[key]} />
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">{t(`stats.${key}`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
