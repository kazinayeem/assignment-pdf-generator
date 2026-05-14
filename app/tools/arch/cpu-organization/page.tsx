"use client";

import { ArchTopicTemplate, Section } from "../components";

export default function CPUOrganizationPage() {
  return (
    <ArchTopicTemplate icon="⚙️" title="CPU Organization" breadcrumb="CPU Organization" description="Deep dive into CPU architecture: ALU, control unit, register file, and how components work together to execute instructions.">
      <Section title="What You'll Learn">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { topic: "Theory", desc: "Fundamental concepts and principles" },
            { topic: "Visualizations", desc: "Interactive diagrams and animations" },
            { topic: "Real Examples", desc: "How modern CPUs implement this" },
            { topic: "Interview Prep", desc: "Common interview questions and answers" },
            { topic: "Practice Problems", desc: "Coding and theoretical problems" },
            { topic: "Performance Analysis", desc: "How this impacts CPU performance" },
          ].map((item, i) => (
            <div key={i} className="bg-cyan-50 rounded-xl border border-cyan-200 p-4">
              <h4 className="text-sm font-bold text-cyan-700 mb-1.5">{item.topic}</h4>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>
    </ArchTopicTemplate>
  );
}
