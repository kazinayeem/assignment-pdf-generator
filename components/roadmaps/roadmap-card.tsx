"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Clock, TrendingUp, Bookmark, CheckCircle2 } from "lucide-react";
import { card, badge, animation } from "@/lib/design-system";
import { getRoadmapDefinition } from "@/lib/roadmaps/catalog";
import { getRoadmapCompletionPercent } from "@/lib/roadmaps/store";
import type { RoadmapMeta } from "@/lib/roadmaps/types";
import { cn } from "@/lib/utils";

type RoadmapCardProps = {
  roadmap: RoadmapMeta;
  progress?: number;
  compact?: boolean;
};

function RoadmapIcon({ name }: { name: string }) {
  const Icon = (Icons as unknown as Record<string, ComponentType<{ size?: number; className?: string }>>)[name] ?? Icons.Map;
  return <Icon size={22} className="text-white" aria-hidden />;
}

const DEMAND_LABEL: Record<string, string> = {
  "very-high": "Very High Demand",
  high: "High Demand",
  medium: "Growing Demand",
};

export function RoadmapCard({ roadmap, progress, compact }: RoadmapCardProps) {
  const totalNodes = getRoadmapDefinition(roadmap.slug)?.nodeDefs.length ?? 0;
  const pct = progress ?? getRoadmapCompletionPercent(roadmap.slug, totalNodes);
  const hasProgress = pct > 0;

  return (
    <motion.div {...animation.fadeUp}>
      <Link href={`/roadmaps/${roadmap.slug}`} className="block h-full group">
        <div
          className={cn(
            card.base,
            card.hover,
            card.interactive,
            card.equal,
            compact ? "p-4" : "p-5 sm:p-6"
          )}
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand via-brand-secondary to-brand-accent flex items-center justify-center shadow-lg shadow-brand/20 group-hover:scale-105 transition-transform">
              <RoadmapIcon name={roadmap.icon} />
            </div>
            <div className="flex flex-col items-end gap-1">
              {roadmap.featured && <span className={badge.brand}>Featured</span>}
              {roadmap.beginnerFriendly && <span className={badge.success}>Beginner</span>}
            </div>
          </div>

          <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-brand transition-colors">
            {roadmap.title}
          </h3>
          {!compact && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1 mb-4">
              {roadmap.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground mb-3">
            <span className={cn(badge.muted, "text-[10px]")}>
              <Clock size={10} className="inline mr-0.5" />
              {roadmap.learningMonths} mo
            </span>
            <span className={cn(badge.muted, "text-[10px] capitalize")}>{roadmap.difficulty}</span>
            <span className={cn(badge.muted, "text-[10px]")}>
              <TrendingUp size={10} className="inline mr-0.5" />
              {DEMAND_LABEL[roadmap.demand] ?? roadmap.demand}
            </span>
          </div>

          {hasProgress && (
            <div className="mt-auto">
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={10} className="text-success" /> Progress
                </span>
                <span className="font-bold text-brand">{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-brand to-brand-accent" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}

          {!hasProgress && (
            <span className="text-xs font-semibold text-brand mt-auto inline-flex items-center gap-1">
              Start learning →
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export function RoadmapCardBookmark({ bookmarked }: { slug: string; bookmarked: boolean }) {
  return (
    <span className={cn(badge.muted, "text-[10px]", bookmarked && "text-brand border-brand/30")}>
      <Bookmark size={10} className={cn("inline mr-0.5", bookmarked && "fill-brand")} />
      {bookmarked ? "Saved" : "Save"}
    </span>
  );
}
