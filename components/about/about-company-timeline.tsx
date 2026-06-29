"use client";

import { COMPANY_TIMELINE } from "@/lib/about/constants";
import { useTranslation } from "@/lib/i18n/provider";
import { SectionLabel, SectionReveal } from "./about-motion";
import { cn } from "@/lib/utils";

export function AboutCompanyTimeline() {
  const { t } = useTranslation("about");

  return (
    <section className="py-24 sm:py-32 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal className="text-center mb-16">
          <SectionLabel>{t("timeline.label")}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">{t("timeline.title")}</h2>
        </SectionReveal>

        <div className="relative">
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand/40 to-transparent" aria-hidden />
          <div className="grid lg:grid-cols-4 gap-6 lg:gap-4">
            {COMPANY_TIMELINE.map((step, i) => (
              <SectionReveal key={step} delay={i * 0.06}>
                <div className="relative text-center lg:pt-12">
                  <div className="hidden lg:flex absolute top-5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-brand border-4 border-background shadow-lg shadow-brand/30 z-10" aria-hidden />
                  <div
                    className={cn(
                      "rounded-2xl p-5 border border-border/60 bg-card/50 backdrop-blur",
                      "hover:border-brand/30 hover:-translate-y-1 transition-all duration-300",
                      step === "future" && "border-dashed border-brand/30"
                    )}
                  >
                    {i === 0 && <span className="text-xs font-bold text-brand uppercase tracking-wider">2025</span>}
                    <h3 className="text-sm font-bold text-foreground mt-1">{t(`timeline.steps.${step}.title`)}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t(`timeline.steps.${step}.desc`)}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
