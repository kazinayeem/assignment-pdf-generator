"use client";

import { useState, useRef, useEffect } from "react";
import { Download, FileText, FileCode, FileJson, Printer, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Roadmap, RoadmapNode } from "@/lib/roadmaps/types";
import {
  exportRoadmapPdf,
  exportRoadmapMarkdown,
  exportRoadmapJson,
  exportRoadmapHtml,
  printRoadmap,
  type ExportSection,
} from "@/lib/roadmaps/pdf-export";

type RoadmapExportMenuProps = {
  roadmap: Roadmap;
  node?: RoadmapNode | null;
  className?: string;
  variant?: "button" | "fab";
};

function downloadText(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function RoadmapExportMenu({ roadmap, node, className, variant = "button" }: RoadmapExportMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const run = (action: () => void) => {
    action();
    setOpen(false);
  };

  const pdf = (sections?: ExportSection[]) =>
    exportRoadmapPdf(roadmap, { node, sections: node ? ["topics", "interview", "coding"] : sections ?? ["full"] });

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 font-semibold text-sm transition-all",
          variant === "fab"
            ? "fixed bottom-6 right-6 z-40 px-5 py-3 rounded-full gradient-primary text-brand-foreground shadow-xl hover:shadow-2xl"
            : "px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted"
        )}
      >
        <Download size={16} />
        Export
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-50 min-w-[220px] rounded-xl border border-border bg-card shadow-xl py-1.5",
            variant === "fab" ? "bottom-full right-0 mb-2" : "top-full right-0 mt-2"
          )}
        >
          <p className="px-3 py-1.5 text-[10px] font-bold uppercase text-muted-foreground">Export PDF</p>
          <MenuItem icon={FileText} label="Complete Roadmap" onClick={() => run(() => pdf(["full"]))} />
          {node && <MenuItem icon={FileText} label="Current Topic" onClick={() => run(() => pdf(["topics", "interview", "coding"]))} />}
          <MenuItem icon={FileText} label="Interview Questions" onClick={() => run(() => pdf(["interview"]))} />
          <MenuItem icon={FileText} label="Coding Problems" onClick={() => run(() => pdf(["coding"]))} />
          <MenuItem icon={FileText} label="Career Report" onClick={() => run(() => pdf(["career"]))} />
          <MenuItem icon={FileText} label="Portfolio Checklist" onClick={() => run(() => pdf(["portfolio"]))} />
          <div className="border-t border-border my-1" />
          <MenuItem icon={Printer} label="Print" onClick={() => run(printRoadmap)} />
          <MenuItem
            icon={FileCode}
            label="Export Markdown"
            onClick={() => run(() => downloadText(exportRoadmapMarkdown(roadmap, node), `${roadmap.slug}.md`, "text/markdown"))}
          />
          <MenuItem
            icon={FileCode}
            label="Export HTML"
            onClick={() => run(() => downloadText(exportRoadmapHtml(roadmap), `${roadmap.slug}.html`, "text/html"))}
          />
          <MenuItem
            icon={FileJson}
            label="Export JSON"
            onClick={() => run(() => downloadText(exportRoadmapJson(roadmap), `${roadmap.slug}.json`, "application/json"))}
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof FileText;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
    >
      <Icon size={14} className="text-muted-foreground shrink-0" />
      {label}
    </button>
  );
}
