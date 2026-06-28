import { ReactNode } from "react";
import Link from "next/link";
import { Home, ChevronRight, BookOpen } from "lucide-react";
import { Section } from "@/components/tools/topic-primitives";
import { ToolsButton } from "@/components/tools/tools-button";

export {
  Section,
  InfoCard,
  CodeBlock,
  InterviewQuestion,
  InterviewQuestions,
  Diagram,
} from "@/components/tools/topic-primitives";

export function ArchitectureCard({ title, description, icon, featured = false }: { title: string; description: string; icon: string; featured?: boolean }) {
  return (
    <div className={`rounded-2xl p-6 transition-all cursor-pointer flex flex-col glass-card ${
      featured ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white" : ""
    }`}>
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-base mb-2">{title}</h3>
      <p className={`text-sm mb-4 flex-1 ${featured ? "text-white/90" : "text-slate-500"}`}>{description}</p>
      <div className={`pt-3 border-t text-sm font-semibold ${featured ? "border-white/20 text-white" : "border-slate-200 text-[#6D5DF6]"}`}>
        Explore →
      </div>
    </div>
  );
}

export function ComplexityBadge({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-block bg-[#6D5DF6]/10 text-[#6D5DF6] px-3 py-1.5 rounded-xl text-xs font-bold font-mono border border-[#6D5DF6]/20">
      {label}: {value}
    </span>
  );
}

export function CPUStage({ stage, desc, icon = "→" }: { stage: string; desc: string; icon?: string }) {
  return (
    <div className="bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-500/10 dark:to-white/5 border-2 border-cyan-500/50 rounded-2xl p-4 flex-1 text-center min-w-[120px]">
      <div className="text-xl mb-2">{icon}</div>
      <h4 className="text-sm font-bold text-cyan-700 dark:text-cyan-400 mb-1.5">{stage}</h4>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  );
}

export function MemoryBlock({ label, size, speed }: { label: string; size: string; speed: string }) {
  return (
    <div className="bg-cyan-50 dark:bg-cyan-500/10 border-2 border-cyan-500/50 rounded-2xl p-4 text-center cursor-pointer transition-all hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105">
      <h4 className="text-sm font-bold text-cyan-700 dark:text-cyan-400 mb-1">{label}</h4>
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
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 text-[10px] font-bold text-center p-2 shadow-lg">
            <div>{step.label}</div>
          </div>
          {i < steps.length - 1 && <div className="text-cyan-500 text-xl shrink-0">→</div>}
        </div>
      ))}
    </div>
  );
}

export function ArchTopicTemplate({ icon, title, breadcrumb, description, children }: {
  icon: string; title: string; breadcrumb: string; description: string; children?: React.ReactNode;
}) {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <nav className="flex items-center gap-2 mb-8 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/tools/arch" className="text-[#6D5DF6] flex items-center gap-1.5 hover:underline min-h-[44px]">
          <Home size={16} aria-hidden /> Architecture
        </Link>
        <ChevronRight size={16} aria-hidden />
        <span className="text-slate-900 dark:text-white font-medium">{breadcrumb}</span>
      </nav>
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
          <span className="mr-2" aria-hidden>{icon}</span>{title}
        </h1>
        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">{description}</p>
      </div>
      {children || (
        <Section title="Coming Soon">
          <div className="glass-card p-10 sm:p-14 text-center">
            <div className="text-6xl mb-4" aria-hidden>🚀</div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Page Under Development</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
              Comprehensive content for {title} is being created including visualizations, code examples, and interview questions.
            </p>
            <ToolsButton href="/tools/arch" variant="primary">
              <BookOpen size={18} aria-hidden /> Back to Architecture Hub
            </ToolsButton>
          </div>
        </Section>
      )}
    </div>
  );
}

export function QuizCard({ question, options }: { question: string; options: string[]; correct?: number }) {
  return (
    <div className="glass-card p-6 mb-4">
      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">{question}</h4>
      <div className="flex flex-col gap-2">
        {options.map((opt, i) => (
          <button key={i} className="bg-slate-50 dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-slate-600 dark:text-slate-300 p-3.5 rounded-xl font-medium cursor-pointer text-left text-sm hover:border-[#6D5DF6]/40 hover:text-[#6D5DF6] transition min-h-[44px]">
            {String.fromCharCode(65 + i)}. {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
