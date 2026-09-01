"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OutputBox } from "@/components/ui/output-box";
import { parseAsInteger, useQueryState } from "nuqs";

export function DepresiasiIphoneCalculator() {
  const [hargaBaru, setHargaBaru] = useQueryState("harga", parseAsInteger.withDefault(15000000));
  const [batteryHealth, setBatteryHealth] = useQueryState("bh", parseAsInteger.withDefault(85));
  const [umurBulan, setUmurBulan] = useQueryState("umur", parseAsInteger.withDefault(12));

  const result = useMemo(() => {
    // 1. Depresiasi Umur Dasar (Umumnya iPhone turun 15% di tahun pertama, lalu 10% di tahun berikutnya)
    // Formula sederhana: turun 1.5% per bulan di 12 bulan pertama, lalu 0.8% per bulan
    let depresiasiUmurPersen = 0;
    if (umurBulan <= 12) {
      depresiasiUmurPersen = umurBulan * 1.5;
    } else {
      depresiasiUmurPersen = (12 * 1.5) + ((umurBulan - 12) * 0.8);
    }
    
    // Max depresiasi umur dibatasi 60% agar tidak jadi minus atau 0
    if (depresiasiUmurPersen > 60) depresiasiUmurPersen = 60;

    let hargaSetelahUmur = hargaBaru * (1 - (depresiasiUmurPersen / 100));

    // 2. Depresiasi / Penalti Battery Health (BH)
    // Di bawah 100% mulai turun. Jika BH di bawah 80%, dianggap "Service" (Turun drastis karena butuh ganti baterai)
    let penaltiBhPersen = 0;
    if (batteryHealth >= 95) {
      penaltiBhPersen = 0; // Like new
    } else if (batteryHealth >= 85) {
      penaltiBhPersen = (100 - batteryHealth) * 0.5; // Potongan sedang
    } else if (batteryHealth >= 80) {
      penaltiBhPersen = (100 - batteryHealth) * 0.8; // Potongan besar
    } else {
      penaltiBhPersen = 25; // Potongan "Service Baterai" flat 25% dari nilai sisa
    }

    const nilaiPenaltiBh = hargaSetelahUmur * (penaltiBhPersen / 100);
    const hargaTaksiran = hargaSetelahUmur - nilaiPenaltiBh;

    return {
      depresiasiUmurPersen: depresiasiUmurPersen.toFixed(1),
      penaltiBhPersen: penaltiBhPersen.toFixed(1),
      nilaiPenaltiBh,
      hargaTaksiran
    };
  }, [hargaBaru, batteryHealth, umurBulan]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6 flex flex-col gap-6">
        
        <div className="space-y-4">
          <h4 className="font-semibold text-primary text-sm border-b pb-2">Kondisi iPhone Bekas (Second)</h4>
          
          <div>
            <label className="block text-xs font-medium text-secondary mb-2">Harga Beli Baru / MSRP Saat Ini (Rp)</label>
            <Input type="number" value={hargaBaru || ""} onChange={(e) => setHargaBaru(Number(e.target.value))} />
            <p className="text-[10px] text-secondary mt-1">Gunakan patokan harga baru iBox saat ini.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Battery Health (%)</label>
              <Input type="number" value={batteryHealth || ""} onChange={(e) => setBatteryHealth(Number(e.target.value))} max={100} min={1} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Umur Pemakaian (Bulan)</label>
              <Input type="number" value={umurBulan || ""} onChange={(e) => setUmurBulan(Number(e.target.value))} />
            </div>
          </div>
        </div>

      </Card>
      
      <Card className="p-6 flex flex-col gap-6 bg-surface/50 border-accent/20">
        <h3 className="text-lg font-semibold text-primary">Taksiran Harga Jual (OLX / Marketplace)</h3>
        
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Depresiasi Umur ({umurBulan} Bulan)</span>
            <span className="text-danger font-medium">- {result.depresiasiUmurPersen}%</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Penalti Battery Health ({batteryHealth}%)</span>
            <span className="text-danger font-medium">- Rp {Math.ceil(result.nilaiPenaltiBh).toLocaleString("id-ID")}</span>
          </div>
          
          {batteryHealth < 80 && (
            <div className="p-2 bg-danger/10 text-danger text-xs rounded border border-danger/20">
              ⚠️ Status "Service". Pembeli biasanya menawar jatuh untuk biaya ganti baterai original.
            </div>
          )}
        </div>
        
        <OutputBox 
          label="Taksiran Harga Jual Wajar" 
          value={Math.ceil(result.hargaTaksiran)} 
          prefix="Rp "
        />
        
        <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg text-primary text-sm">
          <strong>Tip Nego:</strong> Ini adalah harga <em>Fullset</em> (Box, Kabel Original, Ex-iBox/Resmi). Jika unit adalah garansi Internasional (IMEI rawan blokir) atau batangan, kurangi lagi 15-20% dari harga di atas.
        </div>
      </Card>
    </div>
  );
}
