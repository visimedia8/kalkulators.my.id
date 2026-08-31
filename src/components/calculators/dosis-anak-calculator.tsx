"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Pill,
  Calculator,
  RefreshCw,
  Activity,
  HeartPulse,
  Scale,
  Ruler,
  Stethoscope,
  ShieldCheck,
  Info,
  Baby,
} from "lucide-react";
import { useQueryState, parseAsFloat } from "nuqs";

interface MedicationPreset {
  name: string;
  adultDose: number;
  description: string;
}

const MEDICATION_PRESETS: MedicationPreset[] = [
  { name: "Parasetamol (Analgesik / Antipiretik)", adultDose: 500, description: "Standar antipiretik dewasa 500 mg" },
  { name: "Amoksisilin (Antibiotik)", adultDose: 500, description: "Standar antibakteri lini pertama 500 mg" },
  { name: "Ibuprofen (Antiinflamasi NSAID)", adultDose: 400, description: "Standar antiinflamasi non-steroid 400 mg" },
  { name: "Cetirizine (Antihistamin)", adultDose: 10, description: "Standar antialergi generasi kedua 10 mg" },
  { name: "Eritromisin (Makrolida)", adultDose: 250, description: "Standar antibiotik makrolida 250 mg" },
  { name: "Azitromisin (Antibiotik)", adultDose: 500, description: "Standar makrolida dosis tunggal 500 mg" },
  { name: "Salbutamol (Bronkodilator)", adultDose: 4, description: "Standar terapi asma / bronkospasme 4 mg" },
  { name: "Deksametason (Kortikosteroid)", adultDose: 4, description: "Standar antiinflamasi poten 4 mg" },
];

export function DosisAnakCalculator() {
  // State Input terhubung ke URL Query Parameters via nuqs
  const [weight, setWeight] = useQueryState("weight", parseAsFloat.withDefault(16));
  const [height, setHeight] = useQueryState("height", parseAsFloat.withDefault(102));
  const [adultDose, setAdultDose] = useQueryState("adultDose", parseAsFloat.withDefault(500));

  // State Output Terhitung
  const [bsa, setBsa] = React.useState<number>(0);
  const [childDose, setChildDose] = React.useState<number>(0);
  const [ratioPercentage, setRatioPercentage] = React.useState<number>(0);

  // Kalkulasi Matematis Formula DuBois & Dosis Pediatri
  const calculateDose = React.useCallback(() => {
    const w = Math.max(0, weight || 0);
    const h = Math.max(0, height || 0);
    const dose = Math.max(0, adultDose || 0);

    if (w <= 0 || h <= 0) {
      setBsa(0);
      setChildDose(0);
      setRatioPercentage(0);
      return;
    }

    // Formula DuBois BSA = 0.007184 * Weight^0.425 * Height^0.725
    const calculatedBsa = 0.007184 * Math.pow(w, 0.425) * Math.pow(h, 0.725);
    
    // Dosis Anak = (BSA / 1.73) * Dosis Dewasa
    const standardAdultBsa = 1.73;
    const calculatedChildDose = (calculatedBsa / standardAdultBsa) * dose;
    const ratio = (calculatedBsa / standardAdultBsa) * 100;

    setBsa(Number(calculatedBsa.toFixed(4)));
    setChildDose(Number(calculatedChildDose.toFixed(2)));
    setRatioPercentage(Number(ratio.toFixed(1)));
  }, [weight, height, adultDose]);

  // Kalkulasi otomatis secara real-time saat parameter berubah
  React.useEffect(() => {
    calculateDose();
  }, [calculateDose]);

  const handleReset = () => {
    setWeight(null);
    setHeight(null);
    setAdultDose(null);
  };

  const handleMedicationSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val) && val > 0) {
      setAdultDose(val);
    }
  };

  const handlePresetProfile = (presetWeight: number, presetHeight: number) => {
    setWeight(presetWeight);
    setHeight(presetHeight);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Kolom Form Input */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Klinis Pediatri (BSA)
                </h2>
                <p className="text-secondary text-sm">
                  Kalkulasi presisi berbasis Formula DuBois standar industri medis
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke nilai acuan default"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Input Berat Badan */}
            <Input
              label="Berat Badan Pasien (Anak)"
              type="number"
              min={1}
              max={150}
              step={0.1}
              value={weight ?? ""}
              onChange={(e) => setWeight(e.target.value === "" ? null : Number(e.target.value))}
              suffix="kg"
              helperText="Rentang pengukuran: 1 - 150 kg"
            />

            {/* Input Tinggi Badan */}
            <Input
              label="Tinggi / Panjang Badan"
              type="number"
              min={30}
              max={220}
              step={0.5}
              value={height ?? ""}
              onChange={(e) => setHeight(e.target.value === "" ? null : Number(e.target.value))}
              suffix="cm"
              helperText="Rentang tinggi badan: 30 - 220 cm"
            />

            {/* Select Preset Obat Acuan */}
            <div className="sm:col-span-2">
              <Select
                label="Pilih Obat Referensi (Opsional)"
                onChange={handleMedicationSelect}
                defaultValue=""
                helperText="Pilih sediaan farmasi terstandarisasi untuk memuat dosis dewasa secara otomatis"
              >
                <option value="" disabled>
                  -- Pilih Daftar Obat Standar Industri --
                </option>
                {MEDICATION_PRESETS.map((med, idx) => (
                  <option key={idx} value={med.adultDose}>
                    {med.name} — Dosis Dewasa: {med.adultDose} mg
                  </option>
                ))}
              </Select>
            </div>

            {/* Input Dosis Dewasa */}
            <div className="sm:col-span-2">
              <Input
                label="Dosis Standar Dewasa (Adult Dose)"
                type="number"
                min={0.1}
                max={5000}
                step={1}
                value={adultDose ?? ""}
                onChange={(e) => setAdultDose(e.target.value === "" ? null : Number(e.target.value))}
                suffix="mg"
                helperText="Dosis terapi normal dewasa per kali pemberian (mg)"
              />
            </div>
          </div>

          {/* Preset Profil Pediatri Cepat */}
          <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
            <span className="text-xs font-medium text-secondary">
              Profil Antropometri Rujukan Cepat:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handlePresetProfile(10, 75)}
                className="px-2.5 py-1 text-xs rounded-md border border-border bg-base hover:bg-elevated text-secondary hover:text-primary transition-colors flex items-center gap-1"
              >
                <Baby className="w-3 h-3 text-accent" /> 1 Tahun (10 kg / 75 cm)
              </button>
              <button
                type="button"
                onClick={() => handlePresetProfile(14, 95)}
                className="px-2.5 py-1 text-xs rounded-md border border-border bg-base hover:bg-elevated text-secondary hover:text-primary transition-colors flex items-center gap-1"
              >
                <Baby className="w-3 h-3 text-accent" /> 3 Tahun (14 kg / 95 cm)
              </button>
              <button
                type="button"
                onClick={() => handlePresetProfile(18, 110)}
                className="px-2.5 py-1 text-xs rounded-md border border-border bg-base hover:bg-elevated text-secondary hover:text-primary transition-colors flex items-center gap-1"
              >
                <Baby className="w-3 h-3 text-accent" /> 5 Tahun (18 kg / 110 cm)
              </button>
              <button
                type="button"
                onClick={() => handlePresetProfile(26, 130)}
                className="px-2.5 py-1 text-xs rounded-md border border-border bg-base hover:bg-elevated text-secondary hover:text-primary transition-colors flex items-center gap-1"
              >
                <Baby className="w-3 h-3 text-accent" /> 8 Tahun (26 kg / 130 cm)
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={calculateDose} className="w-full sm:w-auto flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Hitung Dosis Anak Presisi
            </Button>
          </div>
        </Card>
      </div>

      {/* Kolom Output & Breakdown */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Output Utama */}
        <OutputBox
          label="Estimasi Dosis Obat Anak Presisi"
          value={childDose}
          decimals={1}
          suffix=" mg"
        />

        {/* Rincian Parameter Fisiologis */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase">
              Rincian Parameter Fisiologis
            </h3>
            <span className="flex items-center gap-1 text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20">
              <Activity className="w-3 h-3" />
              Formula DuBois
            </span>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-secondary flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-secondary/70" /> Berat Pasien:
              </span>
              <span className="font-mono text-primary font-medium">{weight || 0} kg</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-secondary/70" /> Tinggi Pasien:
              </span>
              <span className="font-mono text-primary font-medium">{height || 0} cm</span>
            </div>

            <div className="flex justify-between items-center border-t border-border/50 pt-2">
              <span className="text-secondary">Luas Permukaan Tubuh (BSA):</span>
              <span className="font-mono text-accent font-semibold">{bsa} m²</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">BSA Dewasa Rujukan:</span>
              <span className="font-mono text-primary font-medium">1.73 m²</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Rasio Dosis terhadap Dewasa:</span>
              <span className="font-mono text-emerald-400 font-medium">{ratioPercentage}%</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Dosis Dewasa Terapan:</span>
              <span className="font-mono text-primary font-medium">{adultDose || 0} mg</span>
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-center font-semibold">
              <span className="text-primary">Dosis Rekomendasi Anak:</span>
              <span className="font-mono text-accent text-lg">{childDose} mg</span>
            </div>
          </div>
        </Card>

        {/* Kartu Informasi Keamanan & Standar Medis */}
        <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-accent/10 text-accent shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex flex-col gap-1 text-xs">
              <span className="font-semibold text-primary">
                Standar Industri Farmakologi Pediatri
              </span>
              <p className="text-secondary leading-relaxed">
                Penentuan dosis berdasarkan Body Surface Area (BSA) menghasilkan tingkat akurasi
                fisiologis yang lebih tinggi dibanding rumus berbasis usia saja. Selalu lakukan
                verifikasi rentang terapeutik obat dan konsultasikan dengan dokter spesialis anak
                atau apoteker.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
