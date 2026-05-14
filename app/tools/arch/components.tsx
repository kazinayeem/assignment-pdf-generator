import { ReactNode } from "react";
import Link from "next/link";
import { Home, ChevronRight, BookOpen } from "lucide-react";

export function ArchitectureCard({ title, description, icon, featured = false }: { title: string; description: string; icon: string; featured?: boolean }) {
  return (
    <div className={`rounded-xl p-5 transition-all cursor-pointer flex flex-col ${
      featured
        ? "bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-lg"
        : "bg-white border border-slate-200 text-slate-900 hover:border-cyan-400 hover:shadow-lg hover:-translate-y-1"
    }`}>
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-base mb-2">{title}</h3>
      <p className={`text-sm mb-4 flex-1 ${featured ? "text-white/90" : "text-slate-500"}`}>{description}</p>
      <div className={`pt-3 border-t text-sm font-semibold ${featured ? "border-white/20 text-white" : "border-slate-200 text-cyan-600"}`}>
        Explore →
      </div>
    </div>
  );
}

export function ComplexityBadge({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-block bg-slate-100 text-cyan-700 px-3 py-1.5 rounded-md text-xs font-bold font-mono">
      {label}: {value}
    </span>
  );
}

export function CodeBlock({ code, language = "assembly" }: { code: string; language?: string }) {
  return (
    <div className="bg-[#1e1e1e] rounded-xl p-5 overflow-x-auto border-l-4 border-cyan-500 mb-5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">{language}</p>
      <pre className="font-mono text-sm text-slate-200 whitespace-pre-wrap break-words">{code}</pre>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-slate-900 mb-4 pb-3 border-b-2 border-slate-200">{title}</h2>
      {children}
    </div>
  );
}

export function InfoCard({ title, children, type = "info" }: { title: string; children: ReactNode; type?: "info" | "warning" | "tip" }) {
  const colors = {
    info: { bg: "bg-cyan-50", border: "border-cyan-200", icon: "ℹ️", text: "text-cyan-800" },
    warning: { bg: "bg-amber-50", border: "border-amber-200", icon: "⚠️", text: "text-amber-800" },
    tip: { bg: "bg-emerald-50", border: "border-emerald-200", icon: "💡", text: "text-emerald-800" },
  };
  const c = colors[type];
  return (
    <div className={`${c.bg} ${c.border} border rounded-xl p-4 mb-4 flex gap-3`}>
      <span className="text-lg shrink-0">{c.icon}</span>
      <div>
        <h4 className="font-semibold text-slate-900 text-sm mb-1">{title}</h4>
        <div className="text-sm text-slate-600 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export function Diagram({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm flex flex-col items-center">
      {title && <h3 className="font-bold text-slate-900 text-base mb-4">{title}</h3>}
      {children}
    </div>
  );
}

export function CPUStage({ stage, desc, icon = "→" }: { stage: string; desc: string; icon?: string }) {
  return (
    <div className="bg-gradient-to-br from-cyan-50 to-white border-2 border-cyan-500 rounded-xl p-4 flex-1 text-center min-w-[120px]">
      <div className="text-xl mb-2">{icon}</div>
      <h4 className="text-sm font-bold text-cyan-700 mb-1.5">{stage}</h4>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  );
}

export function InterviewQuestion({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="bg-slate-50 border border-slate-200 rounded-xl p-4 cursor-pointer mb-3">
      <summary className="font-semibold text-slate-900 text-sm">{question}</summary>
      <p className="text-sm text-slate-500 mt-3 leading-relaxed">{answer}</p>
    </details>
  );
}

export function MemoryBlock({ label, size, speed }: { label: string; size: string; speed: string }) {
  return (
    <div className="bg-cyan-50 border-2 border-cyan-500 rounded-xl p-4 text-center cursor-pointer transition-all hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105">
      <h4 className="text-sm font-bold text-cyan-700 mb-1">{label}</h4>
      <p className="text-xs text-slate-500 mb-1">{size}</p>
      <p className="text-[10px] text-slate-400">{speed}</p>
    </div>
  );
}

export function AnimatedFlow({ steps }: { steps: Array<{ label: string; desc: string }> }) {
  return (
    <div className="flex items-center gap-4 overflow-x-auto py-5">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white w-16 h-16 rounded-xl flex flex-col items-center justify-center shrink-0 text-[10px] font-bold text-center p-2">
            <div>{step.label}</div>
          </div>
          {i < steps.length - 1 && (
            <div className="text-cyan-500 text-xl shrink-0">→</div>
          )}
        </div>
      ))}
    </div>
  );
}

export function ArchTopicTemplate({ icon, title, breadcrumb, description, children }: {
  icon: string; title: string; breadcrumb: string; description: string; children?: React.ReactNode;
}) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">{breadcrumb}</span>
      </div>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">{icon} {title}</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">{description}</p>
      </div>
      {children || (
        <Section title="Coming Soon">
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-10 text-center border-2 border-cyan-500">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Page Under Development</h2>
            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
              Comprehensive content for {title} is being created including visualizations, code examples, and interview questions.
            </p>
            <Link href="/tools/arch" className="no-underline">
              <button className="bg-cyan-600 text-white border-none px-8 py-3 rounded-xl font-semibold cursor-pointer inline-flex items-center gap-2 text-sm hover:bg-cyan-700 transition">
                <BookOpen size={18} /> Back to Architecture Hub
              </button>
            </Link>
          </div>
        </Section>
      )}
    </div>
  );
}

export function QuizCard({ question, options, correct }: { question: string; options: string[]; correct: number }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4 shadow-sm">
      <h4 className="text-sm font-bold text-slate-900 mb-4">{question}</h4>
      <div className="flex flex-col gap-2">
        {options.map((opt, i) => (
          <button key={i} className="bg-slate-50 border border-slate-200 text-slate-600 p-3 rounded-lg font-medium cursor-pointer text-left text-sm hover:border-cyan-500 hover:text-cyan-700 transition">
            {String.fromCharCode(65 + i)}. {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
