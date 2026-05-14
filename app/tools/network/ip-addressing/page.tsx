import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata: Metadata = { title: "IP Addressing | Computer Networks" };

const IP_CLASSES = [
  { cls: "A", range: "1.0.0.0 – 126.255.255.255", default: "255.0.0.0",    hosts: "16,777,214", bits: "8 net / 24 host",  use: "Large networks (ISPs, enterprises)" },
  { cls: "B", range: "128.0.0.0 – 191.255.255.255", default: "255.255.0.0", hosts: "65,534",     bits: "16 net / 16 host", use: "Medium networks (universities)" },
  { cls: "C", range: "192.0.0.0 – 223.255.255.255", default: "255.255.255.0", hosts: "254",      bits: "24 net / 8 host",  use: "Small networks (homes, offices)" },
  { cls: "D", range: "224.0.0.0 – 239.255.255.255", default: "N/A",          hosts: "N/A",       bits: "Multicast",        use: "Multicast groups" },
  { cls: "E", range: "240.0.0.0 – 255.255.255.255", default: "N/A",          hosts: "N/A",       bits: "Reserved",         use: "Research/experimental" },
];

const PRIVATE_RANGES = [
  { cls: "A", range: "10.0.0.0 – 10.255.255.255",     cidr: "10.0.0.0/8",     hosts: "16,777,216" },
  { cls: "B", range: "172.16.0.0 – 172.31.255.255",   cidr: "172.16.0.0/12",  hosts: "1,048,576" },
  { cls: "C", range: "192.168.0.0 – 192.168.255.255", cidr: "192.168.0.0/16", hosts: "65,536" },
];

export default function IPAddressingPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto space-y-8">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">IP Addressing</h1>
          <p className="text-gray-500 mt-2 leading-relaxed max-w-2xl">
            IP (Internet Protocol) addresses are unique numerical identifiers assigned to every device on a network. IPv4 uses 32-bit addresses; IPv6 uses 128-bit addresses.
          </p>
        </div>

        {/* IPv4 structure */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">IPv4 Address Structure</h2>
          <div className="p-4 bg-violet-50 rounded-xl border border-violet-100 mb-4">
            <p className="text-xs font-black text-violet-500 uppercase tracking-wider mb-2">Example: 192.168.1.100</p>
            <div className="flex gap-1 flex-wrap">
              {["192", "168", "1", "100"].map((oct, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="px-4 py-3 bg-violet-600 text-white font-black text-lg rounded-xl">{oct}</div>
                  <p className="text-[9px] text-violet-400 mt-1">Octet {i+1}</p>
                  <p className="text-[9px] text-violet-300">{parseInt(oct).toString(2).padStart(8,"0")}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-violet-600 mt-3">32 bits total = 4 octets × 8 bits each</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { type: "Network Address", desc: "Identifies the network. All host bits = 0.", example: "192.168.1.0", color: "blue" },
              { type: "Host Address",    desc: "Identifies a specific device on the network.", example: "192.168.1.100", color: "emerald" },
              { type: "Broadcast",       desc: "Sends to all hosts on the network. All host bits = 1.", example: "192.168.1.255", color: "orange" },
            ].map((t) => (
              <div key={t.type} className={`p-4 bg-${t.color}-50 rounded-xl border border-${t.color}-100`}>
                <p className={`font-black text-${t.color}-700 text-sm mb-1`}>{t.type}</p>
                <p className="text-xs text-gray-600 mb-2">{t.desc}</p>
                <code className={`text-xs font-mono font-bold text-${t.color}-600`}>{t.example}</code>
              </div>
            ))}
          </div>
        </div>

        {/* IP Classes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">IPv4 Address Classes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Class", "Range", "Default Mask", "Usable Hosts", "Network/Host Bits", "Use Case"].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-[10px] font-black uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {IP_CLASSES.map((c) => (
                  <tr key={c.cls} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-3"><span className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 font-black text-sm flex items-center justify-center">{c.cls}</span></td>
                    <td className="py-2.5 px-3 font-mono text-xs text-gray-700">{c.range}</td>
                    <td className="py-2.5 px-3 font-mono text-xs text-blue-600">{c.default}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">{c.hosts}</td>
                    <td className="py-2.5 px-3 text-xs text-gray-500">{c.bits}</td>
                    <td className="py-2.5 px-3 text-xs text-gray-500">{c.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Private IP ranges */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-black text-gray-900 mb-2">Private IP Ranges (RFC 1918)</h2>
          <p className="text-sm text-gray-500 mb-4">These ranges are reserved for private networks and are not routable on the public internet.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PRIVATE_RANGES.map((r) => (
              <div key={r.cls} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">Class {r.cls}</p>
                <p className="font-mono text-sm font-bold text-gray-800">{r.cidr}</p>
                <p className="text-xs text-gray-500 mt-1">{r.range}</p>
                <p className="text-xs font-bold text-blue-600 mt-1">{r.hosts} addresses</p>
              </div>
            ))}
          </div>
        </div>

        {/* IPv4 vs IPv6 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">IPv4 vs IPv6</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Feature</th>
                  <th className="text-left py-2 px-3 text-[10px] font-black uppercase tracking-wider text-blue-400">IPv4</th>
                  <th className="text-left py-2 px-3 text-[10px] font-black uppercase tracking-wider text-violet-400">IPv6</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Address length", "32 bits", "128 bits"],
                  ["Format", "Dotted decimal (192.168.1.1)", "Hexadecimal (2001:db8::1)"],
                  ["Total addresses", "~4.3 billion", "~340 undecillion"],
                  ["Header size", "20–60 bytes", "40 bytes (fixed)"],
                  ["NAT required", "Yes (address exhaustion)", "No (enough addresses)"],
                  ["Security", "Optional (IPSec)", "Built-in IPSec"],
                  ["Broadcast", "Yes", "No (uses multicast)"],
                  ["Auto-configuration", "DHCP required", "SLAAC (stateless)"],
                ].map(([f, v4, v6]) => (
                  <tr key={f} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-gray-700">{f}</td>
                    <td className="py-2.5 px-3 text-blue-600 font-medium text-xs">{v4}</td>
                    <td className="py-2.5 px-3 text-violet-600 font-medium text-xs">{v6}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Viva */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" /> Interview Questions
          </h2>
          <div className="space-y-3">
            {[
              { q: "What is the difference between public and private IP?", a: "Public IPs are globally unique and routable on the internet. Private IPs (RFC 1918) are used within local networks and require NAT to access the internet." },
              { q: "What is a loopback address?", a: "127.0.0.1 (IPv4) or ::1 (IPv6) — used to test the network stack on the local machine without sending packets over the network." },
              { q: "Why is IPv6 needed?", a: "IPv4 has only ~4.3 billion addresses, which are exhausted. IPv6 provides 340 undecillion addresses to support the growing internet." },
              { q: "What is APIPA?", a: "Automatic Private IP Addressing (169.254.0.0/16) — assigned when a DHCP server is unavailable." },
            ].map((qa, i) => (
              <div key={i} className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                <p className="text-sm font-bold text-gray-800 mb-1">Q: {qa.q}</p>
                <p className="text-sm text-orange-700 flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" /> {qa.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Link href="/tools/network/tcp-ip" className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-gray-900">← TCP/IP Model</Link>
          <Link href="/tools/network/subnetting" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
            Next: Subnetting <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
