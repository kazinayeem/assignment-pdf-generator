"use client";

import Link from "next/link";
import { ChevronRight, Wifi, Cable, Satellite, Radio } from "lucide-react";

export default function NetworkBasicsPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/network" className="hover:text-gray-700 transition-colors">Networks</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">Network Basics</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h1 className="text-2xl font-black text-gray-900">🌐 Network Basics</h1>
          <p className="text-gray-500 text-sm mt-1">Introduction to computer networking concepts, components, and types of networks.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: "PAN (Personal Area Network)", icon: Radio, desc: "Connects devices within 10m range — Bluetooth, USB.", bg: "bg-blue-50", border: "border-blue-100", iconColor: "text-blue-600" },
            { title: "LAN (Local Area Network)", icon: Wifi, desc: "Connects devices in a building or office — Ethernet, WiFi.", bg: "bg-emerald-50", border: "border-emerald-100", iconColor: "text-emerald-600" },
            { title: "MAN (Metropolitan Area Network)", icon: Satellite, desc: "Spans a city — cable TV networks, municipal WiFi.", bg: "bg-violet-50", border: "border-violet-100", iconColor: "text-violet-600" },
            { title: "WAN (Wide Area Network)", icon: Cable, desc: "Connects across continents — the Internet is the largest WAN.", bg: "bg-orange-50", border: "border-orange-100", iconColor: "text-orange-600" },
          ].map((n) => {
            const Icon = n.icon;
            return (
              <div key={n.title} className={`p-5 ${n.bg} rounded-xl border ${n.border}`}>
                <Icon className={`w-8 h-8 ${n.iconColor} mb-3`} />
                <h3 className="font-bold text-gray-900 mb-1">{n.title}</h3>
                <p className="text-sm text-gray-600">{n.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-500 mb-4">Key Network Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { term: "Routers", def: "Forward data between different networks. Connect LAN to WAN." },
              { term: "Switches", def: "Connect devices within the same network. Use MAC addresses." },
              { term: "Access Points", def: "Provide wireless connectivity to wired networks." },
            ].map((c) => (
              <div key={c.term} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="font-bold text-gray-800 text-sm mb-1">{c.term}</p>
                <p className="text-xs text-gray-600">{c.def}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-500 mb-4">Network Topologies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["Bus", "Star", "Ring", "Mesh"].map((t) => (
              <div key={t} className="p-4 bg-cyan-50 rounded-xl border border-cyan-100 text-center">
                <p className="font-black text-cyan-700 text-sm">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
