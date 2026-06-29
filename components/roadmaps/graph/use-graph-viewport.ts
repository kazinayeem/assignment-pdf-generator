"use client";

import { useCallback, useRef, useState } from "react";
import type { RefObject } from "react";

type Bounds = { width: number; height: number };

type ViewportOptions = {
  containerRef: RefObject<HTMLDivElement | null>;
  bounds: Bounds;
  minZoom?: number;
  maxZoom?: number;
};

export function useGraphViewport({ containerRef, bounds, minZoom = 0.25, maxZoom = 2 }: ViewportOptions) {
  const [zoom, setZoom] = useState(0.75);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const pinchStart = useRef<{ distance: number; zoom: number } | null>(null);

  const clampZoom = useCallback((z: number) => Math.min(maxZoom, Math.max(minZoom, z)), [minZoom, maxZoom]);

  const zoomAtPoint = useCallback(
    (delta: number, clientX?: number, clientY?: number) => {
      const container = containerRef.current;
      if (!container) {
        setZoom((z) => clampZoom(z + delta));
        return;
      }
      const rect = container.getBoundingClientRect();
      const px = clientX != null ? clientX - rect.left : rect.width / 2;
      const py = clientY != null ? clientY - rect.top : rect.height / 2;
      setZoom((prevZoom) => {
        const nextZoom = clampZoom(prevZoom + delta);
        const scale = nextZoom / prevZoom;
        setPan((prevPan) => ({
          x: px - scale * (px - prevPan.x),
          y: py - scale * (py - prevPan.y),
        }));
        return nextZoom;
      });
    },
    [clampZoom, containerRef]
  );

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY * 0.0012;
      zoomAtPoint(delta, e.clientX, e.clientY);
    },
    [zoomAtPoint]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest("[data-graph-node]")) return;
      setDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [pan.x, pan.y]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (pinchStart.current && e.pointerType === "touch") return;
      if (!dragging) return;
      setPan({
        x: dragStart.current.panX + (e.clientX - dragStart.current.x),
        y: dragStart.current.panY + (e.clientY - dragStart.current.y),
      });
    },
    [dragging]
  );

  const onPointerUp = useCallback(() => setDragging(false), []);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        const [a, b] = [e.touches[0], e.touches[1]];
        const distance = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
        pinchStart.current = { distance, zoom };
      }
    },
    [zoom]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length !== 2 || !pinchStart.current) return;
      e.preventDefault();
      const [a, b] = [e.touches[0], e.touches[1]];
      const distance = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
      const scale = distance / pinchStart.current.distance;
      setZoom(clampZoom(pinchStart.current.zoom * scale));
    },
    [clampZoom]
  );

  const onTouchEnd = useCallback(() => {
    pinchStart.current = null;
  }, []);

  const fitToScreen = useCallback(() => {
    const container = containerRef.current;
    if (!container || !bounds.width || !bounds.height) return;
    const rect = container.getBoundingClientRect();
    const padding = 48;
    const scaleX = (rect.width - padding) / bounds.width;
    const scaleY = (rect.height - padding) / bounds.height;
    const nextZoom = clampZoom(Math.min(scaleX, scaleY, 1));
    setZoom(nextZoom);
    setPan({
      x: (rect.width - bounds.width * nextZoom) / 2,
      y: (rect.height - bounds.height * nextZoom) / 2,
    });
  }, [bounds.height, bounds.width, clampZoom, containerRef]);

  const resetView = useCallback(() => {
    setZoom(0.75);
    setPan({ x: 40, y: 40 });
  }, []);

  const centerOnNode = useCallback(
    (nodeX: number, nodeY: number, nodeW: number, nodeH: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      setPan({
        x: rect.width / 2 - (nodeX + nodeW / 2) * zoom,
        y: rect.height / 2 - (nodeY + nodeH / 2) * zoom,
      });
    },
    [containerRef, zoom]
  );

  return {
    zoom,
    pan,
    dragging,
    setZoom: (z: number) => setZoom(clampZoom(z)),
    setPan,
    onWheel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    zoomIn: () => zoomAtPoint(0.12),
    zoomOut: () => zoomAtPoint(-0.12),
    fitToScreen,
    resetView,
    centerOnNode,
  };
}
