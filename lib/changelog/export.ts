import type { Release } from "./types";
import { CATEGORY_META } from "./constants";
import { groupChangesByCategory } from "./utils";
import { BRAND, PDF_BRAND } from "@/lib/brand";

export function releaseToMarkdown(release: Release): string {
  const groups = groupChangesByCategory(release);
  let md = `# ${release.version} — ${release.title}\n\n`;
  md += `**Date:** ${release.date}  \n`;
  md += `**Type:** ${release.releaseType} | **Status:** ${release.status}\n\n`;
  md += `## Overview\n\n${release.overview}\n\n`;

  for (const [category, items] of groups) {
    const meta = CATEGORY_META[category];
    md += `## ${meta.emoji} ${meta.label}\n\n`;
    for (const item of items) {
      md += `- ${item.title}${item.description ? ` — ${item.description}` : ""}\n`;
    }
    md += "\n";
  }

  if (release.breakingChanges?.length) {
    md += `## ⚠️ Breaking Changes\n\n${release.breakingChanges.map((b) => `- ${b}`).join("\n")}\n\n`;
  }
  if (release.migrationGuide?.length) {
    md += `## Migration Guide\n\n${release.migrationGuide.map((m) => `- ${m}`).join("\n")}\n\n`;
  }
  if (release.knownIssues?.length) {
    md += `## Known Issues\n\n${release.knownIssues.map((k) => `- ${k}`).join("\n")}\n\n`;
  }

  md += `---\n\n${BRAND.platform} · ${BRAND.companyTagline} · ${BRAND.companyUrl}\n`;
  return md;
}

export function releaseToHtml(release: Release): string {
  const groups = groupChangesByCategory(release);
  let body = `<h1>${release.version} — ${release.title}</h1>`;
  body += `<p><strong>Date:</strong> ${release.date}</p>`;
  body += `<h2>Overview</h2><p>${release.overview}</p>`;

  for (const [category, items] of groups) {
    const meta = CATEGORY_META[category];
    body += `<h2>${meta.emoji} ${meta.label}</h2><ul>`;
    for (const item of items) {
      body += `<li>${item.title}</li>`;
    }
    body += `</ul>`;
  }

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${release.version} Release Notes</title>
<style>body{font-family:system-ui,sans-serif;max-width:720px;margin:2rem auto;padding:0 1rem;line-height:1.6;color:#1e293b}
h1{color:#6D5DF6}h2{margin-top:1.5rem;border-bottom:1px solid #e2e8f0;padding-bottom:.25rem}
footer{margin-top:3rem;padding-top:1rem;border-top:1px solid #e2e8f0;font-size:.85rem;color:#64748b}</style></head>
<body>${body}
<footer>${BRAND.platform} · ${BRAND.companyTagline} · ${BRAND.companyUrl}</footer></body></html>`;
}

export function releaseToJson(release: Release): string {
  return JSON.stringify(release, null, 2);
}

export function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function printRelease(release: Release) {
  const html = releaseToHtml(release);
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.print();
}

export function getPdfFooterLines(): string[] {
  return [
    BRAND.platform,
    BRAND.companyTagline,
    BRAND.companyUrl,
    PDF_BRAND.github,
  ];
}
