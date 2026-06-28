"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, ThumbsUp, Bookmark, Pin } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import {
  getCommunityPosts, addCommunityPost, addAnswer, togglePostLike, getBookmarkedPosts, togglePostBookmark,
} from "@/lib/universities/community";
import { UNIVERSITIES } from "@/lib/universities";
import { card, button, badge, animation } from "@/lib/design-system";
import { cn } from "@/lib/utils";

export function UniversityCommunityClient() {
  const { t } = useTranslation("universities");
  const [posts, setPosts] = useState(getCommunityPosts());
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", universitySlug: "", department: "", anonymous: false });
  const [answerText, setAnswerText] = useState<Record<string, string>>({});
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => { setBookmarks(getBookmarkedPosts()); }, []);

  const refresh = () => setPosts(getCommunityPosts({ query: query || undefined }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCommunityPost({
      ...form,
      author: form.anonymous ? "Anonymous" : "Student",
      pinned: false,
      tags: form.department ? [form.department] : [],
    });
    setForm({ title: "", body: "", universitySlug: "", department: "", anonymous: false });
    setShowForm(false);
    refresh();
  };

  const handleAnswer = (postId: string) => {
    const body = answerText[postId]?.trim();
    if (!body) return;
    addAnswer(postId, { body, author: "Student" });
    setAnswerText((p) => ({ ...p, [postId]: "" }));
    refresh();
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div {...animation.fadeUp} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">{t("community.title")}</h1>
        <p className="text-muted-foreground">{t("community.subtitle")}</p>
      </motion.div>

      <div className="flex gap-3 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && refresh()}
          placeholder={t("community.search")}
          className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm min-h-[44px]"
        />
        <button type="button" onClick={refresh} className={cn(button.secondary, "text-sm")}>{t("community.searchBtn")}</button>
        <button type="button" onClick={() => setShowForm(!showForm)} className={cn(button.primary, "text-sm")}>{t("community.ask")}</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={cn(card.base, "p-5 mb-6 space-y-3")}>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={t("community.questionTitle")} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm" />
          <textarea required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={3} placeholder={t("community.questionBody")} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm" />
          <select value={form.universitySlug} onChange={(e) => setForm({ ...form, universitySlug: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm">
            <option value="">{t("community.anyUniversity")}</option>
            {UNIVERSITIES.slice(0, 30).map((u) => <option key={u.slug} value={u.slug}>{u.shortName}</option>)}
          </select>
          <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder={t("review.department")} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.anonymous} onChange={(e) => setForm({ ...form, anonymous: e.target.checked })} />
            {t("review.anonymous")}
          </label>
          <button type="submit" className={cn(button.primary, "text-sm")}>{t("community.post")}</button>
        </form>
      )}

      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className={cn(card.base, "p-8 text-center text-muted-foreground")}>{t("community.empty")}</p>
        ) : posts.map((p) => (
          <div key={p.id} className={cn(card.base, "p-5")}>
            <div className="flex items-start gap-2 mb-2">
              {p.pinned && <Pin size={14} className="text-brand shrink-0 mt-0.5" />}
              <div className="flex-1">
                <h3 className="font-bold text-foreground">{p.title}</h3>
                <p className="text-xs text-muted-foreground">{p.author} · {new Date(p.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{p.body}</p>
            {p.tags.length > 0 && (
              <div className="flex gap-1 mb-3">{p.tags.map((tag) => <span key={tag} className={cn(badge.muted, "text-[10px]")}>{tag}</span>)}</div>
            )}
            <div className="flex gap-3 mb-3">
              <button type="button" onClick={() => { togglePostLike(p.id); refresh(); }} className="text-xs text-muted-foreground flex items-center gap-1 hover:text-brand">
                <ThumbsUp size={12} /> {p.likes} {t("reviews.helpful")}
              </button>
              <button type="button" onClick={() => setBookmarks(togglePostBookmark(p.id))} className={cn("text-xs flex items-center gap-1", bookmarks.includes(p.id) ? "text-brand" : "text-muted-foreground")}>
                <Bookmark size={12} /> {t("community.bookmark")}
              </button>
              <span className="text-xs text-muted-foreground flex items-center gap-1"><MessageSquare size={12} />{p.answers.length}</span>
            </div>
            {p.answers.map((a) => (
              <div key={a.id} className="ml-4 pl-4 border-l-2 border-brand/20 mb-2">
                <p className="text-sm text-muted-foreground">{a.body}</p>
                <p className="text-[10px] text-muted-foreground">{a.author}</p>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <input
                value={answerText[p.id] ?? ""}
                onChange={(e) => setAnswerText((prev) => ({ ...prev, [p.id]: e.target.value }))}
                placeholder={t("community.answer")}
                className="flex-1 px-3 py-1.5 rounded-xl border border-border bg-background text-xs"
              />
              <button type="button" onClick={() => handleAnswer(p.id)} className={cn(button.ghost, "text-xs")}>{t("community.reply")}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
