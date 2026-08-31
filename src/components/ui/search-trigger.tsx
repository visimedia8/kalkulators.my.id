"use client";
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { SearchModal } from "./search-modal";

export function SearchTrigger({ mobile }: { mobile?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center w-9 h-9 rounded-md text-secondary hover:bg-surface hover:text-primary transition-colors" 
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>
      
      <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
