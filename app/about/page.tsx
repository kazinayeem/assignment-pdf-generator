import { Metadata } from "next";
import { AboutPageContent } from "@/components/static-page/about-content";

export const metadata: Metadata = {
  title: "About BornoFlow",
  description: "Learn about BornoFlow, Bornosoft, and our co-founders Mohammad Ali Nayeem and Reduan Ahmad — the complete learning and career platform for CS students.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
