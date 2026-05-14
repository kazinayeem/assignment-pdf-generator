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
    <div className="bg-white">
      <div className="relative bg-gradient-to-r from-slate-900 via-cyan-900 to-slate-900 px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-black text-white mb-4">Computer Networking</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Master networking concepts, protocols, TCP/IP stack, and internet fundamentals
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <button className="px-8 py-3 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition">
              Start Learning
            </button>
            <button className="px-8 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition">
              View Roadmap
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
          <div className="text-3xl font-black text-cyan-600">9</div>
          <div className="text-sm text-slate-600">Core Topics</div>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
          <div className="text-3xl font-black text-cyan-600">3</div>
          <div className="text-sm text-slate-600">Categories</div>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
          <div className="text-3xl font-black text-cyan-600">1</div>
          <div className="text-sm text-slate-600">Interactive Tool</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {networkTopics.map((category) => (
          <div key={category.category} className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{category.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.topics.map((topic) => (
                <Link key={topic.href} href={topic.href}>
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg hover:shadow-lg hover:-translate-y-1 transition cursor-pointer">
                    <div className="text-3xl mb-2">{topic.icon}</div>
                    <h3 className="font-semibold text-slate-900 text-sm">{topic.name}</h3>
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
