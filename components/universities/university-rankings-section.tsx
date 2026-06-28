"use client";

import { useTranslation } from "@/lib/i18n/provider";
import { card, badge } from "@/lib/design-system";
import { formatRanking } from "@/lib/universities/format";
import type { UniversityRanking } from "@/lib/universities/types";
import { cn } from "@/lib/utils";

type UniversityRankingsSectionProps = {
  rankings: UniversityRanking;
  compact?: boolean;
};

const RANKING_ROWS = [
  { key: "qsWorld" as const, labelKey: "rankings.qsWorld" },
  { key: "qsAsia" as const, labelKey: "rankings.qsAsia" },
  { key: "the" as const, labelKey: "rankings.the" },
  { key: "webometrics" as const, labelKey: "rankings.webometrics" },
  { key: "national" as const, labelKey: "rankings.national" },
];

export function UniversityRankingsSection({ rankings, compact }: UniversityRankingsSectionProps) {
  const { t } = useTranslation("universities");
  const notRanked = t("rankings.notRanked");

  if (compact) {
    const qs = rankings.qsWorld ?? rankings.qsAsia;
    return (
      <span className={cn(badge.muted, "text-[10px]")}>
        {qs != null ? `QS ${formatRanking(qs, "")}` : notRanked}
      </span>
    );
  }

  return (
    <div className={cn(card.base, "p-6")}>
      <h3 className="font-bold text-foreground mb-1">{t("detail.rankings")}</h3>
      {rankings.source && (
        <p className="text-xs text-muted-foreground mb-4">{t("rankings.source")}: {rankings.source}</p>
      )}
      {!rankings.verified && (
        <p className="text-xs text-warning mb-4">{t("rankings.unverified")}</p>
      )}
      <div className="space-y-3">
        {RANKING_ROWS.map(({ key, labelKey }) => (
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
