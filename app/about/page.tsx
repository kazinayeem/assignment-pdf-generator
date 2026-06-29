import { Metadata } from "next";
import { AboutPageContent } from "@/components/static-page/about-content";

export const metadata: Metadata = {
  title: "About BornoFlow",
  description: "Learn about BornoFlow and Bornosoft — the complete learning and career platform for CS students, built by Mohammad Ali Nayeem.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
