"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, Share2, Printer, Clock, Building2, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import type { KnowledgeArticle } from "@/lib/knowledge/types";
import { getAdjacentArticles, getArticleBySlug } from "@/lib/knowledge/loader";
import { MarkdownRenderer, TableOfContents } from "./markdown-loader";
import { QuestionCards } from "./question-cards";
import { KnowledgeQuizPanel } from "./knowledge-quiz-panel";
import { useKnowledgeStore } from "@/lib/knowledge-store";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const CATEGORY_LABELS: Record<string, string> = {
  companies: "Interview Experience",
  notes: "Theory Notes",
  resources: "Resources",
  archive: "Archive",
  upcoming: "Upcoming",
  hub: "Hub",
};

export function ArticleReader({ article }: { article: KnowledgeArticle }) {
  const { toggleBookmark, isBookmarked, markRead, isRead, addRecent, setProgress } = useKnowledgeStore();
  const { prev, next } = getAdjacentArticles(article.route);
  const bookmarked = isBookmarked(article.route);
  const read = isRead(article.route);

  useEffect(() => {
    addRecent(article.route);
    const onScroll = () => {
      const el = document.documentElement;
      const pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100) || 0;
      setProgress(article.route, pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [article.route, addRecent, setProgress]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) await navigator.share({ title: article.title, url });
    else { await navigator.clipboard.writeText(url); toast.success("Link copied"); }
  };

  return (
    <div className="flex-1 min-w-0">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        {/* Hero */}
        <div className="mb-8 pb-8 border-b border-slate-200 dark:border-white/10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs px-3 py-1 rounded-full bg-[#6D5DF6]/10 text-[#6D5DF6] font-semibold capitalize">{CATEGORY_LABELS[article.category] ?? article.category}</span>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 capitalize">{article.difficulty}</span>
            {article.company && (
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center gap-1">
                <Building2 size={12} /> {article.company}
              </span>
            )}
            {read && <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-600 flex items-center gap-1"><CheckCircle2 size={12} /> Read</span>}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">{article.title}</h1>
          <p className="text-slate-500 leading-relaxed max-w-3xl">{article.summary}</p>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-400">
            <span className="flex items-center gap-1"><Clock size={14} /> {article.readingMinutes} min read</span>
            <span>{article.questions.length} questions</span>
            {article.lastUpdated && <span>Updated {new Date(article.lastUpdated).toLocaleDateString()}</span>}
          </div>
          <div className="flex flex-wrap gap-2 mt-5">
            <button type="button" onClick={() => toggleBookmark(article.route)} className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium min-h-[44px] border", bookmarked ? "border-[#6D5DF6] text-[#6D5DF6] bg-[#6D5DF6]/5" : "border-slate-200 dark:border-white/10")}>
              <Bookmark size={16} className={bookmarked ? "fill-current" : ""} /> Bookmark
            </button>
            <button type="button" onClick={() => { markRead(article.route); toast.success("Marked as read"); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium min-h-[44px] border border-slate-200 dark:border-white/10">
              <CheckCircle2 size={16} /> Mark Read
            </button>
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium min-h-[44px] border border-slate-200 dark:border-white/10">
              <Printer size={16} /> Print
            </button>
            <button type="button" onClick={handleShare} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium min-h-[44px] border border-slate-200 dark:border-white/10">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>

        <div className="grid xl:grid-cols-[1fr_240px] gap-8">
          <div>
            <MarkdownRenderer content={article.content} onCopyCode={() => toast.success("Code copied")} />

            {article.enhancements.keyTakeaways.length > 0 && (
              <section className="mt-10 glass-card p-6">
                <h2 className="text-lg font-bold mb-4">Key Takeaways</h2>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {article.enhancements.keyTakeaways.map((t) => <li key={t}>• {t}</li>)}
                </ul>
              </section>
            )}

            {article.enhancements.interviewTips.length > 0 && (
              <section className="mt-6 glass-card p-6">
                <h2 className="text-lg font-bold mb-4">Interview Tips</h2>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {article.enhancements.interviewTips.map((t) => <li key={t}>💡 {t}</li>)}
                </ul>
              </section>
            )}

            {article.questions.length > 0 && <QuestionCards questions={article.questions} company={article.company} />}

            {article.quiz.length > 0 && <KnowledgeQuizPanel quiz={article.quiz.slice(0, 10)} title={article.title} />}
          </div>

          <div className="hidden xl:block">
            <TableOfContents headings={article.headings} />
          </div>
        </div>

        {/* Related & Nav */}
        {article.relatedSlugs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold mb-4">Related Articles</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {article.relatedSlugs.map((slug) => {
                const rel = getArticleBySlug(slug);
                if (!rel) return null;
                return (
                  <Link key={slug} href={rel.route} className="glass-card p-4 hover:border-[#6D5DF6]/30 transition-colors">
                    <p className="font-semibold text-sm">{rel.title}</p>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{rel.summary}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-200 dark:border-white/10 gap-4">
          {prev ? (
            <Link href={prev.route} className="inline-flex items-center gap-2 text-sm text-[#6D5DF6] hover:underline min-h-[44px] max-w-[45%]">
              <ArrowLeft size={14} className="shrink-0" /><span className="truncate">{prev.title}</span>
            </Link>
          ) : <div />}
          {next ? (
            <Link href={next.route} className="inline-flex items-center gap-2 text-sm text-[#6D5DF6] hover:underline min-h-[44px] max-w-[45%] text-right">
              <span className="truncate">{next.title}</span><ArrowRight size={14} className="shrink-0" />
            </Link>
          ) : <div />}
        </div>
      </motion.div>
    </div>
  );
}
