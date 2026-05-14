"use client";

import SidebarShell from "../components/SidebarShell";

const config = {
  title: "OS Learning",
  icon: "OS",
  basePath: "/tools/os",
  accent: "indigo" as const,
  categories: [
    {
      title: "Process Management",
      items: [
        { name: "Process Management", href: "/tools/os/process-management", sim: true },
        { name: "CPU Scheduling", href: "/tools/os/cpu-scheduling", sim: true },
        { name: "Process Scheduling", href: "/tools/os/process-scheduling" },
        { name: "Deadlock Detection", href: "/tools/os/deadlock", sim: true },
      ],
    },
    {
      title: "Memory Management",
      items: [
        { name: "Memory Management", href: "/tools/os/memory-management", sim: true },
        { name: "Disk Scheduling", href: "/tools/os/disk-scheduling", sim: true },
      ],
    },
    {
      title: "Resource Allocation",
      items: [
        { name: "Banker's Algorithm", href: "/tools/os/bankers-algorithm", sim: true },
      ],
    },
  ],
};

export default function OSLayout({ children }: { children: React.ReactNode }) {
  return <SidebarShell config={config}>{children}</SidebarShell>;
}
