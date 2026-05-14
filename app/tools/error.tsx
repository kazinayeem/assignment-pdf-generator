"use client";

export default function ToolsError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="text-xl font-black text-gray-900 dark:text-white mb-2">Something went wrong</h1>
        <p className="text-sm text-gray-500 mb-6">{error.message || "An unexpected error occurred in the tools section."}</p>
        <button onClick={reset} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors text-sm">
          Try Again
        </button>
      </div>
    </div>
  );
}
