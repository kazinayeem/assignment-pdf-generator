"use client";

import type { RoadmapNode } from "@/lib/roadmaps/types";
import { cn } from "@/lib/utils";

type RoadmapGraphMinimapProps = {
  nodes: RoadmapNode[];
  bounds: { minX: number; minY: number; width: number; height: number };
  selectedNodeId: string | null;
  isNodeComplete: (id: string) => boolean;
  viewport: { panX: number; panY: number; zoom: number; containerW: number; containerH: number };
  onNavigate: (x: number, y: number) => void;
};

export function RoadmapGraphMinimap({
  nodes,
  bounds,
  selectedNodeId,
  isNodeComplete,
  viewport,
  onNavigate,
}: RoadmapGraphMinimapProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top) / rect.height;
    onNavigate(bounds.minX + rx * bounds.width, bounds.minY + ry * bounds.height);
  };

  const vpLeft = (-viewport.panX / viewport.zoom - bounds.minX) / bounds.width;
  const vpTop = (-viewport.panY / viewport.zoom - bounds.minY) / bounds.height;
  const vpW = viewport.containerW / viewport.zoom / bounds.width;
  const vpH = viewport.containerH / viewport.zoom / bounds.height;

  return (
    <div
      className="absolute bottom-3 left-3 z-30 w-32 sm:w-36 h-24 sm:h-28 rounded-xl bg-card/95 border border-border p-1.5 backdrop-blur-md shadow-lg hidden sm:block"
      role="navigation"
      aria-label="Graph minimap"
    >
      <div
        className="relative w-full h-full bg-muted/40 rounded-lg overflow-hidden cursor-crosshair"
        onClick={handleClick}
      >
        {nodes.map((n) => (
          <div
            key={n.id}
            className={cn(
              "absolute w-2 h-1.5 rounded-sm transition-colors",
              selectedNodeId === n.id ? "bg-[var(--chart-4,#a855f7)]" : isNodeComplete(n.id) ? "bg-success" : "bg-muted-foreground/50"
            )}
            style={{
              left: `${((n.position.x - bounds.minX) / bounds.width) * 100}%`,
              top: `${((n.position.y - bounds.minY) / bounds.height) * 100}%`,
            }}
          />
        ))}
        <div
          className="absolute border-2 border-brand/60 rounded-sm bg-brand/5 pointer-events-none"
          style={{
            left: `${Math.max(0, vpLeft * 100)}%`,
            top: `${Math.max(0, vpTop * 100)}%`,
            width: `${Math.min(100, vpW * 100)}%`,
            height: `${Math.min(100, vpH * 100)}%`,
          }}
        />
      </div>
    </div>
  );
}
