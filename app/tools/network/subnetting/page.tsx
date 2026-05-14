import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata: Metadata = { title: "Subnetting | Computer Networks" };

export default function SubnettingPage() {
  const steps = [
    { step: "1", title: "Determine the IP class", desc: "Identify if the IP is Class A, B, or C to know the default subnet mask." },
    { step: "2", title: "Determine subnets needed", desc: "Calculate how many subnets are required. Use formula: 2^n ≥ subnets needed (n = borrowed bits)." },
    { step: "3", title: "Borrow bits from host portion", desc: "Borrow bits from the host part to create subnet bits. Each borrowed bit doubles the number of subnets." },
    { step: "4", title: "Calculate new subnet mask", desc: "Add borrowed bits to the default mask. E.g., /24 + 2 bits = /26 (255.255.255.192)." },
    { step: "5", title: "Calculate hosts per subnet", desc: "Hosts = 2^(remaining host bits) - 2 (subtract network and broadcast addresses)." },
    { step: "6", title: "List subnet ranges", desc: "Block size = 256 - last octet of mask. Subnets start at multiples of block size." },
  ];

  const example = {
    ip: "192.168.10.0/24",
    requirement: "4 subnets needed",
    borrowed: 2,
    newPrefix: 26,
    newMask: "255.255.255.192",
    blockSize: 64,
    subnets: [
      { net: "192.168.10.0",   first: "192.168.10.1",   last: "192.168.10.62",  bcast: "192.168.10.63" },
      { net: "192.168.10.64",  first: "192.168.10.65",  last: "192.168.10.126", bcast: "192.168.10.127" },
      { net: "192.168.10.128", first: "192.168.10.129", last: "192.168.10.190", bcast: "192.168.10.191" },
      { net: "192.168.10.192", first: "192.168.10.193", last: "192.168.10.254", bcast: "192.168.10.255" },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto space-y-8">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Subnetting</h1>
          <p className="text-gray-500 mt-2 leading-relaxed max-w-2xl">
            Subnetting divides a large network into smaller sub-networks (subnets). It improves security, reduces broadcast traffic, and makes efficient use of IP addresses.
          </p>
          <div className="mt-4 flex gap-3">
            <Link href="/tools/network/simulations/subnet-calculator"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
              Open Subnet Calculator →
            </Link>
          </div>
        </div>

        {/* Key formulas */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">Key Formulas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { formula: "2ⁿ", label: "Number of Subnets", note: "n = borrowed bits" },
              { formula: "2ʰ - 2", label: "Usable Hosts/Subnet", note: "h = remaining host bits" },
              { formula: "256 - mask", label: "Block Size", note: "mask = last non-255 octet" },
            ].map((f) => (
              <div key={f.label} className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                <p className="text-3xl font-black text-blue-600 mb-1">{f.formula}</p>
                <p className="text-sm font-bold text-gray-800">{f.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{f.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-step */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-black text-gray-900 mb-5">Step-by-Step Subnetting Process</h2>
          <div className="space-y-4">
            {steps.map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-black shrink-0">{s.step}</div>
                <div className="flex-1 pb-4 border-b border-gray-50">
                  <p className="font-bold text-gray-900">{s.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Worked example */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-black text-gray-900 mb-2">Worked Example</h2>
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 mb-5">
            <p className="text-sm font-bold text-emerald-700">Given: {example.ip} — {example.requirement}</p>
            <div className="mt-2 space-y-1 text-xs text-emerald-600">
              <p>• Borrow {example.borrowed} bits → 2² = 4 subnets ✓</p>
              <p>• New prefix: /{example.newPrefix} | New mask: {example.newMask}</p>
              <p>• Block size: 256 - 192 = {example.blockSize}</p>
              <p>• Hosts per subnet: 2⁶ - 2 = 62 usable hosts</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Subnet", "Network Address", "First Host", "Last Host", "Broadcast"].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-[10px] font-black uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {example.subnets.map((s, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-blue-600">Subnet {i+1}</td>
                    <td className="py-2.5 px-3 font-mono text-xs text-gray-700">{s.net}</td>
                    <td className="py-2.5 px-3 font-mono text-xs text-emerald-600">{s.first}</td>
                    <td className="py-2.5 px-3 font-mono text-xs text-emerald-600">{s.last}</td>
                    <td className="py-2.5 px-3 font-mono text-xs text-orange-600">{s.bcast}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CIDR table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">CIDR Quick Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["CIDR", "Subnet Mask", "Hosts", "Block Size"].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-[10px] font-black uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["/8",  "255.0.0.0",       "16,777,214", "—"],
                  ["/16", "255.255.0.0",      "65,534",     "—"],
                  ["/24", "255.255.255.0",    "254",        "256"],
                  ["/25", "255.255.255.128",  "126",        "128"],
                  ["/26", "255.255.255.192",  "62",         "64"],
                  ["/27", "255.255.255.224",  "30",         "32"],
                  ["/28", "255.255.255.240",  "14",         "16"],
                  ["/29", "255.255.255.248",  "6",          "8"],
                  ["/30", "255.255.255.252",  "2",          "4"],
                ].map(([cidr, mask, hosts, block]) => (
                  <tr key={cidr} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-3 font-black text-blue-600 font-mono">{cidr}</td>
                    <td className="py-2.5 px-3 font-mono text-xs text-gray-700">{mask}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">{hosts}</td>
                    <td className="py-2.5 px-3 text-gray-500">{block}</td>
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
              { q: "Why do we subtract 2 from usable hosts?", a: "One address is the network address (all host bits = 0) and one is the broadcast address (all host bits = 1). Neither can be assigned to a host." },
              { q: "What is VLSM?", a: "Variable Length Subnet Masking — allows different subnets to have different sizes, making more efficient use of IP address space." },
              { q: "What is CIDR?", a: "Classless Inter-Domain Routing — uses prefix notation (/n) instead of class-based masks, allowing flexible allocation of IP addresses." },
              { q: "How many subnets does /26 create from a /24?", a: "4 subnets (2 borrowed bits = 2² = 4), each with 62 usable hosts." },
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
          <Link href="/tools/network/ip-addressing" className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-gray-900">← IP Addressing</Link>
          <Link href="/tools/network/routing" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
            Next: Routing <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
