"use client";

import Link from "next/link";
import { useState } from "react";
import {
  GitBranch, ChevronRight, BookOpen, GitCommit, GitPullRequest,
  GitMerge, Code2, Workflow, Copy, Check
} from "lucide-react";

const COMMANDS = [
  { cmd: "git init", desc: "Initialize a new repository" },
  { cmd: "git add .", desc: "Stage all changes" },
  { cmd: "git commit -m \"msg\"", desc: "Commit staged changes" },
  { cmd: "git push origin main", desc: "Push to remote branch" },
  { cmd: "git pull origin main", desc: "Pull latest from remote" },
  { cmd: "git branch feature", desc: "Create a new branch" },
  { cmd: "git checkout -b feature", desc: "Create and switch to branch" },
  { cmd: "git merge feature", desc: "Merge branch into current" },
  { cmd: "git rebase main", desc: "Rebase current branch onto main" },
  { cmd: "git log --oneline", desc: "Show compact commit history" },
  { cmd: "git diff", desc: "Show unstaged changes" },
  { cmd: "git stash", desc: "Temporarily save changes" },
];

const WORKFLOWS = [
  {
    name: "GitFlow",
    branches: "main, develop, feature/, release/, hotfix/",
    desc: "Strict branching model with dedicated branches for features, releases, and hotfixes. Suitable for scheduled releases.",
    use: "Enterprise projects with release cycles",
  },
  {
    name: "Trunk-Based",
    branches: "main (short-lived feature branches)",
    desc: "Developers commit directly to main or short-lived branches (hours/days). Relies on feature flags.",
    use: "CI/CD, startups, web applications",
  },
  {
    name: "GitHub Flow",
    branches: "main, feature branches, PRs",
    desc: "Simple workflow: branch from main, open PR, merge back. Every merge deploys to production.",
    use: "Continuous deployment teams",
  },
  {
    name: "GitLab Flow",
    branches: "main, environment branches (staging/production), feature branches",
    desc: "Environment branches track deployments. Merge requests promote code between environments.",
    use: "Teams with multiple environments",
  },
];

const GITFLOW_DIAGRAM = `main:    ─── M ─── M ─── M ─── M ─── M
                 \\       /
develop:   ── D ── D ── D ── D ── D ── D
              \\       /
feature:     F ── F ── F`;

const INTERVIEW_QS = [
  {
    q: "What is the difference between git merge and git rebase?",
    a: "`git merge` creates a new merge commit that preserves the history of both branches. `git rebase` rewrites history by replaying commits from the current branch onto the target, creating a linear history. Merge is safer for shared branches; rebase is cleaner for feature branches before merging upstream."
  },
  {
    q: "How do you resolve a merge conflict?",
    a: "Run `git merge` — Git marks conflicted files. Open each file, find the conflict markers (<<<<<<, ======, >>>>>>), edit to keep the desired changes, remove markers. Stage the resolved files with `git add` and continue with `git merge --continue` or `git commit`."
  },
  {
    q: "What is the difference between `git reset` and `git revert`?",
    a: "`git reset` moves the HEAD and branch pointer backward, potentially discarding commits. It alters history and should not be used on shared branches. `git revert` creates a new commit that undoes a previous commit — it is safe for shared branches because it does not rewrite history."
  },
  {
    q: "Explain Git hooks and give examples.",
    a: "Git hooks are scripts that run automatically at specific points in the Git workflow. Examples: `pre-commit` (lint/format check before commit), `pre-push` (run tests before push), `commit-msg` (validate commit message format), `post-receive` (trigger deployment on server). Hooks are stored in `.git/hooks/`."
  }
];

export default function GitPage() {
  const [copied, setCopied] = useState(false);

  const copyGitflow = () => {
    navigator.clipboard.writeText(GITFLOW_DIAGRAM);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
          <Link href="/tools/devops" className="hover:text-orange-600 transition-colors font-semibold">DevOps</Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
          <span className="text-orange-600 font-bold">Git & GitHub</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-2 sm:mb-3">
            <GitBranch className="inline w-7 h-7 sm:w-9 sm:h-9 mr-2 text-orange-600" />
            Git & GitHub
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl">
            Version control is the backbone of DevOps. Learn Git fundamentals, branching strategies, pull requests, and collaborative workflows.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3"><GitCommit className="w-4 h-4 text-orange-600" /><h3 className="font-bold text-sm text-gray-900">Core Workflow</h3></div>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold shrink-0">1</span><span className="text-gray-600"><code className="font-mono text-orange-600">git init</code> or <code className="font-mono text-orange-600">git clone</code></span></div>
              <div className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold shrink-0">2</span><span className="text-gray-600"><code className="font-mono text-orange-600">git add</code> — Stage changes</span></div>
              <div className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold shrink-0">3</span><span className="text-gray-600"><code className="font-mono text-orange-600">git commit</code> — Snapshot changes</span></div>
              <div className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold shrink-0">4</span><span className="text-gray-600"><code className="font-mono text-orange-600">git push</code> — Share with team</span></div>
              <div className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold shrink-0">5</span><span className="text-gray-600"><code className="font-mono text-orange-600">git pull</code> — Sync from remote</span></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3"><GitPullRequest className="w-4 h-4 text-orange-600" /><h3 className="font-bold text-sm text-gray-900">Pull Request Lifecycle</h3></div>
            <div className="space-y-2 text-xs sm:text-sm text-gray-600">
              <div className="flex items-start gap-2"><span className="w-5 h-5 rounded bg-green-100 text-green-700 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">1</span><span>Create feature branch from main</span></div>
              <div className="flex items-start gap-2"><span className="w-5 h-5 rounded bg-green-100 text-green-700 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">2</span><span>Make commits, push to remote</span></div>
              <div className="flex items-start gap-2"><span className="w-5 h-5 rounded bg-green-100 text-green-700 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">3</span><span>Open Pull Request on GitHub</span></div>
              <div className="flex items-start gap-2"><span className="w-5 h-5 rounded bg-green-100 text-green-700 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">4</span><span>Code review + CI checks pass</span></div>
              <div className="flex items-start gap-2"><span className="w-5 h-5 rounded bg-green-100 text-green-700 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">5</span><span>Merge (squash/rebase/merge commit)</span></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><Code2 className="w-4 h-4 text-orange-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Essential Commands</h2></div>
          <div className="grid sm:grid-cols-2 gap-2">
            {COMMANDS.map(c => (
              <div key={c.cmd} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50">
                <code className="text-xs font-mono bg-orange-50 text-orange-700 px-2 py-0.5 rounded shrink-0 whitespace-nowrap">{c.cmd}</code>
                <span className="text-xs text-gray-600">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4"><GitMerge className="w-4 h-4 text-blue-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Branching & Merging</h2></div>
            <p className="text-xs sm:text-sm text-gray-600 mb-3">Branches isolate work. The default branch is <code className="font-mono text-blue-600">main</code> (formerly <code className="font-mono">master</code>).</p>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              <li><span className="font-bold text-gray-800">Feature branch:</span> <code className="font-mono text-blue-600">git checkout -b feat/login</code></li>
              <li><span className="font-bold text-gray-800">Merge:</span> <code className="font-mono text-blue-600">git checkout main &amp;&amp; git merge feat/login</code></li>
              <li><span className="font-bold text-gray-800">Rebase:</span> <code className="font-mono text-blue-600">git rebase main</code> (on feature branch)</li>
              <li><span className="font-bold text-gray-800">Squash:</span> <code className="font-mono text-blue-600">git merge --squash feat/login</code></li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4"><Workflow className="w-4 h-4 text-violet-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Git Workflows</h2></div>
            <div className="space-y-3">
              {WORKFLOWS.map(w => (
                <div key={w.name} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="font-bold text-xs text-gray-800">{w.name}</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">{w.desc}</p>
                  <div className="flex gap-2 mt-1.5">
                    <span className="text-[10px] text-gray-500"><span className="font-semibold">Branches:</span> {w.branches}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><GitBranch className="w-4 h-4 text-emerald-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">GitFlow Diagram</h2></div>
            <button onClick={copyGitflow} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-gray-600 transition">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />} {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed">{GITFLOW_DIAGRAM}</pre>
          <div className="flex gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-400 inline-block" /> main</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-green-400 inline-block" /> develop</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-orange-400 inline-block" /> feature</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><BookOpen className="w-4 h-4 text-orange-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Interview Questions</h2></div>
          <div className="space-y-3">
            {INTERVIEW_QS.map((item, i) => (
              <details key={i} className="bg-orange-50 rounded-xl border border-orange-200 group">
                <summary className="px-4 py-3 flex items-center justify-between cursor-pointer text-xs sm:text-sm font-semibold text-gray-900 hover:text-orange-700 transition-colors list-none">
                  <span>Q{i + 1}: {item.q}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <div className="px-4 pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-orange-200 pt-3">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
