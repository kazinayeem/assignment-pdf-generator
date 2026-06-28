import type { DevToolCategory, DevToolCategoryId } from "./types";

export const DEVTOOL_CATEGORIES: DevToolCategory[] = [
  { id: "data", label: "Data Tools", emoji: "📦", description: "JSON format, validate, convert, and explore" },
  { id: "yaml", label: "YAML Tools", emoji: "📄", description: "YAML format, validate, and convert" },
  { id: "xml", label: "XML Tools", emoji: "📰", description: "XML beautify, validate, and convert" },
  { id: "csv", label: "CSV Tools", emoji: "📊", description: "CSV view, parse, filter, and convert" },
  { id: "css", label: "CSS Tools", emoji: "🎨", description: "Beautify, minify, and generate CSS" },
  { id: "tailwind", label: "Tailwind Tools", emoji: "💨", description: "Tailwind builders and generators" },
  { id: "layout", label: "Layout Playgrounds", emoji: "📐", description: "Flexbox and CSS Grid playgrounds" },
  { id: "color", label: "Color Tools", emoji: "🌈", description: "Pick, convert, and check contrast" },
  { id: "svg", label: "SVG Tools", emoji: "✨", description: "Optimize, preview, and convert SVG" },
  { id: "image", label: "Image Tools", emoji: "🖼️", description: "Compress, resize, and convert images" },
  { id: "qr", label: "QR & Barcode", emoji: "📱", description: "Generate QR codes and barcodes" },
  { id: "encoding", label: "Encoding", emoji: "🔐", description: "Base64, URL, HTML, hex, and more" },
  { id: "generators", label: "Developer Utilities", emoji: "⚡", description: "UUID, JWT, hash, password tools" },
  { id: "network", label: "Networking", emoji: "🌐", description: "IP, CIDR, subnet, and HTTP tools" },
];

export function getDevToolCategory(id: DevToolCategoryId) {
  return DEVTOOL_CATEGORIES.find((c) => c.id === id);
}
