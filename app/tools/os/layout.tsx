"use client";

import SidebarShell from "../components/SidebarShell";
import { OS_REGISTRY, getTopicHref } from "@/lib/learning/topics-registry";

const config = {
  title: "OS Learning",
  icon: "OS",
  basePath: "/tools/os",
  accent: "indigo" as const,
  categories: OS_REGISTRY.categories.map((cat) => ({
    title: cat.title,
    items: cat.topics.map((t) => ({
      name: t.title,
      href: getTopicHref("os", t),
      sim: t.hasSimulator,
    })),
  })),
};

export default function OSLayout({ children }: { children: React.ReactNode }) {
  return <SidebarShell config={config}>{children}</SidebarShell>;
}
