"use client";

import Link from "next/link";
import { ChevronRight, Shield, Globe, Lock, Key, AlertTriangle, CheckCircle, HelpCircle, ChevronDown, Server, Eye, FileText, Codesandbox, ShieldOff } from "lucide-react";
import { useState } from "react";

const interviewData = [
  {
    q: "What is the OWASP Top 10 and why is it important?",
    a: "The OWASP Top 10 is a standard awareness document listing the 10 most critical web application security risks. It is compiled by security experts worldwide and updated every few years. Developers and security teams use it to prioritize the most common and impactful vulnerabilities in their applications."
  },
  {
    q: "What is CORS and how does it work?",
    a: "CORS (Cross-Origin Resource Sharing) is a browser security mechanism that controls which origins can access resources on a different origin. The server includes CORS headers (e.g., Access-Control-Allow-Origin) in responses. Browsers enforce the same-origin policy by default and use CORS to safely relax it for legitimate cross-origin requests."
  },
  {
    q: "What is CSRF and how do you prevent it?",
    a: "CSRF (Cross-Site Request Forgery) tricks a logged-in user into unknowingly submitting a malicious request to a web application. Prevention methods include: anti-CSRF tokens in forms, SameSite cookies (Strict/Lax), checking Origin/Referer headers, and requiring re-authentication for sensitive actions."
  },
  {
    q: "What security headers should every web application include?",
    a: "Essential security headers: (1) Content-Security-Policy — controls resource sources; (2) Strict-Transport-Security — enforces HTTPS; (3) X-Frame-Options — prevents clickjacking; (4) X-Content-Type-Options — prevents MIME sniffing; (5) Referrer-Policy — controls referrer info leakage; (6) Permissions-Policy — restricts browser API access."
  },
  {
    q: "What is Content Security Policy (CSP) and how does it prevent XSS?",
    a: "CSP is a browser security mechanism that restricts which resources (scripts, styles, images, etc.) a page can load. By specifying allowed sources via the Content-Security-Policy header, CSP can block inline scripts, eval(), and untrusted CDN scripts — significantly reducing XSS attack surface even if input validation fails."
  }
];

function InterviewAccordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-violet-500 mt-0.5 flex-shrink-0" />
          <span className="font-semibold text-gray-900 text-sm">{q}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed pl-8">{a}</p>
        </div>
      )}
    </div>
  );
}

const owaspItems = [
  { rank: "1", title: "Broken Access Control", desc: "Failures in enforcing user permissions. Users access unauthorized resources or functions.", icon: ShieldOff },
  { rank: "2", title: "Cryptographic Failures", desc: "Weak encryption, exposed sensitive data, improper key management, or missing HTTPS.", icon: Lock },
  { rank: "3", title: "Injection", desc: "SQL, NoSQL, OS, and LDAP injection where untrusted data is sent to an interpreter.", icon: Codesandbox },
  { rank: "4", title: "Insecure Design", desc: "Missing threat modeling and security controls during design phase of the application.", icon: FileText },
  { rank: "5", title: "Security Misconfiguration", desc: "Default credentials, unpatched systems, enabled directory listing, verbose errors.", icon: AlertTriangle },
  { rank: "6", title: "Vulnerable Components", desc: "Using outdated or vulnerable libraries, frameworks, and dependencies.", icon: Server },
  { rank: "7", title: "Auth Failures", desc: "Weak password policies, credential stuffing, session fixation, missing MFA.", icon: Key },
  { rank: "8", title: "Data Integrity Failures", desc: "Software updates, CI/CD pipelines, and serialized data without integrity checks.", icon: Eye },
  { rank: "9", title: "Logging & Monitoring Failures", desc: "Insufficient logging, missing alerts, and delayed incident response.", icon: Eye },
  { rank: "10", title: "SSRF", desc: "Server-Side Request Forgery — tricking server into making unauthorized internal requests.", icon: Globe }
];

export default function WebSecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-violet-50/20 to-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/tools/security" className="hover:text-gray-700 transition-colors">Security</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-semibold">Web Security</span>
        </div>

        <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-2xl p-8 md:p-12 mb-8 text-white">
          <h1 className="text-3xl md:text-4xl font-black mb-3">Web Security</h1>
          <p className="text-violet-100 text-lg max-w-3xl">
            OWASP Top 10, CORS, CSP, security headers, CSRF, session management, and secure coding practices for web applications.
          </p>
        </div>

        {/* OWASP Top 10 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">OWASP Top 10</h2>
          <p className="text-sm text-gray-500 mb-6">The 10 most critical web application security risks (2021 edition)</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {owaspItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.rank} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-violet-300 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {item.rank}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Icon className="w-4 h-4 text-violet-600 flex-shrink-0" />
                      <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                    </div>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CORS */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">CORS (Cross-Origin Resource Sharing)</h2>
          <p className="text-sm text-gray-500 mb-6">A browser security mechanism for controlled cross-origin access</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="font-bold text-sm text-gray-900 mb-2">How CORS Works</h3>
              <ol className="text-xs text-gray-600 space-y-1.5 list-decimal list-inside">
                <li>Browser enforces same-origin policy — blocks cross-origin requests by default</li>
                <li>For cross-origin requests, browser adds <code className="bg-blue-100 px-1">Origin</code> header</li>
                <li>Server responds with <code className="bg-blue-100 px-1">Access-Control-Allow-Origin</code> header</li>
                <li>Browser checks if the origin matches the allowed value</li>
                <li>Preflight requests (OPTIONS) are sent for complex requests</li>
              </ol>
            </div>
            <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200">
              <h3 className="font-bold text-sm text-gray-900 mb-2">Important CORS Headers</h3>
              <ul className="text-xs text-gray-600 space-y-1.5 font-mono">
                <li><strong className="text-gray-800">Access-Control-Allow-Origin:</strong> * | https://example.com</li>
                <li><strong className="text-gray-800">Access-Control-Allow-Methods:</strong> GET, POST, PUT</li>
                <li><strong className="text-gray-800">Access-Control-Allow-Headers:</strong> Content-Type, Authorization</li>
                <li><strong className="text-gray-800">Access-Control-Allow-Credentials:</strong> true</li>
                <li><strong className="text-gray-800">Access-Control-Max-Age:</strong> 86400</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CSP */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">Content Security Policy (CSP)</h2>
          <p className="text-sm text-gray-500 mb-6">A defense-in-depth mechanism to prevent XSS and data injection attacks</p>
          <div className="p-5 bg-gray-900 rounded-xl mb-4">
            <pre className="text-xs text-emerald-400 overflow-x-auto">Content-Security-Policy: default-src &apos;self&apos;; script-src &apos;self&apos; https://trusted-cdn.com; style-src &apos;self&apos; &apos;unsafe-inline&apos;; img-src *; font-src &apos;self&apos; https://fonts.gstatic.com; connect-src &apos;self&apos; https://api.example.com; frame-ancestors &apos;none&apos;; form-action &apos;self&apos;;</pre>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { dir: "default-src", desc: "Fallback for all resource types not explicitly specified" },
              { dir: "script-src", desc: "Controls which scripts can execute (inline, eval, external sources)" },
              { dir: "style-src", desc: "Controls which stylesheets and inline styles are allowed" },
              { dir: "img-src", desc: "Controls allowed sources for images" },
              { dir: "frame-ancestors", desc: "Controls which sites can embed the page in frames (prevents clickjacking)" },
              { dir: "report-uri / report-to", desc: "Sends violation reports to a specified endpoint" }
            ].map((d) => (
              <div key={d.dir} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <code className="text-xs font-bold text-violet-700">{d.dir}</code>
                <p className="text-xs text-gray-600 mt-1">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Security Headers */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">Security Headers</h2>
          <p className="text-sm text-gray-500 mb-6">HTTP response headers that enhance browser security</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-bold text-gray-700 border-b border-gray-200">Header</th>
                  <th className="text-left p-3 font-bold text-gray-700 border-b border-gray-200">Purpose</th>
                  <th className="text-left p-3 font-bold text-gray-700 border-b border-gray-200">Example Value</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { header: "Strict-Transport-Security", purpose: "Force HTTPS connections", example: "max-age=31536000; includeSubDomains" },
                  { header: "X-Frame-Options", purpose: "Prevent clickjacking via iframes", example: "DENY" },
                  { header: "X-Content-Type-Options", purpose: "Prevent MIME type sniffing", example: "nosniff" },
                  { header: "Referrer-Policy", purpose: "Control referrer info in requests", example: "strict-origin-when-cross-origin" },
                  { header: "Permissions-Policy", purpose: "Restrict browser API access", example: "camera=(), microphone=(), geolocation=()" },
                  { header: "Content-Security-Policy", purpose: "Comprehensive resource control", example: "default-src 'self'" }
                ].map((row) => (
                  <tr key={row.header} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-bold text-violet-700 text-xs">{row.header}</td>
                    <td className="p-3 text-xs text-gray-600">{row.purpose}</td>
                    <td className="p-3 text-xs text-gray-500 font-mono">{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Security Headers Check */}
          <div className="mt-6 p-5 bg-green-50 rounded-xl border border-green-200">
            <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Secure Headers Checklist</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                "Strict-Transport-Security (HSTS) with long max-age",
                "X-Frame-Options: DENY or SAMEORIGIN",
                "X-Content-Type-Options: nosniff",
                "Content-Security-Policy with restrictive rules",
                "Referrer-Policy set to strict values",
                "Permissions-Policy limiting sensitive APIs",
                "No Server header or minimal info",
                "Set-Cookie with Secure, HttpOnly, SameSite flags"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CSRF */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">CSRF (Cross-Site Request Forgery)</h2>
          <p className="text-sm text-gray-500 mb-6">An attack that forces an authenticated user to perform unwanted actions</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 bg-red-50 rounded-xl border border-red-200">
              <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-600" /> Attack Flow</h3>
              <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside">
                <li>User logs into legitimate site (e.g., bank.com) — gets a session cookie</li>
                <li>User visits attacker's malicious site without logging out</li>
                <li>Malicious site auto-submits a form to bank.com transferring money</li>
                <li>Browser automatically includes the session cookie with the request</li>
                <li>Server sees a valid request from an authenticated user — executes it</li>
              </ol>
            </div>
            <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200">
              <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-600" /> Prevention</h3>
              <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                <li><strong>Anti-CSRF tokens:</strong> Unique, unpredictable tokens in forms</li>
                <li><strong>SameSite cookies:</strong> Set SameSite=Lax or Strict</li>
                <li><strong>Origin/Referer validation:</strong> Check request origin on server</li>
                <li><strong>Custom headers:</strong> Require X-Requested-By header for AJAX</li>
                <li><strong>Double-submit cookie pattern</strong></li>
                <li><strong>Re-authentication</strong> for sensitive actions</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-xs text-amber-800"><strong>CSRF vs XSS:</strong> CSRF exploits trust the server has in the browser. XSS exploits trust the browser has in the server. CSRF does not require the attacker to see the response — they just need to trigger the action.</p>
          </div>
        </div>

        {/* Session Management */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">Session Management</h2>
          <p className="text-sm text-gray-500 mb-6">Handling user sessions securely</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Secure Session IDs", desc: "Session IDs should be long, random, and generated using cryptographically secure pseudo-random number generators (CSPRNG)." },
              { title: "Session Expiry", desc: "Implement absolute and idle timeouts. Destroy sessions on logout and regenerate IDs after login to prevent session fixation." },
              { title: "Cookie Security Flags", desc: "Set Secure (HTTPS only), HttpOnly (not accessible via JavaScript), and SameSite (prevents CSRF) flags on session cookies." },
              { title: "Session Storage", desc: "Store sessions server-side (Redis, database) rather than in JWTs or client-side storage. This allows invalidation and revocation." }
            ].map((s) => (
              <div key={s.title} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Secure Coding */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-4">Secure Coding Practices</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Validate and sanitize all user inputs on the server side",
              "Use parameterized queries / ORM to prevent SQL injection",
              "Encode output to prevent XSS (context-appropriate encoding)",
              "Use HTTPS everywhere — redirect HTTP to HTTPS",
              "Implement proper authentication with MFA support",
              "Use the principle of least privilege for all components",
              "Keep dependencies updated — use SCA tools",
              "Never trust client-side validation — always validate server-side",
              "Use proper error handling — don't leak stack traces",
              "Implement rate limiting and brute-force protection",
              "Log security events with sufficient detail",
              "Conduct regular security reviews and penetration testing"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">Interview Questions</h2>
          <p className="text-sm text-gray-500 mb-6">Common web security interview questions with answers</p>
          <div className="space-y-3">
            {interviewData.map((item, i) => (
              <InterviewAccordion key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
