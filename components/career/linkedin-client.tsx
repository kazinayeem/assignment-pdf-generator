"use client";

import { useMemo, useState } from "react";
import { Linkedin, CheckCircle2, AlertCircle } from "lucide-react";
import { CareerPageHeader } from "./career-page-header";

type Section = { label: string; score: number; tip: string };

function analyze(headline: string, about: string, experience: string, skills: string) {
  const sections: Section[] = [
    { label: "Headline", score: headline.length >= 20 && headline.length <= 120 ? 90 : headline.length > 0 ? 50 : 0, tip: "Use 20–120 characters with role + value proposition." },
    { label: "About Section", score: about.split(/\s+/).length >= 40 ? 85 : about.length > 0 ? 40 : 0, tip: "Write 3–5 paragraphs about your journey and goals." },
    { label: "Experience", score: experience.split("\n").filter(Boolean).length >= 2 ? 80 : experience.length > 0 ? 45 : 0, tip: "Add quantified achievements for each role." },
    { label: "Skills", score: skills.split(",").filter((s) => s.trim()).length >= 5 ? 90 : skills.length > 0 ? 50 : 0, tip: "List 10–15 relevant skills, prioritize top 3." },
    { label: "Profile Completeness", score: [headline, about, experience, skills].every((s) => s.trim().length > 0) ? 95 : 30, tip: "Complete all sections for maximum visibility." },
  ];
  const overall = Math.round(sections.reduce((a, s) => a + s.score, 0) / sections.length);
  return { sections, overall };
}

export function LinkedInClient() {
  const [headline, setHeadline] = useState("");
  const [about, setAbout] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");

  const analysis = useMemo(() => analyze(headline, about, experience, skills), [headline, about, experience, skills]);

  const suggestions = useMemo(() => ({
    headlines: [
      `${headline || "CS Student"} | Building scalable web apps with React & Node.js`,
      `Aspiring Software Engineer | Open to internships & collaborations`,
      `Full Stack Developer | TypeScript · React · Cloud`,
    ],
    summary: `I'm a passionate computer science student with hands-on experience in full-stack development. I enjoy solving complex problems and building user-centric applications. Currently seeking internship opportunities to grow alongside innovative teams.`,
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL", "Git", "System Design", "AWS", "Docker"],
  }), [headline]);

  return (
    <div>
      <CareerPageHeader title="LinkedIn Optimizer" description="Analyze your LinkedIn profile and get suggestions for headlines, summaries, skills, and experience." icon={Linkedin} badge="Profile Optimization" />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-5 space-y-4">
            {[
              { key: "headline", label: "Headline", value: headline, set: setHeadline, rows: 1 },
              { key: "about", label: "About", value: about, set: setAbout, rows: 4 },
              { key: "experience", label: "Experience (one per line)", value: experience, set: setExperience, rows: 4 },
              { key: "skills", label: "Skills (comma-separated)", value: skills, set: setSkills, rows: 2 },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">{f.label}</label>
                {f.rows === 1 ? (
                  <input value={f.value} onChange={(e) => f.set(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-sm min-h-[44px] outline-none focus:border-[#6D5DF6]/50" />
                ) : (
                  <textarea value={f.value} onChange={(e) => f.set(e.target.value)} rows={f.rows} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-sm outline-none focus:border-[#6D5DF6]/50" />
                )}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="glass-card p-6 text-center">
              <p className="text-sm text-slate-500 mb-1">Profile Score</p>
              <p className="text-5xl font-extrabold text-[#6D5DF6]">{analysis.overall}%</p>
            </div>
            {analysis.sections.map((s) => (
              <div key={s.label} className="glass-card p-4 flex gap-3">
                {s.score >= 70 ? <CheckCircle2 size={20} className="text-emerald-500 shrink-0" /> : <AlertCircle size={20} className="text-amber-500 shrink-0" />}
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-semibold text-sm">{s.label}</p>
                    <span className="text-sm text-slate-400">{s.score}%</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{s.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="glass-card p-5">
            <h3 className="font-bold mb-3">Better Headlines</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {suggestions.headlines.map((h) => <li key={h} className="p-2 rounded-lg bg-slate-50 dark:bg-white/5">{h}</li>)}
            </ul>
          </div>
          <div className="glass-card p-5">
            <h3 className="font-bold mb-3">Better Summary</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{suggestions.summary}</p>
          </div>
          <div className="glass-card p-5">
            <h3 className="font-bold mb-3">Recommended Skills</h3>
            <div className="flex flex-wrap gap-2">
              {suggestions.skills.map((s) => <span key={s} className="px-2 py-1 rounded-full bg-[#6D5DF6]/10 text-[#6D5DF6] text-xs font-medium">{s}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
