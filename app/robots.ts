import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";

const BASE_URL = BRAND.siteUrl;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/student/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
