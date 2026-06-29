"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, LogIn, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="section-padding relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 gradient-primary" aria-hidden />
          <div className="blur-orb w-[300px] h-[300px] bg-white/20 -top-20 -right-20" aria-hidden />
          <div className="blur-orb w-[250px] h-[250px] bg-brand-accent/30 -bottom-16 -left-16" aria-hidden />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:24px_24px]" aria-hidden />

          <div className="relative z-10 px-6 sm:px-12 lg:px-16 py-16 sm:py-20 text-center text-white">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-sm font-medium mb-6 border border-white/20"
            >
              <Sparkles size={14} aria-hidden />
              Get Started Today
            </motion.div>

            <h2 className="text-heading font-extrabold mb-4 max-w-2xl mx-auto">
              Ready to start learning?
            </h2>
            <p className="text-base sm:text-lg text-white/80 mb-10 max-w-lg mx-auto leading-relaxed">
              All tools and study materials in one place. Join thousands of CS students already using BornoFlow.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/tools" className="w-full sm:w-auto">
                <button className="btn-premium w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-brand px-8 py-4 rounded-2xl font-bold text-base hover:bg-slate-50 transition shadow-xl cursor-pointer min-h-[44px]">
                  Browse All Tools <ArrowRight size={18} aria-hidden />
                </button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <button className="btn-premium w-full sm:w-auto flex items-center justify-center gap-2 bg-white/15 text-white border border-white/30 px-8 py-4 rounded-2xl font-bold text-base hover:bg-white/25 transition cursor-pointer min-h-[44px]">
                  <LogIn size={18} aria-hidden /> Sign In
                </button>
              </Link>
            </div>

            {/* Floating illustrations */}
            <div className="hidden lg:block">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-12 left-12 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
                aria-hidden
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-12 right-12 w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
                aria-hidden
              />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-1/2 right-20 w-12 h-12 rounded-xl bg-brand-accent/30 backdrop-blur-md"
                aria-hidden
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
