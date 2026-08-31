"use client";

import React, { useState } from "react";
import { useQueryState, parseAsFloat } from "nuqs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";

export function AkustikRuanganCalculator() {
  const [panjang, setPanjang] = useQueryState("panjang", parseAsFloat.withDefault(5));
  const [lebar, setLebar] = useQueryState("lebar", parseAsFloat.withDefault(4));
  const [tinggi, setTinggi] = useQueryState("tinggi", parseAsFloat.withDefault(3));

  const [hasil, setHasil] = useState<{
    fL: number | null;
    fW: number | null;
    fH: number | null;
  }>({
    fL: null,
    fW: null,
    fH: null,
  });

  const hitungMode = () => {
    if (panjang > 0 && lebar > 0 && tinggi > 0) {
      const c = 343; // Kecepatan suara pada suhu ruangan (m/s)
      
      // Rumus: F_mode = (c/2) * sqrt((p/L)^2 + (q/W)^2 + (r/H)^2)
      // Axial Mode: Fundamental L (1,0,0), W (0,1,0), H (0,0,1)
      const fL = (c / 2) * Math.sqrt(Math.pow(1 / panjang, 2));
      const fW = (c / 2) * Math.sqrt(Math.pow(1 / lebar, 2));
      const fH = (c / 2) * Math.sqrt(Math.pow(1 / tinggi, 2));

      setHasil({ fL, fW, fH });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Panjang Ruangan (meter)</label>
          <Input
            type="number"
            value={panjang}
            onChange={(e) => setPanjang(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Lebar Ruangan (meter)</label>
          <Input
            type="number"
            value={lebar}
            onChange={(e) => setLebar(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Tinggi Ruangan (meter)</label>
          <Input
            type="number"
            value={tinggi}
            onChange={(e) => setTinggi(parseFloat(e.target.value) || 0)}
          />
        </div>

        <Button onClick={hitungMode} className="w-full">
          Hitung Fundamental Resonansi
        </Button>
      </div>

      {hasil.fL !== null && hasil.fW !== null && hasil.fH !== null && (
        <div className="space-y-4 pt-4 border-t">
          <OutputBox
            label="Mode Axial Panjang (1,0,0)"
            value={hasil.fL}
            decimals={2}
            suffix=" Hz"
          />
          <OutputBox
            label="Mode Axial Lebar (0,1,0)"
            value={hasil.fW}
            decimals={2}
            suffix=" Hz"
          />
          <OutputBox
            label="Mode Axial Tinggi (0,0,1)"
            value={hasil.fH}
            decimals={2}
            suffix=" Hz"
          />
        </div>
      )}
    </Card>
  );
}
