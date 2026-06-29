import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Release } from "./types";
import { CATEGORY_META } from "./constants";
import { groupChangesByCategory, computeStats } from "./utils";
import { CHANGELOG_RELEASES } from "./catalog";
import { BRAND, FOUNDERS } from "@/lib/brand";

const BRAND_RGB: [number, number, number] = [109, 93, 246];
const MARGIN = 18;
const PAGE_W = 210;
const PAGE_H = 297;
const CONTENT_W = PAGE_W - MARGIN * 2;

function addFooter(doc: jsPDF) {
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(120);
    doc.text(`Built with ❤️ by ${BRAND.authors} · ${BRAND.companyTagline}`, MARGIN, PAGE_H - 18);
    doc.text(BRAND.companyUrl, MARGIN, PAGE_H - 13);
    doc.text(`${FOUNDERS[0].portfolioUrl} · ${FOUNDERS[1].portfolioUrl}`, MARGIN, PAGE_H - 8);
    doc.text(`Page ${i} of ${pages}`, PAGE_W - MARGIN, PAGE_H - 8, { align: "right" });
  }
}

function coverPage(doc: jsPDF, release: Release) {
  doc.setFillColor(...BRAND_RGB);
  doc.rect(0, 0, PAGE_W, 85, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text(BRAND.platform, PAGE_W / 2, 28, { align: "center" });
  doc.setFontSize(12);
  doc.text("Release Notes", PAGE_W / 2, 40, { align: "center" });
  doc.setTextColor(0);
  doc.setFontSize(20);
  doc.text(`${release.version} — ${release.title}`, PAGE_W / 2, 105, { align: "center" });
  doc.setFontSize(10);
  doc.setTextColor(80);
  const meta = [
    `Release Date: ${release.date}`,
    `Type: ${release.releaseType} · Status: ${release.status}`,
    `Semver: ${release.semver}`,
    `Generated: ${new Date().toLocaleDateString()}`,
  ];
  meta.forEach((line, i) => doc.text(line, PAGE_W / 2, 125 + i * 7, { align: "center" }));
}

function tocPage(doc: jsPDF, release: Release) {
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(...BRAND_RGB);
  doc.text("Table of Contents", MARGIN, 24);
  doc.setTextColor(0);
  doc.setFontSize(11);
  const sections = ["Overview", "Changes by Category", "Breaking Changes", "Migration Guide", "Known Issues", "Statistics"];
  sections.forEach((s, i) => doc.text(`${i + 1}. ${s}`, MARGIN, 40 + i * 10));
  doc.setFontSize(10);
  doc.setTextColor(80);
  const groups = groupChangesByCategory(release);
  let y = 110;
  doc.text("Categories in this release:", MARGIN, y);
  y += 8;
  for (const [cat] of groups) {
    doc.text(`• ${CATEGORY_META[cat].emoji} ${CATEGORY_META[cat].label}`, MARGIN + 4, y);
    y += 6;
  }
}

function contentPages(doc: jsPDF, release: Release) {
  doc.addPage();
  let y = 24;
  y = writeSection(doc, "Overview", release.overview, y);

  const groups = groupChangesByCategory(release);
  for (const [category, items] of groups) {
    const meta = CATEGORY_META[category];
    if (y > PAGE_H - 50) { doc.addPage(); y = 24; }
    doc.setFontSize(13);
    doc.setTextColor(...BRAND_RGB);
    doc.text(`${meta.emoji} ${meta.label}`, MARGIN, y);
    y += 8;
    doc.setTextColor(0);
    doc.setFontSize(10);
    for (const item of items) {
      if (y > PAGE_H - 20) { doc.addPage(); y = 24; }
      const lines = doc.splitTextToSize(`• ${item.title}`, CONTENT_W);
      doc.text(lines, MARGIN, y);
      y += lines.length * 5 + 2;
    }
    y += 4;
  }

  if (release.breakingChanges?.length) {
    y = writeSection(doc, "Breaking Changes", release.breakingChanges.map((b) => `• ${b}`).join("\n"), y);
  }
  if (release.migrationGuide?.length) {
    y = writeSection(doc, "Migration Guide", release.migrationGuide.map((m) => `• ${m}`).join("\n"), y);
  }
  if (release.knownIssues?.length) {
    y = writeSection(doc, "Known Issues", release.knownIssues.map((k) => `• ${k}`).join("\n"), y);
  }

  doc.addPage();
  doc.setFontSize(14);
  doc.setTextColor(...BRAND_RGB);
  doc.text("Release Statistics", MARGIN, 24);
  const stats = release.stats ?? {};
  autoTable(doc, {
    startY: 32,
    head: [["Metric", "Value"]],
    body: [
      ["Commits", String(stats.commits ?? "—")],
      ["Lines Changed", String(stats.linesChanged ?? "—")],
      ["Contributors", String(stats.contributors ?? 2)],
      ["Changes", String(release.changes.length)],
    ],
    margin: { left: MARGIN, right: MARGIN },
    styles: { fontSize: 9 },
    headStyles: { fillColor: BRAND_RGB },
  });

  const platformStats = computeStats(CHANGELOG_RELEASES);
  autoTable(doc, {
    startY: (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12,
    head: [["Platform Total", "Value"]],
    body: [
      ["Total Releases", String(platformStats.totalReleases)],
      ["Total Features", String(platformStats.totalFeatures)],
      ["Bug Fixes", String(platformStats.bugFixes)],
      ["Performance", String(platformStats.performanceImprovements)],
    ],
    margin: { left: MARGIN, right: MARGIN },
    styles: { fontSize: 9 },
    headStyles: { fillColor: BRAND_RGB },
  });
}

function writeSection(doc: jsPDF, title: string, body: string, y: number): number {
  if (y > PAGE_H - 40) { doc.addPage(); y = 24; }
  doc.setFontSize(14);
  doc.setTextColor(...BRAND_RGB);
  doc.text(title, MARGIN, y);
  y += 8;
  doc.setFontSize(10);
  doc.setTextColor(0);
  const lines = doc.splitTextToSize(body, CONTENT_W);
  for (const line of lines) {
    if (y > PAGE_H - 20) { doc.addPage(); y = 24; }
    doc.text(line, MARGIN, y);
    y += 5;
  }
  return y + 8;
}

export function exportReleasePdf(release: Release, filename?: string) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  coverPage(doc, release);
  tocPage(doc, release);
  contentPages(doc, release);
  addFooter(doc);
  doc.save(filename ?? `bornoflow-${release.version}-release-notes.pdf`);
}

export function exportAllReleasesPdf() {
  const latest = CHANGELOG_RELEASES[0];
  exportReleasePdf(latest, `bornoflow-changelog-${latest.version}.pdf`);
}
