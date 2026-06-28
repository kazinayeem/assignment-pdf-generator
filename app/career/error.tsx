"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw, Briefcase } from "lucide-react";

export default function CareerError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md w-full">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-amber-500" aria-hidden />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Career Hub error</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6" role="alert">{error.message || "Something went wrong."}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button type="button" onClick={reset} className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#6D5DF6] hover:bg-[#5B4DE0]">
            <RefreshCw className="w-4 h-4" aria-hidden /> Try Again
          </button>
          <Link href="/career" className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-white/10">
            <Briefcase className="w-4 h-4" aria-hidden /> Career Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
