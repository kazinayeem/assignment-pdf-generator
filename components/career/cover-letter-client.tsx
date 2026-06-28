"use client";

import { useMemo, useState } from "react";
import { Mail, Download } from "lucide-react";
import { CareerPageHeader } from "./career-page-header";
import type { CoverLetterType } from "@/lib/career/types";
import { ToolsButton } from "@/components/tools/tools-button";

const TYPES: { id: CoverLetterType; label: string }[] = [
  { id: "internship", label: "Internship" },
  { id: "job", label: "Job" },
  { id: "scholarship", label: "Scholarship" },
  { id: "research", label: "Research Assistant" },
  { id: "graduate", label: "Graduate Program" },
];

const TEMPLATES = ["Professional", "Modern", "Academic", "Creative"];

function generateLetter(type: CoverLetterType, name: string, company: string, role: string) {
  const openings: Record<CoverLetterType, string> = {
    internship: `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${role} internship at ${company}. As a motivated computer science student, I am eager to apply my technical skills in a professional setting.`,
    job: `Dear Hiring Manager,\n\nI am excited to apply for the ${role} position at ${company}. With hands-on experience in software development and a passion for building impactful products, I am confident I would be a valuable addition to your team.`,
    scholarship: `Dear Scholarship Committee,\n\nI am honored to apply for the ${role} scholarship. My academic achievements and commitment to technology education make me a strong candidate for this opportunity.`,
    research: `Dear Professor,\n\nI am writing to express my interest in the Research Assistant position in ${role} at ${company}. My coursework and project experience have prepared me to contribute meaningfully to your research.`,
    graduate: `Dear Admissions Committee,\n\nI am applying to the ${role} program at ${company}. My background in software engineering and research interests align closely with your program's focus.`,
  };
  return `${openings[type]}\n\nThroughout my academic career, I have developed strong skills in programming, problem-solving, and collaborative teamwork. I am particularly drawn to ${company} because of its reputation for innovation and commitment to excellence.\n\nI would welcome the opportunity to discuss how my skills and enthusiasm can contribute to your team. Thank you for your consideration.\n\nSincerely,\n${name || "Your Name"}`;
}

export function CoverLetterClient() {
  const [type, setType] = useState<CoverLetterType>("internship");
  const [template, setTemplate] = useState("Professional");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  const letter = useMemo(() => generateLetter(type, name, company || "[Company]", role || "[Position]"), [type, name, company, role]);

  const download = (format: "txt" | "md") => {
    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter.${format === "md" ? "md" : "txt"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <CareerPageHeader title="Cover Letter Builder" description="Generate internship, job, scholarship, and research cover letters with live preview and export." icon={Mail} badge="AI-Assisted" />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="glass-card p-5 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Letter Type</label>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map((t) => (
                    <button key={t.id} type="button" onClick={() => setType(t.id)} className={`px-3 py-2 rounded-xl text-sm font-medium min-h-[44px] ${type === t.id ? "gradient-primary text-white" : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300"}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Template</label>
                <select value={template} onChange={(e) => setTemplate(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-sm outline-none focus:border-[#6D5DF6]/50 min-h-[44px]">
                  {TEMPLATES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              {(["name", "company", "role"] as const).map((field) => (
                <div key={field}>
                  <label className="text-xs font-bold uppercase text-slate-500 mb-2 block capitalize">{field === "role" ? "Position / Program" : field}</label>
                  <input
                    value={field === "name" ? name : field === "company" ? company : role}
                    onChange={(e) => { if (field === "name") setName(e.target.value); else if (field === "company") setCompany(e.target.value); else setRole(e.target.value); }}
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-sm outline-none focus:border-[#6D5DF6]/50 min-h-[44px]"
                    placeholder={field === "name" ? "Your full name" : field === "company" ? "Company or university" : "Role title"}
                  />
                </div>
              ))}
              <div className="flex flex-wrap gap-2">
                <ToolsButton onClick={() => download("txt")}><Download size={16} /> Export TXT</ToolsButton>
                <ToolsButton variant="secondary" onClick={() => download("md")}><Download size={16} /> Export Markdown</ToolsButton>
              </div>
            </div>
          </div>
          <div className="glass-card p-6 sm:p-8">
            <p className="text-xs font-bold uppercase text-slate-500 mb-4">Live Preview — {template}</p>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-slate-700 dark:text-slate-200 leading-relaxed">
              {letter}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
