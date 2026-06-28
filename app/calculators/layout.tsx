import type { Metadata } from "next";
import { CalculatorsNav } from "@/components/calculators/calculators-nav";

export const metadata: Metadata = {
  title: "Financial Calculators",
  description:
    "100+ free financial calculators — EMI, SIP, tax, salary, FD, Bangladesh bank loans, and more. Premium fintech tools by CampusFlow.",
  keywords: ["EMI calculator", "SIP calculator", "income tax Bangladesh", "loan calculator", "CampusFlow"],
};

export default function CalculatorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A]">
      <CalculatorsNav />
      <main>{children}</main>
    </div>
  );
}
