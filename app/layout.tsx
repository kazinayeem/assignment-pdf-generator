import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";

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
    default: "Daffodil International University Student Portal",
    template: "%s | DIU Student Portal",
  },
  description:
    "Unofficial DIU toolkit for assignment and lab report covers — by Mohammad Ali Nayeem",
  keywords: [
    "Daffodil International University",
    "DIU",
    "DIU assignment cover",
    "DIU lab report",
    "DIU PDF generator",
    "SWE",
    "Software Engineering",
    "Mohammad Ali Nayeem",
  ],
  authors: [{ name: "Mohammad Ali Nayeem" }],
  creator: "Mohammad Ali Nayeem",
  publisher: "Mohammad Ali Nayeem",
  openGraph: {
    title: "Daffodil International University Student Portal",
    description:
      "Unofficial DIU toolkit for assignment and lab report covers — by Mohammad Ali Nayeem",
    type: "website",
    locale: "en_US",
    siteName: "DIU Student Portal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daffodil International University Student Portal",
    description:
      "Unofficial DIU toolkit for assignment and lab report covers — by Mohammad Ali Nayeem",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
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
        {children}
        <Footer/>
      </body>
    </html>
  );
}
