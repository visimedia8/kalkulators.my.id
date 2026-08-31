"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Wheat,
  RotateCcw,
  Calculator,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useQueryState, parseAsFloat, parseAsInteger, parseAsString } from "nuqs";

export function FcrCalculator() {
  // State Input (URL Synced via nuqs)
  const [totalPakan, setTotalPakan] = useQueryState(
    "totalPakan",
    parseAsFloat.withDefault(3150)
  );
  const [beratAwal, setBeratAwal] = useQueryState(
    "beratAwal",
    parseAsFloat.withDefault(0.045)
  );
  const [beratAkhir, setBeratAkhir] = useQueryState(
    "beratAkhir",
    parseAsFloat.withDefault(2.1)
  );
  const [jumlahTernak, setJumlahTernak] = useQueryState(
    "jumlahTernak",
    parseAsInteger.withDefault(1000)
  );
  const [mode, setMode] = useQueryState(
    "mode",
    parseAsString.withDefault("per-ekor")
  );
  const [tipeTernak, setTipeTernak] = useQueryState(
    "tipe",
    parseAsString.withDefault("broiler")
  );

  // State Output
  const [fcr, setFcr] = React.useState<number>(0);
  const [totalBobotAwal, setTotalBobotAwal] = React.useState<number>(0);
  const [totalBobotAkhir, setTotalBobotAkhir] = React.useState<number>(0);
  const [pertambahanBobot, setPertambahanBobot] = React.useState<number>(0);
  const [feedIntakePerEkor, setFeedIntakePerEkor] = React.useState<number>(0);
  const [feedEfficiency, setFeedEfficiency] = React.useState<number>(0);
  const [efficiencyRating, setEfficiencyRating] = React.useState<string>("Optimal");

  const calculateFcr = React.useCallback(() => {
    const pakan = Math.max(0, totalPakan || 0);
    const bAwal = Math.max(0, beratAwal || 0);
    const bAkhir = Math.max(0, beratAkhir || 0);
    const ternak = Math.max(1, jumlahTernak || 1);

    let calculatedTotalAwal = 0;
    let calculatedTotalAkhir = 0;

    if (mode === "per-ekor") {
      calculatedTotalAwal = bAwal * ternak;
      calculatedTotalAkhir = bAkhir * ternak;
    } else {
      calculatedTotalAwal = bAwal;
      calculatedTotalAkhir = bAkhir;
    }

    const gain = Math.max(0, calculatedTotalAkhir - calculatedTotalAwal);
    const calculatedFcr = gain > 0 ? pakan / gain : 0;
    const intake = ternak > 0 ? pakan / ternak : 0;
    const efficiency = calculatedFcr > 0 ? (1 / calculatedFcr) * 100 : 0;

    setTotalBobotAwal(Number(calculatedTotalAwal.toFixed(2)));
    setTotalBobotAkhir(Number(calculatedTotalAkhir.toFixed(2)));
    setPertambahanBobot(Number(gain.toFixed(2)));
    setFeedIntakePerEkor(Number(intake.toFixed(3)));
    setFeedEfficiency(Number(efficiency.toFixed(2)));
    setFcr(Number(calculatedFcr.toFixed(3)));

    // Evaluasi Efisiensi berdasarkan Standar Industri
    if (calculatedFcr <= 0) {
      setEfficiencyRating("Parameter Belum Lengkap");
    } else if (tipeTernak === "broiler") {
      if (calculatedFcr <= 1.45) {
        setEfficiencyRating("Sangat Efisien (Super Optimal)");
      } else if (calculatedFcr <= 1.65) {
        setEfficiencyRating("Efisien (Standar Industri)");
      } else if (calculatedFcr <= 1.85) {
        setEfficiencyRating("Perlu Evaluasi (Sub-Optimal)");
      } else {
        setEfficiencyRating("Boros Pakan (Inefisien)");
      }
    } else if (tipeTernak === "akuakultur") {
      if (calculatedFcr <= 1.2) {
        setEfficiencyRating("Sangat Efisien (Super Optimal)");
      } else if (calculatedFcr <= 1.5) {
        setEfficiencyRating("Efisien (Standar Industri)");
      } else {
        setEfficiencyRating("Boros Pakan (Inefisien)");
      }
    } else if (tipeTernak === "ruminansia") {
      if (calculatedFcr <= 6.5) {
        setEfficiencyRating("Sangat Efisien (Super Optimal)");
      } else if (calculatedFcr <= 8.5) {
        setEfficiencyRating("Efisien (Standar Industri)");
      } else {
        setEfficiencyRating("Perlu Evaluasi Ransum");
      }
    } else {
      if (calculatedFcr <= 2.0) {
        setEfficiencyRating("Sangat Efisien");
      } else {
        setEfficiencyRating("Standar Pemeliharaan");
      }
    }
  }, [totalPakan, beratAwal, beratAkhir, jumlahTernak, mode, tipeTernak]);

  React.useEffect(() => {
    calculateFcr();
  }, [calculateFcr]);

  const handleReset = () => {
    setTotalPakan(3150);
    setBeratAwal(0.045);
    setBeratAkhir(2.1);
    setJumlahTernak(1000);
    setMode("per-ekor");
    setTipeTernak("broiler");
  };

  const handlePresetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setTipeTernak(val);

    if (val === "broiler") {
      setMode("per-ekor");
      setJumlahTernak(1000);
      setBeratAwal(0.045);
      setBeratAkhir(2.1);
      setTotalPakan(3150);
    } else if (val === "layer") {
      setMode("per-ekor");
      setJumlahTernak(1000);
      setBeratAwal(0.04);
      setBeratAkhir(1.85);
      setTotalPakan(4200);
    } else if (val === "akuakultur") {
      setMode("total");
      setJumlahTernak(5000);
      setBeratAwal(50);
      setBeratAkhir(650);
      setTotalPakan(720);
    } else if (val === "udang") {
      setMode("total");
      setJumlahTernak(100000);
      setBeratAwal(2);
      setBeratAkhir(1800);
      setTotalPakan(2200);
    } else if (val === "ruminansia") {
      setMode("per-ekor");
      setJumlahTernak(20);
      setBeratAwal(250);
      setBeratAkhir(400);
      setTotalPakan(21000);
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
                <Wheat className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Teknis Konversi Pakan (FCR)
                </h2>
                <p className="text-secondary text-sm">
                  Kalkulasi presisi efisiensi pakan ternak sesuai standar industri agribisnis
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke nilai standar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Select
              label="Preset Komoditas Peternakan"
              value={tipeTernak || "broiler"}
              onChange={handlePresetSelect}
              helperText="Konfigurasi awal berbasis standar industri"
            >
              <option value="broiler">Ayam Pedaging (Broiler)</option>
              <option value="layer">Ayam Petelur (Pullet/Layer)</option>
              <option value="akuakultur">Ikan Air Tawar (Lele/Nila/Patin)</option>
              <option value="udang">Udang Vaname (Tambak Intensif)</option>
              <option value="ruminansia">Sapi Potong / Kambing (Feedlot)</option>
            </Select>

            <Select
              label="Metode Input Bobot Ternak"
              value={mode || "per-ekor"}
              onChange={(e) => setMode(e.target.value)}
              helperText="Pilih format data penimbangan di kandang/kolam"
            >
              <option value="per-ekor">Rata-rata per Ekor (kg/ekor)</option>
              <option value="total">Total Bobot Populasi (kg total)</option>
            </Select>

            <Input
              label="Total Konsumsi Pakan"
              type="number"
              min={0}
              step={0.1}
              value={totalPakan ?? ""}
              onChange={(e) =>
                setTotalPakan(e.target.value === "" ? null : Number(e.target.value))
              }
              suffix="kg"
              helperText="Akumulasi pakan habis selama masa pemeliharaan"
            />

            <Input
              label="Jumlah Populasi Ternak"
              type="number"
              min={1}
              step={1}
              value={jumlahTernak ?? ""}
              onChange={(e) =>
                setJumlahTernak(e.target.value === "" ? null : Number(e.target.value))
              }
              suffix="ekor"
              helperText="Jumlah populasi hidup atau terpanen"
            />

            <Input
              label={
                mode === "per-ekor"
                  ? "Bobot Awal per Ekor (DOC/Bibit)"
                  : "Total Bobot Awal Populasi"
              }
              type="number"
              min={0}
              step={0.001}
              value={beratAwal ?? ""}
              onChange={(e) =>
                setBeratAwal(e.target.value === "" ? null : Number(e.target.value))
              }
              suffix="kg"
              helperText={
                mode === "per-ekor"
                  ? "Bobot rata-rata saat tebar (cth: DOC broiler 0.045 kg)"
                  : "Total timbangan awal bibit/ternak yang ditebar"
              }
            />

            <Input
              label={
                mode === "per-ekor"
                  ? "Bobot Akhir per Ekor (Panen)"
                  : "Total Bobot Akhir Panen"
              }
              type="number"
              min={0}
              step={0.01}
              value={beratAkhir ?? ""}
              onChange={(e) =>
                setBeratAkhir(e.target.value === "" ? null : Number(e.target.value))
              }
              suffix="kg"
              helperText={
                mode === "per-ekor"
                  ? "Bobot rata-rata saat panen/evaluasi"
                  : "Total tonase/timbangan akhir saat panen"
              }
            />
          </div>

          <div className="pt-2">
            <Button
              onClick={calculateFcr}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Hitung Nilai FCR Presisi
            </Button>
          </div>
        </Card>
      </div>

      {/* Output & Breakdown Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <OutputBox
          label="Feed Conversion Ratio (FCR)"
          value={fcr}
          decimals={3}
          suffix=""
        />

        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase">
              Audit Performa Biologis & Pakan
            </h3>
            <span
              className={`flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-md border ${
                efficiencyRating.includes("Sangat") || efficiencyRating.includes("Efisien")
                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                  : "text-amber-400 bg-amber-500/10 border-amber-500/20"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              {efficiencyRating}
            </span>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-secondary">Total Konsumsi Pakan:</span>
              <span className="font-mono text-primary font-medium">
                {totalPakan?.toLocaleString("id-ID") ?? 0} kg
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Total Biomassa Awal:</span>
              <span className="font-mono text-primary font-medium">
                {totalBobotAwal.toLocaleString("id-ID")} kg
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Total Biomassa Akhir:</span>
              <span className="font-mono text-primary font-medium">
                {totalBobotAkhir.toLocaleString("id-ID")} kg
              </span>
            </div>

            <div className="flex justify-between items-center border-t border-border/50 pt-2">
              <span className="text-secondary font-medium">
                Pertambahan Bobot Total (Gain):
              </span>
              <span className="font-mono text-emerald-400 font-semibold">
                +{pertambahanBobot.toLocaleString("id-ID")} kg
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Rata-rata Konsumsi per Ekor:</span>
              <span className="font-mono text-primary font-medium">
                {feedIntakePerEkor.toLocaleString("id-ID", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 3,
                })}{" "}
                kg/ekor
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Efisiensi Pakan (FE):</span>
              <span className="font-mono text-accent font-medium">
                {feedEfficiency.toLocaleString("id-ID", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 2,
                })}
                %
              </span>
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-center font-semibold">
              <span className="text-primary">Indeks FCR Akhir:</span>
              <span className="font-mono text-accent text-lg">{fcr.toFixed(3)}</span>
            </div>
          </div>
        </Card>

        {/* Security & Industry Badge */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            Perhitungan mematuhi standar industri peternakan komersial dan akuakultur modern.
            Data parameter teknis dikalkulasi secara presisi dan terhubung real-time ke query URL.
          </p>
        </div>
      </div>
    </div>
  );
}