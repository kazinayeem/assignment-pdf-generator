"use client";

import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { WHY_CHOOSE } from "@/lib/landing-data";
import { SectionHeader } from "./section-header";

export function WhyChooseSection() {
  return (
    <section className="section-padding relative bg-surface-page">
      <div className="blur-orb w-[300px] h-[300px] bg-[#6D5DF6]/10 top-0 right-0" aria-hidden />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeader
          badge="Why CampusFlow?"
          badgeIcon={Crown}
          title="Built for DIU Students"
          description="Everything you need for academic success — from covers to CS mastery."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {WHY_CHOOSE.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass-card p-6 group cursor-default"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 shadow-lg group-hover:shadow-xl group-hover:shadow-[#6D5DF6]/15 transition-shadow`}
                >
                  <Icon size={22} className="text-white" aria-hidden />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
