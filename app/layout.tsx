import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AppFooter from "@/components/app-footer";
import { AuthInitializer } from "@/components/auth-initializer";
import AppSessionProvider from "@/components/session-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { JsonLd } from "@/components/structured-data";
import { I18nProvider } from "@/lib/i18n/provider";
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
    default: "BornoFlow | Learning & Career Platform for CS Students",
    template: "%s | BornoFlow",
  },
  description:
    "BornoFlow by Bornosoft is the complete learning, career, and productivity platform for Computer Science students. Roadmaps, interview prep, developer tools, university guidance, and more.",
  keywords: [
    "BornoFlow",
    "Bornosoft",
    "BornoMaps",
    "BornoCareer",
    "BornoUni",
    "BornoDev",
    "CS Learning Platform",
    "Career Roadmaps",
    "Interview Preparation",
    "Developer Tools",
    "University Hub",
    "Mohammad Ali Nayeem",
  ],
  authors: [{ name: "Mohammad Ali Nayeem" }],
  creator: "Mohammad Ali Nayeem",
  publisher: "Bornosoft",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "BornoFlow | Learning & Career Platform",
    description:
      "Structured roadmaps, interactive learning, interview prep, developer tools, and university guidance — built by Bornosoft.",
    type: "website",
    locale: "en_US",
    siteName: "BornoFlow",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "BornoFlow | CS Learning Platform",
    description:
      "The all-in-one learning and career platform for CS students. Roadmaps, tools, interview prep, and more.",
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
      name: "BornoFlow",
      url: SITE_URL,
      description: "Learning and career platform for CS students by Bornosoft.",
      publisher: { "@type": "Organization", name: "Bornosoft" },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/interview/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "BornoFlow",
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
          <I18nProvider>
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
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
