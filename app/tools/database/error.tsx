"use client";

import Link from "next/link";
import { RotateCcw, Home } from "lucide-react";

export default function DatabaseError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">💾</div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-sm text-gray-500 mb-6">An error occurred while loading this database page.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={reset} className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white text-sm font-bold rounded-xl hover:bg-amber-700 transition-colors">
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <Link href="/tools/database" className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors">
            <Home className="w-4 h-4" /> Back to Database
          </Link>
        </div>
      </div>
    </div>
  );
}
