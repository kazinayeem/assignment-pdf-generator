/** Bornosoft / BornoFlow brand constants — single source of truth */
export const BRAND = {
  company: "Bornosoft",
  platform: "BornoFlow",
  tagline: "Complete Learning & Career Platform for Computer Science Students",
  companyTagline: "A product of Bornosoft",
  logoUrl: "https://bornosoftnr.com/logo.png",
  companyUrl: "https://bornosoftnr.com",
  portfolioUrl: "https://kazinayeem.site",
  author: "Mohammad Ali Nayeem",
  authorTitle: "Founder & Software Engineer",
  authorRole: "Creator of BornoFlow",
  email: "bornosoftnr@gmail.com",
  github: "https://github.com/kazinayeem",
  linkedin: "https://www.linkedin.com/in/kazi-nayeem/",
  facebook: "https://facebook.com",
  copyrightYear: 2026,
} as const;

export const SUB_PRODUCTS = [
  { id: "maps", emoji: "🗺️", name: "BornoMaps", desc: "Interactive Career Roadmaps", href: "/roadmaps" },
  { id: "ai", emoji: "🤖", name: "Borno AI", desc: "AI Learning Assistant", href: "/tools" },
  { id: "career", emoji: "💼", name: "BornoCareer", desc: "Career Hub", href: "/career" },
  { id: "uni", emoji: "🏫", name: "BornoUni", desc: "University Hub", href: "/universities" },
  { id: "dev", emoji: "💻", name: "BornoDev", desc: "Developer Tools", href: "/developer-tools" },
] as const;

/** PDF & certificate branding */
export const PDF_BRAND = {
  platform: BRAND.platform,
  company: BRAND.company,
  version: "BornoFlow V1.0",
  author: BRAND.author,
  authorUrl: BRAND.portfolioUrl,
  companyUrl: BRAND.companyUrl,
  github: "https://github.com/kazinayeem/assignment-pdf-generator",
} as const;
