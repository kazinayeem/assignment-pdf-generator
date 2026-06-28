"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, LogIn, Shield, Zap, Users, Star } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, button, sectionBg } from "@/lib/design-system";
import { cn } from "@/lib/utils";

const TRUST_BADGES = [
  { icon: Shield, label: "UGC Ready" },
  { icon: Zap, label: "100+ Tools" },
  { icon: Users, label: "2,500+ Students" },
  { icon: Star, label: "4.9 Rating" },
];

export function CtaSection() {
  const { t } = useTranslation("home");

  return (
    <section className={cn(spacing.section, sectionBg.surface, "relative pb-14")}>
      <div className={spacing.container}>
        <motion.div
          {...animation.fadeUp}
          className="relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 gradient-primary" aria-hidden />
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
          <div className="blur-orb w-[350px] h-[350px] bg-white/15 -top-24 -right-24" aria-hidden />
          <div className="blur-orb w-[280px] h-[280px] bg-brand-accent/35 -bottom-20 -left-20" aria-hidden />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[length:28px_28px]" aria-hidden />

          {/* Floating shapes */}
          <div className="hidden lg:block" aria-hidden>
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 left-10 w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
            />
            <motion.div
              animate={{ y: [0, 14, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
            />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/2 right-16 w-10 h-10 rounded-xl bg-brand-accent/30 backdrop-blur-md border border-white/15"
            />
          </div>

          <div className="relative z-10 px-6 sm:px-12 lg:px-16 py-14 sm:py-16 text-center text-brand-foreground">
            <h2 className="text-heading font-extrabold mb-4 max-w-2xl mx-auto text-white">
              {t("cta.title")}
            </h2>
            <p className="text-body-lg opacity-90 mb-8 max-w-lg mx-auto text-white/85">
              {t("cta.subtitle")}
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {TRUST_BADGES.map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white/90 backdrop-blur-sm"
                >
                  <b.icon size={13} aria-hidden />
                  {b.label}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/tools"
                className="btn-premium inline-flex items-center justify-center gap-2 bg-white text-brand font-bold min-h-[48px] px-8 py-3.5 rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all group"
              >
                <LogIn size={18} aria-hidden />
                {t("cta.primary")}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link
                href="/universities"
                className={cn(
                  button.secondary,
                  "inline-flex items-center justify-center gap-2 bg-white/12 border-white/25 text-white hover:bg-white/20 min-h-[48px] group"
                )}
              >
                {t("cta.secondary")}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
