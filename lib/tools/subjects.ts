import {
  Cpu, Database, BrainCircuit, Network, MemoryStick,
  ShieldAlert, Blocks, Code2, Globe, Microchip, GitFork,
  BarChart3, Cloud, Smartphone, Bot, type LucideIcon,
} from "lucide-react";
import type { AccentKey, Difficulty } from "./tokens";

export type SubjectMeta = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accent: AccentKey;
  difficulty: Difficulty;
  modules: number;
  lessons: number;
  hours: number;
  progress: number;
  topicCount: number;
  simulators?: number;
  interviewQuestions?: string;
  categories?: number;
};

export const TOOL_SUBJECTS: SubjectMeta[] = [
  { slug: "os", title: "Operating Systems", shortTitle: "OS", description: "CPU scheduling, memory management, deadlock, and process synchronization.", href: "/tools/os", icon: Cpu, accent: "indigo", difficulty: "Intermediate", modules: 3, lessons: 7, hours: 24, progress: 35, topicCount: 7, simulators: 6, interviewQuestions: "50+", categories: 3 },
  { slug: "dsa", title: "Data Structures", shortTitle: "DSA", description: "Arrays, linked lists, trees, graphs, stacks, queues, and core algorithms.", href: "/tools/dsa", icon: Database, accent: "violet", difficulty: "Intermediate", modules: 2, lessons: 8, hours: 32, progress: 28, topicCount: 8, interviewQuestions: "100+", categories: 2 },
  { slug: "algorithms", title: "Algorithms", shortTitle: "ALG", description: "Sorting, searching, greedy, dynamic programming, graphs, and interview patterns.", href: "/tools/algorithms", icon: BrainCircuit, accent: "emerald", difficulty: "Advanced", modules: 5, lessons: 22, hours: 48, progress: 42, topicCount: 22, simulators: 8, interviewQuestions: "150+", categories: 5 },
  { slug: "network", title: "Computer Networks", shortTitle: "NET", description: "OSI model, TCP/IP, routing, DNS, subnetting, and network protocols.", href: "/tools/network", icon: Network, accent: "blue", difficulty: "Intermediate", modules: 3, lessons: 8, hours: 20, progress: 18, topicCount: 8, simulators: 2, interviewQuestions: "40+", categories: 3 },
  { slug: "database", title: "Database Systems", shortTitle: "DB", description: "SQL, normalization, ERD, indexing, transactions, and query optimization.", href: "/tools/database", icon: MemoryStick, accent: "orange", difficulty: "Intermediate", modules: 2, lessons: 8, hours: 18, progress: 22, topicCount: 8, interviewQuestions: "60+", categories: 2 },
  { slug: "security", title: "Cyber Security", shortTitle: "SEC", description: "Encryption, authentication, firewalls, web security, and ethical hacking.", href: "/tools/security", icon: ShieldAlert, accent: "red", difficulty: "Advanced", modules: 4, lessons: 14, hours: 36, progress: 15, topicCount: 14, simulators: 4, interviewQuestions: "80+", categories: 4 },
  { slug: "arch", title: "Computer Architecture", shortTitle: "ARCH", description: "CPU design, memory hierarchy, pipelining, cache, and parallel computing.", href: "/tools/arch", icon: Microchip, accent: "cyan", difficulty: "Advanced", modules: 6, lessons: 42, hours: 56, progress: 31, topicCount: 42, simulators: 12, interviewQuestions: "200+", categories: 6 },
  { slug: "theory-of-computing", title: "Theory of Computing", shortTitle: "TOC", description: "DFA, NFA, regex, context-free grammars, and Turing machines.", href: "/tools/theory-of-computing", icon: GitFork, accent: "indigo", difficulty: "Advanced", modules: 2, lessons: 8, hours: 22, progress: 20, topicCount: 8, simulators: 5, interviewQuestions: "45+", categories: 2 },
  { slug: "swe", title: "Software Engineering", shortTitle: "SWE", description: "SDLC, UML diagrams, Agile methodologies, and system design principles.", href: "/tools/swe", icon: Blocks, accent: "indigo", difficulty: "Intermediate", modules: 4, lessons: 12, hours: 28, progress: 10, topicCount: 12, interviewQuestions: "70+", categories: 3 },
  { slug: "programming", title: "Programming", shortTitle: "PROG", description: "C, C++, JavaScript, Python, and Java fundamentals with practice.", href: "/tools/programming", icon: Code2, accent: "pink", difficulty: "Beginner", modules: 5, lessons: 20, hours: 40, progress: 12, topicCount: 20, categories: 5 },
  { slug: "web", title: "Web Development", shortTitle: "WEB", description: "Frontend, backend, full-stack development, and modern web frameworks.", href: "/tools/web", icon: Globe, accent: "teal", difficulty: "Intermediate", modules: 4, lessons: 16, hours: 36, progress: 8, topicCount: 16, categories: 4 },
  { slug: "data-science", title: "Data Science", shortTitle: "DS", description: "Python, pandas, machine learning, deep learning, NLP, and LLMs.", href: "/tools/data-science", icon: BarChart3, accent: "amber", difficulty: "Advanced", modules: 3, lessons: 12, hours: 44, progress: 25, topicCount: 12, simulators: 3, interviewQuestions: "55+", categories: 3 },
  { slug: "devops", title: "DevOps", shortTitle: "OPS", description: "Docker, Kubernetes, CI/CD pipelines, cloud infrastructure, and monitoring.", href: "/tools/devops", icon: Cloud, accent: "cyan", difficulty: "Intermediate", modules: 3, lessons: 11, hours: 30, progress: 19, topicCount: 11, simulators: 2, categories: 3 },
  { slug: "ai", title: "Artificial Intelligence", shortTitle: "AI", description: "Search, ML, deep learning, NLP, and large language models.", href: "/tools/data-science/machine-learning", icon: Bot, accent: "violet", difficulty: "Advanced", modules: 3, lessons: 10, hours: 36, progress: 12, topicCount: 6, interviewQuestions: "60+", categories: 2 },
  { slug: "mobile", title: "Mobile Development", shortTitle: "MOB", description: "React Native, Flutter, mobile UI/UX, and app store deployment.", href: "/tools/mobile", icon: Smartphone, accent: "pink", difficulty: "Intermediate", modules: 3, lessons: 8, hours: 32, progress: 5, topicCount: 5, categories: 2 },
];

export const TOOL_CATEGORIES = TOOL_SUBJECTS.map((s) => ({
  label: s.title,
  href: s.href,
  icon: s.icon,
  accent: s.accent,
  slug: s.slug,
}));

export function getSubjectBySlug(slug: string) {
  return TOOL_SUBJECTS.find((s) => s.slug === slug);
}

export function getSubjectByPath(pathname: string) {
  return TOOL_SUBJECTS.find((s) => pathname === s.href || pathname.startsWith(s.href + "/"));
}

export type HubFilter = "all" | "popular" | "recent" | "bookmarked" | "completed" | "beginner" | "intermediate" | "advanced";

export const HUB_FILTERS: { id: HubFilter; label: string }[] = [
  { id: "all", label: "All Subjects" },
  { id: "popular", label: "Popular" },
  { id: "recent", label: "Recently Updated" },
  { id: "bookmarked", label: "Bookmarked" },
  { id: "completed", label: "Completed" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];
