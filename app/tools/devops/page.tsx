"use client";

import { Cloud, Target, BookOpen, Container } from "lucide-react";
import { SubjectIndexPage } from "@/components/tools/subject-index-page";

const categories = [
  {
    category: "Foundations",
    topics: [
      { name: "Linux", href: "/tools/devops/linux", icon: "🐧", difficulty: "Beginner" as const, duration: "40 min" },
      { name: "Git", href: "/tools/devops/git", icon: "📦", difficulty: "Beginner" as const, duration: "35 min" },
    ],
  },
  {
    category: "Containers & CI/CD",
    topics: [
      { name: "Docker", href: "/tools/devops/docker", icon: "🐳", sim: true, difficulty: "Intermediate" as const, duration: "50 min" },
      { name: "Kubernetes", href: "/tools/devops/kubernetes", icon: "☸️", sim: true, difficulty: "Advanced" as const, duration: "60 min" },
      { name: "GitHub Actions", href: "/tools/devops/github-actions", icon: "⚡", sim: true, difficulty: "Intermediate" as const, duration: "45 min" },
      { name: "Jenkins", href: "/tools/devops/jenkins", icon: "🔧", difficulty: "Intermediate" as const, duration: "42 min" },
    ],
  },
  {
    category: "Infrastructure",
    topics: [
      { name: "AWS", href: "/tools/devops/aws", icon: "☁️", difficulty: "Intermediate" as const, duration: "55 min" },
      { name: "Terraform", href: "/tools/devops/terraform", icon: "🏗️", difficulty: "Advanced" as const, duration: "50 min" },
      { name: "Ansible", href: "/tools/devops/ansible", icon: "📋", difficulty: "Intermediate" as const, duration: "45 min" },
    ],
  },
  {
    category: "Operations",
    topics: [
      { name: "Monitoring", href: "/tools/devops/monitoring", icon: "📊", difficulty: "Intermediate" as const, duration: "40 min" },
      { name: "DevSecOps", href: "/tools/devops/devsecops", icon: "🔒", difficulty: "Advanced" as const, duration: "48 min" },
    ],
  },
];

export default function DevOpsPage() {
  return (
    <SubjectIndexPage
      badge="DevOps"
      badgeIcon={Cloud}
      title="DevOps"
      description="Master Docker, Kubernetes, CI/CD pipelines, cloud infrastructure, and monitoring for modern deployments."
      accent="cyan"
      difficulty="Intermediate"
      progress={19}
      lessonsCompleted="2 of 11 lessons"
      estimatedDuration="30 hours total"
      stats={[
        { label: "Topics", value: 11, icon: BookOpen },
        { label: "Simulators", value: 3, icon: Container },
        { label: "Labs", value: "15+", icon: Cloud },
        { label: "Guides", value: "8+", icon: Target },
      ]}
      actions={[
        { label: "Start Learning", href: "/tools/devops/linux", variant: "primary" },
        { label: "Docker Lab", href: "/tools/devops/docker", variant: "secondary" },
      ]}
      categories={categories}
      topicGradient="from-cyan-500 to-blue-600"
    />
  );
}
