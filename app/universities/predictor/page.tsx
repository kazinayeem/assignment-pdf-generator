import type { Metadata } from "next";
import { UniversityAdmissionPredictorClient } from "@/components/universities/university-admission-predictor-client";

export const metadata: Metadata = {
  title: "Admission Predictor | University Hub",
  description: "AI-powered admission chance predictor for Bangladesh universities based on SSC, HSC, budget, and preferences.",
};

export default function PredictorPage() {
  return <UniversityAdmissionPredictorClient />;
}
