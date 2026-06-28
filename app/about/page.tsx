import { Metadata } from "next";
import { AboutPageContent } from "@/components/static-page/about-content";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about CampusFlow and BornoSoft — built for CSE and SWE students by Mohammad Ali Nayeem.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
