"use client";

import React, { useMemo } from "react";
import { useQueryState } from "nuqs";
import { format, addMonths } from "date-fns";
import { id } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const JADWAL_IDAI = [
  { bulan: 0, vaksin: "Hepatitis B0, Polio 0" },
  { bulan: 1, vaksin: "BCG, Polio 1" },
  { bulan: 2, vaksin: "DPT/HB/Hib 1, Polio 2, PCV 1, Rotavirus 1" },
  { bulan: 3, vaksin: "DPT/HB/Hib 2, Polio 3, PCV 2, Rotavirus 2" },
  { bulan: 4, vaksin: "DPT/HB/Hib 3, Polio 4, PCV 3, Rotavirus 3" },
  { bulan: 6, vaksin: "Influenza 1" },
  { bulan: 9, vaksin: "Campak Rubella (MR) 1" },
  { bulan: 12, vaksin: "PCV 4, Varicella" },
  { bulan: 15, vaksin: "MMR, Hepatitis A 1" },
  { bulan: 18, vaksin: "DPT/HB/Hib 4, Polio 5, Campak Rubella (MR) 2" }
];

export function JadwalImunisasiCalculator() {
  const [tanggalLahir, setTanggalLahir] = useQueryState("tanggalLahir", { defaultValue: "" });

  const jadwalImunisasi = useMemo(() => {
    if (!tanggalLahir) return null;
    
    const birthDate = new Date(tanggalLahir);
    if (isNaN(birthDate.getTime())) return null;

    return JADWAL_IDAI.map((item) => {
      const scheduleDate = addMonths(birthDate, item.bulan);
      return {
        ...item,
        tanggal: format(scheduleDate, "dd MMMM yyyy", { locale: id }),
      };
    });
  }, [tanggalLahir]);

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Kalkulator Jadwal Imunisasi Anak (IDAI)</h2>
        <p className="text-sm text-muted-foreground">
          Masukkan tanggal lahir anak Anda untuk melihat jadwal imunisasi dasar rekomendasi IDAI.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Tanggal Lahir Anak"
          type="date"
          value={tanggalLahir}
          onChange={(e) => setTanggalLahir(e.target.value)}
        />
      </div>

      {jadwalImunisasi && (
        <div className="space-y-4 mt-8">
          <h3 className="text-lg font-semibold border-b pb-2">Jadwal Imunisasi Rekomendasi</h3>
          <div className="grid gap-4">
            {jadwalImunisasi.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-start justify-center p-4 rounded-2xl border border-[rgba(99,102,241,0.3)] bg-gradient-to-br from-[rgba(99,102,241,0.08)] to-[rgba(99,102,241,0.02)]"
              >
                <span className="text-secondary text-[13px] font-sans mb-1">
                  Usia {item.bulan} Bulan ({item.tanggal})
                </span>
                <div className="font-sans text-xl font-semibold text-primary">
                  {item.vaksin}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
