import { CHANGELOG_RELEASES } from "@/lib/changelog/catalog";
import { BRAND } from "@/lib/brand";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bornosoft-cover.vercel.app";

  const items = CHANGELOG_RELEASES.map((release) => {
    const description = `${release.overview} (${release.changes.length} changes)`;
    return `
    <item>
      <title>${release.version} — ${release.title}</title>
      <link>${siteUrl}/changelog#release-${release.id}</link>
      <guid isPermaLink="true">${siteUrl}/changelog#release-${release.id}</guid>
      <pubDate>${new Date(release.date).toUTCString()}</pubDate>
      <description><![CDATA[${description}]]></description>
    </item>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${BRAND.platform} Changelog</title>
    <link>${siteUrl}/changelog</link>
    <description>Release notes and updates for ${BRAND.platform} by ${BRAND.company}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/api/changelog/rss" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
