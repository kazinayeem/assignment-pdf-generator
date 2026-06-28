import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDevTool, DEVTOOL_SLUGS } from "@/lib/devtools/registry";
import { DevToolPageClient } from "@/components/devtools/tool-page-client";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return DEVTOOL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getDevTool(slug);
  if (!tool) return { title: "Tool Not Found" };
  return {
    title: `${tool.title} | Developer Tools`,
    description: tool.description,
  };
}

export default async function DevToolSlugPage({ params }: Props) {
  const { slug } = await params;
  const tool = getDevTool(slug);
  if (!tool) notFound();
  return <DevToolPageClient tool={tool} />;
}
