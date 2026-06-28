import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCalculator, CALCULATOR_SLUGS } from "@/lib/calculators/registry";
import { CalculatorPageClient } from "@/components/calculators/calculator-page-client";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return CALCULATOR_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) return { title: "Calculator Not Found" };
  return {
    title: `${calculator.title} | Financial Calculators`,
    description: calculator.description,
  };
}

export default async function CalculatorSlugPage({ params }: Props) {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) notFound();
  return <CalculatorPageClient calculator={calculator} />;
}
