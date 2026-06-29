"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { AuroraBackground } from "./about-motion";
import { cn } from "@/lib/utils";

export function AboutCta() {
  const { t } = useTranslation("about");

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <AuroraBackground />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand/15 text-brand mb-6">
          <Sparkles size={28} aria-hidden />
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight mb-4">
          {t("cta.title")}
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">{t("cta.subtitle")}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/tools"
            className={cn(
              "inline-flex items-center gap-2 h-12 px-8 rounded-full",
              "bg-brand text-brand-foreground font-semibold text-sm",
              "hover:bg-brand/90 shadow-xl shadow-brand/25 transition-all hover:-translate-y-0.5"
            )}
          >
            {t("cta.startLearning")}
            <ArrowRight size={16} aria-hidden />
          </Link>
          <Link
            href="/roadmaps"
            className={cn(
              "inline-flex items-center gap-2 h-12 px-8 rounded-full",
              "border border-border bg-card/60 backdrop-blur font-semibold text-sm",
              "hover:bg-muted hover:border-brand/30 transition-all"
            )}
          >
            {t("cta.explorePlatform")}
          </Link>
        </div>
      </div>
    </section>
  );
}
