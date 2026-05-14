"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Zap, Target, TrendingUp, Database, Table, Key, Lock } from "lucide-react";

const TOPICS = [
  { id: "basics", label: "Database Basics", icon: "📚", desc: "Fundamental concepts and DBMS", difficulty: "Beginner", topics: 4 },
  { id: "relational-model", label: "Relational Model", icon: "🔗", desc: "Tables, rows, columns, relationships", difficulty: "Beginner", topics: 5 },
  { id: "sql", label: "SQL & Queries", icon: "💾", desc: "SELECT, INSERT, UPDATE, DELETE", difficulty: "Beginner", topics: 8 },
  { id: "normalization", label: "Normalization", icon: "📐", desc: "1NF, 2NF, 3NF, BCNF", difficulty: "Intermediate", topics: 6 },
  { id: "erd", label: "Entity-Relationship Diagram", icon: "🗺️", desc: "ER modeling and design", difficulty: "Intermediate", topics: 4 },
  { id: "indexing", label: "Indexing & Storage", icon: "⚡", desc: "B-trees, Hash indexes", difficulty: "Intermediate", topics: 5 },
  { id: "transactions", label: "Transactions & ACID", icon: "🔄", desc: "ACID properties, concurrency control", difficulty: "Advanced", topics: 6 },
  { id: "query-optimization", label: "Query Optimization", icon: "🚀", desc: "Execution plans, optimization techniques", difficulty: "Advanced", topics: 5 },
];

const STATS = [
  { label: "Core Topics", value: "8+", icon: <BookOpen size={20} /> },
  { label: "Visualizers", value: "15+", icon: <Zap size={20} /> },
  { label: "Interview Qs", value: "200+", icon: <Target size={20} /> },
  { label: "SQL Examples", value: "100+", icon: <TrendingUp size={20} /> },
];

const LEARNING_PATHS = [
  { title: "Database Fundamentals", items: ["Basics", "Relational Model", "SQL Basics"], badge: "Beginner" },
  { title: "Design & Modeling", items: ["Normalization", "ERD", "Schema Design"], badge: "Intermediate" },
  { title: "Performance & Advanced", items: ["Indexing", "Transactions", "Query Optimization"], badge: "Advanced" },
];

export default function DatabasePage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div style={{ background: "#fff" }}>
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .hero-gradient {
          background: linear-gradient(135deg, #f59e0b 0%, #ec4899 25%, #8b5cf6 50%, #3b82f6 75%, #06b6d4 100%);
          background-size: 400% 400%;
          animation: gradientShift 8s ease infinite;
        }
      `}</style>

      {/* Hero Section */}
      <div className="hero-gradient text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="text-5xl mb-4">💾</div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">Database Systems</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-95 max-w-3xl mx-auto leading-relaxed">
            Master SQL, normalization, transactions, and database design for scalable systems
          </p>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/tools/database/basics">
              <button className="bg-white text-amber-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-amber-50 transition flex items-center gap-2">
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
        
        {/* Learning Paths */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Suggested Learning Paths</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {LEARNING_PATHS.map((path) => (
              <div key={path.title} className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="text-amber-600" size={24} />
                  <h3 className="text-lg font-bold text-gray-900">{path.title}</h3>
                </div>
                <ul className="space-y-2 mb-4">
                  {path.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700">
                      <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <span className="inline-block px-3 py-1 bg-amber-600 text-white text-xs font-bold rounded-full">
                  {path.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Topics Grid */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-10">All Topics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOPICS.map((topic) => (
              <Link key={topic.id} href={`/tools/database/${topic.id}`}>
                <div
                  onMouseEnter={() => setHoveredCard(topic.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`p-6 rounded-xl border-2 transition-all h-full cursor-pointer ${
                    hoveredCard === topic.id
                      ? "border-amber-500 bg-amber-50 shadow-lg -translate-y-1"
                      : "border-gray-200 bg-white hover:border-amber-300"
                  }`}
                >
                  <div className="text-3xl mb-3">{topic.icon}</div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{topic.label}</h3>
                  <p className="text-sm text-gray-600 mb-3">{topic.desc}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-600 font-semibold">{topic.topics} topics</span>
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
