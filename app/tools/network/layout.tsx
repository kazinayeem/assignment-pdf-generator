"use client";

import SidebarShell from "../components/SidebarShell";

const config = {
  title: "Network Learning",
  icon: "NET",
  basePath: "/tools/network",
  accent: "cyan" as const,
  categories: [
    {
      title: "Networking Basics",
      items: [
        { name: "Network Basics", href: "/tools/network/basics" },
        { name: "OSI Model", href: "/tools/network/osi-model" },
        { name: "TCP/IP Model", href: "/tools/network/tcp-ip" },
        { name: "IP Addressing", href: "/tools/network/ip-addressing" },
      ],
    },
    {
      title: "Protocols & Transport",
      items: [
        { name: "TCP vs UDP", href: "/tools/network/tcp-udp" },
        { name: "DNS", href: "/tools/network/dns" },
        { name: "HTTP/HTTPS", href: "/tools/network/http" },
      ],
    },
    {
      title: "Network Tools",
      items: [
        { name: "Subnetting", href: "/tools/network/subnetting" },
        { name: "Subnet Calculator", href: "/tools/network/simulations/subnet-calculator" },
      ],
    },
  ],
};

export default function NetworkLayout({ children }: { children: React.ReactNode }) {
  return <SidebarShell config={config}>{children}</SidebarShell>;
}
