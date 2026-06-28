"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles, Star } from "lucide-react";
import { PRICING_FEATURES } from "@/lib/landing-data";
import { SectionHeader } from "./section-header";

export function PricingSection() {
  return (
    <section className="section-padding relative bg-white dark:bg-slate-900/50">
      <div className="blur-orb w-[400px] h-[400px] bg-brand/10 -top-20 left-1/2 -translate-x-1/2" aria-hidden />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeader
          badge="Pricing"
          badgeIcon={Sparkles}
          title="Simple, Student-Friendly Pricing"
          description="Currently 100% free for students. No hidden fees, no subscriptions."
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Best Value badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-brand to-brand-secondary text-white text-sm font-bold shadow-lg shadow-brand/30">
              <Star size={14} className="fill-white" aria-hidden />
              Best Value
            </div>
          </div>

          <div className="gradient-border rounded-3xl p-[2px] shadow-2xl shadow-brand/20">
            <div className="rounded-[22px] bg-gradient-to-br from-[#0F172A] via-[#1e1b4b] to-[#0F172A] p-8 sm:p-12 text-center text-white relative overflow-hidden">
              <div className="blur-orb w-[200px] h-[200px] bg-brand/20 top-0 right-0" aria-hidden />
              <div className="blur-orb w-[200px] h-[200px] bg-brand-accent/15 bottom-0 left-0" aria-hidden />

              <div className="relative z-10">
                <p className="text-sm font-medium text-slate-400 mb-2">Student Plan</p>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-5xl sm:text-6xl font-extrabold">৳0</span>
                  <span className="text-lg text-slate-400">/ forever</span>
                </div>
                <p className="text-base text-indigo-200 mb-10 max-w-md mx-auto">
                  100% Free for Students — everything included, no credit card required.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto mb-10 text-left">
                  {PRICING_FEATURES.map((feature, i) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 rounded-2xl px-4 py-3 border border-white/8"
                    >
                      <CheckCircle size={18} className="text-[#22C55E] shrink-0" aria-hidden />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/assignment" className="w-full sm:w-auto">
                    <button className="btn-premium w-full sm:w-auto bg-white text-brand px-8 py-4 rounded-2xl font-bold text-base hover:bg-slate-50 transition shadow-xl cursor-pointer min-h-[44px]">
                      Get Started Free
                    </button>
                  </Link>
                  <Link href="/tools" className="w-full sm:w-auto">
                    <button className="btn-premium w-full sm:w-auto bg-white/10 text-white border border-white/20 px-8 py-4 rounded-2xl font-bold text-base hover:bg-white/20 transition cursor-pointer min-h-[44px]">
                      Explore Tools
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
