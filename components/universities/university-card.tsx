"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, Users, BookOpen, Home, Award } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { card, badge, animation } from "@/lib/design-system";
import type { University } from "@/lib/universities/types";
import { cn } from "@/lib/utils";

type UniversityCardProps = {
  university: University;
  onCompare?: (slug: string) => void;
  compareSelected?: boolean;
};

export function UniversityCard({ university, onCompare, compareSelected }: UniversityCardProps) {
  const { t } = useTranslation("universities");

  return (
    <motion.article
      {...animation.fadeUp}
      className={cn(card.base, card.hover, "p-5 sm:p-6 flex flex-col h-full")}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand to-brand-secondary flex items-center justify-center text-sm font-bold text-brand-foreground shrink-0">
            {university.shortName.slice(0, 3)}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-foreground truncate">{university.shortName}</h3>
            <p className="text-xs text-muted-foreground truncate">{university.name}</p>
          </div>
        </div>
        <span className={cn(badge.brand, "shrink-0 text-[10px]")}>
          {t(`types.${university.type}`)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Building2 size={13} aria-hidden />
          {university.city}, {university.division}
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={13} aria-hidden />
          {university.studentPopulation.toLocaleString()} {t("card.students")}
        </span>
        <span className="flex items-center gap-1.5">
          <BookOpen size={13} aria-hidden />
          {university.departmentCount} {t("card.departments")}
        </span>
        <span className="flex items-center gap-1.5">
          <Award size={13} aria-hidden />
          {t("card.established")} {university.established}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {university.ugcApproved && (
          <span className={badge.success}>{t("card.ugcApproved")}</span>
        )}
        {university.facilities.hostel && (
          <span className={badge.muted}>
            <Home size={10} aria-hidden /> {t("card.hostel")}
          </span>
        )}
        {university.scholarships.length > 0 && (
          <span className={badge.muted}>{t("card.scholarship")}</span>
        )}
      </div>

      <div className="mt-auto flex gap-2">
        <Link
          href={`/universities/${university.slug}`}
          className="flex-1 text-center text-xs font-semibold py-2.5 rounded-xl bg-brand text-brand-foreground hover:opacity-90 transition-opacity min-h-[40px] flex items-center justify-center"
        >
          {t("landing.viewDetails")}
        </Link>
        {onCompare && (
          <button
            type="button"
            onClick={() => onCompare(university.slug)}
            className={cn(
              "px-3 py-2.5 rounded-xl text-xs font-semibold border transition-colors min-h-[40px]",
              compareSelected
                ? "bg-brand/10 border-brand text-brand"
                : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            {t("landing.compare")}
          </button>
        )}
      </div>
    </motion.article>
  );
}
