"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, GraduationCap, BookOpen, Users, Briefcase } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { card, badge, animation } from "@/lib/design-system";
import type { ProgramLevel, University } from "@/lib/universities/types";
import { getFaculties, getUniversityDepartments, filterDepartments } from "@/lib/universities/departments";
import { cn } from "@/lib/utils";

type UniversityDepartmentExplorerProps = {
  university: University;
};

export function UniversityDepartmentExplorer({ university }: UniversityDepartmentExplorerProps) {
  const { t } = useTranslation("universities");
  const [query, setQuery] = useState("");
  const [faculty, setFaculty] = useState("all");
  const [level, setLevel] = useState<ProgramLevel | "all">("all");

  const departments = getUniversityDepartments(university);
  const faculties = getFaculties(university);
  const filtered = useMemo(
    () => filterDepartments(departments, query, faculty, level),
    [departments, query, faculty, level]
  );

  const levels: (ProgramLevel | "all")[] = ["all", "bachelor", "masters", "phd", "diploma"];

  return (
    <div className="space-y-6">
      <div className={cn(card.base, "p-4 sm:p-5 space-y-4")}>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("departments.search")}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm min-h-[44px]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={faculty} onChange={(e) => setFaculty(e.target.value)} className="px-3 py-2 rounded-xl border border-border bg-background text-xs min-h-[40px]">
            <option value="all">{t("departments.allFaculties")}</option>
            {faculties.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          {levels.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLevel(l)}
              className={cn(badge.muted, "text-[10px] capitalize", level === l && "!bg-brand/10 !text-brand !border-brand/20")}
            >
              {l === "all" ? t("filters.all") : t(`departments.levels.${l}`)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className={cn(card.base, "p-6 text-sm text-muted-foreground text-center")}>{t("departments.empty")}</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((dept, i) => (
            <motion.div key={dept.slug} {...animation.fadeUp} {...animation.stagger(i)} className={cn(card.base, "p-5 hover:border-brand/30 transition-colors")}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                  <GraduationCap size={18} className="text-brand" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-foreground">{dept.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{dept.faculty}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{dept.overview}</p>
              <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><BookOpen size={10} />{dept.programs.length} {t("card.programs")}</span>
                {dept.programs[0] && <span>{dept.programs[0].creditHours} {t("compare.credits")}</span>}
                {dept.programs[0] && <span>{dept.programs[0].durationYears}y</span>}
              </div>
              {dept.headOfDepartment && (
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Users size={10} /> {t("departments.hod")}: {dept.headOfDepartment}
                </p>
              )}
              {dept.careerOpportunities.length > 0 && (
                <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                  <Briefcase size={10} /> {dept.careerOpportunities.slice(0, 2).join(", ")}
                </p>
              )}
              <Link
                href={`/universities/${university.slug}/departments/${dept.slug}`}
                className="text-xs font-semibold text-brand hover:underline"
              >
                {t("departments.viewDetails")} →
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
