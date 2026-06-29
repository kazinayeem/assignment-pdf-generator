import React from "react";
import LandingView from "@/components/landing-view";
import { FaqSchema } from "@/components/landing/v5/faq-schema";
import { Metadata } from "next";

const SITE_URL = "https://bornosoft-cover.vercel.app";

export const metadata: Metadata = {
  title: "BornoFlow | Learning & Career Platform for CS Students",
  description:
    "BornoFlow is the all-in-one learning and career platform for CSE & SWE students. Roadmaps, assignment tools, ATS resumes, CS learning, interview prep, career hub, and 100+ developer tools — free forever.",
  keywords: [
    "BornoFlow",
    "Bornosoft",
    "BornoMaps",
    "BornoCareer",
    "BornoUni",
    "BornoDev",
    "Career Roadmaps",
    "CV Builder",
    "ATS Resume",
    "Interview Preparation",
    "CS Learning Platform",
    "Developer Tools",
    "CSE",
    "SWE",
    "Bangladesh",
  ],
  openGraph: {
    title: "BornoFlow | Learning & Career Platform",
    description:
      "Structured roadmaps, interactive learning, interview prep, developer tools, and university guidance — built by Bornosoft.",
    type: "website",
    url: SITE_URL,
    siteName: "BornoFlow",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BornoFlow | Built for CSE & SWE Students",
    description:
      "Roadmaps, learning tools, interview hub, assignment studio, and 100+ dev utilities — free for students.",
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return (
    <>
      <FaqSchema />
      <LandingView />
    </>
  );
}
