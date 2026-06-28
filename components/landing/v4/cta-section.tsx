"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, LogIn } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, button } from "@/lib/design-system";
import { cn } from "@/lib/utils";

export function CtaSection() {
  const { t } = useTranslation("home");

  return (
    <section className={cn(spacing.section, "relative")}>
      <div className={spacing.container}>
        <motion.div
          {...animation.fadeUp}
          className="relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 gradient-primary" aria-hidden />
          <div className="blur-orb w-[300px] h-[300px] bg-white/20 -top-20 -right-20" aria-hidden />
          <div className="blur-orb w-[250px] h-[250px] bg-brand-accent/30 -bottom-16 -left-16" aria-hidden />
          <div
            className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:24px_24px]"
            aria-hidden
          />

          <div className="relative z-10 px-6 sm:px-12 lg:px-16 py-16 sm:py-20 text-center text-brand-foreground">
            <h2 className="text-heading font-extrabold mb-4 max-w-2xl mx-auto">
              {t("cta.title")}
            </h2>
            <p className="text-base sm:text-lg opacity-90 mb-10 max-w-lg mx-auto leading-relaxed">
              {t("cta.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/login"
                className={cn(
                  "inline-flex items-center justify-center gap-2 bg-background text-brand font-semibold min-h-[44px] px-8 py-3 rounded-xl shadow-xl hover:shadow-2xl transition-all"
                )}
              >
                <LogIn size={18} aria-hidden />
                {t("cta.primary")}
              </Link>
              <Link
                href="/tools"
                className={cn(
                  button.secondary,
                  "inline-flex items-center justify-center gap-2 bg-white/15 border-white/30 text-brand-foreground hover:bg-white/25"
                )}
              >
                {t("cta.secondary")} <ArrowRight size={18} aria-hidden />
              </Link>
            </div>

            <div className="hidden lg:block" aria-hidden>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-12 left-12 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-12 right-12 w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
