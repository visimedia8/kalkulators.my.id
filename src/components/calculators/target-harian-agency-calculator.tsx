"use client";

import React from "react";
import { useQueryState, parseAsInteger } from "nuqs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";

export function TargetHarianAgencyCalculator() {
  const [targetTier, setTargetTier] = useQueryState(
    "targetTier",
    parseAsInteger.withDefault(100000)
  );
  const [terkumpulSaatIni, setTerkumpulSaatIni] = useQueryState(
    "terkumpulSaatIni",
    parseAsInteger.withDefault(25000)
  );
  const [sisaHari, setSisaHari] = useQueryState(
    "sisaHari",
    parseAsInteger.withDefault(15)
  );

  const kekurangan = Math.max(0, targetTier - terkumpulSaatIni);
  const targetHarian = sisaHari > 0 ? Math.ceil(kekurangan / sisaHari) : kekurangan;
  const isTargetAchieved = kekurangan <= 0;
  const isUnreasonable = targetHarian > 50000;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <Card className="lg:col-span-7 flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold mb-2">Parameter Teknis Target</h2>
          <p className="text-sm text-secondary">
            Masukkan parameter target (Beans/Diamonds) dan jumlah pencapaian Anda saat ini secara real-time.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            type="number"
            label="Target Tier (Beans/Diamonds)"
            value={targetTier || ""}
            onChange={(e) => setTargetTier(parseInt(e.target.value) || 0)}
            suffix="Beans"
          />
          <Input
            type="number"
            label="Terkumpul Saat Ini"
            value={terkumpulSaatIni || ""}
            onChange={(e) => setTerkumpulSaatIni(parseInt(e.target.value) || 0)}
            suffix="Beans"
          />
          <Input
            type="number"
            label="Sisa Hari dalam Bulan Ini"
            value={sisaHari || ""}
            onChange={(e) => setSisaHari(parseInt(e.target.value) || 0)}
            suffix="Hari"
          />
        </div>
        
        <Button 
          onClick={() => {
            setTargetTier(100000);
            setTerkumpulSaatIni(25000);
            setSisaHari(15);
          }} 
          variant="secondary" 
          className="w-full"
        >
          Reset Parameter
        </Button>
      </Card>

      <Card className="lg:col-span-5 flex flex-col gap-6 bg-surface">
        <div>
          <h2 className="text-xl font-bold mb-2">Hasil Kalkulasi Presisi</h2>
          <p className="text-sm text-secondary">
            Perhitungan akurat target harian yang perlu Anda capai.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <OutputBox
            label="Sisa Beans Dibutuhkan"
            value={kekurangan}
            suffix=" Beans"
          />
          <OutputBox
            label="Target Harian (Beans/Hari)"
            value={targetHarian}
            suffix=" / Hari"
          />
        </div>

        {isTargetAchieved && (
          <div className="p-4 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[13px] font-medium text-center">
            🎉 Selamat! Pencapaian Anda telah memenuhi standar industri.
          </div>
        )}

        {!isTargetAchieved && isUnreasonable && (
          <div className="p-4 rounded-[10px] bg-danger/10 border border-danger/20 text-danger text-[13px] font-medium text-center">
            ⚠️ Peringatan: Target harian terlalu tinggi (&gt; 50.000 beans/hari) dan berisiko sulit dicapai secara organik.
          </div>
        )}
      </Card>
    </div>
  );
}
