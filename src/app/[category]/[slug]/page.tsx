import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { CALCULATOR_REGISTRY } from "@/components/calculators/calculator-registry";
import { CalculatorWrapper } from "@/components/ui/calculator-wrapper";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { ExpandableContent } from "@/components/ui/expandable-content";
import Link from "next/link";
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

  const relatedCalcs = await prisma.calculator.findMany({
    where: { categoryId: calc.categoryId, id: { not: calc.id } },
    take: 3,
    orderBy: { name: "asc" }
  });

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

      {/* BRIDGE TOC (Table of Contents) */}
      {calc.content && (
        <div className="w-full max-w-[800px] mt-8 flex flex-wrap gap-2 justify-center">
          <span className="text-sm font-medium text-secondary mr-2 py-1">Lompat ke:</span>
          {calc.content.definitionalH2 && (
            <a href="#pengertian" className="px-3 py-1 bg-surface border border-border rounded-full text-sm text-primary hover:border-accent hover:text-accent transition-colors">Pengertian</a>
          )}
          {calc.content.variablesH2 && (
            <a href="#parameter-utama" className="px-3 py-1 bg-surface border border-border rounded-full text-sm text-primary hover:border-accent hover:text-accent transition-colors">Parameter</a>
          )}
          {calc.content.actionableH3 && (
            <a href="#panduan-lengkap" className="px-3 py-1 bg-surface border border-border rounded-full text-sm text-primary hover:border-accent hover:text-accent transition-colors">Cara Pakai</a>
          )}
          {calc.content.booleanFaqH4 && (
            <a href="#tanya-jawab" className="px-3 py-1 bg-surface border border-border rounded-full text-sm text-primary hover:border-accent hover:text-accent transition-colors">FAQ</a>
          )}
        </div>
      )}

      {/* SEO CONTENT BLOCKS BELOW THE FOLD */}
      {calc.content && (
        <ExpandableContent>
          <article className="w-full max-w-[800px] mx-auto flex flex-col gap-10">
            {calc.content.definitionalH2 && (
              <MarkdownRenderer content={calc.content.definitionalH2.replace(/^## .*$/m, "## Pengertian")} />
            )}

            {calc.content.variablesH2 && (
              <MarkdownRenderer content={calc.content.variablesH2.replace(/^## .*$/m, "## Parameter Utama")} />
            )}

            {calc.content.actionableH3 && (
              <MarkdownRenderer content={calc.content.actionableH3.replace(/^### .*$/m, "### Panduan Lengkap")} />
            )}

            {calc.content.booleanFaqH4 && (
              <MarkdownRenderer content={calc.content.booleanFaqH4.replace(/^#### .*$/m, "#### Tanya Jawab")} />
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
        </ExpandableContent>
      )}

      {/* RELATED CALCULATORS */}
      {relatedCalcs.length > 0 && (
        <div className="w-full max-w-[1280px] mt-16 pt-10 border-t border-border">
          <h3 className="text-2xl font-bold font-display text-primary mb-6">Kalkulator {calc.category.name} Lainnya</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedCalcs.map((rc) => (
              <Link href={`/${calc.category.slug}/${rc.slug}`} key={rc.id} className="group">
                <div className="h-full flex flex-col p-6 rounded-2xl bg-surface border border-border hover:border-accent hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-300">
                  <h4 className="text-lg font-semibold text-primary group-hover:text-accent mb-2 transition-colors">
                    {rc.name}
                  </h4>
                  {rc.description && (
                    <p className="text-secondary text-sm line-clamp-2">
                      {rc.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
