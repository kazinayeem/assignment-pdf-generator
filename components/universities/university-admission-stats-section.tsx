"use client";

import { useTranslation } from "@/lib/i18n/provider";
import { getAdmissionStatistics } from "@/lib/universities/v3-data";
import type { University } from "@/lib/universities/types";
import { card, badge } from "@/lib/design-system";
import { cn } from "@/lib/utils";

function StatBar({ label, value, max }: { label: string; value: number | null; max: number }) {
  const pct = value != null && max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{value ?? "N/A"}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full bg-brand transition-all" style={{ width: value != null ? `${pct}%` : "0%" }} />
      </div>
    </div>
  );
}

export function UniversityAdmissionStatsSection({ university }: { university: University }) {
  const { t } = useTranslation("universities");
  const stats = getAdmissionStatistics(university);
  const unavailable = t("data.unavailable");

  return (
    <div className="space-y-4">
      {!stats.verified && (
        <p className="text-xs text-warning">{t("stats.unverified")}</p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: t("stats.applicants"), value: stats.applicants },
          { label: t("stats.selected"), value: stats.selected },
          { label: t("stats.acceptanceRate"), value: stats.acceptanceRate != null ? `${stats.acceptanceRate}%` : null },
          { label: t("stats.seats"), value: stats.availableSeats },
          { label: t("stats.competition"), value: stats.competitionRatio },
          { label: t("stats.avgGpa"), value: stats.avgGpa },
        ].map((s) => (
          <div key={s.label} className={cn(card.base, "p-4 text-center")}>
            <p className="text-[10px] text-muted-foreground uppercase mb-1">{s.label}</p>
            <p className="text-xl font-extrabold text-foreground">{s.value ?? unavailable}</p>
          </div>
        ))}
      </div>

      {stats.byDepartment.length > 0 && (
        <div className={cn(card.base, "p-5")}>
          <h4 className="font-bold mb-4">{t("stats.byDepartment")}</h4>
          <div className="space-y-3">
            {stats.byDepartment.map((d) => (
              <div key={d.department} className="flex items-center gap-3">
                <span className={cn(badge.muted, "text-[10px] shrink-0 w-16")}>{d.department}</span>
                <div className="flex-1 space-y-1">
                  <StatBar label={t("stats.applicants")} value={d.applicants} max={d.applicants ?? 1000} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
