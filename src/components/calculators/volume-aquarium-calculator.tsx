"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import { parseAsFloat, useQueryState } from "nuqs";

export function VolumeAquariumCalculator() {
  const [panjang, setPanjang] = useQueryState("p", parseAsFloat.withDefault(60)); // cm
  const [lebar, setLebar] = useQueryState("l", parseAsFloat.withDefault(30)); // cm
  const [tinggi, setTinggi] = useQueryState("t", parseAsFloat.withDefault(35)); // cm
  
  const [jenisIkan, setJenisIkan] = useQueryState("ikan", { defaultValue: "kecil" }); 

  const result = useMemo(() => {
    // 1. Volume Air (Liter)
    // 1000 cm3 = 1 Liter
    const volumeLiter = (panjang * lebar * tinggi) / 1000;
    
    // 2. Berat Air (Asumsi 1 Liter Air Tawar = ~1 Kg)
    // Plus estimasi berat kaca (kasar: +15%)
    const beratTotal = volumeLiter * 1.15;
    
    // 3. Populasi Ikan Ideal (Rule of Thumb: 1 Liter air per 1 cm panjang ikan dewasa)
    // Kecil (Tetra/Guppy): ~3 cm dewasa -> Butuh 3L/ikan
    // Sedang (Koki/Cichlid): ~10 cm dewasa -> Butuh 10L/ikan
    // Besar (Koi/Arwana): ~30+ cm dewasa -> Butuh 30-50L/ikan
    
    let maksIkan = 0;
    if (jenisIkan === "kecil") maksIkan = Math.floor(volumeLiter / 3);
    if (jenisIkan === "sedang") maksIkan = Math.floor(volumeLiter / 10);
    if (jenisIkan === "besar") maksIkan = Math.floor(volumeLiter / 40);

    return {
      volumeLiter: volumeLiter.toFixed(1),
      beratTotal: beratTotal.toFixed(1),
      maksIkan
    };
  }, [panjang, lebar, tinggi, jenisIkan]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6 flex flex-col gap-6">
        
        <div className="space-y-4">
          <h4 className="font-semibold text-primary text-sm border-b pb-2">Dimensi Kaca Aquarium (cm)</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Panjang (cm)</label>
              <Input type="number" value={panjang || ""} onChange={(e) => setPanjang(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Lebar/Mundur (cm)</label>
              <Input type="number" value={lebar || ""} onChange={(e) => setLebar(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Tinggi (cm)</label>
              <Input type="number" value={tinggi || ""} onChange={(e) => setTinggi(Number(e.target.value))} />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Jenis Ikan Hias</label>
            <Select value={jenisIkan} onChange={(e) => setJenisIkan(e.target.value)} className="w-full">
              <option value="kecil">Kecil (Tetra, Guppy, Molly) - max 3cm</option>
              <option value="sedang">Sedang (Mas Koki, Louhan, Cichlid) - max 10cm</option>
              <option value="besar">Besar (Arwana, Koi, Predator) - max 40cm</option>
            </Select>
            <p className="text-xs text-secondary mt-1">Populasi aman dihitung berdasarkan batas filtrasi amonia (1 Liter air per 1 cm ikan).</p>
          </div>
        </div>

      </Card>
      
      <Card className="p-6 flex flex-col gap-6 bg-surface/50 border-accent/20">
        <h3 className="text-lg font-semibold text-primary">Hasil Analisis Aquarium</h3>
        
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Volume Air Penuh</span>
            <span className="text-primary font-medium">{result.volumeLiter} Liter</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Estimasi Beban/Berat (Air + Kaca)</span>
            <span className="text-danger font-medium">~ {result.beratTotal} Kg</span>
          </div>
          
          <div className="p-2 bg-amber-500/10 text-amber-600 text-xs rounded border border-amber-500/20 mt-2">
            ⚠️ Pastikan meja rak/kabinet Anda sanggup menahan beban <strong>{result.beratTotal} Kg</strong> secara terus-menerus.
          </div>
        </div>
        
        <OutputBox 
          label="Batas Aman Populasi Ikan (Maks)" 
          value={result.maksIkan} 
          suffix=" Ekor"
        />
      </Card>
    </div>
  );
}
