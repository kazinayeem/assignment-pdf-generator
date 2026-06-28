import { ReactNode } from "react";
import Link from "next/link";
import { Home, ChevronRight, BookOpen } from "lucide-react";
import { Section, InterviewQuestions as BaseInterviewQuestions } from "@/components/tools/topic-primitives";
import { ToolsButton } from "@/components/tools/tools-button";

export {
  Section,
  InfoCard,
  CodeBlock,
  InterviewQuestion,
  Diagram,
} from "@/components/tools/topic-primitives";

export function InterviewQuestions({ questions }: { questions: Array<{ q: string; a: string }> }) {
  return <BaseInterviewQuestions questions={questions} />;
}

export function AlgoPageTemplate({ icon, title, breadcrumb, description, children }: {
  icon: string; title: string; breadcrumb: string; description?: string; children?: ReactNode;
}) {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <nav className="flex items-center gap-2 mb-8 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/tools/algorithms" className="text-[#6D5DF6] flex items-center gap-1.5 hover:underline min-h-[44px]">
          <Home size={16} aria-hidden /> Algorithms
        </Link>
        <ChevronRight size={16} aria-hidden />
        <span className="text-slate-900 dark:text-white font-medium">{breadcrumb}</span>
      </nav>
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
          <span className="mr-2" aria-hidden>{icon}</span>{title}
        </h1>
        {description && <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">{description}</p>}
      </div>
      {children || (
        <Section title="Coming Soon">
          <div className="glass-card p-10 sm:p-14 text-center">
            <div className="text-6xl mb-4" aria-hidden>🚀</div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Under Development</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
              Comprehensive content for {title} is being created including visualizations, code examples, and interview questions.
            </p>
            <ToolsButton href="/tools/algorithms" variant="primary">
              <BookOpen size={18} aria-hidden /> Back to Algorithms
            </ToolsButton>
          </div>
        </Section>
      )}
    </div>
  );
}

export function ComplexityBadge({ type, value }: { type: "time" | "space"; value: string }) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${
      type === "time"
        ? "bg-[#6D5DF6]/10 text-[#6D5DF6] border-[#6D5DF6]/20"
        : "bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400"
    }`}>
      {type === "time" ? "Time: " : "Space: "}{value}
    </span>
  );
}

export function AlgorithmCard({ title, description, complexity, featured = false }: {
  title: string; description: string; complexity: { time: string; space: string }; featured?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-6 transition-all cursor-pointer glass-card ${
      featured ? "bg-gradient-to-br from-[#6D5DF6] to-[#8B5CF6] text-white" : ""
    }`}>
      <h3 className="font-bold text-base mb-2">{title}</h3>
      <p className={`text-sm mb-4 ${featured ? "text-white/90" : "text-slate-500"}`}>{description}</p>
      <div className="flex gap-2 flex-wrap">
        {featured ? (
          <>
            <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[10px] font-semibold">Time: {complexity.time}</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[10px] font-semibold">Space: {complexity.space}</span>
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

export function StepByStepBreakdown({ steps }: { steps: Array<{ step: number; title: string; desc: string }> }) {
  return (
    <div className="space-y-4">
      {steps.map((s) => (
        <div key={s.step} className="flex gap-4 glass-card p-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6D5DF6] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
            {s.step}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{s.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function VisualAnimationContainer({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="glass-card p-6 mb-6">
      {title && <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">{title}</h3>}
      {children}
    </div>
  );
}
