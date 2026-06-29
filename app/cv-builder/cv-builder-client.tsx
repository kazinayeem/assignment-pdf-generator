"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useCVStore } from "@/lib/cv-store";
import { scoreATS } from "@/lib/ats-scorer";
import CVEditor from "@/components/cv/cv-editor";
import CVPreview from "@/components/cv/cv-preview";
import TemplateSwitcher from "@/components/cv/template-switcher";
import type { SectionId, CVTemplate } from "@/lib/cv-types";
import {
  ArrowLeft,
  Download,
  Eye,
  EyeOff,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Palette,
  LayoutTemplate,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderOpen,
  Award,
  Languages,
  FileText,
  Loader2,
} from "lucide-react";

// ── Section nav items ─────────────────────────────────────────────────────────
const NAV_ITEMS: { id: SectionId | "personal"; label: string; icon: React.ElementType }[] = [
  { id: "personal",       label: "Personal Info",    icon: User },
  { id: "summary",        label: "Summary",          icon: FileText },
  { id: "experience",     label: "Experience",       icon: Briefcase },
  { id: "education",      label: "Education",        icon: GraduationCap },
  { id: "skills",         label: "Skills",           icon: Wrench },
  { id: "projects",       label: "Projects",         icon: FolderOpen },
  { id: "certifications", label: "Certifications",   icon: Award },
  { id: "languages",      label: "Languages",        icon: Languages },
];

const TEMPLATES: { id: CVTemplate; label: string; desc: string }[] = [
  { id: "modern",            label: "Modern",            desc: "Colored header, clean layout" },
  { id: "classic",           label: "Classic",           desc: "Traditional serif, timeless" },
  { id: "minimal",           label: "Minimal",           desc: "Two-column, sidebar layout" },
  { id: "modern-ats",        label: "ATS Pro",           desc: "Clean ATS-optimized design" },
  { id: "europass",          label: "Europass",          desc: "Europass academic focus" },
  { id: "dark-theme",        label: "Dark Theme",        desc: "Dark UI, tech aesthetic" },
  { id: "creative-gradient", label: "Creative Gradient", desc: "Colorful gradient sidebar" },
  { id: "minimal-elegant",   label: "Elegant",           desc: "Typography focused" },
  { id: "corporate",         label: "Corporate",         desc: "Executive business style" },
  { id: "academic",          label: "Academic",          desc: "Student & education focus" },
  { id: "startup",           label: "Startup",           desc: "Modern portfolio feel" },
  { id: "two-column",        label: "Two Column",        desc: "Left profile sidebar" },
  { id: "glassmorphism",     label: "Glassmorphism",     desc: "Premium glass UI effects" },
];

const ACCENT_COLORS = [
  "#2563eb", "#7c3aed", "#059669", "#dc2626",
  "#d97706", "#0891b2", "#db2777", "#374151",
];

// ── ATS Score Panel ───────────────────────────────────────────────────────────
function ATSPanel() {
  const { cv } = useCVStore();
  const result = scoreATS(cv);
  const [expanded, setExpanded] = useState(false);

  const gradeColor =
    result.grade === "A" ? "text-emerald-600" :
    result.grade === "B" ? "text-blue-600" :
    result.grade === "C" ? "text-yellow-600" :
    result.grade === "D" ? "text-orange-600" : "text-red-600";

  const barColor =
    result.score >= 90 ? "bg-emerald-500" :
    result.score >= 75 ? "bg-blue-500" :
    result.score >= 60 ? "bg-yellow-500" :
    result.score >= 45 ? "bg-orange-500" : "bg-red-500";

  const failed = result.checks.filter((c) => !c.passed);

  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`text-2xl font-black ${gradeColor}`}>{result.score}</div>
          <div>
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 text-left">ATS Score</p>
            <p className="text-[10px] text-gray-400">Grade: {result.grade} · {failed.length} issues</p>
          </div>
        </div>
        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>

      {/* Score bar */}
      <div className="px-4 pb-3">
        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${result.score}%` }}
          />
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-2 border-t border-gray-100 dark:border-gray-800 pt-3">
          {result.checks.map((check) => (
            <div key={check.label} className="flex items-start gap-2">
              {check.passed ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
              )}
              <div>
                <p className={`text-[11px] font-semibold ${check.passed ? "text-gray-600 dark:text-gray-400" : "text-gray-800 dark:text-gray-200"}`}>
                  {check.label}
                </p>
                {!check.passed && (
                  <p className="text-[10px] text-gray-400 mt-0.5">{check.tip}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CVBuilderClient() {
  const { cv, activeSection, setActiveSection, setTemplate, setAccentColor, resetCV } = useCVStore();
  const [showPreview, setShowPreview] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [tab, setTab] = useState<"edit" | "design">("edit");
  const [templateGalleryOpen, setTemplateGalleryOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = document.getElementById("cv-preview");
      if (!element) return;

      const opt = {
        margin: 0,
        filename: `${cv.personal.fullName || "cv"}-bornoflow.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: "mm" as const, format: "a4", orientation: "portrait" as const },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (e) {
      console.error("PDF export failed:", e);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 h-14 flex items-center px-4 gap-4">
        <Link href="/" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-500" />
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-sm text-gray-900 dark:text-white hidden sm:block">CV Builder</span>
          <span className="text-[10px] px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-900 font-bold hidden sm:block">
            ATS Ready
          </span>
        </div>

        <div className="flex-1" />

        {/* Mobile preview toggle */}
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold"
        >
          {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {showPreview ? "Edit" : "Preview"}
        </button>

        <button
          onClick={() => { if (confirm("Reset all CV data?")) resetCV(); }}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-red-500 transition-colors"
          title="Reset CV"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white rounded-xl text-sm font-bold transition-colors shadow-sm shadow-orange-200 dark:shadow-orange-900/30"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span className="hidden sm:inline">{exporting ? "Exporting…" : "Export PDF"}</span>
        </button>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left sidebar: section nav ── */}
        <aside className={`
          w-56 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800
          flex flex-col overflow-y-auto
          ${showPreview ? "hidden" : "hidden lg:flex"}
        `}>
          {/* Tab switcher */}
          <div className="p-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <button
                onClick={() => setTab("edit")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === "edit" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400"}`}
              >
                <FileText className="w-3 h-3" /> Edit
              </button>
              <button
                onClick={() => setTab("design")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === "design" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400"}`}
              >
                <Palette className="w-3 h-3" /> Design
              </button>
            </div>
          </div>

          {tab === "edit" ? (
            <nav className="flex-1 p-3 space-y-0.5">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2 mb-2">Sections</p>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          ) : (
            <div className="flex-1 p-3 space-y-5 overflow-y-auto">
              {/* Templates */}
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-1 mb-2 flex items-center gap-1.5">
                  <LayoutTemplate className="w-3 h-3" /> Template
                </p>
                <div className="space-y-1.5 max-h-[260px] overflow-y-auto">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl border transition-all ${
                        cv.template === t.id
                          ? "border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/40"
                          : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
                      }`}
                    >
                      <p className={`text-xs font-bold ${cv.template === t.id ? "text-orange-600 dark:text-orange-400" : "text-gray-700 dark:text-gray-300"}`}>
                        {t.label}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setTemplateGalleryOpen(true)}
                  className="w-full mt-2 px-3 py-2 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-[10px] font-bold text-gray-400 hover:text-gray-700 hover:border-gray-300 transition cursor-pointer"
                >
                  Browse All Templates →
                </button>
              </div>

              {/* Accent color */}
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-1 mb-2 flex items-center gap-1.5">
                  <Palette className="w-3 h-3" /> Accent Color
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setAccentColor(color)}
                      className={`w-full aspect-square rounded-xl border-2 transition-all ${
                        cv.accentColor === color
                          ? "border-gray-900 dark:border-white scale-110"
                          : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                {/* Custom color */}
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="color"
                    value={cv.accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-400 font-mono">{cv.accentColor}</span>
                </div>
              </div>
            </div>
          )}

          {/* ATS Score */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-800">
            <ATSPanel />
          </div>
        </aside>

        {/* ── Center: editor ── */}
        <div className={`
          flex-1 overflow-y-auto bg-white dark:bg-gray-900
          ${showPreview ? "hidden lg:block" : "block"}
          lg:max-w-[420px] lg:border-r lg:border-gray-100 dark:lg:border-gray-800
        `}>
          <CVEditor />
        </div>

        {/* ── Right: live preview ── */}
        <div className={`
          flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-950 p-6
          ${showPreview ? "block" : "hidden lg:block"}
        `}>
          <div className="max-w-[794px] mx-auto">
            {/* Preview header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Preview</p>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Auto-saved
              </div>
            </div>

            {/* CV preview — scaled down to fit */}
            <div
              ref={previewRef}
              className="bg-white shadow-2xl shadow-gray-300/50 dark:shadow-black/50 rounded-xl overflow-hidden"
              style={{ transformOrigin: "top left" }}
            >
              <CVPreview cv={cv} />
            </div>
          </div>
        </div>
      </div>
      {templateGalleryOpen && (
        <TemplateSwitcher
          active={cv.template}
          onSelect={(t) => { setTemplate(t); setTemplateGalleryOpen(false); }}
          onClose={() => setTemplateGalleryOpen(false)}
        />
      )}
    </div>
  );
}
