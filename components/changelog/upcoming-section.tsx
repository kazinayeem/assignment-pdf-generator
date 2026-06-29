"use client";

import { motion } from "framer-motion";
import { UPCOMING_RELEASES } from "@/lib/changelog/catalog";
import { PRODUCT_META } from "@/lib/changelog/constants";
import { useTranslation } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  comingSoon: "bg-brand/15 text-brand border-brand/25",
  inDevelopment: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25",
  planned: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/25",
  research: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/25",
  ideas: "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/25",
};

export function UpcomingSection() {
  const { t } = useTranslation("changelog");

  return (
    <section id="upcoming" className="scroll-mt-28">
      <h2 className="text-2xl font-extrabold text-foreground mb-2">{t("upcoming.title")}</h2>
      <p className="text-sm text-muted-foreground mb-6">{t("upcoming.subtitle")}</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {UPCOMING_RELEASES.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur p-5 hover:border-brand/25 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="font-bold text-foreground">{item.title}</h3>
                {item.product && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {PRODUCT_META[item.product].emoji} {PRODUCT_META[item.product].label}
                  </p>
                )}
              </div>
              <span className={cn("text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border shrink-0", STATUS_COLORS[item.status])}>
                {t(`upcoming.status.${item.status}`)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>{item.quarter}</span>
              <span className="font-semibold text-foreground">{item.progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${item.progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-brand to-brand-accent"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
