"use client";

import Link from "next/link";

const osTopics = [
  {
    category: "Process Management",
    topics: [
      { name: "Process Management", href: "/tools/os/process-management", icon: "⚙️", sim: true },
      { name: "CPU Scheduling", href: "/tools/os/cpu-scheduling", icon: "🎯", sim: true },
      { name: "Process Scheduling", href: "/tools/os/process-scheduling", icon: "⏱️" },
      { name: "Deadlock Detection", href: "/tools/os/deadlock", icon: "🚫", sim: true },
    ],
  },
  {
    category: "Memory Management",
    topics: [
      { name: "Memory Management", href: "/tools/os/memory-management", icon: "📦", sim: true },
      { name: "Disk Scheduling", href: "/tools/os/disk-scheduling", icon: "💿", sim: true },
    ],
  },
  {
    category: "Resource Allocation",
    topics: [
      { name: "Banker's Algorithm", href: "/tools/os/bankers-algorithm", icon: "🏦", sim: true },
    ],
  },
];

export default function OSPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3">Operating Systems</h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Master OS concepts, process scheduling, memory management, and file systems for interviews
          </p>
          <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4 justify-center flex-wrap">
            <Link href="/tools/os/process-management">
              <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-lg font-semibold text-xs sm:text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20">
                Start Learning
              </button>
            </Link>
            <Link href="/tools/os/cpu-scheduling">
              <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-slate-700/80 text-white rounded-lg font-semibold text-xs sm:text-sm hover:bg-slate-600 transition border border-slate-600">
                View Roadmap
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-3 gap-3 sm:gap-4">
        <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <div className="text-2xl sm:text-3xl font-black text-indigo-600">6</div>
          <div className="text-[10px] sm:text-sm text-slate-500 mt-0.5">Interactive Simulators</div>
        </div>
        <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <div className="text-2xl sm:text-3xl font-black text-indigo-600">50+</div>
          <div className="text-[10px] sm:text-sm text-slate-500 mt-0.5">Interview Questions</div>
        </div>
        <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <div className="text-2xl sm:text-3xl font-black text-indigo-600">3</div>
          <div className="text-[10px] sm:text-sm text-slate-500 mt-0.5">Core Categories</div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        {osTopics.map((category) => (
          <div key={category.category} className="mb-8 sm:mb-12">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">{category.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {category.topics.map((topic) => (
                <Link key={topic.href} href={topic.href}>
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
                    <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2">{topic.icon}</div>
                    <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">{topic.name}</h3>
                    {(topic as any).sim && (
                      <span className="inline-block mt-1.5 sm:mt-2 text-[9px] sm:text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        Interactive Simulator
                      </span>
                    )}
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
