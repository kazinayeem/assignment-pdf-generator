"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Download,
  ExternalLink,
  FileText,
  Code,
  Printer,
  AlertTriangle,
  BookOpen,
  Github,
} from "lucide-react";
import type { Release } from "@/lib/changelog/types";
import { CATEGORY_META, PRODUCT_META, TAG_META, RELEASE_TYPE_STYLES, STATUS_STYLES } from "@/lib/changelog/constants";
import { groupChangesByCategory, formatReleaseDate } from "@/lib/changelog/utils";
import { downloadFile, printRelease, releaseToHtml, releaseToJson, releaseToMarkdown } from "@/lib/changelog/export";
import { exportReleasePdf } from "@/lib/changelog/pdf-export";
import { useTranslation } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

type ReleaseCardProps = {
  release: Release;
  locale: string;
  index: number;
};

export function ReleaseCard({ release, locale, index }: ReleaseCardProps) {
  const { t } = useTranslation("changelog");
  const [expanded, setExpanded] = useState(index === 0);
  const [showDownloads, setShowDownloads] = useState(false);
  const groups = groupChangesByCategory(release);

  const exports = [
    { label: "PDF", icon: FileText, action: () => exportReleasePdf(release) },
    { label: "Markdown", icon: Code, action: () => downloadFile(releaseToMarkdown(release), `${release.version}.md`, "text/markdown") },
    { label: "HTML", icon: Code, action: () => downloadFile(releaseToHtml(release), `${release.version}.html`, "text/html") },
    { label: "JSON", icon: Code, action: () => downloadFile(releaseToJson(release), `${release.version}.json`, "application/json") },
    { label: t("release.print"), icon: Printer, action: () => printRelease(release) },
  ];

  return (
    <motion.article
      id={`release-${release.id}`}
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative scroll-mt-28"
    >
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border lg:-ml-8 hidden lg:block" aria-hidden />
      <div className="absolute left-0 top-8 w-3 h-3 rounded-full bg-brand border-4 border-background -translate-x-[5px] lg:-ml-8 hidden lg:block" aria-hidden />

      <div
        className={cn(
          "rounded-2xl border border-border/80 bg-card/70 backdrop-blur-xl overflow-hidden",
          "hover:border-brand/25 hover:shadow-lg hover:shadow-brand/5 transition-all duration-300",
          release.archived && "opacity-75"
        )}
      >
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left p-5 sm:p-6 flex flex-col sm:flex-row sm:items-start gap-4"
          aria-expanded={expanded}
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xl font-extrabold text-foreground">{release.version}</span>
              <span className={cn("text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border", RELEASE_TYPE_STYLES[release.releaseType])}>
                {t(`releaseTypes.${release.releaseType}`)}
              </span>
              <span className={cn("text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border", STATUS_STYLES[release.status])}>
                {t(`status.${release.status}`)}
              </span>
              {release.archived && (
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border bg-slate-500/10 text-slate-500 border-slate-500/20">
                  {t("release.archived")}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">{release.title}</h3>
            <time className="text-sm text-muted-foreground" dateTime={release.date}>
              {formatReleaseDate(release.date, locale)}
            </time>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {release.products.map((p) => (
                <span key={p} className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                  {PRODUCT_META[p].emoji} {PRODUCT_META[p].label}
                </span>
              ))}
            </div>
          </div>
          <ChevronDown
            className={cn("w-5 h-5 text-muted-foreground shrink-0 transition-transform", expanded && "rotate-180")}
            aria-hidden
          />
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 sm:px-6 pb-6 border-t border-border/60 pt-5 space-y-5">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("release.overview")}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{release.overview}</p>
                </div>

                {Array.from(groups.entries()).map(([category, items]) => {
                  const meta = CATEGORY_META[category];
                  return (
                    <div key={category}>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-brand mb-2 flex items-center gap-1.5">
                        <span>{meta.emoji}</span> {meta.label}
                      </h4>
                      <ul className="space-y-2">
                        {items.map((item) => (
                          <li key={item.id} className="text-sm text-foreground flex flex-col gap-1">
                            <div className="flex items-start gap-2 flex-wrap">
                              <span className="text-brand mt-1.5 w-1.5 h-1.5 rounded-full bg-brand shrink-0" aria-hidden />
                              <span className="flex-1">{item.title}</span>
                              {item.tags?.map((tag) => (
                                <span key={tag} className={cn("text-[10px] px-1.5 py-0.5 rounded border font-medium", TAG_META[tag].className)}>
                                  {TAG_META[tag].label}
                                </span>
                              ))}
                            </div>
                            {item.description && <p className="text-xs text-muted-foreground ml-3.5">{item.description}</p>}
                            <div className="flex flex-wrap gap-2 ml-3.5">
                              {item.docsUrl && (
                                <Link href={item.docsUrl} className="text-xs text-brand hover:underline inline-flex items-center gap-1">
                                  <BookOpen size={11} /> Docs
                                </Link>
                              )}
                              {item.commitUrl && (
                                <a href={item.commitUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand hover:underline inline-flex items-center gap-1">
                                  <Github size={11} /> Commit
                                </a>
                              )}
                              {item.roadmapUrl && (
                                <Link href={item.roadmapUrl} className="text-xs text-brand hover:underline inline-flex items-center gap-1">
                                  <ExternalLink size={11} /> Roadmap
                                </Link>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}

                {release.breakingChanges && release.breakingChanges.length > 0 && (
                  <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-destructive mb-2 flex items-center gap-1.5">
                      <AlertTriangle size={14} /> {t("release.breaking")}
                    </h4>
                    <ul className="space-y-1">
                      {release.breakingChanges.map((b) => (
                        <li key={b} className="text-sm text-foreground">• {b}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {release.migrationGuide && release.migrationGuide.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("release.migration")}</h4>
                    <ul className="space-y-1">
                      {release.migrationGuide.map((m) => (
                        <li key={m} className="text-sm text-muted-foreground">• {m}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {release.knownIssues && release.knownIssues.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("release.knownIssues")}</h4>
                    <ul className="space-y-1">
                      {release.knownIssues.map((k) => (
                        <li key={k} className="text-sm text-muted-foreground">• {k}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {release.developerNotes && release.developerNotes.length > 0 && (
                  <div className="rounded-xl bg-muted/50 p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("release.devNotes")}</h4>
                    {release.developerNotes.map((n) => (
                      <p key={n} className="text-xs text-muted-foreground font-mono">{n}</p>
                    ))}
                  </div>
                )}

                {release.stats && (
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {release.stats.commits != null && <span>{release.stats.commits} commits</span>}
                    {release.stats.linesChanged != null && <span>{release.stats.linesChanged.toLocaleString()} lines</span>}
                    {release.stats.contributors != null && <span>{release.stats.contributors} contributors</span>}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60">
                  {release.githubUrl && (
                    <a href={release.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
                      <Github size={13} /> GitHub
                    </a>
                  )}
                  {release.docsUrl && (
                    <Link href={release.docsUrl} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
                      <BookOpen size={13} /> {t("release.documentation")}
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowDownloads(!showDownloads)}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-brand/10 text-brand text-xs font-semibold hover:bg-brand/15 transition-colors"
                  >
                    <Download size={13} /> {t("release.download")}
                  </button>
                </div>

                {showDownloads && (
                  <div className="flex flex-wrap gap-2">
                    {exports.map((ex) => (
                      <button
                        key={ex.label}
                        type="button"
                        onClick={ex.action}
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
                      >
                        <ex.icon size={13} /> {ex.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}
