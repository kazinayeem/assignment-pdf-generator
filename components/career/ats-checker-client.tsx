"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ScanSearch, Download, CheckCircle2, XCircle } from "lucide-react";
import { CareerPageHeader } from "./career-page-header";
import { useCVStore } from "@/lib/cv-store";
import { scoreATS } from "@/lib/ats-scorer";
import { useCareerStore } from "@/lib/career-store";
import { ToolsButton } from "@/components/tools/tools-button";
import { cn } from "@/lib/utils";

const ACTION_VERBS = ["developed", "implemented", "designed", "led", "optimized", "built", "created", "managed"];

export function ATSCheckerClient() {
  const cv = useCVStore((s) => s.cv);
  const { setAtsScore, setResumeScore, addActivity } = useCareerStore();
  const [useCV, setUseCV] = useState(true);
  const [pasteText, setPasteText] = useState("");

  const result = useMemo(() => {
    if (useCV) return scoreATS(cv);
    return null;
  }, [useCV, cv]);

  const pasteAnalysis = useMemo(() => {
    if (useCV || !pasteText.trim()) return null;
    const text = pasteText.toLowerCase();
    const words = pasteText.split(/\s+/).length;
    const hasEmail = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(pasteText);
    const hasPhone = /\d{7,}/.test(pasteText);
    const actionVerbs = ACTION_VERBS.filter((v) => text.includes(v));
    const sections = ["experience", "education", "skills", "projects"].filter((s) => text.includes(s));
    let score = 0;
    if (words >= 150) score += 20;
    if (hasEmail) score += 15;
    if (hasPhone) score += 10;
    if (actionVerbs.length >= 3) score += 20;
    if (sections.length >= 2) score += 20;
    if (words >= 300) score += 15;
    score = Math.min(100, score);
    return {
      score,
      grade: score >= 80 ? "A" : score >= 65 ? "B" : score >= 50 ? "C" : score >= 35 ? "D" : "F",
      keywords: actionVerbs,
      missing: [
        !hasEmail && "Email address",
        !hasPhone && "Phone number",
        words < 150 && "More content (150+ words)",
        actionVerbs.length < 3 && "Action verbs",
        sections.length < 2 && "Standard sections",
      ].filter(Boolean) as string[],
      readability: words > 500 ? "Good length" : words > 200 ? "Moderate" : "Too short",
    };
  }, [useCV, pasteText]);

  const displayScore = useCV ? result?.score : pasteAnalysis?.score;
  const displayGrade = useCV ? result?.grade : pasteAnalysis?.grade;

  useEffect(() => {
    if (displayScore) {
      setAtsScore(displayScore);
      setResumeScore(displayScore);
    }
  }, [displayScore, setAtsScore, setResumeScore]);

  const downloadReport = () => {
    const lines = [
      "ATS Resume Analysis Report",
      "==========================",
      `Score: ${displayScore}/100 (Grade: ${displayGrade})`,
      "",
      useCV ? "Source: CV Builder data" : "Source: Pasted text",
      "",
      ...(useCV && result
        ? result.checks.map((c) => `${c.passed ? "✓" : "✗"} ${c.label}: ${c.tip}`)
        : pasteAnalysis
          ? [
              `Keywords found: ${pasteAnalysis.keywords.join(", ") || "None"}`,
              `Readability: ${pasteAnalysis.readability}`,
              `Missing: ${pasteAnalysis.missing.join(", ")}`,
            ]
          : []),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ats-report.txt";
    a.click();
    URL.revokeObjectURL(url);
    addActivity("Downloaded", "ATS analysis report");
  };

  return (
    <div>
      <CareerPageHeader
        title="ATS Resume Checker"
        description="Analyze your resume for ATS compatibility — keywords, formatting, sections, and actionable improvements."
        icon={ScanSearch}
        badge="ATS Optimization"
      />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-wrap gap-2">
          <ToolsButton variant={useCV ? "primary" : "secondary"} onClick={() => setUseCV(true)}>Use CV Builder Data</ToolsButton>
          <ToolsButton variant={!useCV ? "primary" : "secondary"} onClick={() => setUseCV(false)}>Paste Resume Text</ToolsButton>
        </div>

        {!useCV && (
          <div className="glass-card p-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Resume Text</label>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste your resume content here..."
              className="w-full min-h-[200px] rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 text-sm outline-none focus:border-brand/50"
            />
          </div>
        )}

        {displayScore !== undefined && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 sm:p-8 text-center">
            <p className="text-sm text-slate-500 mb-2">ATS Score</p>
            <p className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-brand to-brand-accent bg-clip-text text-transparent tabular-nums">
              {displayScore}
              <span className="text-2xl text-slate-400">/100</span>
            </p>
            <p className="text-lg font-bold text-slate-700 dark:text-slate-200 mt-2">Grade: {displayGrade}</p>
            <ToolsButton onClick={downloadReport} className="mt-4">
              <Download size={16} aria-hidden /> Download Report
            </ToolsButton>
          </motion.div>
        )}

        {useCV && result && (
          <div className="grid sm:grid-cols-2 gap-3">
            {result.checks.map((check) => (
              <div key={check.label} className={cn("glass-card p-4 flex gap-3", check.passed ? "border-emerald-500/20" : "border-red-500/20")}>
                {check.passed ? <CheckCircle2 size={20} className="text-emerald-500 shrink-0" /> : <XCircle size={20} className="text-red-500 shrink-0" />}
                <div>
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{check.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{check.tip}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!useCV && pasteAnalysis && (
          <div className="space-y-4">
            <div className="glass-card p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">Keyword Recommendations</h3>
              <div className="flex flex-wrap gap-2">
                {ACTION_VERBS.map((v) => (
                  <span key={v} className={cn("px-3 py-1 rounded-full text-xs font-medium", pasteAnalysis.keywords.includes(v) ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-100 dark:bg-white/5 text-slate-500")}>
                    {v}
                  </span>
                ))}
              </div>
            </div>
            {pasteAnalysis.missing.length > 0 && (
              <div className="glass-card p-5">
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">Missing / Improve</h3>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                  {pasteAnalysis.missing.map((m) => <li key={m}>• {m}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
