import { Search, Calculator, ArrowRight } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const revalidate = 86400; // Cache 24 jam (Edge Guardrail)

export default async function Home() {
  // Ambil semua kategori beserta kalkulator di dalamnya
  const categories = await prisma.category.findMany({
    include: {
      calculators: {
        take: 5, // Tampilkan maksimal 5 kalkulator per kategori di Homepage
      },
    },
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-6 lg:p-24 max-w-[1280px] mx-auto w-full gap-16">
      
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center text-center gap-6 mt-6 lg:mt-10">
        <h1 className="text-4xl lg:text-6xl font-bold font-display tracking-tight leading-tight">
          Hitung Apapun.<br/>
          <span className="text-accent text-glow">Real-Time. Presisi.</span>
        </h1>
        <p className="text-secondary max-w-[600px] text-[17px] lg:text-lg">
          Platform kalkulator utilitas terpadu untuk industri, finansial, medis, dan gaya hidup di Indonesia.
        </p>

        {/* Mega Search Bar */}
        <div className="w-full max-w-[640px] mt-6 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent to-[#45A29E] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative flex items-center w-full h-14 rounded-xl bg-surface border border-border px-4 shadow-2xl">
            <Search className="w-5 h-5 text-secondary mr-3" />
            <input 
              type="text" 
              placeholder="Cari kalkulator (Cth: KPR, BMI, Diskon, Konversi Suhu)..."
              className="w-full bg-transparent border-none outline-none text-primary placeholder:text-secondary/60 text-base"
            />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="w-full flex flex-col gap-8 mt-4">
        <h2 className="text-2xl font-bold font-display tracking-tight flex items-center gap-2">
          Jelajahi Kategori
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/40 hover:shadow-[0_4px_20px_rgba(99,102,241,0.05)] transition-all">
              <div className="p-6 pb-4 border-b border-border/50 bg-gradient-to-br from-white/[0.02] to-transparent">
                <Link href={`/${category.slug}`} className="group flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors font-display">{category.name}</h3>
                    <p className="text-sm text-secondary mt-1 line-clamp-1">{category.description}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors text-accent">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </div>
              <div className="p-4 flex flex-col gap-1 bg-base/30">
                {category.calculators.length > 0 ? (
                  category.calculators.map((calc) => (
                    <Link 
                      key={calc.id} 
                      href={`/${category.slug}/${calc.slug}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.04] transition-colors text-sm text-primary/90"
                    >
                      <Calculator className="w-4 h-4 text-secondary" />
                      {calc.name}
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-secondary/50 p-2 italic">Belum ada kalkulator</p>
                )}
                
                {category.calculators.length >= 5 && (
                  <Link 
                    href={`/${category.slug}`}
                    className="text-xs text-accent font-medium p-2 mt-1 hover:underline"
                  >
                    Lihat semua kalkulator {category.name} &rarr;
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
