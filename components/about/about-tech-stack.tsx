"use client";

import { TECH_STACK } from "@/lib/about/constants";
import { useTranslation } from "@/lib/i18n/provider";
import { SectionLabel, SectionReveal } from "./about-motion";
import { cn } from "@/lib/utils";

export function AboutTechStack() {
  const { t } = useTranslation("about");

  return (
    <section className="py-24 sm:py-32 bg-muted/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal className="text-center mb-14">
          <SectionLabel>{t("tech.label")}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">{t("tech.title")}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t("tech.subtitle")}</p>
        </SectionReveal>

        <SectionReveal>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {TECH_STACK.map((tech, i) => (
              <div
                key={tech}
                className={cn(
                  "px-5 py-3 rounded-xl border border-border/60 bg-card/60 backdrop-blur",
                  "text-sm font-semibold text-foreground",
                  "hover:border-brand/30 hover:bg-brand/5 hover:-translate-y-0.5 transition-all duration-300",
                  "shadow-sm hover:shadow-md hover:shadow-brand/5"
                )}
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                {tech}
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
