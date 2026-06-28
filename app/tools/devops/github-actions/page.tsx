"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Zap, ChevronRight, BookOpen, Play, CheckCircle2,
  Clock, GitBranch, Terminal, Copy, Check, RotateCcw
} from "lucide-react";

const PIPELINE_STAGES = [
  { name: "Trigger", icon: Zap, desc: "Push to main or PR opened", color: "text-gray-500" },
  { name: "Checkout", icon: GitBranch, desc: "Check out repository code", color: "text-blue-500" },
  { name: "Install", icon: Terminal, desc: "Install dependencies (npm ci)", color: "text-indigo-500" },
  { name: "Lint", icon: CheckCircle2, desc: "Run linters and formatters", color: "text-violet-500" },
  { name: "Test", icon: Play, desc: "Run unit & integration tests", color: "text-purple-500" },
  { name: "Build", icon: Terminal, desc: "Compile and package application", color: "text-pink-500" },
  { name: "Deploy", icon: Zap, desc: "Deploy to staging/production", color: "text-green-500" },
];

const WORKFLOW_YAML = `name: CI/CD Pipeline
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci

      - run: npm run lint

      - run: npm test

      - run: npm run build

  deploy:
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Production
        run: |
          echo "Deploying to production..."
          # ./deploy.sh`;

const REUSABLE_WORKFLOW = `# .github/workflows/deploy.yml
on:
  workflow_call:
    inputs:
      environment:
        type: string
        required: true
    secrets:
      CLOUD_TOKEN:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to \${{ inputs.environment }}"`;

const COMMANDS = [
  { name: "jobs", desc: "Define one or more jobs that run in parallel or sequentially" },
  { name: "steps", desc: "Individual tasks within a job (run commands or actions)" },
  { name: "uses", desc: "Reference a GitHub Action from the marketplace" },
  { name: "run", desc: "Execute a shell command directly" },
  { name: "with", desc: "Pass inputs to an action" },
  { name: "env", desc: "Set environment variables for a step or job" },
  { name: "needs", desc: "Declare dependency on another job" },
  { name: "if", desc: "Conditional execution based on expression" },
  { name: "matrix", desc: "Run a job across multiple configurations" },
  { name: "secrets", desc: "Access encrypted secrets via \${{ secrets.MY_SECRET }}" },
];

const INTERVIEW_QS = [
  {
    q: "What is the difference between a GitHub Action and a step?",
    a: "A GitHub Action is a reusable, composible unit (from the marketplace or custom). A step is a single task within a job — it can run a script with `run:` or use an action with `uses:`. Jobs contain multiple steps; workflows contain multiple jobs with dependency chains."
  },
  {
    q: "How do you secure secrets in GitHub Actions?",
    a: "Secrets are stored in GitHub repo/organization settings, encrypted at rest. Reference them via \${{ secrets.SECRET_NAME }}. They are masked in logs. For OpenID Connect (OIDC), you can authenticate to cloud providers without storing long-lived credentials by trusting GitHub's OIDC token."
  },
  {
    q: "Explain matrix builds in GitHub Actions.",
    a: "Matrix builds run a job against multiple combinations of variables (e.g., Node versions, OS). Defined with `strategy: matrix: node: [16, 18, 20], os: [ubuntu, windows]`. GitHub creates a separate job for each combination. Useful for testing cross-platform compatibility."
  },
  {
    q: "What are self-hosted runners and when should you use them?",
    a: "Self-hosted runners are machines you manage that run GitHub Actions jobs. Use them when you need specific hardware (GPUs), access to an internal network, or custom software not available on GitHub-hosted runners. They can be installed at repo, org, or enterprise level."
  }
];

export default function GitHubActionsPage() {
  const [activeStage, setActiveStage] = useState(0);
  const [copied, setCopied] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
          <Link href="/tools/devops" className="hover:text-violet-600 transition-colors font-semibold">DevOps</Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
          <span className="text-violet-600 font-bold">GitHub Actions</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-2 sm:mb-3">
            <Zap className="inline w-7 h-7 sm:w-9 sm:h-9 mr-2 text-violet-600" />
            GitHub Actions
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl">
            Automate CI/CD pipelines directly from your GitHub repository. Learn workflow syntax, jobs, steps, actions, and deployment strategies.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5"><Play className="w-4 h-4 text-violet-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Pipeline Visualization</h2></div>
          <div className="space-y-3">
            {PIPELINE_STAGES.map((stage, i) => {
              const Icon = stage.icon;
              const status = i < activeStage ? "passed" : i === activeStage ? "running" : "pending";
              return (
                <button
                  key={stage.name}
                  onClick={() => setActiveStage(i)}
                  className={`w-full flex items-center gap-3 sm:gap-4 p-3 rounded-xl border-2 transition-all text-left ${
                    i === activeStage
                      ? "border-violet-400 bg-violet-50"
                      : status === "passed"
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    status === "passed" ? "bg-green-100" : status === "running" ? "bg-violet-100" : "bg-gray-100"
                  }`}>
                    {status === "passed" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : status === "running" ? (
                      <Clock className="w-4 h-4 text-violet-600" />
                    ) : (
                      <Icon className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-gray-900">{stage.name}</span>
                      {status === "running" && <span className="text-[10px] font-bold text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded animate-pulse">RUNNING</span>}
                    </div>
                    <p className="text-[11px] text-gray-500 truncate">{stage.desc}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    status === "passed" ? "bg-green-500" : status === "running" ? "bg-violet-500 animate-pulse" : "bg-gray-300"
                  }`} />
                </button>
              );
            })}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setActiveStage(Math.max(0, activeStage - 1))} className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition">&larr; Prev Stage</button>
            <button onClick={() => setActiveStage(Math.min(PIPELINE_STAGES.length - 1, activeStage + 1))} className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold transition">Next Stage &rarr;</button>
            <button onClick={() => setActiveStage(0)} className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Reset</button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><Terminal className="w-4 h-4 text-violet-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">CI/CD Workflow Example</h2></div>
            <button onClick={() => { navigator.clipboard.writeText(WORKFLOW_YAML); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-[10px] font-semibold text-gray-600 transition">
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">{WORKFLOW_YAML}</pre>
          <div className="mt-4 grid sm:grid-cols-2 gap-2">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-800">
              <span className="font-bold">Trigger:</span> Runs on push/PR to <code className="font-mono text-blue-600">main</code>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-xs text-green-800">
              <span className="font-bold">Deploy:</span> Only runs after tests pass on main branch
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><Terminal className="w-4 h-4 text-violet-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Workflow Syntax Reference</h2></div>
          <div className="grid sm:grid-cols-2 gap-2">
            {COMMANDS.map(c => (
              <div key={c.name} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50">
                <code className="text-xs font-mono bg-violet-50 text-violet-700 px-2 py-0.5 rounded shrink-0">{c.name}</code>
                <span className="text-xs text-gray-600">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3"><GitBranch className="w-4 h-4 text-emerald-600" /><h3 className="font-bold text-sm text-gray-900">Reusable Workflows</h3></div>
            <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto">{REUSABLE_WORKFLOW}</pre>
            <p className="text-xs text-gray-600 mt-2">Call from another workflow: <code className="font-mono">uses: ./.github/workflows/deploy.yml</code></p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3"><Zap className="w-4 h-4 text-amber-600" /><h3 className="font-bold text-sm text-gray-900">Marketplace Actions</h3></div>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              <li><code className="font-mono text-amber-600">actions/checkout@v4</code> — Check out repo</li>
              <li><code className="font-mono text-amber-600">actions/setup-node@v4</code> — Setup Node.js</li>
              <li><code className="font-mono text-amber-600">docker/login-action@v3</code> — Docker registry login</li>
              <li><code className="font-mono text-amber-600">aws-actions/configure-aws-credentials</code> — AWS auth via OIDC</li>
              <li><code className="font-mono text-amber-600">azure/login@v2</code> — Azure authentication</li>
              <li><code className="font-mono text-amber-600">actions/cache@v4</code> — Cache dependencies</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><BookOpen className="w-4 h-4 text-violet-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Interview Questions</h2></div>
          <div className="space-y-3">
            {INTERVIEW_QS.map((item, i) => (
              <details key={i} className="bg-violet-50 rounded-xl border border-violet-200 group">
                <summary className="px-4 py-3 flex items-center justify-between cursor-pointer text-xs sm:text-sm font-semibold text-gray-900 hover:text-violet-700 transition-colors list-none">
                  <span>Q{i + 1}: {item.q}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <div className="px-4 pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-violet-200 pt-3">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
