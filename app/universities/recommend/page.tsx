import type { Metadata } from "next";
import { UniversityRecommendClient } from "@/components/universities/university-recommend-client";

export const metadata: Metadata = {
  title: "AI Recommendations | University Hub",
  description: "Get personalized university recommendations based on your GPA, budget, subject preference, and career goals.",
};

export default function RecommendPage() {
  return <UniversityRecommendClient />;
}
