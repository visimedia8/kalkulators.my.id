"use client";

import React, { useMemo } from "react";
import { parseAsInteger, parseAsFloat, useQueryState } from "nuqs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { OutputBox } from "@/components/ui/output-box";

export function SultanSniperPkCalculator() {
  const [poinLawan, setPoinLawan] = useQueryState("poinLawan", parseAsInteger.withDefault(0));
  const [poinKita, setPoinKita] = useQueryState("poinKita", parseAsInteger.withDefault(0));
  const [multiplier, setMultiplier] = useQueryState("multiplier", parseAsFloat.withDefault(1));
  const [hargaKoin, setHargaKoin] = useQueryState("hargaKoin", parseAsInteger.withDefault(170));

  const { koinDibutuhkan, totalBiaya, rekomendasi } = useMemo(() => {
    const defisitPoin = (poinLawan || 0) - (poinKita || 0);
    
    if (defisitPoin <= 0) {
      return { koinDibutuhkan: 0, totalBiaya: 0, rekomendasi: "Kita sudah memimpin secara akurat!" };
    }

    const koin = Math.ceil(defisitPoin / (multiplier || 1)) + 1;
    const biaya = koin * (hargaKoin || 0);
    
    let rek = "Gift standar";
    if (koin > 29999) {
      rek = "Lion (30000 Koin)";
    } else if (koin > 4999) {
      rek = "Universe (5000 Koin)";
    } else if (koin > 999) {
      rek = "Paus (2000 Koin)";
    }

    return { koinDibutuhkan: koin, totalBiaya: biaya, rekomendasi: rek };
  }, [poinLawan, poinKita, multiplier, hargaKoin]);

  return (
    <Card className="w-full max-w-lg mx-auto p-6">
      <div className="mb-6 border-b border-border pb-4">
        <h2 className="text-xl font-bold">Kalkulator Sultan Sniper PK Battle</h2>
      </div>
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Poin Lawan (Real-time)</label>
          <Input 
            type="number" 
            value={poinLawan === null ? "" : poinLawan} 
            onChange={(e) => setPoinLawan(parseInt(e.target.value) || 0)} 
            placeholder="0"
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-medium">Poin Kita Saat Ini</label>
          <Input 
            type="number" 
            value={poinKita === null ? "" : poinKita} 
            onChange={(e) => setPoinKita(parseInt(e.target.value) || 0)} 
            placeholder="0"
          />
        </div>
        
        <div className="space-y-1">
          <Select 
            label="Multiplier (Buff)"
            value={multiplier?.toString() || "1"} 
            onChange={(e) => setMultiplier(parseFloat(e.target.value))}
          >
            <option value="1">1x (Akurat Normal)</option>
            <option value="1.5">1.5x (Buff Standar Industri)</option>
            <option value="2">2x (Buff Maksimal)</option>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Harga 1 Koin (IDR)</label>
          <Input 
            type="number" 
            value={hargaKoin === null ? "" : hargaKoin} 
            onChange={(e) => setHargaKoin(parseInt(e.target.value) || 0)} 
          />
        </div>

        <div className="pt-4 space-y-4">
          <OutputBox 
            label="Koin Dibutuhkan (Presisi)" 
            value={koinDibutuhkan}
            suffix=" Koin" 
          />
          <OutputBox 
            label="Total Biaya (IDR)" 
            value={totalBiaya}
            prefix="Rp "
          />
          <OutputBox 
            label="Rekomendasi Sniper Gift" 
            value={rekomendasi as any} 
          />
        </div>
      </div>
    </Card>
  );
}
