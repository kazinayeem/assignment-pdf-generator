"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Shield, ChevronRight, BookOpen, FileCode2, Lock,
  Search, Terminal, Copy, Check, Eye, Key
} from "lucide-react";

const VAULT_CONFIG = `# Enable KV secrets engine
vault secrets enable -path=secret kv-v2

# Write a secret
vault kv put secret/api KEY=sk-abc123 SECRET=supersecret

# Read a secret
vault kv get secret/api

# Enable database secrets engine
vault secrets enable database

# Configure dynamic DB credentials
vault write database/config/my-db \\
    plugin_name=postgresql-database-plugin \\
    allowed_roles="my-role" \\
    connection_url="postgresql://{{username}}:{{password}}@host:5432/db"`;

const SAST_EXAMPLE = `# .github/workflows/sast.yml
name: SAST Security Scan
on: [push, pull_request]

jobs:
  sast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Semgrep
        uses: semgrep/semgrep-action@v1
        with:
          config: p/default

      - name: Run Dependabot
        uses: actions/dependency-submission@v4

      - name: Secret scanning
        run: |
          pip install truffleHog
          trufflehog --regex --entropy=False .`;

const TOOLS = [
  {
    category: "SAST (Static Analysis)",
    tools: "Semgrep, SonarQube, Checkmarx, Fortify, CodeQL",
    desc: "Analyze source code for vulnerabilities without executing it. Finds SQL injection, XSS, hardcoded secrets, and insecure patterns."
  },
  {
    category: "DAST (Dynamic Analysis)",
    tools: "OWASP ZAP, Burp Suite, Acunetix, Nessus",
    desc: "Test running applications for vulnerabilities by simulating attacks. Finds runtime issues like CSRF, authentication bypass, and misconfigurations."
  },
  {
    category: "SCA (Software Composition)",
    tools: "Snyk, Dependabot, Renovate, Black Duck, Trivy",
    desc: "Scan open-source dependencies for known CVEs. Monitors transitive dependencies and suggests version updates with patches."
  },
  {
    category: "Secret Scanning",
    tools: "truffleHog, GitLeaks, GitGuardian, Talisman",
    desc: "Scan repositories, commits, and CI outputs for leaked secrets, API keys, tokens, and credentials."
  },
];

const INTERVIEW_QS = [
  {
    q: "What is shift-left security and why is it important?",
    a: "Shift-left security means integrating security early in the software development lifecycle (design → code → build → test → deploy). Instead of scanning only at the end, you add SAST during coding, SCA during dependency resolution, secret scanning on commit, and container scanning during build. This catches vulnerabilities earlier when they are cheaper to fix."
  },
  {
    q: "How does Hashicorp Vault handle dynamic secrets?",
    a: "Vault generates secrets on demand with lease durations and automatic revocation. For databases, Vault creates temporary credentials with limited privileges. For AWS, it generates STS tokens. Dynamic secrets eliminate the risk of credential leakage since they are short-lived, rotated frequently, and automatically expire."
  },
  {
    q: "What is the difference between SAST and DAST?",
    a: "SAST (Static Application Security Testing) analyzes source code without execution — it finds vulnerabilities early in development. DAST (Dynamic Application Security Testing) tests running applications — it finds runtime vulnerabilities that SAST cannot detect (auth issues, config errors). SAST is white-box, DAST is black-box. Both complement each other."
  },
  {
    q: "Explain compliance as code and how it's implemented.",
    a: "Compliance as code codifies regulatory requirements (PCI-DSS, HIPAA, SOC2) into automated checks. Tools like InSpec, Open Policy Agent (OPA), and Sentinel evaluate infrastructure and application state against rules. Policies are version-controlled, tested like code, and enforced in CI/CD pipelines. Example: OPA policy ensuring S3 buckets are not public."
  }
];

export default function DevsecopsPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
          <Link href="/tools/devops" className="hover:text-emerald-600 transition-colors font-semibold">DevOps</Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
          <span className="text-emerald-600 font-bold">DevSecOps</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-2 sm:mb-3">
            <Shield className="inline w-7 h-7 sm:w-9 sm:h-9 mr-2 text-emerald-600" />
            DevSecOps
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl">
            Integrate security into every phase of the DevOps lifecycle. Shift-left security, SAST/DAST/SCA, secrets management, and compliance as code.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
            <div className="flex items-center gap-2 mb-2"><Search className="w-4 h-4 text-emerald-600" /><h3 className="font-bold text-xs text-gray-900">SAST</h3></div>
            <p className="text-[11px] text-gray-600">Static analysis of source code. Finds vulns before compiling.</p>
          </div>
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
            <div className="flex items-center gap-2 mb-2"><Eye className="w-4 h-4 text-emerald-600" /><h3 className="font-bold text-xs text-gray-900">DAST</h3></div>
            <p className="text-[11px] text-gray-600">Dynamic analysis of running apps. Finds runtime vulns.</p>
          </div>
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
            <div className="flex items-center gap-2 mb-2"><FileCode2 className="w-4 h-4 text-emerald-600" /><h3 className="font-bold text-xs text-gray-900">SCA</h3></div>
            <p className="text-[11px] text-gray-600">Open-source dependency scanning for CVEs.</p>
          </div>
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
            <div className="flex items-center gap-2 mb-2"><Key className="w-4 h-4 text-emerald-600" /><h3 className="font-bold text-xs text-gray-900">Secrets Mgmt</h3></div>
            <p className="text-[11px] text-gray-600">Vault, dynamic secrets, encryption as a service.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><Lock className="w-4 h-4 text-emerald-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Security Tooling Categories</h2></div>
          <div className="grid sm:grid-cols-2 gap-4">
            {TOOLS.map(t => (
              <div key={t.category} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h3 className="text-xs font-bold text-gray-900 mb-1">{t.category}</h3>
                <p className="text-[11px] text-gray-500 mb-2">{t.tools}</p>
                <p className="text-[11px] text-gray-600">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            {["Vault Secrets", "CI/CD Security"].map((label, i) => (
              <button
                key={label}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-3 text-xs font-bold transition-colors border-b-2 ${
                  i === activeTab ? "border-emerald-500 text-emerald-700 bg-emerald-50" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-gray-400">{activeTab === 0 ? "Shell" : "YAML"}</span>
              <button onClick={() => navigator.clipboard.writeText(activeTab === 0 ? VAULT_CONFIG : SAST_EXAMPLE)} className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-[10px] text-gray-600 transition"><Copy className="w-3 h-3" /> Copy</button>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">{activeTab === 0 ? VAULT_CONFIG : SAST_EXAMPLE}</pre>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3"><Key className="w-4 h-4 text-emerald-600" /><h3 className="font-bold text-sm text-gray-900">Hashicorp Vault</h3></div>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              <li><span className="font-bold">Static Secrets:</span> Encrypted key-value storage with versioning</li>
              <li><span className="font-bold">Dynamic Secrets:</span> On-demand, short-lived credentials (DB, cloud)</li>
              <li><span className="font-bold">Encryption as Service:</span> Encrypt/decrypt data via API without managing keys</li>
              <li><span className="font-bold">PKI:</span> Internal CA for automated certificate issuance and renewal</li>
              <li><span className="font-bold">Auth Methods:</span> Token, Kubernetes, LDAP, OIDC, AWS IAM, GitHub</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3"><Shield className="w-4 h-4 text-emerald-600" /><h3 className="font-bold text-sm text-gray-900">Compliance as Code</h3></div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <h4 className="text-xs font-bold text-gray-800">Open Policy Agent (OPA)</h4>
                <p className="text-[11px] text-gray-600">Policy engine for cloud-native stacks. Write Rego policies to enforce rules on Kubernetes admission, Terraform plans, and API requests.</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <h4 className="text-xs font-bold text-gray-800">InSpec</h4>
                <p className="text-[11px] text-gray-600">Audit and testing framework for infrastructure. Write compliance tests in Ruby DSL. Checks OS config, package versions, and security settings.</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <h4 className="text-xs font-bold text-gray-800">Sentinel</h4>
                <p className="text-[11px] text-gray-600">HashiCorp's policy framework for Terraform Enterprise. Enforces policies before terraform apply executes.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><Shield className="w-4 h-4 text-emerald-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Secure SDLC Pipeline</h2></div>
          <div className="grid sm:grid-cols-5 gap-2 text-[11px]">
            {[
              { stage: "Plan", checks: "Threat modeling" },
              { stage: "Code", checks: "SAST, secrets scan" },
              { stage: "Build", checks: "SCA, container scan" },
              { stage: "Test", checks: "DAST, integration" },
              { stage: "Deploy", checks: "Compliance check" },
            ].map(s => (
              <div key={s.stage} className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                <h4 className="font-bold text-gray-900">{s.stage}</h4>
                <p className="text-gray-600 mt-0.5">{s.checks}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><BookOpen className="w-4 h-4 text-emerald-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Interview Questions</h2></div>
          <div className="space-y-3">
            {INTERVIEW_QS.map((item, i) => (
              <details key={i} className="bg-emerald-50 rounded-xl border border-emerald-200 group">
                <summary className="px-4 py-3 flex items-center justify-between cursor-pointer text-xs sm:text-sm font-semibold text-gray-900 hover:text-emerald-700 transition-colors list-none">
                  <span>Q{i + 1}: {item.q}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <div className="px-4 pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-emerald-200 pt-3">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
