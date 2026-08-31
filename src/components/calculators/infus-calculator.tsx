"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import { 
  Droplets, 
  RotateCcw, 
  Calculator, 
  Timer, 
  Activity, 
  ShieldCheck,
  Info
} from "lucide-react";
import { useQueryState, parseAsFloat, parseAsInteger } from "nuqs";

export function InfusCalculator() {
  // State Input (URL Synced via nuqs)
  const [volume, setVolume] = useQueryState("volume", parseAsFloat.withDefault(500));
  const [time, setTime] = useQueryState("time", parseAsFloat.withDefault(8));
  const [dropFactor, setDropFactor] = useQueryState("dropFactor", parseAsInteger.withDefault(20));

  // State Output
  const [tpm, setTpm] = React.useState<number>(21);
  const [exactTpm, setExactTpm] = React.useState<number>(20.83);
  const [flowRateMlPerHour, setFlowRateMlPerHour] = React.useState<number>(62.5);
  const [secondsPerDrop, setSecondsPerDrop] = React.useState<number>(2.88);
  const [totalDrops, setTotalDrops] = React.useState<number>(10000);

  const calculateInfusion = React.useCallback(() => {
    const vol = Math.max(0, volume || 0);
    const t = Math.max(0, time || 0);
    const df = Math.max(1, dropFactor || 20);

    if (vol === 0 || t === 0) {
      setTpm(0);
      setExactTpm(0);
      setFlowRateMlPerHour(0);
      setSecondsPerDrop(0);
      setTotalDrops(0);
      return;
    }

    // Formula Standar Medis TPM: (Volume (mL) * Faktor Tetes) / (Waktu (Jam) * 60)
    const totalMinutes = t * 60;
    const totalDropsCalculated = vol * df;
    const rawTpm = totalDropsCalculated / totalMinutes;
    const roundedTpm = Math.round(rawTpm);
    const flowRate = vol / t;
    const secPerDrop = rawTpm > 0 ? 60 / rawTpm : 0;

    setTpm(roundedTpm);
    setExactTpm(Number(rawTpm.toFixed(2)));
    setFlowRateMlPerHour(Number(flowRate.toFixed(1)));
    setSecondsPerDrop(Number(secPerDrop.toFixed(2)));
    setTotalDrops(Math.round(totalDropsCalculated));
  }, [volume, time, dropFactor]);

  // Kalkulasi real-time saat parameter URL atau input berubah
  React.useEffect(() => {
    calculateInfusion();
  }, [calculateInfusion]);

  const handleReset = () => {
    setVolume(null);
    setTime(null);
    setDropFactor(null);
  };

  const handlePresetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) return;

    const [v, t, df] = val.split("-").map(Number);
    if (!isNaN(v) && !isNaN(t) && !isNaN(df)) {
      setVolume(v);
      setTime(t);
      setDropFactor(df);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form Input Section */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">Parameter Klinis Terkalibrasi</h2>
                <p className="text-secondary text-sm">Konfigurasi volume cairan, durasi infus, dan faktor tetes set</p>
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
            <div className="sm:col-span-2">
              <Select
                label="Protokol Klinis Populer"
                onChange={handlePresetSelect}
                defaultValue=""
                helperText="Pilih skema standar infus rumah sakit atau konfigurasikan manual di bawah"
              >
                <option value="" disabled>-- Pilih Protokol / Resep Cairan --</option>
                <option value="500-8-20">Rumatan Dewasa Standar (500 mL / 8 Jam — Makro 20 gtt/mL)</option>
                <option value="500-12-20">Rumatan Lambat (500 mL / 12 Jam — Makro 20 gtt/mL)</option>
                <option value="500-24-20">Restriksi Cairan / Sangat Lambat (500 mL / 24 Jam — Makro 20 gtt/mL)</option>
                <option value="1000-24-20">Hidrasi Elektrolit 24 Jam (1000 mL / 24 Jam — Makro 20 gtt/mL)</option>
                <option value="500-4-15">Transfusi Darah (500 mL / 4 Jam — Makro Transfusi 15 gtt/mL)</option>
                <option value="100-1-60">Pediatrik / Titrasi Mikro (100 mL / 1 Jam — Mikro 60 mgtt/mL)</option>
                <option value="500-4-20">Rehidrasi Cepat (500 mL / 4 Jam — Makro 20 gtt/mL)</option>
              </Select>
            </div>

            <Input
              label="Total Volume Cairan"
              type="number"
              min={1}
              step={50}
              value={volume ?? ""}
              onChange={(e) => setVolume(e.target.value === "" ? null : Number(e.target.value))}
              suffix="mL"
              helperText="Volume cairan infus (misal: 500 mL atau 1000 mL)"
            />

            <Input
              label="Waktu / Durasi Pemberian"
              type="number"
              min={0.1}
              step={0.5}
              value={time ?? ""}
              onChange={(e) => setTime(e.target.value === "" ? null : Number(e.target.value))}
              suffix="Jam"
              helperText={`Setara dengan ${(time || 0) * 60} Menit`}
            />

            <div className="sm:col-span-2">
              <Select
                label="Faktor Tetes (Drop Factor)"
                value={dropFactor?.toString() || "20"}
                onChange={(e) => setDropFactor(Number(e.target.value))}
                helperText="Faktor tetes spesifik sesuai jenis selang infus (Infusion Set)"
              >
                <option value="20">Makro Dewasa (20 tetes/mL) — Standar Infus Otsuka/Terumo</option>
                <option value="15">Makro Transfusi (15 tetes/mL) — Blood Administration Set</option>
                <option value="60">Mikro Pediatrik (60 tetes/mL) — Microdrip / Buret / Anak</option>
              </Select>
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={calculateInfusion} className="w-full sm:w-auto flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Hitung Laju Tetes Presisi
            </Button>
          </div>
        </Card>

        {/* Clinical Note Card */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div className="text-xs text-secondary leading-relaxed">
            <span className="font-semibold text-primary block mb-0.5">Panduan Praktik Klinis:</span>
            Pemberian tetesan manual pada selang gravitasi dibulatkan ke bilangan bulat terdekat ({tpm} TPM). Gunakan parameter interval detik ({secondsPerDrop} detik/tetes) untuk mempermudah penghitungan tetesan dengan stopwatch.
          </div>
        </div>
      </div>

      {/* Output & Breakdown Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <OutputBox
          label="Kecepatan Aliran Tetesan Infus"
          value={tpm}
          suffix=" TPM"
        />

        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase">
              Rincian Parameter Teknis Medis
            </h3>
            <span className="flex items-center gap-1 text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20">
              <Activity className="w-3 h-3" />
              {exactTpm} gtt/min
            </span>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-secondary">Total Volume Cairan:</span>
              <span className="font-mono text-primary font-medium">{volume || 0} mL</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Durasi Terapi Infus:</span>
              <span className="font-mono text-primary font-medium">{time || 0} Jam ({(time || 0) * 60} Menit)</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Tipe Set & Faktor Tetes:</span>
              <span className="font-mono text-accent font-medium">{dropFactor || 20} gtt/mL</span>
            </div>

            <div className="flex justify-between items-center border-t border-border/50 pt-2">
              <span className="text-secondary">Laju Infusi Volumetrik:</span>
              <span className="font-mono text-emerald-400 font-semibold">{flowRateMlPerHour} mL/jam</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary flex items-center gap-1">
                <Timer className="w-3.5 h-3.5 text-secondary" />
                Interval Antar Tetesan:
              </span>
              <span className="font-mono text-emerald-400 font-semibold">1 tetes / {secondsPerDrop} detik</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Akumulasi Total Tetesan:</span>
              <span className="font-mono text-primary font-medium">{totalDrops.toLocaleString("id-ID")} Tetes</span>
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-center font-semibold">
              <span className="text-primary">Kecepatan Standar (Bulat):</span>
              <span className="font-mono text-accent text-lg">{tpm} Tetes / Menit</span>
            </div>
          </div>
        </Card>

        {/* Security & Clinical Safety Standard */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            Perhitungan mematuhi standar industri keperawatan dan pedoman pemberian terapi cairan intravena Kemenkes RI. Parameter teknis terkalibrasi secara presisi dan sinkron real-time ke URL query.
          </p>
        </div>
      </div>
    </div>
  );
}
