"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OutputBox } from "@/components/ui/output-box";
import { parseAsInteger, useQueryState } from "nuqs";

export function HppKateringMbgCalculator() {
  const [budgetPemda, setBudgetPemda] = useQueryState("budget", parseAsInteger.withDefault(15000));
  
  // Komposisi 4 Sehat 5 Sempurna (Harga per porsi/gramasi)
  const [karbohidrat, setKarbohidrat] = useQueryState("karbo", parseAsInteger.withDefault(1500)); // Nasi
  const [proteinHewani, setProteinHewani] = useQueryState("hewani", parseAsInteger.withDefault(4000)); // Ayam/Telur
  const [proteinNabati, setProteinNabati] = useQueryState("nabati", parseAsInteger.withDefault(1000)); // Tahu/Tempe
  const [sayur, setSayur] = useQueryState("sayur", parseAsInteger.withDefault(1500)); 
  const [buah, setBuah] = useQueryState("buah", parseAsInteger.withDefault(1500));
  const [susu, setSusu] = useQueryState("susu", parseAsInteger.withDefault(3000));
  const [kemasan, setKemasan] = useQueryState("kemasan", parseAsInteger.withDefault(1000)); // Kotak makan
  
  const [targetPorsi, setTargetPorsi] = useQueryState("porsi", parseAsInteger.withDefault(500));
  const [targetMargin, setTargetMargin] = useQueryState("margin", parseAsInteger.withDefault(15)); // %

  const result = useMemo(() => {
    const totalFoodCost = karbohidrat + proteinHewani + proteinNabati + sayur + buah + susu + kemasan;
    
    // Harga Jual Ideal berdasarkan target margin (Harga Jual = HPP / (1 - margin%))
    const hargaJualIdeal = totalFoodCost / (1 - (targetMargin / 100));
    
    // Keuntungan per porsi jika mengikuti budget pemerintah
    const marginAktualRp = budgetPemda - totalFoodCost;
    const marginAktualPersen = (marginAktualRp / budgetPemda) * 100;
    
    const isOverBudget = totalFoodCost > budgetPemda;
    
    // Total harian
    const omzetHarian = budgetPemda * targetPorsi;
    const hppHarian = totalFoodCost * targetPorsi;
    const labaKotorHarian = omzetHarian - hppHarian;

    return {
      totalFoodCost,
      hargaJualIdeal,
      marginAktualRp,
      marginAktualPersen,
      isOverBudget,
      labaKotorHarian
    };
  }, [budgetPemda, karbohidrat, proteinHewani, proteinNabati, sayur, buah, susu, kemasan, targetPorsi, targetMargin]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6 flex flex-col gap-6">
        
        <div className="flex justify-between items-end border-b pb-4 border-border">
          <div className="w-1/2 pr-4">
            <label className="block text-xs font-medium text-secondary mb-2">Budget Pemda/Porsi (Rp)</label>
            <Input type="number" value={budgetPemda || ""} onChange={(e) => setBudgetPemda(Number(e.target.value))} />
          </div>
          <div className="w-1/2">
            <label className="block text-xs font-medium text-secondary mb-2">Target Margin Dapur (%)</label>
            <Input type="number" value={targetMargin || ""} onChange={(e) => setTargetMargin(Number(e.target.value))} max={50} />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-primary text-sm">HPP Bahan Baku (Per Porsi)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-1">Karbohidrat (Nasi)</label>
              <Input type="number" value={karbohidrat || ""} onChange={(e) => setKarbohidrat(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-1">P. Hewani (Ayam/Ikan)</label>
              <Input type="number" value={proteinHewani || ""} onChange={(e) => setProteinHewani(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-1">P. Nabati (Tahu/Tempe)</label>
              <Input type="number" value={proteinNabati || ""} onChange={(e) => setProteinNabati(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-1">Sayur-mayur</label>
              <Input type="number" value={sayur || ""} onChange={(e) => setSayur(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-1">Buah Segar</label>
              <Input type="number" value={buah || ""} onChange={(e) => setBuah(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-1">Susu (Kotak/Pasteurisasi)</label>
              <Input type="number" value={susu || ""} onChange={(e) => setSusu(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-1">Kemasan & Sendok</label>
              <Input type="number" value={kemasan || ""} onChange={(e) => setKemasan(Number(e.target.value))} />
            </div>
          </div>
        </div>

      </Card>
      
      <Card className="p-6 flex flex-col gap-6 bg-surface/50 border-accent/20">
        <h3 className="text-lg font-semibold text-primary">Analisis Kelayakan Finansial MBG</h3>
        
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Total HPP Food Cost (Porsi)</span>
            <span className="text-danger font-medium">Rp {result.totalFoodCost.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Harga Jual Ideal (Sesuai Margin {targetMargin}%)</span>
            <span className="text-primary font-medium">Rp {Math.ceil(result.hargaJualIdeal).toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border bg-accent/10 p-2 rounded">
            <span className="text-primary font-semibold text-sm">Margin Kotor Terhadap Budget Pemda</span>
            <span className={`font-bold ${result.isOverBudget || result.marginAktualPersen < 10 ? "text-danger" : "text-primary"}`}>
              {result.marginAktualPersen.toFixed(1)}% (Rp {result.marginAktualRp.toLocaleString("id-ID")})
            </span>
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-secondary mb-2">Simulasi Volume Harian: Jumlah Porsi Dimasak</label>
          <Input type="number" value={targetPorsi || ""} onChange={(e) => setTargetPorsi(Number(e.target.value))} />
        </div>

        <OutputBox 
          label="Laba Kotor Dapur per Hari (Sisa untuk Gaji Tukang Masak & Gas)" 
          value={result.isOverBudget ? 0 : result.labaKotorHarian} 
          prefix="Rp "
        />
        
        {result.isOverBudget && (
          <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm">
            HPP Bahan Baku Anda (Rp {result.totalFoodCost.toLocaleString()}) MELEBIHI budget Pemerintah (Rp {budgetPemda.toLocaleString()}). Turunkan gramasi atau cari supplier bahan baku yang lebih murah.
          </div>
        )}
      </Card>
    </div>
  );
}
