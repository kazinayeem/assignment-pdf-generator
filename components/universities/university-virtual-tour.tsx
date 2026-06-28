"use client";

import { useTranslation } from "@/lib/i18n/provider";
import { card, badge } from "@/lib/design-system";
import type { University, VideoTour } from "@/lib/universities/types";
import { cn } from "@/lib/utils";

export function UniversityVirtualTour({ university }: { university: University }) {
  const { t } = useTranslation("universities");
  const videos: VideoTour[] = university.videoTours ?? (
    university.youtube
      ? [{ id: "main", title: t("tour.campus"), youtubeId: "", category: "campus" as const }]
      : []
  );

  const getEmbedId = (v: VideoTour) => {
    if (v.youtubeId) return v.youtubeId;
    const match = university.youtube?.match(/(?:youtube\.com\/@|channel\/)([\w-]+)/);
    return match ? "" : "";
  };

  if (videos.length === 0 && !university.youtube) {
    return (
      <div className={cn(card.base, "p-5")}>
        <p className="text-sm text-muted-foreground">{t("tour.unavailable")}</p>
      </div>
    );
  }

  return (
    <div className={cn(card.base, "p-5 sm:p-6")}>
      <h3 className="font-bold text-foreground mb-4">{t("tour.title")}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {videos.map((v) => {
          const embedId = v.youtubeId || getEmbedId(v);
          return (
            <div key={v.id}>
              <span className={cn(badge.muted, "text-[10px] mb-2 capitalize")}>{v.category}</span>
              {embedId ? (
                <div className="aspect-video rounded-xl overflow-hidden border border-border">
                  <iframe
                    title={v.title}
                    src={`https://www.youtube.com/embed/${embedId}`}
                    className="w-full h-full border-0"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : university.youtube ? (
                <a href={university.youtube} target="_blank" rel="noopener noreferrer" className="block aspect-video rounded-xl border border-border bg-muted/50 flex items-center justify-center text-sm text-brand font-semibold hover:bg-muted transition-colors">
                  {t("tour.watchChannel")} →
                </a>
              ) : null}
              <p className="text-sm font-medium mt-2">{v.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
