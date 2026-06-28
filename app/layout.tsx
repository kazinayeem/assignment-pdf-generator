import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AppFooter from "@/components/app-footer";
import { AuthInitializer } from "@/components/auth-initializer";
import AppSessionProvider from "@/components/session-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
        className={`${plusJakarta.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <AppSessionProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Skip to main content
            </a>
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
