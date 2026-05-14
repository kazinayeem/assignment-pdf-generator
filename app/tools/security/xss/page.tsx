"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bug,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Code2,
  MessageSquare,
  Search,
  Eye,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

const XSS_PAYLOADS = [
  { label: "Alert", value: `<script>alert('XSS')</script>` },
  { label: "Img Error", value: `<img src=x onerror=alert(1)>` },
  { label: "Body Load", value: `<body onload=alert('XSS')>` },
];

const STORED_COMMENTS = [
  { id: 1, author: "Alice", text: "Great site! Very informative." },
  { id: 2, author: "Bob", text: "I learned a lot about security here." },
  { id: 3, author: "Mallory", text: `<script>alert('stolen cookies: ' + document.cookie)</script>` },
];

const INTERVIEW_QUESTIONS = [
  {
    q: "What is Cross-Site Scripting (XSS)?",
    a: "XSS is a security vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users. It occurs when untrusted data is included in web content without proper validation or escaping, enabling attackers to execute arbitrary JavaScript in victims' browsers.",
  },
  {
    q: "What are the three main types of XSS?",
    a: "Reflected XSS: Malicious script is reflected off a web server (e.g., in search results). Stored XSS: Script is permanently stored on the server (e.g., in comments). DOM-based XSS: Vulnerability exists in client-side code where the attack payload modifies the DOM environment.",
  },
  {
    q: "How does a Content Security Policy (CSP) help prevent XSS?",
    a: "CSP is a browser security mechanism that restricts which scripts can execute. By defining a whitelist of trusted sources via the Content-Security-Policy HTTP header, CSP blocks inline scripts and eval(), significantly reducing the attack surface even if other defenses fail.",
  },
  {
    q: "What is the difference between encoded and sanitized output?",
    a: "Encoding (escaping) converts special characters to their HTML entities (e.g., < to &lt;), preventing them from being interpreted as code. Sanitization removes or neutralizes dangerous HTML/script elements entirely, often used for rich content that needs to preserve some HTML tags.",
  },
  {
    q: "Can XSS be used to steal session cookies?",
    a: "Yes. An attacker can inject script like document.cookie to steal session cookies and send them to an attacker-controlled server. This is mitigated by setting the HttpOnly flag on cookies, which prevents JavaScript from accessing them, and using Secure and SameSite attributes.",
  },
];

const XSS_TYPES = [
  {
    type: "Reflected XSS",
    desc: "Payload is reflected off the web server in the response (e.g., search query, error message). Requires user to click a crafted link.",
    impact: "Medium",
    difficulty: "Easy",
    example: `<script>alert('xss')</script>`,
  },
  {
    type: "Stored XSS",
    desc: "Payload is stored on the server (database, comments, forum) and served to every visitor. The most dangerous type.",
    impact: "Critical",
    difficulty: "Medium",
    example: `<img src=x onerror=alert('stored')>`,
  },
  {
    type: "DOM-based XSS",
    desc: "Vulnerability exists entirely in client-side JavaScript. The payload never reaches the server; it modifies the DOM environment dynamically.",
    impact: "High",
    difficulty: "Hard",
    example: `#<img src=x onerror=alert(1)>`,
  },
];

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function XSSPage() {
  const [searchInput, setSearchInput] = useState("");
  const [isVulnerable, setIsVulnerable] = useState(true);
  const [xssTriggered, setXssTriggered] = useState(false);
  const [payloadTriggered, setPayloadTriggered] = useState("");
  const [comments, setComments] = useState(STORED_COMMENTS);
  const [commentInput, setCommentInput] = useState("");
  const [authorInput, setAuthorInput] = useState("");
  const [isStoredVulnerable, setIsStoredVulnerable] = useState(true);
  const [storedXssTriggered, setStoredXssTriggered] = useState(false);
  const [showSimulatedTheft, setShowSimulatedTheft] = useState(false);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  function handleSearch(value: string) {
    setSearchInput(value);
    if (isVulnerable && value.includes("<")) {
      setXssTriggered(true);
      setPayloadTriggered(value);
      setTimeout(() => setXssTriggered(false), 3000);
    } else {
      setXssTriggered(false);
    }
  }

  function applyPayload(payload: string) {
    setSearchInput(payload);
    if (isVulnerable) {
      setXssTriggered(true);
      setPayloadTriggered(payload);
      setTimeout(() => setXssTriggered(false), 3000);
    }
  }

  function toggleVulnerable() {
    setIsVulnerable((v) => !v);
    setXssTriggered(false);
    setPayloadTriggered("");
  }

  function addComment() {
    if (!commentInput.trim() || !authorInput.trim()) return;
    const newComment = {
      id: Date.now(),
      author: authorInput,
      text: commentInput,
    };
    setComments([...comments, newComment]);
    if (isStoredVulnerable && commentInput.includes("<")) {
      setStoredXssTriggered(true);
      setTimeout(() => setStoredXssTriggered(false), 3000);
    }
    if (isStoredVulnerable && commentInput.includes("cookie")) {
      setShowSimulatedTheft(true);
      setTimeout(() => setShowSimulatedTheft(false), 4000);
    }
    setCommentInput("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-rose-100">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/tools/security"
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
          >
            <ArrowRight size={18} className="rotate-180" />
            Back to Security
          </Link>
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/tools/security" className="hover:text-red-600 transition-colors">
              Security
            </Link>
            <ChevronRight size={14} />
            <span className="font-semibold text-gray-800">XSS Attacks</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-4">🐛</div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 leading-tight">
            XSS Attack Lab
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Cross-Site Scripting (XSS) is a code injection vulnerability that allows attackers
            to execute malicious scripts in a victim's browser. Learn how XSS works, explore
            interactive simulations, and discover effective prevention techniques.
          </p>
        </div>

        {/* Theory Section */}
        <div className="bg-white rounded-2xl border-2 border-orange-200 p-6 sm:p-8 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Bug className="text-red-500 flex-shrink-0" size={28} />
            <h2 className="text-2xl font-bold text-slate-900">Understanding XSS</h2>
          </div>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Cross-Site Scripting (XSS) is a web security vulnerability that enables attackers to
            inject client-side scripts into web pages viewed by other users. It exploits the trust
            between a user and a legitimate website, bypassing the Same-Origin Policy.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🔄</span>
                <h3 className="font-bold text-slate-900">Reflected XSS</h3>
              </div>
              <p className="text-sm text-slate-600">
                Payload is reflected off the web server. Delivered via phishing links or crafted
                URLs. Never stored on the server.
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💾</span>
                <h3 className="font-bold text-slate-900">Stored XSS</h3>
              </div>
              <p className="text-sm text-slate-600">
                Malicious script is permanently stored on the server (e.g., comments). Executed by
                every visitor. Most damaging type.
              </p>
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🧠</span>
                <h3 className="font-bold text-slate-900">DOM-based XSS</h3>
              </div>
              <p className="text-sm text-slate-600">
                Vulnerability exists entirely client-side. Payload modifies the DOM environment
                without reaching the server.
              </p>
            </div>
          </div>
        </div>

        {/* Reflected XSS Demo */}
        <div className="bg-white rounded-2xl border-2 border-red-300 p-6 sm:p-8 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Search className="text-red-500 flex-shrink-0" size={24} />
            <h2 className="text-xl font-bold text-slate-900">Reflected XSS Simulator</h2>
          </div>
          <p className="text-sm text-slate-500 mb-6">
            Type or select a payload below to see how reflected XSS works.
          </p>

          {/* Toggle */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-slate-700">Mode:</span>
            <button
              onClick={toggleVulnerable}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                isVulnerable ? "bg-red-500" : "bg-emerald-500"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  isVulnerable ? "translate-x-1" : "translate-x-6"
                }`}
              />
            </button>
            <span
              className={`text-sm font-bold flex items-center gap-1.5 ${
                isVulnerable ? "text-red-600" : "text-emerald-600"
              }`}
            >
              {isVulnerable ? (
                <>
                  <XCircle size={16} /> Vulnerable
                </>
              ) : (
                <>
                  <CheckCircle size={16} /> Secure (Escaped)
                </>
              )}
            </span>
          </div>

          {/* Code Preview */}
          <div className="bg-slate-900 text-green-400 text-xs sm:text-sm font-mono rounded-lg p-4 mb-6 overflow-x-auto">
            {isVulnerable ? (
              <div>{`<div dangerouslySetInnerHTML={{ __html: userInput }} />`}</div>
            ) : (
              <div>{`<div>{escapeHtml(userInput)}</div>`}</div>
            )}
          </div>

          {/* Search Input */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Try typing <script>alert('hi')</script>..."
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none text-sm"
              />
            </div>
          </div>

          {/* Payload Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-xs font-medium text-slate-500 self-center mr-1">
              Payloads:
            </span>
            {XSS_PAYLOADS.map((p) => (
              <button
                key={p.value}
                onClick={() => applyPayload(p.value)}
                className="px-3 py-1.5 text-xs font-mono bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* XSS Warning */}
          {xssTriggered && (
            <div className="animate-pulse bg-red-100 border-2 border-red-400 rounded-lg p-4 mb-4 flex items-start gap-3">
              <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-bold text-red-800">⚠️ XSS Payload Executed!</p>
                <p className="text-sm text-red-700 font-mono break-all">
                  {payloadTriggered}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  This script would execute in the victim's browser, potentially stealing
                  cookies, redirecting to phishing pages, or defacing the site.
                </p>
              </div>
            </div>
          )}

          {/* Output */}
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[60px]">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
              Rendered Output:
            </p>
            {searchInput ? (
              isVulnerable ? (
                <>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `You searched for: ${searchInput}`,
                    }}
                  />
                  {searchInput.includes("<") && (
                    <p className="text-xs text-red-500 mt-1 italic">
                      HTML is being interpreted — this is dangerous!
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-700">
                  You searched for: {escapeHtml(searchInput)}
                </p>
              )
            ) : (
              <p className="text-sm text-gray-400 italic">No input yet</p>
            )}
          </div>
        </div>

        {/* Stored XSS Demo */}
        <div className="bg-white rounded-2xl border-2 border-rose-300 p-6 sm:p-8 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="text-rose-500 flex-shrink-0" size={24} />
            <h2 className="text-xl font-bold text-slate-900">Stored XSS Simulator</h2>
          </div>
          <p className="text-sm text-slate-500 mb-6">
            A guestbook where comments are rendered. When vulnerable, injected scripts execute.
          </p>

          {/* Stored Toggle */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-slate-700">Mode:</span>
            <button
              onClick={() => setIsStoredVulnerable((v) => !v)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                isStoredVulnerable ? "bg-red-500" : "bg-emerald-500"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  isStoredVulnerable ? "translate-x-1" : "translate-x-6"
                }`}
              />
            </button>
            <span
              className={`text-sm font-bold flex items-center gap-1.5 ${
                isStoredVulnerable ? "text-red-600" : "text-emerald-600"
              }`}
            >
              {isStoredVulnerable ? (
                <>
                  <XCircle size={16} /> Vulnerable
                </>
              ) : (
                <>
                  <CheckCircle size={16} /> Secure (Sanitized)
                </>
              )}
            </span>
          </div>

          {/* Add Comment */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
              placeholder="Your name..."
              className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none text-sm"
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none text-sm"
              />
              <button
                onClick={addComment}
                className="px-4 py-2.5 bg-rose-600 text-white text-sm font-semibold rounded-lg hover:bg-rose-700 transition-colors whitespace-nowrap"
              >
                Post
              </button>
            </div>
          </div>

          {/* Stored XSS Triggered */}
          {storedXssTriggered && (
            <div className="animate-pulse bg-rose-100 border-2 border-rose-400 rounded-lg p-4 mb-4 flex items-start gap-3">
              <AlertTriangle className="text-rose-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-bold text-rose-800">⚠️ Stored XSS Detected!</p>
                <p className="text-sm text-rose-700">
                  A malicious script was injected into a comment. Every visitor would
                  execute this payload.
                </p>
              </div>
            </div>
          )}

          {/* Simulated Cookie Theft */}
          {showSimulatedTheft && (
            <div className="animate-pulse bg-red-100 border-2 border-red-400 rounded-lg p-4 mb-4 flex items-start gap-3">
              <Eye className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-bold text-red-800">🍪 Simulated Cookie Theft!</p>
                <p className="text-sm text-red-700">
                  An attacker could use <code className="bg-red-200 px-1 rounded">document.cookie</code>{" "}
                  to steal session cookies and send them to{" "}
                  <code className="bg-red-200 px-1 rounded">attacker.com</code>.
                </p>
                <p className="text-xs text-red-600 mt-1">
                  In a real attack, the victim's session would be hijacked. HttpOnly cookies
                  prevent this.
                </p>
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-bold text-gray-500 mb-1">{c.author}</p>
                <div className="text-sm text-slate-800">
                  {isStoredVulnerable ? (
                    <div dangerouslySetInnerHTML={{ __html: c.text }} />
                  ) : (
                    escapeHtml(c.text)
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prevention Section */}
        <div className="bg-white rounded-2xl border-2 border-emerald-200 p-6 sm:p-8 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-emerald-500 flex-shrink-0" size={28} />
            <h2 className="text-2xl font-bold text-slate-900">Prevention Techniques</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-500" />
                Input Validation
              </h3>
              <p className="text-sm text-slate-600">
                Validate and sanitize all user input on both client and server sides. Use
                allowlists (whitelist) over blocklists. Restrict input to expected types,
                lengths, and patterns.
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-500" />
                Output Encoding
              </h3>
              <p className="text-sm text-slate-600">
                Encode output based on context: HTML entity encoding for HTML body, URL
                encoding for URLs, JavaScript encoding for JS contexts. Libraries like OWASP
                Java Encoder or DOMPurify handle this.
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-500" />
                Content Security Policy
              </h3>
              <p className="text-sm text-slate-600">
                Use CSP headers to restrict which scripts can execute. Disable inline scripts
                with <code className="bg-emerald-200 px-1 rounded text-xs">script-src 'self'</code>
                . Report violations via <code className="bg-emerald-200 px-1 rounded text-xs">report-uri</code>.
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-500" />
                HTTPOnly Cookies
              </h3>
              <p className="text-sm text-slate-600">
                Set the HttpOnly flag on session cookies to prevent JavaScript access. Combine
                with Secure and SameSite=Strict/Lax attributes for defense in depth.
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-500" />
                Sanitization Libraries
              </h3>
              <p className="text-sm text-slate-600">
                Use well-maintained libraries like DOMPurify, OWASP Java Encoder, or
                Bleach (Python). Avoid rolling your own sanitizer — edge cases with SVG,
                MathML, and obscure attributes are easy to miss.
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-500" />
                Context-aware Escaping
              </h3>
              <p className="text-sm text-slate-600">
                Apply the correct escaping for each context: HTML body, HTML attributes, CSS,
                JavaScript strings, URLs. A single unescaped insertion point can open an XSS
                vector.
              </p>
            </div>
          </div>
        </div>

        {/* XSS Types Comparison Table */}
        <div className="bg-white rounded-2xl border-2 border-orange-200 p-6 sm:p-8 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Code2 className="text-orange-500 flex-shrink-0" size={28} />
            <h2 className="text-2xl font-bold text-slate-900">XSS Types Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-orange-100">
                  <th className="text-left p-3 font-bold text-slate-900 border border-orange-200">
                    Type
                  </th>
                  <th className="text-left p-3 font-bold text-slate-900 border border-orange-200">
                    Description
                  </th>
                  <th className="text-left p-3 font-bold text-slate-900 border border-orange-200">
                    Impact
                  </th>
                  <th className="text-left p-3 font-bold text-slate-900 border border-orange-200">
                    Difficulty
                  </th>
                  <th className="text-left p-3 font-bold text-slate-900 border border-orange-200">
                    Example
                  </th>
                </tr>
              </thead>
              <tbody>
                {XSS_TYPES.map((t, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-orange-50"}>
                    <td className="p-3 font-semibold text-slate-900 border border-orange-200">
                      {t.type}
                    </td>
                    <td className="p-3 text-slate-600 border border-orange-200 text-xs sm:text-sm">
                      {t.desc}
                    </td>
                    <td className="p-3 border border-orange-200">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                          t.impact === "Critical"
                            ? "bg-red-100 text-red-700"
                            : t.impact === "High"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {t.impact}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 border border-orange-200">{t.difficulty}</td>
                    <td className="p-3 border border-orange-200">
                      <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-red-600 break-all">
                        {t.example}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Code Examples */}
        <div className="bg-white rounded-2xl border-2 border-red-200 p-6 sm:p-8 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Code2 className="text-red-500 flex-shrink-0" size={28} />
            <h2 className="text-2xl font-bold text-slate-900">Code Examples</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Vulnerable */}
            <div className="border-2 border-red-300 rounded-lg overflow-hidden">
              <div className="bg-red-500 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider">
                ❌ Vulnerable
              </div>
              <pre className="bg-slate-900 text-green-400 text-xs sm:text-sm p-4 overflow-x-auto leading-relaxed">
                <code>{`// React - dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{
  __html: userInput
}} />

// jQuery - HTML injection
$("#output").html(userInput);

// Vanilla JS - innerHTML
document.getElementById(
  "output"
).innerHTML = userInput;

// PHP - raw echo
echo $_GET['search'];

// SQL + Display
SELECT comment FROM posts;
// then display raw HTML`}</code>
              </pre>
            </div>
            {/* Secure */}
            <div className="border-2 border-emerald-300 rounded-lg overflow-hidden">
              <div className="bg-emerald-500 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider">
                ✅ Secure
              </div>
              <pre className="bg-slate-900 text-green-400 text-xs sm:text-sm p-4 overflow-x-auto leading-relaxed">
                <code>{`// React - text content
<div>{escapeHtml(userInput)}</div>

// DOMPurify sanitization
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(input)
}} />

// Vanilla JS - textContent
document.getElementById(
  "output"
).textContent = userInput;

// PHP - htmlspecialchars
echo htmlspecialchars(
  $_GET['search'],
  ENT_QUOTES, 'UTF-8'
);

// Python - Bleach
import bleach
bleach.clean(user_input)`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Bug className="text-slate-500 flex-shrink-0" size={28} />
            <h2 className="text-2xl font-bold text-slate-900">Interview Questions</h2>
          </div>
          <div className="space-y-3">
            {INTERVIEW_QUESTIONS.map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenQuestion(openQuestion === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-slate-900 text-sm sm:text-base pr-4">
                    {item.q}
                  </span>
                  <ChevronRight
                    size={18}
                    className={`text-gray-400 flex-shrink-0 transition-transform ${
                      openQuestion === i ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {openQuestion === i && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                    <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
