import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AppFooter from "@/components/app-footer";
import { AuthInitializer } from "@/components/auth-initializer";
import AppSessionProvider from "@/components/session-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { JsonLd } from "@/components/structured-data";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";

const SITE_URL = "https://bornosoft-cover.vercel.app";

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
    default: "CampusFlow V2 | Academic Productivity Platform for DIU",
    template: "%s | CampusFlow V2",
  },
  description:
    "CampusFlow V2 by Bornosoft is the complete academic productivity platform for Daffodil International University students. Assignment covers, lab reports, ATS CVs, CS learning tools, interview prep, and career hub — all in one place.",
  keywords: [
    "CampusFlow",
    "CampusFlow V2",
    "Bornosoft",
    "Daffodil International University",
    "DIU",
    "DIU Assignment Cover Generator",
    "DIU Lab Report Generator",
    "ATS CV Builder",
    "Interview Preparation",
    "Career Hub",
    "CS Learning Platform",
    "CSE",
    "SWE",
    "Academic Productivity",
    "Mohammad Ali Nayeem",
  ],
  authors: [{ name: "Mohammad Ali Nayeem" }],
  creator: "Mohammad Ali Nayeem",
  publisher: "Bornosoft",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "CampusFlow V2 | Academic Productivity Platform for DIU",
    description:
      "Assignment covers, lab reports, ATS CVs, CS learning modules, interview knowledge base, and career tools — built for DIU students by Bornosoft.",
    type: "website",
    locale: "en_US",
    siteName: "CampusFlow V2",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "CampusFlow V2 | DIU Student Platform",
    description:
      "The all-in-one academic and career platform for DIU students. Learning, tools, interview prep, and more.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "CampusFlow V2",
      url: SITE_URL,
      description: "Academic productivity and career platform for DIU students.",
      publisher: { "@type": "Organization", name: "Bornosoft" },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/interview/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "CampusFlow V2",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "BDT" },
    },
  ],
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
        <JsonLd data={structuredData} />
        <ThemeProvider>
          <AppSessionProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-brand focus:text-brand-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
