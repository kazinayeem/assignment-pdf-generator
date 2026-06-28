"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { getDepartment } from "@/lib/universities/departments";
import type { University } from "@/lib/universities/types";
import { UniversityCurriculumViewer } from "./university-curriculum-viewer";
import { card, badge, animation } from "@/lib/design-system";
import { cn } from "@/lib/utils";

type UniversityDepartmentDetailClientProps = {
  university: University;
  deptSlug: string;
};

export function UniversityDepartmentDetailClient({ university, deptSlug }: UniversityDepartmentDetailClientProps) {
  const { t } = useTranslation("universities");
  const department = getDepartment(university, deptSlug);

  if (!department) {
    return (
      <div className="max-w-[900px] mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">{t("departments.notFound")}</p>
        <Link href={`/universities/${university.slug}`} className="text-brand font-semibold mt-4 inline-block">
          ← {t("nav.back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href={`/universities/${university.slug}`} className="text-sm text-muted-foreground hover:text-brand flex items-center gap-1 mb-6">
        <ArrowLeft size={14} /> {university.shortName}
      </Link>

      <motion.div {...animation.fadeUp} className="mb-8">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center">
            <GraduationCap size={28} className="text-brand" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">{department.name}</h1>
            <p className="text-muted-foreground">{department.faculty} · {university.name}</p>
          </div>
        </div>
      </motion.div>

      <motion.div {...animation.fadeUp} className={cn(card.base, "p-5 mb-6")}>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{department.overview}</p>
        {department.headOfDepartment && (
          <p className="text-sm"><strong>{t("departments.hod")}:</strong> {department.headOfDepartment}</p>
        )}
        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          {department.programs.map((p) => (
            <div key={p.id} className="p-3 rounded-xl bg-muted/50">
              <p className="font-semibold text-sm">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.degree} · {p.level} · {p.durationYears}y · {p.creditHours} cr</p>
            </div>
          ))}
        </div>
      </motion.div>

      {department.researchAreas.length > 0 && (
        <div className={cn(card.base, "p-5 mb-6")}>
          <h3 className="font-bold mb-2">{t("departments.research")}</h3>
          <div className="flex flex-wrap gap-2">{department.researchAreas.map((r) => <span key={r} className={badge.muted}>{r}</span>)}</div>
        </div>
      )}

      {department.admissionRequirements.length > 0 && (
        <div className={cn(card.base, "p-5 mb-6")}>
          <h3 className="font-bold mb-2">{t("departments.admissionReq")}</h3>
          <ul className="text-sm text-muted-foreground space-y-1">{department.admissionRequirements.map((r) => <li key={r}>• {r}</li>)}</ul>
        </div>
      )}

      <h2 className="text-lg font-bold mb-4">{t("curriculum.title")}</h2>
      <UniversityCurriculumViewer university={university} department={department} />
    </div>
  );
}
