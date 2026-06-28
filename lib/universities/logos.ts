import type { University } from "./types";

const LOGO_DOMAINS: Record<string, string> = {
  buet: "buet.ac.bd",
  "university-of-dhaka": "du.ac.bd",
  brac: "bracu.ac.bd",
  nsu: "northsouth.edu",
  diu: "daffodilvarsity.edu.bd",
  uiu: "uiu.ac.bd",
  aiub: "aiub.edu",
  ewu: "ewubd.edu",
  iub: "iub.edu.bd",
  sust: "sust.edu",
  ruet: "ruet.ac.bd",
  kuet: "kuet.ac.bd",
  cuet: "cuet.ac.bd",
  ju: "juniv.edu",
  cu: "cu.ac.bd",
  ru: "ru.ac.bd",
  aust: "aust.edu",
  uap: "uap-bd.edu",
  "american-international-university-bangladesh": "aiub.edu",
  "east-west-university": "ewubd.edu",
  "independent-university-bangladesh": "iub.edu.bd",
  "united-international-university": "uiu.ac.bd",
  "north-south-university": "northsouth.edu",
  "brac-university": "bracu.ac.bd",
  "daffodil-international-university": "daffodilvarsity.edu.bd",
};

function extractDomain(website: string): string | null {
  try {
    const host = new URL(website).hostname.replace(/^www\./, "");
    return host || null;
  } catch {
    return null;
  }
}

export function getUniversityLogoUrl(university: University): string | null {
  if (university.logoUrl) return university.logoUrl;
  const domain = LOGO_DOMAINS[university.slug] ?? extractDomain(university.website);
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
}

export function getUniversityDomain(university: University): string | null {
  return LOGO_DOMAINS[university.slug] ?? extractDomain(university.website);
}
