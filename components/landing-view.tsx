"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/lib/auth-store";
import {
  Sun,
  Moon,
  Menu,
  X,
  FileText,
  FlaskConical,
  BarChart3,
  UserSquare2,
  CalendarDays,
  LayoutGrid,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Star,
  Zap,
  Shield,
  Cloud,
  BookOpen,
  Sparkles,
  LogIn,
} from "lucide-react";

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const tools = [
  {
    icon: FileText,
    title: "Assignment Cover",
    description: "Generate perfectly formatted DIU assignment cover pages in seconds. Supports all departments.",
    href: "/assignment",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-100 dark:border-blue-900/50",
  },
  {
    icon: FlaskConical,
    title: "Lab Report Cover",
    description: "Create professional lab report covers with all required fields auto-filled from your profile.",
    href: "/lab-report",
    color: "text-violet-500",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    border: "border-violet-100 dark:border-violet-900/50",
  },
  {
    icon: BarChart3,
    title: "Lab Performance",
    description: "Track and document your lab performance marks with a clean, printable format.",
    href: "/lab-performance",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-100 dark:border-emerald-900/50",
  },
  {
    icon: UserSquare2,
    title: "CV Builder",
    description: "Build an ATS-friendly, professional CV tailored for fresh graduates and students.",
    href: "/cv-builder",
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    border: "border-orange-100 dark:border-orange-900/50",
  },
  {
    icon: CalendarDays,
    title: "Class Routine",
    description: "View your semester class schedule in a clean, organized weekly timetable.",
    href: "/routine",
    color: "text-pink-500",
    bg: "bg-pink-50 dark:bg-pink-950/40",
    border: "border-pink-100 dark:border-pink-900/50",
  },
  {
    icon: LayoutGrid,
    title: "Routine Builder",
    description: "Build and customize your own class routine with drag-and-drop simplicity.",
    href: "/routine-builder",
    color: "text-cyan-500",
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    border: "border-cyan-100 dark:border-cyan-900/50",
  },
];

const steps = [
  {
    step: "01",
    title: "Sign in with Google",
    description: "One-click sign in with your Google account. No passwords, no hassle.",
    icon: LogIn,
  },
  {
    step: "02",
    title: "Fill your profile once",
    description: "Enter your student ID, department, and semester. We remember it for every document.",
    icon: UserSquare2,
  },
  {
    step: "03",
    title: "Generate & download",
    description: "Pick a tool, hit generate, and download a print-ready PDF in under 10 seconds.",
    icon: Zap,
  },
];

const portalFeatures = [
  {
    icon: BookOpen,
    title: "My Courses",
    description: "See all your enrolled courses for the current semester in one place.",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/40",
  },
  {
    icon: UserSquare2,
    title: "Smart Profile",
    description: "Your academic profile auto-fills every document — fill once, use forever.",
    color: "text-violet-500",
    bg: "bg-violet-50 dark:bg-violet-950/40",
  },
  {
    icon: Cloud,
    title: "Cloud Sync",
    description: "Your data is securely stored and synced across all your devices instantly.",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
  },
  {
    icon: CalendarDays,
    title: "Class Routine",
    description: "Access your weekly class schedule anytime, anywhere, on any device.",
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/40",
  },
];

const testimonials = [
  {
    name: "Farhan Hossain",
    role: "CSE, Semester 6 — DIU",
    quote:
      "CampusFlow saves me at least 20 minutes every time I need to submit an assignment. The cover page is always perfect and I never have to re-type my info.",
    avatar: "FH",
    color: "bg-blue-500",
  },
  {
    name: "Nusrat Jahan",
    role: "EEE, Semester 4 — DIU",
    quote:
      "The CV Builder is genuinely impressive. I got my first internship interview within a week of using it. The ATS-friendly format makes a real difference.",
    avatar: "NJ",
    color: "bg-violet-500",
  },
  {
    name: "Rakibul Islam",
    role: "SWE, Semester 8 — DIU",
    quote:
      "I use the lab report cover and routine builder every single week. It's become part of my academic workflow. Can't imagine going back to doing it manually.",
    avatar: "RI",
    color: "bg-emerald-500",
  },
];

const faqs = [
  {
    q: "Is CampusFlow completely free?",
    a: "Yes. Every tool on CampusFlow is 100% free for all DIU students. There are no hidden fees, no premium tiers, and no credit card required.",
  },
  {
    q: "Do I need to create an account?",
    a: "You can use the manual tools without signing in. However, signing in with Google unlocks smart profile auto-fill, cloud sync, My Courses, and the CV Builder.",
  },
  {
    q: "Is my data safe?",
    a: "Your data is stored securely in Firebase Firestore with Google-grade security. We never sell or share your personal information with third parties.",
  },
  {
    q: "Which university formats are supported?",
    a: "CampusFlow currently supports Daffodil International University (DIU) official formats for assignment covers, lab reports, and lab performance sheets.",
  },
];

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      variants={fadeUp}
      className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
      >
        <span className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">{q}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-4">
          {a}
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LandingView() {
  const { isAuthenticated } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800/80 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image
                src="/logo_navbar.png"
                alt="CampusFlow"
                width={120}
                height={32}
                style={{ height: 32, width: "auto" }}
                priority
              />
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-7">
              <Link href="#features" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                How it works
              </Link>
              <Link href="#faq" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                FAQ
              </Link>
              <Link href="/about" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                About
              </Link>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Sign in / Dashboard */}
              {isAuthenticated ? (
                <Link
                  href="/student/mycourses"
                  className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Sign in <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden pb-4 pt-2 space-y-1 border-t border-gray-100 dark:border-gray-800"
            >
              {[
                { label: "Features", href: "#features" },
                { label: "How it works", href: "#how-it-works" },
                { label: "FAQ", href: "#faq" },
                { label: "About", href: "/about" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2">
                <Link
                  href={isAuthenticated ? "/student/mycourses" : "/login"}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold"
                >
                  {isAuthenticated ? "Dashboard" : "Sign in"} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </header>


      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-100/60 dark:bg-blue-900/20 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-violet-100/60 dark:bg-violet-900/20 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                Free for all DIU students
              </span>
            </motion.div>

            {/* Logo */}
            <motion.div variants={scaleIn} className="mb-8">
              <Image
                src="/logo.png"
                alt="CampusFlow"
                width={200}
                height={200}
                className="mx-auto drop-shadow-xl"
                priority
              />
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 dark:text-white max-w-4xl leading-[1.05]"
            >
              Your complete{" "}
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                academic
              </span>{" "}
              productivity platform
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed"
            >
              Generate assignment covers, lab reports, CVs, and class routines in seconds.
              Built for DIU students who value their time.
            </motion.p>

            {/* CTA buttons */}
            <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href={isAuthenticated ? "/student/mycourses" : "/login"}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-gray-900/10 dark:shadow-white/10"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get started free"}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                Explore tools
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl"
            >
              {[
                { value: "6+", label: "Free tools" },
                { value: "10s", label: "To generate" },
                { value: "100%", label: "Free forever" },
                { value: "DIU", label: "Official formats" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={scaleIn}
                  className="flex flex-col items-center p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
                >
                  <span className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">{stat.value}</span>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* ── FEATURES GRID ──────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400">
                All tools
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                Everything you need, in one place
              </h2>
              <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                Six purpose-built tools designed around the DIU academic workflow. All free, all instant.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <motion.div key={tool.href} variants={scaleIn}>
                    <Link
                      href={tool.href}
                      className={`group flex flex-col h-full p-6 rounded-2xl border ${tool.border} bg-white dark:bg-gray-900 hover:shadow-lg hover:shadow-gray-100 dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-1`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${tool.bg}`}>
                          <Icon className={`w-5 h-5 ${tool.color}`} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                          Free
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">{tool.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">
                        {tool.description}
                      </p>
                      <div className={`mt-4 flex items-center gap-1.5 text-xs font-semibold ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                        Open tool <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>


      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-500 dark:text-violet-400">
                Simple process
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                Up and running in 3 steps
              </h2>
              <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                No tutorials needed. Sign in, set up your profile once, and generate documents forever.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector line (desktop) */}
              <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-blue-200 via-violet-200 to-emerald-200 dark:from-blue-900/50 dark:via-violet-900/50 dark:to-emerald-900/50" />

              {steps.map((step, i) => {
                const Icon = step.icon;
                const colors = [
                  { text: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/40", num: "text-blue-600 dark:text-blue-400" },
                  { text: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/40", num: "text-violet-600 dark:text-violet-400" },
                  { text: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/40", num: "text-emerald-600 dark:text-emerald-400" },
                ];
                const c = colors[i];
                return (
                  <motion.div
                    key={step.step}
                    variants={fadeUp}
                    className="flex flex-col items-center text-center relative"
                  >
                    <div className={`relative z-10 w-20 h-20 rounded-2xl ${c.bg} flex items-center justify-center mb-6 shadow-sm`}>
                      <Icon className={`w-8 h-8 ${c.text}`} />
                      <span className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white dark:bg-gray-950 border-2 border-current ${c.num} text-[10px] font-black flex items-center justify-center`}>
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>


      {/* ── CV BUILDER HIGHLIGHT ───────────────────────────────────────────── */}
      <section className="py-24 bg-gray-950 dark:bg-black relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/10 to-transparent blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            {/* Left: text */}
            <div>
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold tracking-wide mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured tool
                </span>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight"
              >
                ATS-Friendly{" "}
                <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                  CV Builder
                </span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-5 text-gray-400 text-lg leading-relaxed"
              >
                Land your first internship or job with a CV that passes Applicant Tracking Systems and impresses hiring managers.
              </motion.p>

              <motion.ul variants={stagger} className="mt-8 space-y-4">
                {[
                  "ATS-optimized layout that recruiters love",
                  "Auto-fills from your CampusFlow profile",
                  "Clean, modern design — no clutter",
                  "Export to PDF in one click",
                  "Tailored for fresh graduates and students",
                  "Completely free, no watermarks",
                ].map((item) => (
                  <motion.li key={item} variants={fadeUp} className="flex items-center gap-3 text-gray-300 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div variants={fadeUp} className="mt-10">
                <Link
                  href="/cv-builder"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-gray-900 font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-white/10"
                >
                  Build your CV now <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>

            {/* Right: mock CV card */}
            <motion.div variants={scaleIn} className="relative">
              <div className="rounded-3xl border border-gray-800 bg-gray-900 p-8 shadow-2xl shadow-black/50">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-800">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-black text-xl">
                    A
                  </div>
                  <div>
                    <div className="h-4 w-36 bg-gray-700 rounded-full mb-2" />
                    <div className="h-3 w-24 bg-gray-800 rounded-full" />
                  </div>
                </div>
                {[
                  { label: "Education", width: "w-full" },
                  { label: "Skills", width: "w-4/5" },
                  { label: "Projects", width: "w-3/4" },
                  { label: "Experience", width: "w-5/6" },
                ].map((section) => (
                  <div key={section.label} className="mb-5">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-2">
                      {section.label}
                    </div>
                    <div className={`h-2.5 ${section.width} bg-gray-800 rounded-full mb-1.5`} />
                    <div className="h-2 w-2/3 bg-gray-800/60 rounded-full" />
                  </div>
                ))}
                <div className="mt-6 flex items-center gap-2">
                  <div className="flex-1 h-8 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Export PDF</span>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 px-4 py-2 rounded-2xl bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/30">
                ATS Ready ✓
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* ── PORTAL FEATURES ────────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">
                Student portal
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                More than just a generator
              </h2>
              <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                Sign in to unlock your personal academic portal with smart features built around your student life.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {portalFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    variants={scaleIn}
                    className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
                  >
                    <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                      <Icon className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>

            <motion.div variants={fadeUp} className="mt-12 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                Sign in to unlock portal <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-pink-500 dark:text-pink-400">
                Social proof
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                Students love CampusFlow
              </h2>
              <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                Thousands of DIU students use CampusFlow every semester to stay on top of their academic work.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <motion.div
                  key={t.name}
                  variants={scaleIn}
                  className="flex flex-col p-7 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm"
                >
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-1 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
                    <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{t.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>


      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-500 dark:text-cyan-400">
                FAQ
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                Common questions
              </h2>
            </motion.div>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>


      {/* ── CTA BANNER ─────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-950 dark:bg-black relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-600/15 via-violet-600/15 to-pink-600/15 blur-3xl rounded-full" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-semibold tracking-wide mb-6">
                <Shield className="w-3.5 h-3.5" />
                No credit card required
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight"
            >
              Start for free today
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-5 text-gray-400 text-lg max-w-xl mx-auto"
            >
              Join thousands of DIU students who save time every semester with CampusFlow.
              Sign in with Google and generate your first document in under a minute.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-gray-900 font-bold text-sm hover:opacity-90 transition-opacity shadow-xl shadow-white/10"
              >
                Get started — it&apos;s free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-gray-700 text-gray-300 font-semibold text-sm hover:bg-gray-900 transition-colors"
              >
                See all tools
              </Link>
            </motion.div>

            <motion.div variants={fadeIn} className="mt-12 flex items-center justify-center gap-8 text-xs text-gray-600">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free forever
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No ads
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Secure data
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

            {/* Brand */}
            <div className="lg:col-span-2 space-y-5">
              <Link href="/" className="inline-block">
                <Image
                  src="/logo.png"
                  alt="CampusFlow"
                  width={120}
                  height={40}
                  style={{ height: 40, width: "auto" }}
                />
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                Your complete academic productivity platform. Built for DIU students by Bornosoft.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://bornosoftnr.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/kazinayeem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Tools */}
            <div className="space-y-5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Tools</h4>
              <ul className="space-y-3">
                {[
                  { label: "Assignment Cover", href: "/assignment" },
                  { label: "Lab Report", href: "/lab-report" },
                  { label: "Lab Performance", href: "/lab-performance" },
                  { label: "CV Builder", href: "/cv-builder" },
                  { label: "Routine Builder", href: "/routine-builder" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policies */}
            <div className="space-y-5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Policies</h4>
              <ul className="space-y-3">
                {[
                  { label: "Privacy Policy", href: "/privacy-policy" },
                  { label: "Cookie Policy", href: "/cookie-policy" },
                  { label: "Refund Policy", href: "/refund-policy" },
                  { label: "Security", href: "/security-policy" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Company</h4>
              <ul className="space-y-3">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Login", href: "/login" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href="https://bornosoftnr.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    bornosoftnr.com ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              © 2026{" "}
              <span className="font-bold text-gray-900 dark:text-white">CampusFlow</span>{" "}
              by{" "}
              <a
                href="https://bornosoftnr.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Bornosoft
              </a>
              . Unofficial DIU Student Project.
            </p>
            <div className="flex items-center gap-5 text-xs text-gray-400">
              <Link href="/privacy-policy" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/cookie-policy" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Cookies
              </Link>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-100 dark:border-emerald-900/50 text-[10px] font-bold uppercase tracking-wide">
                <Shield className="w-3 h-3" /> Official Formats
              </span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
