import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppFooter from "@/components/app-footer";
import { AuthInitializer } from "@/components/auth-initializer";
import AppSessionProvider from "@/components/session-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CampusFlow | Academic Productivity Platform for DIU",
    template: "%s | CampusFlow",
  },
  description:
    "CampusFlow is the complete academic productivity platform for Daffodil International University students. Generate assignment covers, lab reports, CVs, and class routines instantly. Built by Bornosoft.",
  keywords: [
    "CampusFlow",
    "Daffodil International University",
    "DIU",
    "DIU Student Portal",
    "Bornosoft",
    "CampusFlow DIU",
    "DIU Assignment Cover",
    "DIU Lab Report",
    "DIU PDF Generator",
    "CV Builder",
    "ATS CV",
    "Class Routine",
    "SWE",
    "CSE",
    "Software Engineering",
    "Mohammad Ali Nayeem",
    "bornosoftnr.com",
  ],
  authors: [{ name: "Mohammad Ali Nayeem" }],
  creator: "Mohammad Ali Nayeem",
  publisher: "Bornosoft",
  openGraph: {
    title: "CampusFlow | Academic Productivity Platform for DIU",
    description:
      "Generate assignment covers, lab reports, CVs, and class routines in seconds. The complete academic toolkit for DIU students.",
    type: "website",
    locale: "en_US",
    siteName: "CampusFlow",
    url: "https://bornosoft-cover.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "CampusFlow | DIU Student Platform",
    description:
      "Generate DIU assignment covers, lab reports, and CVs in seconds. Built by Bornosoft.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AppSessionProvider>
            <AuthInitializer />
            <Toaster position="top-right" />
            {children}
            <AppFooter />
            <Analytics />
          </AppSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
