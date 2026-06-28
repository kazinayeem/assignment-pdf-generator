import type { Metadata } from "next";
import { UniversitiesNav } from "@/components/universities/universities-nav";

export const metadata: Metadata = {
  title: "University Hub",
  description:
    "Explore all UGC-approved universities in Bangladesh. Compare tuition, admission requirements, programs, scholarships, and campus facilities.",
  keywords: [
    "Bangladesh universities",
    "UGC universities",
    "university admission",
    "DIU",
    "BRAC",
    "NSU",
    "BUET",
    "university comparison",
    "CampusFlow",
  ],
};

export default function UniversitiesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-page">
      <UniversitiesNav />
      <main id="main-content">{children}</main>
    </div>
  );
}
