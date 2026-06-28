"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users, BookOpen, Home, Award, Share2, Bookmark,
  GraduationCap, MapPin, CheckSquare, Square,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { card, badge, animation } from "@/lib/design-system";
import { formatCount, formatQsWorldRanking, formatStartingCost, formatTheWorldRanking, formatTheSustainabilityGlobal, formatTuitionRange, hasTheSustainability, isQsRanked, isTheRanked,
} from "@/lib/universities/format";
import { isFavorite, toggleFavorite } from "@/lib/universities/storage";
import type { University } from "@/lib/universities/types";
import { UniversityLogo } from "./university-logo";
import { cn } from "@/lib/utils";

type UniversityCardProps = {
  university: University;
  onCompare?: (slug: string) => void;
  compareSelected?: boolean;
  showCompare?: boolean;
};

export function UniversityCard({ university, onCompare, compareSelected, showCompare = true }: UniversityCardProps) {
  const { t } = useTranslation("universities");
  const [bookmarked, setBookmarked] = useState(() => isFavorite(university.slug));

  const qsLabel = formatQsWorldRanking(university.rankings, "");
  const theLabel = formatTheWorldRanking(university.rankings, "");
  const qsRanked = isQsRanked(university.rankings);
  const theRanked = isTheRanked(university.rankings);
  const sustainabilityRanked = hasTheSustainability(university.rankings);
  const sustainabilityLabel = formatTheSustainabilityGlobal(university.rankings.theSustainability, "");
  const tuitionLabels = {
    unavailable: t("tuition.unavailable"),
    variesByDepartment: t("tuition.variesByDepartment"),
    startingFrom: t("tuition.startingFrom"),
    estimated: t("tuition.estimated"),
  };
  const startingLabels = { unavailable: t("tuition.unavailable"), perCredit: t("tuition.perCredit") };

  const toggleBookmark = useCallback(() => {
    toggleFavorite(university.slug);
    setBookmarked(isFavorite(university.slug));
  }, [university.slug]);

  const handleShare = async () => {
    const url = `${window.location.origin}/universities/${university.slug}`;
    if (navigator.share) {
      await navigator.share({ title: university.name, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <motion.article
      {...animation.fadeUp}
      className={cn(card.base, "group p-5 sm:p-6 flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-brand/30")}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <UniversityLogo university={university} size="md" />
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-foreground truncate">{university.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{university.shortName}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={cn(badge.brand, "text-[10px]")}>{t(`types.${university.type}`)}</span>
          {university.ugcApproved && (
            <span className={cn(badge.success, "text-[10px]")}>{t("card.ugcApproved")}</span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {qsRanked && (
          <span className={cn(badge.muted, "text-[10px]")}>QS {qsLabel}</span>
        )}
        {theRanked && (
          <span className={cn(badge.muted, "text-[10px]")}>THE {theLabel}</span>
        )}
        {sustainabilityRanked && sustainabilityLabel && (
          <span className={cn(badge.success, "text-[10px]")}>THE Impact {sustainabilityLabel}</span>
        )}
        {!qsRanked && !theRanked && !sustainabilityRanked && (
          <span className={cn(badge.muted, "text-[10px] opacity-70")}>{t("rankings.notRanked")}</span>
        )}
        {university.admission.isOpen === true && (
          <span className={cn(badge.success, "text-[10px]")}>{t("admission.open")}</span>
        )}
        {university.admission.isOpen === false && (
          <span className={cn(badge.muted, "text-[10px]")}>{t("admission.closed")}</span>
        )}
        {university.scholarships.length > 0 && (
          <span className={cn(badge.muted, "text-[10px]")}>
            <Award size={10} className="inline mr-0.5" aria-hidden />
            {t("card.scholarship")}
          </span>
        )}
        {university.facilities.hostel && (
          <span className={cn(badge.muted, "text-[10px]")}>
            <Home size={10} className="inline mr-0.5" aria-hidden />
            {t("card.hostel")}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5 col-span-2">
          <MapPin size={12} aria-hidden />
          {university.city}, {university.division}
        </span>
        <span className="flex items-center gap-1.5">
          <Award size={12} aria-hidden />
          {t("card.established")} {university.established}
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={12} aria-hidden />
          {formatCount(university.studentPopulation, t("data.unavailable"))} {t("card.students")}
        </span>
        <span className="flex items-center gap-1.5">
          <BookOpen size={12} aria-hidden />
          {formatCount(university.departmentCount, "—")} {t("card.departments")}
        </span>
        <span className="flex items-center gap-1.5">
          <GraduationCap size={12} aria-hidden />
          {university.programs.length} {t("card.programs")}
        </span>
      </div>

      <div className="mb-4 p-3 rounded-xl bg-muted/50 border border-border/50">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">{t("tuition.range")}</p>
        <p className="text-sm font-bold text-foreground">{formatTuitionRange(university.tuition, tuitionLabels)}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatStartingCost(university.tuition, startingLabels)}
          {!university.tuition.verified && university.tuition.variesByDepartment && (
            <span className="ml-1 text-warning">({t("tuition.unverified")})</span>
          )}
        </p>
      </div>

      <div className="mt-auto space-y-2">
        <Link
          href={`/universities/${university.slug}`}
          className="w-full text-center text-xs font-semibold py-2.5 rounded-xl bg-brand text-brand-foreground hover:opacity-90 transition-opacity min-h-[40px] flex items-center justify-center"
        >
          {t("landing.viewDetails")}
        </Link>
        <div className="flex items-center gap-1">
          {showCompare && onCompare && (
            <button
              type="button"
              onClick={() => onCompare(university.slug)}
              aria-pressed={compareSelected}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border transition-colors min-h-[36px]",
                compareSelected ? "bg-brand/10 border-brand text-brand" : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {compareSelected ? <CheckSquare size={14} /> : <Square size={14} />}
              {t("landing.compare")}
            </button>
          )}
          <button
            type="button"
            onClick={toggleBookmark}
            aria-pressed={bookmarked}
            aria-label={t("detail.bookmark")}
            className="p-2 rounded-xl border border-border text-muted-foreground hover:bg-muted transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <Bookmark size={14} className={bookmarked ? "fill-brand text-brand" : ""} />
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label={t("detail.share")}
            className="p-2 rounded-xl border border-border text-muted-foreground hover:bg-muted transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <Share2 size={14} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
