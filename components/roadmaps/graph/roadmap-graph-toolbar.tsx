"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import type { GraphFilters } from "@/lib/roadmaps/graph-utils";
import { DEFAULT_GRAPH_FILTERS } from "@/lib/roadmaps/graph-utils";
import type { RoadmapDifficulty } from "@/lib/roadmaps/types";
import { cn } from "@/lib/utils";

type RoadmapGraphToolbarProps = {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filters: GraphFilters;
  onFiltersChange: (f: GraphFilters) => void;
  matchCount: number;
};

const CONTENT_FILTERS = [
  { id: "all", label: "All" },
  { id: "interview", label: "Interview" },
  { id: "projects", label: "Projects" },
  { id: "theory", label: "Theory" },
  { id: "coding", label: "Coding" },
] as const;

const STATUS_FILTERS = [
  { id: "all", label: "All" },
  { id: "completed", label: "Completed" },
  { id: "not-started", label: "Not Started" },
  { id: "bookmarked", label: "Bookmarked" },
] as const;

export function RoadmapGraphToolbar({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  matchCount,
}: RoadmapGraphToolbarProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-3 mb-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search topics, projects, interview questions, tools…"
            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors",
            showFilters ? "border-brand bg-brand/10 text-brand" : "border-border bg-card hover:bg-muted"
          )}
        >
          <Filter size={16} />
          Filters
        </button>
      </div>

      {searchQuery && (
        <p className="text-xs text-muted-foreground">
          {matchCount} topic{matchCount !== 1 ? "s" : ""} matched
        </p>
      )}

      {showFilters && (
        <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-border bg-card/80">
          <FilterGroup
            label="Difficulty"
            options={["all", "beginner", "intermediate", "advanced", "expert"]}
            value={filters.difficulty}
            onChange={(v) => onFiltersChange({ ...filters, difficulty: v as RoadmapDifficulty | "all" })}
          />
          <FilterGroup
            label="Status"
            options={STATUS_FILTERS.map((s) => s.id)}
            labels={STATUS_FILTERS.map((s) => s.label)}
            value={filters.status}
            onChange={(v) => onFiltersChange({ ...filters, status: v as GraphFilters["status"] })}
          />
          <FilterGroup
            label="Content"
            options={CONTENT_FILTERS.map((c) => c.id)}
            labels={CONTENT_FILTERS.map((c) => c.label)}
            value={filters.content}
            onChange={(v) => onFiltersChange({ ...filters, content: v as GraphFilters["content"] })}
          />
          <FilterGroup
            label="Sort"
            options={["default", "recommended", "popular", "recent"]}
            value={filters.sort}
            onChange={(v) => onFiltersChange({ ...filters, sort: v as GraphFilters["sort"] })}
          />
          <button
            type="button"
            onClick={() => onFiltersChange(DEFAULT_GRAPH_FILTERS)}
            className="text-xs font-semibold text-brand hover:underline self-end ml-auto"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}

function FilterGroup({
  label,
  options,
  labels,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  labels?: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[10px] font-bold uppercase text-muted-foreground mr-1">{label}</span>
      {options.map((opt, i) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "px-2 py-1 rounded-lg text-[10px] font-semibold capitalize border transition-colors",
            value === opt ? "bg-brand/10 border-brand text-brand" : "border-border hover:bg-muted"
          )}
        >
          {labels?.[i] ?? opt.replace("-", " ")}
        </button>
      ))}
    </div>
  );
}
