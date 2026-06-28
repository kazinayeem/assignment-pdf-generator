"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ExternalLink, MapPin, Mail, Phone, Star, Check, X,
  Share2, Bookmark, Printer,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { card, badge, button, animation } from "@/lib/design-system";
import type { University } from "@/lib/universities/types";
import { getAverageRating } from "@/lib/universities";
import { cn } from "@/lib/utils";

type UniversityDetailClientProps = {
  university: University;
};

const TABS = ["overview", "programs", "tuition", "admission", "facilities", "career", "reviews", "faqs"] as const;
type Tab = (typeof TABS)[number];

export function UniversityDetailClient({ university }: UniversityDetailClientProps) {
  const { t } = useTranslation("universities");
  const [tab, setTab] = useState<Tab>("overview");
  const [bookmarked, setBookmarked] = useState(false);
  const avgRating = getAverageRating(university);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: university.name, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-full">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-brand/10 via-background to-brand-accent/5">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <motion.div {...animation.fadeUp} className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand to-brand-secondary flex items-center justify-center text-2xl font-extrabold text-brand-foreground shrink-0">
              {university.shortName.slice(0, 3)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={badge.brand}>{t(`types.${university.type}`)}</span>
                <span className={badge.success}>{t("detail.verified")}</span>
                {university.rankings.national && (
                  <span className={badge.muted}>#{university.rankings.national} National</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground mb-2">
                {university.name}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2 mb-4">
                <MapPin size={16} aria-hidden />
                {university.address}
              </p>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={16} className={cn(i < Math.round(avgRating) ? "text-warning fill-warning" : "text-muted-foreground/30")} aria-hidden />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{avgRating.toFixed(1)} ({university.reviews.length} reviews)</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={university.admission.applyUrl ?? university.website} target="_blank" rel="noopener noreferrer" className={cn(button.primary, "inline-flex items-center gap-2")}>
                  {t("detail.apply")} <ExternalLink size={14} aria-hidden />
                </a>
                <a href={university.website} target="_blank" rel="noopener noreferrer" className={cn(button.secondary, "inline-flex items-center gap-2")}>
                  {t("detail.website")} <ExternalLink size={14} aria-hidden />
                </a>
                <button type="button" onClick={() => setBookmarked(!bookmarked)} className={cn(button.ghost, "inline-flex items-center gap-2")}>
                  <Bookmark size={14} className={bookmarked ? "fill-brand text-brand" : ""} aria-hidden /> {t("detail.bookmark")}
                </button>
                <button type="button" onClick={handleShare} className={cn(button.ghost, "inline-flex items-center gap-2")}>
                  <Share2 size={14} aria-hidden /> {t("detail.share")}
                </button>
                <button type="button" onClick={() => window.print()} className={cn(button.ghost, "inline-flex items-center gap-2")}>
                  <Printer size={14} aria-hidden /> {t("detail.print")}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sticky sidebar */}
          <aside className="lg:w-64 shrink-0">
            <nav className="lg:sticky lg:top-24 flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0" aria-label="Sections">
              {TABS.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap min-h-[44px] text-left transition-colors",
                    tab === id ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {t(`detail.${id === "overview" ? "quickFacts" : id}`)}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {tab === "overview" && (
              <motion.div {...animation.fadeUp} className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: t("detail.established"), value: university.established },
                    { label: t("detail.students"), value: university.studentPopulation.toLocaleString() },
                    { label: t("detail.faculty"), value: university.facultyCount.toLocaleString() },
                    { label: t("detail.departments"), value: university.departmentCount },
                    { label: t("detail.division"), value: university.division },
                    { label: t("detail.specialization"), value: university.specialization },
                  ].map((item) => (
                    <div key={item.label} className={cn(card.base, "p-4")}>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-lg font-bold text-foreground mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className={cn(card.base, "p-5")}>
                    <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                      <Check size={16} className="text-success" aria-hidden /> {t("detail.pros")}
                    </h3>
                    <ul className="space-y-2">
                      {university.pros.map((p) => (
                        <li key={p} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-success mt-1">+</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={cn(card.base, "p-5")}>
                    <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                      <X size={16} className="text-destructive" aria-hidden /> {t("detail.cons")}
                    </h3>
                    <ul className="space-y-2">
                      {university.cons.map((c) => (
                        <li key={c} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-destructive mt-1">−</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {(university.email || university.phone) && (
                  <div className={cn(card.base, "p-5")}>
                    <h3 className="font-bold text-foreground mb-3">{t("detail.contact")}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {university.email && <p className="flex items-center gap-2"><Mail size={14} aria-hidden /> {university.email}</p>}
                      {university.phone && <p className="flex items-center gap-2"><Phone size={14} aria-hidden /> {university.phone}</p>}
                    </div>
                  </div>
                )}

                {university.mapUrl && (
                  <a href={university.mapUrl} target="_blank" rel="noopener noreferrer" className={cn(card.base, "p-5 flex items-center gap-3 hover:border-brand/30 transition-colors")}>
                    <MapPin size={20} className="text-brand" aria-hidden />
                    <span className="font-semibold text-foreground">{t("detail.map")}</span>
                  </a>
                )}
              </motion.div>
            )}

            {tab === "programs" && (
              <motion.div {...animation.fadeUp} className="space-y-3">
                {university.programs.map((p) => (
                  <div key={p.id} className={cn(card.base, "p-5")}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-foreground">{p.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{p.faculty} · {p.department}</p>
                      </div>
                      <span className={badge.muted}>{p.degree}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                      <span>{p.durationYears} years</span>
                      <span>{p.creditHours} credits</span>
                      <span>{p.semesterCount} semesters</span>
                      <span>{p.shifts.join(", ")}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {tab === "tuition" && (
              <motion.div {...animation.fadeUp} className={cn(card.base, "p-6 overflow-x-auto")}>
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      ["Admission Fee", university.tuition.admissionFee],
                      ["Registration Fee", university.tuition.registrationFee],
                      ["Per Credit Fee", university.tuition.perCreditFee],
                      ["Semester Fee", university.tuition.semesterFee],
                      ["Lab Fee", university.tuition.labFee],
                      ["Development Fee", university.tuition.developmentFee],
                      ["Library Fee", university.tuition.libraryFee],
                      ["Exam Fee", university.tuition.examFee],
                      [t("detail.perSemester"), university.tuition.totalPerSemester],
                      [t("detail.totalDegree"), university.tuition.estimatedGraduationCost],
                    ].map(([label, value]) => (
                      <tr key={String(label)} className="border-b border-border last:border-0">
                        <td className="py-3 text-muted-foreground">{label}</td>
                        <td className="py-3 text-right font-semibold text-foreground">৳{Number(value).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-sm text-muted-foreground mt-4">{university.tuition.waiverPolicy}</p>
              </motion.div>
            )}

            {tab === "admission" && (
              <motion.div {...animation.fadeUp} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className={cn(card.base, "p-4")}>
                    <p className="text-xs text-muted-foreground">{t("detail.sscMin")}</p>
                    <p className="text-xl font-bold">{university.admission.sscGpaMin}</p>
                  </div>
                  <div className={cn(card.base, "p-4")}>
                    <p className="text-xs text-muted-foreground">{t("detail.hscMin")}</p>
                    <p className="text-xl font-bold">{university.admission.hscGpaMin}</p>
                  </div>
                </div>
                <div className={cn(card.base, "p-5")}>
                  <h3 className="font-bold mb-3">{university.admission.testPattern}</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    {university.admission.process.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            )}

            {tab === "facilities" && (
              <motion.div {...animation.fadeUp} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "Library", value: university.facilities.library },
                  { label: "Hostel", value: university.facilities.hostel },
                  { label: "Transport", value: university.facilities.transport },
                  { label: "Medical", value: university.facilities.medical },
                  { label: "Sports", value: university.facilities.sports },
                ].map((f) => (
                  <div key={f.label} className={cn(card.base, "p-4 text-center")}>
                    {f.value ? <Check size={20} className="text-success mx-auto mb-2" /> : <X size={20} className="text-muted-foreground/40 mx-auto mb-2" />}
                    <p className="text-sm font-medium">{f.label}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {tab === "career" && (
              <motion.div {...animation.fadeUp} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className={cn(card.base, "p-5")}>
                    <p className="text-xs text-muted-foreground">Employment Rate</p>
                    <p className="text-2xl font-bold text-brand">{university.career.employmentRate}%</p>
                  </div>
                  <div className={cn(card.base, "p-5")}>
                    <p className="text-xs text-muted-foreground">Avg Starting Salary</p>
                    <p className="text-2xl font-bold">৳{university.career.avgStartingSalary.toLocaleString()}</p>
                  </div>
                </div>
                <div className={cn(card.base, "p-5")}>
                  <h3 className="font-bold mb-2">Top Recruiters</h3>
                  <div className="flex flex-wrap gap-2">
                    {university.career.topRecruiters.map((r) => (
                      <span key={r} className={badge.muted}>{r}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "reviews" && (
              <motion.div {...animation.fadeUp} className="space-y-4">
                {university.reviews.map((r) => (
                  <div key={r.id} className={cn(card.base, "p-5")}>
                    <div className="flex gap-1 mb-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} size={14} className={cn(i < r.rating ? "text-warning fill-warning" : "text-muted-foreground/30")} aria-hidden />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">&ldquo;{r.review}&rdquo;</p>
                    <p className="text-xs text-muted-foreground">{r.department} · {r.graduationYear}</p>
                  </div>
                ))}
                <Link href={`/universities/${university.slug}#review`} className={cn(button.secondary, "inline-flex")}>
                  {t("detail.writeReview")}
                </Link>
              </motion.div>
            )}

            {tab === "faqs" && (
              <motion.div {...animation.fadeUp} className="space-y-3">
                {university.faqs.map((faq) => (
                  <details key={faq.question} className={cn(card.base, "p-5 group")}>
                    <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
                      {faq.question}
                    </summary>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
