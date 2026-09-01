"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OutputBox } from "@/components/ui/output-box";
import { parseAsInteger, useQueryState } from "nuqs";

export function PsuPcCalculator() {
  const [cpuTdp, setCpuTdp] = useQueryState("cpu", parseAsInteger.withDefault(65)); // Ryzen 5 / i5 standard
  const [gpuTdp, setGpuTdp] = useQueryState("gpu", parseAsInteger.withDefault(200)); // RTX 4060 Ti / 3060
  
  const [jumlahRam, setJumlahRam] = useQueryState("ram", parseAsInteger.withDefault(2)); // Keping
  const [jumlahStorage, setJumlahStorage] = useQueryState("storage", parseAsInteger.withDefault(2)); // SSD/HDD
  const [jumlahKipas, setJumlahKipas] = useQueryState("fan", parseAsInteger.withDefault(4)); // Kipas casing

  const result = useMemo(() => {
    // Estimasi pemakaian per komponen (Watt)
    const ramWatt = jumlahRam * 4; // 4W per keping
    const storageWatt = jumlahStorage * 7; // 7W rata-rata SSD/HDD
    const fanWatt = jumlahKipas * 3; // 3W per kipas RGB
    const moboWatt = 40; // Motherboard baseline
    
    const totalTdp = cpuTdp + gpuTdp + ramWatt + storageWatt + fanWatt + moboWatt;
    
    // Headroom aman (Margin of Safety) = 50% ekstra dari peak load
    const rekomendasiPsu = totalTdp * 1.5;

    // Kategori Sertifikasi 80+ yang direkomendasikan berdasarkan Watt
    let sertifikasi = "80+ Standard / Bronze";
    if (rekomendasiPsu > 750) sertifikasi = "80+ Gold";
    if (rekomendasiPsu > 1000) sertifikasi = "80+ Platinum";

    return {
      totalTdp,
      rekomendasiPsu,
      sertifikasi
    };
  }, [cpuTdp, gpuTdp, jumlahRam, jumlahStorage, jumlahKipas]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6 flex flex-col gap-6">
        
        <div className="space-y-4 border-b border-border pb-4">
          <h4 className="font-semibold text-primary text-sm">Komponen Utama (Peak TDP)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">TDP Processor/CPU (Watt)</label>
              <Input type="number" value={cpuTdp || ""} onChange={(e) => setCpuTdp(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">TDP Kartu Grafis/GPU (Watt)</label>
              <Input type="number" value={gpuTdp || ""} onChange={(e) => setGpuTdp(Number(e.target.value))} />
            </div>
          </div>
          <p className="text-[10px] text-secondary">Cek spesifikasi TDP (Thermal Design Power) CPU dan VGA Anda di kotak kemasan.</p>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-primary text-sm">Periferal Tambahan</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Keping RAM</label>
              <Input type="number" value={jumlahRam || ""} onChange={(e) => setJumlahRam(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Jumlah SSD/HDD</label>
              <Input type="number" value={jumlahStorage || ""} onChange={(e) => setJumlahStorage(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Kipas Casing</label>
              <Input type="number" value={jumlahKipas || ""} onChange={(e) => setJumlahKipas(Number(e.target.value))} />
            </div>
          </div>
        </div>

      </Card>
      
      <Card className="p-6 flex flex-col gap-6 bg-surface/50 border-accent/20">
        <h3 className="text-lg font-semibold text-primary">Kebutuhan Daya (PSU)</h3>
        
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Estimasi Beban Puncak (Load)</span>
            <span className="text-danger font-medium">{result.totalTdp} Watt</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Sertifikasi Disarankan</span>
            <span className="text-primary font-medium">{result.sertifikasi}</span>
          </div>
        </div>
        
        <OutputBox 
          label="Kapasitas PSU Minimal Disarankan" 
          value={Math.ceil(result.rekomendasiPsu / 50) * 50} 
          suffix=" Watt"
        />
        
        <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg text-primary text-sm">
          <strong>Kenapa lebih besar?</strong> PSU bekerja paling efisien dan awet (tidak panas) saat beban berada di kisaran 50%-60% dari kapasitas maksimalnya. Hindari membeli PSU yang pas-pasan dengan angka Load.
        </div>
      </Card>
    </div>
  );
}
