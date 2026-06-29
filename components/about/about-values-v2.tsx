"use client";

import type { ReactNode } from "react";
import { Lightbulb, Award, Users, BookOpen, Code2, Shield, Wrench, Accessibility } from "lucide-react";
import { VALUE_KEYS } from "@/lib/about/constants";
import { useTranslation } from "@/lib/i18n/provider";
import { SectionLabel, SectionReveal } from "./about-motion";
import { cn } from "@/lib/utils";

const VALUE_ICONS = [Lightbulb, Award, Users, BookOpen, Code2, Shield, Wrench, Accessibility] as const;

const VALUE_GRADIENTS = [
  "from-amber-500/15 to-orange-500/5",
  "from-brand/15 to-violet-500/5",
  "from-emerald-500/15 to-green-500/5",
  "from-blue-500/15 to-cyan-500/5",
  "from-purple-500/15 to-pink-500/5",
  "from-slate-500/15 to-zinc-500/5",
  "from-indigo-500/15 to-blue-500/5",
  "from-teal-500/15 to-emerald-500/5",
] as const;

export function AboutValuesV2() {
  const { t } = useTranslation("about");

  return (
    <section className="py-24 sm:py-32 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal className="text-center mb-16">
          <SectionLabel>{t("values.label")}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">{t("values.title")}</h2>
        </SectionReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUE_KEYS.map((key, i) => {
            const Icon = VALUE_ICONS[i];
            return (
              <SectionReveal key={key} delay={i * 0.05}>
                <ValueCard i={i} gradient={VALUE_GRADIENTS[i]}>
                  <div className="w-12 h-12 rounded-2xl bg-background/80 border border-border/50 flex items-center justify-center mb-5 text-brand">
                    <Icon size={22} strokeWidth={1.5} aria-hidden />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{t(`values.items.${key}`)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(`values.descriptions.${key}`)}</p>
                </ValueCard>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ValueCard({ children, i, gradient }: { children: ReactNode; i: number; gradient: string }) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl p-6 h-full overflow-hidden",
        "border border-border/60 bg-card/60 backdrop-blur-xl",
        "hover:border-brand/25 hover:shadow-lg hover:shadow-brand/5 transition-all duration-500 hover:-translate-y-1"
      )}
      style={{ transitionDelay: `${i * 20}ms` }}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", gradient)} aria-hidden />
      <div className="relative">{children}</div>
    </div>
  );
}
