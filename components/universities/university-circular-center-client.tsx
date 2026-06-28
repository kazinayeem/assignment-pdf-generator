"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Download, Share2, Bookmark, Search, ExternalLink, Clock } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { getAllCirculars, filterCirculars } from "@/lib/universities/circulars";
import { saveCircularOffline } from "@/lib/universities/offline";
import { UniversityLogo } from "./university-logo";
import { getUniversity } from "@/lib/universities";
import { card, badge, button, animation } from "@/lib/design-system";
import { formatCurrency } from "@/lib/universities/format";
import { cn } from "@/lib/utils";

export function UniversityCircularCenterClient() {
  const { t } = useTranslation("universities");
  const [query, setQuery] = useState("");
  const all = useMemo(() => getAllCirculars(), []);
  const filtered = useMemo(() => filterCirculars(all, query), [all, query]);
  const latest = filtered.filter((c) => c.isLatest);
  const past = filtered.filter((c) => !c.isLatest);

  const handleShare = async (title: string, slug: string) => {
    const url = `${window.location.origin}/universities/${slug}`;
    if (navigator.share) await navigator.share({ title, url });
    else await navigator.clipboard.writeText(url);
  };

  const CircularCard = ({ c }: { c: ReturnType<typeof getAllCirculars>[0] }) => {
    const uni = getUniversity(c.universitySlug);
    if (!uni) return null;
    return (
      <motion.div {...animation.fadeUp} className={cn(card.base, "p-5")}>
        <div className="flex items-start gap-3 mb-3">
          <UniversityLogo university={uni} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-1">
              {c.isLatest && <span className={cn(badge.brand, "text-[10px]")}>{t("circulars.latest")}</span>}
            </div>
            <h3 className="font-bold text-foreground">{c.title}</h3>
            <p className="text-xs text-muted-foreground">{c.universityName}</p>
          </div>
        </div>
        {c.deadline && (
          <p className="text-sm text-warning flex items-center gap-1 mb-2">
            <Clock size={14} /> {t("circulars.deadline")}: {c.deadline}
          </p>
        )}
        {c.applicationFee != null && (
          <p className="text-sm text-muted-foreground mb-2">{t("circulars.fee")}: {formatCurrency(c.applicationFee)}</p>
        )}
        {c.eligibility.length > 0 && (
          <ul className="text-xs text-muted-foreground mb-3 space-y-0.5">
            {c.eligibility.map((e) => <li key={e}>• {e}</li>)}
          </ul>
        )}
        <div className="flex flex-wrap gap-2">
          {c.pdfUrl && (
            <a href={c.pdfUrl} target="_blank" rel="noopener noreferrer" className={cn(button.secondary, "text-xs inline-flex items-center gap-1")}>
              <Download size={12} /> {t("circulars.downloadPdf")}
            </a>
          )}
          {c.applyUrl && (
            <a href={c.applyUrl} target="_blank" rel="noopener noreferrer" className={cn(button.primary, "text-xs inline-flex items-center gap-1")}>
              <ExternalLink size={12} /> {t("circulars.apply")}
            </a>
          )}
          <button type="button" onClick={() => saveCircularOffline(c.id)} className={cn(button.ghost, "text-xs inline-flex items-center gap-1")}>
            <Bookmark size={12} /> {t("circulars.saveOffline")}
          </button>
          <button type="button" onClick={() => handleShare(c.title, c.universitySlug)} className={cn(button.ghost, "text-xs inline-flex items-center gap-1")}>
            <Share2 size={12} /> {t("detail.share")}
          </button>
          <Link href={`/universities/${c.universitySlug}`} className={cn(button.ghost, "text-xs")}>
            {t("landing.viewDetails")} →
          </Link>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div {...animation.fadeUp} className="mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold mb-3 border border-brand/20">
          <FileText size={12} /> {t("circulars.badge")}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">{t("circulars.title")}</h1>
        <p className="text-muted-foreground">{t("circulars.subtitle")}</p>
      </motion.div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("circulars.search")}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm min-h-[44px]"
        />
      </div>

      {latest.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4">{t("circulars.latestSection")}</h2>
          <div className="space-y-4">{latest.map((c) => <CircularCard key={c.id} c={c} />)}</div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-4">{t("circulars.pastSection")}</h2>
          <div className="space-y-4">{past.map((c) => <CircularCard key={c.id} c={c} />)}</div>
        </section>
      )}

      {filtered.length === 0 && (
        <p className={cn(card.base, "p-8 text-center text-muted-foreground")}>{t("circulars.empty")}</p>
      )}
    </div>
  );
}
