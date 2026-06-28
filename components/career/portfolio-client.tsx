"use client";

import { useState } from "react";
import { Layout, Github, Moon, Sun } from "lucide-react";
import { CareerPageHeader } from "./career-page-header";
import { ToolsButton } from "@/components/tools/tools-button";

const THEMES = ["Minimal", "Developer", "Creative", "Dark Pro"];
const SECTIONS = ["Projects", "Skills", "Experience", "Timeline", "Blog", "Contact"];

export function PortfolioClient() {
  const [name, setName] = useState("Your Name");
  const [title, setTitle] = useState("Full Stack Developer");
  const [bio, setBio] = useState("Passionate CS student building modern web applications.");
  const [github, setGithub] = useState("github.com/username");
  const [theme, setTheme] = useState("Developer");
  const [darkMode, setDarkMode] = useState(true);
  const [enabled, setEnabled] = useState<string[]>(["Projects", "Skills", "Experience", "Contact"]);

  const toggleSection = (s: string) => {
    setEnabled((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  return (
    <div>
      <CareerPageHeader title="Portfolio Builder" description="Create a modern developer portfolio with projects, skills, GitHub integration, and multiple themes." icon={Layout} badge="One-click Deploy Ready" />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-5 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-sm min-h-[44px] outline-none focus:border-brand/50" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-sm min-h-[44px] outline-none focus:border-brand/50" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-sm min-h-[80px] outline-none focus:border-brand/50" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">GitHub</label>
              <input value={github} onChange={(e) => setGithub(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-sm min-h-[44px] outline-none focus:border-brand/50" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Theme</label>
              <div className="flex flex-wrap gap-2">
                {THEMES.map((t) => (
                  <button key={t} type="button" onClick={() => setTheme(t)} className={`px-3 py-2 rounded-xl text-sm font-medium min-h-[44px] ${theme === t ? "gradient-primary text-white" : "bg-slate-100 dark:bg-white/5"}`}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Sections</label>
              <div className="flex flex-wrap gap-2">
                {SECTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => toggleSection(s)} className={`px-3 py-2 rounded-xl text-sm font-medium min-h-[44px] ${enabled.includes(s) ? "bg-brand/10 text-brand border border-brand/30" : "bg-slate-100 dark:bg-white/5 text-slate-500"}`}>{s}</button>
                ))}
              </div>
            </div>
            <ToolsButton onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun size={16} /> : <Moon size={16} />} Toggle Preview Mode
            </ToolsButton>
          </div>

          <div className={`rounded-2xl p-6 sm:p-8 border ${darkMode ? "bg-[#0F172A] text-white border-white/10" : "bg-white text-slate-900 border-slate-200"}`}>
            <p className="text-xs text-slate-400 mb-4">{theme} Theme Preview</p>
            <h2 className="text-2xl font-extrabold mb-1">{name}</h2>
            <p className="text-brand font-medium mb-3">{title}</p>
            <p className={`text-sm mb-6 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{bio}</p>
            <div className="flex items-center gap-2 text-sm mb-6">
              <Github size={16} /> {github}
            </div>
            {enabled.map((s) => (
              <div key={s} className={`mb-4 p-4 rounded-xl ${darkMode ? "bg-white/5" : "bg-slate-50"}`}>
                <h3 className="font-bold text-sm mb-2">{s}</h3>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Your {s.toLowerCase()} content will appear here.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
