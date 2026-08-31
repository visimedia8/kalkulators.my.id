"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import { 
  Activity, 
  RotateCcw, 
  Calculator, 
  HeartPulse, 
  ShieldCheck,
  Info,
  Beaker
} from "lucide-react";
import { useQueryState, parseAsFloat, parseAsInteger, parseAsString } from "nuqs";

export function GfrCalculator() {
  // State Input (URL Synced via nuqs)
  const [age, setAge] = useQueryState("age", parseAsInteger.withDefault(45));
  const [gender, setGender] = useQueryState("gender", parseAsString.withDefault("female"));
  const [scr, setScr] = useQueryState("scr", parseAsFloat.withDefault(1.2));
  const [race, setRace] = useQueryState("race", parseAsString.withDefault("non-black"));

  // State Output
  const [gfrCkdEpi, setGfrCkdEpi] = React.useState<number>(0);
  const [gfrMdrd, setGfrMdrd] = React.useState<number>(0);
  const [ckdStage, setCkdStage] = React.useState<string>("Normal");
  const [stageDesc, setStageDesc] = React.useState<string>("");

  const calculateGfr = React.useCallback(() => {
    const a = Math.max(18, age || 45); // Valid minimal usia 18
    const s = Math.max(0.1, scr || 1.2);
    const isFemale = gender === "female";
    const isBlack = race === "black";

    // 1. Kalkulasi CKD-EPI 2009 (Formula Rekomendasi Klinis Modern)
    let kappa = isFemale ? 0.7 : 0.9;
    let alpha = isFemale ? -0.329 : -0.411;
    let minScrKappa = Math.min(s / kappa, 1);
    let maxScrKappa = Math.max(s / kappa, 1);

    let ckdEpi = 141 * 
      Math.pow(minScrKappa, alpha) * 
      Math.pow(maxScrKappa, -1.209) * 
      Math.pow(0.993, a);

    if (isFemale) ckdEpi *= 1.018;
    if (isBlack) ckdEpi *= 1.159;

    // 2. Kalkulasi MDRD (Formula Klasik)
    let mdrd = 175 * Math.pow(s, -1.154) * Math.pow(a, -0.203);
    if (isFemale) mdrd *= 0.742;
    if (isBlack) mdrd *= 1.212;

    const finalCkdEpi = Number(ckdEpi.toFixed(1));
    setGfrCkdEpi(finalCkdEpi);
    setGfrMdrd(Number(mdrd.toFixed(1)));

    // Klasifikasi Stadium CKD (Chronic Kidney Disease)
    if (finalCkdEpi >= 90) {
      setCkdStage("Stadium 1 / Normal");
      setStageDesc("Fungsi ginjal normal atau tinggi. Pantau faktor risiko jika terdapat albuminuria.");
    } else if (finalCkdEpi >= 60) {
      setCkdStage("Stadium 2");
      setStageDesc("Penurunan ringan fungsi ginjal (Mildly decreased).");
    } else if (finalCkdEpi >= 45) {
      setCkdStage("Stadium 3a");
      setStageDesc("Penurunan ringan hingga sedang fungsi ginjal (Mild to moderate).");
    } else if (finalCkdEpi >= 30) {
      setCkdStage("Stadium 3b");
      setStageDesc("Penurunan sedang hingga berat fungsi ginjal (Moderate to severe).");
    } else if (finalCkdEpi >= 15) {
      setCkdStage("Stadium 4");
      setStageDesc("Penurunan fungsi ginjal parah (Severely decreased). Persiapan terapi pengganti ginjal.");
    } else {
      setCkdStage("Stadium 5 (Gagal Ginjal)");
      setStageDesc("Gagal ginjal kronis (Kidney failure). Indikasi dialisis / transplantasi.");
    }

  }, [age, gender, scr, race]);

  // Kalkulasi otomatis secara real-time
  React.useEffect(() => {
    calculateGfr();
  }, [calculateGfr]);

  const handleReset = () => {
    setAge(45);
    setGender("female");
    setScr(1.2);
    setRace("non-black");
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form Input Section */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Beaker className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">Parameter Fisiologis Ginjal</h2>
                <p className="text-secondary text-sm">Standar kalibrasi serum kreatinin & antropometri</p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Usia Pasien"
              type="number"
              min={18}
              max={120}
              step={1}
              value={age ?? ""}
              onChange={(e) => setAge(e.target.value === "" ? null : Number(e.target.value))}
              suffix="Tahun"
              helperText="Formula CKD-EPI divalidasi untuk dewasa (≥18 tahun)"
            />

            <Input
              label="Serum Kreatinin (sCr)"
              type="number"
              min={0.1}
              max={20}
              step={0.1}
              value={scr ?? ""}
              onChange={(e) => setScr(e.target.value === "" ? null : Number(e.target.value))}
              suffix="mg/dL"
              helperText="Uji laboratorium terkalibrasi IDMS"
            />

            <Select
              label="Jenis Kelamin Biologis"
              value={gender || "female"}
              onChange={(e) => setGender(e.target.value)}
              helperText="Faktor koreksi massa otot fisiologis"
            >
              <option value="male">Laki-laki (Male)</option>
              <option value="female">Perempuan (Female)</option>
            </Select>

            <Select
              label="Ras / Etnis (Klasik)"
              value={race || "non-black"}
              onChange={(e) => setRace(e.target.value)}
              helperText="Parameter historis dalam formula MDRD/CKD-EPI 2009"
            >
              <option value="non-black">Bukan Afrika-Amerika</option>
              <option value="black">Afrika-Amerika (Black)</option>
            </Select>
          </div>

          <div className="pt-2">
            <Button onClick={calculateGfr} className="w-full sm:w-auto flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Kalkulasi Laju Filtrasi (eGFR)
            </Button>
          </div>
        </Card>

        {/* Clinical Note */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            <span className="font-semibold text-primary block mb-0.5">Catatan Klinis:</span>
            Estimasi GFR (eGFR) berbasis formula <span className="font-mono text-[10px] bg-elevated px-1 py-0.5 rounded border border-border">CKD-EPI 2009</span> merupakan standar emas industri nefrologi saat ini. Formula ini dinilai lebih akurat dari MDRD, terutama pada rentang GFR ≥60 mL/min/1.73m².
          </p>
        </div>
      </div>

      {/* Output & Breakdown Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <OutputBox
          label="Estimasi Laju Filtrasi Glomerulus (CKD-EPI)"
          value={gfrCkdEpi}
          decimals={1}
          suffix=" mL/min"
        />

        {/* Status Card */}
        <div className="p-5 rounded-2xl border flex flex-col gap-3 transition-all bg-accent/5 border-accent/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-base/50">
              <HeartPulse className="w-5 h-5 text-accent" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-secondary">Klasifikasi KDIGO</span>
              <h3 className="text-lg font-bold font-display text-primary">
                {ckdStage}
              </h3>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-secondary border-t border-border/50 pt-2">
            {stageDesc}
          </p>
        </div>

        {/* Detail Parameter Teknis */}
        <Card className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase border-b border-border pb-2 flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent" />
            Komparasi Model Matematika
          </h3>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-secondary">Usia Pasien:</span>
              <span className="font-mono text-primary font-medium">{age || 0} thn</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Serum Kreatinin:</span>
              <span className="font-mono text-primary font-medium">{scr || 0} mg/dL</span>
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-center">
              <span className="text-secondary">Model MDRD (Klasik):</span>
              <span className="font-mono text-secondary font-medium">{gfrMdrd} mL/min/1.73m²</span>
            </div>

            <div className="flex justify-between items-center font-semibold">
              <span className="text-primary">Model CKD-EPI (Modern):</span>
              <span className="font-mono text-accent text-base">{gfrCkdEpi} mL/min/1.73m²</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
