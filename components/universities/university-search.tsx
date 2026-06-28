"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { UNIVERSITIES } from "@/lib/universities";
import { getSearchSuggestions, highlightText } from "@/lib/universities/search";
import type { SearchSuggestion } from "@/lib/universities/types";
import { cn } from "@/lib/utils";

type UniversitySearchProps = {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (suggestion: SearchSuggestion) => void;
};

export function UniversitySearch({ value, onChange, onSelect }: UniversitySearchProps) {
  const { t } = useTranslation("universities");
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const suggestions = value.trim().length >= 2
    ? getSearchSuggestions(UNIVERSITIES, value, 8)
    : [];

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  const select = useCallback((s: SearchSuggestion) => {
    onChange(s.label);
    onSelect?.(s);
    close();
    inputRef.current?.blur();
  }, [onChange, onSelect, close]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      select(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      close();
    }
  };

  return (
    <div className="relative">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden />
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(close, 150)}
        onKeyDown={handleKeyDown}
        placeholder={t("landing.searchPlaceholder")}
        aria-label={t("landing.searchPlaceholder")}
        aria-expanded={open && suggestions.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        role="combobox"
        className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 min-h-[44px]"
      />

      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 top-full left-0 right-0 mt-2 py-2 rounded-xl border border-border bg-card shadow-lg max-h-72 overflow-y-auto"
        >
          {suggestions.map((s, i) => (
            <li key={`${s.type}-${s.label}-${s.slug}`} role="option" aria-selected={i === activeIndex}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(s)}
                className={cn(
                  "w-full px-4 py-2.5 text-left transition-colors",
                  i === activeIndex ? "bg-brand/10" : "hover:bg-muted"
                )}
              >
                <span className="text-sm font-medium text-foreground block">
                  {highlightText(s.label, value).map((part, idx) =>
                    part.highlighted ? (
                      <mark key={idx} className="bg-brand/20 text-brand rounded px-0.5">{part.text}</mark>
                    ) : (
                      <span key={idx}>{part.text}</span>
                    )
                  )}
                </span>
                {s.sublabel && (
                  <span className="text-xs text-muted-foreground">
                    {s.sublabel} · {t(`search.types.${s.type}`)}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
