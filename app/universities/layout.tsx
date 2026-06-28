import type { Metadata } from "next";
import { UniversitiesNav } from "@/components/universities/universities-nav";
import { PwaRegister } from "@/components/universities/pwa-register";

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
  manifest: "/manifest.json",
};

export default function UniversitiesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-page">
      <UniversitiesNav />
      <div className="max-w-[1280px] mx-auto px-4 pt-2 flex justify-end">
        <PwaRegister />
      </div>
      <main id="main-content">{children}</main>
    </div>
  );
}
