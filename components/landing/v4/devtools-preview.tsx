"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Braces,
  Globe,
  Image,
  Lock,
  Palette,
  Paintbrush,
  Wind,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, card, button, sectionBg } from "@/lib/design-system";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/utils";

const DEVTOOL_CATEGORIES = [
  { key: "json", icon: Braces, color: "from-amber-500 to-orange-600" },
  { key: "css", icon: Paintbrush, color: "from-pink-500 to-rose-600" },
  { key: "tailwind", icon: Wind, color: "from-cyan-500 to-teal-600" },
  { key: "image", icon: Image, color: "from-violet-500 to-purple-600" },
  { key: "encoding", icon: Lock, color: "from-emerald-500 to-green-600" },
  { key: "color", icon: Palette, color: "from-red-500 to-rose-600" },
  { key: "network", icon: Globe, color: "from-sky-500 to-blue-600" },
] as const;

export function DevtoolsPreview() {
  const { t } = useTranslation("home");

  return (
    <section className={cn(spacing.section, sectionBg.elevated, "relative")}>
      <div className="blur-orb w-[400px] h-[400px] bg-brand-secondary/10 -bottom-20 right-0" aria-hidden />
      <div className={cn(spacing.container, "relative")}>
        <SectionHeader
          badge={t("devtools.badge")}
          title={t("devtools.title")}
          subtitle={t("devtools.subtitle")}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {DEVTOOL_CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div key={cat.key} {...animation.fadeUp} {...animation.stagger(i)}>
                <Link href="/developer-tools" className="block h-full">
                  <div className={cn(card.base, card.hover, card.interactive, "p-5 sm:p-6 h-full text-center")}>
                    <div
                      className={cn(
                        "w-12 h-12 mx-auto rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 shadow-md",
                        cat.color
                      )}
                    >
                      <Icon size={22} className="text-white" aria-hidden />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">
                      {t(`devtools.${cat.key}`)}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            );
          })}

          <motion.div {...animation.fadeUp} {...animation.stagger(7)}>
            <Link href="/developer-tools" className="block h-full">
              <div className={cn(card.base, card.hover, card.interactive, "p-5 sm:p-6 h-full flex flex-col items-center justify-center text-center gradient-primary")}>
                <ArrowRight size={24} className="text-brand-foreground mb-2" aria-hidden />
                <span className="text-sm font-bold text-brand-foreground">
                  {t("devtools.cta")}
                </span>
              </div>
            </Link>
          </motion.div>
        </div>

        <div className="flex justify-center mt-10">
          <Link href="/developer-tools" className={cn(button.primary, "inline-flex items-center gap-2")}>
            {t("devtools.cta")} <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
