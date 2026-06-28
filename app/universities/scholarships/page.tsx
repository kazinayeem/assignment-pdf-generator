import type { Metadata } from "next";
import { UniversityScholarshipClient } from "@/components/universities/university-scholarship-client";

export const metadata: Metadata = {
  title: "Scholarship Checker | University Hub",
  description: "Check scholarship and waiver eligibility for Bangladesh universities based on academic merit and income.",
};

export default function ScholarshipsPage() {
  return <UniversityScholarshipClient />;
}
