"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Rocket, Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, card, badge } from "@/lib/design-system";
import { SectionHeader } from "../v4/section-header";
import { cn } from "@/lib/utils";

type RoadmapItem = { title: string; status: string; quarter: string };

const STATUS_ICON: Record<string, typeof CheckCircle2> = {
  completed: CheckCircle2,
  inProgress: Clock,
  planned: Circle,
  comingSoon: Sparkles,
  future: Rocket,
};

const STATUS_STYLE: Record<string, string> = {
  completed: "text-success bg-success/10 border-success/20",
  inProgress: "text-brand bg-brand/10 border-brand/20",
  planned: "text-muted-foreground bg-muted border-border",
  comingSoon: "text-warning bg-warning/10 border-warning/20",
  future: "text-brand-accent bg-brand-accent/10 border-brand-accent/20",
};

export function RoadmapSection() {
  const { t, tArray } = useTranslation("v5");
  const items = tArray<RoadmapItem>("roadmap.items");

  return (
    <section id="roadmap" className={cn(spacing.section, "relative bg-surface-page")}>
      <div className={cn(spacing.container, "relative")}>
        <SectionHeader
          badge={t("roadmap.badge")}
          title={t("roadmap.title")}
          subtitle={t("roadmap.subtitle")}
        />

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden sm:block" aria-hidden />
          <div className="space-y-4">
            {items.map((item, i) => {
              const Icon = STATUS_ICON[item.status] ?? Circle;
              const style = STATUS_STYLE[item.status] ?? STATUS_STYLE.planned;
              return (
                <motion.div
                  key={item.title}
                  {...animation.fadeUp}
                  {...animation.stagger(i)}
                  className="relative sm:pl-16"
                >
                  <div
                    className={cn(
                      "hidden sm:flex absolute left-3 top-5 w-6 h-6 rounded-full border-2 items-center justify-center bg-background",
                      style
                    )}
                    aria-hidden
                  >
                    <Icon size={12} />
                  </div>
                  <div className={cn(card.base, "p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3")}>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{item.quarter}</p>
                    </div>
                    <span className={cn(badge.muted, "self-start sm:self-center border", style)}>
                      <Icon size={12} aria-hidden />
                      {t(`roadmap.status.${item.status}`)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
