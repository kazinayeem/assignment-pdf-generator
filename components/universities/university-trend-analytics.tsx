"use client";

import { useTranslation } from "@/lib/i18n/provider";
import { getTrendMetrics } from "@/lib/universities/v3-data";
import type { University } from "@/lib/universities/types";
import { card } from "@/lib/design-system";
import { cn } from "@/lib/utils";

export function UniversityTrendAnalytics({ university }: { university: University }) {
  const { t } = useTranslation("universities");
  const trends = getTrendMetrics(university);

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">{t("trends.note")}</p>
      {trends.map((metric) => {
        const values = metric.data.map((d) => d.value).filter((v): v is number => v != null);
        const max = Math.max(...values, 1);
        return (
          <div key={metric.key} className={cn(card.base, "p-5")}>
            <h4 className="font-bold text-foreground mb-4">{metric.label}</h4>
            <div className="flex items-end gap-2 h-32">
              {metric.data.map((d) => {
                const height = d.value != null ? (d.value / max) * 100 : 4;
                return (
                  <div key={d.year} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-brand to-brand-accent min-h-[4px] transition-all"
                      style={{ height: `${height}%` }}
                      title={d.value != null ? String(d.value) : "N/A"}
                    />
                    <span className="text-[9px] text-muted-foreground">{d.year}</span>
                  </div>
                );
              })}
            </div>
            {values.length === 0 && (
              <p className="text-xs text-muted-foreground text-center mt-2">{t("data.unavailable")}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
