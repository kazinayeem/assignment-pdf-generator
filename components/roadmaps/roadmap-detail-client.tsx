"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bookmark, Clock, DollarSign, TrendingUp, BarChart3, ChevronRight, GraduationCap,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { card, badge, animation } from "@/lib/design-system";
import { RoadmapGraphV2 } from "./graph/roadmap-graph-v2";
import { RoadmapGraphSidebar } from "./graph/roadmap-graph-sidebar";
import { RoadmapNodePanel } from "./roadmap-node-panel";
import { RoadmapExpandedSections } from "./roadmap-expanded-sections";
import { RoadmapDetailSidebar } from "./roadmap-detail-sidebar";
import { RoadmapExportMenu } from "./roadmap-export-menu";
import { useRoadmapsStore, getRoadmapCompletionPercent } from "@/lib/roadmaps/store";
import { computeReadiness } from "@/lib/roadmaps/readiness";
import type { Roadmap, RoadmapNode, NodeStatus } from "@/lib/roadmaps/types";
import { cn } from "@/lib/utils";

type RoadmapDetailClientProps = {
  roadmap: Roadmap;
};

export function RoadmapDetailClient({ roadmap }: RoadmapDetailClientProps) {
  const { t } = useTranslation("roadmaps");
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const {
    recordVisit,
    recordNodeVisit,
    toggleBookmark,
    toggleNodeComplete,
    toggleNodeBookmark,
    isNodeComplete,
    setQuizScore,
    addStudyMinutes,
    bookmarks,
  } = useRoadmapsStore();

  const roadmapProgress = useRoadmapsStore((s) => s.getRoadmapProgress(roadmap.slug));

  useEffect(() => {
    recordVisit(roadmap.slug);
    addStudyMinutes(5);
  }, [roadmap.slug, recordVisit, addStudyMinutes]);

  const readiness = useMemo(
    () => computeReadiness(roadmap, roadmapProgress),
    [roadmap, roadmapProgress]
  );

  const overallPercent = getRoadmapCompletionPercent(roadmap.slug, roadmap.nodes.length);
  const bookmarked = bookmarks.includes(roadmap.slug);
  const bookmarkedNodeIds = useMemo(() => new Set(roadmapProgress.bookmarkedNodeIds ?? []), [roadmapProgress.bookmarkedNodeIds]);

  const getNodeStatus = useMemo(() => {
    const completed = new Set(roadmapProgress.completedNodeIds ?? []);
    return (nodeId: string): NodeStatus => {
      if (completed.has(nodeId)) return "completed";
      return "available";
    };
  }, [roadmapProgress]);

  const continueNode = useMemo(() => {
    const incomplete = roadmap.nodes.find((n) => !isNodeComplete(roadmap.slug, n.id));
    return incomplete ?? roadmap.nodes[0];
  }, [roadmap.nodes, roadmap.slug, isNodeComplete]);

  const recentNodes = useMemo(
    () =>
      (roadmapProgress.recentNodeIds ?? [])
        .map((id) => roadmap.nodes.find((n) => n.id === id))
        .filter((n): n is RoadmapNode => !!n),
    [roadmapProgress.recentNodeIds, roadmap.nodes]
  );

  const bookmarkedNodes = useMemo(
    () => roadmap.nodes.filter((n) => bookmarkedNodeIds.has(n.id)),
    [roadmap.nodes, bookmarkedNodeIds]
  );

  const handleSelectNode = (node: RoadmapNode) => {
    setSelectedNode(node);
    recordNodeVisit(roadmap.slug, node.id);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <motion.div {...animation.fadeUp} className="mb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
          <span>{t("detail.hub")}</span>
          <ChevronRight size={12} />
          <span className="text-foreground font-medium">{roadmap.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={badge.brand}>{roadmap.category}</span>
              <span className={cn(badge.muted, "capitalize")}>{roadmap.difficulty}</span>
              <span className={cn(badge.muted, "text-[10px]")}>{roadmap.enrichment.interviewHub.length}+ interview Qs</span>
              {roadmap.beginnerFriendly && <span className={badge.success}>{t("filters.beginnerFriendly")}</span>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">{roadmap.title}</h1>
            <p className="text-muted-foreground leading-relaxed">{roadmap.description}</p>
          </div>

          <div className="flex flex-wrap gap-2 items-start">
            <RoadmapExportMenu roadmap={roadmap} node={selectedNode} />
            <button
              type="button"
              onClick={() => toggleBookmark(roadmap.slug)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors",
                bookmarked ? "border-brand bg-brand/10 text-brand" : "border-border hover:bg-muted"
              )}
            >
              <Bookmark size={16} className={bookmarked ? "fill-brand" : ""} />
              {bookmarked ? t("detail.saved") : t("detail.bookmark")}
            </button>
            <button
              type="button"
              onClick={() => handleSelectNode(continueNode)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-brand-foreground text-sm font-semibold shadow-md"
            >
              <GraduationCap size={16} />
              {t("detail.continue")}
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { icon: Clock, label: t("detail.learningTime"), value: `${roadmap.learningMonths} mo · ${roadmap.learningHours}h` },
          { icon: DollarSign, label: t("detail.salary"), value: roadmap.salaryRange },
          { icon: TrendingUp, label: t("detail.demand"), value: roadmap.demand.replace("-", " ") },
          { icon: BarChart3, label: "Job Readiness", value: `${readiness.overall}%` },
        ].map((stat) => (
          <div key={stat.label} className={cn(card.base, "p-4")}>
            <stat.icon size={16} className="text-brand mb-2" />
            <p className="text-[10px] uppercase font-bold text-muted-foreground">{stat.label}</p>
            <p className="text-sm font-bold text-foreground mt-0.5">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Central graph experience */}
      <div id="graph" className="flex flex-col xl:flex-row gap-6 mb-10">
        <div className="flex gap-6 flex-1 min-w-0">
          <RoadmapDetailSidebar roadmap={roadmap} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold">{t("detail.graph")}</h2>
              <p className="text-xs text-muted-foreground hidden sm:block">{t("detail.graphHint")}</p>
            </div>

            <RoadmapGraphV2
              roadmap={roadmap}
              selectedNodeId={selectedNode?.id ?? null}
              onSelectNode={handleSelectNode}
              isNodeComplete={(id) => isNodeComplete(roadmap.slug, id)}
              getNodeStatus={getNodeStatus}
              bookmarkedNodeIds={bookmarkedNodeIds}
              onToggleNodeBookmark={(nodeId) => toggleNodeBookmark(roadmap.slug, nodeId)}
              quizScores={roadmapProgress.quizScores}
              overallPercent={overallPercent}
            />

            <div className={cn(card.base, "p-5 mt-6 lg:hidden")}>
              <h3 className="text-sm font-bold mb-3">{t("detail.prerequisites")}</h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {roadmap.prerequisites.map((p) => <li key={p}>• {p}</li>)}
              </ul>
            </div>
          </div>
        </div>

        <RoadmapGraphSidebar
          roadmap={roadmap}
          selectedNode={selectedNode}
          continueNode={continueNode}
          recentNodes={recentNodes}
          bookmarkedNodes={bookmarkedNodes}
          overallPercent={overallPercent}
          onContinue={() => handleSelectNode(continueNode)}
          onSelectNode={handleSelectNode}
          isNodeComplete={(id) => isNodeComplete(roadmap.slug, id)}
          quizScores={roadmapProgress.quizScores}
          className="hidden xl:block"
        />
      </div>

      {/* Mobile sidebar */}
      <RoadmapGraphSidebar
        roadmap={roadmap}
        selectedNode={selectedNode}
        continueNode={continueNode}
        recentNodes={recentNodes}
        bookmarkedNodes={bookmarkedNodes}
        overallPercent={overallPercent}
        onContinue={() => handleSelectNode(continueNode)}
        onSelectNode={handleSelectNode}
        isNodeComplete={(id) => isNodeComplete(roadmap.slug, id)}
        quizScores={roadmapProgress.quizScores}
        className="xl:hidden mb-8"
      />

      <div className="hidden lg:grid lg:grid-cols-2 gap-6 mb-8">
        <div className={cn(card.base, "p-5")}>
          <h2 className="text-sm font-bold mb-3">{t("detail.prerequisites")}</h2>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {roadmap.prerequisites.map((p) => <li key={p}>• {p}</li>)}
          </ul>
        </div>
        <div className={cn(card.base, "p-5")}>
          <h2 className="text-sm font-bold mb-3">{t("detail.phases")}</h2>
          <div className="space-y-2">
            {roadmap.phases.map((phase, i) => (
              <div key={phase.id} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-brand/10 text-brand text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold">{phase.title}</p>
                  <p className="text-xs text-muted-foreground">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <RoadmapExpandedSections roadmap={roadmap} />

      <div className="mt-12 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
        <RoadmapExportMenu roadmap={roadmap} node={selectedNode} />
        <p className="text-xs text-muted-foreground">
          {readiness.isComplete
            ? "Congratulations — you have completed all readiness requirements!"
            : t("detail.certProgress").replace("{{pct}}", String(Math.max(0, 100 - readiness.overall)))}
        </p>
      </div>

      <RoadmapNodePanel
        roadmap={roadmap}
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        isComplete={selectedNode ? isNodeComplete(roadmap.slug, selectedNode.id) : false}
        onToggleComplete={() => {
          if (!selectedNode) return;
          toggleNodeComplete(roadmap.slug, selectedNode.id);
        }}
        onQuizAnswer={(correct) => {
          if (!selectedNode) return;
          setQuizScore(roadmap.slug, selectedNode.id, correct ? 100 : 0);
        }}
        onContinue={(next) => handleSelectNode(next)}
      />

      <RoadmapExportMenu roadmap={roadmap} node={selectedNode} variant="fab" />
    </div>
  );
}
