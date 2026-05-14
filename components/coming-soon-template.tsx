"use client";

import Link from "next/link";
import { ArrowLeft, Zap, BookOpen, Code2 } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
  parentPath: string;
  parentLabel: string;
  icon?: string;
  estimatedRelease?: string;
}

export function ComingSoonPage({
  title,
  description,
  parentPath,
  parentLabel,
  icon = "📚",
  estimatedRelease,
}: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href={parentPath}
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to {parentLabel}
          </Link>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Coming Soon</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="text-7xl mb-6 animate-pulse">{icon}</div>
          <h1 className="text-5xl font-black text-slate-900 mb-4 leading-tight">{title}</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
            {description}
          </p>
          
          {estimatedRelease && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 inline-block mb-8">
              <p className="text-sm text-blue-900">
                <span className="font-bold">Estimated Release:</span> {estimatedRelease}
              </p>
            </div>
          )}
        </div>

        {/* What to Expect */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-10 mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">What's Coming</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <BookOpen className="text-sky-500 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Comprehensive Theory</h3>
                <p className="text-slate-600 text-sm">
                  In-depth explanations with real-world examples and best practices
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Zap className="text-yellow-500 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Interactive Simulations</h3>
                <p className="text-slate-600 text-sm">
                  Visualize concepts with animated, interactive learning tools
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Code2 className="text-emerald-500 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Code Examples</h3>
                <p className="text-slate-600 text-sm">
                  Practical code snippets in multiple programming languages
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stay Updated */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl border-2 border-sky-200 p-10 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Stay Updated</h2>
          <p className="text-slate-600 mb-6">
            Subscribe to get notified when {title} is ready
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button className="px-6 py-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700 transition-colors whitespace-nowrap">
              Notify Me
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            We'll send you an email when this section is available
          </p>
        </div>

        {/* Tips */}
        <div className="mt-16 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-6">
          <p className="text-sm text-amber-900">
            <strong>💡 In the meantime:</strong> Check out our other available learning modules and start your journey in Computer Science!
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TemplateExample() {
  return (
    <ComingSoonPage
      title="Topic Name"
      description="Brief description of what this topic covers"
      parentPath="/tools/category"
      parentLabel="Category Name"
      icon="📚"
      estimatedRelease="Coming Soon"
    />
  );
}
