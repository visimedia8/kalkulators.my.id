"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OutputBox } from "@/components/ui/output-box";
import { parseAsInteger, useQueryState } from "nuqs";

export function MarginThriftingCalculator() {
  const [hargaBeli, setHargaBeli] = useQueryState("beli", parseAsInteger.withDefault(35000));
  const [ongkosKirim, setOngkosKirim] = useQueryState("ongkir", parseAsInteger.withDefault(10000));
  
  const [biayaLaundry, setBiayaLaundry] = useQueryState("laundry", parseAsInteger.withDefault(5000));
  const [biayaReparasi, setBiayaReparasi] = useQueryState("repair", parseAsInteger.withDefault(0));
  const [biayaPacking, setBiayaPacking] = useQueryState("packing", parseAsInteger.withDefault(2000));

  const [targetMarginPersen, setTargetMarginPersen] = useQueryState("margin", parseAsInteger.withDefault(100)); // Target 100% margin (2x lipat modal)

  const result = useMemo(() => {
    // Total HPP (Harga Pokok Penjualan) alias Modal Bersih
    const modalBersih = hargaBeli + ongkosKirim + biayaLaundry + biayaReparasi + biayaPacking;
    
    // Target Profit (Keuntungan)
    const targetProfit = modalBersih * (targetMarginPersen / 100);
    
    // Harga Jual (Markup)
    const hargaJual = modalBersih + targetProfit;

    return {
      modalBersih,
      targetProfit,
      hargaJual
    };
  }, [hargaBeli, ongkosKirim, biayaLaundry, biayaReparasi, biayaPacking, targetMarginPersen]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6 flex flex-col gap-6">
        
        <div className="space-y-4 border-b border-border pb-4">
          <h4 className="font-semibold text-primary text-sm">Modal Akuisisi Barang</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Harga Beli (Bal/Satuan)</label>
              <Input type="number" value={hargaBeli || ""} onChange={(e) => setHargaBeli(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Ongkos Kirim/Bensin</label>
              <Input type="number" value={ongkosKirim || ""} onChange={(e) => setOngkosKirim(Number(e.target.value))} />
            </div>
          </div>
        </div>

        <div className="space-y-4 border-b border-border pb-4">
          <h4 className="font-semibold text-primary text-sm">Biaya Treatment & Operasional</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Cuci/Laundry</label>
              <Input type="number" value={biayaLaundry || ""} onChange={(e) => setBiayaLaundry(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Reparasi/Jahit</label>
              <Input type="number" value={biayaReparasi || ""} onChange={(e) => setBiayaReparasi(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Packing Plastik</label>
              <Input type="number" value={biayaPacking || ""} onChange={(e) => setBiayaPacking(Number(e.target.value))} />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Target Margin Keuntungan Bersih (%)</label>
            <Input type="number" value={targetMarginPersen || ""} onChange={(e) => setTargetMarginPersen(Number(e.target.value))} />
            <p className="text-[10px] text-secondary mt-1">Standar industri thrifting: minimal 100% - 300% (markup tinggi karena resiko deadstock).</p>
          </div>
        </div>

      </Card>
      
      <Card className="p-6 flex flex-col gap-6 bg-surface/50 border-accent/20">
        <h3 className="text-lg font-semibold text-primary">Kalkulasi HPP & Harga Jual</h3>
        
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Total Modal Bersih (HPP)</span>
            <span className="text-danger font-medium">Rp {Math.ceil(result.modalBersih).toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Target Profit ({targetMarginPersen}%)</span>
            <span className="text-accent font-medium">+ Rp {Math.ceil(result.targetProfit).toLocaleString("id-ID")}</span>
          </div>
        </div>
        
        <OutputBox 
          label="Rekomendasi Harga Jual (Mendekati)" 
          value={Math.ceil(result.hargaJual / 5000) * 5000} 
          prefix="Rp "
        />
        
        <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg text-primary text-sm">
          <strong>Kenapa dibulatkan?</strong> Algoritma membulatkan ke kelipatan Rp 5.000 terdekat agar harga terlihat wajar di mata pembeli (psikologis harga).
        </div>
      </Card>
    </div>
  );
}
