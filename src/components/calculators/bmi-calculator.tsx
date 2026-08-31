"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { 
  Activity, 
  Scale, 
  HeartPulse, 
  RotateCcw, 
  User,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

type Gender = "pria" | "wanita";

interface CalculationResult {
  bmi: number;
  category: string;
  categoryColor: string;
  categoryBg: string;
  categoryBorder: string;
  bmr: number;
  tdee: number;
  minIdealWeight: number;
  maxIdealWeight: number;
  activityLabel: string;
}

export function BmiCalculator() {
  const [gender, setGender] = useState<Gender>("pria");
  const [age, setAge] = useState<string>("28");
  const [weight, setWeight] = useState<string>("70");
  const [height, setHeight] = useState<string>("175");
  const [activityMultiplier, setActivityMultiplier] = useState<string>("1.2");
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<CalculationResult | null>(() => {
    // Initial calculation for instant preview
    return calculateMetrics("pria", 28, 70, 175, 1.2);
  });

  function calculateMetrics(
    g: Gender, 
    a: number, 
    w: number, 
    h: number, 
    multiplier: number
  ): CalculationResult {
    // 1. Formula BMI = Berat (kg) / (Tinggi (m))^2
    const heightInM = h / 100;
    const bmiValue = parseFloat((w / (heightInM * heightInM)).toFixed(1));

    // Kategori BMI Standar WHO / Kemenkes
    let category = "Normal (Ideal)";
    let categoryColor = "text-emerald-400";
    let categoryBg = "bg-emerald-500/10";
    let categoryBorder = "border-emerald-500/30";

    if (bmiValue < 18.5) {
      category = "Kekurangan Berat Badan (Underweight)";
      categoryColor = "text-blue-400";
      categoryBg = "bg-blue-500/10";
      categoryBorder = "border-blue-500/30";
    } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
      category = "Berat Badan Normal (Ideal)";
      categoryColor = "text-emerald-400";
      categoryBg = "bg-emerald-500/10";
      categoryBorder = "border-emerald-500/30";
    } else if (bmiValue >= 25.0 && bmiValue <= 29.9) {
      category = "Kelebihan Berat Badan (Overweight)";
      categoryColor = "text-amber-400";
      categoryBg = "bg-amber-500/10";
      categoryBorder = "border-amber-500/30";
    } else {
      category = "Obesitas (Obese)";
      categoryColor = "text-rose-400";
      categoryBg = "bg-rose-500/10";
      categoryBorder = "border-rose-500/30";
    }

    // 2. Formula BMR (Mifflin-St Jeor)
    // Pria: (10 * kg) + (6.25 * cm) - (5 * usia) + 5
    // Wanita: (10 * kg) + (6.25 * cm) - (5 * usia) - 161
    let bmrValue = 0;
    if (g === "pria") {
      bmrValue = Math.round(10 * w + 6.25 * h - 5 * a + 5);
    } else {
      bmrValue = Math.round(10 * w + 6.25 * h - 5 * a - 161);
    }

    // 3. Total Daily Energy Expenditure (TDEE) / Kebutuhan Kalori Harian
    const tdeeValue = Math.round(bmrValue * multiplier);

    // Rentang berat ideal (BMI 18.5 - 24.9)
    const minIdeal = parseFloat((18.5 * heightInM * heightInM).toFixed(1));
    const maxIdeal = parseFloat((24.9 * heightInM * heightInM).toFixed(1));

    const activityLabels: Record<string, string> = {
      "1.2": "Sedentary (Minim Aktivitas)",
      "1.375": "Ringan (Olahraga 1-3 hari/minggu)",
      "1.55": "Sedang (Olahraga 3-5 hari/minggu)",
      "1.725": "Berat (Olahraga 6-7 hari/minggu)",
      "1.9": "Sangat Berat (Latihan Intensif / Fisik)",
    };

    return {
      bmi: bmiValue,
      category,
      categoryColor,
      categoryBg,
      categoryBorder,
      bmr: bmrValue,
      tdee: tdeeValue,
      minIdealWeight: minIdeal,
      maxIdealWeight: maxIdeal,
      activityLabel: activityLabels[multiplier.toString()] || "Standar",
    };
  }

  const validateAndCalculate = () => {
    const newErrors: { [key: string]: string } = {};
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const multiplierNum = parseFloat(activityMultiplier);

    if (!age || isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      newErrors.age = "Usia valid antara 1 - 120 tahun";
    }
    if (!weight || isNaN(weightNum) || weightNum < 10 || weightNum > 400) {
      newErrors.weight = "Berat valid antara 10 - 400 kg";
    }
    if (!height || isNaN(heightNum) || heightNum < 50 || heightNum > 260) {
      newErrors.height = "Tinggi valid antara 50 - 260 cm";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const calculated = calculateMetrics(gender, ageNum, weightNum, heightNum, multiplierNum);
      setResult(calculated);
    }
  };

  const handleReset = () => {
    setGender("pria");
    setAge("28");
    setWeight("70");
    setHeight("175");
    setActivityMultiplier("1.2");
    setErrors({});
    setResult(calculateMetrics("pria", 28, 70, 175, 1.2));
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Kolom Kiri: Input Form */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold font-display text-primary flex items-center gap-2">
                <HeartPulse className="h-6 w-6 text-accent" />
                Parameter Klinis & Antropometri
              </h2>
              <p className="text-secondary text-sm mt-1">
                Kalkulasi real-time indeks massa tubuh (BMI) dan laju metabolisme basal (BMR).
              </p>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary p-2 rounded-lg hover:bg-elevated transition-colors text-xs flex items-center gap-1.5"
              title="Reset ke parameter default"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          {/* Gender Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-secondary">
              Jenis Kelamin
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender("pria")}
                className={cn(
                  "flex items-center justify-center gap-2.5 py-3 px-4 rounded-[10px] border text-sm font-medium transition-all duration-200 min-h-[44px]",
                  gender === "pria"
                    ? "bg-accent/15 border-accent text-primary shadow-[0_0_15px_var(--accent-glow)]"
                    : "bg-base border-border text-secondary hover:text-primary hover:border-border/80"
                )}
              >
                <User className="h-4 w-4 text-accent" />
                <span>Pria</span>
              </button>

              <button
                type="button"
                onClick={() => setGender("wanita")}
                className={cn(
                  "flex items-center justify-center gap-2.5 py-3 px-4 rounded-[10px] border text-sm font-medium transition-all duration-200 min-h-[44px]",
                  gender === "wanita"
                    ? "bg-accent/15 border-accent text-primary shadow-[0_0_15px_var(--accent-glow)]"
                    : "bg-base border-border text-secondary hover:text-primary hover:border-border/80"
                )}
              >
                <User className="h-4 w-4 text-purple-400" />
                <span>Wanita</span>
              </button>
            </div>
          </div>

          {/* Numerical Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Usia"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Contoh: 28"
              suffix="Tahun"
              error={!!errors.age}
              helperText={errors.age}
              min={1}
              max={120}
            />

            <Input
              label="Berat Badan"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Contoh: 70"
              suffix="kg"
              error={!!errors.weight}
              helperText={errors.weight}
              min={10}
              max={400}
            />

            <Input
              label="Tinggi Badan"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Contoh: 175"
              suffix="cm"
              error={!!errors.height}
              helperText={errors.height}
              min={50}
              max={260}
            />
          </div>

          {/* Tingkat Aktivitas Harian */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-secondary">
              Tingkat Aktivitas Fisik Harian (Multiplier TDEE)
            </label>
            <select
              value={activityMultiplier}
              onChange={(e) => setActivityMultiplier(e.target.value)}
              className="flex h-11 w-full rounded-[10px] border border-border bg-base px-4 py-2 text-[15px] text-primary transition-colors focus-visible:outline-none focus-visible:border-accent"
            >
              <option value="1.2">Sedentary (Bekerja di meja, tanpa olahraga rutin) — 1.2x</option>
              <option value="1.375">Aktivitas Ringan (Olahraga intensitas ringan 1-3 hari/minggu) — 1.375x</option>
              <option value="1.55">Aktivitas Sedang (Olahraga intensitas sedang 3-5 hari/minggu) — 1.55x</option>
              <option value="1.725">Aktivitas Berat (Olahraga intensif 6-7 hari/minggu) — 1.725x</option>
              <option value="1.9">Sangat Berat (Latihan atletik profesional / pekerjaan fisik berat) — 1.9x</option>
            </select>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Button
              onClick={validateAndCalculate}
              className="w-full sm:w-auto"
              variant="primary"
            >
              Hitung Parameter Presisi
            </Button>
          </div>
        </Card>

        {/* Technical Validation Card */}
        <Card className="bg-surface/50 border-border/60 text-secondary text-xs leading-relaxed flex items-start gap-3 p-4">
          <Info className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-primary block mb-0.5">Parameter Teknis Terkalibrasi</span>
            Formula BMI menggunakan standar kuadratik Quetelet (<code className="text-accent">kg/m²</code>). Formula BMR menggunakan persamaan Mifflin-St Jeor yang terbukti memiliki akurasi klinis tertinggi dalam standar industri medis internasional.
          </div>
        </Card>
      </div>

      {/* Kolom Kanan: Hasil Kalkulasi */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {result && (
          <>
            {/* Box 1: BMI Result */}
            <div className="flex flex-col gap-2">
              <OutputBox
                label="Skor Indeks Massa Tubuh (BMI)"
                value={result.bmi}
                decimals={1}
                suffix=" kg/m²"
              />
              
              <div className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                result.categoryBg,
                result.categoryBorder,
                result.categoryColor
              )}>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>Kategori Status:</span>
                </div>
                <span className="font-semibold">{result.category}</span>
              </div>
            </div>

            {/* Box 2: Kalori Harian (TDEE) */}
            <OutputBox
              label="Kebutuhan Kalori Harian Pemeliharaan (TDEE)"
              value={result.tdee}
              suffix=" kkal/hari"
            />

            {/* Box 3: BMR Base Metabolic */}
            <OutputBox
              label="Laju Metabolisme Basal (BMR Mifflin-St Jeor)"
              value={result.bmr}
              suffix=" kkal/hari"
            />

            {/* Supplementary Diagnostics Card */}
            <Card className="flex flex-col gap-3 p-5 bg-elevated/70 border-border">
              <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                <Scale className="h-4 w-4 text-accent" />
                Rentang Berat Badan Ideal
              </h3>
              
              <div className="flex items-center justify-between text-sm py-1 border-b border-border/50">
                <span className="text-secondary">Batas Minimum Normal:</span>
                <span className="font-mono font-medium text-primary">{result.minIdealWeight} kg</span>
              </div>
              <div className="flex items-center justify-between text-sm py-1 border-b border-border/50">
                <span className="text-secondary">Batas Maksimum Normal:</span>
                <span className="font-mono font-medium text-primary">{result.maxIdealWeight} kg</span>
              </div>
              <div className="flex items-center justify-between text-sm py-1">
                <span className="text-secondary">Tingkat Aktivitas:</span>
                <span className="text-primary text-xs font-medium">{result.activityLabel}</span>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
