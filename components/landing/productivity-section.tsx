"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { FEATURES } from "@/lib/landing-data";
import { SectionHeader } from "./section-header";

export function ProductivitySection() {
  return (
    <section className="section-padding relative bg-white dark:bg-slate-900/50">
      <div className="blur-orb w-[400px] h-[400px] bg-[#06B6D4]/8 -bottom-20 -left-20" aria-hidden />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 md:mb-16">
          <SectionHeader
            badge="Productivity"
            title="Productivity Tools"
            description="Generate professional academic documents in seconds with auto-saved profiles."
            align="left"
            className="mb-0"
          />
          <Link
            href="/tools"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#6D5DF6] hover:text-[#8B5CF6] transition-colors shrink-0 min-h-[44px]"
          >
            All Tools <ChevronRight size={16} aria-hidden />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.href}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={feature.href} className="block h-full group">
                <div className="glass-card h-full p-8 flex flex-col">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl group-hover:shadow-[#6D5DF6]/20 transition-all group-hover:scale-105`}
                  >
                    <feature.icon size={26} className="text-white" aria-hidden />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.name}</h3>
                  <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed flex-1 mb-6">
                    {feature.desc}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#6D5DF6] group-hover:gap-3 transition-all min-h-[44px]">
                    Get started <ArrowRight size={16} aria-hidden />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
