"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Star } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, button } from "@/lib/design-system";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/utils";

export function PricingSection() {
  const { t, tArray } = useTranslation("home");
  const features = tArray<string>("pricing.features");

  return (
    <section className={cn(spacing.section, "relative bg-background")}>
      <div className="blur-orb w-[400px] h-[400px] bg-brand/10 top-0 left-1/2 -translate-x-1/2" aria-hidden />
      <div className={cn(spacing.container, "relative max-w-2xl")}>
        <SectionHeader
          badge={t("pricing.badge")}
          title={t("pricing.title")}
          subtitle={t("pricing.subtitle")}
        />

        <motion.div
          {...animation.scaleIn}
          className="relative"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full gradient-primary text-brand-foreground text-sm font-bold shadow-lg">
              <Star size={14} className="fill-current" aria-hidden />
              {t("pricing.popular")}
            </span>
          </div>

          <div className="gradient-border rounded-3xl p-[2px] shadow-xl shadow-brand/10">
            <div className="rounded-[22px] bg-brand-dark p-8 sm:p-12 text-center text-foreground relative overflow-hidden">
              <div className="blur-orb w-[200px] h-[200px] bg-brand/20 top-0 right-0" aria-hidden />
              <div className="blur-orb w-[200px] h-[200px] bg-brand-accent/15 bottom-0 left-0" aria-hidden />

              <div className="relative z-10">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {t("pricing.plan")}
                </p>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-5xl sm:text-6xl font-extrabold text-foreground">
                    {t("pricing.price")}
                  </span>
                  <span className="text-lg text-muted-foreground">/ {t("pricing.period")}</span>
                </div>
                <p className="text-base text-muted-foreground mb-10">
                  {t("pricing.noCard")}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto mb-10 text-left">
                  {features.map((feature, i) => (
                    <motion.div
                      key={feature}
                      {...animation.fadeUp}
                      {...animation.stagger(i)}
                      className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 rounded-xl px-4 py-3 border border-border"
                    >
                      <CheckCircle size={18} className="text-success shrink-0" aria-hidden />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <Link
                  href="/login"
                  className={cn(button.primary, "inline-flex items-center justify-center w-full sm:w-auto")}
                >
                  {t("pricing.cta")}
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
