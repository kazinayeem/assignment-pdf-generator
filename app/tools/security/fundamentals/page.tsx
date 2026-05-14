"use client";

import Link from "next/link";
import { ChevronRight, Shield, ShieldCheck, ShieldAlert, Lock, Key, Fingerprint, UserCheck, FileText, CheckCircle, HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

const interviewData = [
  {
    q: "What is the CIA Triad and why is it important?",
    a: "The CIA Triad stands for Confidentiality (data accessible only to authorized parties), Integrity (data is accurate and not tampered), and Availability (systems and data are accessible when needed). It forms the foundation of information security — every security control maps to at least one of these principles."
  },
  {
    q: "What is the difference between authentication and authorization?",
    a: "Authentication verifies WHO you are (e.g., logging in with a password). Authorization determines WHAT you are allowed to do (e.g., admin vs. read-only access). Authentication always comes before authorization."
  },
  {
    q: "What is a zero-day vulnerability?",
    a: "A zero-day vulnerability is a security flaw unknown to the vendor or the public. Since no patch exists, attackers can exploit it before developers have a chance to fix it. The 'zero-day' refers to the number of days the vendor has known about it."
  },
  {
    q: "What is the principle of least privilege?",
    a: "The principle of least privilege means giving users and processes only the minimum permissions necessary to perform their job or function. This limits the damage from accidental errors, malicious insiders, or compromised accounts."
  },
  {
    q: "What is defense in depth?",
    a: "Defense in depth is a layered security strategy where multiple overlapping controls protect assets. If one layer fails (e.g., a firewall is breached), another layer (e.g., IDS, encryption) still provides protection. It avoids relying on any single point of defense."
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

export default function SecurityFundamentalsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-violet-50/20 to-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/tools/security" className="hover:text-gray-700 transition-colors">Security</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-semibold">Fundamentals</span>
        </div>

        <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-2xl p-8 md:p-12 mb-8 text-white">
          <h1 className="text-3xl md:text-4xl font-black mb-3">Security Fundamentals</h1>
          <p className="text-violet-100 text-lg max-w-3xl">
            Core concepts of information security — the CIA Triad, threats, vulnerabilities, authentication, authorization, policies, and best practices.
          </p>
        </div>

        {/* CIA Triad */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">CIA Triad</h2>
          <p className="text-sm text-gray-500 mb-6">The three core principles of information security</p>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: "Confidentiality", icon: Lock, desc: "Ensuring data is accessible only to authorized individuals. Implemented through encryption, access controls, and authentication. Prevents unauthorized disclosure of sensitive information.", color: "bg-blue-50", border: "border-blue-200", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
              { title: "Integrity", icon: ShieldCheck, desc: "Ensuring data is accurate, consistent, and not tampered with. Implemented through hashing, checksums, version control, and access controls. Prevents unauthorized modification.", color: "bg-emerald-50", border: "border-emerald-200", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
              { title: "Availability", icon: Shield, desc: "Ensuring systems and data are accessible when needed. Implemented through redundancy, backups, failover clusters, and DDoS protection. Prevents downtime and data loss.", color: "bg-amber-50", border: "border-amber-200", iconBg: "bg-amber-100", iconColor: "text-amber-600" }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className={`p-5 ${item.color} rounded-xl border ${item.border}`}>
                  <div className={`w-12 h-12 rounded-lg ${item.iconBg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Types of Threats */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">Types of Threats</h2>
          <p className="text-sm text-gray-500 mb-6">Common cybersecurity threats and attack vectors</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Malware", desc: "Malicious software (viruses, worms, trojans, ransomware) designed to damage or disrupt systems.", icon: ShieldAlert },
              { title: "Phishing", desc: "Social engineering attacks using deceptive emails or messages to steal credentials or sensitive info.", icon: FileText },
              { title: "DDoS", desc: "Distributed Denial of Service overwhelms a server with traffic, making it unavailable to legitimate users.", icon: Shield },
              { title: "MitM", desc: "Man-in-the-Middle attacks intercept communication between two parties to eavesdrop or alter data.", icon: UserCheck },
              { title: "Social Engineering", desc: "Psychological manipulation tricks people into divulging confidential information or performing actions.", icon: Key },
              { title: "Insider Threats", desc: "Current or former employees who misuse their authorized access to harm the organization.", icon: Lock }
            ].map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.title} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all">
                  <Icon className="w-5 h-5 text-violet-600 mb-2" />
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{t.title}</h3>
                  <p className="text-xs text-gray-600">{t.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vulnerabilities */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">Vulnerabilities</h2>
          <p className="text-sm text-gray-500 mb-6">Weaknesses that can be exploited by attackers</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Zero-day", desc: "Unknown vulnerability with no available patch. Extremely dangerous as no defense exists yet." },
              { title: "Misconfiguration", desc: "Improperly configured systems, default passwords, open cloud storage buckets, or verbose error messages." },
              { title: "Weak Passwords", desc: "Easily guessable or reused passwords that can be cracked via brute force or credential stuffing." },
              { title: "Unpatched Software", desc: "Known vulnerabilities in outdated software that remain exploitable because patches were not applied." }
            ].map((v) => (
              <div key={v.title} className="p-4 bg-red-50 rounded-xl border border-red-200">
                <h3 className="font-bold text-gray-900 text-sm mb-1">{v.title}</h3>
                <p className="text-xs text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Authentication Methods */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">Authentication Methods</h2>
          <p className="text-sm text-gray-500 mb-6">Ways to verify a user's identity</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Password-based", desc: "Something you know. Most common method but vulnerable to phishing, brute force, and credential stuffing." },
              { title: "Biometric", desc: "Something you are. Fingerprints, facial recognition, iris scans. Hard to replicate but privacy concerns exist." },
              { title: "MFA", desc: "Multi-Factor Authentication combines two or more methods (password + OTP + biometric) for stronger security." },
              { title: "Certificate-based", desc: "Digital certificates issued by a CA verify identity. Used in TLS, client authentication, and code signing." },
              { title: "Token-based", desc: "Hardware or software tokens generate time-based one-time passwords (TOTP) for second-factor auth." },
              { title: "SSO / OAuth", desc: "Single Sign-On allows one set of credentials across multiple services. OAuth enables delegated authorization." }
            ].map((a) => (
              <div key={a.title} className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                <h3 className="font-bold text-gray-900 text-sm mb-1">{a.title}</h3>
                <p className="text-xs text-gray-600">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Authorization Models */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-4">Authorization Models</h2>
          <p className="text-sm text-gray-500 mb-6">How access control decisions are made</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-bold text-gray-700 border-b border-gray-200">Model</th>
                  <th className="text-left p-3 font-bold text-gray-700 border-b border-gray-200">Full Name</th>
                  <th className="text-left p-3 font-bold text-gray-700 border-b border-gray-200">How It Works</th>
                  <th className="text-left p-3 font-bold text-gray-700 border-b border-gray-200">Use Case</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { model: "DAC", name: "Discretionary Access Control", how: "Owner decides who can access resources", use: "File systems, shared documents" },
                  { model: "MAC", name: "Mandatory Access Control", how: "System-enforced labels and clearances", use: "Military, government classified data" },
                  { model: "RBAC", name: "Role-Based Access Control", how: "Access based on job role / group membership", use: "Enterprise systems, databases" },
                  { model: "ABAC", name: "Attribute-Based Access Control", how: "Access based on user, resource, and environment attributes", use: "Cloud, fine-grained policies" }
                ].map((row) => (
                  <tr key={row.model} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-bold text-violet-700">{row.model}</td>
                    <td className="p-3 text-gray-700">{row.name}</td>
                    <td className="p-3 text-gray-600 text-xs">{row.how}</td>
                    <td className="p-3 text-gray-600 text-xs">{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Policies */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">Security Policies & Standards</h2>
          <p className="text-sm text-gray-500 mb-6">Frameworks that guide security practices</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "ISO 27001", desc: "International standard for Information Security Management Systems (ISMS). Specifies requirements for establishing, implementing, and improving an ISMS." },
              { title: "NIST CSF", desc: "National Institute of Standards and Technology Cybersecurity Framework. Provides guidelines for managing cybersecurity risk across five functions: Identify, Protect, Detect, Respond, Recover." },
              { title: "GDPR", desc: "General Data Protection Regulation. EU regulation for data protection and privacy. Requires consent, breach notification, and right to erasure." },
              { title: "HIPAA", desc: "Health Insurance Portability and Accountability Act. US regulation for protecting medical records and health information." }
            ].map((p) => (
              <div key={p.title} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 text-sm mb-1">{p.title}</h3>
                <p className="text-xs text-gray-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-4">Security Best Practices Checklist</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Use strong, unique passwords with a password manager",
              "Enable Multi-Factor Authentication (MFA) everywhere",
              "Keep all software and systems up-to-date with patches",
              "Encrypt sensitive data at rest and in transit",
              "Follow the principle of least privilege for access",
              "Regularly backup critical data (3-2-1 rule)",
              "Conduct security awareness training for employees",
              "Implement network segmentation and firewalls",
              "Monitor logs and set up intrusion detection",
              "Have an incident response plan ready",
              "Use secure coding practices (input validation, output encoding)",
              "Regularly audit and review access controls"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">Interview Questions</h2>
          <p className="text-sm text-gray-500 mb-6">Common security fundamentals interview questions with answers</p>
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
