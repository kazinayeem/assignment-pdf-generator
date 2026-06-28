"use client";

import { Microchip, Cpu, BookOpen, Target } from "lucide-react";
import { SubjectIndexPage } from "@/components/tools/subject-index-page";

const categories = [
  {
    category: "Fundamentals",
    topics: [
      { name: "Overview", href: "/tools/arch/fundamentals", icon: "📚", difficulty: "Beginner" as const, duration: "40 min" },
      { name: "CPU Components", href: "/tools/arch/cpu-organization", icon: "🖥️", difficulty: "Beginner" as const, duration: "45 min" },
      { name: "Register Organization", href: "/tools/arch/register-organization", icon: "📋", difficulty: "Beginner" as const, duration: "35 min" },
      { name: "Performance Metrics", href: "/tools/arch/performance-metrics", icon: "📊", difficulty: "Intermediate" as const, duration: "40 min" },
    ],
  },
  {
    category: "CPU Organization",
    topics: [
      { name: "ALU Design", href: "/tools/arch/alu", icon: "⚡", difficulty: "Intermediate" as const, duration: "50 min" },
      { name: "Control Unit", href: "/tools/arch/control-unit", icon: "🎛️", difficulty: "Intermediate" as const, duration: "45 min" },
      { name: "Bus Architecture", href: "/tools/arch/bus-architecture", icon: "🚌", difficulty: "Intermediate" as const, duration: "40 min" },
      { name: "Microprogramming", href: "/tools/arch/microprogramming", icon: "🔧", difficulty: "Advanced" as const, duration: "55 min" },
    ],
  },
  {
    category: "Instruction Set",
    topics: [
      { name: "Instruction Formats", href: "/tools/arch/instruction-formats", icon: "📝", difficulty: "Intermediate" as const, duration: "42 min" },
      { name: "Addressing Modes", href: "/tools/arch/addressing-modes", icon: "🎯", sim: true, difficulty: "Intermediate" as const, duration: "48 min" },
      { name: "RISC vs CISC", href: "/tools/arch/risc-vs-cisc", icon: "⚖️", difficulty: "Intermediate" as const, duration: "40 min" },
      { name: "Instruction Execution", href: "/tools/arch/instruction-execution", icon: "▶️", sim: true, difficulty: "Intermediate" as const, duration: "45 min" },
    ],
  },
  {
    category: "Memory System",
    topics: [
      { name: "Memory Hierarchy", href: "/tools/arch/memory-hierarchy", icon: "🏗️", sim: true, difficulty: "Intermediate" as const, duration: "50 min" },
      { name: "Cache Memory", href: "/tools/arch/cache-memory", icon: "💾", difficulty: "Intermediate" as const, duration: "45 min" },
      { name: "Cache Mapping", href: "/tools/arch/cache-mapping", icon: "🗺️", sim: true, difficulty: "Advanced" as const, duration: "55 min" },
      { name: "Virtual Memory", href: "/tools/arch/virtual-memory", icon: "🌐", difficulty: "Advanced" as const, duration: "50 min" },
      { name: "Paging", href: "/tools/arch/paging", icon: "📄", difficulty: "Advanced" as const, duration: "48 min" },
      { name: "Segmentation", href: "/tools/arch/segmentation", icon: "📑", difficulty: "Advanced" as const, duration: "45 min" },
    ],
  },
  {
    category: "Arithmetic & Pipelining",
    topics: [
      { name: "Booth's Algorithm", href: "/tools/arch/booths-algorithm", icon: "✖️", sim: true, difficulty: "Advanced" as const, duration: "55 min" },
      { name: "Binary Arithmetic", href: "/tools/arch/binary-arithmetic", icon: "🔢", difficulty: "Intermediate" as const, duration: "40 min" },
      { name: "Floating Point", href: "/tools/arch/floating-point", icon: "🔣", difficulty: "Advanced" as const, duration: "50 min" },
      { name: "Pipeline Stages", href: "/tools/arch/pipelining", icon: "🔄", sim: true, difficulty: "Advanced" as const, duration: "52 min" },
      { name: "Data Hazards", href: "/tools/arch/data-hazards", icon: "⚠️", difficulty: "Advanced" as const, duration: "48 min" },
    ],
  },
  {
    category: "Parallel & I/O",
    topics: [
      { name: "Parallel Computing", href: "/tools/arch/parallel-processing", icon: "🔀", difficulty: "Advanced" as const, duration: "55 min" },
      { name: "Flynn's Taxonomy", href: "/tools/arch/flynn-classification", icon: "📐", difficulty: "Intermediate" as const, duration: "35 min" },
      { name: "GPU Basics", href: "/tools/arch/gpu-basics", icon: "🎮", difficulty: "Advanced" as const, duration: "45 min" },
      { name: "I/O Organization", href: "/tools/arch/io-organization", icon: "🔌", difficulty: "Intermediate" as const, duration: "42 min" },
      { name: "Interrupts", href: "/tools/arch/interrupts", icon: "🔔", difficulty: "Intermediate" as const, duration: "40 min" },
    ],
  },
];

export default function ArchPage() {
  return (
    <SubjectIndexPage
      badge="Computer Architecture"
      badgeIcon={Microchip}
      title="Computer Architecture"
      description="Master CPU design, memory systems, instruction sets, pipelining, and parallel computing through interactive simulations."
      accent="cyan"
      difficulty="Advanced"
      progress={31}
      lessonsCompleted="13 of 42 lessons"
      timeRemaining="~38 hours"
      estimatedDuration="56 hours total"
      stats={[
        { label: "Topics", value: "50+", icon: BookOpen },
        { label: "Simulators", value: "12+", icon: Cpu },
        { label: "Demos", value: 8, icon: Microchip },
        { label: "Interview Qs", value: "200+", icon: Target },
      ]}
      actions={[
        { label: "Start Learning", href: "/tools/arch/fundamentals", variant: "primary" },
        { label: "Cache Simulator", href: "/tools/arch/cache-mapping", variant: "secondary" },
      ]}
      categories={categories}
      topicGradient="from-cyan-500 to-blue-600"
    />
  );
}
