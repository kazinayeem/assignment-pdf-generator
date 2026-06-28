"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, card } from "@/lib/design-system";
import { SectionHeader } from "../v4/section-header";
import { cn } from "@/lib/utils";

export function UniversitiesSection() {
  const { t, tArray } = useTranslation("v5");
  const universities = tArray<string>("universityList");

  return (
    <section className={cn(spacing.section, "relative bg-background border-y border-border")}>
      <div className={cn(spacing.container, "relative")}>
        <SectionHeader
          badge={t("universities.badge")}
          title={t("universities.title")}
          subtitle={t("universities.subtitle")}
        />
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {universities.map((uni, i) => (
            <motion.div
              key={uni}
              {...animation.fadeUp}
              {...animation.stagger(i % 12)}
              whileHover={{ scale: 1.05, y: -2 }}
              className={cn(
                card.base,
                "px-5 sm:px-6 py-3 sm:py-4 min-h-[44px] flex items-center justify-center",
                "grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/10",
                "transition-all duration-300 cursor-default"
              )}
            >
              <span className="text-sm sm:text-base font-bold text-foreground tracking-wide">{uni}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
