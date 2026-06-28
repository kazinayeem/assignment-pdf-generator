"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink, MapPin, Mail, Phone, Star, Check, X,
  Share2, Bookmark, Printer, Download,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { card, badge, button, animation } from "@/lib/design-system";
import type { University } from "@/lib/universities/types";
import { getAverageRating } from "@/lib/universities";
import { formatCount, formatCurrency, formatTuitionRange } from "@/lib/universities/format";
import { addRecentlyViewed, isFavorite, toggleFavorite } from "@/lib/universities/storage";
import { exportUniversityPdf } from "@/lib/universities/pdf-export";
import { UniversityLogo } from "./university-logo";
import { UniversityRankingsSection } from "./university-rankings-section";
import { UniversityGallery } from "./university-gallery";
import { UniversityCampusMap } from "./university-campus-map";
import { UniversityVirtualTour } from "./university-virtual-tour";
import { UniversityAdmissionCountdown } from "./university-admission-countdown";
import { UniversityEmployabilitySection } from "./university-employability-section";
import { UniversityReviewsPanel } from "./university-reviews-panel";
import { cn } from "@/lib/utils";

type UniversityDetailClientProps = {
  university: University;
};

const TABS = ["overview", "programs", "tuition", "admission", "rankings", "gallery", "campus", "tour", "facilities", "career", "reviews", "faqs"] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  overview: "quickFacts",
  programs: "programs",
  tuition: "tuition",
  admission: "admission",
  rankings: "rankings",
  gallery: "gallery",
  campus: "map",
  tour: "tour",
  facilities: "facilities",
  career: "career",
  reviews: "reviews",
  faqs: "faqs",
};

function formatFee(value: number | null, unavailable: string): string {
  return value != null ? formatCurrency(value) : unavailable;
}

export function UniversityDetailClient({ university }: UniversityDetailClientProps) {
  const { t } = useTranslation("universities");
  const [tab, setTab] = useState<Tab>("overview");
  const [bookmarked, setBookmarked] = useState(false);
  const avgRating = getAverageRating(university);

  useEffect(() => {
    addRecentlyViewed(university.slug);
    setBookmarked(isFavorite(university.slug));
  }, [university.slug]);
  const unavailable = t("data.unavailable");
  const tuitionLabels = {
    unavailable: t("tuition.unavailable"),
    variesByDepartment: t("tuition.variesByDepartment"),
    startingFrom: t("tuition.startingFrom"),
    estimated: t("tuition.estimated"),
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: university.name, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-full">
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-brand/10 via-background to-brand-accent/5">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <motion.div {...animation.fadeUp} className="flex flex-col lg:flex-row gap-8 items-start">
            <UniversityLogo university={university} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={badge.brand}>{t(`types.${university.type}`)}</span>
                {university.ugcApproved && <span className={badge.success}>{t("detail.verified")}</span>}
                {university.admission.isOpen === true && <span className={badge.success}>{t("admission.open")}</span>}
                <UniversityRankingsSection rankings={university.rankings} compact />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground mb-2">
                {university.name}
              </h1>
              <p className="text-sm text-muted-foreground mb-1">{university.shortName}</p>
              <p className="text-muted-foreground flex items-center gap-2 mb-4">
                <MapPin size={16} aria-hidden />
                {university.address}
              </p>
              {avgRating != null && (
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} size={16} className={cn(i < Math.round(avgRating) ? "text-warning fill-warning" : "text-muted-foreground/30")} aria-hidden />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{avgRating.toFixed(1)} ({university.reviews.length} reviews)</span>
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                <a href={university.admission.applyUrl ?? university.website} target="_blank" rel="noopener noreferrer" className={cn(button.primary, "inline-flex items-center gap-2")}>
                  {t("detail.apply")} <ExternalLink size={14} aria-hidden />
                </a>
                <a href={university.website} target="_blank" rel="noopener noreferrer" className={cn(button.secondary, "inline-flex items-center gap-2")}>
                  {t("detail.website")} <ExternalLink size={14} aria-hidden />
                </a>
                <button type="button" onClick={() => { toggleFavorite(university.slug); setBookmarked(isFavorite(university.slug)); }} className={cn(button.ghost, "inline-flex items-center gap-2")}>
                  <Bookmark size={14} className={bookmarked ? "fill-brand text-brand" : ""} aria-hidden /> {t("detail.bookmark")}
                </button>
                <button type="button" onClick={() => exportUniversityPdf(university)} className={cn(button.ghost, "inline-flex items-center gap-2")}>
                  <Download size={14} aria-hidden /> {t("pdf.export")}
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
                  {t(`detail.${TAB_LABELS[id]}`)}
                </button>
              ))}
            </nav>
          </aside>

          <div className="flex-1 min-w-0">
            {tab === "overview" && (
              <motion.div {...animation.fadeUp} className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: t("detail.established"), value: university.established },
                    { label: t("detail.students"), value: formatCount(university.studentPopulation, unavailable) },
                    { label: t("detail.faculty"), value: formatCount(university.facultyCount, unavailable) },
                    { label: t("detail.departments"), value: formatCount(university.departmentCount, unavailable) },
                    { label: t("detail.division"), value: university.division },
                    { label: t("detail.specialization"), value: university.specialization },
                  ].map((item) => (
                    <div key={item.label} className={cn(card.base, "p-4")}>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-lg font-bold text-foreground mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className={cn(card.base, "p-5")}>
                  <UniversityAdmissionCountdown university={university} />
                </div>

                <UniversityRankingsSection rankings={university.rankings} />

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
              <motion.div {...animation.fadeUp} className="space-y-4">
                <div className={cn(card.base, "p-5")}>
                  <p className="text-lg font-bold text-foreground">{formatTuitionRange(university.tuition, tuitionLabels)}</p>
                  {!university.tuition.verified && (
                    <p className="text-sm text-warning mt-2">{t("tuition.verifyOnWebsite")}</p>
                  )}
                  {university.tuition.source && (
                    <p className="text-xs text-muted-foreground mt-1">{t("rankings.source")}: {university.tuition.source}</p>
                  )}
                </div>
                <div className={cn(card.base, "p-6 overflow-x-auto")}>
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        [t("tuition.admissionFee"), university.tuition.admissionFee],
                        [t("tuition.registrationFee"), university.tuition.registrationFee],
                        [t("tuition.perCreditFee"), university.tuition.perCreditFee],
                        [t("tuition.semesterFee"), university.tuition.semesterFee],
                        [t("tuition.labFee"), university.tuition.labFee],
                        [t("detail.perSemester"), university.tuition.totalPerSemester],
                        [t("detail.totalDegree"), university.tuition.estimatedGraduationCost],
                      ].map(([label, value]) => (
                        <tr key={String(label)} className="border-b border-border last:border-0">
                          <td className="py-3 text-muted-foreground">{label}</td>
                          <td className="py-3 text-right font-semibold text-foreground">{formatFee(value as number | null, unavailable)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {university.tuition.waiverPolicy && (
                    <p className="text-sm text-muted-foreground mt-4">{university.tuition.waiverPolicy}</p>
                  )}
                </div>
              </motion.div>
            )}

            {tab === "admission" && (
              <motion.div {...animation.fadeUp} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className={cn(card.base, "p-4")}>
                    <p className="text-xs text-muted-foreground">{t("detail.sscMin")}</p>
                    <p className="text-xl font-bold">{university.admission.sscGpaMin ?? unavailable}</p>
                  </div>
                  <div className={cn(card.base, "p-4")}>
                    <p className="text-xs text-muted-foreground">{t("detail.hscMin")}</p>
                    <p className="text-xl font-bold">{university.admission.hscGpaMin ?? unavailable}</p>
                  </div>
                </div>
                {university.admission.testPattern && (
                  <div className={cn(card.base, "p-5")}>
                    <h3 className="font-bold mb-3">{university.admission.testPattern}</h3>
                    {university.admission.process.length > 0 && (
                      <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                        {university.admission.process.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {tab === "gallery" && (
              <motion.div {...animation.fadeUp}>
                <UniversityGallery university={university} />
              </motion.div>
            )}

            {tab === "campus" && (
              <motion.div {...animation.fadeUp}>
                <UniversityCampusMap university={university} />
              </motion.div>
            )}

            {tab === "tour" && (
              <motion.div {...animation.fadeUp}>
                <UniversityVirtualTour university={university} />
              </motion.div>
            )}

            {tab === "rankings" && (
              <motion.div {...animation.fadeUp}>
                <UniversityRankingsSection rankings={university.rankings} />
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
              <motion.div {...animation.fadeUp}>
                <UniversityEmployabilitySection university={university} />
              </motion.div>
            )}

            {tab === "reviews" && (
              <UniversityReviewsPanel university={university} />
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
