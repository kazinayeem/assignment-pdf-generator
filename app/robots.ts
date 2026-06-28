import type { MetadataRoute } from "next";

const BASE_URL = "https://bornosoft-cover.vercel.app";

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
