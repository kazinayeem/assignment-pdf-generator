"use client";

import React from "react";
import { X, Check, LayoutTemplate } from "lucide-react";
import type { CVTemplate } from "@/lib/cv-types";

const TEMPLATE_META: { id: CVTemplate; name: string; desc: string; tags: string[] }[] = [
  { id: "modern",            name: "Modern",            desc: "Colored header, clean professional layout",              tags: ["Professional", "Clean"] },
  { id: "classic",           name: "Classic",           desc: "Traditional serif font, timeless design",                tags: ["Traditional", "Serif"] },
  { id: "minimal",           name: "Minimal",           desc: "Two-column minimal with sidebar",                        tags: ["Minimal", "Sidebar"] },
  { id: "modern-ats",        name: "ATS Pro",           desc: "Clean ATS-optimized recruiter-friendly design",          tags: ["ATS", "Clean"] },
  { id: "europass",          name: "Europass",          desc: "Europass inspired layout with academic focus",           tags: ["Academic", "Europass"] },
  { id: "dark-theme",        name: "Dark Theme",        desc: "Modern dark UI with tech/developer aesthetic",           tags: ["Dark", "Tech"] },
  { id: "creative-gradient", name: "Creative Gradient", desc: "Colorful gradient sidebar with modern card sections",    tags: ["Creative", "Colorful"] },
  { id: "minimal-elegant",   name: "Elegant",           desc: "Typography-focused design with generous whitespace",     tags: ["Elegant", "Minimal"] },
  { id: "corporate",         name: "Corporate",         desc: "Executive business style with formal structure",         tags: ["Corporate", "Formal"] },
  { id: "academic",          name: "Academic",          desc: "Student-focused layout highlighting education & projects", tags: ["Student", "Academic"] },
  { id: "startup",           name: "Startup",           desc: "Modern startup portfolio with skills visualization",     tags: ["Startup", "Portfolio"] },
  { id: "two-column",        name: "Two Column",        desc: "Balanced two-column with profile sidebar",               tags: ["Sidebar", "Balanced"] },
  { id: "glassmorphism",     name: "Glassmorphism",     desc: "Premium glass UI effects with modern gradient backdrop", tags: ["Premium", "Glass"] },
];

const TEMPLATE_COLORS: Record<string, string> = {
  "modern": "from-blue-500 to-indigo-600",
  "classic": "from-amber-600 to-orange-700",
  "minimal": "from-emerald-500 to-teal-600",
  "modern-ats": "from-sky-500 to-blue-600",
  "europass": "from-violet-500 to-purple-600",
  "dark-theme": "from-gray-800 to-gray-900",
  "creative-gradient": "from-pink-500 to-rose-600",
  "minimal-elegant": "from-stone-500 to-neutral-600",
  "corporate": "from-slate-700 to-slate-900",
  "academic": "from-teal-500 to-cyan-600",
  "startup": "from-orange-500 to-red-600",
  "two-column": "from-indigo-500 to-blue-700",
  "glassmorphism": "from-purple-500 to-fuchsia-600",
};

function TemplateCard({ id, name, desc, tags, active, onSelect }: {
  id: CVTemplate; name: string; desc: string; tags: string[]; active: boolean; onSelect: (id: CVTemplate) => void;
}) {
  const gradient = TEMPLATE_COLORS[id] || "from-gray-500 to-gray-600";
  return (
    <button
      onClick={() => onSelect(id)}
      className={`relative w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-lg hover:-translate-y-0.5 group ${
        active ? "border-orange-500 shadow-md shadow-orange-200" : "border-gray-100 hover:border-gray-200"
      }`}
    >
      {active && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      {/* Preview visual */}
      <div className={`w-full h-24 rounded-lg bg-gradient-to-br ${gradient} mb-3 flex items-center justify-center relative overflow-hidden`}>
        <LayoutTemplate className="w-8 h-8 text-white/40" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:8px_8px]" />
      </div>
      <h3 className={`text-xs font-bold ${active ? "text-orange-600" : "text-gray-800"} group-hover:text-orange-600 transition-colors`}>{name}</h3>
      <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
      <div className="flex flex-wrap gap-1 mt-2">
        {tags.map((t) => (
          <span key={t} className={`text-[8px] px-1.5 py-0.5 rounded font-semibold ${active ? "bg-orange-50 text-orange-600" : "bg-gray-50 text-gray-400"}`}>{t}</span>
        ))}
      </div>
    </button>
  );
}

export default function TemplateSwitcher({ active, onSelect, onClose }: {
  active: CVTemplate; onSelect: (id: CVTemplate) => void; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-3xl max-h-[80vh] mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Choose Template</h2>
            <p className="text-[10px] text-gray-400">13 professional CV templates to choose from</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-64px)]">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {TEMPLATE_META.map((t) => (
              <TemplateCard key={t.id} {...t} active={active === t.id} onSelect={onSelect} />
            ))}
          </div>
        </div>
        <div className="p-3 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition cursor-pointer">Done</button>
        </div>
      </div>
    </div>
  );
}

export { TEMPLATE_META };
