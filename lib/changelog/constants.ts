import type { ChangeCategory, ProductId, ReleaseTag } from "./types";

export const CATEGORY_META: Record<
  ChangeCategory,
  { emoji: string; label: string; group: "core" | "product" | "platform" }
> = {
  feature: { emoji: "✨", label: "New Features", group: "core" },
  improvement: { emoji: "🚀", label: "Improvements", group: "core" },
  performance: { emoji: "⚡", label: "Performance", group: "core" },
  bugfix: { emoji: "🐛", label: "Bug Fixes", group: "core" },
  security: { emoji: "🔒", label: "Security", group: "core" },
  ui: { emoji: "🎨", label: "UI Improvements", group: "core" },
  accessibility: { emoji: "♿", label: "Accessibility", group: "core" },
  i18n: { emoji: "🌐", label: "Internationalization", group: "core" },
  mobile: { emoji: "📱", label: "Mobile", group: "platform" },
  desktop: { emoji: "💻", label: "Desktop", group: "platform" },
  ai: { emoji: "🤖", label: "AI Features", group: "product" },
  learning: { emoji: "📚", label: "Learning Platform", group: "product" },
  bornomaps: { emoji: "🗺️", label: "BornoMaps", group: "product" },
  bornocareer: { emoji: "💼", label: "BornoCareer", group: "product" },
  bornouni: { emoji: "🏫", label: "BornoUni", group: "product" },
  bornodev: { emoji: "💻", label: "BornoDev", group: "product" },
  resume: { emoji: "📝", label: "Resume Builder", group: "product" },
  assignment: { emoji: "📄", label: "Assignment Studio", group: "product" },
  labreport: { emoji: "🧪", label: "Lab Report Generator", group: "product" },
  news: { emoji: "📰", label: "News Hub", group: "product" },
  university: { emoji: "🎓", label: "University Hub", group: "product" },
  api: { emoji: "📦", label: "API Changes", group: "platform" },
  dx: { emoji: "🛠️", label: "Developer Experience", group: "platform" },
  infrastructure: { emoji: "⚙️", label: "Infrastructure", group: "platform" },
  analytics: { emoji: "📊", label: "Analytics", group: "platform" },
};

export const PRODUCT_META: Record<ProductId, { label: string; emoji: string }> = {
  bornoflow: { label: "BornoFlow", emoji: "🌊" },
  bornomaps: { label: "BornoMaps", emoji: "🗺️" },
  bornoai: { label: "Borno AI", emoji: "🤖" },
  bornocareer: { label: "BornoCareer", emoji: "💼" },
  bornouni: { label: "BornoUni", emoji: "🏫" },
  bornodev: { label: "BornoDev", emoji: "💻" },
  resume: { label: "Resume Builder", emoji: "📝" },
  devtools: { label: "Developer Tools", emoji: "🛠️" },
  interview: { label: "Interview Hub", emoji: "🎯" },
  learning: { label: "Learning Platform", emoji: "📚" },
  university: { label: "University Hub", emoji: "🎓" },
  assignment: { label: "Assignment Studio", emoji: "📄" },
  labreport: { label: "Lab Report Generator", emoji: "🧪" },
};

export const TAG_META: Record<ReleaseTag, { label: string; className: string }> = {
  new: { label: "New", className: "bg-brand/15 text-brand border-brand/25" },
  popular: { label: "Popular", className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25" },
  experimental: { label: "Experimental", className: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/25" },
  beta: { label: "Beta", className: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25" },
  deprecated: { label: "Deprecated", className: "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/25" },
  breaking: { label: "Breaking", className: "bg-destructive/15 text-destructive border-destructive/25" },
  improved: { label: "Improved", className: "bg-success/15 text-success border-success/25" },
  fixed: { label: "Fixed", className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25" },
  security: { label: "Security", className: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/25" },
  performance: { label: "Performance", className: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/25" },
};

export const RELEASE_TYPE_STYLES: Record<string, string> = {
  stable: "bg-success/15 text-success border-success/25",
  beta: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25",
  alpha: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/25",
  hotfix: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/25",
  major: "bg-brand/15 text-brand border-brand/25",
  minor: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/25",
  patch: "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/25",
};

export const STATUS_STYLES: Record<string, string> = {
  released: "bg-success/15 text-success border-success/25",
  beta: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25",
  alpha: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/25",
  deprecated: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25",
  archived: "bg-slate-500/15 text-slate-500 border-slate-500/25",
};
