import React from "react";
import LandingView from "@/components/landing-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DIU CoverGen | Automate Your Academic Covers",
  description: "The ultimate student portal for Daffodil International University. Generate professional assignment and lab report covers in seconds. Built by Bornosoft.",
  keywords: [
    "Daffodil International University",
    "DIU",
    "DIU Student Portal",
    "Bornosoft",
    "CoverGen",
    "DIU Assignment",
    "Lab Report Generator"
  ],
};

export default function Home() {
  return <LandingView />;
}
