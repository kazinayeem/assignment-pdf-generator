"use client";

import Link from "next/link";
import { ChevronRight, Terminal, Search, Zap, Lock, Eye, FileText, Shield, Database, Globe, Radio, Bug, Key, Network, BookOpen, CheckCircle2, AlertTriangle } from "lucide-react";

const PHASES = [
  {
    phase: "1", title: "Reconnaissance", desc: "Gather information about the target using passive (OSINT, social media) and active (DNS queries, WHOIS) techniques.",
    tools: ["Google Dorking", "Shodan", "theHarvester", "Maltego"], color: "blue",
    icon: Search, details: "Passive recon gathers info without direct interaction (social media, job postings, DNS records). Active recon involves direct probing (port scans, web requests).",
  },
  {
    phase: "2", title: "Scanning & Enumeration", desc: "Identify live hosts, open ports, running services, and potential vulnerabilities.",
    tools: ["Nmap", "Masscan", "Netcat", "Nikto"], color: "violet",
    icon: Radio, details: "Port scanning (TCP SYN, UDP), service version detection, OS fingerprinting, vulnerability scanning. Enumeration extracts user lists, shares, and application details.",
  },
  {
    phase: "3", title: "Gaining Access", desc: "Exploit identified vulnerabilities to gain entry into the target system.",
    tools: ["Metasploit", "Burp Suite", "SQLMap", "Hydra"], color: "amber",
    icon: Zap, details: "Exploits: buffer overflows, SQL injection, XSS, weak credentials. Payload delivery via phishing, drive-by downloads, or direct network exploitation.",
  },
  {
    phase: "4", title: "Maintaining Access", desc: "Establish persistence through backdoors, rootkits, or privileged accounts.",
    tools: ["Netcat", "SSH Tunnels", "Cron Jobs", "Web Shells"], color: "orange",
    icon: Lock, details: "Creates persistent access mechanisms: scheduled tasks, registry run keys, SSH authorized_keys, web shells, or reverse tunnels that survive reboots.",
  },
  {
    phase: "5", title: "Covering Tracks", desc: "Remove evidence of the intrusion — clear logs, hide files, and cover activity.",
    tools: ["Log cleaners", "Timestomping", "Steganography"], color: "rose",
    icon: Eye, details: "Deletes or modifies audit logs, clears bash history, hides processes, uses timestomping (modifying file timestamps), and encrypts communication channels.",
  },
  {
    phase: "6", title: "Reporting", desc: "Document findings, exploited vulnerabilities, data accessed, and remediation recommendations.",
    tools: ["Report templates", "Screenshots", "CVSS scoring"], color: "emerald",
    icon: FileText, details: "Executive summary for management, technical report with proof-of-concept, prioritized remediation roadmap, and retesting recommendations.",
  },
];

const TOOLS = [
  { name: "Nmap", desc: "Network discovery and security scanning tool. Port scanning, service detection, OS fingerprinting.", category: "Scanner", icon: Network },
  { name: "Metasploit", desc: "Penetration testing framework with exploit development, payload generation, and post-exploitation modules.", category: "Exploitation", icon: Zap },
  { name: "Burp Suite", desc: "Web application security testing platform. Intercepting proxy, scanner, intruder, and repeater tools.", category: "Web", icon: Bug },
  { name: "John the Ripper", desc: "Password cracking tool supporting多种 hash formats. Dictionary and brute-force attacks.", category: "Cracker", icon: Key },
  { name: "Wireshark", desc: "Network protocol analyzer for packet capture and inspection. Deep analysis of network traffic.", category: "Analyzer", icon: Radio },
  { name: "Hydra", desc: "Parallelized network login cracker supporting numerous protocols (SSH, FTP, HTTP, SMB).", category: "Cracker", icon: Terminal },
  { name: "SQLMap", desc: "Automated SQL injection detection and exploitation tool. Supports many database backends.", category: "Exploitation", icon: Database },
  { name: "Nikto", desc: "Web server vulnerability scanner. Checks for outdated software, dangerous files, and misconfigurations.", category: "Scanner", icon: Globe },
];

const TEST_TYPES = [
  { name: "Black Box", desc: "No prior knowledge of the target system. Simulates an external attacker with zero insider information.", advantage: "Realistic external attack simulation", disadvantage: "Time-consuming, may miss internal vulnerabilities", color: "bg-red-50 border-red-200 text-red-600" },
  { name: "White Box", desc: "Full knowledge of the target — source code, architecture diagrams, credentials provided.", advantage: "Thorough coverage, finds deep vulnerabilities", disadvantage: "Less realistic, requires more preparation", color: "bg-blue-50 border-blue-200 text-blue-600" },
  { name: "Grey Box", desc: "Partial knowledge — some access or credentials provided. Balances realism and depth.", advantage: "Good balance of efficiency and realism", disadvantage: "May miss some attack vectors", color: "bg-violet-50 border-violet-200 text-violet-600" },
];

const CEH_DETAILS = [
  { label: "Full Name", value: "Certified Ethical Hacker (CEH)" },
  { label: "Provider", value: "EC-Council" },
  { label: "Focus", value: "Ethical hacking methodologies, tools, and techniques across 20+ modules" },
  { label: "Exam", value: "125 multiple-choice questions, 4-hour duration, covering reconnaissance to reporting" },
  { label: "Prerequisites", value: "2 years of security experience or official EC-Council training" },
];

const ETHICAL_CONSIDERATIONS = [
  "Always obtain written authorization (signed contract) before testing",
  "Define the scope clearly — what systems, methods, and times are permitted",
  "Follow the rules of engagement — never exceed authorized boundaries",
  "Handle all data discovered with confidentiality and integrity",
  "Report all findings honestly — including vulnerabilities that could not be exploited",
  "Never use findings for personal gain, extortion, or unauthorized disclosure",
  "Maintain professional liability insurance and legal counsel",
];

const INTERVIEW_QS = [
  { q: "What is ethical hacking and how is it different from malicious hacking?", a: "Ethical hacking is authorized penetration testing with legal permission. Unlike malicious hackers, ethical hackers follow a code of conduct, have signed agreements defining scope, and provide detailed reports to help organizations fix vulnerabilities." },
  { q: "Explain the five phases of penetration testing.", a: "1) Reconnaissance — information gathering, 2) Scanning & Enumeration — identifying live hosts and services, 3) Gaining Access — exploiting vulnerabilities, 4) Maintaining Access — establishing persistence, 5) Covering Tracks — removing evidence. Followed by Reporting." },
  { q: "What is the difference between black box, white box, and grey box testing?", a: "Black box gives no prior knowledge (simulates external attacker). White box gives full access to source code and architecture (deepest testing). Grey box provides partial knowledge or credentials (balanced approach)." },
  { q: "What tools would you use in the reconnaissance phase?", a: "Passive: Google Dorking, Shodan, theHarvester, WHOIS lookups, DNS enumeration. Active: Nmap for port scanning, Nikto for web server scanning, and custom scripts for banner grabbing." },
  { q: "What is the CEH certification and what does it cover?", a: "CEH (Certified Ethical Hacker) by EC-Council covers 20+ modules including reconnaissance, scanning, enumeration, system hacking, malware threats, sniffing, social engineering, session hijacking, web/app hacking, SQL injection, cryptography, and penetration testing methodologies." },
];

export default function EthicalHackingPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/tools/security" className="hover:text-gray-700 transition-colors">Security</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-semibold">Ethical Hacking</span>
        </div>

        {/* Hero */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <Terminal className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Penetration Testing</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900">Ethical Hacking</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Learn penetration testing phases, tools, methodologies, and legal considerations for authorized security testing.</p>
        </div>

        {/* What is Ethical Hacking */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500" /> What is Ethical Hacking?
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
            <strong>Ethical hacking</strong> is the authorized practice of probing systems, networks, and applications to identify security vulnerabilities that an attacker could exploit. Ethical hackers use the same techniques as malicious hackers but with explicit permission, defined scope, and a commitment to report findings responsibly.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-amber-50 rounded-xl border border-amber-100">
              <CheckCircle2 className="w-5 h-5 text-amber-600 mb-2" />
              <h3 className="text-xs font-bold text-gray-900 mb-1">With Permission</h3>
              <p className="text-[11px] text-gray-600">Always operates under a signed agreement defining scope, rules, and limitations.</p>
            </div>
            <div className="p-3 sm:p-4 bg-amber-50 rounded-xl border border-amber-100">
              <FileText className="w-5 h-5 text-amber-600 mb-2" />
              <h3 className="text-xs font-bold text-gray-900 mb-1">Legal & Regulated</h3>
              <p className="text-[11px] text-gray-600">Follows legal frameworks, industry standards (OWASP, NIST, PTES), and professional ethics.</p>
            </div>
            <div className="p-3 sm:p-4 bg-amber-50 rounded-xl border border-amber-100">
              <FileText className="w-5 h-5 text-amber-600 mb-2" />
              <h3 className="text-xs font-bold text-gray-900 mb-1">Detailed Report</h3>
              <p className="text-[11px] text-gray-600">Delivers a comprehensive report with findings, impact analysis, and remediation steps.</p>
            </div>
          </div>
        </div>

        {/* Penetration Testing Phases */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-500" /> Penetration Testing Phases
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {PHASES.map((p) => {
              const Icon = p.icon;
              const colors: Record<string, string> = {
                blue: "bg-blue-50 border-blue-200 text-blue-600", violet: "bg-violet-50 border-violet-200 text-violet-600",
                amber: "bg-amber-50 border-amber-200 text-amber-600", orange: "bg-orange-50 border-orange-200 text-orange-600",
                rose: "bg-rose-50 border-rose-200 text-rose-600", emerald: "bg-emerald-50 border-emerald-200 text-emerald-600",
              };
              return (
                <div key={p.phase} className="p-3 sm:p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-white ${p.color === "blue" ? "bg-blue-500" : p.color === "violet" ? "bg-violet-500" : p.color === "amber" ? "bg-amber-500" : p.color === "orange" ? "bg-orange-500" : p.color === "rose" ? "bg-rose-500" : "bg-emerald-500"}`}>
                      {p.phase}
                    </div>
                    <Icon className={`w-4 h-4 ${colors[p.color].split(" ")[2]}`} />
                    <h3 className="text-xs font-bold text-gray-900">{p.title}</h3>
                  </div>
                  <p className="text-[11px] text-gray-600 mb-2 leading-relaxed">{p.details}</p>
                  <div className="flex flex-wrap gap-1">
                    {p.tools.map((tool) => (
                      <span key={tool} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-medium">{tool}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tools Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" /> Essential Hacking Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <div key={tool.name} className="p-3 sm:p-4 rounded-xl border border-gray-200">
                  <Icon className="w-5 h-5 text-amber-600 mb-2" />
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">{tool.name}</h3>
                  <p className="text-[11px] text-gray-600 mb-2 leading-relaxed">{tool.desc}</p>
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded font-bold">{tool.category}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Types of Penetration Tests */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Bug className="w-4 h-4 text-amber-500" /> Types of Penetration Tests
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {TEST_TYPES.map((t) => (
              <div key={t.name} className={`p-3 sm:p-4 rounded-xl border ${t.color}`}>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1.5">{t.name}</h3>
                <p className="text-[11px] text-gray-600 mb-2">{t.desc}</p>
                <div className="text-[10px] text-emerald-700 mb-0.5"><strong>Advantage:</strong> {t.advantage}</div>
                <div className="text-[10px] text-rose-600"><strong>Disadvantage:</strong> {t.disadvantage}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CEH Certification */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-500" /> CEH Certification
          </h2>
          <div className="space-y-2 sm:space-y-3">
            {CEH_DETAILS.map((d, i) => (
              <div key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                <span className="font-bold text-gray-800 whitespace-nowrap shrink-0 w-28">{d.label}:</span>
                <span className="text-gray-600">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Legal & Ethical Considerations */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Legal & Ethical Considerations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {ETHICAL_CONSIDERATIONS.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" /> Interview Questions
          </h2>
          <div className="space-y-3">
            {INTERVIEW_QS.map((qa, i) => (
              <div key={i} className="p-3 sm:p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-xs sm:text-sm font-bold text-gray-800 mb-1">Q{i + 1}: {qa.q}</p>
                <p className="text-[11px] sm:text-xs text-amber-700">A: {qa.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
