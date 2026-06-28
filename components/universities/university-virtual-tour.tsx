"use client";

import { useState } from "react";
import { Maximize2, ExternalLink } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { getVirtualTourSources } from "@/lib/universities/v3-data";
import { card, badge, button } from "@/lib/design-system";
import type { University } from "@/lib/universities/types";
import { cn } from "@/lib/utils";

export function UniversityVirtualTour({ university }: { university: University }) {
  const { t } = useTranslation("universities");
  const tours = getVirtualTourSources(university);
  const [fullscreen, setFullscreen] = useState<string | null>(null);

  if (tours.length === 0) {
    return (
      <div className={cn(card.base, "p-5")}>
        <p className="text-sm text-muted-foreground">{t("tour.unavailable")}</p>
      </div>
    );
  }

  const renderTour = (tour: ReturnType<typeof getVirtualTourSources>[0]) => {
    if (tour.type === "youtube" && tour.youtubeId) {
      return (
        <iframe
          title={tour.title}
          src={`https://www.youtube.com/embed/${tour.youtubeId}`}
          className="w-full h-full border-0"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
    if (tour.type === "streetview" && tour.url) {
      return (
        <iframe
          title={tour.title}
          src={tour.url.includes("embed") ? tour.url : `https://maps.google.com/maps?q=${encodeURIComponent(university.name)}&output=embed`}
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
        />
      );
    }
    return (
      <a href={tour.url} target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center text-sm text-brand font-semibold hover:bg-muted transition-colors">
        <ExternalLink size={16} className="mr-2" /> {t("tour.watchChannel")} →
      </a>
    );
  };

  return (
    <div className={cn(card.base, "p-5 sm:p-6")}>
      <h3 className="font-bold text-foreground mb-4">{t("tour.title")}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {tours.map((tour) => (
          <div key={tour.title}>
            <div className="flex items-center justify-between mb-2">
              <span className={cn(badge.muted, "text-[10px] capitalize")}>
                {t(`tour.types.${tour.type}`)} · {tour.category}
              </span>
              <button type="button" onClick={() => setFullscreen(tour.title)} className={cn(button.ghost, "p-1")} aria-label="Fullscreen">
                <Maximize2 size={14} />
              </button>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden border border-border">
              {renderTour(tour)}
            </div>
            <p className="text-sm font-medium mt-2">{tour.title}</p>
          </div>
        ))}
      </div>

      {fullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setFullscreen(null)}>
          <div className="w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
            {renderTour(tours.find((t) => t.title === fullscreen)!)}
          </div>
        </div>
      )}
    </div>
  );
}
