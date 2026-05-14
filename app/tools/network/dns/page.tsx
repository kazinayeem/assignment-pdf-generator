"use client";

import Link from "next/link";
import { ChevronRight, Search, Globe, Server, Activity } from "lucide-react";

export default function DNSPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/network" className="hover:text-gray-700 transition-colors">Networks</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">DNS</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">DNS — Domain Name System</h1>
              <p className="text-gray-500 text-sm mt-1">The phonebook of the internet — translates domain names to IP addresses.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-500 mb-4">DNS Resolution Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              { step: 1, label: "Browser Cache", icon: Search, desc: "Check local cache first" },
              { step: 2, label: "OS Resolver", icon: Activity, desc: "Query OS DNS cache" },
              { step: 3, label: "Recursive Resolver", icon: Server, desc: "ISP/Public DNS server" },
              { step: 4, label: "Root/TLD/Authoritative", icon: Globe, desc: "Walk DNS hierarchy" },
              { step: 5, label: "Return IP", icon: Search, desc: "IP address resolved" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                  <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black">{s.step}</div>
                  <Icon className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                  <p className="text-sm font-bold text-blue-800">{s.label}</p>
                  <p className="text-[10px] text-blue-600 mt-1">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-500 mb-4">DNS Record Types</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Record", "Purpose", "Example"].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-[10px] font-black uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["A", "Maps domain to IPv4 address", "142.250.80.46"],
                  ["AAAA", "Maps domain to IPv6 address", "2607:f8b0::..."],
                  ["CNAME", "Canonical name — domain alias", "www → example.com"],
                  ["MX", "Mail exchange — email server", "mail.google.com"],
                  ["NS", "Name server — DNS authority", "ns1.google.com"],
                  ["TXT", "Text records (SPF, DKIM, verification)", "v=spf1 include:_spf..."],
                  ["SOA", "Start of Authority — zone info", "Primary NS, admin email"],
                ].map(([record, purpose, example]) => (
                  <tr key={record} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-3 font-black text-blue-600 font-mono text-xs">{record}</td>
                    <td className="py-2.5 px-3 text-gray-700 text-xs">{purpose}</td>
                    <td className="py-2.5 px-3 text-gray-400 text-xs font-mono">{example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-500 mb-4">Common DNS Concepts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "TTL (Time To Live)", desc: "How long a DNS record is cached before refreshing. Lower TTL = faster updates but more queries." },
              { title: "Recursive vs Iterative", desc: "Recursive resolver handles the full lookup chain. Iterative queries go step by step through the hierarchy." },
              { title: "DNS Caching", desc: "Browsers, OS, and ISPs cache DNS results to speed up repeat queries and reduce network load." },
              { title: "DNS Security (DNSSEC)", desc: "Adds cryptographic signatures to DNS records to prevent spoofing and cache poisoning attacks." },
            ].map((c) => (
              <div key={c.title} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm font-bold text-gray-800 mb-1">{c.title}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
