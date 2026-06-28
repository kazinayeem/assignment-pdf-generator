"use client";

import Link from "next/link";
import { ChevronRight, Cloud, Shield, Users, Key, Smartphone, Eye, AlertTriangle, CheckCircle2, BookOpen, Server, Globe, Building2, Layers, Lock, Database, Wifi, UserCheck, RefreshCw, FileText } from "lucide-react";

const DEPLOYMENT_MODELS = [
  { name: "Public Cloud", desc: "Third-party provider delivers services over the public internet. Shared infrastructure, multi-tenant.", icon: Globe, color: "blue", use: "Best for startups, dev/test, and variable workloads" },
  { name: "Private Cloud", desc: "Dedicated infrastructure for a single organization. Maximum control and compliance.", icon: Building2, color: "violet", use: "Best for regulated industries (finance, healthcare, government)" },
  { name: "Hybrid Cloud", desc: "Combines public and private clouds with orchestration between them.", icon: Layers, color: "emerald", use: "Best for burst capacity, disaster recovery, and legacy migration" },
  { name: "Multi-Cloud", desc: "Uses multiple public cloud providers (AWS, Azure, GCP) to avoid vendor lock-in.", icon: Server, color: "amber", use: "Best for redundancy, best-of-breed services, and cost optimization" },
];

const ZERO_TRUST_PRINCIPLES = [
  { title: "Verify Explicitly", desc: "Always authenticate and authorize based on all available data points — user identity, location, device health, service, and data classification.", icon: UserCheck },
  { title: "Least Privilege Access", desc: "Grant only the minimum permissions needed for users and systems to perform their functions. Limit lateral movement.", icon: Lock },
  { title: "Assume Breach", desc: "Design networks assuming attackers are already present. Segment networks, monitor continuously, and encrypt everything.", icon: AlertTriangle },
  { title: "Micro-Segmentation", desc: "Divide the network into small, isolated zones. Each zone requires separate authentication and authorization.", icon: Layers },
  { title: "Continuous Monitoring", desc: "Validate every access request in real-time. No implicit trust based on network location alone.", icon: Eye },
];

const IAM_CONCEPTS = [
  { name: "Users", desc: "Individual identities representing people or service accounts. Each user has unique credentials.", icon: Users, color: "violet" },
  { name: "Groups", desc: "Collections of users with shared permissions. Simplifies management by assigning policies to groups.", icon: Layers, color: "blue" },
  { name: "Roles", desc: "Identities with specific permissions that can be assumed temporarily. Used for cross-account access.", icon: Key, color: "emerald" },
  { name: "Policies", desc: "JSON documents defining permissions. Attach to users, groups, or roles to control access.", icon: FileText, color: "amber" },
];

const MFA_TYPES = [
  { name: "SMS / Phone Call", desc: "One-time code sent via SMS or voice call. Convenient but vulnerable to SIM swapping.", icon: Smartphone, color: "blue", security: "Medium" },
  { name: "TOTP / Authenticator", desc: "Time-based one-time password (Google Authenticator, Authy). More secure than SMS.", icon: RefreshCw, color: "violet", security: "High" },
  { name: "Hardware Key (FIDO2)", desc: "Physical security key (YubiKey, Titan). Phishing-resistant, highest security.", icon: Key, color: "emerald", security: "Very High" },
  { name: "Biometrics", desc: "Fingerprint, facial recognition, or iris scan. Convenient but raises privacy concerns.", icon: Eye, color: "amber", security: "High" },
];

const CLOUD_THREATS = [
  { threat: "Misconfiguration", desc: "Improperly configured cloud resources (open S3 buckets, overly permissive security groups) exposing data.", icon: AlertTriangle, color: "red" },
  { threat: "Data Breach", desc: "Unauthorized access to sensitive data through compromised credentials, application vulnerabilities, or insider threats.", icon: Eye, color: "rose" },
  { threat: "Insider Threat", desc: "Malicious or negligent employees, contractors, or partners with legitimate access misusing privileges.", icon: Users, color: "orange" },
  { threat: "API Vulnerabilities", desc: "Weak or exposed APIs providing attack surfaces for unauthorized access, injection, or data exfiltration.", icon: Wifi, color: "amber" },
];

const BEST_PRACTICES = [
  "Encrypt all data at rest using AES-256 and data in transit using TLS 1.2+",
  "Implement least privilege access — grant only the permissions required",
  "Enable Multi-Factor Authentication (MFA) for all users, especially privileged accounts",
  "Conduct regular security audits and penetration testing",
  "Use Cloud Security Posture Management (CSPM) tools to detect misconfigurations",
  "Implement network segmentation and micro-segmentation",
  "Enable logging and monitoring for all cloud resources (CloudTrail, Azure Monitor)",
  "Rotate credentials and API keys regularly — never hardcode secrets",
  "Apply the principle of defense in depth across all layers",
  "Have an incident response plan specific to cloud environments",
];

const INTERVIEW_QS = [
  { q: "What is the Shared Responsibility Model in cloud security?", a: "The cloud provider is responsible for security OF the cloud (physical security, hardware, networking, hypervisor). The customer is responsible for security IN the cloud (data, configurations, IAM, OS patching). The division varies by service type (IaaS, PaaS, SaaS)." },
  { q: "What is Zero Trust Architecture?", a: "Zero Trust assumes no implicit trust based on network location. Every access request must be explicitly authenticated, authorized, and continuously validated. Core principles: verify explicitly, least privilege, assume breach, micro-segmentation, and continuous monitoring." },
  { q: "Explain IAM and its components.", a: "IAM (Identity and Access Management) manages digital identities and access. Components: Users (individuals/services), Groups (user collections), Roles (assumable identities with permissions), Policies (JSON rules defining allowed/denied actions)." },
  { q: "What are the different types of MFA?", a: "MFA types include: SMS codes (convenient but SIM-swap vulnerable), TOTP authenticator apps (more secure, time-based codes), hardware security keys (FIDO2/WebAuthn, phishing-resistant), and biometrics (fingerprint, face, iris — convenient, privacy considerations)." },
  { q: "What are common cloud security threats?", a: "Top threats: Misconfiguration (the #1 cause of breaches), Data breaches (compromised credentials/vulnerabilities), Insider threats (malicious/negligent employees), API vulnerabilities (weak endpoints), DDoS attacks, and Account hijacking." },
];

export default function CloudSecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/tools/security" className="hover:text-gray-700 transition-colors">Security</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-semibold">Cloud Security</span>
        </div>

        {/* Hero */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
              <Cloud className="w-4 h-4 text-sky-600" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">Cloud Protection</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900">Cloud Security</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Learn shared responsibility, Zero Trust, IAM, MFA, and best practices for securing cloud environments.</p>
        </div>

        {/* Shared Responsibility Model */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-500" /> Shared Responsibility Model
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
            In cloud computing, <strong>security responsibilities are shared</strong> between the cloud provider and the customer. The provider secures the cloud infrastructure; the customer secures their data, configurations, and access.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-gray-900">Provider Responsibility (Security OF the Cloud)</h3>
              </div>
              <ul className="space-y-1 text-[11px] text-gray-600">
                <li>• Physical data center security</li>
                <li>• Hardware and networking infrastructure</li>
                <li>• Hypervisor and virtualization layer</li>
                <li>• Global network backbone protection</li>
              </ul>
            </div>
            <div className="p-3 sm:p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-gray-900">Customer Responsibility (Security IN the Cloud)</h3>
              </div>
              <ul className="space-y-1 text-[11px] text-gray-600">
                <li>• Data classification and encryption</li>
                <li>• IAM and access management</li>
                <li>• OS and application patching (IaaS)</li>
                <li>• Network configuration (security groups, ACLs)</li>
              </ul>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 mt-3 italic">Note: The exact division varies by service model — customers have more responsibility in IaaS and less in SaaS.</p>
        </div>

        {/* Cloud Deployment Models */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-500" /> Cloud Deployment Models
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {DEPLOYMENT_MODELS.map((m) => {
              const Icon = m.icon;
              const colors: Record<string, string> = {
                blue: "bg-blue-50 border-blue-200 text-blue-600",
                violet: "bg-violet-50 border-violet-200 text-violet-600",
                emerald: "bg-emerald-50 border-emerald-200 text-emerald-600",
                amber: "bg-amber-50 border-amber-200 text-amber-600",
              };
              return (
                <div key={m.name} className={`p-3 sm:p-4 rounded-xl border ${colors[m.color]}`}>
                  <Icon className="w-5 h-5 mb-2" />
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">{m.name}</h3>
                  <p className="text-[11px] text-gray-600 mb-2 leading-relaxed">{m.desc}</p>
                  <span className="text-[10px] text-gray-500 italic">{m.use}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Zero Trust Architecture */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-500" /> Zero Trust Architecture
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
            <strong>"Never trust, always verify."</strong> Zero Trust eliminates implicit trust in any user, device, or network — every access request is authenticated, authorized, and encrypted.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">
            {ZERO_TRUST_PRINCIPLES.map((z) => {
              const Icon = z.icon;
              return (
                <div key={z.title} className="p-3 sm:p-4 bg-sky-50 rounded-xl border border-sky-100 text-center">
                  <Icon className="w-5 h-5 text-sky-600 mx-auto mb-1.5" />
                  <h3 className="text-[11px] sm:text-xs font-bold text-gray-900 mb-1">{z.title}</h3>
                  <p className="text-[10px] text-gray-600 leading-tight">{z.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* IAM */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-500" /> IAM — Identity and Access Management
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
            IAM is the framework for managing digital identities and controlling access to cloud resources. It ensures the right people have the right access to the right resources.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {IAM_CONCEPTS.map((iam) => {
              const Icon = iam.icon;
              const colors: Record<string, string> = {
                violet: "bg-violet-50 border-violet-200 text-violet-600",
                blue: "bg-blue-50 border-blue-200 text-blue-600",
                emerald: "bg-emerald-50 border-emerald-200 text-emerald-600",
                amber: "bg-amber-50 border-amber-200 text-amber-600",
              };
              return (
                <div key={iam.name} className={`p-3 sm:p-4 rounded-xl border ${colors[iam.color]}`}>
                  <Icon className="w-5 h-5 mb-2" />
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">{iam.name}</h3>
                  <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">{iam.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* MFA */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Key className="w-4 h-4 text-sky-500" /> MFA — Multi-Factor Authentication
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
            MFA requires two or more verification factors — something you know (password), something you have (device), and something you are (biometric).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {MFA_TYPES.map((mfa) => {
              const Icon = mfa.icon;
              const colors: Record<string, string> = {
                blue: "bg-blue-50 border-blue-200 text-blue-600",
                violet: "bg-violet-50 border-violet-200 text-violet-600",
                emerald: "bg-emerald-50 border-emerald-200 text-emerald-600",
                amber: "bg-amber-50 border-amber-200 text-amber-600",
              };
              return (
                <div key={mfa.name} className={`p-3 sm:p-4 rounded-xl border ${colors[mfa.color]}`}>
                  <Icon className="w-5 h-5 mb-2" />
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">{mfa.name}</h3>
                  <p className="text-[11px] text-gray-600 mb-2 leading-relaxed">{mfa.desc}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    mfa.security === "Very High" ? "bg-emerald-100 text-emerald-700" :
                    mfa.security === "High" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                  }`}>{mfa.security}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SOC Basics */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4 text-sky-500" /> SOC — Security Operations Center
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            A <strong>SOC</strong> is a centralized team responsible for monitoring, detecting, analyzing, and responding to security incidents 24/7. SOC analysts use SIEM (Security Information and Event Management) tools like Splunk, ELK Stack, and Azure Sentinel to correlate logs, generate alerts, and investigate threats. Key SOC tiers: Tier 1 (Triage), Tier 2 (Investigation), Tier 3 (Threat Hunting & Forensics).
          </p>
        </div>

        {/* Cloud Threats */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-sky-500" /> Cloud Security Threats
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {CLOUD_THREATS.map((t) => {
              const Icon = t.icon;
              const colors: Record<string, string> = {
                red: "bg-red-50 border-red-200 text-red-600",
                rose: "bg-rose-50 border-rose-200 text-rose-600",
                orange: "bg-orange-50 border-orange-200 text-orange-600",
                amber: "bg-amber-50 border-amber-200 text-amber-600",
              };
              return (
                <div key={t.threat} className={`p-3 sm:p-4 rounded-xl border ${colors[t.color]}`}>
                  <Icon className="w-5 h-5 mb-2" />
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">{t.threat}</h3>
                  <p className="text-[11px] text-gray-600 leading-relaxed">{t.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-500" /> Cloud Security Best Practices
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {BEST_PRACTICES.map((bp, i) => (
              <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                <span>{bp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-500" /> Interview Questions
          </h2>
          <div className="space-y-3">
            {INTERVIEW_QS.map((qa, i) => (
              <div key={i} className="p-3 sm:p-4 bg-sky-50 rounded-xl border border-sky-100">
                <p className="text-xs sm:text-sm font-bold text-gray-800 mb-1">Q{i + 1}: {qa.q}</p>
                <p className="text-[11px] sm:text-xs text-sky-700">A: {qa.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
