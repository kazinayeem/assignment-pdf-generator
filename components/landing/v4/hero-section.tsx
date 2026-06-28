"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Github,
  MousePointer2,
  Play,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, button, badge, card, animation } from "@/lib/design-system";
import { HERO_DASHBOARD_CARDS } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

const CARD_KEYS = ["assignment", "cv", "lab", "tools"] as const;

const LIVE_NAMES = ["Rahim", "Fatima", "Tanvir", "Sadia", "Imran", "Nusrat"];

export function HeroSectionV4() {
  const { t } = useTranslation("home");
  const { t: tV5 } = useTranslation("v5");
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });
  const [liveIndex, setLiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setLiveIndex((i) => (i + 1) % LIVE_NAMES.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) / 20);
    mouseY.set((e.clientY - rect.top - rect.height / 2) / 20);
  };

  return (
    <section
      id="hero-section"
      className="relative overflow-hidden bg-brand-dark text-white pt-[var(--landing-header-h,72px)]"
      onMouseMove={onMouseMove}
    >
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div className="blur-orb w-[600px] h-[600px] bg-brand/30 -top-40 -left-40" />
        <div className="blur-orb w-[500px] h-[500px] bg-brand-secondary/25 top-10 right-0" />
        <div className="blur-orb w-[400px] h-[400px] bg-brand-accent/20 bottom-0 left-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(109,93,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
      </div>

      <div className={cn(spacing.container, "py-16 sm:py-20 lg:py-28 relative z-10")}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div {...animation.fadeUp}>
            <span className={cn(badge.brand, "mb-6 bg-white/10 text-white border-white/20 backdrop-blur-md")}>
              <Sparkles size={14} aria-hidden />
              {t("hero.badge")}
            </span>

            <h1 className="text-hero font-extrabold mb-6 text-white">
              {t("hero.title")}
              <br />
              <span className="bg-gradient-to-r from-white via-brand-accent to-brand bg-clip-text text-transparent">
                {t("hero.titleHighlight")}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-white/70 max-w-xl mb-6 leading-relaxed">
              {t("hero.subtitle")}
            </p>

            {/* Live activity */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-white/80 mb-6"
              aria-live="polite"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={liveIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                >
                  <strong className="text-white">{LIVE_NAMES[liveIndex]}</strong>{" "}
                  {tV5("hero.liveActivity")}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
              <Link href="/tools" className={cn(button.primary, "inline-flex items-center justify-center gap-2 w-full sm:w-auto")}>
                {t("hero.ctaPrimary")} <ArrowRight size={18} aria-hidden />
              </Link>
              <Link href="#demo" className={cn(button.secondary, "inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20")}>
                <Play size={16} aria-hidden /> {t("hero.ctaSecondary")}
              </Link>
              <a
                href="https://github.com/kazinayeem/assignment-pdf-generator"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(button.secondary, "inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-white/5 border-white/15 text-white/90 hover:bg-white/15")}
              >
                <Github size={16} aria-hidden /> {t("hero.ctaGithub")}
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-10 text-white/60 text-sm">
              <span className="flex items-center gap-2"><CheckCircle size={16} className="text-success" aria-hidden />{t("hero.trustAutoSave")}</span>
              <span className="flex items-center gap-2"><Zap size={16} className="text-warning" aria-hidden />{t("hero.trustOneClick")}</span>
              <span className="flex items-center gap-2"><Shield size={16} className="text-brand-accent" aria-hidden />{t("hero.trustDiu")}</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: t("hero.statsStudents"), value: "2,500+" },
                { label: t("hero.statsUniversities"), value: "12+" },
                { label: t("hero.statsTools"), value: "100+" },
              ].map((stat, i) => (
                <motion.div key={stat.label} {...animation.fadeUp} {...animation.stagger(i)}>
                  <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-white/50 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            style={{ x: springX, y: springY }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className={cn(card.onDark, "p-1 rounded-[24px] relative")}>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-destructive/80" />
                <div className="w-3 h-3 rounded-full bg-warning/80" />
                <div className="w-3 h-3 rounded-full bg-success/80" />
                <span className="ml-3 text-xs text-white/50 font-medium">{t("hero.dashboardLabel")}</span>
              </div>
              <div className="p-5 grid grid-cols-2 gap-4 relative">
                {HERO_DASHBOARD_CARDS.map((item, i) => {
                  const key = CARD_KEYS[i];
                  return (
                    <Link key={item.href} href={item.href}>
                      <motion.div
                        whileHover={{ y: -4, scale: 1.02 }}
                        className={cn(card.onDark, card.interactiveOnDark, card.hoverOnDark, "p-5")}
                      >
                        <div className={cn("w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3", item.color)}>
                          <item.icon size={20} className="text-white" aria-hidden />
                        </div>
                        <p className="text-sm font-bold text-white">{t(`hero.cards.${key}.label`)}</p>
                        <p className="text-xs text-white/50">{t(`hero.cards.${key}.sub`)}</p>
                      </motion.div>
                    </Link>
                  );
                })}
                {/* Animated cursor */}
                <motion.div
                  className="absolute pointer-events-none z-20"
                  animate={{
                    left: ["20%", "70%", "45%", "25%"],
                    top: ["25%", "30%", "65%", "55%"],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                >
                  <MousePointer2 size={20} className="text-white drop-shadow-lg" fill="white" />
                </motion.div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl bg-brand/30 blur-2xl animate-float" aria-hidden />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-brand-accent/20 blur-2xl animate-float" aria-hidden />
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-10 lg:hidden">
          {HERO_DASHBOARD_CARDS.map((item, i) => {
            const key = CARD_KEYS[i];
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(card.onDark, "p-4")}>
                  <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-2", item.color)}>
                    <item.icon size={18} className="text-white" aria-hidden />
                  </div>
                  <p className="text-sm font-bold text-white">{t(`hero.cards.${key}.label`)}</p>
                  <p className="text-xs text-white/50">{t(`hero.cards.${key}.sub`)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
