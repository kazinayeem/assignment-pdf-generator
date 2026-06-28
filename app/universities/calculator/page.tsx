import type { Metadata } from "next";
import { UniversityCalculatorClient } from "@/components/universities/university-calculator-client";

export const metadata: Metadata = {
  title: "Cost Calculator | University Hub",
  description: "Estimate total degree cost, semester fees, and monthly student budget for Bangladesh universities.",
};

export default function CalculatorPage() {
  return <UniversityCalculatorClient />;
}
