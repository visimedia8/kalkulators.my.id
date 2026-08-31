"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Flame,
  Activity,
  RotateCcw,
  Calculator,
  Scale,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  Info,
  Apple,
} from "lucide-react";
import { useQueryState, parseAsFloat, parseAsInteger, parseAsString } from "nuqs";

interface ActivityOption {
  label: string;
  multiplier: number;
  description: string;
}

const ACTIVITY_MAP: Record<string, ActivityOption> = {
  sedentary: {
    label: "Sedentary (Minim Aktivitas)",
    multiplier: 1.2,
    description: "Bekerja di meja, tanpa olahraga rutin terstruktur",
  },
  ringan: {
    label: "Aktivitas Ringan (1-3 hari/minggu)",
    multiplier: 1.375,
    description: "Olahraga ringan atau jalan kaki teratur 1-3 hari per minggu",
  },
  sedang: {
    label: "Aktivitas Sedang (3-5 hari/minggu)",
    multiplier: 1.55,
    description: "Olahraga intensitas sedang atau kardio 3-5 hari per minggu",
  },
  berat: {
    label: "Aktivitas Berat (6-7 hari/minggu)",
    multiplier: 1.725,
    description: "Latihan intensif atau latihan beban berat 6-7 hari per minggu",
  },
  atlet: {
    label: "Atlet / Sangat Berat (2x per hari)",
    multiplier: 1.9,
    description: "Latihan atletik profesional ganda atau pekerjaan fisik sangat berat",
  },
};

export function TdeeCalculator() {
  // State Input terhubung ke URL Query Parameters via nuqs
  const [gender, setGender] = useQueryState("gender", parseAsString.withDefault("pria"));
  const [usia, setUsia] = useQueryState("usia", parseAsInteger.withDefault(25));
  const [berat, setBerat] = useQueryState("berat", parseAsFloat.withDefault(70));
  const [tinggi, setTinggi] = useQueryState("tinggi", parseAsFloat.withDefault(175));
  const [aktivitas, setAktivitas] = useQueryState("aktivitas", parseAsString.withDefault("sedentary"));

  // State Output Terhitung
  const [bmr, setBmr] = React.useState<number>(0);
  const [tdee, setTdee] = React.useState<number>(0);
  const [cutCalories, setCutCalories] = React.useState<number>(0);
  const [mildCutCalories, setMildCutCalories] = React.useState<number>(0);
  const [leanBulkCalories, setLeanBulkCalories] = React.useState<number>(0);
  const [bulkCalories, setBulkCalories] = React.useState<number>(0);
  const [proteinGrams, setProteinGrams] = React.useState<number>(0);
  const [carbGrams, setCarbGrams] = React.useState<number>(0);
  const [fatGrams, setFatGrams] = React.useState<number>(0);

  // Komputasi Matematis Formula Mifflin-St Jeor & TDEE
  const calculateTdee = React.useCallback(() => {
    const w = Math.max(1, berat || 70);
    const h = Math.max(1, tinggi || 175);
    const u = Math.max(1, usia || 25);
    const isMale = (gender || "pria") === "pria";

    // 1. Formula BMR (Mifflin-St Jeor)
    // Pria: (10 * kg) + (6.25 * cm) - (5 * usia) + 5
    // Wanita: (10 * kg) + (6.25 * cm) - (5 * usia) - 161
    const calculatedBmr = Math.round(
      isMale
        ? 10 * w + 6.25 * h - 5 * u + 5
        : 10 * w + 6.25 * h - 5 * u - 161
    );

    // 2. Faktor Pengali Aktivitas Fisik (PAL)
    const currentActivity = ACTIVITY_MAP[aktivitas || "sedentary"] || ACTIVITY_MAP.sedentary;
    const calculatedTdee = Math.round(calculatedBmr * currentActivity.multiplier);

    // 3. Sasaran Kalori Komposisi Tubuh Terkalibrasi
    const calculatedCut = Math.round(calculatedTdee * 0.8); // Defisit 20% (Fat Loss)
    const calculatedMildCut = Math.round(calculatedTdee * 0.9); // Defisit 10% (Fat Loss Bertahap)
    const calculatedLeanBulk = Math.round(calculatedTdee * 1.1); // Surplus 10% (Lean Muscle Gain)
    const calculatedBulk = Math.round(calculatedTdee * 1.2); // Surplus 20% (Maximum Muscle Gain)

    // 4. Distribusi Makronutrisi Presisi (Maintenance: 30% Protein, 40% Karbohidrat, 30% Lemak)
    const protein = Math.round((calculatedTdee * 0.3) / 4);
    const carbs = Math.round((calculatedTdee * 0.4) / 4);
    const fats = Math.round((calculatedTdee * 0.3) / 9);

    setBmr(calculatedBmr);
    setTdee(calculatedTdee);
    setCutCalories(calculatedCut);
    setMildCutCalories(calculatedMildCut);
    setLeanBulkCalories(calculatedLeanBulk);
    setBulkCalories(calculatedBulk);
    setProteinGrams(protein);
    setCarbGrams(carbs);
    setFatGrams(fats);
  }, [gender, usia, berat, tinggi, aktivitas]);

  // Kalkulasi otomatis secara real-time saat parameter berubah
  React.useEffect(() => {
    calculateTdee();
  }, [calculateTdee]);

  const handleReset = () => {
    setGender("pria");
    setUsia(25);
    setBerat(70);
    setTinggi(175);
    setAktivitas("sedentary");
  };

  const currentActivityInfo = ACTIVITY_MAP[aktivitas || "sedentary"] || ACTIVITY_MAP.sedentary;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Kolom Form Input */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Fisiologis & Aktivitas
                </h2>
                <p className="text-secondary text-sm">
                  Kalkulasi presisi TDEE berbasis formula klinis Mifflin-St Jeor
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke parameter rujukan default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Input Jenis Kelamin */}
            <Select
              label="Jenis Kelamin Biologis"
              value={gender || "pria"}
              onChange={(e) => setGender(e.target.value)}
              helperText="Konstanta fisiologis metabolisme basal jenis kelamin"
            >
              <option value="pria">Pria (Laki-laki)</option>
              <option value="wanita">Wanita (Perempuan)</option>
            </Select>

            {/* Input Usia */}
            <Input
              label="Usia Pasien / Pengguna"
              type="number"
              min={10}
              max={120}
              step={1}
              value={usia ?? ""}
              onChange={(e) => setUsia(e.target.value === "" ? null : Number(e.target.value))}
              suffix="Tahun"
              helperText="Rentang parameter: 10 - 120 tahun"
            />

            {/* Input Berat Badan */}
            <Input
              label="Berat Badan Aktual"
              type="number"
              min={20}
              max={300}
              step={0.5}
              value={berat ?? ""}
              onChange={(e) => setBerat(e.target.value === "" ? null : Number(e.target.value))}
              suffix="kg"
              helperText="Massa tubuh terukur dalam kilogram"
            />

            {/* Input Tinggi Badan */}
            <Input
              label="Tinggi Badan Berdiri"
              type="number"
              min={50}
              max={250}
              step={0.5}
              value={tinggi ?? ""}
              onChange={(e) => setTinggi(e.target.value === "" ? null : Number(e.target.value))}
              suffix="cm"
              helperText="Tinggi badan dalam sentimeter"
            />

            {/* Select Tingkat Aktivitas Harian */}
            <div className="sm:col-span-2">
              <Select
                label="Tingkat Aktivitas Fisik Harian (Physical Activity Level)"
                value={aktivitas || "sedentary"}
                onChange={(e) => setAktivitas(e.target.value)}
                helperText={`Koefisien Pengali: ${currentActivityInfo.multiplier}x — ${currentActivityInfo.description}`}
              >
                <option value="sedentary">
                  Sedentary (Minim Aktivitas / Kerja di Meja) — 1.2x
                </option>
                <option value="ringan">
                  Aktivitas Ringan (Olahraga 1-3 hari/minggu) — 1.375x
                </option>
                <option value="sedang">
                  Aktivitas Sedang (Olahraga 3-5 hari/minggu) — 1.55x
                </option>
                <option value="berat">
                  Aktivitas Berat (Olahraga Intensif 6-7 hari/minggu) — 1.725x
                </option>
                <option value="atlet">
                  Atlet / Sangat Berat (Latihan Fisik 2x Sehari) — 1.9x
                </option>
              </Select>
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={calculateTdee} className="w-full sm:w-auto flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Hitung Pengeluaran Energi (TDEE)
            </Button>
          </div>
        </Card>

        {/* Card Catatan Parameter Teknis */}
        <Card className="bg-surface/50 border-border/60 text-secondary text-xs leading-relaxed flex items-start gap-3 p-4">
          <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-primary block mb-0.5">
              Parameter Teknis Terkalibrasi
            </span>
            Formula Mifflin-St Jeor merupakan standar industri gizi klinis untuk menghitung Basal
            Metabolic Rate (BMR). Nilai TDEE merefleksikan integrasi BMR dengan pengeluaran energi
            termogenesis aktivitas fisik harian (PAL).
          </div>
        </Card>
      </div>

      {/* Kolom Output & Breakdown */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Output Utama: TDEE */}
        <OutputBox
          label="Kebutuhan Kalori Harian Pemeliharaan (TDEE)"
          value={tdee}
          suffix=" kkal/hari"
        />

        {/* Output Sekunder: BMR */}
        <OutputBox
          label="Laju Metabolisme Basal (BMR Mifflin-St Jeor)"
          value={bmr}
          suffix=" kkal/hari"
        />

        {/* Sasaran Komposisi Tubuh Berbasis Kalori */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent" />
              Target Kalori Sasaran Tubuh
            </h3>
            <span className="text-xs font-mono text-secondary bg-base px-2 py-0.5 rounded border border-border">
              {currentActivityInfo.multiplier}x PAL
            </span>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-amber-400" />
                Fat Loss (Defisit 20%):
              </span>
              <span className="font-mono text-amber-400 font-semibold">{cutCalories} kkal</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-yellow-400" />
                Defisit Ringan (10%):
              </span>
              <span className="font-mono text-primary font-medium">{mildCutCalories} kkal</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-400" />
                Pemeliharaan (Maintenance):
              </span>
              <span className="font-mono text-emerald-400 font-semibold">{tdee} kkal</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Lean Muscle Gain (+10%):
              </span>
              <span className="font-mono text-primary font-medium">{leanBulkCalories} kkal</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-secondary flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                Heavy Bulking (+20%):
              </span>
              <span className="font-mono text-purple-400 font-semibold">{bulkCalories} kkal</span>
            </div>
          </div>
        </Card>

        {/* Distribusi Makronutrisi Harian */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase flex items-center gap-2">
              <Apple className="w-4 h-4 text-accent" />
              Alokasi Makronutrisi Presisi (30/40/30)
            </h3>
            <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
              Maintenance
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-base border border-border flex flex-col items-center">
              <span className="text-xs text-secondary mb-1">Protein (30%)</span>
              <span className="font-mono text-lg font-bold text-accent">{proteinGrams}g</span>
              <span className="text-[10px] text-secondary/80 mt-0.5">4 kkal/g</span>
            </div>

            <div className="p-3 rounded-xl bg-base border border-border flex flex-col items-center">
              <span className="text-xs text-secondary mb-1">Karbohidrat (40%)</span>
              <span className="font-mono text-lg font-bold text-emerald-400">{carbGrams}g</span>
              <span className="text-[10px] text-secondary/80 mt-0.5">4 kkal/g</span>
            </div>

            <div className="p-3 rounded-xl bg-base border border-border flex flex-col items-center">
              <span className="text-xs text-secondary mb-1">Lemak Sehat (30%)</span>
              <span className="font-mono text-lg font-bold text-amber-400">{fatGrams}g</span>
              <span className="text-[10px] text-secondary/80 mt-0.5">9 kkal/g</span>
            </div>
          </div>
        </Card>

        {/* Jaminan Standar Industri */}
        <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-accent/10 text-accent shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex flex-col gap-1 text-xs">
              <span className="font-semibold text-primary">
                Standar Industri Sains Nutrisi Terapan
              </span>
              <p className="text-secondary leading-relaxed">
                Kebutuhan energi harian dihitung secara akurat tanpa asumsi kasar. Seluruh angka
                merupakan rujukan kuantitatif ilmiah yang dapat diaplikasikan langsung ke dalam
                protokol diet dan perencanaan nutrisi harian.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}