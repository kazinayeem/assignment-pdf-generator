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
    default: "CoverGen | DIU Student Portal by Bornosoft",
    template: "%s | CoverGen",
  },
  description:
    "The ultimate student toolkit for Daffodil International University. Generate professional assignment and lab report covers automatically. Developed by Bornosoft.",
  keywords: [
    "Daffodil International University",
    "DIU",
    "DIU Student Portal",
    "Bornosoft",
    "CoverGen",
    "DIU Assignment Cover",
    "DIU Lab Report",
    "DIU PDF Generator",
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
    title: "CoverGen | DIU Student Portal by Bornosoft",
    description:
      "Automate your academic covers with precision. The ultimate toolkit for DIU students.",
    type: "website",
    locale: "en_US",
    siteName: "CoverGen",
    url: "https://bornosoftnr.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "CoverGen | DIU Student Portal",
    description:
      "Generate DIU assignment and lab report covers in seconds. Built by Bornosoft.",
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
