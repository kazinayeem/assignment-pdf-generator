"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Search, Printer, Download, BookOpen } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { card, badge, button, animation } from "@/lib/design-system";
import type { DepartmentDetail, University } from "@/lib/universities/types";
import { getDepartmentCurriculum, searchCourses } from "@/lib/universities/curriculum";
import { exportCurriculumPdf } from "@/lib/universities/pdf-export";
import { generateDepartmentSummary } from "@/lib/universities/ai-summaries";
import { cn } from "@/lib/utils";

type UniversityCurriculumViewerProps = {
  university: University;
  department: DepartmentDetail;
};

export function UniversityCurriculumViewer({ university, department }: UniversityCurriculumViewerProps) {
  const { t } = useTranslation("universities");
  const curriculum = getDepartmentCurriculum(department);
  const [expanded, setExpanded] = useState<Set<number>>(new Set([1]));
  const [courseQuery, setCourseQuery] = useState("");
  const searchResults = searchCourses(curriculum, courseQuery);
  const aiSummary = generateDepartmentSummary(university, department.slug);

  const toggle = (n: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  };

  const expandAll = () => setExpanded(new Set(curriculum.map((s) => s.number)));
  const collapseAll = () => setExpanded(new Set());

  return (
    <div className="space-y-6">
      <motion.div {...animation.fadeUp} className={cn(card.base, "p-5 bg-gradient-to-br from-brand/5 to-transparent")}>
        <p className="text-xs font-semibold text-brand mb-1">AI</p>
        <p className="text-sm text-muted-foreground">{aiSummary}</p>
      </motion.div>

      <div className={cn(card.base, "p-4 flex flex-wrap gap-3 items-center")}>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={courseQuery}
            onChange={(e) => setCourseQuery(e.target.value)}
            placeholder={t("curriculum.searchCourses")}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-sm min-h-[40px]"
          />
        </div>
        <button type="button" onClick={expandAll} className={cn(button.ghost, "text-xs")}>{t("curriculum.expandAll")}</button>
        <button type="button" onClick={collapseAll} className={cn(button.ghost, "text-xs")}>{t("curriculum.collapseAll")}</button>
        <button type="button" onClick={() => window.print()} className={cn(button.secondary, "text-xs inline-flex items-center gap-1")}>
          <Printer size={12} /> {t("curriculum.print")}
        </button>
        <button type="button" onClick={() => exportCurriculumPdf(university, department, curriculum)} className={cn(button.secondary, "text-xs inline-flex items-center gap-1")}>
          <Download size={12} /> {t("pdf.export")}
        </button>
      </div>

      {courseQuery && searchResults.length > 0 && (
        <div className={cn(card.base, "p-4")}>
          <p className="text-xs font-bold mb-2">{t("curriculum.searchResults")}</p>
          {searchResults.map(({ semester, course }) => (
            <p key={`${semester}-${course.code}`} className="text-sm text-muted-foreground">
              Sem {semester}: <span className="font-mono text-foreground">{course.code}</span> — {course.name}
            </p>
          ))}
        </div>
      )}

      <p className="text-xs text-warning">{t("curriculum.verifyNote")}</p>

      <div className="space-y-3">
        {curriculum.map((sem) => {
          const isOpen = expanded.has(sem.number);
          const totalCredits = sem.courses.reduce((s, c) => s + c.credits, 0);
          return (
            <div key={sem.number} className={cn(card.base, "overflow-hidden")}>
              <button
                type="button"
                onClick={() => toggle(sem.number)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
              >
                <span className="font-bold text-foreground flex items-center gap-2">
                  <BookOpen size={16} className="text-brand" />
                  {t("curriculum.semester")} {sem.number}
                  <span className={cn(badge.muted, "text-[10px]")}>{totalCredits} cr</span>
                </span>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {isOpen && (
                <div className="border-t border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs text-muted-foreground">
                        <th className="p-3 text-left">{t("curriculum.code")}</th>
                        <th className="p-3 text-left">{t("curriculum.course")}</th>
                        <th className="p-3 text-center">{t("curriculum.credits")}</th>
                        <th className="p-3 text-center">{t("curriculum.type")}</th>
                        <th className="p-3 text-center">{t("curriculum.category")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sem.courses.map((c) => (
                        <tr key={c.code} className="border-b border-border last:border-0 hover:bg-muted/30">
                          <td className="p-3 font-mono text-xs">{c.code}</td>
                          <td className="p-3">
                            <p className="font-medium text-foreground">{c.name}</p>
                            {c.prerequisites?.length ? (
                              <p className="text-[10px] text-muted-foreground">{t("curriculum.prereq")}: {c.prerequisites.join(", ")}</p>
                            ) : null}
                            {c.description && <p className="text-[10px] text-muted-foreground mt-0.5">{c.description}</p>}
                          </td>
                          <td className="p-3 text-center">{c.credits}</td>
                          <td className="p-3 text-center capitalize text-xs">{c.type}</td>
                          <td className="p-3 text-center">
                            <span className={cn(badge.muted, "text-[10px] capitalize")}>{c.category}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {department.curriculumUrl && (
        <Link href={department.curriculumUrl} target="_blank" className="text-sm text-brand font-semibold hover:underline">
          {t("departments.downloadCurriculum")} →
        </Link>
      )}
    </div>
  );
}
