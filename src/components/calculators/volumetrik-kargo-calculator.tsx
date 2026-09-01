"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import { parseAsInteger, useQueryState } from "nuqs";

export function VolumetrikKargoCalculator() {
  const [panjang, setPanjang] = useQueryState("panjang", parseAsInteger.withDefault(50));
  const [lebar, setLebar] = useQueryState("lebar", parseAsInteger.withDefault(40));
  const [tinggi, setTinggi] = useQueryState("tinggi", parseAsInteger.withDefault(30));
  const [beratAktual, setBeratAktual] = useQueryState("beratAktual", parseAsInteger.withDefault(5));
  const [layanan, setLayanan] = useQueryState("layanan", { defaultValue: "darat" }); // darat = 4000, udara = 6000

  const result = useMemo(() => {
    const pembagi = layanan === "darat" ? 4000 : 6000;
    
    const volumetrik = (panjang * lebar * tinggi) / pembagi;
    
    // Kurir menagih berdasarkan berat yang paling besar antara aktual vs volumetrik
    const beratDitagih = Math.max(beratAktual, volumetrik);
    
    return {
      volumetrik: volumetrik.toFixed(2),
      pembagi,
      beratDitagih: Math.ceil(beratDitagih),
      alasan: volumetrik > beratAktual ? "Volume kardus memakan tempat lebih banyak dari berat aslinya." : "Berat barang lebih mendominasi daripada dimensi kardus."
    };
  }, [panjang, lebar, tinggi, beratAktual, layanan]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6 flex flex-col gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Jalur Pengiriman Kargo</label>
            <Select value={layanan} onChange={(e) => setLayanan(e.target.value)} className="w-full">
              <option value="darat">Kargo Darat / Laut (Pembagi 4000)</option>
              <option value="udara">Kargo Udara / Reguler (Pembagi 6000)</option>
            </Select>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Panjang (cm)</label>
              <Input type="number" value={panjang || ""} onChange={(e) => setPanjang(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Lebar (cm)</label>
              <Input type="number" value={lebar || ""} onChange={(e) => setLebar(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Tinggi (cm)</label>
              <Input type="number" value={tinggi || ""} onChange={(e) => setTinggi(Number(e.target.value))} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Berat Timbangan Aktual (KG)</label>
            <Input type="number" value={beratAktual || ""} onChange={(e) => setBeratAktual(Number(e.target.value))} />
          </div>
        </div>
      </Card>
      
      <Card className="p-6 flex flex-col gap-6 bg-surface/50 border-accent/20">
        <h3 className="text-lg font-semibold text-primary">Hasil Perhitungan Ekspedisi</h3>
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Berat Timbangan Asli</span>
            <span className="text-primary font-medium">{beratAktual} KG</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Berat Volumetrik / Dimensi</span>
            <span className="text-primary font-medium">{result.volumetrik} KG</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Ketentuan Hitung</span>
            <span className="text-secondary text-xs italic text-right max-w-[200px]">Diambil angka paling besar untuk tagihan kurir</span>
          </div>
        </div>
        
        <OutputBox 
          label="Berat Kargo yang Ditagihkan" 
          value={result.beratDitagih} 
          suffix=" KG"
        />
        
        <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg text-primary text-sm">
          <strong>Analisis: </strong> {result.alasan}
        </div>
      </Card>
    </div>
  );
}
