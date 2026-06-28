import React from "react";
import LandingView from "@/components/landing-view";
import { FaqSchema } from "@/components/landing/v5/faq-schema";
import { Metadata } from "next";

const SITE_URL = "https://bornosoft-cover.vercel.app";

export const metadata: Metadata = {
  title: "CampusFlow | Your Complete Academic Productivity Platform",
  description:
    "CampusFlow is the all-in-one platform for CSE & SWE students in Bangladesh. Assignment covers, lab reports, ATS resumes, CS learning, interview prep, career hub, and 100+ developer tools — free forever.",
  keywords: [
    "CampusFlow",
    "CampusFlow V5",
    "Daffodil International University",
    "DIU",
    "DIU Student Portal",
    "Bornosoft",
    "DIU Assignment Cover",
    "Lab Report Generator",
    "CV Builder",
    "ATS Resume",
    "Interview Preparation",
    "Career Hub",
    "CS Learning Platform",
    "Developer Tools",
    "CSE",
    "SWE",
    "Bangladesh",
  ],
  openGraph: {
    title: "CampusFlow | Academic Productivity Platform for Students",
    description:
      "Generate DIU-ready documents, master CS interactively, ace interviews, and launch your career — all in one beautiful platform.",
    type: "website",
    url: SITE_URL,
    siteName: "CampusFlow",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CampusFlow | Built for CSE & SWE Students",
    description:
      "Assignment covers, lab reports, ATS CVs, learning tools, interview hub, and 100+ dev utilities — free for students.",
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <>
      <FaqSchema />
      <LandingView />
    </>
  );
}
