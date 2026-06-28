"use client";

import Link from "next/link";
import { ChevronRight, Shield, Server, Lock, FileText, AlertTriangle, CheckCircle, HelpCircle, ChevronDown, ArrowRight, Globe } from "lucide-react";
import { useState } from "react";

const interviewData = [
  {
    q: "What is the difference between SSL and TLS?",
    a: "SSL (Secure Sockets Layer) is the older protocol, with SSL 2.0 and 3.0 now deprecated due to security flaws. TLS (Transport Layer Security) is the modern, more secure replacement. TLS 1.2 and 1.3 are the current standards. Most people still say 'SSL' but actually use TLS."
  },
  {
    q: "What happens during a TLS handshake?",
    a: "The TLS handshake involves: (1) ClientHello — client sends supported cipher suites and TLS version; (2) ServerHello — server selects cipher suite and sends its certificate; (3) Certificate verification — client verifies the server's certificate against trusted CAs; (4) Key Exchange — client generates pre-master secret, encrypts with server's public key; (5) Session keys derived; (6) Finished — both sides confirm encrypted communication can begin."
  },
  {
    q: "How does HTTPS protect against MitM attacks?",
    a: "HTTPS uses TLS to encrypt all data between client and server, making it unreadable to eavesdroppers. The server's certificate is verified by the client against trusted Certificate Authorities, preventing impersonation. Certificate validation ensures the client is talking to the real server, not an attacker intercepting the connection."
  },
  {
    q: "What is a Certificate Authority (CA) and how does the trust chain work?",
    a: "A CA is a trusted entity that issues digital certificates. The trust chain works: Root CAs (self-signed, trusted by browsers) → Intermediate CAs (signed by root CAs) → Server certificates (signed by intermediate CAs). This chain allows verifying certificates without every browser needing to know about every website's certificate directly."
  },
  {
    q: "What are the main improvements in TLS 1.3 over TLS 1.2?",
    a: "TLS 1.3 offers: (1) Faster handshake — 1-RTT instead of 2-RTT (or 0-RTT for returning clients); (2) Removed insecure cipher suites (no RC4, 3DES, or static RSA); (3) Perfect Forward Secrecy by default; (4) Simplified cipher suite list; (5) Encrypted handshake messages for better privacy. It is both faster and more secure."
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

const handshakeSteps = [
  { step: "1", title: "ClientHello", desc: "Client sends supported TLS versions, cipher suites, and a random number.", color: "bg-blue-50 border-blue-200", numColor: "bg-blue-600" },
  { step: "2", title: "ServerHello", desc: "Server selects cipher suite, sends its digital certificate and a random number.", color: "bg-indigo-50 border-indigo-200", numColor: "bg-indigo-600" },
  { step: "3", title: "Certificate Verification", desc: "Client verifies the server's certificate against trusted CAs.", color: "bg-violet-50 border-violet-200", numColor: "bg-violet-600" },
  { step: "4", title: "Key Exchange", desc: "Client generates pre-master secret, encrypts with server's public key.", color: "bg-purple-50 border-purple-200", numColor: "bg-purple-600" },
  { step: "5", title: "Session Keys Derived", desc: "Both sides derive symmetric session keys from the pre-master secret.", color: "bg-fuchsia-50 border-fuchsia-200", numColor: "bg-fuchsia-600" },
  { step: "6", title: "Finished", desc: "Both sides send encrypted 'Finished' messages. Secure channel established.", color: "bg-emerald-50 border-emerald-200", numColor: "bg-emerald-600" }
];

export default function SslTlsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-violet-50/20 to-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/tools/security" className="hover:text-gray-700 transition-colors">Security</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-semibold">SSL / TLS</span>
        </div>

        <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-2xl p-8 md:p-12 mb-8 text-white">
          <h1 className="text-3xl md:text-4xl font-black mb-3">SSL / TLS</h1>
          <p className="text-violet-100 text-lg max-w-3xl">
            Understanding SSL/TLS protocols, the handshake process, PKI, HTTPS, and how encryption secures web communications.
          </p>
        </div>

        {/* What is SSL/TLS */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">What is SSL / TLS?</h2>
          <p className="text-sm text-gray-500 mb-6">Cryptographic protocols that provide secure communication over a network</p>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { title: "Encryption", icon: Lock, desc: "All data transmitted between client and server is encrypted using symmetric keys derived during the handshake. This ensures confidentiality — eavesdroppers cannot read the data." },
              { title: "Authentication", icon: Shield, desc: "Servers (and optionally clients) present digital certificates issued by trusted CAs. This verifies the server's identity and prevents impersonation attacks." },
              { title: "Integrity", icon: CheckCircle, desc: "Message Authentication Codes (MACs) ensure data is not tampered with during transmission. Any modification will be detected by the receiving party." }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <Icon className="w-6 h-6 text-violet-600 mb-3" />
                  <h3 className="font-bold text-gray-900 text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* TLS Handshake Diagram */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">TLS Handshake</h2>
          <p className="text-sm text-gray-500 mb-6">The sequence of messages exchanged to establish a secure connection</p>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
              <Server className="w-4 h-4" />
              <span className="font-semibold">Client</span>
              <ArrowRight className="w-4 h-4" />
              <span className="font-semibold">Server</span>
            </div>
            <div className="space-y-3 w-full max-w-2xl">
              {handshakeSteps.map((s, i) => (
                <div key={i} className={`p-4 rounded-xl border ${s.color} relative`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full ${s.numColor} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                      {s.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm">{s.title}</h3>
                      <p className="text-xs text-gray-600">{s.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certificate Authorities & PKI */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">Certificate Authorities & PKI</h2>
          <p className="text-sm text-gray-500 mb-6">The infrastructure that enables trusted digital identities</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-600" /> How PKI Works</h3>
              <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                <li><strong>Root CAs</strong> are trust anchors (self-signed, pre-installed in browsers/OS)</li>
                <li><strong>Intermediate CAs</strong> are signed by root CAs to issue end-entity certificates</li>
                <li><strong>Server certificates</strong> bind a domain name to a public key</li>
                <li>Certificate chains are verified up to a trusted root</li>
                <li>Revocation via CRL (Certificate Revocation List) or OCSP</li>
              </ul>
            </div>
            <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200">
              <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-600" /> Major CAs</h3>
              <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                <li>Let's Encrypt — free, automated certificates (ACME protocol)</li>
                <li>DigiCert — enterprise-grade certificates</li>
                <li>GlobalSign — SSL, code signing, and email certificates</li>
                <li>Sectigo — high-volume certificate provider</li>
                <li>Cloudflare — managed TLS with universal SSL</li>
              </ul>
            </div>
          </div>
        </div>

        {/* TLS Version Comparison */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-4">TLS 1.2 vs TLS 1.3</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-bold text-gray-700 border-b border-gray-200">Feature</th>
                  <th className="text-left p-3 font-bold text-gray-700 border-b border-gray-200">TLS 1.2</th>
                  <th className="text-left p-3 font-bold text-gray-700 border-b border-gray-200">TLS 1.3</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Handshake RTT", v12: "2 round trips", v13: "1 round trip (0-RTT for resumption)" },
                  { feature: "Cipher Suites", v12: "37+ suites (many insecure)", v13: "5 AEAD suites (all secure)" },
                  { feature: "Key Exchange", v12: "RSA, DH, ECDH (some without PFS)", v13: "ECDHE only (PFS mandatory)" },
                  { feature: "Encrypted Handshake", v12: "Partially encrypted", v13: "Fully encrypted" },
                  { feature: "Legacy Algorithms", v12: "RC4, 3DES, CBC mode allowed", v13: "All removed" },
                  { feature: "Downgrade Protection", v12: "Limited", v13: "Built-in downgrade prevention" },
                  { feature: "Adoption", v12: "Widely deployed (legacy support)", v13: "Increasingly standard" }
                ].map((row) => (
                  <tr key={row.feature} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-bold text-gray-700">{row.feature}</td>
                    <td className="p-3 text-xs text-gray-600">{row.v12}</td>
                    <td className="p-3 text-xs text-emerald-700 font-medium">{row.v13}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* HTTPS */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">HTTPS — HTTP over TLS</h2>
          <p className="text-sm text-gray-500 mb-6">How HTTPS uses TLS to secure web traffic</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-2"><Globe className="w-4 h-4 text-violet-600" /> How It Works</h3>
              <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside">
                <li>Browser connects to port 443 (default for HTTPS)</li>
                <li>TLS handshake occurs before any HTTP data is sent</li>
                <li>After secure channel established, HTTP requests are encrypted</li>
                <li>All HTTP headers, URLs, cookies, and body are encrypted</li>
                <li>Only server IP and SNI hostname remain visible</li>
              </ol>
            </div>
            <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200">
              <h3 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> Benefits</h3>
              <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                <li>Prevents eavesdropping on sensitive data</li>
                <li>Protects against content injection by ISPs</li>
                <li>Required for HTTP/2 and HTTP/3</li>
                <li>SEO ranking boost (Google prefers HTTPS)</li>
                <li>Enables modern web APIs (geolocation, service workers)</li>
                <li>Prevents referrer header leakage</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Common Attacks */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">Common Attacks on SSL/TLS</h2>
          <p className="text-sm text-gray-500 mb-6">Historical vulnerabilities and how they have been addressed</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: "POODLE", year: "2014", desc: "Padding Oracle On Downgraded Legacy Encryption. Exploited SSL 3.0's CBC padding to decrypt plaintext. Fixed by disabling SSL 3.0 entirely.", icon: AlertTriangle },
              { title: "Heartbleed", year: "2014", desc: "Buffer over-read bug in OpenSSL's Heartbeat extension. Allowed reading server memory (including private keys). Fixed by patching OpenSSL.", icon: AlertTriangle },
              { title: "BEAST", year: "2011", desc: "Browser Exploit Against SSL/TLS. Exploited TLS 1.0's CBC IV chaining to decrypt cookies. Fixed by prioritizing RC4 (later deprecated) and moving to TLS 1.1+.", icon: AlertTriangle }
            ].map((attack) => {
              const Icon = attack.icon;
              return (
                <div key={attack.title} className="p-5 bg-red-50 rounded-xl border border-red-200">
                  <Icon className="w-5 h-5 text-red-600 mb-2" />
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">{attack.title}</h3>
                    <span className="text-xs text-red-500 font-semibold">({attack.year})</span>
                  </div>
                  <p className="text-xs text-gray-600">{attack.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-4">TLS Best Practices</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Use TLS 1.3 as the preferred protocol; TLS 1.2 as fallback",
              "Disable SSL 2.0, SSL 3.0, TLS 1.0, and TLS 1.1",
              "Use strong cipher suites: TLS_AES_128_GCM_SHA256 or better",
              "Enable HSTS (HTTP Strict Transport Security)",
              "Use 2048+ bit RSA keys or ECDSA with P-256/P-384 curves",
              "Implement certificate revocation via OCSP stapling",
              "Use Perfect Forward Secrecy (ECDHE key exchange)",
              "Regularly check with SSL Labs for configuration issues",
              "Automate certificate renewal (e.g., Let's Encrypt + ACME)",
              "Monitor certificate expiry and receive alerts"
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
          <p className="text-sm text-gray-500 mb-6">Common SSL/TLS interview questions with answers</p>
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
