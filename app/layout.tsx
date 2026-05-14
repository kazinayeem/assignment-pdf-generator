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
    default: "CoverGen V2 | Academic Productivity Platform for DIU",
    template: "%s | CoverGen V2",
  },
  description:
    "CoverGen V2 by Bornosoft is the complete academic productivity platform for Daffodil International University students. Generate assignment covers, lab reports, ATS-friendly CVs, and master CS topics instantly.",
  keywords: [
    "CoverGen V2",
    "Bornosoft by Nayeem",
    "Daffodil International University",
    "DIU",
    "DIU Assignment Cover Generator",
    "DIU Lab Report Generator",
    "DIU PDF Generator",
    "ATS CV Builder",
    "Class Routine",
    "CSE",
    "SWE",
    "Academic Productivity",
    "Mohammad Ali Nayeem",
    "bornosoftnr.com",
  ],
  authors: [{ name: "Mohammad Ali Nayeem" }],
  creator: "Mohammad Ali Nayeem",
  publisher: "Bornosoft",
  openGraph: {
    title: "CoverGen V2 | Academic Productivity Platform for DIU",
    description:
      "Generate official DIU assignment covers, lab reports, ATS-friendly CVs, and master CS topics — all in one platform. Built by Bornosoft.",
    type: "website",
    locale: "en_US",
    siteName: "CoverGen V2",
    url: "https://bornosoft-cover.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "CoverGen V2 | DIU Student Platform",
    description:
      "Generate DIU assignment covers, lab reports, and ATS-friendly CVs in seconds. Built by Bornosoft by Nayeem.",
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
    <html lang="en" suppressHydrationWarning>
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
