"use client";

import Link from "next/link";
import { Clock, Bookmark, GraduationCap, Share2, Printer } from "lucide-react";
import { card, badge } from "@/lib/design-system";
import { RoadmapExportMenu } from "../roadmap-export-menu";
import type { Roadmap, RoadmapNode } from "@/lib/roadmaps/types";
import { computeNodeStats, computeNodeProgress } from "@/lib/roadmaps/graph-utils";
import { cn } from "@/lib/utils";
import { printRoadmap } from "@/lib/roadmaps/pdf-export";

type RoadmapGraphSidebarProps = {
  roadmap: Roadmap;
  selectedNode: RoadmapNode | null;
  continueNode: RoadmapNode;
  recentNodes: RoadmapNode[];
  bookmarkedNodes: RoadmapNode[];
  overallPercent: number;
  onContinue: () => void;
  onSelectNode: (node: RoadmapNode) => void;
  isNodeComplete: (id: string) => boolean;
  quizScores: Record<string, number>;
  className?: string;
};

export function RoadmapGraphSidebar({
  roadmap,
  selectedNode,
  continueNode,
  recentNodes,
  bookmarkedNodes,
  overallPercent,
  onContinue,
  onSelectNode,
  isNodeComplete,
  quizScores,
  className,
}: RoadmapGraphSidebarProps) {
  const active = selectedNode ?? continueNode;
  const stats = computeNodeStats(active);
  const progress = computeNodeProgress(active, isNodeComplete(active.id), quizScores[active.id]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: roadmap.title, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <aside className={cn("w-full xl:w-72 shrink-0 space-y-4", className)}>
      <div className={cn(card.base, "p-4 sticky top-24 space-y-4")}>
        <div>
          <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Current Topic</p>
          <h3 className="text-sm font-bold text-foreground">{active.title}</h3>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className={cn(badge.muted, "text-[10px] capitalize")}>{active.difficulty}</span>
            <span className={cn(badge.muted, "text-[10px] flex items-center gap-0.5")}>
              <Clock size={10} /> {active.estimatedHours}h
            </span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-bold">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">Roadmap: {overallPercent}%</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <SidebarStat label="Lessons" value={stats.lessons} />
          <SidebarStat label="Projects" value={stats.projects} />
          <SidebarStat label="Interview" value={stats.interviewQuestions} />
          <SidebarStat label="MCQs" value={stats.mcqs} />
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-brand-foreground text-sm font-semibold shadow-md"
        >
          <GraduationCap size={16} />
          Continue Learning
        </button>

        {bookmarkedNodes.length > 0 && (
          <SidebarList title="Bookmarks" icon={Bookmark}>
            {bookmarkedNodes.slice(0, 5).map((n) => (
              <SidebarLink key={n.id} label={n.title} onClick={() => onSelectNode(n)} />
            ))}
          </SidebarList>
        )}

        {recentNodes.length > 0 && (
          <SidebarList title="Recent Topics">
            {recentNodes.slice(0, 5).map((n) => (
              <SidebarLink key={n.id} label={n.title} onClick={() => onSelectNode(n)} />
            ))}
          </SidebarList>
        )}

        <div className="pt-2 border-t border-border space-y-2">
          <RoadmapExportMenu roadmap={roadmap} node={selectedNode} className="w-full" />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-xs font-semibold hover:bg-muted"
            >
              <Share2 size={14} /> Share
            </button>
            <button
              type="button"
              onClick={() => printRoadmap()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-xs font-semibold hover:bg-muted"
            >
              <Printer size={14} /> Print
            </button>
          </div>
        </div>

        <Link href="#readiness-score" className="text-xs text-brand font-semibold hover:underline block text-center">
          View readiness score →
        </Link>
      </div>
    </aside>
  );
}

function SidebarStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-2 rounded-lg bg-muted/50 text-center">
      <p className="font-bold text-foreground">{value}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
}

function SidebarList({ title, icon: Icon, children }: { title: string; icon?: typeof Bookmark; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1.5 flex items-center gap-1">
        {Icon && <Icon size={10} />}
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function SidebarLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left text-xs text-foreground hover:text-brand truncate py-1 px-2 rounded hover:bg-muted"
    >
      {label}
    </button>
  );
}
