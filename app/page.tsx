import React from "react";
import LandingView from "@/components/landing-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CampusFlow | Your Complete Academic Productivity Platform",
  description: "CampusFlow is the complete academic toolkit for Daffodil International University students. Generate assignment covers, lab reports, CVs, and class routines in seconds. Built by Bornosoft.",
  keywords: [
    "CampusFlow",
    "Daffodil International University",
    "DIU",
    "DIU Student Portal",
    "Bornosoft",
    "DIU Assignment Cover",
    "Lab Report Generator",
    "CV Builder",
    "Class Routine",
    "ATS CV",
    "DIU PDF Generator",
  ],
};

export default function Home() {
  return <LandingView />;
}
