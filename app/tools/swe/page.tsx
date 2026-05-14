"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Zap, Target, TrendingUp } from "lucide-react";

const TOPICS = [
  { id: "sdlc", label: "SDLC Models", icon: "🔄", desc: "Waterfall, Agile, DevOps", difficulty: "Beginner", topics: 6 },
  { id: "design-patterns", label: "Design Patterns", icon: "🏗️", desc: "Creational, Structural, Behavioral", difficulty: "Intermediate", topics: 23 },
  { id: "uml", label: "UML & Modeling", icon: "📊", desc: "Class, sequence, deployment diagrams", difficulty: "Beginner", topics: 8 },
  { id: "requirements", label: "Requirements Engineering", icon: "📋", desc: "Gathering, analysis, specification", difficulty: "Beginner", topics: 5 },
  { id: "testing", label: "Software Testing", icon: "🧪", desc: "Unit, integration, system testing", difficulty: "Intermediate", topics: 7 },
  { id: "quality", label: "Quality Assurance", icon: "✅", desc: "QA processes, metrics, standards", difficulty: "Intermediate", topics: 6 },
  { id: "project-management", label: "Project Management", icon: "📈", desc: "Planning, execution, monitoring", difficulty: "Intermediate", topics: 5 },
  { id: "system-design", label: "System Design", icon: "🎯", desc: "Scalability, load balancing, caching", difficulty: "Advanced", topics: 10 },
];

const STATS = [
  { label: "Core Topics", value: "8+", icon: <BookOpen size={20} /> },
  { label: "Design Patterns", value: "23+", icon: <Zap size={20} /> },
  { label: "Interview Qs", value: "180+", icon: <Target size={20} /> },
  { label: "Case Studies", value: "15+", icon: <TrendingUp size={20} /> },
];

export default function SWEPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div style={{ background: "#fff" }}>
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .hero-gradient {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 25%, #d946ef 50%, #ec4899 75%, #f43f5e 100%);
          background-size: 400% 400%;
          animation: gradientShift 8s ease infinite;
        }
      `}</style>

      {/* Hero Section */}
      <div className="hero-gradient text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="text-5xl mb-4">⚙️</div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">Software Engineering</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-95 max-w-3xl mx-auto leading-relaxed">
            Master design patterns, SDLC, UML, testing, and system design principles
          </p>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/tools/swe/sdlc">
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-indigo-50 transition flex items-center gap-2">
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
              <Link key={topic.id} href={`/tools/swe/${topic.id}`}>
                <div
                  onMouseEnter={() => setHoveredCard(topic.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`p-6 rounded-xl border-2 transition-all h-full cursor-pointer ${
                    hoveredCard === topic.id
                      ? "border-indigo-500 bg-indigo-50 shadow-lg -translate-y-1"
                      : "border-gray-200 bg-white hover:border-indigo-300"
                  }`}
                >
                  <div className="text-3xl mb-3">{topic.icon}</div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{topic.label}</h3>
                  <p className="text-sm text-gray-600 mb-3">{topic.desc}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-indigo-600 font-semibold">{topic.topics} topics</span>
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
