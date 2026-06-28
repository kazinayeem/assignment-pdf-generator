"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Building2 } from "lucide-react";
import { searchKnowledge } from "@/lib/knowledge/loader";

export function KnowledgeSearchClient() {
  const [query, setQuery] = useState("");
  const results = searchKnowledge(query, 30);

  const highlight = (text: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? <mark key={i} className="bg-brand/20 text-brand rounded px-0.5">{part}</mark> : part
    );
  };

  return (
    <div className="flex-1 max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-6">Search Knowledge Base</h1>
      <div className="relative mb-4">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search titles, questions, companies, content..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-base outline-none focus:border-brand/50 min-h-[44px]"
          autoFocus
        />
      </div>
      <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
        Instant search across all imported docs
      </div>

      {query.trim() && (
        <p className="text-sm text-slate-500 mb-4">{results.length} result(s)</p>
      )}

      <div className="space-y-3">
        {results.map((r) => (
          <Link key={r.id} href={r.route} className="glass-card p-4 block hover:border-brand/30 transition-colors">
            <div className="flex items-start gap-3">
              <Building2 size={18} className="text-brand shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{highlight(r.title)}</p>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{highlight(r.summary)}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 capitalize">{r.category}</span>
                  {r.company && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">{r.company}</span>}
                </div>
              </div>
            </div>
          </Link>
        ))}
        {query.trim() && results.length === 0 && (
          <p className="text-center text-slate-400 py-12">No results found for &quot;{query}&quot;</p>
        )}
      </div>
    </div>
  );
}
