"use client";

import { Cpu, Target, BookOpen } from "lucide-react";
import { SubjectIndexPage } from "@/components/tools/subject-index-page";

const osTopics = [
  {
    category: "Process Management",
    topics: [
      { name: "Process Management", href: "/tools/os/process-management", icon: "⚙️", sim: true, difficulty: "Intermediate" as const, duration: "45 min", progress: 60 },
      { name: "CPU Scheduling", href: "/tools/os/cpu-scheduling", icon: "🎯", sim: true, difficulty: "Intermediate" as const, duration: "50 min", progress: 40 },
      { name: "Process Scheduling", href: "/tools/os/process-scheduling", icon: "⏱️", difficulty: "Beginner" as const, duration: "35 min" },
      { name: "Deadlock Detection", href: "/tools/os/deadlock", icon: "🚫", sim: true, difficulty: "Advanced" as const, duration: "55 min" },
    ],
  },
  {
    category: "Memory Management",
    topics: [
      { name: "Memory Management", href: "/tools/os/memory-management", icon: "📦", sim: true, difficulty: "Intermediate" as const, duration: "48 min" },
      { name: "Disk Scheduling", href: "/tools/os/disk-scheduling", icon: "💿", sim: true, difficulty: "Intermediate" as const, duration: "42 min" },
    ],
  },
  {
    category: "Resource Allocation",
    topics: [
      { name: "Banker's Algorithm", href: "/tools/os/bankers-algorithm", icon: "🏦", sim: true, difficulty: "Advanced" as const, duration: "60 min" },
    ],
  },
];

export default function OSPage() {
  return (
    <SubjectIndexPage
      badge="Operating Systems"
      badgeIcon={Cpu}
      title="Operating Systems"
      description="Master OS concepts, process scheduling, memory management, and synchronization for interviews and exams."
      accent="indigo"
      difficulty="Intermediate"
      progress={35}
      lessonsCompleted="3 of 7 lessons"
      timeRemaining="~16 hours"
      estimatedDuration="24 hours total"
      stats={[
        { label: "Simulators", value: "6", icon: Cpu },
        { label: "Interview Qs", value: "50+", icon: Target },
        { label: "Categories", value: 3, icon: BookOpen },
        { label: "Lessons", value: 7, icon: BookOpen },
      ]}
      actions={[
        { label: "Continue Learning", href: "/tools/os/process-management", variant: "primary" },
        { label: "CPU Scheduling", href: "/tools/os/cpu-scheduling", variant: "secondary" },
      ]}
      categories={osTopics}
      topicGradient="from-[#6D5DF6] to-[#8B5CF6]"
    />
  );
}
