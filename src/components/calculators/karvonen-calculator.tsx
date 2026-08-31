"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Heart,
  Activity,
  Flame,
  Zap,
  RotateCcw,
  Calculator,
  Info,
  ShieldCheck,
  Gauge,
  TrendingUp,
} from "lucide-react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { cn } from "@/lib/utils";

interface HeartRateZoneDetail {
  zoneNumber: number;
  name: string;
  category: "Recovery" | "Fat Burn" | "Aerobic" | "Anaerobic" | "VO2 Max";
  minIntensity: number;
  maxIntensity: number;
  minBpm: number;
  maxBpm: number;
  description: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  barColor: string;
}

export function KarvonenCalculator() {
  // 1. State Input terhubung ke URL Query Parameters via nuqs
  const [age, setAge] = useQueryState("age", parseAsInteger.withDefault(30));
  const [rhr, setRhr] = useQueryState("rhr", parseAsInteger.withDefault(60));
  const [formula, setFormula] = useQueryState(
    "formula",
    parseAsString.withDefault("fox")
  );

  // 2. Output Calculation States
  const [maxHr, setMaxHr] = React.useState<number>(190);
  const [hrr, setHrr] = React.useState<number>(130);
  const [zones, setZones] = React.useState<HeartRateZoneDetail[]>([]);
  const [fatBurnMidpoint, setFatBurnMidpoint] = React.useState<number>(145);
  const [aerobicMidpoint, setAerobicMidpoint] = React.useState<number>(158);
  const [anaerobicMidpoint, setAnaerobicMidpoint] = React.useState<number>(171);

  // 3. Logika Perhitungan Presisi Metode Karvonen
  const calculateKarvonen = React.useCallback(() => {
    const currentAge = Math.max(10, Math.min(100, age ?? 30));
    const currentRhr = Math.max(30, Math.min(140, rhr ?? 60));

    // A. Perhitungan Max HR Berdasarkan Formula Terpilih
    let calculatedMaxHr = 220 - currentAge; // Default Fox & Haskell
    if (formula === "tanaka") {
      calculatedMaxHr = Math.round(208 - 0.7 * currentAge);
    } else if (formula === "gellish") {
      calculatedMaxHr = Math.round(207 - 0.7 * currentAge);
    }

    // Validasi Heart Rate Reserve (HRR)
    const calculatedHrr = Math.max(1, calculatedMaxHr - currentRhr);

    setMaxHr(calculatedMaxHr);
    setHrr(calculatedHrr);

    // B. Perhitungan Target Heart Rate per Zona Karvonen: THR = (HRR * %Intensity) + RHR
    const zoneDefinitions = [
      {
        zoneNumber: 1,
        name: "Zona 1: Pemulihan Aktif (Active Recovery)",
        category: "Recovery" as const,
        minIntensity: 0.5,
        maxIntensity: 0.6,
        description:
          "Intensitas sangat ringan untuk regenerasi metabolik, pemanasan, dan pendinginan pasca-latihan.",
        badgeBg: "bg-sky-500/10",
        badgeBorder: "border-sky-500/30",
        badgeText: "text-sky-400",
        barColor: "bg-sky-500",
      },
      {
        zoneNumber: 2,
        name: "Zona 2: Pembakaran Lemak (Fat Burn / Base)",
        category: "Fat Burn" as const,
        minIntensity: 0.6,
        maxIntensity: 0.7,
        description:
          "Optimalisasi oksidasi asam lemak bebas, peningkatan biogenesis mitokondria, dan fondasi aerobik dasar.",
        badgeBg: "bg-emerald-500/10",
        badgeBorder: "border-emerald-500/30",
        badgeText: "text-emerald-400",
        barColor: "bg-emerald-500",
      },
      {
        zoneNumber: 3,
        name: "Zona 3: Ketahanan Kardiovaskular (Aerobic Endurance)",
        category: "Aerobic" as const,
        minIntensity: 0.7,
        maxIntensity: 0.8,
        description:
          "Penguatan kapasitas pompa ventrikel jantung, sirkulasi kapiler paru-paru, dan efisiensi aerobik jarak jauh.",
        badgeBg: "bg-amber-500/10",
        badgeBorder: "border-amber-500/30",
        badgeText: "text-amber-400",
        barColor: "bg-amber-500",
      },
      {
        zoneNumber: 4,
        name: "Zona 4: Ambang Laktat (Anaerobic Threshold)",
        category: "Anaerobic" as const,
        minIntensity: 0.8,
        maxIntensity: 0.9,
        description:
          "Meningkatkan toleransi penumpukan asam laktat darah, ketahanan kecepatan tinggi (*tempo*), dan performa kompetisi.",
        badgeBg: "bg-orange-500/10",
        badgeBorder: "border-orange-500/30",
        badgeText: "text-orange-400",
        barColor: "bg-orange-500",
      },
      {
        zoneNumber: 5,
        name: "Zona 5: Kapasitas Maksimal (VO2 Max / Sprint)",
        category: "VO2 Max" as const,
        minIntensity: 0.9,
        maxIntensity: 1.0,
        description:
          "Pengerahan daya neuromuskular maksimal, interval anaerobik intensitas puncak, dan kapasitas konsumsi oksigen tertinggi.",
        badgeBg: "bg-rose-500/10",
        badgeBorder: "border-rose-500/30",
        badgeText: "text-rose-400",
        barColor: "bg-rose-500",
      },
    ];

    const computedZones: HeartRateZoneDetail[] = zoneDefinitions.map((def) => {
      const minBpm = Math.round(calculatedHrr * def.minIntensity + currentRhr);
      const maxBpm = Math.round(calculatedHrr * def.maxIntensity + currentRhr);
      return {
        ...def,
        minBpm,
        maxBpm,
      };
    });

    setZones(computedZones);

    // Titik tengah zona utama untuk OutputBox highlight
    const z2 = computedZones[1];
    const z3 = computedZones[2];
    const z4 = computedZones[3];

    if (z2) setFatBurnMidpoint(Math.round((z2.minBpm + z2.maxBpm) / 2));
    if (z3) setAerobicMidpoint(Math.round((z3.minBpm + z3.maxBpm) / 2));
    if (z4) setAnaerobicMidpoint(Math.round((z4.minBpm + z4.maxBpm) / 2));
  }, [age, rhr, formula]);

  React.useEffect(() => {
    calculateKarvonen();
  }, [calculateKarvonen]);

  const handleReset = () => {
    setAge(30);
    setRhr(60);
    setFormula("fox");
  };

  const handleRhrPresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val) && val > 0) {
      setRhr(val);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Kolom Kiri: Parameter Input Form */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Fisiologis Detak Jantung
                </h2>
                <p className="text-secondary text-sm">
                  Konfigurasi usia dan denyut istirahat untuk kalkulasi Karvonen
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke nilai default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Grid Input Parameter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Usia Saat Ini (Tahun)"
              type="number"
              min={10}
              max={100}
              step={1}
              value={age ?? ""}
              onChange={(e) =>
                setAge(e.target.value === "" ? null : Number(e.target.value))
              }
              suffix="thn"
              placeholder="30"
              helperText="Rentang klinis: 10 - 100 Tahun"
            />

            <Input
              label="Resting Heart Rate / RHR (BPM)"
              type="number"
              min={30}
              max={140}
              step={1}
              value={rhr ?? ""}
              onChange={(e) =>
                setRhr(e.target.value === "" ? null : Number(e.target.value))
              }
              suffix="bpm"
              placeholder="60"
              helperText="Ukur saat bangun tidur di pagi hari"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Select
              label="Formula Detak Jantung Maksimal (Max HR)"
              value={formula ?? "fox"}
              onChange={(e) => setFormula(e.target.value)}
              helperText="Metode kalkulasi acuan standar industri"
            >
              <option value="fox">Fox & Haskell (220 - Usia) — Standar Populer</option>
              <option value="tanaka">Tanaka (208 - 0.7 × Usia) — Presisi Tinggi</option>
              <option value="gellish">Gellish (207 - 0.7 × Usia) — Standar Klinis</option>
            </Select>

            <Select
              label="Preset Kategori RHR (Detak Istirahat)"
              onChange={handleRhrPresetChange}
              value={
                (rhr ?? 60) <= 52
                  ? "50"
                  : (rhr ?? 60) <= 62
                  ? "60"
                  : (rhr ?? 60) <= 72
                  ? "70"
                  : (rhr ?? 60) <= 82
                  ? "80"
                  : "90"
              }
              helperText="Gunakan nilai acuan rata-rata kebugaran"
            >
              <option value="50">Atlet Terlatih / Sangat Bugar (45 - 55 bpm)</option>
              <option value="60">Kondisi Fisik Baik (56 - 65 bpm)</option>
              <option value="70">Rata-Rata Normal (66 - 75 bpm)</option>
              <option value="80">Cukup / Sedang (76 - 85 bpm)</option>
              <option value="90">Perlu Peningkatan Kebugaran (&gt; 85 bpm)</option>
            </Select>
          </div>

          <div className="pt-2">
            <Button
              onClick={calculateKarvonen}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Hitung Zona Latihan Presisi
            </Button>
          </div>
        </Card>

        {/* Technical Validation Card */}
        <Card className="bg-surface/50 border-border/60 text-secondary text-xs leading-relaxed flex items-start gap-3 p-4">
          <Info className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-primary block mb-0.5">
              Parameter Teknis Terkalibrasi (Metode Karvonen)
            </span>
            Rumus Karvonen mengintegrasikan <strong className="text-primary font-medium">Heart Rate Reserve (HRR)</strong> sehingga ambang batas zona latihan disesuaikan secara dinamis dengan tingkat kebugaran kardiovaskular individu, menghasilkan target detak jantung yang jauh lebih akurat dibandingkan kalkulasi persentase Max HR konvensional.
          </div>
        </Card>
      </div>

      {/* Kolom Kanan: Output Hasil Metrik & Zona Karvonen */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Hero Card: Max HR & HRR Overview */}
        <Card className="flex flex-col gap-4 p-6 bg-gradient-to-br from-surface to-elevated border-accent/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-secondary text-[13px] font-sans flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-accent" />
              Batas Detak Jantung Maksimal (Max HR)
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
              {formula.toUpperCase()}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-mono text-5xl md:text-6xl font-bold tracking-tight text-primary">
              {maxHr}
            </span>
            <span className="text-secondary text-lg font-medium font-sans">BPM</span>
          </div>

          <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
            <span className="text-secondary">Heart Rate Reserve (HRR):</span>
            <span className="font-mono font-semibold text-primary">
              {hrr} BPM <span className="text-secondary font-normal font-sans">({maxHr} - {rhr})</span>
            </span>
          </div>
        </Card>

        {/* 3 Output Boxes: Zona Fat Burn, Aerobik, Anaerobik */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <OutputBox
            label="Target Fat Burn (Zona 2)"
            value={fatBurnMidpoint}
            decimals={0}
            suffix=" bpm"
          />

          <OutputBox
            label="Target Aerobik (Zona 3)"
            value={aerobicMidpoint}
            decimals={0}
            suffix=" bpm"
          />

          <OutputBox
            label="Target Anaerobik (Zona 4)"
            value={anaerobicMidpoint}
            decimals={0}
            suffix=" bpm"
          />
        </div>

        {/* Matriks 5 Zona Detak Jantung Karvonen */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-accent" />
              Distribusi 5 Zona Latihan Karvonen
            </h3>
            <span className="text-xs text-secondary font-mono">
              RHR {rhr} | Max {maxHr}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {zones.map((zone) => (
              <div
                key={zone.zoneNumber}
                className={cn(
                  "p-3 rounded-xl border flex flex-col gap-1.5 transition-colors",
                  zone.badgeBg,
                  zone.badgeBorder
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded-md border",
                        zone.badgeBg,
                        zone.badgeBorder,
                        zone.badgeText
                      )}
                    >
                      Z{zone.zoneNumber} ({zone.minIntensity * 100}% - {zone.maxIntensity * 100}%)
                    </span>
                    <span className="text-xs font-semibold text-primary">
                      {zone.category}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-primary text-sm">
                      {zone.minBpm} - {zone.maxBpm}
                    </span>
                    <span className="text-[11px] text-secondary ml-1">BPM</span>
                  </div>
                </div>

                <p className="text-[11px] text-secondary leading-snug">
                  {zone.description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Real-time State Synchronization Badge */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <Zap className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            Data parameter tersinkronisasi <span className="text-primary font-medium">real-time</span> ke URL query parameters. Anda dapat menyalin URL peramban untuk menyimpan target detak jantung atau membagikannya ke pelatih kebugaran.
          </p>
        </div>
      </div>
    </div>
  );
}