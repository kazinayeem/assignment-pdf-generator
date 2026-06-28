"use client";

import { motion } from "framer-motion";
import { Briefcase, TrendingUp, Globe, Users } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { computeEmployability } from "@/lib/universities/employability";
import { formatCurrency } from "@/lib/universities/format";
import type { University } from "@/lib/universities/types";
import { card, badge, animation } from "@/lib/design-system";
import { cn } from "@/lib/utils";

function Bar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{Math.round(value)}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="h-full rounded-full bg-gradient-to-r from-brand to-brand-accent"
        />
      </div>
    </div>
  );
}

export function UniversityEmployabilitySection({ university }: { university: University }) {
  const { t } = useTranslation("universities");
  const m = computeEmployability(university);

  return (
    <motion.div {...animation.fadeUp} className={cn(card.base, "p-6 space-y-6")}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-foreground mb-1">{t("employability.title")}</h3>
          {!m.verified && <p className="text-xs text-warning">{t("employability.unverified")}</p>}
        </div>
        <div className="text-center shrink-0">
          <p className="text-3xl font-extrabold text-brand">{m.score}</p>
          <p className="text-[10px] text-muted-foreground uppercase">{t("employability.score")}</p>
        </div>
      </div>

      <div className="space-y-3">
        <Bar label={t("employability.placement")} value={m.placementScore} />
        <Bar label={t("employability.internship")} value={m.internshipScore} />
        <Bar label={t("employability.industry")} value={m.industryScore} />
        <Bar label={t("employability.research")} value={m.researchScore} />
        <Bar label={t("employability.exchange")} value={m.exchangeScore} />
        <Bar label={t("employability.careerSupport")} value={m.careerSupportScore} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border">
        {university.career.employmentRate != null && (
          <div className="flex items-center gap-3">
            <TrendingUp size={18} className="text-brand" />
            <div>
              <p className="text-xs text-muted-foreground">{t("employability.placementRate")}</p>
              <p className="font-bold">{university.career.employmentRate}%</p>
            </div>
          </div>
        )}
        {university.career.avgStartingSalary != null && (
          <div className="flex items-center gap-3">
            <Briefcase size={18} className="text-brand" />
            <div>
              <p className="text-xs text-muted-foreground">{t("employability.avgSalary")}</p>
              <p className="font-bold">{formatCurrency(university.career.avgStartingSalary)}</p>
            </div>
          </div>
        )}
        {university.exchangePrograms.length > 0 && (
          <div className="flex items-center gap-3">
            <Globe size={18} className="text-brand" />
            <div>
              <p className="text-xs text-muted-foreground">{t("employability.exchange")}</p>
              <p className="font-bold">{university.exchangePrograms.length} {t("employability.programs")}</p>
            </div>
          </div>
        )}
        {university.career.topRecruiters.length > 0 && (
          <div className="sm:col-span-2">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><Users size={14} /> {t("employability.recruiters")}</p>
            <div className="flex flex-wrap gap-1.5">
              {university.career.topRecruiters.map((r) => (
                <span key={r} className={badge.muted}>{r}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
