
import os
content = """\"\"\"use client\"\"\";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function ExpandableContent({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative w-full mt-8">
      <div 
        className={`w-full overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? "max-h-[10000px]" : "max-h-[400px]"
        }`}
      >
        {children}
      </div>
      
      {!isExpanded && (
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-base to-transparent pointer-events-none flex items-end justify-center pb-4">
        </div>
      )}
      
      <div className="w-full flex justify-center mt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-surface border border-border text-primary font-medium hover:border-accent hover:text-accent transition-colors shadow-sm"
        >
          {isExpanded ? (
            <>
              Tutup Artikel <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Baca Panduan Lengkap <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
"""
os.makedirs("src/components/ui", exist_ok=True)
with open("src/components/ui/expandable-content.tsx", "w", encoding="utf-8") as f:
    f.write(content.replace("\"\"\"use client\"\"\";", "\"use client\";"))

