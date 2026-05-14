"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Shield, BookOpen, Zap, Target, TrendingUp, Terminal, Code2, Lock, Globe, Network, Bug, Cloud, Server, Eye } from "lucide-react";

const TOPICS = [
  { id: "fundamentals", label: "Security Fundamentals", icon: Lock, desc: "CIA triad, threats, vulnerabilities, security policies", difficulty: "Beginner", topics: 6, color: "blue" },
  { id: "cryptography", label: "Cryptography", icon: Eye, desc: "Encryption, RSA, AES, hashing, digital signatures", difficulty: "Intermediate", topics: 8, color: "violet" },
  { id: "hashing", label: "Hashing & Signatures", icon: Code2, desc: "SHA, MD5, HMAC, digital signature algorithms", difficulty: "Intermediate", topics: 5, color: "purple" },
  { id: "ssl-tls", label: "SSL/TLS", icon: Shield, desc: "Secure sockets layer, TLS handshake, certificates", difficulty: "Intermediate", topics: 4, color: "emerald" },
  { id: "web-security", label: "Web Security", icon: Globe, desc: "OWASP Top 10, CORS, CSP, secure headers", difficulty: "Intermediate", topics: 7, color: "cyan" },
  { id: "sql-injection", label: "SQL Injection", icon: Terminal, desc: "Injection attacks, prepared statements, mitigation", difficulty: "Advanced", topics: 5, color: "red" },
  { id: "xss", label: "XSS Attacks", icon: Bug, desc: "Cross-site scripting, payloads, sanitization", difficulty: "Advanced", topics: 5, color: "orange" },
  { id: "network-security", label: "Network Security", icon: Network, desc: "Firewalls, IDS/IPS, secure protocols, segmentation", difficulty: "Intermediate", topics: 6, color: "sky" },
  { id: "firewalls", label: "Firewalls", icon: Server, desc: "Packet filtering, stateful inspection, rules", difficulty: "Intermediate", topics: 5, color: "indigo" },
  { id: "vpn", label: "VPN", icon: Lock, desc: "Tunneling, IPsec, OpenVPN, WireGuard", difficulty: "Intermediate", topics: 4, color: "teal" },
  { id: "wireshark", label: "Wireshark", icon: Network, desc: "Packet analysis, protocol inspection, filtering", difficulty: "Advanced", topics: 5, color: "green" },
  { id: "malware", label: "Malware & Threats", icon: Bug, desc: "Viruses, ransomware, trojans, rootkits, sandboxing", difficulty: "Advanced", topics: 6, color: "rose" },
  { id: "ethical-hacking", label: "Ethical Hacking", icon: Terminal, desc: "Reconnaissance, scanning, exploitation, reporting", difficulty: "Advanced", topics: 5, color: "amber" },
  { id: "cloud-security", label: "Cloud Security", icon: Cloud, desc: "Zero Trust, IAM, MFA, SOC, cloud protection", difficulty: "Advanced", topics: 5, color: "sky" },
];

const STATS = [
  { label: "Core Topics", value: "14", icon: BookOpen },
  { label: "Simulations", value: "6+", icon: Zap },
  { label: "Interview Qs", value: "100+", icon: Target },
  { label: "Labs & Demos", value: "20+", icon: TrendingUp },
];

const LEARNING_PATHS = [
  { title: "Security Foundations", items: ["Fundamentals", "Cryptography", "Hashing", "SSL/TLS"], badge: "Beginner", color: "blue" },
  { title: "Web & Network Defense", items: ["Web Security", "SQL Injection", "XSS", "Network Security", "Firewalls"], badge: "Intermediate", color: "violet" },
  { title: "Advanced Security", items: ["Ethical Hacking", "Malware", "Cloud Security", "Wireshark"], badge: "Advanced", color: "red" },
];

const FEATURES = [
  { icon: Terminal, title: "Interactive Simulations", desc: "Practice SQL injection, XSS, encryption, and firewall rules in safe sandboxed environments." },
  { icon: Code2, title: "Real Code Examples", desc: "See actual attack payloads and defense implementations in multiple programming languages." },
  { icon: Shield, title: "Capture the Flag Style", desc: "Learn through hands-on challenges that simulate real-world security scenarios." },
];

export default function SecurityPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const colorMap: Record<string, string> = {
    blue: "border-blue-500 bg-blue-50", violet: "border-violet-500 bg-violet-50", purple: "border-purple-500 bg-purple-50",
    emerald: "border-emerald-500 bg-emerald-50", cyan: "border-cyan-500 bg-cyan-50", red: "border-red-500 bg-red-50",
    orange: "border-orange-500 bg-orange-50", sky: "border-sky-500 bg-sky-50", indigo: "border-indigo-500 bg-indigo-50",
    teal: "border-teal-500 bg-teal-50", green: "border-green-500 bg-green-50", rose: "border-rose-500 bg-rose-50", amber: "border-amber-500 bg-amber-50",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes gradientShift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .hero-gradient { background: linear-gradient(135deg, #7c3aed 0%, #dc2626 25%, #2563eb 50%, #0891b2 75%, #059669 100%); background-size: 400% 400%; animation: gradientShift 8s ease infinite; }
        .terminal-bg { background: #0a0a0f; background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 20px 20px; }
      `}</style>

      {/* Hero */}
      <div className="hero-gradient text-white py-16 sm:py-20 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-semibold mb-6 border border-white/20">
            <Shield className="w-3.5 h-3.5" /> Cyber Security Learning Lab
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 leading-tight">🛡️ Cyber Security</h1>
          <p className="text-base sm:text-lg md:text-xl mb-8 opacity-95 max-w-3xl mx-auto leading-relaxed">
            Learn encryption, ethical hacking, network defense, and web security through interactive simulations and hands-on labs.
          </p>
          <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
            <Link href="/tools/security/fundamentals">
              <button className="bg-white text-violet-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-lg hover:bg-violet-50 transition flex items-center gap-2 shadow-lg">
                Start Learning <ArrowRight size={18} />
              </button>
            </Link>
            <Link href="/tools/security/ethical-hacking">
              <button className="bg-white/10 text-white border-2 border-white/30 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-lg hover:bg-white/20 transition backdrop-blur-md">
                View Roadmap
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-12 sm:mt-16">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/20">
                  <Icon className="w-5 h-5 mx-auto mb-1.5 opacity-90" />
                  <div className="text-xl sm:text-2xl font-black">{stat.value}</div>
                  <div className="text-[11px] sm:text-xs opacity-80">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Learning Paths */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-8">Suggested Learning Paths</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {LEARNING_PATHS.map((path) => (
              <div key={path.title} className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-${path.color}-100`}>
                    <Shield className={`w-4 h-4 text-${path.color}-600`} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">{path.title}</h3>
                </div>
                <ul className="space-y-2 mb-4">
                  {path.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 bg-violet-500 rounded-full shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <span className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-full ${
                  path.badge === "Beginner" ? "bg-emerald-100 text-emerald-700" :
                  path.badge === "Intermediate" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                }`}>{path.badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-8">Why Learn Security Here?</h2>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
                  <Icon className="w-8 h-8 text-violet-600 mb-3" />
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Topics Grid */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-8">All Security Topics</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {TOPICS.map((topic) => {
              const Icon = topic.icon;
              return (
                <Link key={topic.id} href={`/tools/security/${topic.id}`}>
                  <div onMouseEnter={() => setHoveredCard(topic.id)} onMouseLeave={() => setHoveredCard(null)}
                    className={`p-4 sm:p-5 rounded-xl border-2 transition-all h-full cursor-pointer ${
                      hoveredCard === topic.id
                        ? "border-violet-500 bg-violet-50 shadow-md -translate-y-0.5"
                        : "border-gray-200 bg-white hover:border-violet-300"
                    }`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mb-2.5 ${
                      hoveredCard === topic.id ? "text-violet-600" : "text-gray-500"
                    }`} />
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-1.5">{topic.label}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed">{topic.desc}</p>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-violet-600 font-semibold">{topic.topics} topics</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        topic.difficulty === "Beginner" ? "bg-emerald-100 text-emerald-700" :
                        topic.difficulty === "Intermediate" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                      }`}>{topic.difficulty}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
