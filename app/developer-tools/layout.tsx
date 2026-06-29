import type { Metadata } from "next";
import { DevToolsNav } from "@/components/devtools/devtools-nav";

export const metadata: Metadata = {
  title: "Developer Tools",
  description:
    "100+ free developer utilities — JSON, YAML, CSS, encoders, generators, QR codes, and playgrounds. Premium dev toolbox by BornoFlow.",
  keywords: ["JSON formatter", "Base64 encoder", "UUID generator", "CSS generator", "BornoFlow"],
};

export default function DevToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-page">
      <DevToolsNav />
      <main id="main-content">{children}</main>
    </div>
  );
}
