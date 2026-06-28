"use client";

import Link from "next/link";
import {
  HardDrive, ChevronRight, BookOpen, FileCode2, GitBranch,
  Users, Layout, Copy
} from "lucide-react";

const JENKINSFILE = `pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scmGit(
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[url: 'https://github.com/org/repo.git']]
                )
            }
        }

        stage('Build') {
            steps {
                sh 'npm ci'
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
            post {
                always {
                    junit 'reports/**/*.xml'
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh './deploy.sh'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}`;

const PLUGINS = [
  { name: "Git", desc: "Git integration for SCM checkout" },
  { name: "Pipeline", desc: "Pipeline as code with Jenkinsfile" },
  { name: "Blue Ocean", desc: "Modern UI for pipeline visualization" },
  { name: "Docker", desc: "Build and run containers in pipelines" },
  { name: "Kubernetes", desc: "Dynamic agent provisioning on K8s" },
  { name: "Credentials", desc: "Securely manage secrets and keys" },
  { name: "Slack", desc: "Send build notifications to Slack" },
  { name: "JUnit", desc: "Parse and display test results" },
];

const AGENT_TYPES = [
  { type: "Static", desc: "Permanent agents (VMs, bare metal). Always available." },
  { type: "Dynamic (Cloud)", desc: "Agents provisioned on demand (Docker, K8s, EC2)." },
  { type: "Controller", desc: "Built-in agent that runs on the Jenkins controller node." },
];

const INTERVIEW_QS = [
  {
    q: "What is the difference between Declarative and Scripted Pipeline?",
    a: "Declarative Pipeline uses a structured `pipeline { }` block with predefined sections (agent, stages, post). It is simpler and enforces a strict syntax. Scripted Pipeline uses Groovy-based DSL with full programmatic control — more flexible but harder to maintain. Declarative is the recommended approach."
  },
  {
    q: "How do you secure Jenkins?",
    a: "Use Role-Based Access Control (RBAC) with the Role Strategy plugin to restrict permissions. Enable Agent-to-Controller security to prevent agents from executing arbitrary commands on the controller. Use credentials binding for secrets. Run Jenkins behind a reverse proxy with HTTPS. Regularly update plugins."
  },
  {
    q: "What is the Jenkins controller-agent architecture?",
    a: "The Jenkins controller (formerly master) is the central server that schedules jobs, serves the UI, and stores configuration. Agents (formerly slaves) execute build tasks. The controller delegates work to agents to distribute load. Agents can be static (permanent VMs) or dynamic (provisioned on demand via Docker, K8s, or cloud plugins)."
  },
  {
    q: "Explain multibranch pipelines and their benefits.",
    a: "Multibranch Pipeline automatically discovers branches in a repository and creates a pipeline for each. It uses the Jenkinsfile from each branch. Benefits: automatic branch detection, per-branch configuration, automatic pull request builds, and integration with GitHub/GitLab webhooks for real-time feedback."
  }
];

export default function JenkinsPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
          <Link href="/tools/devops" className="hover:text-rose-600 transition-colors font-semibold">DevOps</Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
          <span className="text-rose-600 font-bold">Jenkins</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-2 sm:mb-3">
            <HardDrive className="inline w-7 h-7 sm:w-9 sm:h-9 mr-2 text-rose-600" />
            Jenkins
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl">
            The leading automation server for CI/CD. Pipeline as code, plugins ecosystem, distributed builds, and multibranch pipelines.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3"><FileCode2 className="w-4 h-4 text-rose-600" /><h3 className="font-bold text-sm text-gray-900">Pipeline as Code</h3></div>
            <p className="text-xs sm:text-sm text-gray-600 mb-3">Jenkinsfile defines the entire CI/CD pipeline in your repository. Stored alongside code, versioned, and reviewed via PRs.</p>
            <ul className="space-y-1.5 text-xs sm:text-sm text-gray-600">
              <li><span className="font-bold text-gray-800">Declarative:</span> Structured <code className="font-mono text-rose-600">pipeline { }</code> syntax</li>
              <li><span className="font-bold text-gray-800">Scripted:</span> Groovy-based with full programmatic control</li>
              <li><span className="font-bold text-gray-800">Shared Libraries:</span> Reusable pipeline code across repos</li>
              <li><span className="font-bold text-gray-800">Multibranch:</span> Auto-discovers branches, creates pipelines</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3"><GitBranch className="w-4 h-4 text-rose-600" /><h3 className="font-bold text-sm text-gray-900">Multibranch Pipeline</h3></div>
            <div className="space-y-2 text-xs sm:text-sm text-gray-600">
              <div className="flex items-start gap-2"><span className="w-5 h-5 rounded bg-rose-100 text-rose-700 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">1</span><span>Configure Multibranch Pipeline pointing to repo</span></div>
              <div className="flex items-start gap-2"><span className="w-5 h-5 rounded bg-rose-100 text-rose-700 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">2</span><span>Jenkins scans branches and discovers Jenkinsfiles</span></div>
              <div className="flex items-start gap-2"><span className="w-5 h-5 rounded bg-rose-100 text-rose-700 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">3</span><span>Each branch gets its own pipeline run</span></div>
              <div className="flex items-start gap-2"><span className="w-5 h-5 rounded bg-rose-100 text-rose-700 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">4</span><span>Webhooks trigger builds on push/PR</span></div>
              <div className="flex items-start gap-2"><span className="w-5 h-5 rounded bg-rose-100 text-rose-700 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">5</span><span>Blue Ocean provides visual pipeline view</span></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><FileCode2 className="w-4 h-4 text-rose-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Jenkinsfile Example</h2></div>
            <button onClick={() => navigator.clipboard.writeText(JENKINSFILE)} className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-[10px] font-semibold text-gray-600 transition">
              <Copy className="w-3 h-3" />
            </button>
          </div>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">{JENKINSFILE}</pre>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4"><Layout className="w-4 h-4 text-rose-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Plugins</h2></div>
            <div className="grid gap-2">
              {PLUGINS.map(p => (
                <div key={p.name} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50">
                  <div className="w-5 h-5 rounded bg-rose-100 text-rose-700 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">P</div>
                  <div>
                    <span className="text-xs font-bold text-gray-800">{p.name}</span>
                    <p className="text-[11px] text-gray-500">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3"><Users className="w-4 h-4 text-rose-600" /><h3 className="font-bold text-sm text-gray-900">Agents</h3></div>
              <div className="space-y-2">
                {AGENT_TYPES.map(a => (
                  <div key={a.type} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <h4 className="font-bold text-xs text-gray-800">{a.type}</h4>
                    <p className="text-[11px] text-gray-600">{a.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3"><Layout className="w-4 h-4 text-sky-600" /><h3 className="font-bold text-sm text-gray-900">Blue Ocean UI</h3></div>
              <p className="text-xs sm:text-sm text-gray-600">Modern, visual interface for Jenkins pipelines. Provides pipeline editor, real-time visualization of stages, log views, and branch activity. Reduces complexity of traditional Jenkins UI.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><BookOpen className="w-4 h-4 text-rose-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Interview Questions</h2></div>
          <div className="space-y-3">
            {INTERVIEW_QS.map((item, i) => (
              <details key={i} className="bg-rose-50 rounded-xl border border-rose-200 group">
                <summary className="px-4 py-3 flex items-center justify-between cursor-pointer text-xs sm:text-sm font-semibold text-gray-900 hover:text-rose-700 transition-colors list-none">
                  <span>Q{i + 1}: {item.q}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <div className="px-4 pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-rose-200 pt-3">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
