"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { getMilestoneProgress } from "@/lib/roadmaps/graph-utils";
import type { Roadmap } from "@/lib/roadmaps/types";
import { cn } from "@/lib/utils";

type RoadmapLearningPathBarProps = {
  roadmap: Roadmap;
  isNodeComplete: (id: string) => boolean;
  recommendedId: string | null;
  overallPercent: number;
};

const LEVEL_LABELS = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
} as const;

export function RoadmapLearningPathBar({
  roadmap,
  isNodeComplete,
  recommendedId,
  overallPercent,
}: RoadmapLearningPathBarProps) {
  const milestones = getMilestoneProgress(roadmap, isNodeComplete);
  const recommended = roadmap.nodes.find((n) => n.id === recommendedId);

  return (
    <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Learning Path</p>
          <p className="text-sm font-semibold text-foreground">
            {overallPercent}% complete
            {recommended && (
              <span className="text-muted-foreground font-normal">
                {" "}· Recommended next: <span className="text-brand">{recommended.title}</span>
              </span>
            )}
          </p>
        </div>
        <div className="h-2 w-full sm:w-48 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand to-success rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallPercent}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0">
        {milestones.map((m, i) => (
          <div key={m.level} className="flex items-center flex-1 min-w-0">
            <div
              className={cn(
                "flex-1 rounded-xl border p-3 text-center transition-colors",
                m.percent === 100 ? "border-success/40 bg-success/5" : "border-border bg-muted/30"
              )}
            >
              <p className="text-[10px] font-bold uppercase text-muted-foreground">{LEVEL_LABELS[m.level]}</p>
              <p className="text-lg font-extrabold text-foreground">{m.percent}%</p>
              <p className="text-[10px] text-muted-foreground">{m.done}/{m.total} topics</p>
            </div>
            {i < milestones.length - 1 && (
              <ChevronDown size={16} className="text-muted-foreground shrink-0 mx-1 hidden sm:block rotate-[-90deg]" />
            )}
            {i < milestones.length - 1 && (
              <ChevronDown size={16} className="text-muted-foreground shrink-0 mx-auto sm:hidden" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
