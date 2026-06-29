"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { HERO_DASHBOARD_CARDS, HERO_STATS } from "@/lib/landing-data";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-hero text-white pt-24 lg:pt-28">
      {/* Parallax background */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div className="blur-orb w-[500px] h-[500px] bg-brand/30 -top-32 -left-32 animate-pulse" />
        <div className="blur-orb w-[400px] h-[400px] bg-brand-secondary/25 top-20 -right-20 animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="blur-orb w-[350px] h-[350px] bg-brand-accent/20 bottom-0 left-1/3 animate-pulse" style={{ animationDelay: "4s" }} />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:32px_32px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0F172A]/80" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium mb-6 border border-white/12">
              <Sparkles size={14} className="text-[#06B6D4]" aria-hidden />
              BornoFlow
            </div>

            <h1 className="text-hero font-extrabold mb-6">
              <span className="gradient-text">Academic Productivity</span>
              <br />
              <span className="text-white">Platform</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mb-8 leading-relaxed">
              Master CS &amp; SWE with interactive tools. Generate assignment covers, build
              ATS-friendly CVs, create lab reports, and master computer science topics with
              interactive educational tools.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link href="/tools" className="w-full sm:w-auto">
                <button className="btn-premium w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-brand px-8 py-4 rounded-2xl font-bold text-base hover:bg-slate-50 transition shadow-xl shadow-black/20 cursor-pointer min-h-[44px]">
                  Explore Tools <ArrowRight size={18} aria-hidden />
                </button>
              </Link>
              <Link href="/assignment" className="w-full sm:w-auto">
                <button className="btn-premium w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-8 py-4 rounded-2xl font-bold text-base hover:bg-white/20 transition cursor-pointer min-h-[44px]">
                  Generate Cover
                </button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4 mb-10 text-slate-300 text-sm">
              <span className="flex items-center gap-2">
                <CheckCircle size={16} className="text-[#22C55E]" aria-hidden /> Auto-save
              </span>
              <span className="flex items-center gap-2">
                <Zap size={16} className="text-[#F59E0B]" aria-hidden /> One-click
              </span>
              <span className="flex items-center gap-2">
                <Shield size={16} className="text-[#06B6D4]" aria-hidden /> DIU Format
              </span>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              {HERO_STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="text-center sm:text-left"
                >
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/12 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                <span className="ml-3 text-xs text-slate-400 font-medium">BornoFlow Dashboard</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {HERO_DASHBOARD_CARDS.map((card, i) => (
                  <Link key={card.label} href={card.href}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + card.delay }}
                      whileHover={{ y: -6, scale: 1.02 }}
                      className={`group relative p-5 rounded-3xl bg-white/8 backdrop-blur-md border border-white/12 hover:bg-white/15 hover:border-white/20 transition-all cursor-pointer shadow-lg ${i % 2 === 0 ? "animate-float" : "animate-float-delayed"}`}
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl group-hover:shadow-brand/20 transition-shadow`}
                      >
                        <card.icon size={22} className="text-white" aria-hidden />
                      </div>
                      <p className="text-sm font-bold text-white mb-1">{card.label}</p>
                      <p className="text-xs text-slate-400">{card.sub}</p>
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Decorative floating elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-brand/40 to-brand-secondary/40 blur-xl animate-float" aria-hidden />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-brand-accent/30 blur-2xl animate-float-delayed" aria-hidden />
          </motion.div>
        </div>

        {/* Mobile dashboard cards */}
        <div className="grid grid-cols-2 gap-3 mt-10 lg:hidden">
          {HERO_DASHBOARD_CARDS.map((card) => (
            <Link key={card.label} href={card.href}>
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-2xl bg-white/8 backdrop-blur-md border border-white/12"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                  <card.icon size={18} className="text-white" aria-hidden />
                </div>
                <p className="text-sm font-bold text-white">{card.label}</p>
                <p className="text-xs text-slate-400">{card.sub}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
