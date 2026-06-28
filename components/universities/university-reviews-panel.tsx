"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { getUserReviews, addUserReview } from "@/lib/universities/storage";
import type { University, UniversityReview } from "@/lib/universities/types";
import { card, button, animation, badge } from "@/lib/design-system";
import { cn } from "@/lib/utils";

type UniversityReviewsPanelProps = {
  university: University;
};

export function UniversityReviewsPanel({ university }: UniversityReviewsPanelProps) {
  const { t } = useTranslation("universities");
  const [reviews, setReviews] = useState<UniversityReview[]>(() => [
    ...university.reviews,
    ...getUserReviews(university.slug),
  ]);
  const [filterDept, setFilterDept] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    rating: 4,
    review: "",
    department: "CSE",
    graduationYear: new Date().getFullYear(),
    anonymous: true,
    pros: "",
    cons: "",
    difficulty: 3,
    campusLife: 4,
    facultyRating: 4,
    hostelRating: 3,
    placementRating: 4,
  });

  const filtered = useMemo(() => {
    if (!filterDept) return reviews;
    return reviews.filter((r) => r.department.toLowerCase().includes(filterDept.toLowerCase()));
  }, [reviews, filterDept]);

  const avgRating = reviews.length
    ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview: UniversityReview = {
      id: `user-${Date.now()}`,
      rating: form.rating,
      review: form.review,
      department: form.department,
      graduationYear: form.graduationYear,
      pros: form.pros.split(",").map((s) => s.trim()).filter(Boolean),
      cons: form.cons.split(",").map((s) => s.trim()).filter(Boolean),
      anonymous: form.anonymous,
      difficulty: form.difficulty,
      campusLife: form.campusLife,
      facultyRating: form.facultyRating,
      hostelRating: form.hostelRating,
      placementRating: form.placementRating,
      helpful: 0,
    };
    const updated = addUserReview(university.slug, newReview);
    setReviews([...university.reviews, ...updated]);
    setShowForm(false);
    setForm({ ...form, review: "", pros: "", cons: "" });
  };

  return (
    <motion.div {...animation.fadeUp} className="space-y-4">
      <div className={cn(card.base, "p-5 flex flex-wrap items-center gap-4")}>
        {avgRating != null ? (
          <>
            <div className="text-center">
              <p className="text-3xl font-extrabold text-brand">{avgRating.toFixed(1)}</p>
              <div className="flex gap-0.5 justify-center mt-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={12} className={cn(i < Math.round(avgRating) ? "text-warning fill-warning" : "text-muted-foreground/30")} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold">{reviews.length} {t("reviews.count")}</p>
              <span className={cn(badge.success, "text-[10px] mt-1")}><ShieldCheck size={10} /> {t("reviews.verified")}</span>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{t("reviews.empty")}</p>
        )}
        <div className="flex-1" />
        <input
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          placeholder={t("reviews.filterDept")}
          className="px-3 py-2 rounded-xl border border-border bg-background text-sm min-h-[40px] w-40"
        />
        <button type="button" onClick={() => setShowForm(!showForm)} className={cn(button.primary, "text-sm")}>
          {t("detail.writeReview")}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={cn(card.base, "p-5 space-y-4")}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">{t("review.rating")}</label>
              <input type="range" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full accent-brand" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">{t("review.department")}</label>
              <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm" />
            </div>
          </div>
          <textarea value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} required rows={3} placeholder={t("review.review")} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm" />
          <div className="grid sm:grid-cols-2 gap-4">
            <input value={form.pros} onChange={(e) => setForm({ ...form, pros: e.target.value })} placeholder={t("review.pros")} className="px-3 py-2 rounded-xl border border-border bg-background text-sm" />
            <input value={form.cons} onChange={(e) => setForm({ ...form, cons: e.target.value })} placeholder={t("review.cons")} className="px-3 py-2 rounded-xl border border-border bg-background text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.anonymous} onChange={(e) => setForm({ ...form, anonymous: e.target.checked })} className="accent-brand" />
            {t("review.anonymous")}
          </label>
          <button type="submit" className={cn(button.primary, "text-sm")}>{t("review.submit")}</button>
        </form>
      )}

      {filtered.map((r) => (
        <div key={r.id} className={cn(card.base, "p-5")}>
          <div className="flex gap-1 mb-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={14} className={cn(i < r.rating ? "text-warning fill-warning" : "text-muted-foreground/30")} />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mb-2">&ldquo;{r.review}&rdquo;</p>
          <p className="text-xs text-muted-foreground">{r.department} · {r.graduationYear}</p>
          {(r.difficulty != null || r.campusLife != null) && (
            <div className="flex flex-wrap gap-2 mt-2 text-[10px] text-muted-foreground">
              {r.difficulty != null && <span>{t("reviews.difficulty")}: {r.difficulty}/5</span>}
              {r.campusLife != null && <span>{t("reviews.campusLife")}: {r.campusLife}/5</span>}
              {r.facultyRating != null && <span>{t("reviews.faculty")}: {r.facultyRating}/5</span>}
            </div>
          )}
          <button type="button" className="mt-2 text-xs text-muted-foreground hover:text-brand flex items-center gap-1">
            <ThumbsUp size={12} /> {t("reviews.helpful")}
          </button>
        </div>
      ))}
    </motion.div>
  );
}
