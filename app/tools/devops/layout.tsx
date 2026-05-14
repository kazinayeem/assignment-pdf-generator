"use client";

import SidebarShell from "../components/SidebarShell";

const config = {
  title: "DevOps",
  icon: "DO",
  basePath: "/tools/devops",
  accent: "blue" as const,
  categories: [
    {
      title: "Fundamentals",
      items: [
        { name: "Linux", href: "/tools/devops/linux" },
        { name: "Git", href: "/tools/devops/git" },
      ],
    },
    {
      title: "Containers & CI/CD",
      items: [
        { name: "Docker", href: "/tools/devops/docker", sim: true },
        { name: "Kubernetes", href: "/tools/devops/kubernetes", sim: true },
        { name: "GitHub Actions", href: "/tools/devops/github-actions", sim: true },
        { name: "Jenkins", href: "/tools/devops/jenkins" },
      ],
    },
    {
      title: "Cloud & Infrastructure",
      items: [
        { name: "AWS", href: "/tools/devops/aws" },
        { name: "Terraform", href: "/tools/devops/terraform" },
        { name: "Ansible", href: "/tools/devops/ansible" },
      ],
    },
    {
      title: "Advanced",
      items: [
        { name: "Monitoring", href: "/tools/devops/monitoring" },
        { name: "DevSecOps", href: "/tools/devops/devsecops" },
      ],
    },
  ],
};

export default function DevopsLayout({ children }: { children: React.ReactNode }) {
  return <SidebarShell config={config}>{children}</SidebarShell>;
}
