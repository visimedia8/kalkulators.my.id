"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OutputBox } from "@/components/ui/output-box";
import { parseAsInteger, useQueryState } from "nuqs";

export function GearRatioCalculator() {
  const [gearDepanLama, setGearDepanLama] = useQueryState("gearDepanLama", parseAsInteger.withDefault(14));
  const [gearBelakangLama, setGearBelakangLama] = useQueryState("gearBelakangLama", parseAsInteger.withDefault(42));
  
  const [gearDepanBaru, setGearDepanBaru] = useQueryState("gearDepanBaru", parseAsInteger.withDefault(15));
  const [gearBelakangBaru, setGearBelakangBaru] = useQueryState("gearBelakangBaru", parseAsInteger.withDefault(40));

  const result = useMemo(() => {
    const ratioLama = gearBelakangLama / gearDepanLama;
    const ratioBaru = gearBelakangBaru / gearDepanBaru;
    
    // Perubahan dalam persentase
    const perubahan = ((ratioBaru - ratioLama) / ratioLama) * 100;
    
    let karakter = "";
    if (Math.abs(perubahan) < 1) {
      karakter = "Sama dengan Standar";
    } else if (perubahan > 0) {
      karakter = "Akselerasi Naik (Torsi Lebih Besar), Top Speed Turun";
    } else {
      karakter = "Top Speed Naik (Nafas Lebih Panjang), Akselerasi Turun";
    }

    return {
      ratioLama: ratioLama.toFixed(2),
      ratioBaru: ratioBaru.toFixed(2),
      perubahan: perubahan,
      karakter,
      isBerat: perubahan < 0
    };
  }, [gearDepanLama, gearBelakangLama, gearDepanBaru, gearBelakangBaru]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6 flex flex-col gap-6">
        <div className="space-y-6">
          
          <div className="space-y-4 p-4 border border-border rounded-xl bg-base">
            <h4 className="font-semibold text-primary text-sm">Spesifikasi Standar (Bawaan Pabrik)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-secondary mb-2">Mata Gir Depan</label>
                <Input type="number" value={gearDepanLama || ""} onChange={(e) => setGearDepanLama(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-2">Mata Gir Belakang</label>
                <Input type="number" value={gearBelakangLama || ""} onChange={(e) => setGearBelakangLama(Number(e.target.value))} />
              </div>
            </div>
          </div>

          <div className="space-y-4 p-4 border border-border rounded-xl bg-base">
            <h4 className="font-semibold text-primary text-sm">Spesifikasi Modifikasi (Baru)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-secondary mb-2">Mata Gir Depan</label>
                <Input type="number" value={gearDepanBaru || ""} onChange={(e) => setGearDepanBaru(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-2">Mata Gir Belakang</label>
                <Input type="number" value={gearBelakangBaru || ""} onChange={(e) => setGearBelakangBaru(Number(e.target.value))} />
              </div>
            </div>
          </div>

        </div>
      </Card>
      
      <Card className="p-6 flex flex-col gap-6 bg-surface/50 border-accent/20">
        <h3 className="text-lg font-semibold text-primary">Analisis Karakteristik Motor</h3>
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Rasio Final Gear Lama</span>
            <span className="text-primary font-medium">{result.ratioLama}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Rasio Final Gear Baru</span>
            <span className="text-accent font-medium">{result.ratioBaru}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Persentase Perubahan</span>
            <span className={result.isBerat ? "text-primary font-medium" : "text-danger font-medium"}>
              {result.perubahan > 0 ? "+" : ""}{result.perubahan.toFixed(1)}% (Angka Rasio)
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-start justify-center p-6 rounded-2xl border border-[rgba(99,102,241,0.3)] bg-gradient-to-br from-[rgba(99,102,241,0.08)] to-[rgba(99,102,241,0.02)]">
          <span className="text-secondary text-[13px] font-sans mb-1">Karakteristik Tarikan Motor</span>
          <div className="font-semibold text-xl text-primary mt-2 leading-snug">
            {result.karakter}
          </div>
        </div>
        
        {result.isBerat && (
          <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg text-primary text-sm">
            Rasio lebih berat. Motor butuh torsi lebih besar untuk mulai berjalan (akselerasi lebih pelan), tetapi topspeed di putaran atas bisa lebih tinggi jika power mesin mencukupi.
          </div>
        )}
      </Card>
    </div>
  );
}
