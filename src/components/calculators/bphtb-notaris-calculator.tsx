"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OutputBox } from "@/components/ui/output-box";
import { parseAsInteger, useQueryState } from "nuqs";

export function BphtbNotarisCalculator() {
  const [njop, setNjop] = useQueryState("njop", parseAsInteger.withDefault(500000000));
  const [hargaTrans, setHargaTrans] = useQueryState("transaksi", parseAsInteger.withDefault(600000000));
  const [npoptkp, setNpoptkp] = useQueryState("npoptkp", parseAsInteger.withDefault(80000000)); // NPOPTKP DKI Jakarta 80jt
  
  const [persenNotaris, setPersenNotaris] = useQueryState("notaris", parseAsInteger.withDefault(1)); // 1% dari nilai
  const [biayaCek, setBiayaCek] = useQueryState("cek", parseAsInteger.withDefault(1500000)); // Cek sertifikat, PNBP, dll

  const result = useMemo(() => {
    // Dasar pengenaan pajak adalah nilai tertinggi antara Harga Transaksi atau NJOP
    const nilaiPajak = Math.max(njop, hargaTrans);
    
    // BPHTB Pembeli = 5% x (Nilai Pajak - NPOPTKP)
    const dasarBphtb = nilaiPajak - npoptkp;
    const bphtb = dasarBphtb > 0 ? dasarBphtb * 0.05 : 0;
    
    // PPh Final Penjual = 2.5% x Harga Transaksi
    const pphFinal = hargaTrans * 0.025;
    
    // Biaya Notaris/PPAT (biasanya ditanggung pembeli atau bagi dua, di sini beban pembeli)
    const feeNotaris = nilaiPajak * (persenNotaris / 100);
    
    const totalPembeli = hargaTrans + bphtb + feeNotaris + biayaCek;

    return {
      nilaiPajak,
      bphtb,
      pphFinal,
      feeNotaris,
      biayaCek,
      totalPembeli
    };
  }, [njop, hargaTrans, npoptkp, persenNotaris, biayaCek]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6 flex flex-col gap-6">
        
        <div className="space-y-4">
          <h4 className="font-semibold text-primary text-sm border-b pb-2">Nilai Transaksi & Pajak</h4>
          <div>
            <label className="block text-xs font-medium text-secondary mb-2">Harga Kesepakatan Jual-Beli (Rp)</label>
            <Input type="number" value={hargaTrans || ""} onChange={(e) => setHargaTrans(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-secondary mb-2">Nilai Jual Objek Pajak (NJOP PBB) - Rp</label>
            <Input type="number" value={njop || ""} onChange={(e) => setNjop(Number(e.target.value))} />
            <p className="text-xs text-secondary mt-1">Pajak dihitung berdasarkan angka tertinggi antara NJOP vs Harga Jual.</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-secondary mb-2">NPOPTKP (Pengurang Pajak per Daerah) - Rp</label>
            <Input type="number" value={npoptkp || ""} onChange={(e) => setNpoptkp(Number(e.target.value))} />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-primary text-sm border-b pb-2">Jasa Notaris/PPAT & Lainnya</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Fee PPAT / AJB (%)</label>
              <Input type="number" value={persenNotaris || ""} onChange={(e) => setPersenNotaris(Number(e.target.value))} max={5} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Cek Sertifikat & PNBP (Rp)</label>
              <Input type="number" value={biayaCek || ""} onChange={(e) => setBiayaCek(Number(e.target.value))} />
            </div>
          </div>
        </div>

      </Card>
      
      <Card className="p-6 flex flex-col gap-6 bg-surface/50 border-accent/20">
        <h3 className="text-lg font-semibold text-primary">Simulasi Biaya & Kewajiban</h3>
        
        <div className="space-y-4 flex-1">
          <div className="pt-2">
            <h4 className="text-sm font-semibold text-danger mb-2">Kewajiban Pembeli (BPHTB & Legalitas):</h4>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Pajak Pembeli (BPHTB 5%)</span>
            <span className="text-primary font-medium">Rp {result.bphtb.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Honor Notaris/PPAT ({persenNotaris}%)</span>
            <span className="text-primary font-medium">Rp {result.feeNotaris.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Cek Sertifikat & Balik Nama</span>
            <span className="text-primary font-medium">Rp {result.biayaCek.toLocaleString("id-ID")}</span>
          </div>
          
          <div className="pt-4 mt-4">
            <h4 className="text-sm font-semibold text-amber-500 mb-2">Kewajiban Penjual (Sering Terlupa):</h4>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Pajak Penghasilan (PPh Final 2.5%)</span>
            <span className="font-bold text-amber-500">Rp {result.pphFinal.toLocaleString("id-ID")}</span>
          </div>
        </div>
        
        <OutputBox 
          label="Total Dana yang Harus Disiapkan Pembeli" 
          value={result.totalPembeli} 
          prefix="Rp "
        />
        
        <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg text-primary text-sm">
          <strong>Perhatian:</strong> Nilai PPh Penjual wajib dibayarkan sebelum Notaris membuat AJB. Jika penjual menolak membayar, biasanya akan dibebankan ke pembeli atau mengurangi harga transaksi neto penjual.
        </div>
      </Card>
    </div>
  );
}
