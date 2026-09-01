"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import { parseAsInteger, useQueryState } from "nuqs";

export function ValuasiBisnisCalculator() {
  const [asetFisik, setAsetFisik] = useQueryState("aset", parseAsInteger.withDefault(100000000));
  const [profitBulanan, setProfitBulanan] = useQueryState("profit", parseAsInteger.withDefault(15000000));
  
  // Multiple (Pengali valuasi), biasanya bisnis UMKM F&B dihargai 1x - 3x profit tahunan
  const [pengaliTahun, setPengaliTahun] = useQueryState("pengali", parseAsInteger.withDefault(2)); 
  const [hutang, setHutang] = useQueryState("hutang", parseAsInteger.withDefault(20000000));

  const result = useMemo(() => {
    const profitTahunan = profitBulanan * 12;
    
    // Nilai Goodwill (Kekuatan Merek & Basis Pelanggan yang menghasilkan profit)
    const nilaiGoodwill = profitTahunan * pengaliTahun;
    
    // Enterprise Value (Nilai Total Bisnis) = Aset Fisik + Goodwill
    const enterpriseValue = asetFisik + nilaiGoodwill;
    
    // Equity Value (Harga Takeover Bersih) = Enterprise Value - Hutang yang Diwariskan
    const equityValue = enterpriseValue - hutang;

    return {
      profitTahunan,
      nilaiGoodwill,
      enterpriseValue,
      equityValue
    };
  }, [asetFisik, profitBulanan, pengaliTahun, hutang]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6 flex flex-col gap-6">
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Total Aset Fisik (Alat, Stok, Fit-out) - Rp</label>
            <Input type="number" value={asetFisik || ""} onChange={(e) => setAsetFisik(Number(e.target.value))} />
            <p className="text-xs text-secondary mt-1">Nilai likuidasi jika semua barang bekas toko dijual saat ini.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Rata-rata Laba Bersih Bulanan (Rp)</label>
            <Input type="number" value={profitBulanan || ""} onChange={(e) => setProfitBulanan(Number(e.target.value))} />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Tingkat Risiko (Pengali Profit Tahunan)</label>
            <Select value={pengaliTahun.toString()} onChange={(e) => setPengaliTahun(Number(e.target.value))} className="w-full">
              <option value="1">1x (Risiko Tinggi / UMKM Baru / Sewa Ruko Habis)</option>
              <option value="2">2x (Risiko Menengah / Stabil & Punya Pelanggan)</option>
              <option value="3">3x (Risiko Rendah / Franchise Terkenal / Autopilot)</option>
              <option value="5">5x (Bisnis Skala Menengah / Korporat)</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Hutang/Kewajiban Toko (Opsional) - Rp</label>
            <Input type="number" value={hutang || ""} onChange={(e) => setHutang(Number(e.target.value))} />
            <p className="text-xs text-secondary mt-1">Hutang ke supplier atau sisa sewa yang akan ditanggung pembeli baru.</p>
          </div>
        </div>

      </Card>
      
      <Card className="p-6 flex flex-col gap-6 bg-surface/50 border-accent/20">
        <h3 className="text-lg font-semibold text-primary">Analisis Harga Jual (Takeover) Bisnis</h3>
        
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Nilai Aset Fisik (Tangible)</span>
            <span className="text-primary font-medium">Rp {asetFisik.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Nilai Goodwill & Merek (Intangible)</span>
            <span className="text-primary font-medium">+ Rp {result.nilaiGoodwill.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Total Nilai Perusahaan (Enterprise Value)</span>
            <span className="text-accent font-medium">Rp {result.enterpriseValue.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Kewajiban/Hutang Diwariskan</span>
            <span className="text-danger font-medium">- Rp {hutang.toLocaleString("id-ID")}</span>
          </div>
        </div>
        
        <OutputBox 
          label="Harga Penawaran Wajar (Equity Value)" 
          value={result.equityValue > 0 ? result.equityValue : 0} 
          prefix="Rp "
        />
        
        <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg text-primary text-sm">
          <strong>Insight B2B:</strong> Valuasi ini menggunakan metode <em>EBITDA Multiple</em> sederhana. Pembeli tidak hanya membayar mesin/kulkas bekas Anda, tetapi membayar "Mesin Pencetak Uang" yang sudah terbukti menghasilkan laba Rp {result.profitTahunan.toLocaleString()} per tahun.
        </div>
      </Card>
    </div>
  );
}
