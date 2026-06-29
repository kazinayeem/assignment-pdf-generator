"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, Maximize2, CheckCircle2, Circle, Lock } from "lucide-react";
import { GRAPH_NODE_SIZE, getGraphBounds } from "@/lib/roadmaps/builder";
import type { Roadmap, RoadmapNode, NodeStatus } from "@/lib/roadmaps/types";
import { cn } from "@/lib/utils";

type RoadmapGraphProps = {
  roadmap: Roadmap;
  selectedNodeId: string | null;
  onSelectNode: (node: RoadmapNode) => void;
  isNodeComplete: (nodeId: string) => boolean;
  getNodeStatus: (nodeId: string) => NodeStatus;
};

function getEdgePath(
  source: RoadmapNode,
  target: RoadmapNode
): string {
  const sx = source.position.x + GRAPH_NODE_SIZE.width / 2;
  const sy = source.position.y + GRAPH_NODE_SIZE.height / 2;
  const tx = target.position.x + GRAPH_NODE_SIZE.width / 2;
  const ty = target.position.y + GRAPH_NODE_SIZE.height / 2;
  const mx = (sx + tx) / 2;
  return `M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ty}, ${tx} ${ty}`;
}

export function RoadmapGraph({
  roadmap,
  selectedNodeId,
  onSelectNode,
  isNodeComplete,
  getNodeStatus,
}: RoadmapGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 60, y: 120 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const bounds = useMemo(() => getGraphBounds(roadmap.nodes), [roadmap.nodes]);
  const nodeMap = useMemo(() => new Map(roadmap.nodes.map((n) => [n.id, n])), [roadmap.nodes]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(1.5, Math.max(0.4, z - e.deltaY * 0.001)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-node]")) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setPan({
      x: dragStart.current.panX + (e.clientX - dragStart.current.x),
      y: dragStart.current.panY + (e.clientY - dragStart.current.y),
    });
  };

  const onPointerUp = () => setDragging(false);

  const resetView = () => {
    setZoom(0.85);
    setPan({ x: 60, y: 120 });
  };

  const statusIcon = (status: NodeStatus, complete: boolean) => {
    if (complete) return <CheckCircle2 size={14} className="text-success shrink-0" />;
    if (status === "locked") return <Lock size={12} className="text-muted-foreground shrink-0" />;
    return <Circle size={12} className="text-brand shrink-0" />;
  };

  return (
    <div className="relative rounded-2xl border border-border bg-muted/30 overflow-hidden h-[min(70vh,640px)]">
      <div className="absolute top-3 right-3 z-20 flex gap-1.5">
        <button type="button" onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))} className="p-2 rounded-lg bg-card border border-border hover:bg-muted" aria-label="Zoom in">
          <ZoomIn size={16} />
        </button>
        <button type="button" onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))} className="p-2 rounded-lg bg-card border border-border hover:bg-muted" aria-label="Zoom out">
          <ZoomOut size={16} />
        </button>
        <button type="button" onClick={resetView} className="p-2 rounded-lg bg-card border border-border hover:bg-muted" aria-label="Reset view">
          <Maximize2 size={16} />
        </button>
      </div>

      {/* Mini map */}
      <div className="absolute bottom-3 left-3 z-20 w-28 h-20 rounded-lg bg-card/90 border border-border p-1 hidden sm:block" aria-hidden>
        <div className="relative w-full h-full bg-muted/50 rounded overflow-hidden">
          {roadmap.nodes.map((n) => (
            <div
              key={n.id}
              className={cn(
                "absolute w-1.5 h-1 rounded-sm",
                selectedNodeId === n.id ? "bg-brand" : isNodeComplete(n.id) ? "bg-success" : "bg-muted-foreground/40"
              )}
              style={{
                left: `${((n.position.x - bounds.minX) / bounds.width) * 100}%`,
                top: `${((n.position.y - bounds.minY) / bounds.height) * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        className={cn("w-full h-full cursor-grab", dragging && "cursor-grabbing")}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            width: bounds.width,
            height: bounds.height,
            position: "relative",
          }}
        >
          <svg
            className="absolute inset-0 pointer-events-none"
            width={bounds.width}
            height={bounds.height}
            style={{ overflow: "visible" }}
          >
            {roadmap.edges.map((edge) => {
              const source = nodeMap.get(edge.source);
              const target = nodeMap.get(edge.target);
              if (!source || !target) return null;
              const done = isNodeComplete(edge.source);
              return (
                <path
                  key={edge.id}
                  d={getEdgePath(source, target)}
                  fill="none"
                  stroke={done ? "var(--success)" : "var(--border)"}
                  strokeWidth={2}
                  strokeOpacity={done ? 0.6 : 0.9}
                />
              );
            })}
          </svg>

          {roadmap.phases.map((phase, i) => (
            <div
              key={phase.id}
              className="absolute top-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
              style={{ left: i * 280 + 20, transform: `translateY(${bounds.minY * -1 + 8}px)` }}
            >
              {phase.title}
            </div>
          ))}

          {roadmap.nodes.map((node) => {
            const status = getNodeStatus(node.id);
            const complete = isNodeComplete(node.id);
            const selected = selectedNodeId === node.id;
            return (
              <motion.button
                key={node.id}
                type="button"
                data-node
                onClick={() => onSelectNode(node)}
                whileHover={{ scale: status !== "locked" ? 1.02 : 1 }}
                className={cn(
                  "absolute text-left rounded-xl border p-3 transition-shadow",
                  "w-[200px] min-h-[88px]",
                  status === "locked" && "opacity-50 cursor-not-allowed",
                  selected
                    ? "border-brand bg-brand/10 shadow-lg shadow-brand/20 ring-2 ring-brand/30"
                    : complete
                      ? "border-success/40 bg-success/5 hover:border-success/60"
                      : "border-border bg-card/95 hover:border-brand/30 hover:shadow-md backdrop-blur-sm"
                )}
                style={{
                  left: node.position.x - bounds.minX,
                  top: node.position.y - bounds.minY,
                }}
              >
                <div className="flex items-start gap-2">
                  {statusIcon(status, complete)}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground leading-tight line-clamp-2">{node.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 capitalize">{node.difficulty} · {node.estimatedHours}h</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
