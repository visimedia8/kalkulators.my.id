"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OutputBox } from "@/components/ui/output-box";
import { parseAsInteger, useQueryState } from "nuqs";

export function KapasitasAkiCalculator() {
  const [akiAh, setAkiAh] = useQueryState("ah", parseAsInteger.withDefault(40)); // Ampere Hour (Standar mobil kecil)
  const [voltase, setVoltase] = useQueryState("v", parseAsInteger.withDefault(12)); // Volt (Umumnya mobil 12V)
  
  const [audioWatt, setAudioWatt] = useQueryState("audio", parseAsInteger.withDefault(300)); // Watt
  const [lampuWatt, setLampuWatt] = useQueryState("lampu", parseAsInteger.withDefault(100)); // Watt
  const [acLainWatt, setAcLainWatt] = useQueryState("lain", parseAsInteger.withDefault(150)); // Watt

  const result = useMemo(() => {
    // Kapasitas Total Aki dalam Watt-Hour (Wh)
    const kapasitasWh = akiAh * voltase;
    
    // Total beban tambahan (Watt)
    const totalBebanWatt = audioWatt + lampuWatt + acLainWatt;
    
    // Aki tidak boleh dikuras sampai 0%. Maksimal pengurasan aman (Depth of Discharge) sekitar 50% untuk aki basah/kering standar.
    // Kapasitas aman yang bisa dipakai = kapasitasWh * 0.5
    const kapasitasAmanWh = kapasitasWh * 0.5;

    // Daya tahan aki jika mesin mati (menit)
    const dayaTahanJam = totalBebanWatt > 0 ? kapasitasAmanWh / totalBebanWatt : 0;
    const dayaTahanMenit = dayaTahanJam * 60;

    // Rule of thumb modifikasi: Jika total beban aksesoris terus-menerus lebih dari 40% kapasitas altenator (kita asumsikan mirip dengan output aki Ah x Volt), aki akan tekor lambat laun.
    const bebanPersentase = (totalBebanWatt / kapasitasWh) * 100;

    return {
      kapasitasWh,
      totalBebanWatt,
      dayaTahanMenit,
      bebanPersentase: bebanPersentase.toFixed(1)
    };
  }, [akiAh, voltase, audioWatt, lampuWatt, acLainWatt]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6 flex flex-col gap-6">
        
        <div className="space-y-4 border-b border-border pb-4">
          <h4 className="font-semibold text-primary text-sm">Spesifikasi Aki (Baterai)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Kapasitas (Ampere-Hour / Ah)</label>
              <Input type="number" value={akiAh || ""} onChange={(e) => setAkiAh(Number(e.target.value))} />
              <p className="text-[10px] text-secondary mt-1">Cth mobil kecil 40Ah, Innova 65Ah.</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Voltase (V)</label>
              <Input type="number" value={voltase || ""} onChange={(e) => setVoltase(Number(e.target.value))} />
              <p className="text-[10px] text-secondary mt-1">Standar mobil/motor adalah 12V.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-primary text-sm">Beban Aksesoris Tambahan (Modifikasi)</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Audio / Power (Watt)</label>
              <Input type="number" value={audioWatt || ""} onChange={(e) => setAudioWatt(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Lampu Biled/Proj (Watt)</label>
              <Input type="number" value={lampuWatt || ""} onChange={(e) => setLampuWatt(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Lain-lain (Watt)</label>
              <Input type="number" value={acLainWatt || ""} onChange={(e) => setAcLainWatt(Number(e.target.value))} />
            </div>
          </div>
          <p className="text-[10px] text-secondary">Masukkan beban yang menyala bersamaan.</p>
        </div>

      </Card>
      
      <Card className="p-6 flex flex-col gap-6 bg-surface/50 border-accent/20">
        <h3 className="text-lg font-semibold text-primary">Hasil Analisis Aki</h3>
        
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Kapasitas Maksimal Aki</span>
            <span className="text-primary font-medium">{result.kapasitasWh} Watt-Hour</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Total Beban Modifikasi</span>
            <span className="text-danger font-medium">{result.totalBebanWatt} Watt</span>
          </div>
          
          {Number(result.bebanPersentase) > 50 && (
            <div className="p-2 bg-danger/10 text-danger text-xs rounded border border-danger/20 mt-2">
              ⚠️ Beban tambahan Anda sangat besar (>50% kapasitas aki). Dinamo Ampere (Alternator) standar mungkin tidak sanggup mengisi aki tepat waktu. Rawan tekor/mogok! Disarankan upgrade alternator atau tambah aki kedua.
            </div>
          )}
        </div>
        
        <OutputBox 
          label="Estimasi Aki Bertahan Jika Mesin Mati" 
          value={Math.floor(result.dayaTahanMenit)} 
          suffix=" Menit"
        />
        
        <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg text-primary text-sm">
          <strong>Catatan Safety:</strong> Simulasi ini menggunakan <em>Depth of Discharge (DoD)</em> 50%. Aki timah (Lead-Acid) yang dikuras sampai habis 0% akan langsung rusak selnya secara permanen.
        </div>
      </Card>
    </div>
  );
}
