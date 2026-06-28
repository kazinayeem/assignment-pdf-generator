"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star, Eye, GraduationCap } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { card, badge, animation } from "@/lib/design-system";
import { formatTuitionRange, getQsDisplayRank } from "@/lib/universities/format";
import { getAverageRating } from "@/lib/universities";
import type { University } from "@/lib/universities/types";
import { UniversityLogo } from "./university-logo";
import { cn } from "@/lib/utils";

type UniversityCompactCardProps = {
  university: University;
};

export function UniversityCompactCard({ university }: UniversityCompactCardProps) {
  const { t } = useTranslation("universities");
  const qsRank = getQsDisplayRank(university.rankings);
  const rating = getAverageRating(university);
  const tuitionLabels = {
    unavailable: t("tuition.unavailable"),
    variesByDepartment: t("tuition.variesByDepartment"),
    startingFrom: t("tuition.startingFrom"),
    estimated: t("tuition.estimated"),
  };

  return (
    <motion.article {...animation.fadeUp} className={cn(card.base, card.hover, "p-4 flex flex-col h-full min-w-[260px] max-w-[280px]")}>
      <div className="flex items-center gap-3 mb-3">
        <UniversityLogo university={university} size="md" />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-foreground truncate">{university.shortName}</h3>
          <p className="text-[11px] text-muted-foreground truncate">{university.name}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        <span className={cn(badge.brand, "text-[10px]")}>{t(`types.${university.type}`)}</span>
        {qsRank != null ? (
          <span className={cn(badge.muted, "text-[10px]")}>QS #{qsRank}</span>
        ) : (
          <span className={cn(badge.muted, "text-[10px] opacity-70")}>{t("rankings.notRanked")}</span>
        )}
      </div>

      <div className="space-y-1.5 text-xs text-muted-foreground mb-3 flex-1">
        <span className="flex items-center gap-1.5"><MapPin size={12} />{university.city}, {university.division}</span>
        <span className="flex items-center gap-1.5"><GraduationCap size={12} />{university.programs.length} {t("card.programs")}</span>
        <span className="font-semibold text-foreground">{formatTuitionRange(university.tuition, tuitionLabels)}</span>
        {rating != null && (
          <span className="flex items-center gap-1"><Star size={12} className="text-warning fill-warning" />{rating.toFixed(1)}</span>
        )}
      </div>

      <Link
        href={`/universities/${university.slug}`}
        className="w-full text-center text-xs font-semibold py-2 rounded-xl bg-brand text-brand-foreground hover:opacity-90 transition-opacity min-h-[36px] flex items-center justify-center gap-1.5"
      >
        <Eye size={14} /> {t("top.quickView")}
      </Link>
    </motion.article>
  );
}
