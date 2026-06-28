"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Star, Sparkles, Shield, ArrowRight, BadgeCheck } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, button, badge, sectionBg } from "@/lib/design-system";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/utils";

export function PricingSection() {
  const { t, tArray } = useTranslation("home");
  const features = tArray<string>("pricing.features");

  return (
    <section className={cn(spacing.section, sectionBg.elevated, "relative")}>
      <div className="blur-orb w-[500px] h-[500px] bg-brand/8 top-0 left-1/2 -translate-x-1/2" aria-hidden />
      <div className={cn(spacing.container, "relative max-w-3xl")}>
        <SectionHeader
          badge={t("pricing.badge")}
          title={t("pricing.title")}
          subtitle={t("pricing.subtitle")}
        />

        <motion.div {...animation.scaleIn} className="relative">
          {/* Badges */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10 flex flex-col sm:flex-row items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full gradient-primary text-brand-foreground text-sm font-bold shadow-lg shadow-brand/30">
              <Star size={14} className="fill-current" aria-hidden />
              {t("pricing.popular")}
            </span>
            <span className={cn(badge.success, "shadow-sm")}>
              <BadgeCheck size={12} aria-hidden />
              Free Forever
            </span>
          </div>

          {/* Animated glow ring */}
          <div className="relative rounded-3xl p-[2px] overflow-hidden">
            <motion.div
              className="absolute inset-0 gradient-primary opacity-80"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            />
            <div className="relative rounded-[22px] bg-brand-dark p-8 sm:p-12 text-center overflow-hidden">
              <div className="blur-orb w-[220px] h-[220px] bg-brand/25 top-0 right-0" aria-hidden />
              <div className="blur-orb w-[180px] h-[180px] bg-brand-accent/20 bottom-0 left-0" aria-hidden />
              <div className="absolute inset-0 bg-[radial-gradient(rgba(109,93,246,0.08)_1px,transparent_1px)] bg-[length:20px_20px]" aria-hidden />

              <div className="relative z-10">
                <p className="text-sm font-semibold text-brand-accent mb-2 tracking-wide uppercase">
                  {t("pricing.plan")}
                </p>
                <div className="flex items-baseline justify-center gap-2 mb-1">
                  <span className="text-5xl sm:text-7xl font-extrabold text-foreground tracking-tight">
                    {t("pricing.price")}
                  </span>
                  <span className="text-lg text-muted-foreground font-medium">/ {t("pricing.period")}</span>
                </div>
                <p className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-8">
                  <Shield size={14} className="text-success" aria-hidden />
                  {t("pricing.noCard")}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-xl mx-auto mb-8 text-left">
                  {features.map((feature, i) => (
                    <motion.div
                      key={feature}
                      {...animation.fadeUp}
                      {...animation.stagger(i)}
                      className="flex items-center gap-3 text-sm text-foreground/90 bg-foreground/5 rounded-xl px-4 py-3.5 border border-border/50 hover:border-brand/20 hover:bg-brand/5 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-success/15 flex items-center justify-center shrink-0">
                        <CheckCircle size={15} className="text-success" aria-hidden />
                      </div>
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <Link
                    href="/tools"
                    className={cn(button.primary, "inline-flex items-center justify-center gap-2 w-full sm:w-auto px-10 group")}
                  >
                    <Sparkles size={16} aria-hidden />
                    {t("pricing.cta")}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden />
                  </Link>
                  <Link
                    href="/universities/compare"
                    className={cn(button.ghost, "inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground")}
                  >
                    Compare plans <ArrowRight size={14} aria-hidden />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
