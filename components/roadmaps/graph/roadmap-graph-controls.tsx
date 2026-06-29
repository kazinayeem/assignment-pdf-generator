"use client";

import { ZoomIn, ZoomOut, Maximize2, Crosshair, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type RoadmapGraphControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  onReset: () => void;
  onCenter: () => void;
  zoom: number;
  className?: string;
  variant?: "floating" | "inline";
};

export function RoadmapGraphControls({
  onZoomIn,
  onZoomOut,
  onFit,
  onReset,
  onCenter,
  zoom,
  className,
  variant = "floating",
}: RoadmapGraphControlsProps) {
  const btn = "p-2 rounded-lg border border-border bg-card/95 hover:bg-muted transition-colors backdrop-blur-sm";

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 z-30",
        variant === "floating" && "absolute top-3 right-3",
        className
      )}
    >
      <div className="hidden sm:flex items-center px-2 py-1 rounded-lg bg-card/90 border border-border text-[10px] font-bold text-muted-foreground">
        {Math.round(zoom * 100)}%
      </div>
      <button type="button" onClick={onZoomIn} className={btn} aria-label="Zoom in">
        <ZoomIn size={16} />
      </button>
      <button type="button" onClick={onZoomOut} className={btn} aria-label="Zoom out">
        <ZoomOut size={16} />
      </button>
      <button type="button" onClick={onFit} className={btn} aria-label="Fit to screen">
        <Maximize2 size={16} />
      </button>
      <button type="button" onClick={onCenter} className={cn(btn, "hidden sm:flex")} aria-label="Center view">
        <Crosshair size={16} />
      </button>
      <button type="button" onClick={onReset} className={btn} aria-label="Reset view">
        <RotateCcw size={16} />
      </button>
    </div>
  );
}
