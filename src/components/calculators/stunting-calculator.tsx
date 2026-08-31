"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import { 
  Baby, 
  RotateCcw, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  TrendingUp,
  Info
} from "lucide-react";
import { useQueryState, parseAsString, parseAsInteger, parseAsFloat } from "nuqs";
import { cn } from "@/lib/utils";

// Referensi Standar Antropometri Pertumbuhan Anak WHO & Permenkes RI (TB/U atau PB/U Usia 0-60 Bulan)
// Format per bulan: [Median (M), Standar Deviasi (SD)]
const WHO_BOYS_DATA: Record<number, { median: number; sd: number }> = {
  0: { median: 49.9, sd: 1.9 },
  1: { median: 54.7, sd: 1.9 },
  2: { median: 58.4, sd: 2.0 },
  3: { median: 61.4, sd: 2.1 },
  4: { median: 63.9, sd: 2.2 },
  5: { median: 65.9, sd: 2.3 },
  6: { median: 67.6, sd: 2.3 },
  7: { median: 69.2, sd: 2.4 },
  8: { median: 70.6, sd: 2.4 },
  9: { median: 72.0, sd: 2.5 },
  10: { median: 73.3, sd: 2.5 },
  11: { median: 74.5, sd: 2.6 },
  12: { median: 75.7, sd: 2.6 },
  13: { median: 76.9, sd: 2.6 },
  14: { median: 78.0, sd: 2.7 },
  15: { median: 79.1, sd: 2.7 },
  16: { median: 80.2, sd: 2.7 },
  17: { median: 81.2, sd: 2.8 },
  18: { median: 82.3, sd: 2.8 },
  19: { median: 83.2, sd: 2.8 },
  20: { median: 84.2, sd: 2.9 },
  21: { median: 85.1, sd: 2.9 },
  22: { median: 86.0, sd: 3.0 },
  23: { median: 86.9, sd: 3.0 },
  24: { median: 87.8, sd: 3.1 },
  25: { median: 88.6, sd: 3.1 },
  26: { median: 89.4, sd: 3.2 },
  27: { median: 90.2, sd: 3.2 },
  28: { median: 91.0, sd: 3.3 },
  29: { median: 91.7, sd: 3.3 },
  30: { median: 92.5, sd: 3.4 },
  31: { median: 93.2, sd: 3.4 },
  32: { median: 93.9, sd: 3.4 },
  33: { median: 94.6, sd: 3.5 },
  34: { median: 95.3, sd: 3.5 },
  35: { median: 96.0, sd: 3.6 },
  36: { median: 96.6, sd: 3.6 },
  37: { median: 97.3, sd: 3.7 },
  38: { median: 97.9, sd: 3.7 },
  39: { median: 98.5, sd: 3.8 },
  40: { median: 99.1, sd: 3.8 },
  41: { median: 99.7, sd: 3.9 },
  42: { median: 100.3, sd: 3.9 },
  43: { median: 100.9, sd: 4.0 },
  44: { median: 101.5, sd: 4.0 },
  45: { median: 102.1, sd: 4.0 },
  46: { median: 102.7, sd: 4.1 },
  47: { median: 103.3, sd: 4.1 },
  48: { median: 103.9, sd: 4.2 },
  49: { median: 104.4, sd: 4.2 },
  50: { median: 105.0, sd: 4.2 },
  51: { median: 105.6, sd: 4.3 },
  52: { median: 106.1, sd: 4.3 },
  53: { median: 106.7, sd: 4.4 },
  54: { median: 107.2, sd: 4.4 },
  55: { median: 107.8, sd: 4.4 },
  56: { median: 108.3, sd: 4.5 },
  57: { median: 108.8, sd: 4.5 },
  58: { median: 109.4, sd: 4.6 },
  59: { median: 109.9, sd: 4.6 },
  60: { median: 110.4, sd: 4.6 },
};

const WHO_GIRLS_DATA: Record<number, { median: number; sd: number }> = {
  0: { median: 49.1, sd: 1.9 },
  1: { median: 53.7, sd: 1.9 },
  2: { median: 57.1, sd: 2.0 },
  3: { median: 59.8, sd: 2.0 },
  4: { median: 62.1, sd: 2.1 },
  5: { median: 64.0, sd: 2.2 },
  6: { median: 65.7, sd: 2.2 },
  7: { median: 67.3, sd: 2.3 },
  8: { median: 68.7, sd: 2.3 },
  9: { median: 70.1, sd: 2.4 },
  10: { median: 71.5, sd: 2.4 },
  11: { median: 72.8, sd: 2.5 },
  12: { median: 74.0, sd: 2.5 },
  13: { median: 75.2, sd: 2.6 },
  14: { median: 76.4, sd: 2.6 },
  15: { median: 77.5, sd: 2.7 },
  16: { median: 78.6, sd: 2.7 },
  17: { median: 79.7, sd: 2.8 },
  18: { median: 80.7, sd: 2.8 },
  19: { median: 81.7, sd: 2.9 },
  20: { median: 82.7, sd: 2.9 },
  21: { median: 83.7, sd: 3.0 },
  22: { median: 84.6, sd: 3.0 },
  23: { median: 85.5, sd: 3.1 },
  24: { median: 86.4, sd: 3.1 },
  25: { median: 87.2, sd: 3.2 },
  26: { median: 88.0, sd: 3.2 },
  27: { median: 88.8, sd: 3.3 },
  28: { median: 89.6, sd: 3.3 },
  29: { median: 90.4, sd: 3.4 },
  30: { median: 91.1, sd: 3.4 },
  31: { median: 91.8, sd: 3.5 },
  32: { median: 92.5, sd: 3.5 },
  33: { median: 93.2, sd: 3.6 },
  34: { median: 93.9, sd: 3.6 },
  35: { median: 94.6, sd: 3.7 },
  36: { median: 95.2, sd: 3.7 },
  37: { median: 95.9, sd: 3.8 },
  38: { median: 96.5, sd: 3.8 },
  39: { median: 97.2, sd: 3.9 },
  40: { median: 97.8, sd: 3.9 },
  41: { median: 98.4, sd: 4.0 },
  42: { median: 99.0, sd: 4.0 },
  43: { median: 99.6, sd: 4.1 },
  44: { median: 100.2, sd: 4.1 },
  45: { median: 100.8, sd: 4.2 },
  46: { median: 101.4, sd: 4.2 },
  47: { median: 102.0, sd: 4.3 },
  48: { median: 102.6, sd: 4.3 },
  49: { median: 103.2, sd: 4.4 },
  50: { median: 103.8, sd: 4.4 },
  51: { median: 104.3, sd: 4.4 },
  52: { median: 104.9, sd: 4.5 },
  53: { median: 105.4, sd: 4.5 },
  54: { median: 106.0, sd: 4.6 },
  55: { median: 106.5, sd: 4.6 },
  56: { median: 107.1, sd: 4.6 },
  57: { median: 107.6, sd: 4.7 },
  58: { median: 108.1, sd: 4.7 },
  59: { median: 108.7, sd: 4.8 },
  60: { median: 109.2, sd: 4.8 },
};

interface CalculationResult {
  zScore: number;
  status: "Normal" | "Stunting" | "Severely Stunting" | "Tinggi";
  statusDescription: string;
  statusColor: string;
  statusBg: string;
  statusBorder: string;
  icon: React.ReactNode;
  medianHeight: number;
  sdValue: number;
  minNormalHeight: number;
  maxNormalHeight: number;
  heightDiff: number;
}

export function StuntingCalculator() {
  // State Input (URL Synced via nuqs)
  const [gender, setGender] = useQueryState("gender", parseAsString.withDefault("laki"));
  const [age, setAge] = useQueryState("age", parseAsInteger.withDefault(12));
  const [height, setHeight] = useQueryState("height", parseAsFloat.withDefault(75.7));

  // State Output
  const [result, setResult] = React.useState<CalculationResult>({
    zScore: 0,
    status: "Normal",
    statusDescription: "Tinggi badan anak berada pada rentang ideal standar pertumbuhan WHO.",
    statusColor: "text-emerald-400",
    statusBg: "bg-emerald-500/10",
    statusBorder: "border-emerald-500/30",
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    medianHeight: 75.7,
    sdValue: 2.6,
    minNormalHeight: 70.5,
    maxNormalHeight: 80.9,
    heightDiff: 0,
  });

  const calculateZScore = React.useCallback(() => {
    const safeAge = Math.min(60, Math.max(0, age ?? 12));
    const safeHeight = Math.max(20, height ?? 75.7);
    const dataTable = gender === "perempuan" ? WHO_GIRLS_DATA : WHO_BOYS_DATA;
    const ref = dataTable[safeAge] || dataTable[12];

    // Formula Z-Score Antropometri Standar WHO: Z = (Tinggi Aktual - Median) / SD
    const calculatedZ = (safeHeight - ref.median) / ref.sd;
    const roundedZ = parseFloat(calculatedZ.toFixed(2));

    const minNormal = parseFloat((ref.median - 2 * ref.sd).toFixed(1));
    const maxNormal = parseFloat((ref.median + 2 * ref.sd).toFixed(1));
    const diff = parseFloat((safeHeight - ref.median).toFixed(1));

    // Klasifikasi Permenkes RI & WHO TB/U:
    // Z < -3.0 SD : Sangat Pendek (Severely Stunted)
    // -3.0 SD s/d < -2.0 SD : Pendek (Stunted)
    // -2.0 SD s/d +3.0 SD : Normal
    // > +3.0 SD : Tinggi (Tall)
    if (roundedZ < -3) {
      setResult({
        zScore: roundedZ,
        status: "Severely Stunting",
        statusDescription: "Tinggi badan anak berada di bawah -3 Standar Deviasi (Sangat Pendek). Memerlukan rujukan medis dan intervensi gizi intensif segera.",
        statusColor: "text-rose-400",
        statusBg: "bg-rose-500/10",
        statusBorder: "border-rose-500/30",
        icon: <AlertOctagon className="w-5 h-5 text-rose-400" />,
        medianHeight: ref.median,
        sdValue: ref.sd,
        minNormalHeight: minNormal,
        maxNormalHeight: maxNormal,
        heightDiff: diff,
      });
    } else if (roundedZ < -2) {
      setResult({
        zScore: roundedZ,
        status: "Stunting",
        statusDescription: "Tinggi badan anak berada antara -3 SD hingga < -2 SD (Pendek). Terindikasi stunting akibat defisit nutrisi kronis atau infeksi berulang.",
        statusColor: "text-amber-400",
        statusBg: "bg-amber-500/10",
        statusBorder: "border-amber-500/30",
        icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        medianHeight: ref.median,
        sdValue: ref.sd,
        minNormalHeight: minNormal,
        maxNormalHeight: maxNormal,
        heightDiff: diff,
      });
    } else if (roundedZ <= 3) {
      setResult({
        zScore: roundedZ,
        status: "Normal",
        statusDescription: "Tinggi badan anak berada dalam rentang standar deviasi normal (-2 SD s/d +3 SD). Pertumbuhan linier optimal sesuai kelompok usia.",
        statusColor: "text-emerald-400",
        statusBg: "bg-emerald-500/10",
        statusBorder: "border-emerald-500/30",
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        medianHeight: ref.median,
        sdValue: ref.sd,
        minNormalHeight: minNormal,
        maxNormalHeight: maxNormal,
        heightDiff: diff,
      });
    } else {
      setResult({
        zScore: roundedZ,
        status: "Tinggi",
        statusDescription: "Tinggi badan anak berada di atas +3 SD (Tinggi). Berada di atas rata-rata populasi sebayanya.",
        statusColor: "text-blue-400",
        statusBg: "bg-blue-500/10",
        statusBorder: "border-blue-500/30",
        icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
        medianHeight: ref.median,
        sdValue: ref.sd,
        minNormalHeight: minNormal,
        maxNormalHeight: maxNormal,
        heightDiff: diff,
      });
    }
  }, [gender, age, height]);

  // Kalkulasi otomatis saat terjadi perubahan input
  React.useEffect(() => {
    calculateZScore();
  }, [calculateZScore]);

  const handleReset = () => {
    setGender("laki");
    setAge(12);
    setHeight(75.7);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form Input Section */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Baby className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">Parameter Antropometri Balita</h2>
                <p className="text-secondary text-sm">Standar Baku Antropometri WHO & Permenkes RI (0 - 60 Bulan)</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke parameter awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Select
              label="Jenis Kelamin Anak"
              value={gender || "laki"}
              onChange={(e) => setGender(e.target.value)}
              helperText="Kurva pertumbuhan berbeda untuk laki-laki dan perempuan"
            >
              <option value="laki">Laki-laki (Boy)</option>
              <option value="perempuan">Perempuan (Girl)</option>
            </Select>

            <Input
              label="Usia Anak (Bulan)"
              type="number"
              min={0}
              max={60}
              step={1}
              value={age !== null ? age : ""}
              onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)}
              suffix="Bulan"
              helperText={`Rentang usia valid: 0 - 60 Bulan (${Math.floor((age || 0) / 12)} Thn ${(age || 0) % 12} Bln)`}
            />

            <div className="sm:col-span-2">
              <Input
                label="Panjang / Tinggi Badan Aktual"
                type="number"
                min={20}
                max={150}
                step={0.1}
                value={height !== null ? height : ""}
                onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                suffix="cm"
                helperText="Ukur telentang (PB) untuk usia <24 bulan, ukur berdiri (TB) untuk usia ≥24 bulan"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1 border-t border-border">
            <span className="text-xs text-secondary self-center mr-1">Preset Usia Cepat:</span>
            {[
              { label: "Lahir (0 bln)", ageVal: 0, hBoy: 49.9, hGirl: 49.1 },
              { label: "6 Bulan", ageVal: 6, hBoy: 67.6, hGirl: 65.7 },
              { label: "12 Bulan", ageVal: 12, hBoy: 75.7, hGirl: 74.0 },
              { label: "24 Bulan", ageVal: 24, hBoy: 87.8, hGirl: 86.4 },
              { label: "36 Bulan", ageVal: 36, hBoy: 96.6, hGirl: 95.2 },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setAge(p.ageVal);
                  setHeight(gender === "perempuan" ? p.hGirl : p.hBoy);
                }}
                className="text-xs px-2.5 py-1 rounded-md border border-border bg-base hover:bg-elevated text-secondary hover:text-primary transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <Button onClick={calculateZScore} className="w-full sm:w-auto flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Hitung Z-Score Presisi
            </Button>
          </div>
        </Card>
      </div>

      {/* Output & Breakdown Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <OutputBox
          label="Nilai Z-Score Antropometri (TB/U)"
          value={result.zScore}
          decimals={2}
          suffix=" SD"
        />

        {/* Status Card */}
        <div className={cn("p-5 rounded-2xl border flex flex-col gap-3 transition-all", result.statusBg, result.statusBorder)}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-base/50">
              {result.icon}
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-secondary">Status Pertumbuhan Linier</span>
              <h3 className={cn("text-lg font-bold font-display", result.statusColor)}>
                {result.status}
              </h3>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-secondary border-t border-border/50 pt-2">
            {result.statusDescription}
          </p>
        </div>

        {/* Detail Parameter Teknis */}
        <Card className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase border-b border-border pb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-accent" />
            Parameter Teknis WHO (Usia {age} Bulan)
          </h3>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-secondary">Jenis Kelamin:</span>
              <span className="font-mono text-primary font-medium capitalize">
                {gender === "perempuan" ? "Perempuan" : "Laki-laki"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Median Standar WHO (0 SD):</span>
              <span className="font-mono text-primary font-medium">{result.medianHeight} cm</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Rentang Normal (-2 s/d +2 SD):</span>
              <span className="font-mono text-emerald-400 font-medium">
                {result.minNormalHeight} - {result.maxNormalHeight} cm
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Batas Ambang Stunting (&lt; -2 SD):</span>
              <span className="font-mono text-rose-400 font-medium">&lt; {result.minNormalHeight} cm</span>
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-center font-semibold">
              <span className="text-primary">Deviasi dari Median:</span>
              <span className={cn("font-mono text-base", result.heightDiff >= 0 ? "text-emerald-400" : "text-amber-400")}>
                {result.heightDiff >= 0 ? `+${result.heightDiff}` : result.heightDiff} cm
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
