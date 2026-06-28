"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, card, button } from "@/lib/design-system";
import { SectionHeader } from "../v4/section-header";
import { cn } from "@/lib/utils";

type CompRow = {
  feature: string;
  cf: boolean | string;
  manual: boolean | string;
  generic: boolean | string;
};

function Cell({ value, highlight }: { value: boolean | string; highlight?: boolean }) {
  if (value === true) return <Check className={cn("w-5 h-5 mx-auto", highlight ? "text-brand" : "text-success")} aria-label="Yes" />;
  if (value === false) return <X className="w-5 h-5 mx-auto text-muted-foreground/40" aria-label="No" />;
  if (value === "partial") return <Minus className="w-5 h-5 mx-auto text-warning" aria-label="Partial" />;
  return <span className="text-xs text-muted-foreground">{String(value)}</span>;
}

export function FeatureComparisonSection() {
  const { t, tArray } = useTranslation("v5");
  const rows = tArray<CompRow>("comparison.rows");

  return (
    <section className={cn(spacing.section, "relative bg-background")}>
      <div className={cn(spacing.container, "relative")}>
        <SectionHeader
          badge={t("comparison.badge")}
          title={t("comparison.title")}
          subtitle={t("comparison.subtitle")}
        />

        <motion.div {...animation.fadeUp} className="overflow-x-auto table-wrap">
          <table className={cn(card.base, "w-full min-w-[640px] !rounded-2xl overflow-hidden")}>
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 text-sm font-bold text-foreground">{t("comparison.feature")}</th>
                <th className="p-4 text-sm font-bold text-brand text-center">{t("comparison.campusflow")}</th>
                <th className="p-4 text-sm font-bold text-muted-foreground text-center">{t("comparison.manual")}</th>
                <th className="p-4 text-sm font-bold text-muted-foreground text-center">{t("comparison.generic")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.feature} className={cn("border-b border-border last:border-0", i % 2 === 0 && "bg-muted/20")}>
                  <td className="p-4 text-sm text-foreground font-medium">{row.feature}</td>
                  <td className="p-4 text-center"><Cell value={row.cf} highlight /></td>
                  <td className="p-4 text-center"><Cell value={row.manual} /></td>
                  <td className="p-4 text-center"><Cell value={row.generic === "partial" ? "partial" : row.generic} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <div className="flex justify-center mt-10">
          <Link href="/tools" className={cn(button.primary, "inline-flex items-center gap-2")}>
            {t("comparison.cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
