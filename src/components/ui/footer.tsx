import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Calculator } from "lucide-react";

export async function Footer() {
  // Fetch categories for Column 1
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  // Fetch top calculators for Column 2
  // We'll pick a few from different categories
  const topCalculators = await prisma.calculator.findMany({
    take: 10,
    orderBy: { id: 'asc' }, // just as a mock for "popular"
    include: { category: true }
  });

  // Helper to generate LSI anchor text (Rotasi Anchor Text)
  const generateLsiAnchor = (calcName: string, id: string) => {
    const lsiVariations = [
      `Hitung ${calcName}`,
      `Simulasi ${calcName}`,
      `Kalkulator ${calcName} Online`,
      `Alat Hitung ${calcName}`,
      `${calcName} Akurat`
    ];
    // deterministically pick one based on id length or name length
    const index = (calcName.length + id.length) % lsiVariations.length;
    return lsiVariations[index];
  };

  return (
    <footer className="w-full bg-surface border-t border-border py-12 mt-20 print:hidden">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Kolom 1: Category Hubs */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-primary font-display font-bold text-lg mb-2">
            <Calculator className="w-5 h-5 text-accent" />
            <span>Kalkulators.my.id</span>
          </div>
          <p className="text-secondary text-sm mb-2">
            Pusat kalkulator utilitas terpadu untuk industri, finansial, medis, dan gaya hidup di Indonesia.
          </p>
          <h4 className="font-semibold text-primary mt-2">Jelajahi Kategori</h4>
          <ul className="flex flex-col gap-2">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link href={`/${cat.slug}`} className="text-secondary text-sm hover:text-accent transition-colors">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Kolom 2: Top Calculators with LSI Anchor Text */}
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-primary mb-2 mt-1 lg:mt-0">Kalkulator Terpopuler</h4>
          <ul className="flex flex-col gap-2">
            {topCalculators.map((calc) => (
              <li key={calc.id}>
                <Link 
                  href={`/${calc.category.slug}/${calc.slug}`} 
                  className="text-secondary text-sm hover:text-accent transition-colors"
                >
                  {generateLsiAnchor(calc.name, calc.id)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Kolom 3: Legal & About */}
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-primary mb-2 mt-1 lg:mt-0">Informasi Legal</h4>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/about" className="text-secondary text-sm hover:text-accent transition-colors">
                Tentang Kami
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-secondary text-sm hover:text-accent transition-colors">
                Kebijakan Privasi (Privacy Policy)
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-secondary text-sm hover:text-accent transition-colors">
                Syarat & Ketentuan
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-secondary text-sm hover:text-accent transition-colors">
                Hubungi Kami (Kerjasama & Iklan)
              </Link>
            </li>
          </ul>
        </div>

      </div>
      
      <div className="max-w-[1280px] mx-auto px-6 mt-12 pt-8 border-t border-border/50 text-center text-secondary text-xs">
        &copy; {new Date().getFullYear()} Kalkulators.my.id. All rights reserved.
      </div>
    </footer>
  );
}
