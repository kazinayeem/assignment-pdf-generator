"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { BRAND } from "@/lib/brand";
import { AuroraBackground } from "./about-motion";
import { cn } from "@/lib/utils";

export function AboutHero() {
  const { t } = useTranslation("about");

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-border/50">
      <AuroraBackground />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand to-brand-accent blur-2xl opacity-30 scale-110" />
            <Image
              src={BRAND.logoUrl}
              alt={BRAND.company}
              width={96}
              height={96}
              className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-3xl object-contain mx-auto shadow-2xl shadow-brand/20"
              unoptimized
              priority
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-sm font-semibold text-brand mb-4 tracking-wide"
        >
          {BRAND.platform} · {BRAND.companyTagline}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-foreground tracking-tight leading-[1.08] mb-6"
        >
          {t("hero.headline")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/tools"
            className={cn(
              "inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full",
              "bg-brand text-brand-foreground font-semibold text-sm",
              "hover:bg-brand/90 shadow-lg shadow-brand/25 hover:shadow-xl hover:shadow-brand/30 transition-all hover:-translate-y-0.5"
            )}
          >
            {t("hero.ctaExplore")}
            <ArrowRight size={16} aria-hidden />
          </Link>
          <a
            href={`mailto:${BRAND.email}`}
            className={cn(
              "inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full",
              "border border-border bg-card/60 backdrop-blur text-foreground font-semibold text-sm",
              "hover:bg-muted hover:border-brand/30 transition-all"
            )}
          >
            <Mail size={16} aria-hidden />
            {t("hero.ctaContact")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
