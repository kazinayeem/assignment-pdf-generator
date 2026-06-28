"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImageIcon, Building2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { card, badge } from "@/lib/design-system";
import type { GalleryImage, University } from "@/lib/universities/types";
import { cn } from "@/lib/utils";

const CATEGORIES: GalleryImage["category"][] = [
  "campus", "library", "labs", "hostel", "auditorium", "sports", "classrooms", "events",
];

function defaultGallery(university: University): GalleryImage[] {
  return CATEGORIES.map((cat) => ({
    id: `${university.slug}-${cat}`,
    category: cat,
    caption: `${university.shortName} — ${cat}`,
  }));
}

export function UniversityGallery({ university }: { university: University }) {
  const { t } = useTranslation("universities");
  const images = university.gallery?.length ? university.gallery : defaultGallery(university);
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);
  const [filter, setFilter] = useState<GalleryImage["category"] | "all">("all");
  const filtered = filter === "all" ? images : images.filter((i) => i.category === filter);

  return (
    <div className={cn(card.base, "p-5 sm:p-6")}>
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
        <ImageIcon size={18} className="text-brand" /> {t("detail.gallery")}
      </h3>
      <div className="flex flex-wrap gap-2 mb-4">
        <button type="button" onClick={() => setFilter("all")} className={cn(badge.muted, filter === "all" && "!bg-brand/10 !text-brand !border-brand/20")}>{t("filters.all")}</button>
        {CATEGORIES.map((c) => (
          <button key={c} type="button" onClick={() => setFilter(c)} className={cn(badge.muted, "text-[10px] capitalize", filter === c && "!bg-brand/10 !text-brand")}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((img) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setLightbox(img)}
            className="aspect-[4/3] rounded-xl border border-border bg-muted/50 overflow-hidden hover:border-brand/30 transition-colors group relative"
          >
            {img.url ? (
              <Image src={img.url} alt={img.caption} fill className="object-cover" loading="lazy" sizes="200px" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-2">
                <Building2 size={24} className="mb-2 opacity-40" />
                <span className="text-[10px] text-center capitalize">{img.category}</span>
              </div>
            )}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-3">{t("gallery.placeholderNote")}</p>

      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
            <button type="button" className="absolute top-4 right-4 text-white p-2" onClick={() => setLightbox(null)} aria-label="Close">
              <X size={24} />
            </button>
            <div className="max-w-3xl w-full bg-card rounded-2xl p-4" onClick={(e) => e.stopPropagation()}>
              {lightbox.url ? (
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                  <Image src={lightbox.url} alt={lightbox.caption} fill className="object-contain" />
                </div>
              ) : (
                <div className="aspect-video rounded-xl bg-muted flex items-center justify-center mb-3">
                  <p className="text-muted-foreground text-sm">{t("gallery.noImage")}</p>
                </div>
              )}
              <p className="text-sm font-medium text-foreground">{lightbox.caption}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
