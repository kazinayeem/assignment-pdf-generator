"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Shield,
  ShieldOff,
  Server,
  Network,
  Globe,
  Lock,
  Eye,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  BookOpen,
  Sliders,
} from "lucide-react";

type Protocol = "TCP" | "UDP" | "ICMP";

interface Rule {
  id: number;
  sourceIp: string;
  destIp: string;
  protocol: Protocol | "Any";
  port: string;
  action: "ALLOW" | "BLOCK";
  label: string;
  enabled: boolean;
}

interface Packet {
  sourceIp: string;
  destIp: string;
  protocol: Protocol;
  port: number;
}

interface PacketResult {
  packet: Packet;
  action: "ALLOWED" | "BLOCKED";
  matchedRule: Rule | null;
}

const DEFAULT_RULES: Rule[] = [
  { id: 1, sourceIp: "192.168.1.0/24", destIp: "Any", protocol: "Any", port: "Any", action: "ALLOW", label: "Trusted internal network", enabled: true },
  { id: 2, sourceIp: "Any", destIp: "Any", protocol: "Any", port: "Any", action: "ALLOW", label: "Established connections", enabled: true },
  { id: 3, sourceIp: "Any", destIp: "Any", protocol: "TCP", port: "80,443", action: "ALLOW", label: "HTTP/HTTPS outbound", enabled: true },
  { id: 4, sourceIp: "Any", destIp: "Any", protocol: "Any", port: "Any", action: "BLOCK", label: "Default deny all inbound", enabled: true },
  { id: 5, sourceIp: "10.0.0.5", destIp: "Any", protocol: "TCP", port: "22", action: "ALLOW", label: "Admin SSH access", enabled: true },
];

const PROTOCOL_PRESETS = [
  { label: "HTTP", protocol: "TCP" as Protocol, port: 80 },
  { label: "HTTPS", protocol: "TCP" as Protocol, port: 443 },
  { label: "SSH", protocol: "TCP" as Protocol, port: 22 },
  { label: "DNS", protocol: "UDP" as Protocol, port: 53 },
  { label: "Ping", protocol: "ICMP" as Protocol, port: 0 },
];

const FIREWALL_TYPES = [
  {
    title: "Packet Filtering",
    icon: Sliders,
    color: "indigo",
    desc: "Examines packet headers (source/dest IP, port, protocol) and matches against rules. Operates at Layer 3-4.",
    pros: ["Fast and efficient", "Low resource usage", "Simple to configure"],
    cons: ["No application awareness", "Cannot detect fragmented attacks", "No state tracking"],
    example: "ACL on a router allowing HTTP traffic from any source to web server on port 80.",
  },
  {
    title: "Stateful Inspection",
    icon: Eye,
    color: "violet",
    desc: "Tracks connection state (SYN, SYN-ACK, ACK) and only allows packets belonging to established sessions. Layer 4.",
    pros: ["Connection-aware filtering", "Better security than packet filtering", "Prevents SYN flood attacks"],
    cons: ["Higher resource usage", "Vulnerable to state table exhaustion", "No deep packet inspection"],
    example: "A firewall tracking TCP handshake and allowing return traffic for outbound connections only.",
  },
  {
    title: "Proxy Firewall",
    icon: Server,
    color: "cyan",
    desc: "Acts as an intermediary, terminating connections and re-establishing them. Inspects application-layer data. Layer 7.",
    pros: ["Deep packet inspection", "Hides internal network structure", "Content filtering possible"],
    cons: ["Significant latency", "Resource intensive", "Must understand each protocol"],
    example: "An HTTP proxy that inspects GET/POST requests and blocks SQL injection payloads.",
  },
  {
    title: "Next-Gen Firewall (NGFW)",
    icon: Network,
    color: "emerald",
    desc: "Combines traditional firewall with IDS/IPS, deep packet inspection, application awareness, and threat intelligence.",
    pros: ["Application-level control", "Integrated IPS/IDS", "Encrypted traffic inspection"],
    cons: ["Very expensive", "Complex configuration", "Potential throughput bottleneck"],
    example: "Palo Alto or Fortinet firewall blocking TikTok traffic while allowing YouTube, based on application ID.",
  },
];

const BEST_PRACTICES = [
  { title: "Principle of Least Privilege", desc: "Only allow traffic that is explicitly required. Default-deny everything else." },
  { title: "Rule Order Matters", desc: "Place more specific rules at the top. Firewalls evaluate rules sequentially — first match wins." },
  { title: "Log and Monitor", desc: "Enable logging for blocked traffic. Review logs regularly to detect intrusion attempts." },
  { title: "Regular Audits", desc: "Review and clean up unused or overly permissive rules every quarter." },
  { title: "Defense in Depth", desc: "Combine firewalls with IDS/IPS, endpoint protection, and network segmentation." },
];

const INTERVIEW_QS = [
  { q: "What is the difference between a stateless and stateful firewall?", a: "A stateless (packet filtering) firewall examines each packet independently without context of the connection. A stateful firewall tracks connection state (TCP handshake, sequence numbers) and makes decisions based on the entire session context, providing stronger security." },
  { q: "Explain the default-deny principle in firewall rules.", a: "Default-deny means all traffic is blocked unless explicitly allowed by a rule. This ensures only known, authorized traffic passes through, minimizing the attack surface. The last rule in any firewall rule set should be 'deny all'." },
  { q: "What is a DMZ and how does it relate to firewall architecture?", a: "A DMZ (Demilitarized Zone) is a network segment that sits between the internal network and the internet, typically using a three-legged firewall. Public-facing servers (web, email, DNS) are placed in the DMZ so that if compromised, the attacker still cannot reach the internal network directly." },
  { q: "How does a firewall handle fragmented IP packets?", a: "Stateless firewalls may struggle with fragmentation — they see only individual fragments and may allow malicious fragments through. Stateful firewalls can reassemble fragments or block non-initial fragments that don't match a known connection. NGFWs with DPI can fully inspect reassembled packets." },
  { q: "What is an application-layer firewall and when would you use one?", a: "An application-layer (proxy) firewall inspects the payload of packets, not just headers. It understands protocols like HTTP, FTP, SMTP. Use it when you need to filter content (block specific URLs, scan for malware), prevent protocol-specific attacks, or hide internal IP addresses through NAT." },
];

export default function FirewallsPage() {
  const [rules, setRules] = useState<Rule[]>(DEFAULT_RULES);
  const [packet, setPacket] = useState<Packet>({ sourceIp: "10.0.0.5", destIp: "8.8.8.8", protocol: "TCP", port: 22 });
  const [result, setResult] = useState<PacketResult | null>(null);
  const [stats, setStats] = useState({ allowed: 0, blocked: 0 });
  const [showResult, setShowResult] = useState(false);
  const [packetHistory, setPacketHistory] = useState<PacketResult[]>([]);

  const toggleRule = useCallback((id: number) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  }, []);

  const ipInRange = useCallback((ip: string, cidr: string): boolean => {
    if (cidr === "Any") return true;
    if (cidr === ip) return true;
    if (cidr.includes("/")) {
      const [baseIp, bits] = cidr.split("/");
      const mask = ~(2 ** (32 - parseInt(bits)) - 1);
      const ipInt = ip.split(".").reduce((acc, oct) => (acc << 8) + parseInt(oct), 0);
      const baseInt = baseIp.split(".").reduce((acc, oct) => (acc << 8) + parseInt(oct), 0);
      return (ipInt & mask) === (baseInt & mask);
    }
    return false;
  }, []);

  const portMatches = useCallback((packetPort: number, rulePort: string): boolean => {
    if (rulePort === "Any") return true;
    return rulePort.split(",").some(p => {
      if (p.includes("-")) {
        const [lo, hi] = p.split("-").map(Number);
        return packetPort >= lo && packetPort <= hi;
      }
      return parseInt(p) === packetPort;
    });
  }, []);

  const evaluatePacket = useCallback((p: Packet): PacketResult => {
    for (const rule of rules) {
      if (!rule.enabled) continue;
      const srcMatch = ipInRange(p.sourceIp, rule.sourceIp);
      const dstMatch = ipInRange(p.destIp, rule.destIp);
      const protoMatch = rule.protocol === "Any" || rule.protocol === p.protocol;
      const portMatch = portMatches(p.port, rule.port);
      if (srcMatch && dstMatch && protoMatch && portMatch) {
        return { packet: p, action: rule.action === "ALLOW" ? "ALLOWED" : "BLOCKED", matchedRule: rule };
      }
    }
    return { packet: p, action: "BLOCKED", matchedRule: null };
  }, [rules, ipInRange, portMatches]);

  const sendPacket = useCallback(() => {
    const res = evaluatePacket(packet);
    setResult(res);
    setShowResult(true);
    setStats(prev => ({
      allowed: prev.allowed + (res.action === "ALLOWED" ? 1 : 0),
      blocked: prev.blocked + (res.action === "BLOCKED" ? 1 : 0),
    }));
    setPacketHistory(prev => [res, ...prev].slice(0, 20));
  }, [evaluatePacket, packet]);

  const applyPreset = useCallback((preset: typeof PROTOCOL_PRESETS[0]) => {
    setPacket(prev => ({ ...prev, protocol: preset.protocol, port: preset.port }));
  }, []);

  const activeRulesCount = useMemo(() => rules.filter(r => r.enabled).length, [rules]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950">
      <style>{`
        @keyframes glow { 0%,100% { box-shadow: 0 0 5px rgba(99,102,241,0.3); } 50% { box-shadow: 0 0 20px rgba(99,102,241,0.6); } }
        @keyframes gateOpen { 0% { transform: scaleX(1); } 100% { transform: scaleX(0); } }
        @keyframes gateClose { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
        @keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .firewall-glow { animation: glow 2s ease-in-out infinite; }
        .dot-pulse { animation: pulse-dot 1.5s ease-in-out infinite; }
      `}</style>

      {/* Breadcrumb */}
      <div className="border-b border-indigo-800/40 bg-indigo-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/tools/security" className="text-indigo-300 hover:text-indigo-100 font-semibold transition-colors">
              Security
            </Link>
            <ChevronRight size={14} className="text-indigo-500" />
            <span className="text-indigo-100 font-semibold">Firewalls</span>
          </div>
          <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-900/60 px-3 py-1 rounded-full border border-indigo-700/40">
            Interactive Lab
          </span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/20 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 backdrop-blur-md rounded-full text-[11px] font-semibold mb-6 border border-indigo-500/20 text-indigo-300">
              <Shield className="w-3.5 h-3.5" /> Network Security Module
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              🧱 Firewall Simulator
            </h1>
            <p className="text-base sm:text-lg text-indigo-200/80 max-w-2xl mx-auto leading-relaxed">
              Understand how packet filtering firewalls work. Configure rules, test packets, and visualize how traffic flows through your security perimeter.
            </p>
            <div className="flex gap-4 justify-center mt-8 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-300 font-semibold">{activeRulesCount} Active Rules</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-indigo-300 font-semibold">Interactive Simulation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-10">
        {/* Theory Section */}
        <div className="bg-indigo-900/30 border border-indigo-700/30 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-indigo-400" /> What is a Firewall?
          </h2>
          <p className="text-indigo-200/80 text-sm sm:text-base leading-relaxed mb-4">
            A firewall is a network security device that monitors and controls incoming and outgoing network traffic based on predetermined security rules. It establishes a barrier between trusted internal networks and untrusted external networks (like the internet).
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {[
              { label: "Packet Filtering", desc: "Inspects headers (IP, port, protocol) against ACL rules. Stateless — no connection tracking." },
              { label: "Stateful Inspection", desc: "Tracks connection state (TCP handshake). Only permits packets belonging to valid sessions." },
              { label: "Proxy Firewall", desc: "Terminates and re-establishes connections. Inspects application-layer data." },
              { label: "Next-Gen Firewall", desc: "Combines firewall with IPS/IDS, DPI, app awareness, and threat intelligence." },
            ].map((item) => (
              <div key={item.label} className="bg-indigo-950/40 rounded-xl p-4 border border-indigo-800/30">
                <div className="text-sm font-bold text-indigo-200 mb-1">{item.label}</div>
                <div className="text-xs text-indigo-300/70 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Firewall Simulator */}
        <div className="bg-indigo-900/30 border border-indigo-700/30 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Sliders className="w-5 h-5 text-indigo-400" /> Packet Filtering Simulator
          </h2>

          {/* Firewall Visual */}
          <div className="relative bg-indigo-950/60 rounded-xl border border-indigo-700/40 p-6 mb-8 overflow-hidden">
            <div className="flex items-center justify-between gap-4 min-h-[160px]">
              {/* Internet Side */}
              <div className="flex flex-col items-center gap-2 w-1/4">
                <Globe className="w-10 h-10 text-sky-400" />
                <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">Internet</span>
                {packet.sourceIp && showResult && (
                  <div className="text-[10px] text-sky-300/70 font-mono bg-sky-950/40 px-2 py-1 rounded">
                    {packet.sourceIp}
                  </div>
                )}
              </div>

              {/* Arrow from Internet to Firewall */}
              <div className="flex-1 flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-indigo-400/60" />
              </div>

              {/* Firewall */}
              <div className="relative flex flex-col items-center">
                <div className={`relative w-28 h-40 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-500 ${
                  result?.action === "ALLOWED" ? "border-emerald-500 bg-emerald-500/10 firewall-glow" :
                  result?.action === "BLOCKED" ? "border-red-500 bg-red-500/10" :
                  "border-indigo-500/50 bg-indigo-800/30"
                }`}>
                  {/* Gate animation */}
                  <div className={`absolute inset-0 rounded-xl overflow-hidden transition-all duration-500 ${
                    result?.action === "ALLOWED" ? "opacity-0" : "opacity-100"
                  }`}>
                    <div className="absolute inset-0 bg-indigo-800/60 flex items-center justify-center">
                      <ShieldOff className="w-6 h-6 text-red-400" />
                    </div>
                  </div>
                  <div className={`relative z-10 flex flex-col items-center gap-1 ${result?.action === "BLOCKED" ? "opacity-100" : ""}`}>
                    <Shield className={`w-8 h-8 ${
                      result?.action === "ALLOWED" ? "text-emerald-400" :
                      result?.action === "BLOCKED" ? "text-red-400" : "text-indigo-400"
                    }`} />
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Firewall</span>
                  </div>
                  {result && (
                    <div className={`relative z-10 text-[10px] font-black px-2 py-0.5 rounded-full ${
                      result.action === "ALLOWED" ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                    }`}>
                      {result.action === "ALLOWED" ? "✓ ALLOW" : "✗ BLOCK"}
                    </div>
                  )}
                </div>
              </div>

              {/* Arrow from Firewall to Network */}
              <div className="flex-1 flex items-center justify-center">
                <ArrowRight className={`w-6 h-6 transition-colors duration-500 ${
                  result?.action === "ALLOWED" ? "text-emerald-400" :
                  result?.action === "BLOCKED" ? "text-red-400/30" : "text-indigo-400/60"
                }`} />
              </div>

              {/* Internal Network Side */}
              <div className="flex flex-col items-center gap-2 w-1/4">
                <Server className={`w-10 h-10 transition-colors duration-500 ${
                  result?.action === "ALLOWED" ? "text-emerald-400" :
                  result?.action === "BLOCKED" ? "text-gray-600" : "text-indigo-400"
                }`} />
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Internal Network</span>
                {packet.destIp && showResult && (
                  <div className="text-[10px] text-indigo-300/70 font-mono bg-indigo-950/40 px-2 py-1 rounded">
                    {packet.destIp}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rules Table */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-indigo-200 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Firewall Rules ({activeRulesCount}/{rules.length} active)
              </h3>
              <button
                onClick={() => setRules(rules.map(r => ({ ...r, enabled: true })))}
                className="text-[11px] text-indigo-400 hover:text-indigo-200 font-semibold transition-colors"
              >
                Enable All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-indigo-700/40">
                    <th className="py-2 px-2 text-left text-indigo-400 font-bold">#</th>
                    <th className="py-2 px-2 text-left text-indigo-400 font-bold">Source IP</th>
                    <th className="py-2 px-2 text-left text-indigo-400 font-bold">Dest IP</th>
                    <th className="py-2 px-2 text-left text-indigo-400 font-bold">Protocol</th>
                    <th className="py-2 px-2 text-left text-indigo-400 font-bold">Port</th>
                    <th className="py-2 px-2 text-left text-indigo-400 font-bold">Action</th>
                    <th className="py-2 px-2 text-left text-indigo-400 font-bold">Toggle</th>
                    <th className="py-2 px-2 text-left text-indigo-400 font-bold">Label</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map((rule) => {
                    const matched = result?.matchedRule?.id === rule.id;
                    return (
                      <tr
                        key={rule.id}
                        className={`border-b border-indigo-800/20 transition-all ${
                          matched ? "bg-indigo-500/20" : ""
                        } ${rule.enabled ? "opacity-100" : "opacity-40"}`}
                      >
                        <td className="py-2.5 px-2 text-indigo-300 font-mono">{rule.id}</td>
                        <td className="py-2.5 px-2 text-indigo-200 font-mono">{rule.sourceIp}</td>
                        <td className="py-2.5 px-2 text-indigo-200 font-mono">{rule.destIp}</td>
                        <td className="py-2.5 px-2 text-indigo-200">{rule.protocol}</td>
                        <td className="py-2.5 px-2 text-indigo-200 font-mono">{rule.port}</td>
                        <td className="py-2.5 px-2">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            rule.action === "ALLOW" ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                          }`}>
                            {rule.action}
                          </span>
                        </td>
                        <td className="py-2.5 px-2">
                          <button
                            onClick={() => toggleRule(rule.id)}
                            className={`w-10 h-5 rounded-full transition-colors relative ${
                              rule.enabled ? "bg-emerald-500/50" : "bg-indigo-700/50"
                            }`}
                          >
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                              rule.enabled ? "translate-x-5" : "translate-x-0.5"
                            }`} />
                          </button>
                        </td>
                        <td className="py-2.5 px-2 text-indigo-300/80 text-[10px]">{rule.label}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Test Packet Section */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="bg-indigo-950/50 rounded-xl border border-indigo-700/30 p-5">
              <h3 className="text-sm font-bold text-indigo-200 mb-4 flex items-center gap-2">
                <Network className="w-4 h-4" /> Test Packet
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-indigo-400 block mb-1">Source IP</label>
                  <input
                    value={packet.sourceIp}
                    onChange={e => setPacket(p => ({ ...p, sourceIp: e.target.value }))}
                    className="w-full bg-indigo-950 border border-indigo-700/40 rounded-lg px-3 py-2 text-sm text-indigo-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. 192.168.1.100"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-indigo-400 block mb-1">Destination IP</label>
                  <input
                    value={packet.destIp}
                    onChange={e => setPacket(p => ({ ...p, destIp: e.target.value }))}
                    className="w-full bg-indigo-950 border border-indigo-700/40 rounded-lg px-3 py-2 text-sm text-indigo-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. 8.8.8.8"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-indigo-400 block mb-1">Protocol</label>
                    <select
                      value={packet.protocol}
                      onChange={e => setPacket(p => ({ ...p, protocol: e.target.value as Protocol }))}
                      className="w-full bg-indigo-950 border border-indigo-700/40 rounded-lg px-3 py-2 text-sm text-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="TCP">TCP</option>
                      <option value="UDP">UDP</option>
                      <option value="ICMP">ICMP</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-indigo-400 block mb-1">Port</label>
                    <input
                      type="number"
                      value={packet.port}
                      onChange={e => setPacket(p => ({ ...p, port: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-indigo-950 border border-indigo-700/40 rounded-lg px-3 py-2 text-sm text-indigo-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      min={0}
                      max={65535}
                    />
                  </div>
                </div>
                {/* Quick presets */}
                <div>
                  <label className="text-[11px] font-semibold text-indigo-400 block mb-2">Quick Select</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {PROTOCOL_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => applyPreset(preset)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors ${
                          packet.protocol === preset.protocol && packet.port === preset.port
                            ? "bg-indigo-500/30 border-indigo-400 text-indigo-200"
                            : "bg-indigo-900/40 border-indigo-700/30 text-indigo-400 hover:border-indigo-500"
                        }`}
                      >
                        {preset.label} ({preset.port})
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={sendPacket}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Send Packet
                </button>
              </div>
            </div>

            {/* Results Panel */}
            <div className="bg-indigo-950/50 rounded-xl border border-indigo-700/30 p-5">
              <h3 className="text-sm font-bold text-indigo-200 mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4" /> Results & Statistics
              </h3>
              {result && showResult ? (
                <div className="mb-4">
                  <div className={`p-4 rounded-xl border-2 mb-3 ${
                    result.action === "ALLOWED"
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-red-500/10 border-red-500/30"
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {result.action === "ALLOWED" ? (
                        <Shield className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <ShieldOff className="w-5 h-5 text-red-400" />
                      )}
                      <span className={`text-lg font-black ${
                        result.action === "ALLOWED" ? "text-emerald-300" : "text-red-300"
                      }`}>
                        {result.action === "ALLOWED" ? "✓ PACKET ALLOWED" : "✗ PACKET BLOCKED"}
                      </span>
                    </div>
                    <div className="text-xs text-indigo-300/70 space-y-1 font-mono">
                      <div>{result.packet.sourceIp} → {result.packet.destIp}</div>
                      <div>{result.packet.protocol}:{result.packet.port}</div>
                    </div>
                    {result.matchedRule ? (
                      <div className="mt-2 text-xs text-indigo-300 bg-indigo-900/40 rounded-lg px-3 py-2">
                        Matched Rule #{result.matchedRule.id}: <span className="font-bold text-indigo-200">{result.matchedRule.label}</span> → {result.matchedRule.action}
                      </div>
                    ) : (
                      <div className="mt-2 text-xs text-red-300/80 bg-red-900/20 rounded-lg px-3 py-2">
                        No matching rule — default deny
                      </div>
                    )}
                  </div>
                  {/* Path visualization */}
                  <div className="bg-indigo-950/40 rounded-lg p-3 border border-indigo-800/30">
                    <div className="text-[10px] font-bold text-indigo-400 mb-2 uppercase tracking-wider">Packet Path</div>
                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <span className="text-sky-400">{packet.sourceIp}</span>
                      <ArrowRight className={`w-3 h-3 ${result.action === "ALLOWED" ? "text-emerald-400" : "text-red-400"}`} />
                      <div className={`px-2 py-0.5 rounded text-[9px] font-black ${
                        result.action === "ALLOWED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}>
                        {result.action === "ALLOWED" ? "✓ ALLOW" : "✗ BLOCK"}
                      </div>
                      <ArrowRight className={`w-3 h-3 ${result.action === "ALLOWED" ? "text-emerald-400" : "text-red-400/30"}`} />
                      <span className={`${result.action === "ALLOWED" ? "text-emerald-300" : "text-gray-600"}`}>
                        {packet.destIp}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-indigo-400/50">
                  <Eye className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-xs">Configure a packet and click "Send Packet" to test the firewall rules.</p>
                </div>
              )}

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-emerald-500/5 rounded-xl p-3 border border-emerald-500/20 text-center">
                  <div className="text-2xl font-black text-emerald-400">{stats.allowed}</div>
                  <div className="text-[10px] font-semibold text-emerald-300/70 uppercase">Allowed</div>
                </div>
                <div className="bg-red-500/5 rounded-xl p-3 border border-red-500/20 text-center">
                  <div className="text-2xl font-black text-red-400">{stats.blocked}</div>
                  <div className="text-[10px] font-semibold text-red-300/70 uppercase">Blocked</div>
                </div>
              </div>

              {/* Packet History */}
              {packetHistory.length > 0 && (
                <div className="mt-4">
                  <div className="text-[10px] font-bold text-indigo-400 mb-2 uppercase tracking-wider">Recent Packets</div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {packetHistory.map((h, i) => (
                      <div key={i} className={`flex items-center gap-2 text-[10px] font-mono px-2 py-1 rounded ${
                        h.action === "ALLOWED" ? "bg-emerald-500/5" : "bg-red-500/5"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          h.action === "ALLOWED" ? "bg-emerald-400" : "bg-red-400"
                        }`} />
                        <span className="text-indigo-300/60">{h.packet.sourceIp}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-indigo-500" />
                        <span className="text-indigo-300/60">{h.packet.destIp}</span>
                        <span className="text-indigo-400">({h.packet.protocol}:{h.packet.port})</span>
                        <span className={`ml-auto font-bold ${
                          h.action === "ALLOWED" ? "text-emerald-400" : "text-red-400"
                        }`}>
                          {h.action === "ALLOWED" ? "ALLOW" : "BLOCK"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Firewall Types */}
        <div className="bg-indigo-900/30 border border-indigo-700/30 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Server className="w-5 h-5 text-indigo-400" /> Firewall Types
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {FIREWALL_TYPES.map((ft) => {
              const Icon = ft.icon;
              return (
                <div key={ft.title} className="bg-indigo-950/50 rounded-xl border border-indigo-700/30 p-5 hover:border-indigo-500/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className={`w-5 h-5 text-${ft.color}-400`} />
                    <h3 className="text-sm font-bold text-indigo-100">{ft.title}</h3>
                  </div>
                  <p className="text-xs text-indigo-300/70 leading-relaxed mb-3">{ft.desc}</p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <div className="text-[10px] font-bold text-emerald-400 mb-1">✅ Pros</div>
                      <ul className="space-y-0.5">
                        {ft.pros.map((p, i) => (
                          <li key={i} className="text-[10px] text-indigo-300/60">• {p}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-red-400 mb-1">❌ Cons</div>
                      <ul className="space-y-0.5">
                        {ft.cons.map((c, i) => (
                          <li key={i} className="text-[10px] text-indigo-300/60">• {c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-indigo-950/60 rounded-lg p-2.5 border border-indigo-800/30">
                    <div className="text-[10px] font-bold text-indigo-400 mb-1">Example</div>
                    <div className="text-[10px] text-indigo-300/60 leading-relaxed">{ft.example}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-indigo-900/30 border border-indigo-700/30 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Lock className="w-5 h-5 text-indigo-400" /> Firewall Best Practices
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BEST_PRACTICES.map((bp) => (
              <div key={bp.title} className="bg-indigo-950/50 rounded-xl p-4 border border-indigo-700/30">
                <h3 className="text-sm font-bold text-indigo-200 mb-2">{bp.title}</h3>
                <p className="text-xs text-indigo-300/70 leading-relaxed">{bp.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-indigo-900/30 border border-indigo-700/30 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-indigo-400" /> Interview Questions
          </h2>
          <div className="space-y-3">
            {INTERVIEW_QS.map((iq, idx) => (
              <details key={idx} className="group bg-indigo-950/50 rounded-xl border border-indigo-700/30 overflow-hidden">
                <summary className="p-4 cursor-pointer text-sm font-semibold text-indigo-200 hover:text-indigo-100 transition-colors flex items-center gap-2 list-none">
                  <ChevronRight className="w-4 h-4 text-indigo-500 group-open:rotate-90 transition-transform shrink-0" />
                  Q{idx + 1}: {iq.q}
                </summary>
                <div className="px-4 pb-4 pt-0">
                  <div className="border-t border-indigo-700/30 pt-3">
                    <p className="text-xs text-indigo-300/80 leading-relaxed">{iq.a}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Back link */}
        <div className="text-center">
          <Link
            href="/tools/security"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-200 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Security Topics
          </Link>
        </div>
      </div>
    </div>
  );
}
