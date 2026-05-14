"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Zap, Target, TrendingUp, Search, Clock, Bookmark, CheckCircle, Filter, BarChart3, GraduationCap, Route, BrainCircuit, Trophy } from "lucide-react";
import { useAlgoStore } from "@/lib/algo-store";

const TOPICS = [
  { id: "sorting", label: "Sorting Algorithms", icon: "📊", desc: "Master sorting techniques", algorithms: 6, difficulty: "Beginner", color: "from-blue-500 to-blue-600" },
  { id: "searching", label: "Searching", icon: "🔍", desc: "Learn search patterns", algorithms: 3, difficulty: "Beginner", color: "from-cyan-500 to-cyan-600" },
  { id: "recursion", label: "Recursion", icon: "🔄", desc: "Think recursively", algorithms: 5, difficulty: "Beginner", color: "from-teal-500 to-teal-600" },
  { id: "dynamic-programming", label: "Dynamic Programming", icon: "🧩", desc: "Optimize with memoization", algorithms: 8, difficulty: "Advanced", color: "from-purple-500 to-purple-600" },
  { id: "greedy", label: "Greedy Algorithms", icon: "💰", desc: "Make optimal choices", algorithms: 5, difficulty: "Intermediate", color: "from-amber-500 to-amber-600" },
  { id: "graph", label: "Graph Algorithms", icon: "🕸️", desc: "Navigate complex structures", algorithms: 10, difficulty: "Intermediate", color: "from-emerald-500 to-emerald-600" },
  { id: "backtracking", label: "Backtracking", icon: "↩️", desc: "Explore all solutions", algorithms: 5, difficulty: "Advanced", color: "from-pink-500 to-pink-600" },
  { id: "tree", label: "Tree Algorithms", icon: "🌳", desc: "Traverse and manipulate trees", algorithms: 8, difficulty: "Intermediate", color: "from-green-500 to-green-600" },
  { id: "string", label: "String Algorithms", icon: "📝", desc: "Pattern matching & manipulation", algorithms: 7, difficulty: "Intermediate", color: "from-rose-500 to-rose-600" },
  { id: "sliding-window", label: "Sliding Window", icon: "🪟", desc: "Efficient subsequence search", algorithms: 6, difficulty: "Intermediate", color: "from-violet-500 to-violet-600" },
  { id: "two-pointer", label: "Two Pointer", icon: "👉", desc: "Traverse with two pointers", algorithms: 5, difficulty: "Beginner", color: "from-sky-500 to-sky-600" },
  { id: "heap", label: "Heap & Priority Queue", icon: "📚", desc: "Priority-based operations", algorithms: 6, difficulty: "Intermediate", color: "from-orange-500 to-orange-600" },
  { id: "trie", label: "Trie Algorithms", icon: "🌲", desc: "Efficient prefix search", algorithms: 4, difficulty: "Advanced", color: "from-indigo-500 to-indigo-600" },
  { id: "binary-search", label: "Binary Search", icon: "🎯", desc: "Divide and conquer search", algorithms: 6, difficulty: "Beginner", color: "from-red-500 to-red-600" },
];

const STATS = [
  { label: "Algorithms", value: "100+", icon: BookOpen, color: "text-blue-500" },
  { label: "Visualizers", value: "30+", icon: BarChart3, color: "text-purple-500" },
  { label: "Interview Qs", value: "500+", icon: Target, color: "text-green-500" },
  { label: "Complexity Guide", value: "Complete", icon: Trophy, color: "text-amber-500" },
];

const LEARNING_PATHS = [
  { id: "beginner", title: "Beginner Path", items: ["Sorting", "Searching", "Two Pointer", "Recursion", "Binary Search"], href: "/tools/algorithms/beginner-path" },
  { id: "interview", title: "Interview Prep", items: ["Two Pointer", "Sliding Window", "Dynamic Programming", "Graph", "Backtracking"], href: "/tools/algorithms/interview-prep" },
  { id: "advanced", title: "Advanced Mastery", items: ["Graph", "Backtracking", "Trie", "Dynamic Programming", "Heap"], href: "/tools/algorithms/advanced-mastery" },
];

const RESOURCES = [
  { title: "Time Complexity Cheatsheet", desc: "Quick reference for Big O notation", icon: "📊", href: "/tools/algorithms/time-complexity" },
  { title: "Space Complexity Guide", desc: "Understand memory usage patterns", icon: "💾", href: "/tools/algorithms/space-complexity" },
  { title: "Interview Patterns", desc: "Common coding interview patterns", icon: "💡", href: "/tools/algorithms/interview-patterns" },
  { title: "Practice Problems", desc: "Curated problem sets by difficulty", icon: "🎯", href: "/tools/algorithms/practice-problems" },
];

const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];

export default function AlgorithmsPage() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const {
    completedTopics,
    bookmarkedTopics,
    recentActivity,
    isTopicCompleted,
    isBookmarked,
    toggleBookmark,
    completeTopic,
    addActivity,
    getTotalCompleted,
    getCompletionPercent,
    getRecentActivity,
    getLearningPath,
    addSearch,
  } = useAlgoStore();

  const filteredTopics = useMemo(() => {
    return TOPICS.filter((t) => {
      const matchesSearch =
        t.label.toLowerCase().includes(search.toLowerCase()) ||
        t.desc.toLowerCase().includes(search.toLowerCase());
      const matchesDiff = difficulty === "All" || t.difficulty === difficulty;
      return matchesSearch && matchesDiff;
    });
  }, [search, difficulty]);

  const activity = getRecentActivity(5);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 px-6 py-16 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-1.5 mb-6 text-xs font-semibold text-white/90 border border-white/20">
            <GraduationCap size={14} /> Interactive Learning Platform
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Master Algorithms
          </h1>
          <p className="text-lg mb-8 text-white/90 leading-relaxed max-w-2xl mx-auto">
            Interactive visualizations, real-world applications, and interview preparation for computer science students
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-12">
            <Link href="/tools/algorithms/beginner-path">
              <button className="bg-white text-indigo-600 border-none px-8 py-3 rounded-xl font-semibold cursor-pointer text-sm flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all duration-200" onClick={() => addActivity("beginner-path", "view")}>
                Start Learning <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/tools/algorithms/roadmap">
              <button className="bg-white/20 text-white border-2 border-white px-7 py-3 rounded-xl font-semibold cursor-pointer text-sm hover:bg-white/30 hover:scale-105 transition-all duration-200" onClick={() => addActivity("roadmap", "view")}>
                View Roadmap
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white/15 backdrop-blur-md p-5 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200">
                  <div className="flex justify-center mb-2"><Icon size={20} className={stat.color} /></div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-xs text-white/80">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Progress Overview */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Trophy size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Your Progress</h3>
                <p className="text-xs text-slate-500">{getTotalCompleted()} of {TOPICS.length} topics completed</p>
              </div>
            </div>
            <div className="w-full sm:w-48">
              <div className="bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${getCompletionPercent()}%` }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 text-right font-semibold">{getCompletionPercent()}% Complete</p>
            </div>
          </div>
          {activity.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Clock size={12} className="text-slate-400" />
              <span className="text-[10px] font-semibold text-slate-400 mr-1">Recent:</span>
              {activity.map((a, i) => (
                <Link key={i} href={`/tools/algorithms/${a.topicId}`} className="no-underline">
                  <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium hover:bg-indigo-100 transition">
                    {a.topicId.replace(/-/g, " ")} ({a.action})
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search algorithms, topics, concepts..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); if (e.target.value) addSearch(e.target.value); }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {DIFFICULTIES.map((d) => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    difficulty === d
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {d === "All" ? <Filter size={14} className="inline mr-1" /> : null}
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results Count */}
        {search && (
          <p className="text-xs text-slate-500 mb-4">
            Found {filteredTopics.length} topic{filteredTopics.length !== 1 ? "s" : ""} matching &quot;{search}&quot;
          </p>
        )}

        {/* Learning Paths */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Guided Learning Paths</h2>
            <Link href="/tools/algorithms/roadmap" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition no-underline flex items-center gap-1">
              View Full Roadmap <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {LEARNING_PATHS.map((path) => {
              const progress = getLearningPath(path.id);
              const completedCount = progress?.completedModules.length || 0;
              const total = path.items.length;
              const pct = Math.round((completedCount / total) * 100);
              return (
                <Link key={path.id} href={path.href} className="no-underline">
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-400 hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
                    <h3 className="text-base font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{path.title}</h3>
                    <ul className="flex flex-col gap-2 mb-4">
                      {path.items.map((item) => (
                        <li key={item} className="text-xs text-slate-500 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mb-3">
                      <div className="bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2">{pct}% Complete ({completedCount}/{total})</p>
                    </div>
                    <div className="w-full bg-indigo-50 py-2.5 rounded-lg text-indigo-600 font-semibold text-xs text-center group-hover:bg-indigo-100 transition">
                      Continue Path →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Algorithm Topics */}
        <div className="mb-14">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Algorithm Topics</h2>
          {filteredTopics.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <Search size={40} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">No topics found</h3>
              <p className="text-sm text-slate-500">Try a different search term or filter</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredTopics.map((topic) => {
                const completed = isTopicCompleted(topic.id);
                const bookmarked = isBookmarked(topic.id);
                const difficultyColor =
                  topic.difficulty === "Beginner" ? "bg-green-100 text-green-700" :
                  topic.difficulty === "Intermediate" ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700";
                return (
                  <div key={topic.id} className="relative group">
                    <Link href={`/tools/algorithms/${topic.id}`} className="no-underline" onClick={() => addActivity(topic.id, "view")}>
                      <div
                        className={`bg-white rounded-2xl p-6 border-2 h-full flex flex-col cursor-pointer transition-all duration-300 ${
                          hoveredCard === topic.id
                            ? "border-indigo-500 shadow-xl shadow-indigo-500/20 -translate-y-2"
                            : "border-slate-200 shadow-sm hover:shadow-lg"
                        }`}
                        onMouseEnter={() => setHoveredCard(topic.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-3xl">{topic.icon}</span>
                          {completed && (
                            <span className="bg-green-100 text-green-600 rounded-full p-1">
                              <CheckCircle size={14} />
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-2">{topic.label}</h3>
                        <p className="text-xs text-slate-500 mb-4 flex-1">{topic.desc}</p>
                        <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                          <span className={`text-[10px] px-2 py-1 rounded-md font-semibold uppercase ${difficultyColor}`}>
                            {topic.difficulty}
                          </span>
                          <span className="text-[11px] text-slate-400">{topic.algorithms} algorithms</span>
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => { e.preventDefault(); toggleBookmark(topic.id); }}
                      className={`absolute top-3 right-3 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                        bookmarked ? "bg-amber-100 text-amber-600 opacity-100" : "bg-white/80 text-slate-400 hover:bg-amber-50 hover:text-amber-500"
                      }`}
                    >
                      <Bookmark size={14} fill={bookmarked ? "currentColor" : "none"} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Resources */}
        <div className="mb-10">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Quick Resources</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {RESOURCES.map((resource) => (
              <Link key={resource.title} href={resource.href} className="no-underline">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col shadow-sm hover:shadow-lg hover:border-indigo-400 hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
                  <div className="text-3xl mb-3">{resource.icon}</div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{resource.title}</h3>
                  <p className="text-xs text-slate-500 mb-4 flex-1">{resource.desc}</p>
                  <div className="w-full bg-indigo-50 py-2.5 rounded-lg text-indigo-600 font-semibold text-xs text-center group-hover:bg-indigo-100 transition flex items-center justify-center gap-2">
                    Explore <ArrowRight size={14} />
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
