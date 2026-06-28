"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Monitor } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, button, card, animation, sectionBg } from "@/lib/design-system";
import { SectionHeader } from "../v4/section-header";
import { SectionCta } from "./section-cta";
import { cn } from "@/lib/utils";

export function ProductDemoSection() {
  const { t } = useTranslation("v5");

  return (
    <section id="demo" className={cn(spacing.section, sectionBg.mesh, "relative")}>
      <div className={cn(spacing.container, "relative")}>
        <SectionHeader
          badge={t("demo.badge")}
          title={t("demo.title")}
          subtitle={t("demo.subtitle")}
        />

        <motion.div
          {...animation.scaleIn}
          className="max-w-4xl mx-auto"
        >
          {/* Laptop frame */}
          <div className="relative">
            <div className="mx-auto w-full max-w-3xl">
              <div className="rounded-t-2xl bg-muted border border-border px-4 pt-3 pb-1">
                <div className="h-2 w-16 mx-auto rounded-full bg-border" />
              </div>
              <div className={cn(card.base, "rounded-b-2xl rounded-t-none overflow-hidden border-t-0 shadow-2xl shadow-brand/10")}>
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
                  <div className="w-3 h-3 rounded-full bg-destructive/70" />
                  <div className="w-3 h-3 rounded-full bg-warning/70" />
                  <div className="w-3 h-3 rounded-full bg-success/70" />
                  <span className="ml-2 text-xs text-muted-foreground font-mono truncate">{t("demo.browserTitle")}</span>
                </div>
                <div className="relative aspect-video bg-gradient-to-br from-brand/5 via-background to-brand-accent/5 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(109,93,246,0.08)_1px,transparent_1px)] bg-[length:24px_24px]" aria-hidden />
                  <div className="relative z-10 text-center p-8">
                    <Monitor className="w-16 h-16 text-brand/40 mx-auto mb-4" aria-hidden />
                    <p className="text-sm font-semibold text-muted-foreground mb-6">{t("demo.livePreview")}</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <Link href="/tools" className={cn(button.primary, "inline-flex items-center gap-2")}>
                        <Play size={16} aria-hidden /> {t("demo.watchDemo")}
                      </Link>
                      <Link href="/assignment" className={cn(button.secondary, "inline-flex items-center gap-2")}>
                        {t("demo.startTour")}
                      </Link>
                    </div>
                  </div>
                  {/* Animated play pulse */}
                  <motion.div
                    className="absolute inset-0 border-2 border-brand/20 rounded-none pointer-events-none"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    aria-hidden
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <SectionCta label={t("sectionCta.startFree")} href="/tools" />
      </div>
    </section>
  );
}
