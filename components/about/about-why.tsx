"use client";

import { Check, X } from "lucide-react";
import { COMPARISON_ROWS } from "@/lib/about/constants";
import { useTranslation } from "@/lib/i18n/provider";
import { SectionLabel, SectionReveal } from "./about-motion";
import { cn } from "@/lib/utils";

export function AboutWhy() {
  const { t } = useTranslation("about");

  return (
    <section className="py-24 sm:py-32 bg-muted/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal className="text-center mb-16">
          <SectionLabel>{t("why.label")}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">{t("why.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("why.subtitle")}</p>
        </SectionReveal>

        <SectionReveal>
          <div className="rounded-3xl border border-border/60 bg-card/50 backdrop-blur-xl overflow-hidden shadow-xl shadow-brand/5">
            <div className="grid grid-cols-3 border-b border-border/60 bg-muted/30">
              <div className="p-4 sm:p-6" />
              <div className="p-4 sm:p-6 text-center border-x border-border/60">
                <p className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">{t("why.traditional")}</p>
              </div>
              <div className="p-4 sm:p-6 text-center bg-brand/5">
                <p className="text-xs sm:text-sm font-bold text-brand uppercase tracking-wider">{t("why.bornoflow")}</p>
              </div>
            </div>
            {COMPARISON_ROWS.map((row, i) => (
              <div
                key={row}
                className={cn(
                  "grid grid-cols-3 border-b border-border/40 last:border-0",
                  i % 2 === 0 ? "bg-transparent" : "bg-muted/10"
                )}
              >
                <div className="p-4 sm:p-5 flex items-center">
                  <span className="text-sm font-medium text-foreground">{t(`why.rows.${row}.label`)}</span>
                </div>
                <div className="p-4 sm:p-5 border-x border-border/40 flex items-center justify-center gap-2">
                  <X size={16} className="text-destructive/70 shrink-0" aria-hidden />
                  <span className="text-xs sm:text-sm text-muted-foreground text-center">{t(`why.rows.${row}.traditional`)}</span>
                </div>
                <div className="p-4 sm:p-5 flex items-center justify-center gap-2 bg-brand/[0.03]">
                  <Check size={16} className="text-success shrink-0" aria-hidden />
                  <span className="text-xs sm:text-sm text-foreground font-medium text-center">{t(`why.rows.${row}.bornoflow`)}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
