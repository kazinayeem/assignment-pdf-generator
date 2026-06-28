"use client";

import { useMemo, useState } from "react";
import { Github, Download } from "lucide-react";
import { CareerPageHeader } from "./career-page-header";
import { ToolsButton } from "@/components/tools/tools-button";

const TECH_ICONS = ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "Docker"];

export function GitHubReadmeClient() {
  const [name, setName] = useState("Your Name");
  const [username, setUsername] = useState("username");
  const [bio, setBio] = useState("Full Stack Developer | CS Student");
  const [project, setProject] = useState("awesome-project");
  const [mode, setMode] = useState<"profile" | "project">("profile");
  const [selectedTech, setSelectedTech] = useState<string[]>(["JavaScript", "React", "TypeScript"]);

  const readme = useMemo(() => {
    const badges = selectedTech.map((t) => `![${t}](https://img.shields.io/badge/${encodeURIComponent(t)}-blue?style=flat-square)`).join(" ");
    if (mode === "profile") {
      return `# Hi, I'm ${name} 👋\n\n${bio}\n\n${badges}\n\n## 🚀 About Me\n- 🔭 Working on personal projects and open source\n- 🌱 Learning system design and cloud technologies\n- 💬 Ask me about web development and algorithms\n- 📫 Reach me at github.com/${username}\n\n## 📊 GitHub Stats\n![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=tokyonight)\n\n![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=tokyonight)\n\n![Profile Views](https://komarev.com/ghpvc/?username=${username}&label=Profile%20views&color=6D5DF6)\n`;
    }
    return `# ${project}\n\n${bio}\n\n${badges}\n\n## Features\n- Modern tech stack\n- Responsive design\n- Easy to deploy\n\n## Getting Started\n\`\`\`bash\ngit clone https://github.com/${username}/${project}.git\ncd ${project}\nnpm install\nnpm run dev\n\`\`\`\n\n## License\nMIT\n`;
  }, [name, username, bio, project, mode, selectedTech]);

  const toggleTech = (t: string) => {
    setSelectedTech((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  };

  const download = () => {
    const blob = new Blob([readme], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <CareerPageHeader title="GitHub README Generator" description="Generate professional README files with badges, stats, shields, and technology icons." icon={Github} badge="Markdown Export" />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-6">
          <ToolsButton variant={mode === "profile" ? "primary" : "secondary"} onClick={() => setMode("profile")}>Developer Profile</ToolsButton>
          <ToolsButton variant={mode === "project" ? "primary" : "secondary"} onClick={() => setMode("project")}>Project README</ToolsButton>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-5 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-sm min-h-[44px] outline-none focus:border-[#6D5DF6]/50" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">GitHub Username</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-sm min-h-[44px] outline-none focus:border-[#6D5DF6]/50" />
            </div>
            {mode === "project" && (
              <div>
                <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Project Name</label>
                <input value={project} onChange={(e) => setProject(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-sm min-h-[44px] outline-none focus:border-[#6D5DF6]/50" />
              </div>
            )}
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Bio / Description</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-sm min-h-[80px] outline-none focus:border-[#6D5DF6]/50" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Technology Icons</label>
              <div className="flex flex-wrap gap-2">
                {TECH_ICONS.map((t) => (
                  <button key={t} type="button" onClick={() => toggleTech(t)} className={`px-3 py-2 rounded-xl text-sm min-h-[44px] ${selectedTech.includes(t) ? "bg-[#6D5DF6]/10 text-[#6D5DF6] border border-[#6D5DF6]/30" : "bg-slate-100 dark:bg-white/5"}`}>{t}</button>
                ))}
              </div>
            </div>
            <ToolsButton onClick={download}><Download size={16} /> Export Markdown</ToolsButton>
          </div>
          <div className="glass-card p-5">
            <p className="text-xs font-bold uppercase text-slate-500 mb-4">Preview</p>
            <pre className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap font-mono overflow-auto max-h-[600px]">{readme}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
