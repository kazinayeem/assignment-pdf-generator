import {
  BookOpen,
  BrainCircuit,
  Cpu,
  Database,
  Globe,
  Microchip,
  Network,
  ShieldAlert,
  Code2,
  Blocks,
  GitFork,
  FileText,
  FilePlus,
  Zap,
  Shield,
  Users,
  Star,
  Rocket,
  Smartphone,
  Cloud,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export type ToolItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  desc: string;
  color: string;
  tag?: "new" | "popular" | "beta";
};

export type CategoryItem = {
  name: string;
  tools: string[];
  icon: LucideIcon;
  color: string;
  accent: string;
};

export const ALL_TOOLS: ToolItem[] = [
  { name: "Operating Systems", href: "/tools/os", icon: Cpu, desc: "CPU scheduling, memory, deadlock", color: "from-sky-500 to-blue-600" },
  { name: "Data Structures", href: "/tools/dsa", icon: Database, desc: "Array, Linked List, Tree, Graph", color: "from-violet-500 to-purple-600" },
  { name: "Algorithms", href: "/tools/algorithms", icon: BrainCircuit, desc: "Sorting, searching, DP", color: "from-emerald-500 to-teal-600" },
  { name: "Computer Networks", href: "/tools/network", icon: Network, desc: "OSI, TCP/IP, routing", color: "from-blue-500 to-indigo-600" },
  { name: "Database Systems", href: "/tools/database", icon: Database, desc: "SQL, normalization, ERD", color: "from-orange-500 to-amber-600" },
  { name: "Cyber Security", href: "/tools/security", icon: ShieldAlert, desc: "Encryption, auth, security", color: "from-red-500 to-rose-600" },
  { name: "Computer Arch.", href: "/tools/arch", icon: Microchip, desc: "CPU design, memory, pipelining", color: "from-cyan-500 to-teal-600" },
  { name: "Theory of Comp.", href: "/tools/theory-of-computing", icon: GitFork, desc: "DFA, NFA, regex, Turing", color: "from-indigo-500 to-purple-600" },
  { name: "Software Eng.", href: "/tools/swe", icon: Blocks, desc: "SDLC, UML, Agile", color: "from-indigo-500 to-blue-600" },
  { name: "Programming", href: "/tools/programming", icon: Code2, desc: "C, C++, JS, Python, Java", color: "from-pink-500 to-rose-600" },
  { name: "Web Development", href: "/tools/web", icon: Globe, desc: "Frontend, backend, full-stack", color: "from-teal-500 to-emerald-600" },
  { name: "Data Science", href: "/tools/data-science", icon: BarChart3, desc: "Python, ML, deep learning, NLP", color: "from-yellow-500 to-orange-600" },
  { name: "DevOps", href: "/tools/devops", icon: Cloud, desc: "Docker, K8s, CI/CD, cloud", color: "from-blue-500 to-cyan-600" },
];

export const FEATURES: ToolItem[] = [
  { name: "Assignment Cover", href: "/assignment", icon: FileText, desc: "Generate official DIU covers in seconds with auto-filled student profiles.", color: "from-brand to-brand-secondary", tag: "popular" as const },
  { name: "CV Builder", href: "/cv-builder", icon: FilePlus, desc: "Build ATS-friendly Europass-style CVs optimized for recruiters.", color: "from-success to-emerald-600", tag: "new" as const },
  { name: "Lab Report", href: "/lab-report", icon: BookOpen, desc: "Create professionally formatted lab reports matching DIU standards.", color: "from-brand-secondary to-violet-600" },
];

export const CATEGORIES: CategoryItem[] = [
  { name: "Core CS", tools: ["Operating Systems", "Data Structures", "Algorithms", "Computer Networks"], icon: BrainCircuit, color: "from-brand to-brand-secondary", accent: "var(--brand)" },
  { name: "Systems", tools: ["Database Systems", "Cyber Security", "Computer Arch.", "Theory of Comp."], icon: Cpu, color: "from-cyan-500 to-brand-accent", accent: "var(--cf-accent)" },
  { name: "Development", tools: ["Software Eng.", "Programming", "Web Development"], icon: Code2, color: "from-success to-emerald-600", accent: "var(--cf-success)" },
  { name: "Specialized", tools: ["Data Science", "DevOps"], icon: Zap, color: "from-warning to-amber-600", accent: "var(--cf-warning)" },
];

export const WHY_CHOOSE = [
  { icon: Shield, title: "Official DIU Formats", desc: "Professionally formatted covers and reports matching DIU standards.", color: "from-brand to-brand-secondary" },
  { icon: Zap, title: "One-Click Generation", desc: "Generate PDFs instantly with auto-saved student profile data.", color: "from-warning to-orange-600" },
  { icon: Users, title: "Auto-Saved Profiles", desc: "Your details are saved automatically — never re-enter info.", color: "from-success to-emerald-600" },
  { icon: Star, title: "ATS-Friendly CV", desc: "Build CVs optimized for applicant tracking systems.", color: "from-brand-secondary to-violet-600" },
  { icon: Rocket, title: "Fast Academic Workflow", desc: "From cover to submission in under 60 seconds.", color: "from-pink-500 to-rose-600" },
  { icon: BrainCircuit, title: "Interactive CS Tools", desc: "Master DSA, OS, Algorithms, and more with simulators.", color: "from-brand-accent to-cyan-600" },
  { icon: Smartphone, title: "Mobile Responsive", desc: "Full functionality on desktop, tablet, and phone.", color: "from-sky-500 to-blue-600" },
  { icon: Cloud, title: "Cloud-Saved Data", desc: "Access your documents anywhere, anytime.", color: "from-indigo-500 to-purple-600" },
];

export const HERO_STATS = [
  { label: "Students", value: "2,500+" },
  { label: "Reports Generated", value: "18,000+" },
  { label: "CVs Built", value: "4,200+" },
];

export const HERO_DASHBOARD_CARDS = [
  { icon: FileText, label: "Assignment Cover", sub: "DIU Format", href: "/assignment", color: "from-[#6D5DF6] to-[#8B5CF6]", delay: 0 },
  { icon: FilePlus, label: "ATS CV Builder", sub: "Europass Style", href: "/cv-builder", color: "from-emerald-400 to-teal-500", delay: 0.1 },
  { icon: BookOpen, label: "Lab Report", sub: "Official Format", href: "/lab-report", color: "from-violet-400 to-purple-500", delay: 0.2 },
  { icon: BrainCircuit, label: "CS Learning Tools", sub: "13+ Topics", href: "/tools", color: "from-[#06B6D4] to-cyan-500", delay: 0.3 },
];

export const PRICING_FEATURES = [
  "Unlimited Assignment Covers",
  "Unlimited Lab Reports",
  "CV Builder Access",
  "Learning Tools Access",
  "Responsive Dashboard",
  "Auto Save Features",
  "PDF Export",
  "DIU Official Formats",
];

export const NAV_LINKS = [
  { name: "Tools", href: "/tools" },
  { name: "Interview", href: "/interview" },
  { name: "Career", href: "/career" },
  { name: "Calculators", href: "/calculators" },
  { name: "DevTools", href: "/developer-tools" },
  { name: "Assignment", href: "/assignment" },
  { name: "CV Builder", href: "/cv-builder" },
  { name: "Lab Report", href: "/lab-report" },
];
