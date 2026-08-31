
import os
content = """\"\"\"use client\"\"\";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, Calculator, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchResult {
  title: string;
  url: string;
  category: string;
  description: string;
}

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [data, setData] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load data when modal opens
  useEffect(() => {
    if (isOpen && data.length === 0) {
      fetch("/search.json")
        .then((res) => res.json())
        .then((d) => setData(d))
        .catch((e) => console.error("Failed to load search index", e));
    }
  }, [isOpen, data.length]);

  // Handle body scroll locking
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setSelectedIndex(0);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle Search Logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery) ||
        (item.description && item.description.toLowerCase().includes(lowerQuery))
    );
    setResults(filtered.slice(0, 8)); // Max 8 results for performance
    setSelectedIndex(0);
  }, [query, data]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (results[selectedIndex]) {
          router.push(results[selectedIndex].url);
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:px-6">
      <div 
        className="absolute inset-0 bg-base/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div 
        className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
          <Search className="w-5 h-5 text-secondary" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-primary text-lg placeholder:text-secondary"
            placeholder="Cari kalkulator (mis. KPR, Diskon, BMI)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-secondary hover:text-primary hover:bg-base transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() === "" ? (
            <div className="p-8 text-center text-secondary">
              <Calculator className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Ketik sesuatu untuk mulai mencari...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-secondary">
              <p>Tidak ada hasil untuk &quot;{query}&quot;</p>
            </div>
          ) : (
            <ul className="p-2 space-y-1">
              {results.map((res, idx) => (
                <li key={res.url}>
                  <Link
                    href={res.url}
                    onClick={onClose}
                    className={`flex flex-col gap-1 p-3 rounded-xl transition-colors ${
                      idx === selectedIndex
                        ? "bg-base border border-accent/30 shadow-[0_0_15px_var(--accent-glow)]"
                        : "hover:bg-base/50 border border-transparent"
                    }`}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-primary text-[15px]">{res.title}</span>
                      {idx === selectedIndex && (
                        <ArrowRight className="w-4 h-4 text-accent" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-secondary">
                      <span className="px-2 py-0.5 rounded-md bg-surface border border-border">
                        {res.category}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="px-4 py-3 bg-base border-t border-border flex items-center justify-between text-xs text-secondary">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><kbd className="bg-surface border border-border rounded px-1.5 py-0.5 font-mono text-[10px]">?</kbd> <kbd className="bg-surface border border-border rounded px-1.5 py-0.5 font-mono text-[10px]">?</kbd> Navigasi</span>
            <span className="flex items-center gap-1"><kbd className="bg-surface border border-border rounded px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd> Pilih</span>
          </div>
          <span className="flex items-center gap-1"><kbd className="bg-surface border border-border rounded px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd> Tutup</span>
        </div>
      </div>
    </div>
  );
}
"""
os.makedirs("src/components/ui", exist_ok=True)
with open("src/components/ui/search-modal.tsx", "w", encoding="utf-8") as f:
    f.write(content)

