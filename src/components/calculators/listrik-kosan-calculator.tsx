"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OutputBox } from "@/components/ui/output-box";
import { parseAsInteger, useQueryState } from "nuqs";

export function ListrikKosanCalculator() {
  const [totalTagihan, setTotalTagihan] = useQueryState("tagihan", parseAsInteger.withDefault(500000));
  const [penghuniA, setPenghuniA] = useQueryState("a", parseAsInteger.withDefault(1));
  const [penghuniB, setPenghuniB] = useQueryState("b", parseAsInteger.withDefault(1));
  
  // Beban Daya Watt Ekstra
  const [wattEkstraA, setWattEkstraA] = useQueryState("wa", parseAsInteger.withDefault(400)); // Misal A bawa Kulkas kecil + Dispenser
  const [wattEkstraB, setWattEkstraB] = useQueryState("wb", parseAsInteger.withDefault(0));

  const result = useMemo(() => {
    // 1. Asumsi pemakaian dasar / org sama (Misal lampu, charge HP, laptop = 100 Watt dasar)
    const baseWatt = 100;
    
    // Total bobot A = (Jumlah orang A * baseWatt) + wattEkstraA
    const bobotA = (penghuniA * baseWatt) + wattEkstraA;
    const bobotB = (penghuniB * baseWatt) + wattEkstraB;
    
    const totalBobot = bobotA + bobotB;
    
    let tagihanA = 0;
    let tagihanB = 0;

    if (totalBobot > 0) {
      tagihanA = (bobotA / totalBobot) * totalTagihan;
      tagihanB = (bobotB / totalBobot) * totalTagihan;
    }

    return {
      bobotA,
      bobotB,
      totalBobot,
      tagihanA,
      tagihanB
    };
  }, [totalTagihan, penghuniA, penghuniB, wattEkstraA, wattEkstraB]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6 flex flex-col gap-6">
        
        <div className="space-y-4 border-b border-border pb-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Total Beli Token / Tagihan PLN Bulan Ini (Rp)</label>
            <Input type="number" value={totalTagihan || ""} onChange={(e) => setTotalTagihan(Number(e.target.value))} />
          </div>
        </div>

        <div className="space-y-4 border-b border-border pb-4">
          <h4 className="font-semibold text-primary text-sm">Kamar A / Pihak Pertama</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Jumlah Orang</label>
              <Input type="number" value={penghuniA || ""} onChange={(e) => setPenghuniA(Number(e.target.value))} min={1} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Elektronik Berat (Estimasi Watt)</label>
              <Input type="number" value={wattEkstraA || ""} onChange={(e) => setWattEkstraA(Number(e.target.value))} />
              <p className="text-[10px] text-secondary mt-1">Cth: Kulkas 100W, AC 1/2PK 400W</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-primary text-sm">Kamar B / Pihak Kedua</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Jumlah Orang</label>
              <Input type="number" value={penghuniB || ""} onChange={(e) => setPenghuniB(Number(e.target.value))} min={1} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Elektronik Berat (Estimasi Watt)</label>
              <Input type="number" value={wattEkstraB || ""} onChange={(e) => setWattEkstraB(Number(e.target.value))} />
              <p className="text-[10px] text-secondary mt-1">Biarkan 0 jika hanya standar (HP, Lampu).</p>
            </div>
          </div>
        </div>

      </Card>
      
      <Card className="p-6 flex flex-col gap-6 bg-surface/50 border-accent/20">
        <h3 className="text-lg font-semibold text-primary">Hasil Split Bill Listrik Adil</h3>
        
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Tagihan Kamar A (Proporsi {Math.round((result.bobotA/result.totalBobot)*100)}%)</span>
            <span className="text-accent font-medium">Rp {Math.ceil(result.tagihanA).toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Tagihan Kamar B (Proporsi {Math.round((result.bobotB/result.totalBobot)*100)}%)</span>
            <span className="text-primary font-medium">Rp {Math.ceil(result.tagihanB).toLocaleString("id-ID")}</span>
          </div>
        </div>
        
        <OutputBox 
          label="Cek Silang (Total Tagihan)" 
          value={Math.ceil(result.tagihanA + result.tagihanB)} 
          prefix="Rp "
        />
        
        <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg text-primary text-sm">
          <strong>Insight Algoritma:</strong> Daripada dibagi dua rata, kalkulator ini membagi tagihan berbasis <em>Bobot Daya</em>. Seseorang yang membawa AC & Dispenser akan membayar proporsi lebih besar dari mereka yang hanya memakai lampu.
        </div>
      </Card>
    </div>
  );
}
