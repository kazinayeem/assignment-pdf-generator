import { ReactNode } from "react";
import Link from "next/link";
import { Home, ChevronRight, BookOpen } from "lucide-react";

export function AlgoPageTemplate({ icon, title, breadcrumb, description, children }: {
  icon: string; title: string; breadcrumb: string; description?: string; children?: ReactNode;
}) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/algorithms" className="text-indigo-600 no-underline flex items-center gap-1.5 hover:text-indigo-800 transition">
          <Home size={16} /> Algorithms
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">{breadcrumb}</span>
      </div>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">{icon} {title}</h1>
        {description && <p className="text-base text-slate-500 leading-relaxed max-w-xl">{description}</p>}
      </div>
      {children || (
        <Section title="Coming Soon">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-10 text-white text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-xl font-bold mb-2">Under Development</h2>
            <p className="text-white/80 mb-6 max-w-md mx-auto text-sm">
              Comprehensive content for {title} is being created including visualizations, code examples, and interview questions.
            </p>
            <Link href="/tools/algorithms" className="no-underline">
              <button className="bg-white text-indigo-600 border-none px-8 py-3 rounded-xl font-semibold cursor-pointer inline-flex items-center gap-2 text-sm hover:bg-indigo-50 transition">
                <BookOpen size={18} /> Back
              </button>
            </Link>
          </div>
        </Section>
      )}
    </div>
  );
}

export function ComplexityBadge({ type, value }: { type: "time" | "space"; value: string }) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold font-mono ${
      type === "time"
        ? "bg-indigo-50 text-indigo-600"
        : "bg-purple-50 text-purple-600"
    }`}>
      {type === "time" ? "Time: " : "Space: "}{value}
    </span>
  );
}

export function AlgorithmCard({ title, description, complexity, featured = false }: {
  title: string; description: string; complexity: { time: string; space: string }; featured?: boolean;
}) {
  return (
    <div className={`rounded-xl p-5 transition-all cursor-pointer ${
      featured
        ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg"
        : "bg-white border border-slate-200 text-slate-900 hover:border-indigo-400 hover:shadow-lg hover:-translate-y-1"
    }`}>
      <h3 className="font-bold text-base mb-2">{title}</h3>
      <p className={`text-sm mb-4 ${featured ? "text-white/90" : "text-slate-500"}`}>{description}</p>
      <div className="flex gap-2 flex-wrap">
        {featured ? (
          <>
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-semibold">Time: {complexity.time}</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-semibold">Space: {complexity.space}</span>
          </>
        ) : (
          <>
            <ComplexityBadge type="time" value={complexity.time} />
            <ComplexityBadge type="space" value={complexity.space} />
          </>
        )}
      </div>
    </div>
  );
}

export function CodeBlock({ code, language = "python" }: { code: string; language?: string }) {
  return (
    <div className="bg-[#1e1e1e] rounded-xl p-5 overflow-x-auto border-l-4 border-indigo-500 mb-5">
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
    info: { bg: "bg-indigo-50", border: "border-indigo-200", icon: "ℹ️", text: "text-indigo-800" },
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

export function StepByStepBreakdown({ steps }: { steps: Array<{ step: number; title: string; desc: string }> }) {
  return (
    <div className="space-y-4">
      {steps.map((s) => (
        <div key={s.step} className="flex gap-4">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
            {s.step}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">{s.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function VisualAnimationContainer({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
      {title && <h3 className="font-bold text-slate-900 text-base mb-4">{title}</h3>}
      {children}
    </div>
  );
}

export function InterviewQuestions({ questions }: { questions: Array<{ q: string; a: string }> }) {
  return (
    <div className="space-y-3">
      {questions.map((item, i) => (
        <details key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 cursor-pointer">
          <summary className="font-semibold text-slate-900 text-sm">{item.q}</summary>
          <p className="text-sm text-slate-500 mt-3 leading-relaxed">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
