"use client";

import { cn } from "@/lib/utils";
type FilterChipsProps<T extends string = string> = {
  filters: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
  className?: string;
  ariaLabel?: string;
};

export function FilterChips<T extends string = string>({
  filters,
  active,
  onChange,
  className,
  ariaLabel = "Filter",
}: FilterChipsProps<T>) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="tablist" aria-label={ariaLabel}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          role="tab"
          aria-selected={active === filter.id}
          onClick={() => onChange(filter.id)}
          className={cn(
            "px-4 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px] cursor-pointer",
            active === filter.id
              ? "bg-gradient-to-r from-brand to-brand-secondary text-white shadow-md shadow-brand/20"
              : "bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-border dark:border-white/10 hover:border-brand/30 hover:text-brand"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
