import { Metadata } from "next";
import CVBuilderClient from "./cv-builder-client";

export const metadata: Metadata = {
  title: "CV Builder | BornoFlow",
  description: "Build an ATS-friendly professional CV. Live preview, multiple templates, PDF export.",
};

export default function CVBuilderPage() {
  return <CVBuilderClient />;
}
