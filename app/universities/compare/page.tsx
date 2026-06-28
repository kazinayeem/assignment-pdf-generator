import type { Metadata } from "next";
import { UniversityCompareClient } from "@/components/universities/university-compare-client";

export const metadata: Metadata = {
  title: "Compare Universities | University Hub",
  description: "Compare Bangladesh universities side by side — tuition, admission, facilities, and career outcomes.",
};

export default function ComparePage() {
  return <UniversityCompareClient />;
}
