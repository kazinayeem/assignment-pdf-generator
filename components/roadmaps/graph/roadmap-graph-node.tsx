"use client";

import { motion } from "framer-motion";
import {
  BookOpen, Code2, Briefcase, FolderKanban, Bookmark, CheckCircle2,
  Clock, Sparkles, Link2,
} from "lucide-react";
import { GRAPH_NODE_SIZE } from "@/lib/roadmaps/builder";
import { computeNodeStats, computeNodeProgress, computeNodeXp } from "@/lib/roadmaps/graph-utils";
import type { RoadmapNode } from "@/lib/roadmaps/types";
import { cn } from "@/lib/utils";

const DIFFICULTY_STYLES = {
  beginner: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/40",
  intermediate: "from-sky-500/20 to-sky-500/5 border-sky-500/40",
  advanced: "from-violet-500/20 to-violet-500/5 border-violet-500/40",
  expert: "from-amber-500/20 to-amber-500/5 border-amber-500/40",
} as const;

const STATUS_RING = {
  completed: "ring-success/50 shadow-success/20",
  current: "ring-[var(--chart-4,#a855f7)]/60 shadow-[var(--chart-4,#a855f7)]/25",
  recommended: "ring-[var(--chart-1,#f97316)]/50 shadow-[var(--chart-1,#f97316)]/20",
  available: "ring-brand/30 shadow-brand/10",
  locked: "ring-muted opacity-60",
} as const;

type RoadmapGraphNodeProps = {
  node: RoadmapNode;
  offsetX: number;
  offsetY: number;
  visualStatus: keyof typeof STATUS_RING;
  isComplete: boolean;
  isBookmarked: boolean;
  isHighlighted: boolean;
  isDimmed: boolean;
  quizScore?: number;
  onSelect: () => void;
  onToggleBookmark: (e: React.MouseEvent) => void;
};

export function RoadmapGraphNode({
  node,
  offsetX,
  offsetY,
  visualStatus,
  isComplete,
  isBookmarked,
  isHighlighted,
  isDimmed,
  quizScore,
  onSelect,
  onToggleBookmark,
}: RoadmapGraphNodeProps) {
  const stats = computeNodeStats(node);
  const progress = computeNodeProgress(node, isComplete, quizScore);
  const xp = computeNodeXp(node, progress);

  return (
    <motion.button
      type="button"
      data-graph-node
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{
        opacity: isDimmed ? 0.35 : 1,
        scale: isHighlighted ? 1.04 : 1,
      }}
      whileHover={visualStatus !== "locked" ? { scale: 1.03, y: -2 } : undefined}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      onClick={onSelect}
      className={cn(
        "absolute text-left rounded-2xl border-2 p-3.5 transition-shadow backdrop-blur-md",
        "bg-gradient-to-br from-card/95 to-card/70",
        DIFFICULTY_STYLES[node.difficulty] ?? DIFFICULTY_STYLES.intermediate,
        "ring-2 shadow-lg",
        STATUS_RING[visualStatus],
        isHighlighted && "z-10",
        visualStatus === "locked" && "cursor-not-allowed"
      )}
      style={{
        left: offsetX,
        top: offsetY,
        width: GRAPH_NODE_SIZE.width,
        minHeight: GRAPH_NODE_SIZE.height,
      }}
    >
      {visualStatus === "current" && (
        <motion.span
          className="absolute -inset-0.5 rounded-2xl bg-[var(--chart-4,#a855f7)]/20 blur-md -z-10"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-brand/15 flex items-center justify-center shrink-0">
            <BookOpen size={14} className="text-brand" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-extrabold text-foreground leading-tight line-clamp-2">{node.title}</p>
            <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{node.description}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {isComplete ? (
            <CheckCircle2 size={16} className="text-success" />
          ) : (
            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground capitalize">
              {visualStatus === "recommended" ? "Next" : node.difficulty}
            </span>
          )}
          <button
            type="button"
            onClick={onToggleBookmark}
            className="p-0.5 rounded hover:bg-muted"
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark topic"}
          >
            <Bookmark size={12} className={cn(isBookmarked ? "fill-brand text-brand" : "text-muted-foreground")} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-2">
        <StatPill icon={Clock} label={`${node.estimatedHours}h`} />
        <StatPill icon={Briefcase} label={`${stats.interviewQuestions}`} />
        <StatPill icon={FolderKanban} label={`${stats.projects}`} />
        <StatPill icon={Link2} label={`${stats.resources}`} />
      </div>

      <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-1.5">
        <motion.div
          className="h-full bg-gradient-to-r from-brand to-brand-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>

      <div className="flex items-center justify-between text-[9px] text-muted-foreground">
        <span>{progress}% · {xp} XP</span>
        <span className="flex items-center gap-0.5">
          <Sparkles size={9} className="text-brand" />
          {stats.lessons} lessons
        </span>
      </div>
    </motion.button>
  );
}

function StatPill({ icon: Icon, label }: { icon: typeof Code2; label: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-muted/80 text-[9px] font-semibold text-muted-foreground">
      <Icon size={9} />
      {label}
    </span>
  );
}
