"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Calculator, Copy, CheckCircle2 } from "lucide-react";

function ipToInt(ip: string): number {
  return ip.split(".").reduce((acc, oct) => (acc << 8) + parseInt(oct), 0) >>> 0;
}

function intToIp(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}

function calcSubnet(ip: string, prefix: number) {
  const ipInt = ipToInt(ip);
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const network = (ipInt & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const firstHost = prefix < 31 ? (network + 1) >>> 0 : network;
  const lastHost = prefix < 31 ? (broadcast - 1) >>> 0 : broadcast;
  const hosts = prefix >= 31 ? Math.pow(2, 32 - prefix) : Math.pow(2, 32 - prefix) - 2;

  return {
    networkAddr: intToIp(network),
    broadcastAddr: intToIp(broadcast),
    subnetMask: intToIp(mask),
    firstHost: intToIp(firstHost),
    lastHost: intToIp(lastHost),
    totalHosts: Math.pow(2, 32 - prefix),
    usableHosts: Math.max(0, hosts),
    prefix,
    wildcardMask: intToIp(~mask >>> 0),
    ipClass: ipInt >= ipToInt("224.0.0.0") ? "D/E" : ipInt >= ipToInt("192.0.0.0") ? "C" : ipInt >= ipToInt("128.0.0.0") ? "B" : "A",
    isPrivate: (
      (ipInt >= ipToInt("10.0.0.0") && ipInt <= ipToInt("10.255.255.255")) ||
      (ipInt >= ipToInt("172.16.0.0") && ipInt <= ipToInt("172.31.255.255")) ||
      (ipInt >= ipToInt("192.168.0.0") && ipInt <= ipToInt("192.168.255.255"))
    ),
  };
}

function isValidIP(ip: string): boolean {
  const parts = ip.split(".");
  if (parts.length !== 4) return false;
  return parts.every((p) => { const n = parseInt(p); return !isNaN(n) && n >= 0 && n <= 255 && p === String(n); });
}

export default function SubnetCalculatorPage() {
  const [ip, setIp] = useState("192.168.1.100");
  const [prefix, setPrefix] = useState(24);
  const [result, setResult] = useState<ReturnType<typeof calcSubnet> | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const calculate = () => {
    if (!isValidIP(ip)) { setError("Invalid IP address format."); setResult(null); return; }
    setError("");
    setResult(calcSubnet(ip, prefix));
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  const COMMON_PREFIXES = [
    { prefix: 8,  hosts: "16,777,214", class: "A" },
    { prefix: 16, hosts: "65,534",     class: "B" },
    { prefix: 24, hosts: "254",        class: "C" },
    { prefix: 25, hosts: "126",        class: "" },
    { prefix: 26, hosts: "62",         class: "" },
    { prefix: 27, hosts: "30",         class: "" },
    { prefix: 28, hosts: "14",         class: "" },
    { prefix: 29, hosts: "6",          class: "" },
    { prefix: 30, hosts: "2",          class: "" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/network" className="hover:text-gray-700 transition-colors">Networks</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/tools/network/simulations/subnet-calculator" className="text-gray-700 font-semibold">Subnet Calculator</Link>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Subnet Calculator</h1>
              <p className="text-gray-500 text-sm">Calculate network address, broadcast, host range and more.</p>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-500 mb-4">Enter IP Address & Prefix</h2>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[180px]">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5 block">IP Address</label>
              <input
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="192.168.1.100"
                className="w-full h-11 px-4 text-sm font-mono rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>
            <div className="w-32">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5 block">Prefix / CIDR</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-bold">/</span>
                <input
                  type="number" min={0} max={32}
                  value={prefix}
                  onChange={(e) => setPrefix(Math.min(32, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="flex-1 h-11 px-3 text-sm font-mono rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
            </div>
            <button
              onClick={calculate}
              className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm"
            >
              Calculate
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>}

          {/* Quick prefix buttons */}
          <div className="mt-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Quick Select</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_PREFIXES.map((p) => (
                <button key={p.prefix} onClick={() => setPrefix(p.prefix)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${prefix === p.prefix ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}>
                  /{p.prefix} {p.class && `(Class ${p.class})`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-500 mb-4">Results for {ip}/{prefix}</h2>

            {/* Key info cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Network Address", value: result.networkAddr, key: "net" },
                { label: "Broadcast Address", value: result.broadcastAddr, key: "bcast" },
                { label: "Subnet Mask", value: result.subnetMask, key: "mask" },
                { label: "Wildcard Mask", value: result.wildcardMask, key: "wild" },
              ].map((item) => (
                <div key={item.key} className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-[9px] font-black uppercase tracking-wider text-blue-400 mb-1">{item.label}</p>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-sm font-black text-blue-700 font-mono">{item.value}</p>
                    <button onClick={() => copy(item.value, item.key)} className="text-blue-400 hover:text-blue-600 transition-colors">
                      {copied === item.key ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ["IP Address", ip, ""],
                    ["Network Address", result.networkAddr, "First address in subnet"],
                    ["Broadcast Address", result.broadcastAddr, "Last address in subnet"],
                    ["First Usable Host", result.firstHost, "First assignable IP"],
                    ["Last Usable Host", result.lastHost, "Last assignable IP"],
                    ["Subnet Mask", result.subnetMask, `/${prefix} CIDR notation`],
                    ["Total Addresses", result.totalHosts.toLocaleString(), "Including network & broadcast"],
                    ["Usable Hosts", result.usableHosts.toLocaleString(), "Assignable to devices"],
                    ["IP Class", `Class ${result.ipClass}`, ""],
                    ["Private IP", result.isPrivate ? "Yes (RFC 1918)" : "No (Public)", ""],
                  ].map(([label, value, note]) => (
                    <tr key={label} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-gray-600 w-44">{label}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-gray-900">{value}</td>
                      <td className="py-2.5 px-3 text-xs text-gray-400">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Visual range */}
            <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-3">IP Range Visualization</p>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2 py-1 bg-gray-200 rounded text-gray-600">{result.networkAddr}</span>
                <span className="text-gray-400">→</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-bold">{result.firstHost}</span>
                <span className="text-gray-400">···</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-bold">{result.lastHost}</span>
                <span className="text-gray-400">→</span>
                <span className="px-2 py-1 bg-gray-200 rounded text-gray-600">{result.broadcastAddr}</span>
              </div>
              <div className="flex gap-3 mt-2 text-[10px] text-gray-400">
                <span>■ Network</span>
                <span className="text-blue-500">■ Usable hosts ({result.usableHosts.toLocaleString()})</span>
                <span>■ Broadcast</span>
              </div>
            </div>
          </div>
        )}

        {/* Reference table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-500 mb-4">Common Subnet Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["CIDR", "Subnet Mask", "Hosts", "Subnets of /24"].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-[10px] font-black uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["/24", "255.255.255.0",   "254",  "1"],
                  ["/25", "255.255.255.128",  "126",  "2"],
                  ["/26", "255.255.255.192",  "62",   "4"],
                  ["/27", "255.255.255.224",  "30",   "8"],
                  ["/28", "255.255.255.240",  "14",   "16"],
                  ["/29", "255.255.255.248",  "6",    "32"],
                  ["/30", "255.255.255.252",  "2",    "64"],
                ].map(([cidr, mask, hosts, subnets]) => (
                  <tr key={cidr} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-3 font-black text-blue-600 font-mono">{cidr}</td>
                    <td className="py-2.5 px-3 font-mono text-gray-700">{mask}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">{hosts}</td>
                    <td className="py-2.5 px-3 text-gray-500">{subnets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
