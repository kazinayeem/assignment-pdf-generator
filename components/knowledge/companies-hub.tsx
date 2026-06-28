"use client";

import Link from "next/link";
import { Building2, HelpCircle, Star } from "lucide-react";
import { getCompanyArticles } from "@/lib/knowledge/loader";

export function CompaniesHub() {
  const companies = getCompanyArticles();

  return (
    <div className="flex-1 min-w-0">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Company Interviews</h1>
      <p className="text-slate-500 mb-8">{companies.length} companies with interview experiences, questions, and preparation tips.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((c) => (
          <Link key={c.slug} href={c.route} className="glass-card p-5 hover:border-[#6D5DF6]/30 transition-colors group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6D5DF6] to-[#06B6D4] flex items-center justify-center">
                <Building2 size={18} className="text-white" />
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 flex items-center gap-1">
                <HelpCircle size={10} /> {c.questionCount}
              </span>
            </div>
            <h3 className="font-bold group-hover:text-[#6D5DF6] transition-colors">{c.name}</h3>
            <p className="text-xs text-slate-400 mt-1">{c.questionCount} documented questions</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 glass-card p-6">
        <h2 className="font-bold flex items-center gap-2 mb-3"><Star size={18} className="text-amber-500" /> Preparation Tips</h2>
        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
          <li>• Start with General Guidelines and Before Application articles</li>
          <li>• Practice coding questions from each target company</li>
          <li>• Review HR and behavioral questions for onsite rounds</li>
          <li>• Use the built-in quiz on each company page</li>
        </ul>
      </div>
    </div>
  );
}
