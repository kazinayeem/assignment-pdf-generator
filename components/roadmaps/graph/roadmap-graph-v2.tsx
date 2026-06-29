"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getGraphBounds, GRAPH_NODE_SIZE } from "@/lib/roadmaps/builder";
import {
  DEFAULT_GRAPH_FILTERS,
  filterGraphNodes,
  getNodeVisualStatus,
  getPhaseCompletion,
  getRecommendedNodeId,
  searchRoadmapNodes,
  type GraphFilters,
} from "@/lib/roadmaps/graph-utils";
import type { Roadmap, RoadmapNode, NodeStatus } from "@/lib/roadmaps/types";
import { useGraphViewport } from "./use-graph-viewport";
import { RoadmapGraphNode } from "./roadmap-graph-node";
import { RoadmapGraphEdges } from "./roadmap-graph-edges";
import { RoadmapGraphControls } from "./roadmap-graph-controls";
import { RoadmapGraphMinimap } from "./roadmap-graph-minimap";
import { RoadmapGraphToolbar } from "./roadmap-graph-toolbar";
import { RoadmapLearningPathBar } from "./roadmap-learning-path-bar";
import { cn } from "@/lib/utils";

const PHASE_COLORS = [
  "from-brand/8 to-transparent border-brand/20",
  "from-sky-500/8 to-transparent border-sky-500/20",
  "from-violet-500/8 to-transparent border-violet-500/20",
  "from-amber-500/8 to-transparent border-amber-500/20",
  "from-emerald-500/8 to-transparent border-emerald-500/20",
  "from-rose-500/8 to-transparent border-rose-500/20",
];

type RoadmapGraphV2Props = {
  roadmap: Roadmap;
  selectedNodeId: string | null;
  onSelectNode: (node: RoadmapNode) => void;
  isNodeComplete: (nodeId: string) => boolean;
  getNodeStatus: (nodeId: string) => NodeStatus;
  bookmarkedNodeIds: Set<string>;
  onToggleNodeBookmark: (nodeId: string) => void;
  quizScores: Record<string, number>;
  overallPercent: number;
};

export function RoadmapGraphV2({
  roadmap,
  selectedNodeId,
  onSelectNode,
  isNodeComplete,
  getNodeStatus,
  bookmarkedNodeIds,
  onToggleNodeBookmark,
  quizScores,
  overallPercent,
}: RoadmapGraphV2Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 800, h: 600 });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<GraphFilters>(DEFAULT_GRAPH_FILTERS);
  const [hasFit, setHasFit] = useState(false);

  const bounds = useMemo(() => getGraphBounds(roadmap.nodes), [roadmap.nodes]);
  const nodeMap = useMemo(() => new Map(roadmap.nodes.map((n) => [n.id, n])), [roadmap.nodes]);
  const recommendedId = useMemo(() => getRecommendedNodeId(roadmap, isNodeComplete), [roadmap, isNodeComplete]);

  const viewport = useGraphViewport({ containerRef, bounds: { width: bounds.width, height: bounds.height } });
  const fitRef = useRef(viewport.fitToScreen);
  fitRef.current = viewport.fitToScreen;

  const searchResults = useMemo(
    () => searchRoadmapNodes(roadmap, searchQuery),
    [roadmap, searchQuery]
  );
  const highlightedIds = useMemo(
    () => new Set(searchResults.map((r) => r.node.id)),
    [searchResults]
  );

  const visibleNodes = useMemo(() => {
    let nodes = filterGraphNodes(roadmap.nodes, filters, {
      completedIds: new Set(roadmap.nodes.filter((n) => isNodeComplete(n.id)).map((n) => n.id)),
      bookmarkedIds: bookmarkedNodeIds,
      recommendedId,
    });
    if (filters.sort === "recommended" && recommendedId) {
      nodes = [...nodes].sort((a, b) => (a.id === recommendedId ? -1 : b.id === recommendedId ? 1 : 0));
    }
    return nodes;
  }, [roadmap.nodes, filters, isNodeComplete, bookmarkedNodeIds, recommendedId]);

  const visibleIds = useMemo(() => new Set(visibleNodes.map((n) => n.id)), [visibleNodes]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!hasFit && containerSize.w > 0) {
      fitRef.current();
      setHasFit(true);
    }
  }, [containerSize.w, hasFit]);

  const focusNode = useCallback(
    (node: RoadmapNode) => {
      onSelectNode(node);
      const ox = node.position.x - bounds.minX;
      const oy = node.position.y - bounds.minY;
      viewport.centerOnNode(ox, oy, GRAPH_NODE_SIZE.width, GRAPH_NODE_SIZE.height);
    },
    [bounds.minX, bounds.minY, onSelectNode, viewport]
  );

  useEffect(() => {
    if (searchResults.length === 1) {
      focusNode(searchResults[0].node);
    }
  }, [searchResults, focusNode]);

  const handleMinimapNavigate = (graphX: number, graphY: number) => {
    const ox = graphX - bounds.minX;
    const oy = graphY - bounds.minY;
    viewport.centerOnNode(ox, oy, 0, 0);
  };

  const nodesByPhase = useMemo(() => {
    const map = new Map<string, RoadmapNode[]>();
    for (const phase of roadmap.phases) {
      map.set(phase.id, roadmap.nodes.filter((n) => n.phaseId === phase.id));
    }
    return map;
  }, [roadmap.nodes, roadmap.phases]);

  return (
    <div className="space-y-0">
      <RoadmapLearningPathBar
        roadmap={roadmap}
        isNodeComplete={isNodeComplete}
        recommendedId={recommendedId}
        overallPercent={overallPercent}
      />

      <RoadmapGraphToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFiltersChange={setFilters}
        matchCount={searchResults.length}
      />

      <div className="relative rounded-2xl border border-border bg-gradient-to-br from-muted/40 via-card/30 to-muted/20 overflow-hidden h-[min(78vh,720px)] min-h-[420px]">
        <RoadmapGraphControls
          onZoomIn={viewport.zoomIn}
          onZoomOut={viewport.zoomOut}
          onFit={viewport.fitToScreen}
          onReset={viewport.resetView}
          onCenter={() => {
            const node = recommendedId ? nodeMap.get(recommendedId) : roadmap.nodes[0];
            if (node) focusNode(node);
          }}
          zoom={viewport.zoom}
        />

        <RoadmapGraphMinimap
          nodes={roadmap.nodes}
          bounds={bounds}
          selectedNodeId={selectedNodeId}
          isNodeComplete={isNodeComplete}
          viewport={{
            panX: viewport.pan.x,
            panY: viewport.pan.y,
            zoom: viewport.zoom,
            containerW: containerSize.w,
            containerH: containerSize.h,
          }}
          onNavigate={handleMinimapNavigate}
        />

        {/* Mobile floating controls */}
        <div className="sm:hidden absolute bottom-3 right-3 z-30 flex gap-1">
          <button type="button" onClick={viewport.zoomIn} className="p-2.5 rounded-full bg-card border border-border shadow-lg" aria-label="Zoom in">+</button>
          <button type="button" onClick={viewport.fitToScreen} className="p-2.5 rounded-full bg-card border border-border shadow-lg text-xs font-bold" aria-label="Fit">Fit</button>
        </div>

        <div
          ref={containerRef}
          className={cn("w-full h-full touch-none", viewport.dragging ? "cursor-grabbing" : "cursor-grab")}
          onWheel={viewport.onWheel}
          onPointerDown={viewport.onPointerDown}
          onPointerMove={viewport.onPointerMove}
          onPointerUp={viewport.onPointerUp}
          onPointerLeave={viewport.onPointerUp}
          onTouchStart={viewport.onTouchStart}
          onTouchMove={viewport.onTouchMove}
          onTouchEnd={viewport.onTouchEnd}
        >
          <motion.div
            style={{
              transform: `translate(${viewport.pan.x}px, ${viewport.pan.y}px) scale(${viewport.zoom})`,
              transformOrigin: "0 0",
              width: bounds.width,
              height: bounds.height,
              position: "relative",
            }}
          >
            {/* Phase group backgrounds */}
            {roadmap.phases.map((phase, i) => {
              const phaseNodes = nodesByPhase.get(phase.id) ?? [];
              if (!phaseNodes.length) return null;
              const minY = Math.min(...phaseNodes.map((n) => n.position.y)) - bounds.minY - 16;
              const maxY = Math.max(...phaseNodes.map((n) => n.position.y + GRAPH_NODE_SIZE.height)) - bounds.minY + 16;
              const left = i * 360 - bounds.minX + 8;
              const completion = getPhaseCompletion(roadmap, phase.id, isNodeComplete);

              return (
                <div
                  key={phase.id}
                  className={cn(
                    "absolute rounded-2xl border bg-gradient-to-b pointer-events-none",
                    PHASE_COLORS[i % PHASE_COLORS.length]
                  )}
                  style={{
                    left,
                    top: minY,
                    width: GRAPH_NODE_SIZE.width + 24,
                    height: maxY - minY,
                  }}
                >
                  <div className="p-3">
                    <p className="text-[11px] font-extrabold uppercase tracking-wide text-foreground">{phase.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{phase.description}</p>
                    <p className="text-[10px] font-bold text-brand mt-1">{completion}% complete</p>
                  </div>
                </div>
              );
            })}

            <RoadmapGraphEdges
              roadmap={roadmap}
              nodeMap={nodeMap}
              boundsMinX={bounds.minX}
              boundsMinY={bounds.minY}
              width={bounds.width}
              height={bounds.height}
              isNodeComplete={isNodeComplete}
              selectedNodeId={selectedNodeId}
              recommendedId={recommendedId}
              highlightedIds={highlightedIds}
            />

            {roadmap.nodes.map((node) => {
              if (!visibleIds.has(node.id)) return null;
              const complete = isNodeComplete(node.id);
              const visualStatus = getNodeVisualStatus(
                node.id,
                getNodeStatus,
                complete,
                selectedNodeId,
                recommendedId
              );
              const isHighlighted = highlightedIds.has(node.id) || selectedNodeId === node.id;
              const isDimmed = searchQuery.length > 0 && !highlightedIds.has(node.id);

              return (
                <RoadmapGraphNode
                  key={node.id}
                  node={node}
                  offsetX={node.position.x - bounds.minX}
                  offsetY={node.position.y - bounds.minY}
                  visualStatus={visualStatus}
                  isComplete={complete}
                  isBookmarked={bookmarkedNodeIds.has(node.id)}
                  isHighlighted={isHighlighted}
                  isDimmed={isDimmed}
                  quizScore={quizScores[node.id]}
                  onSelect={() => focusNode(node)}
                  onToggleBookmark={(e) => {
                    e.stopPropagation();
                    onToggleNodeBookmark(node.id);
                  }}
                />
              );
            })}
          </motion.div>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {searchResults.slice(0, 8).map(({ node, matchReason }) => (
            <button
              key={node.id}
              type="button"
              onClick={() => focusNode(node)}
              className="px-3 py-1.5 rounded-lg border border-brand/30 bg-brand/5 text-xs font-semibold text-brand hover:bg-brand/10"
            >
              {node.title} <span className="text-muted-foreground font-normal">· {matchReason}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
