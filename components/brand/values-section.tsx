"use client";

import { Heart, Lightbulb, BookOpen, BookMarked, Wrench, Users, Handshake, TrendingUp, Accessibility } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

const VALUE_ICONS = [
  Lightbulb,
  BookOpen,
  BookMarked,
  Wrench,
  Users,
  Handshake,
  TrendingUp,
  Accessibility,
] as const;

const VALUE_KEYS = [
  "innovation",
  "learning",
  "knowledge",
  "engineering",
  "community",
  "collaboration",
  "scalability",
  "accessibility",
] as const;

export function ValuesSection() {
  const { t } = useTranslation("about");

  return (
    <section id="values" className="mb-10 scroll-mt-24">
      <h3 className="text-xl font-bold text-foreground mb-6">{t("values.title")}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {VALUE_KEYS.map((key, i) => {
          const Icon = VALUE_ICONS[i] ?? Heart;
          return (
            <div
              key={key}
              className={cn(
                "group flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl",
                "border border-border/60 bg-muted/30 dark:bg-muted/20",
                "hover:border-brand/30 hover:bg-brand/5 transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-md hover:shadow-brand/5"
              )}
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-brand/10 text-brand mb-3 group-hover:bg-brand/15 transition-colors">
                <Icon size={18} aria-hidden />
              </div>
              <p className="text-sm font-semibold text-foreground">{t(`values.items.${key}`)}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
