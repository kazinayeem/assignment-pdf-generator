import type { Metadata } from "next";
import { RoadmapsNav } from "@/components/roadmaps/roadmaps-nav";

export const metadata: Metadata = {
  title: "Roadmaps",
  description:
    "Interactive career roadmaps for CS students — structured learning paths from beginner to job-ready with projects, quizzes, and interview prep.",
  keywords: ["career roadmaps", "CS learning paths", "frontend roadmap", "backend roadmap", "CampusFlow"],
};

export default function RoadmapsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-page">
      <RoadmapsNav />
      <main id="main-content">{children}</main>
    </div>
  );
}
