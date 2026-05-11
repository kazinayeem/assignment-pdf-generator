"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useTheme } from "next-themes";
import {
  FileText,
  FlaskConical,
  LayoutDashboard,
  LogIn,
  ArrowRight,
  Globe,
  Award,
  ListChecks,
  Save,
  Rocket,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Moon,
  Sun,
  Zap,
  Calendar,
  Users,
  BookOpen,
  Download,
  Star,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

// ── Animation variants ────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

// ── Theme Toggle ──────────────────────────────────────────────────────────────
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
      aria-label="Toggle theme"
    >
      <Sun className="w-4 h-4 hidden dark:block" />
      <Moon className="w-4 h-4 block dark:hidden" />
    </button>
  );
}

export default function LandingView() {
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"guest" | "portal">("guest");

  const guestTools = [
    {
      title: "Assignment Cover",
      description: "Theory assignment covers with teacher evaluation tables and mark distribution.",
      href: "/assignment",
      icon: FileText,
      color: "blue",
      accent: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
      border: "hover:border-blue-200 dark:hover:border-blue-800",
      badge: "Free",
    },
    {
      title: "Lab Report Cover",
      description: "Official DIU lab report templates with marking rubrics and group partner sections.",
      href: "/lab-report",
      icon: FlaskConical,
      color: "emerald",
      accent: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
      border: "hover:border-emerald-200 dark:hover:border-emerald-800",
      badge: "Free",
    },
    {
      title: "Lab Performance",
      description: "Weekly evaluation sheets for lab assessments and continuous performance tracking.",
      href: "/lab-performance",
      icon: Award,
      color: "orange",
      accent: "bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400",
      border: "hover:border-orange-200 dark:hover:border-orange-800",
      badge: "Free",
    },
  ];

  const portalFeatures = [
    {
      title: "My Courses",
      description: "Save your semester courses. One click to generate any cover.",
      href: "/student/mycourses",
      icon: BookOpen,
      accent: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Class Routine",
      description: "Weekly calendar view with export to PNG. Auto-filtered by your section.",
      href: "/student/routine",
      icon: Calendar,
      accent: "bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400",
    },
    {
      title: "Smart Profile",
      description: "Fill once. Your name, ID, and department auto-fill every form.",
      href: "/student/profile",
      icon: Users,
      accent: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Cloud Sync",
      description: "All your data saved to Firebase. Access from any device, anytime.",
      href: "/login",
      icon: Rocket,
      accent: "bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400",
    },
  ];

  const benefits = [
    { title: "Smart Profile Sync", description: "Login once — your name and student ID auto-fill everywhere.", icon: Save, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Academic Dashboard", description: "Save your semester courses for one-click cover generation.", icon: ListChecks, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Department Automation", description: "We expand 'SWE' to 'Software Engineering' automatically on your PDFs.", icon: Globe, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Cloud Storage", description: "Your report history stays safe in the cloud, accessible from any device.", icon: Rocket, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  const stats = [
    { value: "12k+", label: "Active Users", icon: Users },
    { value: "<3s", label: "Gen Time", icon: Zap },
    { value: "DIU", label: "Standard", icon: Star },
    { value: "24/7", label: "Available", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden transition-colors duration-300">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-100">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-base tracking-tight text-gray-900 dark:text-white">CoverGen</span>
              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Bornosoft</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-5 mr-1">
              <a href="#tools" className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tools</a>
              <a href="#portal" className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Portal</a>
            </div>
            <ThemeToggle />
            {!isAuthenticated ? (
              <Link href="/login" className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm hover:bg-black dark:hover:bg-gray-100 transition-all shadow-md active:scale-95">
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            ) : (
              <Link href="/student/mycourses" className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md active:scale-95">
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main>
        {/* ── Hero ── */}
        <section className="relative pt-10 sm:pt-16 pb-16 px-4 sm:px-6 overflow-hidden">
          {/* Background blobs */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute -top-24 -left-10 w-96 h-96 bg-blue-50 dark:bg-blue-950/40 rounded-full blur-[120px] opacity-80" />
            <div className="absolute top-0 right-0 w-[32rem] h-[32rem] bg-gradient-to-bl from-blue-100/70 dark:from-blue-900/30 to-indigo-100/40 dark:to-indigo-900/20 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[1fr_1.1fr] gap-10 items-center">
            {/* Left */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="space-y-7 text-center xl:text-left order-2 xl:order-1"
            >
              <motion.div variants={fadeUp}>
                <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-black tracking-wide">Trusted by 12,000+ DIU Students</span>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.04]">
                  Automate your
                  <br className="hidden sm:block" />
                  <span className="text-blue-600 dark:text-blue-400"> academic covers.</span>
                </h1>
                <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 font-medium max-w-xl mx-auto xl:mx-0 leading-relaxed">
                  The professional academic toolkit for Daffodil International University.
                  Zero effort formatting. Perfect results every time.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center xl:justify-start">
                <Link href="/login" className="flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-base hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/50 active:scale-95 group">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#tools" className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-2xl font-bold text-base hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95">
                  <Download className="w-4 h-4" />
                  Try Without Account
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {stats.map((s) => (
                  <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-3 text-center shadow-sm">
                    <p className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{s.value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — Hero image */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="show"
              className="order-1 xl:order-2"
            >
              <div className="relative rounded-[2rem] border border-blue-100 dark:border-blue-900 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-2 sm:p-3 shadow-2xl shadow-blue-200/80 dark:shadow-blue-900/50 overflow-hidden">
                <div className="absolute top-6 right-6 w-20 h-20 border border-white/20 rounded-full" />
                <div className="absolute bottom-6 left-6 w-2 h-2 rounded-full bg-lime-300" />
                <div className="relative rounded-[1.5rem] overflow-hidden border border-white/20 bg-white/95 dark:bg-gray-900/95">
                  <Image src="/heroimage.png" alt="CoverGen preview" width={1400} height={800} priority className="w-full h-auto object-cover" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Tools Section with Tabs ── */}
        <section id="tools" className="py-16 px-4 sm:px-6 bg-gray-50/60 dark:bg-gray-900/60">
          <div className="max-w-6xl mx-auto">
            {/* Tab switcher */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="mb-10"
            >
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
                    All Tools
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                    Everything you need
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-2">
                    Use instantly without an account, or sign in for smart auto-fill.
                  </p>
                </div>

                {/* Tab pills */}
                <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl self-start sm:self-auto">
                  <button
                    onClick={() => setActiveTab("guest")}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "guest" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
                  >
                    Guest Tools
                  </button>
                  <button
                    onClick={() => setActiveTab("portal")}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "portal" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
                  >
                    Portal Features
                  </button>
                </div>
              </motion.div>

              {/* Guest Tools */}
              {activeTab === "guest" && (
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {guestTools.map((tool) => (
                    <motion.div key={tool.title} variants={scaleIn}>
                      <Link
                        href={tool.href}
                        className={`group bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 ${tool.border} hover:shadow-lg dark:hover:shadow-gray-900 transition-all duration-300 flex flex-col h-full`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-11 h-11 rounded-xl ${tool.accent} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <tool.icon className="w-5 h-5" />
                          </div>
                          <span className="px-2 py-0.5 bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 text-[10px] font-black rounded-full border border-green-100 dark:border-green-900">
                            {tool.badge}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed font-medium flex-1 mb-4">
                          {tool.description}
                        </p>
                        <div className="flex items-center gap-1.5 text-sm font-bold text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          Generate Now
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Portal Features */}
              {activeTab === "portal" && (
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                >
                  {portalFeatures.map((f) => (
                    <motion.div key={f.title} variants={scaleIn}>
                      <Link
                        href={isAuthenticated ? f.href : "/login"}
                        className="group bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                      >
                        <div className={`w-11 h-11 rounded-xl ${f.accent} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <f.icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-black text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {f.title}
                        </h3>
                        <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed font-medium flex-1 mb-4">
                          {f.description}
                        </p>
                        <div className="flex items-center gap-1.5 text-sm font-bold text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {isAuthenticated ? "Open" : "Sign in to access"}
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* ── Why Portal ── */}
        <section id="portal" className="py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
            >
              <div className="bg-gray-900 dark:bg-gray-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  <motion.div variants={fadeUp} className="space-y-6">
                    <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.3em]">The Professional Choice</p>
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                      Why use the <br />
                      <span className="text-blue-400">Student Portal?</span>
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-medium">
                      Stop re-typing your info for every course. Sign in with your{" "}
                      <span className="text-white font-bold">@diu.edu.bd</span> account to automate everything.
                    </p>
                    <ul className="space-y-2.5">
                      {["Auto-fill your name & student ID", "Save courses for the whole semester", "Access from any device, anytime"].map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-sm text-gray-300 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Link href="/login" className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-black text-sm hover:bg-blue-50 transition-all shadow-lg active:scale-95 group">
                        Sign In Now
                        <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link href="/about" className="flex items-center justify-center px-6 py-3 bg-white/5 text-white border border-white/10 rounded-xl font-bold text-sm hover:bg-white/10 transition-all">
                        Learn More
                      </Link>
                    </div>
                  </motion.div>

                  <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {benefits.map((b) => (
                      <motion.div key={b.title} variants={scaleIn} className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-all group">
                        <div className={`w-10 h-10 rounded-xl ${b.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                          <b.icon className={`w-5 h-5 ${b.color}`} />
                        </div>
                        <h4 className="text-white font-black text-sm mb-1.5">{b.title}</h4>
                        <p className="text-gray-500 text-xs leading-relaxed">{b.description}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Brand footer strip ── */}
        <section className="py-14 px-4 sm:px-6 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="max-w-sm mx-auto space-y-5"
          >
            <Image src="/diulogoside.png" alt="DIU Logo" width={160} height={40} className="mx-auto opacity-25 grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-500" />
            <div className="space-y-1.5">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Keep showing up. Great results follow consistency.</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs font-medium leading-relaxed">
                One focused study session today can change your semester tomorrow.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              {[0, 0.25, 0.5].map((delay, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: `${delay}s` }} />
              ))}
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
