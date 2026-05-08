"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
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
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

export default function LandingView() {
  const { isAuthenticated } = useAuthStore();

  const manualTools = [
    {
      title: "Assignment Cover",
      description: "Theory assignment covers with teacher evaluation tables and mark distribution.",
      href: "/assignment",
      icon: FileText,
      accent: "bg-blue-50 text-blue-600",
      border: "hover:border-blue-200",
    },
    {
      title: "Lab Report Cover",
      description: "Official DIU lab report templates with marking rubrics and group partner sections.",
      href: "/lab-report",
      icon: FlaskConical,
      accent: "bg-emerald-50 text-emerald-600",
      border: "hover:border-emerald-200",
    },
    {
      title: "Lab Performance",
      description: "Weekly evaluation sheets for lab assessments and continuous performance tracking.",
      href: "/lab-performance",
      icon: Award,
      accent: "bg-orange-50 text-orange-600",
      border: "hover:border-orange-200",
    },
  ];

  const benefits = [
    {
      title: "Smart Profile Sync",
      description: "Login once — your name and student ID auto-fill everywhere.",
      icon: Save,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Academic Dashboard",
      description: "Save your semester courses for one-click cover generation.",
      icon: ListChecks,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Department Automation",
      description: "We expand 'SWE' to 'Software Engineering' automatically on your PDFs.",
      icon: Globe,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Cloud Storage",
      description: "Your report history stays safe in the cloud, accessible from any device.",
      icon: Rocket,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  const stats = [
    { value: "12k+", label: "Active Users" },
    { value: "<3s", label: "Gen Time" },
    { value: "DIU", label: "Standard" },
    { value: "24/7", label: "Available" },
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-100">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-base tracking-tight text-gray-900">CoverGen</span>
              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Bornosoft</span>
            </div>
          </div>

          {/* Nav links + CTA */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-6 mr-2">
              <a href="#tools" className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">Tools</a>
              <a href="#portal" className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">Portal</a>
            </div>
            {!isAuthenticated ? (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-md active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            ) : (
              <Link
                href="/student/mycourses"
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md active:scale-95"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main>
        {/* ── Hero ── */}
        <section className="relative pt-16 pb-16 px-4 sm:px-6 overflow-hidden">
          {/* Soft blobs */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-50 rounded-full blur-[80px] opacity-70" />
            <div className="absolute top-10 right-1/4 w-72 h-72 bg-indigo-50 rounded-full blur-[80px] opacity-70" />
          </div>

          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow border border-gray-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Trusted by 12,000+ DIU Students</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.05] mb-5">
              Automate your <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600">
                academic covers.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-500 max-w-xl mb-8 leading-relaxed font-medium">
              The professional academic toolkit for Daffodil International University.
              Zero effort formatting. Perfect results every time.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-12 w-full sm:w-auto">
              <Link
                href="/login"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-base hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 group"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#tools"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold text-base hover:bg-gray-50 transition-all active:scale-95"
              >
                Try Without Account
              </a>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-4 sm:gap-8 w-full max-w-lg pt-8 border-t border-gray-100">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1">
                  <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{s.value}</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Manual Tools ── */}
        <section id="tools" className="py-16 px-4 sm:px-6 bg-gray-50/60">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <div className="mb-10 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
                Quick Access
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Manual Generators</h2>
              <p className="text-gray-500 text-sm font-medium mt-2 max-w-md">
                No account needed. Fill in your details and download a perfectly formatted PDF instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {manualTools.map((tool) => (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className={`group bg-white p-6 rounded-2xl border border-gray-100 ${tool.border} hover:shadow-lg transition-all duration-300 flex flex-col`}
                >
                  <div className={`w-11 h-11 rounded-xl ${tool.accent} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <tool.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-medium flex-1 mb-4">
                    {tool.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-gray-500 group-hover:text-blue-600 transition-colors">
                    Generate Now
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Portal ── */}
        <section id="portal" className="py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-900 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
              {/* Glow blobs */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                {/* Left copy */}
                <div className="space-y-6">
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
                    <Link
                      href="/login"
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-black text-sm hover:bg-blue-50 transition-all shadow-lg active:scale-95 group"
                    >
                      Sign In Now
                      <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/about"
                      className="flex items-center justify-center px-6 py-3 bg-white/5 text-white border border-white/10 rounded-xl font-bold text-sm hover:bg-white/10 transition-all"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>

                {/* Right benefit cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {benefits.map((b) => (
                    <div
                      key={b.title}
                      className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-all group"
                    >
                      <div className={`w-10 h-10 rounded-xl ${b.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <b.icon className={`w-5 h-5 ${b.color}`} />
                      </div>
                      <h4 className="text-white font-black text-sm mb-1.5">{b.title}</h4>
                      <p className="text-gray-500 text-xs leading-relaxed">{b.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Brand footer strip ── */}
        <section className="py-14 px-4 sm:px-6 text-center">
          <div className="max-w-sm mx-auto space-y-5">
            <Image
              src="/diulogoside.png"
              alt="DIU Logo"
              width={160}
              height={40}
              className="mx-auto opacity-25 grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-500"
            />
            <div className="space-y-1.5">
              <p className="text-sm font-bold text-gray-800">Developed by Mohammad Ali Nayeem</p>
              <p className="text-gray-400 text-xs font-medium leading-relaxed">
                A productivity ecosystem by{" "}
                <span className="text-blue-600 font-bold">Bornosoft</span>, dedicated to DIU students.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              {[0, 0.25, 0.5].map((delay, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
