import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { CALCULATOR_REGISTRY } from "@/components/calculators/calculator-registry";
import { CalculatorWrapper } from "@/components/ui/calculator-wrapper";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import type { Metadata } from "next";

export const revalidate = 86400; // Cache 24 jam (Edge Guardrail)

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await params;
  const calc = await prisma.calculator.findUnique({
    where: { slug: p.slug },
    include: { category: true },
  });

  if (!calc || calc.category.slug !== p.category) {
    return {};
  }

  return {
    title: `${calc.name} | Kalkulators.my.id`,
    description: calc.description,
  };
}

export async function generateStaticParams() {
  const calculators = await prisma.calculator.findMany({
    include: { category: true },
  });

  return calculators.map((c) => ({
    category: c.category.slug,
    slug: c.slug,
  }));
}

export default async function CalculatorPage({ params }: PageProps) {
  const p = await params;
  const calc = await prisma.calculator.findUnique({
    where: { slug: p.slug },
    include: { content: true, category: true },
  });

  if (!calc || calc.category.slug !== p.category) {
    notFound();
  }

  const CalcComponent = CALCULATOR_REGISTRY[calc.slug];
  if (!CalcComponent) {
    notFound();
  }

  const breadcrumbs = [
    { label: calc.category.name, href: `/${calc.category.slug}` },
    { label: calc.name }
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-6 lg:p-24 max-w-[1280px] mx-auto w-full gap-8">
      
      <div className="w-full">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <CalculatorWrapper 
        title={calc.content?.h1Title || calc.name} 
        category={calc.category.name}
      >
        <CalcComponent />
      </CalculatorWrapper>

      {/* SEO CONTENT BLOCKS BELOW THE FOLD */}
      {calc.content && (
        <article className="w-full max-w-[800px] mt-12 flex flex-col gap-10">
          {calc.content.definitionalH2 && (
            <MarkdownRenderer content={calc.content.definitionalH2} />
          )}

          {calc.content.variablesH2 && (
            <MarkdownRenderer content={calc.content.variablesH2} />
          )}

          {calc.content.actionableH3 && (
            <MarkdownRenderer content={calc.content.actionableH3} />
          )}

          {calc.content.booleanFaqH4 && (
            <MarkdownRenderer content={calc.content.booleanFaqH4} />
          )}

          {/* INJECT JSON-LD FAQ SCHEMA IF AVAILABLE */}
          {calc.content.faqJsonLd && (
            <div dangerouslySetInnerHTML={{ __html: calc.content.faqJsonLd }} />
          )}

          {/* INJECT SOFTWARE APPLICATION SCHEMA */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": calc.name,
                "description": calc.description || `Kalkulator ${calc.name} online gratis.`,
                "applicationCategory": "UtilityApplication",
                "operatingSystem": "Any",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "IDR",
                },
              }),
            }}
          />
        </article>
      )}
    </main>
  );
}
