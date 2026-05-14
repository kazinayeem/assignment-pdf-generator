"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Zap, Target, TrendingUp } from "lucide-react";

const TOPICS = [
  { id: "fundamentals", label: "Security Fundamentals", icon: "🔐", desc: "CIA triad, threats, vulnerabilities", difficulty: "Beginner", topics: 5 },
  { id: "cryptography", label: "Cryptography", icon: "🔑", desc: "Encryption, hashing, digital signatures", difficulty: "Intermediate", topics: 8 },
  { id: "authentication", label: "Authentication & Authorization", icon: "🆔", desc: "Passwords, MFA, OAuth, JWT", difficulty: "Intermediate", topics: 6 },
  { id: "network-security", label: "Network Security", icon: "🌐", desc: "Firewalls, VPN, SSL/TLS", difficulty: "Intermediate", topics: 7 },
  { id: "application-security", label: "Application Security", icon: "🛡️", desc: "OWASP Top 10, SQL injection, XSS", difficulty: "Advanced", topics: 8 },
  { id: "web-security", label: "Web Security", icon: "🕸️", desc: "CORS, CSRF, CSP, Headers", difficulty: "Intermediate", topics: 6 },
  { id: "ethical-hacking", label: "Ethical Hacking", icon: "⚔️", desc: "Penetration testing, reconnaissance", difficulty: "Advanced", topics: 5 },
  { id: "incident-response", label: "Incident Response", icon: "🚨", desc: "Detection, analysis, recovery", difficulty: "Advanced", topics: 4 },
];

const STATS = [
  { label: "Core Topics", value: "8+", icon: <BookOpen size={20} /> },
  { label: "Simulations", value: "10+", icon: <Zap size={20} /> },
  { label: "Interview Qs", value: "150+", icon: <Target size={20} /> },
  { label: "Best Practices", value: "50+", icon: <TrendingUp size={20} /> },
];

export default function SecurityPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div style={{ background: "#fff" }}>
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .hero-gradient {
          background: linear-gradient(135deg, #dc2626 0%, #7c3aed 25%, #2563eb 50%, #0891b2 75%, #059669 100%);
          background-size: 400% 400%;
          animation: gradientShift 8s ease infinite;
        }
      `}</style>

      {/* Hero Section */}
      <div className="hero-gradient text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">Cyber Security</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-95 max-w-3xl mx-auto leading-relaxed">
            Learn encryption, ethical hacking, network security, and protect systems from threats
          </p>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/tools/security/fundamentals">
              <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-red-50 transition flex items-center gap-2">
                Start Learning <ArrowRight size={20} />
              </button>
            </Link>
            <button className="bg-white/20 text-white border-2 border-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white/10 transition">
              View Roadmap
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Topics Grid */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-10">All Topics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOPICS.map((topic) => (
              <Link key={topic.id} href={`/tools/security/${topic.id}`}>
                <div
                  onMouseEnter={() => setHoveredCard(topic.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`p-6 rounded-xl border-2 transition-all h-full cursor-pointer ${
                    hoveredCard === topic.id
                      ? "border-red-500 bg-red-50 shadow-lg -translate-y-1"
                      : "border-gray-200 bg-white hover:border-red-300"
                  }`}
                >
                  <div className="text-3xl mb-3">{topic.icon}</div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{topic.label}</h3>
                  <p className="text-sm text-gray-600 mb-3">{topic.desc}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-red-600 font-semibold">{topic.topics} topics</span>
                    <span className={`px-2 py-1 rounded ${topic.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : topic.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                      {topic.difficulty}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
