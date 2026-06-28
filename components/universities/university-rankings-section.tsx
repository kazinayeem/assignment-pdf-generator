"use client";

import { useTranslation } from "@/lib/i18n/provider";
import { card, badge } from "@/lib/design-system";
import {
  formatQsWorldRanking, formatRanking, formatTheWorldRanking, formatTheSustainabilityGlobal,
  hasTheSustainability, isTheRanked,
} from "@/lib/universities/format";
import type { UniversityRanking } from "@/lib/universities/types";
import { cn } from "@/lib/utils";

type UniversityRankingsSectionProps = {
  rankings: UniversityRanking;
  compact?: boolean;
};

const OTHER_RANKING_ROWS = [
  { key: "qsAsia" as const, labelKey: "rankings.qsAsia" },
  { key: "webometrics" as const, labelKey: "rankings.webometrics" },
  { key: "national" as const, labelKey: "rankings.national" },
];

function formatScore(value: number | null | undefined, unavailable: string): string {
  return value != null ? String(value) : unavailable;
}

export function UniversityRankingsSection({ rankings, compact }: UniversityRankingsSectionProps) {
  const { t } = useTranslation("universities");
  const notRanked = t("rankings.notRanked");
  const unavailable = t("data.unavailable");
  const qsLabel = formatQsWorldRanking(rankings, notRanked);
  const theLabel = formatTheWorldRanking(rankings, notRanked);
  const sustainability = rankings.theSustainability;
  const sustainabilityGlobal = formatTheSustainabilityGlobal(sustainability, notRanked);
  const hasQs = qsLabel !== notRanked;
  const hasThe = isTheRanked(rankings);
  const hasSustainability = hasTheSustainability(rankings);

  if (compact) {
    return (
      <span className={cn(badge.muted, "text-[10px] flex flex-wrap gap-1")}>
        {hasQs && <span>QS {qsLabel}</span>}
        {hasThe && <span>THE {theLabel}</span>}
        {hasSustainability && <span>THE Impact {sustainabilityGlobal}</span>}
        {!hasQs && !hasThe && !hasSustainability && notRanked}
      </span>
    );
  }

  const hasQsMetrics =
    rankings.qsYear != null ||
    rankings.qsOverallScore != null ||
    rankings.academicReputation != null ||
    rankings.citationsPerFaculty != null;

  return (
    <div className={cn(card.base, "p-6")}>
      <h3 className="font-bold text-foreground mb-1">{t("detail.rankings")}</h3>
      {(rankings.qsSource || rankings.theSource || rankings.theSustainability?.source || rankings.source) && (
        <div className="text-xs text-muted-foreground mb-4 space-y-1">
          {rankings.qsSource && <p>{t("rankings.qsWorld")}: {rankings.qsSource}</p>}
          {rankings.theSource && <p>{t("rankings.the")}: {rankings.theSource}</p>}
          {rankings.theSustainability?.source && (
            <p>{t("rankings.theSustainability")}: {rankings.theSustainability.source}</p>
          )}
          {!rankings.qsSource && !rankings.theSource && !rankings.theSustainability?.source && rankings.source && (
            <p>{t("rankings.source")}: {rankings.source}</p>
          )}
        </div>
      )}
      {!rankings.verified && (
        <p className="text-xs text-warning mb-4">{t("rankings.unverified")}</p>
      )}

      {hasQs && (
        <div className={cn(card.base, "p-4 mb-4 bg-gradient-to-br from-brand/5 to-transparent border-brand/10")}>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-muted-foreground">{t("rankings.qsWorld")}</span>
            {rankings.qsYear != null && (
              <span className={cn(badge.brand, "text-[10px]")}>{rankings.qsYear}</span>
            )}
            {rankings.qsStars != null && (
              <span className={cn(badge.warning, "text-[10px]")}>{rankings.qsStars} {t("rankings.qsStars")}</span>
            )}
          </div>
          <p className="text-3xl font-extrabold text-brand mb-3">{qsLabel}</p>
          {hasQsMetrics && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-background/80 border border-border">
                <p className="text-[10px] text-muted-foreground uppercase">{t("rankings.overallScore")}</p>
                <p className="text-lg font-bold text-foreground">{formatScore(rankings.qsOverallScore, unavailable)}</p>
              </div>
              <div className="p-3 rounded-xl bg-background/80 border border-border">
                <p className="text-[10px] text-muted-foreground uppercase">{t("rankings.academicReputation")}</p>
                <p className="text-lg font-bold text-foreground">{formatScore(rankings.academicReputation, unavailable)}</p>
              </div>
              <div className="p-3 rounded-xl bg-background/80 border border-border">
                <p className="text-[10px] text-muted-foreground uppercase">{t("rankings.citationsPerFaculty")}</p>
                <p className="text-lg font-bold text-foreground">{formatScore(rankings.citationsPerFaculty, unavailable)}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {hasThe && (
        <div className={cn(card.base, "p-4 mb-4 bg-gradient-to-br from-brand-secondary/5 to-transparent border-brand-secondary/10")}>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-muted-foreground">{t("rankings.the")}</span>
            {rankings.theYear != null && (
              <span className={cn(badge.muted, "text-[10px]")}>{rankings.theYear}</span>
            )}
            <span className={cn(badge.success, "text-[10px]")}>{t("rankings.theTopNational")}</span>
          </div>
          <p className="text-3xl font-extrabold text-foreground mb-2">{theLabel}</p>
          <p className="text-xs text-muted-foreground">{t("rankings.theBandNote")}</p>
        </div>
      )}

      {hasSustainability && sustainability && (
        <div className={cn(card.base, "p-4 mb-4 bg-gradient-to-br from-success/5 to-transparent border-success/10")}>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-muted-foreground">{t("rankings.theSustainability")}</span>
            {sustainability.year != null && (
              <span className={cn(badge.success, "text-[10px]")}>{sustainability.year}</span>
            )}
            {sustainability.nationalRank != null && (
              <span className={cn(badge.brand, "text-[10px]")}>
                {t("rankings.sustainabilityNational").replace("{{rank}}", String(sustainability.nationalRank))}
              </span>
            )}
            {sustainability.nationalLabel && (
              <span className={cn(badge.brand, "text-[10px]")}>{sustainability.nationalLabel}</span>
            )}
            {sustainability.privateRank != null && (
              <span className={cn(badge.muted, "text-[10px]")}>
                {t("rankings.sustainabilityPrivate").replace("{{rank}}", String(sustainability.privateRank))}
              </span>
            )}
          </div>
          {sustainabilityGlobal !== notRanked && (
            <p className="text-3xl font-extrabold text-success mb-2">{sustainabilityGlobal}</p>
          )}
          <p className="text-xs text-muted-foreground mb-3">{t("rankings.sustainabilityNote")}</p>
          {sustainability.sdgHighlights && sustainability.sdgHighlights.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sustainability.sdgHighlights.map((sdg) => (
                <div key={sdg.goal} className="p-3 rounded-xl bg-background/80 border border-border">
                  <p className="text-[10px] text-muted-foreground uppercase">
                    {t("rankings.sdg").replace("{{goal}}", String(sdg.goal))}
                  </p>
                  <p className="text-xs font-medium text-foreground">{sdg.name}</p>
                  <p className="text-lg font-bold text-success">
                    {sdg.globalRank != null
                      ? t("rankings.sdgGlobalRank").replace("{{rank}}", String(sdg.globalRank))
                      : unavailable}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!hasQs && !hasThe && !hasSustainability && (
        <p className={cn(card.base, "p-4 mb-4 text-sm text-muted-foreground")}>{notRanked}</p>
      )}

      <div className="space-y-3">
        {OTHER_RANKING_ROWS.map(({ key, labelKey }) => (
          <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <span className="text-sm text-muted-foreground">{t(labelKey)}</span>
            <span className="text-sm font-bold text-foreground">
              {formatRanking(rankings[key], notRanked)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
