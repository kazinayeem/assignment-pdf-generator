"use client";

import { useEffect, useState } from "react";
import { Bell, Calendar } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { card, button } from "@/lib/design-system";
import type { AdmissionCalendar, University } from "@/lib/universities/types";
import { cn } from "@/lib/utils";

function parseDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function useCountdown(target: Date | null) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    if (!target) return;
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setRemaining("0d 0h 0m"); return; }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      setRemaining(`${days}d ${hours}h ${mins}m`);
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [target]);

  return remaining;
}

export function UniversityAdmissionCountdown({ university }: { university: University }) {
  const { t } = useTranslation("universities");
  const cal: AdmissionCalendar = university.admissionCalendar ?? {
    applicationDeadline: university.admission.applicationDeadline,
  };

  const events = [
    { key: "applicationOpens", date: cal.applicationOpens, label: t("countdown.opens") },
    { key: "applicationDeadline", date: cal.applicationDeadline ?? university.admission.applicationDeadline, label: t("countdown.deadline") },
    { key: "admissionTest", date: cal.admissionTest, label: t("countdown.test") },
    { key: "resultDate", date: cal.resultDate, label: t("countdown.result") },
    { key: "orientation", date: cal.orientation, label: t("countdown.orientation") },
    { key: "semesterStart", date: cal.semesterStart, label: t("countdown.semester") },
  ];

  const deadline = parseDate(cal.applicationDeadline ?? university.admission.applicationDeadline ?? undefined);
  const countdown = useCountdown(deadline);

  return (
    <div className={cn(card.base, "p-5 sm:p-6")}>
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
        <Calendar size={18} className="text-brand" /> {t("countdown.title")}
      </h3>

      {deadline && countdown && (
        <div className="mb-4 p-4 rounded-xl bg-brand/10 border border-brand/20 text-center">
          <p className="text-xs text-muted-foreground mb-1">{t("countdown.timeLeft")}</p>
          <p className="text-2xl font-extrabold text-brand tabular-nums">{countdown}</p>
        </div>
      )}

      <div className="space-y-2 mb-4">
        {events.map((e) => (
          <div key={e.key} className="flex items-center justify-between py-2 border-b border-border last:border-0 text-sm">
            <span className="text-muted-foreground">{e.label}</span>
            <span className="font-medium text-foreground">{e.date ?? t("data.unavailable")}</span>
          </div>
        ))}
      </div>

      <button type="button" className={cn(button.secondary, "inline-flex items-center gap-2 text-sm w-full justify-center")} onClick={() => {
        if (typeof window !== "undefined" && "Notification" in window) {
          Notification.requestPermission();
        }
      }}>
        <Bell size={14} /> {t("countdown.reminder")}
      </button>
    </div>
  );
}
