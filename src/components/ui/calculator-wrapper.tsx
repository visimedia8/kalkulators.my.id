"use client";

import React, { Suspense } from "react";
import { Share2, Code2, Check, Printer } from "lucide-react";
import { Button } from "./button";

interface CalculatorWrapperProps {
  title: string;
  category: string;
  children: React.ReactNode;
}

function CalculatorActions({ title }: { title: string }) {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [copiedEmbed, setCopiedEmbed] = React.useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = () => {
    const embedCode = `<iframe src="${window.location.href}?embed=true" width="100%" height="800px" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 print:hidden">
      <Button variant="secondary" onClick={handleCopyLink} className="h-9 px-3 text-xs flex items-center gap-2">
        {copiedLink ? <Check className="w-3.5 h-3.5 text-success" /> : <Share2 className="w-3.5 h-3.5" />}
        Salin Link
      </Button>
      <Button variant="secondary" onClick={handleCopyEmbed} className="h-9 px-3 text-xs flex items-center gap-2">
        {copiedEmbed ? <Check className="w-3.5 h-3.5 text-success" /> : <Code2 className="w-3.5 h-3.5" />}
        Embed Kode
      </Button>
      <Button variant="secondary" onClick={handlePrint} className="h-9 px-3 text-xs flex items-center gap-2">
        <Printer className="w-3.5 h-3.5" />
        Cetak PDF
      </Button>
    </div>
  );
}

function CalculatorFallback() {
  return (
    <div className="w-full h-[600px] rounded-xl bg-surface/50 border border-border animate-pulse flex items-center justify-center">
      <span className="text-secondary text-sm">Memuat Kalkulator...</span>
    </div>
  );
}

export function CalculatorWrapper({ title, category, children }: CalculatorWrapperProps) {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-1 block">
            {category}
          </span>
          <h1 className="text-3xl font-bold font-display text-primary">
            {title}
          </h1>
        </div>
        <CalculatorActions title={title} />
      </div>

      <div className="w-full">
        <Suspense fallback={<CalculatorFallback />}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}
