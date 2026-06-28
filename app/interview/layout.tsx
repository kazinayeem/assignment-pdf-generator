import type { Metadata } from "next";
import { KnowledgeNav } from "@/components/knowledge/knowledge-nav";
import { KnowledgeSidebar } from "@/components/knowledge/knowledge-sidebar";

export const metadata: Metadata = {
  title: "Interview Knowledge Base",
  description: "Bangladesh tech company interview questions, notes, and preparation resources — imported into CampusFlow.",
};

export default function InterviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-page">
      <KnowledgeNav />
      <div className="max-w-[1400px] mx-auto flex">
        <KnowledgeSidebar />
        <main id="main-content" className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
