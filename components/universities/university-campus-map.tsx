"use client";

import { ExternalLink, MapPin, Bus, Train, Utensils, Home } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { card, button } from "@/lib/design-system";
import type { University } from "@/lib/universities/types";
import { cn } from "@/lib/utils";

export function UniversityCampusMap({ university }: { university: University }) {
  const { t } = useTranslation("universities");
  const query = encodeURIComponent(university.address);
  const embedUrl = university.mapEmbedUrl ?? `https://maps.google.com/maps?q=${query}&output=embed`;
  const mapsUrl = university.mapUrl ?? `https://maps.google.com/?q=${query}`;

  const nearby = [
    { icon: Bus, label: t("map.busStops") },
    { icon: Train, label: t("map.metro") },
    { icon: Utensils, label: t("map.restaurants") },
    { icon: Home, label: t("map.hostels") },
  ];

  return (
    <div className={cn(card.base, "p-5 sm:p-6 overflow-hidden")}>
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
        <MapPin size={18} className="text-brand" /> {t("detail.map")}
      </h3>
      <div className="rounded-xl overflow-hidden border border-border aspect-video mb-4">
        <iframe
          title={`${university.name} campus map`}
          src={embedUrl}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {nearby.map((n) => (
          <div key={n.label} className="flex items-center gap-2 text-xs text-muted-foreground p-2 rounded-lg bg-muted/50">
            <n.icon size={14} className="text-brand shrink-0" />
            {n.label}
          </div>
        ))}
      </div>
      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={cn(button.primary, "inline-flex items-center gap-2 text-sm")}>
        <ExternalLink size={14} /> {t("map.openMaps")}
      </a>
    </div>
  );
}
