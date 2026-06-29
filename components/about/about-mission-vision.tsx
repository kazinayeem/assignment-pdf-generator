"use client";

import { Target, Rocket } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { SectionLabel, SectionReveal } from "./about-motion";
import { cn } from "@/lib/utils";

export function AboutMissionVision() {
  const { t } = useTranslation("about");

  const cards = [
    { key: "mission", icon: Rocket, gradient: "from-violet-500/20 via-brand/10 to-transparent", iconBg: "bg-brand/15 text-brand" },
    { key: "vision", icon: Target, gradient: "from-indigo-500/20 via-blue-500/10 to-transparent", iconBg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400" },
  ] as const;

  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal className="text-center mb-16">
          <SectionLabel>{t("missionVision.label")}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">{t("missionVision.title")}</h2>
        </SectionReveal>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {cards.map(({ key, icon: Icon, gradient, iconBg }, i) => (
            <SectionReveal key={key} delay={i * 0.1}>
              <div
                className={cn(
                  "relative rounded-3xl p-8 sm:p-10 lg:p-12 min-h-[320px] flex flex-col",
                  "border border-border/60 bg-card/40 backdrop-blur-xl overflow-hidden",
                  "hover:shadow-2xl hover:shadow-brand/5 transition-shadow duration-500"
                )}
              >
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", gradient)} aria-hidden />
                <div className={cn("relative w-14 h-14 rounded-2xl flex items-center justify-center mb-8", iconBg)}>
                  <Icon size={28} strokeWidth={1.5} aria-hidden />
                </div>
                <h3 className="relative text-2xl sm:text-3xl font-extrabold text-foreground mb-4 tracking-tight">
                  {t(`${key}.title`)}
                </h3>
                <p className="relative text-base text-muted-foreground leading-relaxed flex-1">{t(`${key}.body`)}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
