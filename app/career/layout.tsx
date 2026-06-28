import type { Metadata } from "next";
import { CareerNav } from "@/components/career/career-nav";

export const metadata: Metadata = {
  title: "Career Hub",
  description:
    "All-in-one career platform for CS students — resume builder, ATS checker, interview prep, application tracking, and career roadmaps by CampusFlow.",
  keywords: ["career hub", "resume builder", "ATS checker", "interview prep", "job tracker", "CampusFlow"],
};

export default function CareerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A]">
      <CareerNav />
      <main id="main-content">{children}</main>
    </div>
  );
}
