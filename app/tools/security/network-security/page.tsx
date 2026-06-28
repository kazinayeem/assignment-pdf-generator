"use client";

import Link from "next/link";
import { ChevronRight, Shield, ShieldCheck, Lock, Server, Globe, Network, Wifi, AlertTriangle, CheckCircle, HelpCircle, ChevronDown, ArrowRight, Router, Radio } from "lucide-react";
import { useState } from "react";

const interviewData = [
  {
    q: "What is the difference between IDS and IPS?",
    a: "IDS (Intrusion Detection System) monitors network traffic and alerts on suspicious activity — it is passive and does not block traffic. IPS (Intrusion Prevention System) sits inline and actively blocks or drops malicious traffic in real-time. IPS is essentially IDS with automated prevention capabilities."
  },
  {
    q: "What is defense in depth in network security?",
    a: "Defense in depth is a layered approach where multiple overlapping security controls protect the network. If one layer fails (e.g., firewall is bypassed), another layer (e.g., IDS, network segmentation, endpoint protection) still provides defense. Layers include: perimeter firewalls, internal firewalls, IDS/IPS, VPNs, endpoint protection, and security awareness training."
  },
  {
    q: "What is network segmentation and why is it important?",
    a: "Network segmentation divides a network into smaller, isolated segments to limit lateral movement of attackers. Techniques include VLANs (logical separation), DMZs (public-facing services), and subnetting (IP-based division). If one segment is breached, the attacker cannot easily access other segments."
  },
  {
    q: "What is a DDoS attack and how is it mitigated?",
    a: "DDoS (Distributed Denial of Service) overwhelms a target with traffic from multiple compromised systems. Mitigation includes: rate limiting, traffic filtering, scrubbing centers, CDNs (Cloudflare, Akamai), Anycast routing, and cloud-based DDoS protection services (AWS Shield, Azure DDoS Protection)."
  },
  {
    q: "What is ARP spoofing and how can it be prevented?",
    a: "ARP spoofing (or ARP poisoning) is an attack where an attacker sends forged ARP messages to associate their MAC address with the IP address of a legitimate device on the LAN. This allows interception of traffic (MitM). Prevention includes: Static ARP entries, Dynamic ARP Inspection (DAI), port security, and using encrypted protocols (HTTPS, SSH) that prevent eavesdropping even if ARP is spoofed."
  }
];

function InterviewAccordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-violet-500 mt-0.5 flex-shrink-0" />
          <span className="font-semibold text-gray-900 text-sm">{q}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed pl-8">{a}</p>
        </div>
      )}
    </div>
  );
}

const securityLayers = [
  { layer: "Edge", icon: Globe, desc: "Perimeter firewalls, DDoS protection, CDN/WAF at the network boundary", color: "bg-red-50 border-red-200", iconColor: "text-red-600" },
  { layer: "Network", icon: Network, desc: "Internal firewalls, IDS/IPS, VLANs, NAC, VPN gateways", color: "bg-orange-50 border-orange-200", iconColor: "text-orange-600" },
  { layer: "Host", icon: Server, desc: "OS hardening, endpoint protection, host firewalls, patch management", color: "bg-amber-50 border-amber-200", iconColor: "text-amber-600" },
  { layer: "Application", icon: Shield, desc: "Input validation, authentication, encryption, secure coding", color: "bg-emerald-50 border-emerald-200", iconColor: "text-emerald-600" }
];

export default function NetworkSecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-violet-50/20 to-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/tools/security" className="hover:text-gray-700 transition-colors">Security</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-semibold">Network Security</span>
        </div>

        <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-2xl p-8 md:p-12 mb-8 text-white">
          <h1 className="text-3xl md:text-4xl font-black mb-3">Network Security</h1>
          <p className="text-violet-100 text-lg max-w-3xl">
            Protecting network infrastructure from threats — security layers, IDS/IPS, secure protocols, segmentation, and attack mitigation.
          </p>
        </div>

        {/* Network Security Layers */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">Network Security Layers</h2>
          <p className="text-sm text-gray-500 mb-6">A layered approach to protecting network infrastructure</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {securityLayers.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.layer} className={`p-5 rounded-xl border ${item.color} relative`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className={`w-5 h-5 ${item.iconColor}`} />
                    <h3 className="font-bold text-gray-900 text-sm">{item.layer}</h3>
                  </div>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
            <span className="font-semibold text-gray-600">Outside</span>
            <ArrowRight className="w-3 h-3" />
            {securityLayers.map((_, i) => (
              <span key={i} className="flex items-center gap-1">
                <span>{_.layer}</span>
                {i < securityLayers.length - 1 && <ArrowRight className="w-3 h-3" />}
              </span>
            ))}
            <ArrowRight className="w-3 h-3" />
            <span className="font-semibold text-gray-600">Inside</span>
          </div>
        </div>

        {/* IDS vs IPS */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-4">IDS vs IPS</h2>
          <p className="text-sm text-gray-500 mb-6">Intrusion Detection vs Intrusion Prevention Systems</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-bold text-gray-700 border-b border-gray-200">Feature</th>
                  <th className="text-left p-3 font-bold text-gray-700 border-b border-gray-200">IDS</th>
                  <th className="text-left p-3 font-bold text-gray-700 border-b border-gray-200">IPS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Position", ids: "Out-of-band (monitors copy of traffic)", ips: "Inline (traffic passes through)" },
                  { feature: "Action", ids: "Alerts, logs, reports", ips: "Blocks, drops, resets connections" },
                  { feature: "Detection", ids: "Signature + anomaly-based", ips: "Signature + anomaly + policy-based" },
                  { feature: "Latency", ids: "No impact on traffic flow", ips: "May add latency (inline processing)" },
                  { feature: "False Positives", ids: "Low risk (no blocking)", ips: "High risk (may block legitimate traffic)" },
                  { feature: "Examples", ids: "Snort (IDS mode), Suricata (IDS)", ips: "Snort (inline), Palo Alto, Cisco Firepower" },
                  { feature: "Use Case", ids: "Monitoring, forensics, compliance", ips: "Real-time threat prevention" }
                ].map((row) => (
                  <tr key={row.feature} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-bold text-gray-700">{row.feature}</td>
                    <td className="p-3 text-xs text-blue-700">{row.ids}</td>
                    <td className="p-3 text-xs text-emerald-700">{row.ips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-xs text-amber-800"><strong>Note:</strong> Many modern systems combine both as IDPS (Intrusion Detection and Prevention Systems), offering configurable detection and automated response capabilities.</p>
          </div>
        </div>

        {/* Secure Protocols */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">Secure Protocols</h2>
          <p className="text-sm text-gray-500 mb-6">Protocols that provide encrypted and authenticated communication</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "HTTPS", port: "443", desc: "HTTP over TLS. Encrypts all web traffic between client and server.", icon: Globe },
              { name: "SSH", port: "22", desc: "Secure Shell for remote administration. Encrypts login sessions and command execution.", icon: TerminalIcon },
              { name: "SFTP", port: "22", desc: "SSH File Transfer Protocol. Secure file transfer over SSH.", icon: FileTransferIcon },
              { name: "TLS", port: "443", desc: "Transport Layer Security. Underlying encryption for HTTPS, SMTPS, FTPS, etc.", icon: Lock },
              { name: "IPsec", port: "500/4500", desc: "IP Security. Encrypts IP packets for VPNs. Works in transport or tunnel mode.", icon: Shield },
              { name: "SMTPS", port: "465/587", desc: "SMTP over TLS. Encrypts email transmission between mail servers and clients.", icon: MailIcon }
            ].map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.name} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-violet-600" />
                    <h3 className="font-bold text-gray-900 text-sm">{p.name}</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">Port {p.port}</p>
                  <p className="text-xs text-gray-600">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Network Segmentation */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">Network Segmentation</h2>
          <p className="text-sm text-gray-500 mb-6">Dividing a network into smaller, isolated segments to limit breach impact</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: "VLAN", desc: "Virtual LANs logically segment networks at Layer 2. Devices in different VLANs cannot communicate without a router or Layer 3 switch.", icon: Network },
              { title: "DMZ", desc: "Demilitarized Zone — a buffer network between internal LAN and the internet. Public-facing servers (web, mail, DNS) are placed here.", icon: Radio },
              { title: "Subnetting", desc: "Dividing IP address ranges into smaller subnets. Limits broadcast domains and allows granular firewall rules between segments.", icon: Router }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="p-5 bg-blue-50 rounded-xl border border-blue-200">
                  <Icon className="w-6 h-6 text-blue-600 mb-3" />
                  <h3 className="font-bold text-gray-900 text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
            <p className="text-xs text-indigo-800"><strong>Zero Trust:</strong> Modern segmentation follows Zero Trust principles — never trust, always verify. Every request is authenticated and authorized regardless of network location (no implicit trust based on being "inside" the network).</p>
          </div>
        </div>

        {/* Defense in Depth */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">Defense in Depth</h2>
          <p className="text-sm text-gray-500 mb-6">A layered security strategy with overlapping controls</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { title: "Physical Security", items: ["Locks, biometric access", "Security cameras", "Server room access control"] },
              { title: "Perimeter Security", items: ["Firewalls", "DDoS protection", "WAF", "VPN gateways"] },
              { title: "Internal Security", items: ["Network segmentation", "IDS/IPS", "NAC", "Internal firewalls"] },
              { title: "Host Security", items: ["Antivirus/EDR", "OS hardening", "Patch management", "Host firewall"] },
              { title: "Application Security", items: ["Secure coding", "Input validation", "Auth & session mgmt"] },
              { title: "Data Security", items: ["Encryption at rest", "Encryption in transit", "DLP", "Backup"] },
              { title: "Identity Security", items: ["MFA", "IAM", "SSO", "Privileged access mgmt"] },
              { title: "Procedural", items: ["Security policies", "Incident response", "Awareness training", "Audits"] }
            ].map((l) => (
              <div key={l.title} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 text-sm mb-2">{l.title}</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  {l.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle className="w-3 h-3 text-violet-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Common Network Attacks */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">Common Network Attacks</h2>
          <p className="text-sm text-gray-500 mb-6">Frequent attack vectors targeting network infrastructure</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "DoS / DDoS", desc: "Overwhelms a target with traffic, making services unavailable. DDoS uses distributed sources (botnets).", icon: AlertTriangle, color: "bg-red-50 border-red-200", iconColor: "text-red-600" },
              { title: "ARP Spoofing", desc: "Attacker sends forged ARP messages to associate their MAC with a legitimate IP, enabling traffic interception on the LAN.", icon: Network, color: "bg-orange-50 border-orange-200", iconColor: "text-orange-600" },
              { title: "DNS Spoofing", desc: "Attacker corrupts DNS cache to redirect users to malicious sites. Also known as DNS cache poisoning.", icon: Globe, color: "bg-amber-50 border-amber-200", iconColor: "text-amber-600" },
              { title: "MitM", desc: "Man-in-the-Middle — attacker secretly relays and potentially alters communication between two parties.", icon: Shield, color: "bg-yellow-50 border-yellow-200", iconColor: "text-yellow-600" },
              { title: "Port Scanning", desc: "Attackers probe open ports to identify running services and potential vulnerabilities for exploitation.", icon: Radio, color: "bg-rose-50 border-rose-200", iconColor: "text-rose-600" },
              { title: "Packet Sniffing", desc: "Capturing network packets to extract sensitive data like passwords, cookies, or unencrypted content.", icon: Wifi, color: "bg-pink-50 border-pink-200", iconColor: "text-pink-600" }
            ].map((attack) => {
              const Icon = attack.icon;
              return (
                <div key={attack.title} className={`p-4 rounded-xl border ${attack.color}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${attack.iconColor}`} />
                    <h3 className="font-bold text-gray-900 text-sm">{attack.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600">{attack.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mitigation Strategies */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-4">Mitigation Strategies</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Deploy firewalls at perimeter and between network segments",
              "Use IDS/IPS for traffic monitoring and threat prevention",
              "Implement network segmentation with VLANs and firewalls",
              "Enforce HTTPS and use TLS 1.3 everywhere",
              "Use VPNs for remote access and site-to-site connections",
              "Enable port security on switches to prevent ARP spoofing",
              "Deploy DDoS protection services (Cloudflare, AWS Shield)",
              "Implement DNSSEC to prevent DNS spoofing attacks",
              "Regular vulnerability scanning and penetration testing",
              "Use 802.1X for network access control (NAC)",
              "Monitor network traffic with SIEM and log analysis",
              "Keep firmware and network device software updated"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">Interview Questions</h2>
          <p className="text-sm text-gray-500 mb-6">Common network security interview questions with answers</p>
          <div className="space-y-3">
            {interviewData.map((item, i) => (
              <InterviewAccordion key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TerminalIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function FileTransferIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function MailIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
