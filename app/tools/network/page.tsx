"use client";

import Link from "next/link";

const networkTopics = [
  {
    category: "Networking Basics",
    topics: [
      { name: "Network Basics", href: "/tools/network/basics", icon: "🌐" },
      { name: "OSI Model", href: "/tools/network/osi-model", icon: "📊" },
      { name: "TCP/IP Model", href: "/tools/network/tcp-ip", icon: "📡" },
      { name: "IP Addressing", href: "/tools/network/ip-addressing", icon: "📍" },
    ],
  },
  {
    category: "Protocols & Transport",
    topics: [
      { name: "TCP vs UDP", href: "/tools/network/tcp-udp", icon: "🚀" },
      { name: "DNS", href: "/tools/network/dns", icon: "🔤" },
      { name: "HTTP/HTTPS", href: "/tools/network/http", icon: "📲" },
    ],
  },
  {
    category: "Network Tools",
    topics: [
      { name: "Subnetting", href: "/tools/network/subnetting", icon: "✂️" },
      { name: "Subnet Calculator", href: "/tools/network/simulations/subnet-calculator", icon: "🧮" },
    ],
  },
];

export default function NetworkPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="relative bg-gradient-to-r from-slate-900 via-cyan-900 to-slate-900 px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3">Computer Networking</h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Master networking concepts, protocols, TCP/IP stack, and internet fundamentals
          </p>
          <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4 justify-center flex-wrap">
            <Link href="/tools/network/basics">
              <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-cyan-600 text-white rounded-lg font-semibold text-xs sm:text-sm hover:bg-cyan-700 transition shadow-lg shadow-cyan-600/20">
                Start Learning
              </button>
            </Link>
            <Link href="/tools/network/osi-model">
              <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-slate-700/80 text-white rounded-lg font-semibold text-xs sm:text-sm hover:bg-slate-600 transition border border-slate-600">
                View Roadmap
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-3 gap-3 sm:gap-4">
        <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <div className="text-2xl sm:text-3xl font-black text-cyan-600">9</div>
          <div className="text-[10px] sm:text-sm text-slate-500 mt-0.5">Core Topics</div>
        </div>
        <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <div className="text-2xl sm:text-3xl font-black text-cyan-600">3</div>
          <div className="text-[10px] sm:text-sm text-slate-500 mt-0.5">Categories</div>
        </div>
        <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <div className="text-2xl sm:text-3xl font-black text-cyan-600">1</div>
          <div className="text-[10px] sm:text-sm text-slate-500 mt-0.5">Interactive Tool</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        {networkTopics.map((category) => (
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
