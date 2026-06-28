"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw, BookOpen } from "lucide-react";

export default function ToolsError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[60vh] bg-[#F8FAFC] dark:bg-[#0F172A] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md w-full">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-amber-500" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6" role="alert">
          {error.message || "An unexpected error occurred in the learning tools section."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#6D5DF6] hover:bg-[#5B4DE0] transition-colors"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try Again
          </button>
          <Link
            href="/tools"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            Learning Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
