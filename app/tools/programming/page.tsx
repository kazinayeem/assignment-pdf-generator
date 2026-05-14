"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Zap, Target, TrendingUp } from "lucide-react";

const TOPICS = [
  { id: "c", label: "C Programming", icon: "🔧", desc: "Pointers, memory, systems programming", difficulty: "Intermediate", topics: 15 },
  { id: "cpp", label: "C++ Programming", icon: "⚡", desc: "OOP, STL, competitive programming", difficulty: "Intermediate", topics: 18 },
  { id: "java", label: "Java Programming", icon: "☕", desc: "OOP, exceptions, collections", difficulty: "Intermediate", topics: 16 },
  { id: "python", label: "Python Programming", icon: "🐍", desc: "Lists, functions, libraries, data science", difficulty: "Beginner", topics: 14 },
  { id: "javascript", label: "JavaScript", icon: "📜", desc: "DOM, async, promises, closures", difficulty: "Beginner", topics: 16 },
  { id: "oop", label: "Object-Oriented Programming", icon: "🎯", desc: "Inheritance, polymorphism, encapsulation", difficulty: "Intermediate", topics: 8 },
  { id: "functional", label: "Functional Programming", icon: "🧵", desc: "Pure functions, immutability, FP patterns", difficulty: "Advanced", topics: 7 },
  { id: "competitive", label: "Competitive Programming", icon: "🏆", desc: "Algorithms, time complexity, tricks", difficulty: "Advanced", topics: 12 },
];

const STATS = [
  { label: "Languages", value: "8+", icon: <BookOpen size={20} /> },
  { label: "Code Examples", value: "200+", icon: <Zap size={20} /> },
  { label: "Interview Qs", value: "250+", icon: <Target size={20} /> },
  { label: "Coding Problems", value: "100+", icon: <TrendingUp size={20} /> },
];

export default function ProgrammingPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div style={{ background: "#fff" }}>
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .hero-gradient {
          background: linear-gradient(135deg, #ec4899 0%, #f43f5e 25%, #f97316 50%, #eab308 75%, #84cc16 100%);
          background-size: 400% 400%;
          animation: gradientShift 8s ease infinite;
        }
      `}</style>

      {/* Hero Section */}
      <div className="hero-gradient text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="text-5xl mb-4">💻</div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">Programming Languages</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-95 max-w-3xl mx-auto leading-relaxed">
            Master C, C++, Java, Python, and JavaScript with real-world examples and best practices
          </p>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/tools/programming/python">
              <button className="bg-white text-pink-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-pink-50 transition flex items-center gap-2">
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
          <h2 className="text-3xl font-bold text-gray-900 mb-10">All Languages & Topics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOPICS.map((topic) => (
              <Link key={topic.id} href={`/tools/programming/${topic.id}`}>
                <div
                  onMouseEnter={() => setHoveredCard(topic.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`p-6 rounded-xl border-2 transition-all h-full cursor-pointer ${
                    hoveredCard === topic.id
                      ? "border-pink-500 bg-pink-50 shadow-lg -translate-y-1"
                      : "border-gray-200 bg-white hover:border-pink-300"
                  }`}
                >
                  <div className="text-3xl mb-3">{topic.icon}</div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{topic.label}</h3>
                  <p className="text-sm text-gray-600 mb-3">{topic.desc}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-pink-600 font-semibold">{topic.topics} topics</span>
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
