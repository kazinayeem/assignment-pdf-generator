"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { markdownSanitizeSchema } from "@/lib/markdown/sanitize-schema";
import { cn } from "@/lib/utils";

type MarkdownRendererProps = {
  content: string;
  className?: string;
  onCopyCode?: (code: string) => void;
};

export function MarkdownRenderer({ content, className, onCopyCode }: MarkdownRendererProps) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      <div className={cn("kb-prose prose prose-slate dark:prose-invert max-w-none", className)}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }], [rehypeSanitize, markdownSanitizeSchema]]}
          components={{
            img: ({ src, alt }) => (
              <button type="button" onClick={() => src && setLightbox(String(src))} className="block my-4 w-full">
                <img src={src} alt={alt ?? ""} loading="lazy" className="rounded-xl border border-border max-w-full h-auto cursor-zoom-in" />
              </button>
            ),
            a: ({ href, children }) => (
              <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel={href?.startsWith("http") ? "noopener noreferrer" : undefined} className="text-brand hover:underline">
                {children}
              </a>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-4 rounded-xl border border-border">
                <table className="min-w-full text-sm">{children}</table>
              </div>
            ),
            pre: ({ children }) => <div className="relative group">{children}</div>,
            code: ({ className: cls, children, ...props }) => {
              const match = /language-(\w+)/.exec(cls || "");
              const code = String(children).replace(/\n$/, "");
              if (match) {
                return (
                  <div className="relative my-4 rounded-xl bg-brand-dark border border-border overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-border text-xs text-muted-foreground">
                      <span>{match[1]}</span>
                      <button
                        type="button"
                        onClick={() => { navigator.clipboard.writeText(code); onCopyCode?.(code); }}
                        className="px-2 py-1 rounded hover:bg-white/10 min-h-[32px]"
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto text-sm text-slate-200"><code className={cls} {...props}>{children}</code></pre>
                  </div>
                );
              }
              return <code className="px-1.5 py-0.5 rounded bg-muted text-sm" {...props}>{children}</code>;
            },
            details: ({ children }) => (
              <details className="my-4 rounded-xl border border-brand/20 bg-brand/5 p-4 open:shadow-sm">
                {children}
              </details>
            ),
            summary: ({ children }) => (
              <summary className="cursor-pointer font-semibold text-brand min-h-[44px] flex items-center">{children}</summary>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-brand pl-4 my-4 text-muted-foreground italic">{children}</blockquote>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {lightbox && (
        <button type="button" className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setLightbox(null)} aria-label="Close image">
          <img src={lightbox} alt="" className="max-w-full max-h-[90vh] rounded-xl" />
        </button>
      )}
    </>
  );
}

export function TableOfContents({ headings }: { headings: { id: string; text: string; level: number }[] }) {
  const items = useMemo(() => headings.filter((h) => h.level <= 3), [headings]);
  if (!items.length) return null;

  return (
    <nav className="glass-card p-4 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto" aria-label="Table of contents">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">On this page</p>
      <ul className="space-y-2">
        {items.map((h) => (
          <li key={h.id} style={{ paddingLeft: `${(h.level - 1) * 12}px` }}>
            <a href={`#${h.id}`} className="text-sm text-muted-foreground hover:text-brand line-clamp-2">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
