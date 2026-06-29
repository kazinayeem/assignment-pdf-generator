"use client";

import { ABOUT_STATS } from "@/lib/about/constants";
import { useTranslation } from "@/lib/i18n/provider";
import { AnimatedCounter, SectionLabel, SectionReveal } from "./about-motion";
import { cn } from "@/lib/utils";

export function AboutStats() {
  const { t } = useTranslation("about");

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-brand/[0.02] to-background pointer-events-none" aria-hidden />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionReveal className="text-center mb-14">
          <SectionLabel>{t("stats.label")}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">{t("stats.title")}</h2>
        </SectionReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {ABOUT_STATS.map((stat, i) => (
            <SectionReveal key={stat.key} delay={i * 0.05}>
              <div
                className={cn(
                  "group relative rounded-2xl p-6 sm:p-8 text-center overflow-hidden",
                  "border border-border/60 bg-card/50 backdrop-blur-xl",
                  "hover:border-brand/30 hover:shadow-xl hover:shadow-brand/5 transition-all duration-500 hover:-translate-y-1"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
                <p className="text-3xl sm:text-4xl font-extrabold text-foreground tabular-nums relative">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-muted-foreground mt-2 font-medium relative">{t(`stats.items.${stat.key}`)}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
