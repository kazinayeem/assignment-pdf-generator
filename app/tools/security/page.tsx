"use client";

import { ShieldAlert, Target, BookOpen, Zap } from "lucide-react";
import { SubjectIndexPage } from "@/components/tools/subject-index-page";

const categories = [
  {
    category: "Foundations",
    topics: [
      { name: "Security Fundamentals", href: "/tools/security/fundamentals", icon: "🔒", difficulty: "Beginner" as const, duration: "40 min" },
      { name: "Cryptography", href: "/tools/security/cryptography", icon: "🔐", difficulty: "Intermediate" as const, duration: "55 min" },
      { name: "Hashing & Signatures", href: "/tools/security/hashing", icon: "🔑", difficulty: "Intermediate" as const, duration: "45 min" },
      { name: "SSL/TLS", href: "/tools/security/ssl-tls", icon: "🛡️", difficulty: "Intermediate" as const, duration: "40 min" },
    ],
  },
  {
    category: "Web & Network",
    topics: [
      { name: "Web Security", href: "/tools/security/web-security", icon: "🌐", difficulty: "Intermediate" as const, duration: "50 min" },
      { name: "SQL Injection", href: "/tools/security/sql-injection", icon: "💉", sim: true, difficulty: "Advanced" as const, duration: "55 min" },
      { name: "XSS Attacks", href: "/tools/security/xss", icon: "🐛", sim: true, difficulty: "Advanced" as const, duration: "50 min" },
      { name: "Network Security", href: "/tools/security/network-security", icon: "🔗", difficulty: "Intermediate" as const, duration: "45 min" },
      { name: "Firewalls", href: "/tools/security/firewalls", icon: "🧱", difficulty: "Intermediate" as const, duration: "48 min" },
      { name: "VPN", href: "/tools/security/vpn", icon: "🔒", difficulty: "Intermediate" as const, duration: "40 min" },
    ],
  },
  {
    category: "Advanced",
    topics: [
      { name: "Wireshark", href: "/tools/security/wireshark", icon: "📡", difficulty: "Advanced" as const, duration: "60 min" },
      { name: "Malware & Threats", href: "/tools/security/malware", icon: "🦠", difficulty: "Advanced" as const, duration: "50 min" },
      { name: "Ethical Hacking", href: "/tools/security/ethical-hacking", icon: "🎯", difficulty: "Advanced" as const, duration: "55 min" },
      { name: "Cloud Security", href: "/tools/security/cloud-security", icon: "☁️", difficulty: "Advanced" as const, duration: "48 min" },
    ],
  },
];

export default function SecurityPage() {
  return (
    <SubjectIndexPage
      badge="Cyber Security"
      badgeIcon={ShieldAlert}
      title="Cyber Security"
      description="Learn encryption, web security, ethical hacking, and defense strategies through interactive labs and simulations."
      accent="red"
      difficulty="Advanced"
      progress={15}
      lessonsCompleted="1 of 14 lessons"
      estimatedDuration="36 hours total"
      stats={[
        { label: "Core Topics", value: 14, icon: BookOpen },
        { label: "Simulations", value: "6+", icon: Zap },
        { label: "Interview Qs", value: "100+", icon: Target },
        { label: "Labs & Demos", value: "20+", icon: ShieldAlert },
      ]}
      actions={[
        { label: "Start Learning", href: "/tools/security/fundamentals", variant: "primary" },
        { label: "SQL Injection Lab", href: "/tools/security/sql-injection", variant: "secondary" },
      ]}
      categories={categories}
      topicGradient="from-red-500 to-rose-600"
    />
  );
}
