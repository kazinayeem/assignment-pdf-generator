"use client";

import { motion } from "framer-motion";
import type { Roadmap, RoadmapNode } from "@/lib/roadmaps/types";
import { getEdgePath, getEdgeVisualState, EDGE_COLORS } from "@/lib/roadmaps/graph-utils";

type RoadmapGraphEdgesProps = {
  roadmap: Roadmap;
  nodeMap: Map<string, RoadmapNode>;
  boundsMinX: number;
  boundsMinY: number;
  width: number;
  height: number;
  isNodeComplete: (id: string) => boolean;
  selectedNodeId: string | null;
  recommendedId: string | null;
  highlightedIds: Set<string>;
};

export function RoadmapGraphEdges({
  roadmap,
  nodeMap,
  boundsMinX,
  boundsMinY,
  width,
  height,
  isNodeComplete,
  selectedNodeId,
  recommendedId,
  highlightedIds,
}: RoadmapGraphEdgesProps) {
  return (
    <svg
      className="absolute inset-0 pointer-events-none overflow-visible"
      width={width}
      height={height}
      aria-hidden
    >
      <defs>
        {Object.entries(EDGE_COLORS).map(([state, color]) => (
          <marker
            key={state}
            id={`arrow-${state}`}
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L6,3 z" fill={color} />
          </marker>
        ))}
      </defs>
      {roadmap.edges.map((edge) => {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target) return null;

        const sourceComplete = isNodeComplete(edge.source);
        const targetComplete = isNodeComplete(edge.target);
        const state = getEdgeVisualState(
          sourceComplete,
          targetComplete,
          edge.target,
          selectedNodeId,
          recommendedId
        );
        const color = EDGE_COLORS[state];
        const dimmed = highlightedIds.size > 0 && !highlightedIds.has(edge.source) && !highlightedIds.has(edge.target);

        return (
          <motion.path
            key={edge.id}
            d={getEdgePath(source, target, boundsMinX, boundsMinY)}
            fill="none"
            stroke={color}
            strokeWidth={state === "current" ? 3 : 2}
            strokeOpacity={dimmed ? 0.15 : state === "completed" ? 0.7 : 0.85}
            markerEnd={`url(#arrow-${state})`}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, strokeDashoffset: state === "current" ? [0, -20] : 0 }}
            transition={{
              pathLength: { duration: 0.8, ease: "easeOut" },
              strokeDashoffset: state === "current" ? { duration: 1.2, repeat: Infinity, ease: "linear" } : undefined,
            }}
            strokeDasharray={state === "current" ? "8 6" : undefined}
          />
        );
      })}
    </svg>
  );
}
