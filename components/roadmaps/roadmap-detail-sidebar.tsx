"use client";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/provider";
import type { Roadmap } from "@/lib/roadmaps/types";
import { RoadmapExportMenu } from "./roadmap-export-menu";

const LINKS = [
  { href: "#graph", labelKey: "detail.graph" },
  { href: "#interview-hub", labelKey: "expansion.interviewHub" },
  { href: "#coding-problems", labelKey: "expansion.codingProblems" },
  { href: "#resources", labelKey: "expansion.resources" },
  { href: "#career-outlook", labelKey: "expansion.career" },
  { href: "#learning-path", labelKey: "expansion.learningPath" },
  { href: "#portfolio-checklist", labelKey: "expansion.portfolio" },
  { href: "#readiness-score", labelKey: "expansion.readiness" },
] as const;

type Props = { roadmap: Roadmap };

export function RoadmapDetailSidebar({ roadmap }: Props) {
  const { t } = useTranslation("roadmaps");

  return (
    <aside className="hidden xl:block w-52 shrink-0">
      <nav className="sticky top-24 space-y-1">
        <p className="text-[10px] font-bold uppercase text-muted-foreground px-3 mb-2">{t("expansion.onThisPage")}</p>
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={cn(
              "block px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground",
              "hover:text-foreground hover:bg-muted transition-colors"
            )}
          >
            {t(link.labelKey)}
          </a>
        ))}
        <div className="pt-4 px-2">
          <RoadmapExportMenu roadmap={roadmap} className="w-full" />
        </div>
      </nav>
    </aside>
  );
}
