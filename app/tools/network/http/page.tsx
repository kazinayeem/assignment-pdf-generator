"use client";

import Link from "next/link";
import { ChevronRight, Globe, Server, Shield } from "lucide-react";
import { Section, InfoCard, InterviewQuestions } from "@/components/tools/topic-primitives";

export default function HTTPPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
        <Link href="/tools/network" className="text-[#6D5DF6] hover:underline">Networks</Link>
        <ChevronRight className="w-3 h-3" aria-hidden />
        <span className="text-slate-700 dark:text-slate-300 font-semibold">HTTP/HTTPS</span>
      </nav>

      <div className="max-w-4xl mx-auto space-y-6">
        <header className="glass-card p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" aria-hidden />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">HTTP & HTTPS</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Application-layer protocols powering the web — requests, responses, methods, and TLS security.
              </p>
            </div>
          </div>
        </header>

        <Section title="HTTP Request-Response Cycle">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { step: "1", label: "Client Request", desc: "Browser sends HTTP method + headers + body" },
              { step: "2", label: "Server Processing", desc: "Server routes request, runs logic, builds response" },
              { step: "3", label: "Response", desc: "Status code, headers, and body returned to client" },
            ].map((s) => (
              <div key={s.step} className="glass-card p-4 text-center">
                <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-[#6D5DF6] text-white flex items-center justify-center text-xs font-bold">{s.step}</div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{s.label}</p>
                <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Common HTTP Methods">
          <div className="overflow-x-auto table-wrap">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10">
                  {["Method", "Purpose", "Idempotent", "Body"].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-bold uppercase text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-slate-700 dark:text-slate-300">
                {[
                  ["GET", "Retrieve resource", "Yes", "No"],
                  ["POST", "Create / submit data", "No", "Yes"],
                  ["PUT", "Replace resource", "Yes", "Yes"],
                  ["PATCH", "Partial update", "No", "Yes"],
                  ["DELETE", "Remove resource", "Yes", "No"],
                ].map(([method, purpose, idem, body]) => (
                  <tr key={method} className="border-b border-slate-100 dark:border-white/5">
                    <td className="py-2 px-3 font-mono font-bold text-[#6D5DF6]">{method}</td>
                    <td className="py-2 px-3">{purpose}</td>
                    <td className="py-2 px-3">{idem}</td>
                    <td className="py-2 px-3">{body}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Status Codes">
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { range: "2xx", label: "Success", example: "200 OK, 201 Created", color: "text-emerald-600" },
              { range: "3xx", label: "Redirection", example: "301 Moved, 304 Not Modified", color: "text-blue-600" },
              { range: "4xx", label: "Client Error", example: "400 Bad Request, 404 Not Found", color: "text-amber-600" },
              { range: "5xx", label: "Server Error", example: "500 Internal, 503 Unavailable", color: "text-red-600" },
            ].map((s) => (
              <div key={s.range} className="glass-card p-4">
                <p className={`font-bold ${s.color}`}>{s.range} — {s.label}</p>
                <p className="text-xs text-slate-500 mt-1">{s.example}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="HTTPS & TLS">
          <div className="flex items-start gap-3 glass-card p-5">
            <Shield className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" aria-hidden />
            <div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                HTTPS wraps HTTP with TLS encryption. The TLS handshake establishes a shared secret,
                verifies the server certificate, and protects data in transit from eavesdropping and tampering.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {["TLS 1.2", "TLS 1.3", "Certificate Authority", "Symmetric Encryption"].map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <InfoCard type="tip" title="Key Headers">
          <ul className="text-sm space-y-1 list-disc pl-4">
            <li><strong>Content-Type</strong> — MIME type of the body (application/json)</li>
            <li><strong>Authorization</strong> — Bearer tokens, API keys</li>
            <li><strong>Cache-Control</strong> — Browser/CDN caching rules</li>
            <li><strong>Set-Cookie</strong> — Session management</li>
          </ul>
        </InfoCard>

        <InterviewQuestions
          questions={[
            { q: "Difference between HTTP and HTTPS?", a: "HTTPS adds TLS encryption and certificate verification on top of HTTP." },
            { q: "What is idempotency?", a: "Repeating the same request produces the same server state. GET, PUT, DELETE are idempotent; POST is not." },
            { q: "Explain REST principles.", a: "Stateless client-server, uniform interface (resources identified by URIs), cacheable responses, layered system." },
          ]}
        />

        <div className="flex flex-wrap gap-3">
          <Link href="/tools/network/dns" className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5">
            <Server className="w-4 h-4" aria-hidden /> Previous: DNS
          </Link>
          <Link href="/tools/network/subnetting" className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#6D5DF6] hover:opacity-95">
            Next: Subnetting
          </Link>
        </div>
      </div>
    </div>
  );
}
