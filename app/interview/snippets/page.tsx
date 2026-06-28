"use client";

import { knowledgeSnippets } from "@/lib/knowledge/loader";
import { useState } from "react";

export default function SnippetsPage() {
  const [active, setActive] = useState(knowledgeSnippets[0]);

  return (
    <div className="flex-1 min-w-0">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Code Snippets</h1>
      <p className="text-slate-500 mb-8">{knowledgeSnippets.length} code files from docs/snippets</p>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="space-y-1">
          {knowledgeSnippets.map((s) => (
            <button key={s.slug} type="button" onClick={() => setActive(s)} className={`w-full text-left px-3 py-2 rounded-xl text-sm min-h-[44px] ${active?.slug === s.slug ? "bg-[#6D5DF6]/10 text-[#6D5DF6] font-semibold" : "hover:bg-slate-50 dark:hover:bg-white/5"}`}>
              {s.title}
            </button>
          ))}
        </div>
        {active && (
          <div className="lg:col-span-2 glass-card p-4 overflow-hidden">
            <pre className="text-sm overflow-x-auto text-slate-200 bg-[#0F172A] p-4 rounded-xl"><code>{active.content}</code></pre>
          </div>
        )}
      </div>
    </div>
  );
}
