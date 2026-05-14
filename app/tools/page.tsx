// app/learn/page.tsx
"use client";
import Link from "next/link";
import {
  Cpu,
  Database,
  ShieldAlert,
  BrainCircuit,
  MemoryStick,
  Code2,
  Network,
  Blocks,
  Globe,
  Microchip,
  GitFork,
} from "lucide-react";

const topics = [
  {
    title: "Operating Systems",
    desc: "CPU scheduling, memory management, deadlock.",
    icon: Cpu,
    href: "/tools/os",
  },
  {
    title: "Data Structures",
    desc: "Array, Linked List, Tree, Graph, Stack & Queue.",
    icon: Database,
    href: "/tools/dsa",
  },
  {
    title: "Algorithms",
    desc: "Sorting, searching, greedy, DP and more.",
    icon: BrainCircuit,
    href: "/tools/algorithms",
  },
  {
    title: "Computer Networks",
    desc: "OSI, TCP/IP, routing and protocols.",
    icon: Network,
    href: "/tools/network",
  },
  {
    title: "Database Systems",
    desc: "SQL, normalization, ERD and queries.",
    icon: MemoryStick,
    href: "/tools/database",
  },
  {
    title: "Cyber Security",
    desc: "Encryption, authentication and security basics.",
    icon: ShieldAlert,
    href: "/tools/security",
  },
  {
    title: "Computer Architecture",
    desc: "CPU design, memory hierarchy, pipelining, ISA.",
    icon: Microchip,
    href: "/tools/arch",
  },
  {
    title: "Theory of Computing",
    desc: "DFA, NFA, regex, Turing machines, automata.",
    icon: GitFork,
    href: "/tools/theory-of-computing",
  },
  {
    title: "Software Engineering",
    desc: "SDLC, UML, Agile and system design.",
    icon: Blocks,
    href: "/tools/swe",
  },
  {
    title: "Programming",
    desc: "C, C++, JavaScript, Python and Java.",
    icon: Code2,
    href: "/tools/programming",
  },
  {
    title: "Web Development",
    desc: "Frontend, backend and full-stack roadmap.",
    icon: Globe,
    href: "/tools/web",
  },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-[#eef3f8] px-6 py-12">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[5px] text-slate-500">
            Learn By Doing
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            CSE & SWE Learning Hub
          </h1>
        </div>

        <button className="rounded-full border border-sky-200 bg-white px-5 py-2 text-sm font-semibold text-sky-600 shadow-sm transition hover:bg-sky-50">
          View All
        </button>
      </div>

      {/* Grid */}
      <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
        {topics.map((item, index) => {
          const Icon = item.icon;

          return (
            <Link key={index} href={item.href}>
              <div className="group relative overflow-hidden rounded-[30px] border border-white/40 bg-white p-8 shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
                
                {/* Glow Effect */}
                <div className="absolute right-[-40px] top-[-40px] h-32 w-32 rounded-full bg-sky-100 blur-3xl transition group-hover:bg-sky-200" />

                {/* Icon */}
                <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 shadow-inner">
                  <Icon className="h-8 w-8 text-sky-600" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold text-slate-900">
                    {item.title}
                  </h2>

                  <p className="mt-3 text-base leading-7 text-slate-500">
                    {item.desc}
                  </p>
                </div>

                {/* Button */}
                <div className="relative z-10 mt-10 flex items-center justify-end">
                  <button className="rounded-full bg-sky-50 px-5 py-2 text-lg font-semibold text-sky-600 transition hover:bg-sky-100">
                    Explore →
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}