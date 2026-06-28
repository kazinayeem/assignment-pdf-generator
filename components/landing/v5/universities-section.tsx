"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, card, sectionBg } from "@/lib/design-system";
import { SectionHeader } from "../v4/section-header";
import { cn } from "@/lib/utils";

const SLUG_MAP: Record<string, string> = {
  DIU: "diu",
  BRAC: "brac-university",
  NSU: "nsu",
  AIUB: "aiub",
  EWU: "ewu",
  UIU: "uiu",
  IUB: "iub",
  RUET: "ruet",
  KUET: "kuet",
  CUET: "cuet",
  SUST: "sust",
  BUET: "buet",
};

export function UniversitiesSection() {
  const { t, tArray } = useTranslation("v5");
  const universities = tArray<string>("universityList");

  return (
    <section className={cn(spacing.section, sectionBg.surface, "relative border-y border-border")}>
      <div className={cn(spacing.container, "relative")}>
        <SectionHeader
          badge={t("universities.badge")}
          title={t("universities.title")}
          subtitle={t("universities.subtitle")}
        />
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {universities.map((uni, i) => {
            const slug = SLUG_MAP[uni];
            const href = slug ? `/universities/${slug}` : "/universities";
            return (
              <motion.div
                key={uni}
                {...animation.fadeUp}
                {...animation.stagger(i % 12)}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <Link
                  href={href}
                  className={cn(
                    card.base,
                    "px-5 sm:px-6 py-3 sm:py-4 min-h-[44px] flex items-center justify-center",
                    "grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/10",
                    "transition-all duration-300"
                  )}
                >
                  <span className="text-sm sm:text-base font-bold text-foreground tracking-wide">{uni}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/universities" className="text-sm font-semibold text-brand hover:underline underline-offset-4">
            Explore all universities →
          </Link>
        </div>
      </div>
    </section>
  );
}
