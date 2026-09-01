"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import { parseAsFloat, parseAsInteger, useQueryState } from "nuqs";

export function KubikasiKayuCalculator() {
  const [tebal, setTebal] = useQueryState("tebal", parseAsFloat.withDefault(5)); // cm
  const [lebar, setLebar] = useQueryState("lebar", parseAsFloat.withDefault(10)); // cm
  const [panjang, setPanjang] = useQueryState("panjang", parseAsFloat.withDefault(400)); // cm (4 meter)
  const [hargaKubik, setHargaKubik] = useQueryState("harga", parseAsInteger.withDefault(2500000));
  
  const result = useMemo(() => {
    // Volume 1 batang kayu dalam cm^3
    const volumeCm3 = tebal * lebar * panjang;
    
    // Konversi volume 1 batang ke m^3 (1 m^3 = 1,000,000 cm^3)
    const volumeM3 = volumeCm3 / 1000000;
    
    // Berapa batang kayu dalam 1 meter kubik?
    const batangPerKubik = volumeM3 > 0 ? 1 / volumeM3 : 0;
    
    // Harga per batang
    const hargaPerBatang = volumeM3 > 0 ? hargaKubik / batangPerKubik : 0;

    return {
      volumeM3: volumeM3.toFixed(4),
      batangPerKubik: Math.floor(batangPerKubik), // Dibulatkan ke bawah
      hargaPerBatang
    };
  }, [tebal, lebar, panjang, hargaKubik]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6 flex flex-col gap-6">
        
        <div className="space-y-4">
          <h4 className="font-semibold text-primary text-sm border-b pb-2">Dimensi Fisik Kayu</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Tebal (cm)</label>
              <Input type="number" value={tebal || ""} onChange={(e) => setTebal(Number(e.target.value))} />
              <p className="text-[10px] text-secondary mt-1">Cth: Usuk 5 cm</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Lebar (cm)</label>
              <Input type="number" value={lebar || ""} onChange={(e) => setLebar(Number(e.target.value))} />
              <p className="text-[10px] text-secondary mt-1">Cth: Usuk 10 cm</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Panjang (cm)</label>
              <Input type="number" value={panjang || ""} onChange={(e) => setPanjang(Number(e.target.value))} />
              <p className="text-[10px] text-secondary mt-1">Cth: 400 (4m)</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Harga Kayu 1 Kubik (m³) - Rp</label>
            <Input type="number" value={hargaKubik || ""} onChange={(e) => setHargaKubik(Number(e.target.value))} />
          </div>
        </div>

      </Card>
      
      <Card className="p-6 flex flex-col gap-6 bg-surface/50 border-accent/20">
        <h3 className="text-lg font-semibold text-primary">Hasil Hitungan Kubikasi</h3>
        
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Volume 1 Batang</span>
            <span className="text-primary font-medium">{result.volumeM3} m³</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border bg-accent/10 p-2 rounded">
            <span className="text-primary font-semibold text-sm">Jumlah Batang dalam 1 Kubik</span>
            <span className="font-bold text-primary">
              {result.batangPerKubik} Batang
            </span>
          </div>
        </div>
        
        <OutputBox 
          label="Harga Eceran 1 Batang Kayu" 
          value={Math.ceil(result.hargaPerBatang)} 
          prefix="Rp "
        />
        
        <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg text-primary text-sm">
          <strong>Insight Bahan Bangunan:</strong> Di pasaran (panglong/toko material), kayu dijual dengan satuan kubik. Kalkulator ini membantu Anda menghitung presisi apakah butuh beli 1 kubik atau eceran per batang.
        </div>
      </Card>
    </div>
  );
}
