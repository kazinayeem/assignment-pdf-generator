"use client";

import { Network, Target, BookOpen } from "lucide-react";
import { SubjectIndexPage } from "@/components/tools/subject-index-page";

const networkTopics = [
  {
    category: "Network Fundamentals",
    topics: [
      { name: "Network Basics", href: "/tools/network/basics", icon: "🌐", difficulty: "Beginner" as const, duration: "30 min" },
      { name: "OSI Model", href: "/tools/network/osi-model", icon: "📡", difficulty: "Beginner" as const, duration: "35 min" },
      { name: "TCP/IP", href: "/tools/network/tcp-ip", icon: "🔗", difficulty: "Intermediate" as const, duration: "40 min" },
      { name: "TCP vs UDP", href: "/tools/network/tcp-udp", icon: "⚡", difficulty: "Intermediate" as const, duration: "30 min" },
    ],
  },
  {
    category: "Addressing & Protocols",
    topics: [
      { name: "IP Addressing", href: "/tools/network/ip-addressing", icon: "🔢", difficulty: "Intermediate" as const, duration: "45 min" },
      { name: "Subnetting", href: "/tools/network/subnetting", icon: "🧮", difficulty: "Advanced" as const, duration: "50 min" },
      { name: "DNS", href: "/tools/network/dns", icon: "📋", difficulty: "Intermediate" as const, duration: "35 min" },
      { name: "HTTP/HTTPS", href: "/tools/network/http", icon: "🔒", difficulty: "Intermediate" as const, duration: "40 min" },
      { name: "Subnet Calculator", href: "/tools/network/simulations/subnet-calculator", icon: "🖥️", sim: true, difficulty: "Intermediate" as const, duration: "20 min" },
    ],
  },
];

export default function NetworkPage() {
  return (
    <SubjectIndexPage
      badge="Computer Networks"
      badgeIcon={Network}
      title="Computer Networks"
      description="Learn OSI model, TCP/IP, routing, DNS, subnetting, and network protocols with interactive tools."
      accent="blue"
      difficulty="Intermediate"
      progress={18}
      lessonsCompleted="1 of 8 lessons"
      timeRemaining="~16 hours"
      estimatedDuration="20 hours total"
      stats={[
        { label: "Topics", value: 9, icon: Network },
        { label: "Simulators", value: 2, icon: Target },
        { label: "Interview Qs", value: "40+", icon: BookOpen },
        { label: "Categories", value: 2, icon: BookOpen },
      ]}
      actions={[
        { label: "Start Learning", href: "/tools/network/basics", variant: "primary" },
        { label: "Subnet Calculator", href: "/tools/network/simulations/subnet-calculator", variant: "secondary" },
      ]}
      categories={networkTopics}
      topicGradient="from-blue-500 to-cyan-500"
    />
  );
}
