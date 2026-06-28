"use client";

import dynamic from "next/dynamic";
import { MarkdownSkeleton } from "./markdown-skeleton";

export const MarkdownRenderer = dynamic(
  () => import("./markdown-renderer").then((m) => m.MarkdownRenderer),
  { loading: () => <MarkdownSkeleton />, ssr: true }
);

export { TableOfContents } from "./markdown-renderer";
