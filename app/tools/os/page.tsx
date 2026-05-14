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
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-black text-white mb-4">Operating Systems</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Master OS concepts, process scheduling, memory management, and file systems for interviews
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <button className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
              Start Learning
            </button>
            <button className="px-8 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition">
              View Roadmap
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
          <div className="text-3xl font-black text-indigo-600">6</div>
          <div className="text-sm text-slate-600">Interactive Simulators</div>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
          <div className="text-3xl font-black text-indigo-600">50+</div>
          <div className="text-sm text-slate-600">Interview Questions</div>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
          <div className="text-3xl font-black text-indigo-600">3</div>
          <div className="text-sm text-slate-600">Core Categories</div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {osTopics.map((category) => (
          <div key={category.category} className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{category.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {category.topics.map((topic) => (
                <Link key={topic.href} href={topic.href}>
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg hover:shadow-lg hover:-translate-y-1 transition cursor-pointer">
                    <div className="text-3xl mb-2">{topic.icon}</div>
                    <h3 className="font-semibold text-slate-900 text-sm">{topic.name}</h3>
                    {(topic as any).sim && (
                      <span className="inline-block mt-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
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
