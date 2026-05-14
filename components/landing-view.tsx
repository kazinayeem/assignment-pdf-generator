"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight, BookOpen, BrainCircuit, Cpu, Database, Globe, Menu,
  Microchip, Network, ShieldAlert, Code2, Blocks, GitFork,
  FileText, FilePlus, Layout, GraduationCap, Search, X,
  ChevronDown, ChevronRight, Sparkles, Zap, Eye, EyeOff, LogIn,
  BarChart3, Cloud, CheckCircle, Shield, Smartphone,
  Rocket, Users, Star, Crown,
} from "lucide-react";

const ALL_TOOLS = [
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

const FEATURES = [
  { name: "Assignment Cover", href: "/assignment", icon: FileText, desc: "Generate official DIU covers", color: "from-blue-500 to-indigo-600" },
  { name: "CV Builder", href: "/cv-builder", icon: FilePlus, desc: "Build ATS-friendly CVs", color: "from-emerald-500 to-teal-600" },
  { name: "Lab Report", href: "/lab-report", icon: BookOpen, desc: "Create formatted lab reports", color: "from-violet-500 to-purple-600" },
];

const CATEGORIES = [
  { name: "Core CS", tools: ["Operating Systems", "Data Structures", "Algorithms", "Computer Networks"], icon: BrainCircuit },
  { name: "Systems", tools: ["Database Systems", "Cyber Security", "Computer Arch.", "Theory of Comp."], icon: Cpu },
  { name: "Development", tools: ["Software Eng.", "Programming", "Web Development"], icon: Code2 },
  { name: "Specialized", tools: ["Data Science", "DevOps"], icon: Zap },
];

const WHY_CHOOSE = [
  { icon: Shield, title: "Official DIU Formats", desc: "Professionally formatted covers and reports matching DIU standards.", color: "from-blue-500 to-indigo-600" },
  { icon: Zap, title: "One-Click Generation", desc: "Generate PDFs instantly with auto-saved student profile data.", color: "from-amber-500 to-orange-600" },
  { icon: Users, title: "Auto-Saved Profiles", desc: "Your details are saved automatically — never re-enter info.", color: "from-green-500 to-emerald-600" },
  { icon: Star, title: "ATS-Friendly CV", desc: "Build CVs optimized for applicant tracking systems.", color: "from-purple-500 to-violet-600" },
  { icon: Rocket, title: "Fast Academic Workflow", desc: "From cover to submission in under 60 seconds.", color: "from-pink-500 to-rose-600" },
  { icon: BrainCircuit, title: "Interactive CS Tools", desc: "Master DSA, OS, Algorithms, and more with simulators.", color: "from-cyan-500 to-teal-600" },
  { icon: Smartphone, title: "Mobile Responsive", desc: "Full functionality on desktop, tablet, and phone.", color: "from-sky-500 to-blue-600" },
  { icon: Cloud, title: "Cloud-Saved Data", desc: "Access your documents anywhere, anytime.", color: "from-indigo-500 to-purple-600" },
];

export default function LandingView() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggle = (key: string) => setCollapsed(p => ({ ...p, [key]: !p[key] }));

  const filteredTools = useMemo(() => {
    if (!searchQuery) return ALL_TOOLS;
    const q = searchQuery.toLowerCase();
    return ALL_TOOLS.filter(t => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q));
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/80"
          : "bg-transparent border-b border-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className={`md:hidden p-1.5 rounded-lg transition-colors cursor-pointer self-start mt-6 ${scrolled ? "hover:bg-slate-100 text-slate-500" : "text-white/80 hover:text-white"}`}>
              <Menu size={22} />
            </button>
            <Link href="/">
              <Image src="/logo_navbar.png" alt="CampusFlow" width={640} height={160} style={{ height: 140, width: "auto" }} />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {FEATURES.slice(0, 4).map((f) => (
              <Link key={f.href} href={f.href}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                  scrolled
                    ? "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}>
                {f.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer ${
                scrolled
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-400"
                  : "bg-white/10 hover:bg-white/20 text-white/70"
              }`}>
              <Search size={13} />
              <span className="hidden sm:inline">Search</span>
            </button>
            <Link href="/login">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[11px] font-bold hover:from-indigo-600 hover:to-purple-700 transition shadow-sm cursor-pointer">
                <LogIn size={12} /> Sign In
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-2xl">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <Image src="/logo_navbar.png" alt="CampusFlow" width={80} height={20} style={{ height: 20, width: "auto" }} />
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded-md hover:bg-slate-100 cursor-pointer">
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <nav className="p-3 space-y-1">
              {[...FEATURES, ...ALL_TOOLS].map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  <item.icon size={15} className="text-slate-400" />
                  {item.name}
                </Link>
              ))}
              <div className="pt-3 mt-3 border-t border-slate-100">
                <Link href="/login" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold hover:from-indigo-600 hover:to-purple-700 transition">
                  <LogIn size={14} /> Sign In
                </Link>
              </div>
            </nav>
          </aside>
        </div>
      )}

      {/* Search */}
      {searchOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-lg px-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                <Search size={16} className="text-slate-400 shrink-0" />
                <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search tools..." className="flex-1 text-sm bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400" />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-400 cursor-pointer"><X size={14} /></button>
              </div>
              <div className="max-h-72 overflow-y-auto p-2">
                {filteredTools.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400">No tools found</div>
                ) : filteredTools.map((tool) => (
                  <Link key={tool.href} href={tool.href} onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${tool.color}`}>
                      <tool.icon size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800">{tool.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{tool.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white pt-14">
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute top-0 -right-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-0 left-20 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "4s" }} />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:24px_24px]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-medium mb-5 border border-white/10">
                <Sparkles size={12} className="text-indigo-300" />
                CampusFlow v2.0
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Academic Productivity
                </span>
                <br />Platform
              </h1>
              <p className="text-base sm:text-lg text-indigo-100 max-w-lg mb-6 leading-relaxed">
                Master CS &amp; SWE with Interactive Tools. Generate assignment covers, build ATS-friendly CVs, 
                create lab reports, and master computer science topics with interactive educational tools.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/tools">
                  <button className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition shadow-xl cursor-pointer flex items-center gap-2">
                    Explore Tools <ArrowRight size={16} />
                  </button>
                </Link>
                <Link href="/assignment">
                  <button className="bg-white/10 text-white border border-white/20 px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition cursor-pointer">
                    Generate Cover
                  </button>
                </Link>
                <Link href="/lab-report">
                  <button className="bg-white/10 text-white border border-white/20 px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition cursor-pointer">
                    Lab Report
                  </button>
                </Link>
                <Link href="/cv-builder">
                  <button className="bg-white/10 text-white border border-white/20 px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition cursor-pointer">
                    Build CV
                  </button>
                </Link>
              </div>
              <div className="flex items-center gap-4 mt-6 text-indigo-200 text-xs">
                <span className="flex items-center gap-1"><CheckCircle size={12} /> Auto-save</span>
                <span className="flex items-center gap-1"><Zap size={12} /> One-click</span>
                <span className="flex items-center gap-1"><Shield size={12} /> DIU Format</span>
              </div>
            </motion.div>

            {/* Floating Cards */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hidden lg:block relative">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: FileText, label: "Assignment Cover", sub: "DIU Format", color: "from-blue-400 to-indigo-500" },
                  { icon: FilePlus, label: "ATS CV Builder", sub: "Europass Style", color: "from-emerald-400 to-teal-500" },
                  { icon: BookOpen, label: "Lab Report", sub: "Official Format", color: "from-violet-400 to-purple-500" },
                  { icon: BrainCircuit, label: "CS Learning Tools", sub: "21+ Topics", color: "from-amber-400 to-orange-500" },
                ].map((card, i) => (
                  <motion.div key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/20 transition-all cursor-pointer hover:-translate-y-1">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-2`}>
                      <card.icon size={18} className="text-white" />
                    </div>
                    <p className="text-sm font-bold text-white">{card.label}</p>
                    <p className="text-[10px] text-indigo-200">{card.sub}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full text-[11px] font-semibold text-indigo-600 mb-3">
            <Crown size={12} /> Why CampusFlow?
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800">Built for DIU Students</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
            Everything you need for academic success — from covers to CS mastery.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {WHY_CHOOSE.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.title} whileHover={{ y: -4 }} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg hover:border-indigo-200 transition-all">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                  <Icon size={16} className="text-white" />
                </div>
                <h3 className="text-xs font-bold text-slate-800 mb-1">{item.title}</h3>
                <p className="text-[10px] text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Productivity Tools */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">Productivity Tools</h2>
            <Link href="/tools" className="text-xs font-semibold text-indigo-500 hover:text-indigo-700 flex items-center gap-1">
              All Tools <ChevronRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FEATURES.map((f) => (
              <Link key={f.href} href={f.href}>
                <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md transition-all h-full group">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br ${f.color} shadow-sm`}>
                    <f.icon size={16} className="text-white" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 mb-1">{f.name}</h3>
                  <p className="text-[10px] text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CS Learning Tools */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">CS Learning Tools</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => setCollapsed(Object.fromEntries(CATEGORIES.map(c => [c.name, true])))}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer">
                <EyeOff size={12} /> Collapse
              </button>
              <button onClick={() => setCollapsed({})}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer">
                <Eye size={12} /> Expand
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {CATEGORIES.map((cat) => (
              <div key={cat.name} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <button onClick={() => toggle(cat.name)}
                  className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <cat.icon size={18} className="text-indigo-500 shrink-0" />
                    <div className="text-left">
                      <h3 className="text-sm font-bold text-slate-800">{cat.name}</h3>
                      <p className="text-[10px] text-slate-400">{cat.tools.length} topics</p>
                    </div>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${collapsed[cat.name] ? "" : "rotate-180"}`} />
                </button>
                <div className={`grid transition-all duration-200 ${collapsed[cat.name] ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}>
                  <div className="overflow-hidden">
                    <div className="px-3.5 pb-3.5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {ALL_TOOLS.filter(t => cat.tools.includes(t.name)).map((tool) => (
                        <Link key={tool.href} href={tool.href}>
                          <div className="p-3 rounded-lg border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 bg-gradient-to-br ${tool.color}`}>
                              <tool.icon size={12} className="text-white" />
                            </div>
                            <p className="text-[11px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{tool.name}</p>
                            <p className="text-[9px] text-slate-400 mt-0.5">{tool.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 bg-indigo-500/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/10 rounded-full -ml-20 -mb-20 blur-3xl" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-medium mb-4 border border-white/10">
              <Sparkles size={12} /> Pricing
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mb-2">Free — ৳0</h2>
            <p className="text-sm text-indigo-200 mb-6 max-w-md mx-auto">
              Currently 100% Free for Students. No hidden fees, no subscriptions.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-6">
              {[
                "Unlimited Assignment Covers",
                "Unlimited Lab Reports",
                "CV Builder Access",
                "Learning Tools Access",
                "Responsive Dashboard",
                "Auto Save Features",
                "PDF Export",
                "DIU Official Formats",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-1.5 text-[11px] text-indigo-200 bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                  <CheckCircle size={12} className="text-emerald-400 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/assignment">
                <button className="bg-white text-indigo-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition shadow-xl cursor-pointer">
                  Get Started Free
                </button>
              </Link>
              <Link href="/tools">
                <button className="bg-white/10 text-white border border-white/20 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white/20 transition cursor-pointer">
                  Explore Tools
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 rounded-2xl p-6 sm:p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-10 -mb-10" />
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2">Ready to start learning?</h2>
            <p className="text-sm text-indigo-200 mb-4 max-w-md mx-auto">All tools and study materials in one place.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/tools">
                <button className="bg-white text-indigo-700 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition shadow-lg cursor-pointer">
                  Browse All Tools
                </button>
              </Link>
              <Link href="/login">
                <button className="bg-white/10 text-white border border-white/30 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white/20 transition cursor-pointer">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
