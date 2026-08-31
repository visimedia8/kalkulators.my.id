import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const revalidate = 86400; // Cache for 24 hours (Cloudflare D1 guardrail)

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({ select: { slug: true } });
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) {
    return { title: "Kategori Tidak Ditemukan" };
  }

  return {
    title: `Kumpulan Kalkulator ${category.name} Online`,
    description: category.description || `Daftar kalkulator lengkap untuk kategori ${category.name}.`,
  };
}

export default async function CategoryHubPage({ params }: PageProps) {
  const { category: categorySlug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: {
      calculators: {
        orderBy: { name: 'asc' }
      }
    },
  });

  if (!category) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Beranda", href: "/" },
    { label: category.name },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-6 lg:p-24 max-w-[1280px] mx-auto w-full gap-12">
      <div className="w-full flex flex-col gap-4">
        <Breadcrumbs items={breadcrumbs} />
        <div className="border-b border-border pb-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
            Kategori: <span className="text-accent">{category.name}</span>
          </h1>
          {category.description && (
            <p className="text-secondary text-lg max-w-[800px]">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.calculators.map((calc) => (
          <Link href={`/${category.slug}/${calc.slug}`} key={calc.id} className="group">
            <div className="h-full flex flex-col p-6 rounded-2xl bg-surface border border-border hover:border-accent hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-300">
              <h2 className="text-xl font-semibold text-primary group-hover:text-accent mb-2 transition-colors">
                {calc.name}
              </h2>
              {calc.description && (
                <p className="text-secondary text-sm line-clamp-2">
                  {calc.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {category.calculators.length === 0 && (
        <div className="w-full text-center py-24">
          <p className="text-secondary text-lg">Belum ada kalkulator di kategori ini.</p>
        </div>
      )}
    </main>
  );
}
