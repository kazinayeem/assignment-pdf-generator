"use client";

import Link from "next/link";
import { ChevronRight, Lock, Globe, Network, Shield, Wifi, Server, ArrowRight, BookOpen, Monitor, Building2, Smartphone, Key, Radio, Eye, Zap, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";

const VPN_TYPES = [
  { name: "Remote Access VPN", desc: "Connects individual users to a private network over the internet. Ideal for remote employees accessing corporate resources from home or travel.", icon: Monitor, color: "violet" },
  { name: "Site-to-Site VPN", desc: "Connects entire networks to each other (e.g., branch office to headquarters). Used for linking geographically separated offices.", icon: Building2, color: "blue" },
  { name: "Client-based VPN", desc: "Requires dedicated VPN client software installed on the user's device. Provides granular control and strong authentication.", icon: Smartphone, color: "emerald" },
  { name: "SSL VPN", desc: "Operates over HTTPS using SSL/TLS. No client software needed — accessible via web browser. Ideal for quick, temporary access.", icon: Lock, color: "amber" },
];

const PROTOCOLS = [
  { name: "PPTP", security: "Weak (128-bit MPPE)", speed: "Fast", port: "TCP 1723", note: "Deprecated — known vulnerabilities. Avoid for any security-sensitive use.", securityLevel: "low" },
  { name: "L2TP/IPsec", security: "Strong (AES-256 + IPsec)", speed: "Moderate", port: "UDP 500, 4500", note: "Widely compatible but can be slower due to double encapsulation.", securityLevel: "high" },
  { name: "OpenVPN", security: "Very Strong (AES-256-GCM)", speed: "Fast", port: "UDP 1194 / TCP 443", note: "Open-source, highly configurable, gold standard for security.", securityLevel: "very-high" },
  { name: "WireGuard", security: "Strong (ChaCha20-Poly1305)", speed: "Very Fast", port: "UDP 51820", note: "Modern protocol with minimal codebase (~4k lines). Fastest VPN protocol.", securityLevel: "high" },
  { name: "SSTP", security: "Strong (AES-256 over SSL)", speed: "Fast", port: "TCP 443", note: "Microsoft proprietary. Uses HTTPS, can bypass most firewalls.", securityLevel: "high" },
];

const HOW_VPN_WORKS = [
  { step: "1", title: "Client Initiation", desc: "Your device connects to the VPN server and authenticates using credentials or certificates.", icon: Monitor },
  { step: "2", title: "Encryption", desc: "Data is encrypted on your device using strong cryptographic algorithms before leaving.", icon: Lock },
  { step: "3", title: "Tunneling", desc: "Encrypted data is wrapped in a VPN protocol (e.g., OpenVPN, WireGuard) and sent through a secure tunnel.", icon: Radio },
  { step: "4", title: "Decryption", desc: "The VPN server decrypts the incoming data packets and forwards them to the destination.", icon: Eye },
  { step: "5", title: "Server Response", desc: "Response from the target server travels back through the encrypted tunnel to your device.", icon: Server },
];

const IPSEC_COMPONENTS = [
  { name: "ESP (Encapsulating Security Payload)", desc: "Provides confidentiality, data integrity, and authentication. Encrypts the entire IP packet payload.", icon: Lock, color: "violet" },
  { name: "AH (Authentication Header)", desc: "Provides data integrity and authentication but no encryption. Protects against replay attacks.", icon: Shield, color: "blue" },
  { name: "IKE (Internet Key Exchange)", desc: "Manages key exchange and SA (Security Association) negotiation. Uses UDP port 500.", icon: Key, color: "emerald" },
];

const USE_CASES = [
  { title: "Remote Work", desc: "Securely access corporate resources from home, cafes, or co-working spaces.", icon: Monitor, color: "violet" },
  { title: "Geo-Spoofing", desc: "Access region-restricted content by appearing to connect from a different country.", icon: Globe, color: "blue" },
  { title: "Privacy Protection", desc: "Hide your IP address and browsing activity from ISPs, advertisers, and trackers.", icon: Eye, color: "emerald" },
  { title: "Public Wi-Fi Security", desc: "Encrypt all traffic when using untrusted public Wi-Fi networks in hotels or airports.", icon: Wifi, color: "amber" },
];

const BEST_PRACTICES = [
  "Use OpenVPN or WireGuard — avoid PPTP and L2TP/IPsec without proper configuration",
  "Enable a kill switch to block traffic if the VPN connection drops",
  "Use strong authentication: certificates plus passwords or MFA",
  "Regularly update VPN client software and server firmware",
  "Avoid free VPN services — they may log or sell your data",
  "Configure DNS leak protection to prevent DNS queries from bypassing the VPN",
  "Use split tunneling selectively to route only sensitive traffic through the VPN",
  "Monitor VPN gateway logs for unusual connection attempts",
];

const INTERVIEW_QS = [
  { q: "What is a VPN and how does it work?", a: "A VPN (Virtual Private Network) creates an encrypted tunnel between a client and a server, protecting data in transit. It encapsulates and encrypts all traffic, hiding the user's IP address and ensuring privacy and security over untrusted networks." },
  { q: "What is the difference between symmetric and asymmetric encryption in VPNs?", a: "Symmetric encryption (e.g., AES) uses a single shared key for both encryption and decryption — fast but requires secure key exchange. Asymmetric encryption (e.g., RSA) uses a public/private key pair for secure key exchange and authentication without pre-sharing secrets." },
  { q: "Explain IPsec and its components.", a: "IPsec is a protocol suite for securing IP communications. It uses ESP (Encapsulating Security Payload) for encryption and authentication, AH (Authentication Header) for integrity without encryption, and IKE (Internet Key Exchange) to negotiate keys and Security Associations." },
  { q: "What is the difference between split tunneling and full tunneling?", a: "Full tunneling routes all device traffic through the VPN. Split tunneling routes only specific traffic (e.g., corporate network) through the VPN while allowing other traffic (e.g., web browsing) to go directly. Split tunneling reduces bandwidth but may expose non-VPN traffic." },
  { q: "What are the advantages of WireGuard over OpenVPN?", a: "WireGuard has a minimal codebase (~4,000 lines vs ~600,000), runs in the Linux kernel, uses modern cryptography (ChaCha20, Curve25519), connects faster with fewer round trips, and is simpler to configure. OpenVPN is more mature, runs in userspace, and supports more advanced configurations." },
];

const colorBadge = (level: string) => {
  const map: Record<string, string> = {
    "low": "bg-red-100 text-red-600",
    "moderate": "bg-yellow-100 text-yellow-600",
    "high": "bg-green-100 text-green-600",
    "very-high": "bg-violet-100 text-violet-600",
    "fast": "bg-emerald-100 text-emerald-600",
    "very-fast": "bg-blue-100 text-blue-600",
    "moderate-speed": "bg-yellow-100 text-yellow-600",
  };
  return map[level] || "bg-gray-100 text-gray-600";
};

export default function VPNPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/tools/security" className="hover:text-gray-700 transition-colors">Security</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-semibold">VPN</span>
        </div>

        {/* Hero */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
              <Lock className="w-4 h-4 text-violet-600" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600">Virtual Private Network</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900">VPN</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Learn how VPNs protect privacy through tunneling, encryption, and anonymity on untrusted networks.</p>
        </div>

        {/* What is VPN */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-violet-500" /> What is a VPN?
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
            A <strong>Virtual Private Network (VPN)</strong> creates a secure, encrypted connection between your device and a remote server operated by a VPN provider. All internet traffic is routed through this encrypted tunnel, protecting your data from eavesdropping, censorship, and tracking.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-violet-50 rounded-xl border border-violet-100">
              <Radio className="w-5 h-5 text-violet-600 mb-2" />
              <h3 className="text-xs font-bold text-gray-900 mb-1">Tunneling</h3>
              <p className="text-[11px] text-gray-600">Data packets are encapsulated within VPN protocol packets, creating a tunnel that hides original packet headers.</p>
            </div>
            <div className="p-3 sm:p-4 bg-violet-50 rounded-xl border border-violet-100">
              <Lock className="w-5 h-5 text-violet-600 mb-2" />
              <h3 className="text-xs font-bold text-gray-900 mb-1">Encryption</h3>
              <p className="text-[11px] text-gray-600">All data is encrypted using protocols like AES-256, making it unreadable to anyone intercepting the traffic.</p>
            </div>
            <div className="p-3 sm:p-4 bg-violet-50 rounded-xl border border-violet-100">
              <Eye className="w-5 h-5 text-violet-600 mb-2" />
              <h3 className="text-xs font-bold text-gray-900 mb-1">Anonymity</h3>
              <p className="text-[11px] text-gray-600">Your real IP address is replaced by the VPN server's IP, masking your identity and location online.</p>
            </div>
          </div>
        </div>

        {/* Types of VPN */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Network className="w-4 h-4 text-violet-500" /> Types of VPN
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {VPN_TYPES.map((vpn) => {
              const Icon = vpn.icon;
              const colors: Record<string, string> = {
                violet: "bg-violet-50 border-violet-200 text-violet-600",
                blue: "bg-blue-50 border-blue-200 text-blue-600",
                emerald: "bg-emerald-50 border-emerald-200 text-emerald-600",
                amber: "bg-amber-50 border-amber-200 text-amber-600",
              };
              return (
                <div key={vpn.name} className={`p-3 sm:p-4 rounded-xl border ${colors[vpn.color]} ${colors[vpn.color].split(" ")[0]}`}>
                  <Icon className="w-5 h-5 mb-2" />
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">{vpn.name}</h3>
                  <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">{vpn.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* VPN Protocols Comparison */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-violet-500" /> VPN Protocols Comparison
          </h2>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full px-4 sm:px-0">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 sm:py-3 pr-3 font-bold text-gray-700">Protocol</th>
                    <th className="text-left py-2 sm:py-3 pr-3 font-bold text-gray-700">Security</th>
                    <th className="text-left py-2 sm:py-3 pr-3 font-bold text-gray-700">Speed</th>
                    <th className="text-left py-2 sm:py-3 pr-3 font-bold text-gray-700">Port</th>
                    <th className="text-left py-2 sm:py-3 font-bold text-gray-700 hidden sm:table-cell">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {PROTOCOLS.map((p) => (
                    <tr key={p.name} className="border-b border-gray-100 last:border-0">
                      <td className="py-2 sm:py-3 pr-3 font-bold text-gray-900 whitespace-nowrap">{p.name}</td>
                      <td className="py-2 sm:py-3 pr-3 whitespace-nowrap">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${colorBadge(p.securityLevel)}`}>
                          {p.security}
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 pr-3 text-gray-700">{p.speed}</td>
                      <td className="py-2 sm:py-3 pr-3 text-gray-700 font-mono text-[11px]">{p.port}</td>
                      <td className="py-2 sm:py-3 text-gray-500 text-[11px] hidden sm:table-cell">{p.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* How VPN Works */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Radio className="w-4 h-4 text-violet-500" /> How VPN Works
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">The data flow when using a VPN:</p>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-3">
            {HOW_VPN_WORKS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative p-3 sm:p-4 bg-violet-50 rounded-xl border border-violet-100 text-center">
                  <div className="w-7 h-7 bg-violet-600 text-white rounded-full flex items-center justify-center text-[11px] font-black mx-auto mb-2">
                    {step.step}
                  </div>
                  <Icon className="w-5 h-5 text-violet-600 mx-auto mb-1.5" />
                  <h3 className="text-[11px] sm:text-xs font-bold text-gray-900 mb-0.5">{step.title}</h3>
                  <p className="text-[10px] text-gray-600 leading-tight">{step.desc}</p>
                  {step.step !== "5" && (
                    <ArrowRight className="hidden sm:block w-4 h-4 text-violet-300 absolute -right-2.5 top-1/2 -translate-y-1/2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* IPsec Components */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Key className="w-4 h-4 text-violet-500" /> IPsec Components
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
            <strong>IPsec (Internet Protocol Security)</strong> is a suite of protocols used to secure IP communications through authentication and encryption.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {IPSEC_COMPONENTS.map((comp) => {
              const Icon = comp.icon;
              const colors: Record<string, string> = {
                violet: "bg-violet-50 border-violet-200 text-violet-600",
                blue: "bg-blue-50 border-blue-200 text-blue-600",
                emerald: "bg-emerald-50 border-emerald-200 text-emerald-600",
              };
              return (
                <div key={comp.name} className={`p-3 sm:p-4 rounded-xl border ${colors[comp.color]}`}>
                  <Icon className="w-5 h-5 mb-2" />
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">{comp.name}</h3>
                  <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">{comp.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* When to Use VPN */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-violet-500" /> When to Use a VPN
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {USE_CASES.map((uc) => {
              const Icon = uc.icon;
              const colors: Record<string, string> = {
                violet: "bg-violet-50 border-violet-200 text-violet-600",
                blue: "bg-blue-50 border-blue-200 text-blue-600",
                emerald: "bg-emerald-50 border-emerald-200 text-emerald-600",
                amber: "bg-amber-50 border-amber-200 text-amber-600",
              };
              return (
                <div key={uc.title} className="p-3 sm:p-4 rounded-xl border border-gray-200">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[uc.color].split(" ")[0]} mb-2`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">{uc.title}</h3>
                  <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">{uc.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-violet-500" /> VPN Best Practices
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {BEST_PRACTICES.map((bp, i) => (
              <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-violet-500 shrink-0 mt-0.5" />
                <span>{bp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-500" /> Interview Questions
          </h2>
          <div className="space-y-3">
            {INTERVIEW_QS.map((qa, i) => (
              <div key={i} className="p-3 sm:p-4 bg-violet-50 rounded-xl border border-violet-100">
                <p className="text-xs sm:text-sm font-bold text-gray-800 mb-1">Q{i + 1}: {qa.q}</p>
                <p className="text-[11px] sm:text-xs text-violet-700">A: {qa.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
