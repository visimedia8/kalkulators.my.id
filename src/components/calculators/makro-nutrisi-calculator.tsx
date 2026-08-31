"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Flame,
  Scale,
  RotateCcw,
  Calculator,
  Info,
  Beef,
  Wheat,
  Droplet,
  ShieldCheck,
} from "lucide-react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";

type GoalType = "bulking" | "cutting" | "maintenance";

interface GoalConfig {
  label: string;
  adjustment: number;
  description: string;
  badgeColor: string;
}

const GOAL_MAP: Record<GoalType, GoalConfig> = {
  bulking: {
    label: "Bulking (+500 kkal / hari — Peningkatan Massa Otot)",
    adjustment: 500,
    description: "Surplus kalori terukur untuk optimalisasi sintesis protein otot dan hipertrofi.",
    badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  },
  cutting: {
    label: "Cutting (-500 kkal / hari — Pembakaran Lemak / Fat Loss)",
    adjustment: -500,
    description: "Defisit kalori standar industri untuk mobilisasi cadangan lipid tanpa katabolisme otot.",
    badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  },
  maintenance: {
    label: "Maintenance (0 kkal — Pemeliharaan & Rekomposisi)",
    adjustment: 0,
    description: "Keseimbangan energi isokalorik untuk menjaga massa tubuh dan densitas metabolisme.",
    badgeColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
  },
};

export function MakroNutrisiCalculator() {
  // State Input terhubung ke URL Query Parameters via nuqs
  const [tdee, setTdee] = useQueryState(
    "tdee",
    parseAsInteger.withDefault(2000)
  );
  const [goal, setGoal] = useQueryState(
    "goal",
    parseAsString.withDefault("maintenance")
  );

  // State Output Terkalkulasi
  const [targetCalories, setTargetCalories] = React.useState<number>(2000);
  const [proteinGrams, setProteinGrams] = React.useState<number>(150);
  const [proteinCalories, setProteinCalories] = React.useState<number>(600);
  const [carbGrams, setCarbGrams] = React.useState<number>(200);
  const [carbCalories, setCarbCalories] = React.useState<number>(800);
  const [fatGrams, setFatGrams] = React.useState<number>(67);
  const [fatCalories, setFatCalories] = React.useState<number>(600);

  // Komputasi Matematis Distribusi Makronutrisi Presisi
  const calculateMacros = React.useCallback(() => {
    const rawTdee = Math.max(500, tdee ?? 2000);
    const validGoal: GoalType = (goal in GOAL_MAP ? goal : "maintenance") as GoalType;
    const goalConfig = GOAL_MAP[validGoal];

    // 1. Target Kalori Total Sesuai Sasaran Fisiologis
    const calculatedTarget = Math.max(500, rawTdee + goalConfig.adjustment);

    // 2. Alokasi Kalori Standar Industri: Protein 30%, Fat 30%, Carbs 40%
    const pCal = Math.round(calculatedTarget * 0.3);
    const fCal = Math.round(calculatedTarget * 0.3);
    const cCal = Math.round(calculatedTarget * 0.4);

    // 3. Konversi ke Gram Nutrisi Terkalibrasi (Protein: 4 kkal/g, Lemak: 9 kkal/g, Karbo: 4 kkal/g)
    const pGrams = Math.round(pCal / 4);
    const fGrams = Math.round(fCal / 9);
    const cGrams = Math.round(cCal / 4);

    setTargetCalories(calculatedTarget);
    setProteinCalories(pCal);
    setProteinGrams(pGrams);
    setFatCalories(fCal);
    setFatGrams(fGrams);
    setCarbCalories(cCal);
    setCarbGrams(cGrams);
  }, [tdee, goal]);

  // Kalkulasi Otomatis Real-time Saat Parameter Input Berubah
  React.useEffect(() => {
    calculateMacros();
  }, [calculateMacros]);

  const handleReset = () => {
    setTdee(2000);
    setGoal("maintenance");
  };

  const currentGoalKey: GoalType = (goal in GOAL_MAP ? goal : "maintenance") as GoalType;
  const currentGoalInfo = GOAL_MAP[currentGoalKey];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Kolom Form Input Parameter */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Kebutuhan Energi & Sasaran
                </h2>
                <p className="text-secondary text-sm">
                  Distribusi makronutrisi presisi berbasis Total Daily Energy Expenditure (TDEE)
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke parameter default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Input TDEE */}
            <div className="sm:col-span-2">
              <Input
                label="Total Daily Energy Expenditure (TDEE)"
                type="number"
                min={500}
                max={10000}
                step={50}
                value={tdee ?? ""}
                onChange={(e) =>
                  setTdee(e.target.value === "" ? null : Number(e.target.value))
                }
                suffix="kkal/hari"
                helperText="Total energi pemeliharaan harian terukur (BMR x Physical Activity Level)"
              />
            </div>

            {/* Select Sasaran Fisiologis / Goal */}
            <div className="sm:col-span-2">
              <Select
                label="Sasaran Komposisi Tubuh (Goal)"
                value={currentGoalKey}
                onChange={(e) => setGoal(e.target.value)}
                helperText={currentGoalInfo.description}
              >
                <option value="bulking">
                  Bulking (Surplus +500 kkal / hari — Peningkatan Massa Otot)
                </option>
                <option value="cutting">
                  Cutting (Defisit -500 kkal / hari — Pembakaran Lemak Tubuh)
                </option>
                <option value="maintenance">
                  Maintenance (0 kkal — Pemeliharaan Berat Badan & Rekomposisi)
                </option>
              </Select>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              onClick={calculateMacros}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Hitung Makronutrisi Presisi
            </Button>
            <div className="flex items-center gap-2 text-xs text-secondary">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sinkronisasi URL real-time aktif
            </div>
          </div>
        </Card>

        {/* Card Parameter Teknis & Rasio Standar */}
        <Card className="bg-surface/50 border-border/60 text-secondary text-xs leading-relaxed flex items-start gap-3 p-4">
          <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-primary block mb-0.5">
              Parameter Teknis Terkalibrasi
            </span>
            Alokasi makronutrisi dihitung berdasarkan standar industri gizi olahraga: Protein 30% (4 kkal/g), Lemak Sehat 30% (9 kkal/g), dan Karbohidrat Kompleks 40% (4 kkal/g). Penyesuaian kalori bulking (+500 kkal) dan cutting (-500 kkal) memberikan laju perubahan komposisi tubuh optimal tanpa mengorbankan stabilitas metabolisme basal.
          </div>
        </Card>
      </div>

      {/* Kolom Output & Distribusi Gram Harian */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Output Utama: Total Target Kalori */}
        <OutputBox
          label={`Target Asupan Energi Harian (${currentGoalKey.toUpperCase()})`}
          value={targetCalories}
          suffix=" kkal/hari"
        />

        {/* Grid Output Box Makronutrisi (Gram per Hari) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <OutputBox
            label="Protein (30%)"
            value={proteinGrams}
            suffix=" g"
            className="p-4 border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-rose-500/5"
          />
          <OutputBox
            label="Karbohidrat (40%)"
            value={carbGrams}
            suffix=" g"
            className="p-4 border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-500/5"
          />
          <OutputBox
            label="Lemak / Fat (30%)"
            value={fatGrams}
            suffix=" g"
            className="p-4 border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-blue-500/5"
          />
        </div>

        {/* Card Tabel Rincian Distribusi Energi */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase flex items-center gap-2">
              <Scale className="w-4 h-4 text-accent" />
              Distribusi Makro Presisi Harian
            </h3>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded border capitalize ${currentGoalInfo.badgeColor}`}
            >
              {currentGoalKey}
            </span>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            {/* Protein Row */}
            <div className="flex justify-between items-center py-1.5 border-b border-border/40">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-rose-500/20 text-rose-400">
                  <Beef className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-primary font-medium block">Protein (30%)</span>
                  <span className="text-secondary text-xs">{proteinCalories} kkal (4 kkal/g)</span>
                </div>
              </div>
              <span className="font-mono text-rose-400 font-bold text-base">
                {proteinGrams} g
              </span>
            </div>

            {/* Karbohidrat Row */}
            <div className="flex justify-between items-center py-1.5 border-b border-border/40">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-amber-500/20 text-amber-400">
                  <Wheat className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-primary font-medium block">Karbohidrat (40%)</span>
                  <span className="text-secondary text-xs">{carbCalories} kkal (4 kkal/g)</span>
                </div>
              </div>
              <span className="font-mono text-amber-400 font-bold text-base">
                {carbGrams} g
              </span>
            </div>

            {/* Lemak Row */}
            <div className="flex justify-between items-center py-1.5">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-blue-500/20 text-blue-400">
                  <Droplet className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-primary font-medium block">Lemak Sehat (30%)</span>
                  <span className="text-secondary text-xs">{fatCalories} kkal (9 kkal/g)</span>
                </div>
              </div>
              <span className="font-mono text-blue-400 font-bold text-base">
                {fatGrams} g
              </span>
            </div>
          </div>
        </Card>

        {/* Panduan Cepat Rekomendasi Sumber Makanan */}
        <Card className="flex flex-col gap-3 p-4 bg-surface/60 border-border">
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-accent" />
            Rekomendasi Bahan Makanan Berkualitas
          </div>
          <ul className="text-xs text-secondary space-y-1.5 list-disc list-inside">
            <li>
              <strong className="text-primary">Sumber Protein:</strong> Dada ayam fillet, putih telur, tempe, tahu, ikan tuna, salmon, whey isolate.
            </li>
            <li>
              <strong className="text-primary">Sumber Karbohidrat:</strong> Nasi merah, oatmeal, ubi jalar, kentang panggang, quinoa, beras basmati.
            </li>
            <li>
              <strong className="text-primary">Sumber Lemak Sehat:</strong> Alpukat, minyak zaitun murni (extra virgin), kacang almond, biji chia.
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
