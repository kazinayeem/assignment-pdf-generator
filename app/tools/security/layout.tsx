"use client";

import SidebarShell from "../components/SidebarShell";

const config = {
  title: "Security Lab",
  icon: "SL",
  basePath: "/tools/security",
  accent: "violet" as const,
  categories: [
    {
      title: "Cryptography",
      items: [
        { name: "Cryptography", href: "/tools/security/cryptography", sim: true },
        { name: "Hashing & Signatures", href: "/tools/security/hashing" },
        { name: "SSL/TLS", href: "/tools/security/ssl-tls" },
      ],
    },
    {
      title: "Web Security",
      items: [
        { name: "Web Security", href: "/tools/security/web-security" },
        { name: "SQL Injection", href: "/tools/security/sql-injection", sim: true },
        { name: "XSS Attacks", href: "/tools/security/xss", sim: true },
      ],
    },
    {
      title: "Network Security",
      items: [
        { name: "Network Security", href: "/tools/security/network-security" },
        { name: "Firewalls", href: "/tools/security/firewalls", sim: true },
        { name: "VPN", href: "/tools/security/vpn" },
        { name: "Wireshark", href: "/tools/security/wireshark", sim: true },
      ],
    },
    {
      title: "System & Modern",
      items: [
        { name: "Security Fundamentals", href: "/tools/security/fundamentals" },
        { name: "Malware & Threats", href: "/tools/security/malware" },
        { name: "Ethical Hacking", href: "/tools/security/ethical-hacking" },
        { name: "Cloud Security", href: "/tools/security/cloud-security" },
      ],
    },
  ],
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return <SidebarShell config={config}>{children}</SidebarShell>;
}
