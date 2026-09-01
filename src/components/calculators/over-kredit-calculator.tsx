"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OutputBox } from "@/components/ui/output-box";
import { parseAsInteger, useQueryState } from "nuqs";

export function OverKreditCalculator() {
  const [hargaPasar, setHargaPasar] = useQueryState("hargaPasar", parseAsInteger.withDefault(150000000));
  const [sisaCicilan, setSisaCicilan] = useQueryState("sisaCicilan", parseAsInteger.withDefault(4000000));
  const [sisaTenor, setSisaTenor] = useQueryState("sisaTenor", parseAsInteger.withDefault(24));

  const result = useMemo(() => {
    const totalUtangSisa = sisaCicilan * sisaTenor;
    const nilaiOverKredit = hargaPasar - totalUtangSisa;
    
    return {
      totalUtangSisa,
      nilaiOverKredit,
      isRugi: nilaiOverKredit < 0
    };
  }, [hargaPasar, sisaCicilan, sisaTenor]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6 flex flex-col gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Harga Pasaran Mobil/Motor Bekas Saat Ini (Rp)</label>
            <Input type="number" value={hargaPasar || ""} onChange={(e) => setHargaPasar(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Sisa Cicilan per Bulan (Rp)</label>
            <Input type="number" value={sisaCicilan || ""} onChange={(e) => setSisaCicilan(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Sisa Tenor (Bulan)</label>
            <Input type="number" value={sisaTenor || ""} onChange={(e) => setSisaTenor(Number(e.target.value))} />
          </div>
        </div>
      </Card>
      <Card className="p-6 flex flex-col gap-6 bg-surface/50 border-accent/20">
        <h3 className="text-lg font-semibold text-primary">Analisis Nilai Over Kredit</h3>
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Total Sisa Utang (Pokok + Bunga)</span>
            <span className="text-danger font-medium">Rp {result.totalUtangSisa.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Harga Jual Wajar Saat Ini</span>
            <span className="text-primary font-medium">Rp {hargaPasar.toLocaleString("id-ID")}</span>
          </div>
        </div>
        
        <OutputBox 
          label={result.isRugi ? "Nilai Minus (Anda Harus Nombok ke Pembeli)" : "Harga Ganti DP Wajar (Kompensasi)"} 
          value={Math.abs(result.nilaiOverKredit)} 
          prefix="Rp "
        />
        
        {result.isRugi && (
          <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm">
            Hati-hati! Sisa utang leasing lebih besar dari harga pasaran mobil saat ini. Mengalihkan kredit justru merugikan pihak pembeli, sehingga secara logika ekonomi Anda tidak akan mendapat ganti DP, melainkan harus menutupi selisih minusnya.
          </div>
        )}
      </Card>
    </div>
  );
}
