"use client";

import Link from "next/link";
import { AlertCircle, Home, ArrowLeft, Calculator, BookOpen } from "lucide-react";

const QUICK_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/tools", label: "Learning Tools", icon: BookOpen },
  { href: "/calculators", label: "Calculators", icon: Calculator },
  { href: "/assignment", label: "Assignment Cover" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-page flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-lg w-full">
        <div className="inline-flex mb-8 animate-float" aria-hidden="true">
          <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <p className="text-sm font-semibold uppercase tracking-wider text-[#6D5DF6] mb-3">Error 404</p>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Page not found
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        <div className="glass-card p-5 mb-8 text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6D5DF6] mb-3">
            What you can do
          </p>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-5">
            <li>Check the URL for typos</li>
            <li>Return to the home page</li>
            <li>Browse tools or calculators below</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-xl font-semibold text-white gradient-primary shadow-lg shadow-[#6D5DF6]/25 hover:opacity-95 transition-opacity"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Go to Home
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Go Back
          </button>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-white/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Quick links</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl text-sm font-medium text-[#6D5DF6] bg-[#6D5DF6]/5 dark:bg-[#6D5DF6]/10 border border-[#6D5DF6]/20 hover:bg-[#6D5DF6]/10 transition-colors"
              >
                {link.icon && <link.icon className="w-3.5 h-3.5" aria-hidden="true" />}
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
