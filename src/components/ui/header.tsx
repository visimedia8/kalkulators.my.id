import React from "react";
import Link from "next/link";
import { Calculator } from "lucide-react";
import { SearchTrigger } from "./search-trigger";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full h-16 border-b border-border bg-base/80 backdrop-blur-md">
      <div className="max-w-[1280px] mx-auto w-full h-full px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-[#45A29E] flex items-center justify-center text-base shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.7)] transition-all">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-primary">
            Kalkulators<span className="text-accent">.my.id</span>
          </span>
        </Link>

        {/* Desktop Search / Nav (Simplified) */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6 text-[14px] font-medium text-secondary">
            <Link href="/finansial" className="hover:text-primary transition-colors">Finansial</Link>
            <Link href="/kesehatan" className="hover:text-primary transition-colors">Kesehatan</Link>
            <Link href="/sains" className="hover:text-primary transition-colors">Sains</Link>
          </nav>
          <div className="w-[1px] h-4 bg-border"></div>
          <SearchTrigger />
        </div>

        {/* Mobile Nav Toggle (Just Search for now) */}
        <div className="md:hidden flex items-center">
          <SearchTrigger mobile />
        </div>
      </div>
    </header>
  );
}
