"use client";

import { STORY_STEPS } from "@/lib/about/constants";
import { useTranslation } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import { SectionLabel, SectionReveal } from "./about-motion";

export function AboutStory() {
  const { t } = useTranslation("about");

  return (
    <section className="py-24 sm:py-32 bg-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal className="text-center mb-16">
          <SectionLabel>{t("story.label")}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">{t("story.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">{t("story.intro")}</p>
        </SectionReveal>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand/50 via-brand/20 to-transparent -translate-x-1/2 hidden sm:block" aria-hidden />
          <div className="space-y-0">
            {STORY_STEPS.map((step, i) => (
              <SectionReveal key={step} delay={i * 0.08}>
                <div className={cn("relative flex flex-col sm:flex-row items-center gap-4 sm:gap-8 py-8", i % 2 === 1 ? "sm:flex-row-reverse" : "")}>
                  <div className="sm:w-1/2 sm:text-right" style={i % 2 === 1 ? { textAlign: "left" } : undefined}>
                    {i === 0 && (
                      <span className="text-4xl font-extrabold text-brand/30 block mb-1">2025</span>
                    )}
                    <h3 className="text-lg font-bold text-foreground">{t(`story.steps.${step}.title`)}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{t(`story.steps.${step}.desc`)}</p>
                  </div>
                  <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-brand text-brand-foreground text-sm font-bold shadow-lg shadow-brand/30 shrink-0">
                    {i + 1}
                  </div>
                  <div className="sm:w-1/2 hidden sm:block" />
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
