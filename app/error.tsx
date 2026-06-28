"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-lg w-full">
        <div className="inline-flex mb-8" aria-hidden="true">
          <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-amber-500" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Something went wrong
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          An unexpected error occurred. Please try again or return to the home page.
        </p>

        {error.message && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-left"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400 mb-1">Error</p>
            <p className="text-sm text-red-800 dark:text-red-300 font-mono break-words">{error.message}</p>
          </div>
        )}

        <div className="glass-card p-5 mb-8 text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3">
            Try these steps
          </p>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-5">
            <li>Refresh the page</li>
            <li>Clear your browser cache</li>
            <li>Try again in a few moments</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-xl font-semibold text-white gradient-primary shadow-lg shadow-[#6D5DF6]/25 hover:opacity-95 transition-opacity"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
