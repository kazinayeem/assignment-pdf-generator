import type { Metadata } from "next";
import { UniversityCircularCenterClient } from "@/components/universities/university-circular-center-client";

export const metadata: Metadata = {
  title: "Admission Circulars | University Hub",
  description: "Latest admission circulars, notices, and deadlines from Bangladesh universities.",
};

export default function CircularsPage() {
  return <UniversityCircularCenterClient />;
}
