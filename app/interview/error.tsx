"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw, BookOpen } from "lucide-react";

export default function InterviewError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md w-full">
        <div className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-warning" aria-hidden />
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">Interview KB error</h1>
        <p className="text-sm text-muted-foreground mb-6" role="alert">
          {error.message || "Something went wrong loading this article."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl text-sm font-semibold text-brand-foreground gradient-primary"
          >
            <RefreshCw className="w-4 h-4" aria-hidden /> Try Again
          </button>
          <Link
            href="/interview"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl text-sm font-semibold border border-border"
          >
            <BookOpen className="w-4 h-4" aria-hidden /> Interview Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
