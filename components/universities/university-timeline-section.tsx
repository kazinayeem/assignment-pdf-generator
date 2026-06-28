"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n/provider";
import { getUniversityTimeline } from "@/lib/universities/v3-data";
import type { University } from "@/lib/universities/types";
import { card, animation } from "@/lib/design-system";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  founded: "bg-brand",
  expansion: "bg-brand-accent",
  department: "bg-brand-secondary",
  research: "bg-success",
  award: "bg-warning",
  leadership: "bg-muted-foreground",
  milestone: "bg-brand",
  recognition: "bg-success",
};

export function UniversityTimelineSection({ university }: { university: University }) {
  const { t } = useTranslation("universities");
  const events = getUniversityTimeline(university);

  return (
    <div className={cn(card.base, "p-5 sm:p-6")}>
      <h3 className="font-bold text-foreground mb-6">{t("timeline.title")}</h3>
      <div className="relative pl-6 border-l-2 border-brand/20 space-y-6">
        {events.map((evt, i) => (
          <motion.div
            key={`${evt.year}-${evt.title}`}
            {...animation.fadeUp}
            {...animation.stagger(i)}
            className="relative"
          >
            <div className={cn("absolute -left-[25px] w-3 h-3 rounded-full border-2 border-background", CATEGORY_COLORS[evt.category] ?? "bg-brand")} />
            <div className="glass-card border border-border rounded-xl p-4 hover:border-brand/20 transition-colors">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-sm font-extrabold text-brand">{evt.year}</span>
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{t(`timeline.categories.${evt.category}`)}</span>
              </div>
              <h4 className="font-bold text-foreground mb-1">{evt.title}</h4>
              <p className="text-sm text-muted-foreground">{evt.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
