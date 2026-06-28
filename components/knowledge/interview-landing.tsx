"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, BookOpen, Archive, Sparkles, Search, Trophy, FileText } from "lucide-react";
import { knowledgeIndex, getImportStats } from "@/lib/knowledge/loader";
import { useKnowledgeStore } from "@/lib/knowledge-store";

const stats = getImportStats();

export function InterviewLanding() {
  const { recentRoutes, bookmarks } = useKnowledgeStore();
  const recent = recentRoutes.map((r) => knowledgeIndex.articles.find((a) => a.route === r)).filter(Boolean);

  return (
    <div className="flex-1 min-w-0 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 text-brand text-sm font-semibold mb-4 border border-brand/20">
          <Sparkles size={14} /> Bangladesh Tech Interview Knowledge Base
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Interview Hub
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed mb-8">
          Crowd-sourced interview questions from {stats.companiesDetected}+ Bangladesh tech companies — {stats.questionsExtracted}+ questions, notes, and resources imported from the CampusFlow docs library.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: "Companies", value: stats.companiesDetected, icon: Building2 },
            { label: "Questions", value: `${stats.questionsExtracted}+`, icon: FileText },
            { label: "Articles", value: stats.markdownFiles, icon: BookOpen },
            { label: "Quizzes", value: stats.quizzesGenerated, icon: Trophy },
          ].map((s) => (
            <div key={s.label} className="glass-card p-4 text-center">
              <s.icon size={20} className="text-brand mx-auto mb-2" />
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {[
            { href: "/interview/companies", icon: Building2, title: "Companies", desc: `${stats.companiesDetected} company interview experiences`, color: "from-brand to-brand-secondary" },
            { href: "/interview/notes", icon: BookOpen, title: "Notes", desc: "Theory notes and cheat sheets", color: "from-emerald-500 to-teal-600" },
            { href: "/interview/resources", icon: FileText, title: "Resources", desc: "Study resources and references", color: "from-blue-500 to-cyan-500" },
            { href: "/interview/archive", icon: Archive, title: "Archive", desc: "Historical interview content", color: "from-slate-500 to-slate-600" },
            { href: "/interview/search", icon: Search, title: "Search", desc: "Full-text search across all content", color: "from-amber-500 to-orange-500" },
            { href: "/interview/snippets", icon: FileText, title: "Code Snippets", desc: "Programming code examples", color: "from-pink-500 to-rose-500" },
          ].map((card) => (
            <Link key={card.href} href={card.href} className="glass-card p-5 hover:border-brand/30 transition-colors group">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                <card.icon size={20} className="text-white" />
              </div>
              <h3 className="font-bold group-hover:text-brand transition-colors">{card.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{card.desc}</p>
            </Link>
          ))}
        </div>

        {recent.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold mb-4">Continue Reading</h2>
            <div className="space-y-2">
              {recent.slice(0, 5).map((a) => a && (
                <Link key={a.route} href={a.route} className="glass-card p-4 block hover:border-brand/30">
                  <p className="font-semibold text-sm">{a.title}</p>
                  <p className="text-xs text-slate-400">{a.company ?? a.category}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {bookmarks.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-4">Bookmarks</h2>
            <div className="flex flex-wrap gap-2">
              {bookmarks.slice(0, 8).map((r) => {
                const a = knowledgeIndex.articles.find((x) => x.route === r);
                return a ? <Link key={r} href={r} className="px-3 py-2 rounded-xl bg-brand/10 text-brand text-sm font-medium">{a.title}</Link> : null;
              })}
            </div>
          </section>
        )}
      </motion.div>
    </div>
  );
}
