"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import { parseAsFloat, useQueryState } from "nuqs";

export function PlafonRumahCalculator() {
  const [panjangRuangan, setPanjangRuangan] = useQueryState("p", parseAsFloat.withDefault(4)); // meter
  const [lebarRuangan, setLebarRuangan] = useQueryState("l", parseAsFloat.withDefault(4)); // meter
  
  const [jenisPlafon, setJenisPlafon] = useQueryState("jenis", { defaultValue: "gypsum" }); // gypsum, pvc, grc

  const result = useMemo(() => {
    const luasRuangan = panjangRuangan * lebarRuangan;
    
    let kebutuhanLembar = 0;
    let deskripsiUkuran = "";
    
    // Dimensi material standar
    if (jenisPlafon === "gypsum" || jenisPlafon === "grc") {
      // Gypsum / GRC standar: 1.2m x 2.4m = 2.88 m2 per lembar
      const luasPerLembar = 1.2 * 2.4;
      kebutuhanLembar = Math.ceil(luasRuangan / luasPerLembar);
      deskripsiUkuran = "1.2m x 2.4m (Standar)";
    } else if (jenisPlafon === "pvc") {
      // PVC standar lebar 20cm (0.2m), panjang 4m = 0.8 m2 per lembar
      const luasPerLembar = 0.2 * 4;
      kebutuhanLembar = Math.ceil(luasRuangan / luasPerLembar);
      deskripsiUkuran = "20cm x 4m (PVC Standar)";
    }

    // Estimasi Rangka Hollow (meter lari). Kasar: Luas x 3.5 meter lari / luas ruangan
    // atau jumlah batang (standar 4 meter). 
    // Estimasi kasar: 1 m2 luas plafon butuh ~1 batang hollow (4m) untuk rangka utama & anak
    const kebutuhanHollow = Math.ceil(luasRuangan * 1.1); 

    // Estimasi List Profil plafon (Keliling ruangan)
    const kelilingRuangan = 2 * (panjangRuangan + lebarRuangan);
    const batangList = Math.ceil(kelilingRuangan / 4); // asumsikan list plafon dijual per 4 meter

    return {
      luasRuangan,
      kebutuhanLembar,
      deskripsiUkuran,
      kebutuhanHollow,
      kelilingRuangan,
      batangList
    };
  }, [panjangRuangan, lebarRuangan, jenisPlafon]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6 flex flex-col gap-6">
        
        <div className="space-y-4">
          <h4 className="font-semibold text-primary text-sm border-b pb-2">Ukuran Ruangan (Meter)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Panjang Ruangan (m)</label>
              <Input type="number" value={panjangRuangan || ""} onChange={(e) => setPanjangRuangan(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Lebar Ruangan (m)</label>
              <Input type="number" value={lebarRuangan || ""} onChange={(e) => setLebarRuangan(Number(e.target.value))} />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Jenis Material Plafon</label>
            <Select value={jenisPlafon} onChange={(e) => setJenisPlafon(e.target.value)} className="w-full">
              <option value="gypsum">Gypsum / Papan Gipsum</option>
              <option value="grc">GRC Board / Kalsiboard</option>
              <option value="pvc">Plafon PVC (Panjang 4m)</option>
            </Select>
            <p className="text-xs text-secondary mt-1">Ukuran Material: {result.deskripsiUkuran}</p>
          </div>
        </div>

      </Card>
      
      <Card className="p-6 flex flex-col gap-6 bg-surface/50 border-accent/20">
        <h3 className="text-lg font-semibold text-primary">RAB Material Plafon</h3>
        
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Luas Plafon / Ruangan</span>
            <span className="text-primary font-medium">{result.luasRuangan} m²</span>
          </div>
          
          <div className="pt-2">
            <h4 className="text-sm font-semibold text-primary mb-2">Kebutuhan Material Utama:</h4>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Lembaran {jenisPlafon.toUpperCase()}</span>
            <span className="text-accent font-bold text-lg">{result.kebutuhanLembar} Lembar</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Rangka Besi Hollow (P 4m)</span>
            <span className="text-primary font-medium">~ {result.kebutuhanHollow} Batang</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">List Profil Pinggir (P 4m)</span>
            <span className="text-primary font-medium">{result.batangList} Batang</span>
          </div>
        </div>
        
        <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg text-primary text-sm">
          <strong>Perhatian:</strong> Kalkulasi ini adalah estimasi material bersih (netto) + faktor buangan (waste) standar 5-10%. Selalu siapkan kelebihan 1-2 lembar untuk mengantisipasi kesalahan potong oleh tukang.
        </div>
      </Card>
    </div>
  );
}
