"use client";

import SidebarShell from "../components/SidebarShell";

const config = {
  title: "Architecture",
  icon: "CA",
  basePath: "/tools/arch",
  accent: "cyan" as const,
  categories: [
    {
      title: "Fundamentals",
      items: [
        { name: "Overview", href: "/tools/arch/fundamentals" },
        { name: "CPU Components", href: "/tools/arch/cpu-organization" },
        { name: "Register Organization", href: "/tools/arch/register-organization" },
        { name: "Performance Metrics", href: "/tools/arch/performance-metrics" },
      ],
    },
    {
      title: "CPU Organization",
      items: [
        { name: "ALU Design", href: "/tools/arch/alu" },
        { name: "Control Unit", href: "/tools/arch/control-unit" },
        { name: "Bus Architecture", href: "/tools/arch/bus-architecture" },
        { name: "Microprogramming", href: "/tools/arch/microprogramming" },
      ],
    },
    {
      title: "Instruction Set",
      items: [
        { name: "Instruction Formats", href: "/tools/arch/instruction-formats" },
        { name: "Addressing Modes", href: "/tools/arch/addressing-modes" },
        { name: "RISC vs CISC", href: "/tools/arch/risc-vs-cisc" },
        { name: "Instruction Execution", href: "/tools/arch/instruction-execution" },
      ],
    },
    {
      title: "Memory System",
      items: [
        { name: "Memory Hierarchy", href: "/tools/arch/memory-hierarchy" },
        { name: "Cache Memory", href: "/tools/arch/cache-memory" },
        { name: "Cache Mapping", href: "/tools/arch/cache-mapping" },
        { name: "Virtual Memory", href: "/tools/arch/virtual-memory" },
        { name: "Paging", href: "/tools/arch/paging" },
        { name: "Segmentation", href: "/tools/arch/segmentation" },
      ],
    },
    {
      title: "Arithmetic",
      items: [
        { name: "Booth's Algorithm", href: "/tools/arch/booths-algorithm", sim: true },
        { name: "Binary Arithmetic", href: "/tools/arch/binary-arithmetic" },
        { name: "Floating Point", href: "/tools/arch/floating-point" },
        { name: "Signed Numbers", href: "/tools/arch/signed-numbers" },
      ],
    },
    {
      title: "Pipelining",
      items: [
        { name: "Pipeline Stages", href: "/tools/arch/pipelining" },
        { name: "Data Hazards", href: "/tools/arch/data-hazards" },
        { name: "Pipeline Optimization", href: "/tools/arch/pipeline-optimization" },
      ],
    },
    {
      title: "Parallel Computing",
      items: [
        { name: "Overview", href: "/tools/arch/parallel-processing" },
        { name: "Flynn's Taxonomy", href: "/tools/arch/flynn-classification" },
        { name: "SIMD & MIMD", href: "/tools/arch/simd-mimd" },
        { name: "GPU Basics", href: "/tools/arch/gpu-basics" },
        { name: "Multiprocessors", href: "/tools/arch/multiprocessors" },
      ],
    },
    {
      title: "I/O Systems",
      items: [
        { name: "I/O Organization", href: "/tools/arch/io-organization" },
        { name: "Interrupts", href: "/tools/arch/interrupts" },
        { name: "DMA", href: "/tools/arch/dma" },
      ],
    },
  ],
};

export default function ArchLayout({ children }: { children: React.ReactNode }) {
  return <SidebarShell config={config}>{children}</SidebarShell>;
}
