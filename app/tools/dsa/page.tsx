"use client";

import Link from "next/link";

const dsaTopics = [
  {
    category: "Linear Data Structures",
    topics: [
      { name: "Arrays", href: "/tools/dsa/arrays", icon: "📊" },
      { name: "Linked List", href: "/tools/dsa/linked-list", icon: "🔗" },
      { name: "Stack", href: "/tools/dsa/stack", icon: "📚" },
      { name: "Queue", href: "/tools/dsa/queue", icon: "📋" },
    ],
  },
  {
    category: "Non-Linear & Algorithms",
    topics: [
      { name: "Tree", href: "/tools/dsa/tree", icon: "🌳" },
      { name: "Searching", href: "/tools/dsa/searching", icon: "🔍" },
      { name: "Sorting", href: "/tools/dsa/sorting", icon: "📊" },
    ],
  },
];

export default function DSAPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="relative bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-900 px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3">Data Structures & Algorithms</h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Master essential DSA concepts for interviews and competitive programming
          </p>
          <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4 justify-center flex-wrap">
            <Link href="/tools/dsa/arrays">
              <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-emerald-600 text-white rounded-lg font-semibold text-xs sm:text-sm hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20">
                Start Learning
              </button>
            </Link>
            <Link href="/tools/dsa/sorting">
              <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-slate-700/80 text-white rounded-lg font-semibold text-xs sm:text-sm hover:bg-slate-600 transition border border-slate-600">
                View Roadmap
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-3 gap-3 sm:gap-4">
        <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">7</div>
          <div className="text-[10px] sm:text-sm text-slate-500 mt-0.5">Core Topics</div>
        </div>
        <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">100+</div>
          <div className="text-[10px] sm:text-sm text-slate-500 mt-0.5">Practice Problems</div>
        </div>
        <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">2</div>
          <div className="text-[10px] sm:text-sm text-slate-500 mt-0.5">Categories</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        {dsaTopics.map((category) => (
          <div key={category.category} className="mb-8 sm:mb-12">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">{category.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {category.topics.map((topic) => (
                <Link key={topic.href} href={topic.href}>
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
                    <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2">{topic.icon}</div>
                    <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">{topic.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
