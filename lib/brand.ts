/** Bornosoft / BornoFlow brand constants — single source of truth */
export const BRAND = {
  company: "Bornosoft",
  platform: "BornoFlow",
  tagline: "Complete Learning & Career Platform for Computer Science Students",
  companyTagline: "A product of Bornosoft",
  productLine: "BornoFlow is a product of Bornosoft.",
  logoUrl: "https://bornosoftnr.com/logo.png",
  companyUrl: "https://bornosoftnr.com",
  /** Canonical site URL for metadata, sitemap, RSS */
  siteUrl:
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) ||
    "https://bornosoftnr.com",
  email: "bornosoftnr@gmail.com",
  github: "https://github.com/kazinayeem",
  linkedin: "https://www.linkedin.com/in/kazi-nayeem/",
  facebook: "https://facebook.com",
  copyrightYear: 2026,
  /** Co-founders display name */
  authors: "Mohammad Ali Nayeem & Reduan Ahmad",
  coFoundersTitle: "Co-Founders of Bornosoft",
} as const;

export type Founder = {
  id: string;
  name: string;
  roleKey: string;
  bioKey: string;
  imageUrl: string;
  portfolioUrl: string;
  companyUrl: string;
  github?: string;
  linkedin?: string;
};

export const FOUNDERS: readonly Founder[] = [
  {
    id: "nayeem",
    name: "Mohammad Ali Nayeem",
    roleKey: "founders.nayeem.role",
    bioKey: "founders.nayeem.bio",
    imageUrl: "https://www.kazinayeem.site/myimage.png",
    portfolioUrl: "https://www.kazinayeem.site",
    companyUrl: "https://bornosoftnr.com",
    github: "https://github.com/kazinayeem",
    linkedin: "https://www.linkedin.com/in/kazi-nayeem/",
  },
  {
    id: "reduan",
    name: "Reduan Ahmad",
    roleKey: "founders.reduan.role",
    bioKey: "founders.reduan.bio",
    imageUrl: "https://www.reduanahmadswe.site/reduanahmadswe.png",
    portfolioUrl: "https://www.reduanahmadswe.site",
    companyUrl: "https://bornosoftnr.com",
  },
] as const;

/** @deprecated Use BRAND.authors — kept for PDF backward compatibility */
export const LEGACY_AUTHOR = FOUNDERS[0];

export const SUB_PRODUCTS = [
  { id: "maps", emoji: "🗺️", name: "BornoMaps", desc: "Interactive Career Roadmaps", href: "/roadmaps" },
  { id: "ai", emoji: "🤖", name: "Borno AI", desc: "AI Learning Assistant", href: "/tools" },
  { id: "career", emoji: "💼", name: "BornoCareer", desc: "Career Hub", href: "/career" },
  { id: "uni", emoji: "🏫", name: "BornoUni", desc: "University Hub", href: "/universities" },
  { id: "dev", emoji: "💻", name: "BornoDev", desc: "Developer Tools", href: "/developer-tools" },
] as const;

/** PDF & certificate branding — company only (founders appear on About page) */
export const PDF_BRAND = {
  platform: BRAND.platform,
  company: BRAND.company,
  version: "BornoFlow V1.0",
  companyUrl: BRAND.companyUrl,
  github: "https://github.com/kazinayeem/assignment-pdf-generator",
} as const;
