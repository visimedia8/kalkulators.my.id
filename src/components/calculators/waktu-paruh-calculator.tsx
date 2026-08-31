"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Atom,
  Timer,
  RefreshCw,
  Calculator,
  ShieldAlert,
  Sparkles,
  Layers,
  CheckCircle2,
  TrendingDown,
  Info,
  Clock,
  Activity,
  Award,
} from "lucide-react";
import { useQueryState, parseAsFloat, parseAsString } from "nuqs";

interface IsotopePreset {
  name: string;
  symbol: string;
  halfLife: number;
  unit: string;
  category: string;
}

const ISOTOPE_PRESETS: IsotopePreset[] = [
  {
    name: "Karbon-14",
    symbol: "¹⁴C",
    halfLife: 5730,
    unit: "tahun",
    category: "Radiokarbon / Arkeologi",
  },
  {
    name: "Iodium-131",
    symbol: "¹³¹I",
    halfLife: 8.02,
    unit: "hari",
    category: "Kedokteran Nuklir",
  },
  {
    name: "Sesium-137",
    symbol: "¹³⁷Cs",
    halfLife: 30.17,
    unit: "tahun",
    category: "Fisika Radiasi Industri",
  },
  {
    name: "Kobalt-60",
    symbol: "⁶⁰Co",
    halfLife: 5.27,
    unit: "tahun",
    category: "Radioterapi & Sterilisasi",
  },
  {
    name: "Teknesium-99m",
    symbol: "⁹⁹ᵐTc",
    halfLife: 6.01,
    unit: "jam",
    category: "Diagnostik SPECT Medis",
  },
  {
    name: "Radon-222",
    symbol: "²²²Rn",
    halfLife: 3.82,
    unit: "hari",
    category: "Geofisika Lingkungan",
  },
];

export function WaktuParuhCalculator() {
  // State Input terhubung ke URL Query Parameters via nuqs
  const [massaAwal, setMassaAwal] = useQueryState("massaAwal", parseAsFloat.withDefault(100));
  const [waktuParuh, setWaktuParuh] = useQueryState("waktuParuh", parseAsFloat.withDefault(5730));
  const [waktuBerlalu, setWaktuBerlalu] = useQueryState("waktuBerlalu", parseAsFloat.withDefault(11460));
  const [satuanWaktu, setSatuanWaktu] = useQueryState("satuanWaktu", parseAsString.withDefault("tahun"));
  const [satuanMassa, setSatuanMassa] = useQueryState("satuanMassa", parseAsString.withDefault("gram"));

  // State Output Terhitung
  const [massaAkhir, setMassaAkhir] = React.useState<number>(0);
  const [massaMeluruh, setMassaMeluruh] = React.useState<number>(0);
  const [persentaseSisa, setPersentaseSisa] = React.useState<number>(0);
  const [jumlahParuh, setJumlahParuh] = React.useState<number>(0);
  const [konstantaPeluruhan, setKonstantaPeluruhan] = React.useState<number>(0);
  const [umurRataRata, setUmurRataRata] = React.useState<number>(0);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Kalkulasi Matematis Eksponensial Peluruhan Waktu Paruh
  const calculateHalfLife = React.useCallback(() => {
    // Validasi parameter teknis
    if (massaAwal === null || waktuParuh === null || waktuBerlalu === null) {
      setErrorMessage("Semua parameter teknis wajib diisi.");
      setMassaAkhir(0);
      setMassaMeluruh(0);
      setPersentaseSisa(0);
      setJumlahParuh(0);
      setKonstantaPeluruhan(0);
      setUmurRataRata(0);
      return;
    }

    if (massaAwal <= 0) {
      setErrorMessage("Massa / kuantitas awal (N0) harus lebih besar dari 0.");
      return;
    }

    if (waktuParuh <= 0) {
      setErrorMessage("Waktu paruh (t1/2) harus lebih besar dari 0.");
      return;
    }

    if (waktuBerlalu < 0) {
      setErrorMessage("Waktu peluruhan yang berlalu (t) tidak boleh bernilai negatif.");
      return;
    }

    setErrorMessage(null);

    // Formula Standar: Nt = N0 * (0.5)^(t / t1/2)
    const n = waktuBerlalu / waktuParuh;
    const nt = massaAwal * Math.pow(0.5, n);
    const decayed = massaAwal - nt;
    const remainingPct = (nt / massaAwal) * 100;
    
    // Konstanta Peluruhan (lambda) = ln(2) / t1/2
    const lambda = Math.LN2 / waktuParuh;
    // Umur Rata-Rata (tau) = 1 / lambda = t1/2 / ln(2)
    const tau = waktuParuh / Math.LN2;

    setMassaAkhir(parseFloat(nt.toFixed(4)));
    setMassaMeluruh(parseFloat(decayed.toFixed(4)));
    setPersentaseSisa(parseFloat(remainingPct.toFixed(2)));
    setJumlahParuh(parseFloat(n.toFixed(4)));
    setKonstantaPeluruhan(parseFloat(lambda.toExponential(4)));
    setUmurRataRata(parseFloat(tau.toFixed(2)));
  }, [massaAwal, waktuParuh, waktuBerlalu]);

  // Kalkulasi otomatis secara real-time saat parameter berubah
  React.useEffect(() => {
    calculateHalfLife();
  }, [calculateHalfLife]);

  const handleReset = () => {
    setMassaAwal(100);
    setWaktuParuh(5730);
    setWaktuBerlalu(11460);
    setSatuanWaktu("tahun");
    setSatuanMassa("gram");
    setErrorMessage(null);
  };

  const handlePresetSelect = (preset: IsotopePreset) => {
    setWaktuParuh(preset.halfLife);
    setSatuanWaktu(preset.unit);
    // Set default waktu berlalu menjadi 2 siklus waktu paruh untuk observasi presisi
    setWaktuBerlalu(preset.halfLife * 2);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Kolom Form Input */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Atom className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Peluruhan Radioaktif
                </h2>
                <p className="text-secondary text-sm">
                  Kalkulasi kinetika peluruhan inti atom presisi: Nt = N0 × (0.5)^(t / t½)
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset parameter teknis ke nilai default"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Preset Radioisotop Terstandarisasi */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-medium text-secondary">
              Preset Radioisotop Acuan Standar Industri & Laboratorium:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ISOTOPE_PRESETS.map((isotope, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetSelect(isotope)}
                  className="flex flex-col items-start p-2.5 rounded-lg border border-border bg-base hover:border-accent hover:bg-elevated transition-colors text-left group"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-semibold text-primary group-hover:text-accent">
                      {isotope.name}
                    </span>
                    <span className="text-[10px] font-mono text-secondary bg-surface px-1.5 py-0.5 rounded border border-border">
                      {isotope.symbol}
                    </span>
                  </div>
                  <span className="text-[11px] text-secondary font-mono mt-0.5">
                    t½: {isotope.halfLife} {isotope.unit}
                  </span>
                  <span className="text-[10px] text-secondary/70 truncate w-full mt-0.5">
                    {isotope.category}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid Input Parameter Teknis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            {/* Input Massa Awal (N0) */}
            <div className="grid grid-cols-3 gap-2 sm:col-span-2">
              <div className="col-span-2">
                <Input
                  label="Massa / Kuantitas Awal (N0)"
                  type="number"
                  min={0.000001}
                  step={0.1}
                  value={massaAwal ?? ""}
                  onChange={(e) =>
                    setMassaAwal(e.target.value === "" ? null : Number(e.target.value))
                  }
                  helperText="Kuantitas zat radioaktif sebelum peluruhan dimulai"
                  error={Boolean(errorMessage && (massaAwal === null || massaAwal <= 0))}
                />
              </div>
              <div className="col-span-1">
                <Select
                  label="Satuan"
                  value={satuanMassa || "gram"}
                  onChange={(e) => setSatuanMassa(e.target.value)}
                >
                  <option value="gram">gram (g)</option>
                  <option value="mg">mg</option>
                  <option value="kg">kg</option>
                  <option value="Bq">Becquerel (Bq)</option>
                  <option value="Ci">Curie (Ci)</option>
                  <option value="mol">mol</option>
                </Select>
              </div>
            </div>

            {/* Input Waktu Paruh (t1/2) */}
            <Input
              label="Waktu Paruh (t½)"
              type="number"
              min={0.000001}
              step={0.01}
              value={waktuParuh ?? ""}
              onChange={(e) =>
                setWaktuParuh(e.target.value === "" ? null : Number(e.target.value))
              }
              suffix={satuanWaktu || "tahun"}
              helperText="Durasi hingga separuh zat meluruh"
              error={Boolean(errorMessage && (waktuParuh === null || waktuParuh <= 0))}
            />

            {/* Input Waktu Berlalu (t) */}
            <Input
              label="Lama Waktu Peluruhan (t)"
              type="number"
              min={0}
              step={0.1}
              value={waktuBerlalu ?? ""}
              onChange={(e) =>
                setWaktuBerlalu(e.target.value === "" ? null : Number(e.target.value))
              }
              suffix={satuanWaktu || "tahun"}
              helperText="Total waktu pengamatan / peluruhan berjalan"
              error={Boolean(errorMessage && (waktuBerlalu === null || waktuBerlalu < 0))}
            />

            {/* Select Pilihan Satuan Waktu Terpadu */}
            <div className="sm:col-span-2">
              <Select
                label="Dimensi Satuan Waktu (t & t½)"
                value={satuanWaktu || "tahun"}
                onChange={(e) => setSatuanWaktu(e.target.value)}
                helperText="Pastikan satuan waktu paruh (t½) dan waktu berlalu (t) sinkron"
              >
                <option value="tahun">Tahun (yr)</option>
                <option value="hari">Hari (days)</option>
                <option value="jam">Jam (hours)</option>
                <option value="menit">Menit (minutes)</option>
                <option value="detik">Detik (seconds)</option>
              </Select>
            </div>
          </div>

          {/* Pesan Kesalahan Validasi */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl border border-danger/30 bg-danger/5 flex items-start gap-2.5 text-danger text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="pt-2">
            <Button onClick={calculateHalfLife} className="w-full sm:w-auto flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Hitung Peluruhan Presisi
            </Button>
          </div>
        </Card>

        {/* Informasi Protokol Keamanan & Fisika Radiasi */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div className="text-xs text-secondary leading-relaxed space-y-1">
            <span className="font-semibold text-primary block">
              Prinsip Kinetika Orde Pertama (Fisika Nuklir):
            </span>
            <p>
              Peluruhan radioaktif mengikuti hukum kinetika orde pertama eksponensial murni di mana
              laju disintegrasi nuklir berbanding lurus dengan jumlah inti radioaktif yang ada, tanpa
              terpengaruh oleh temperatur, tekanan mekanis, atau ikatan kimia eksternal.
            </p>
          </div>
        </div>
      </div>

      {/* Kolom Output & Breakdown Komputasi */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <OutputBox
            label="Massa Akhir Tersisa (Nt)"
            value={massaAkhir}
            decimals={4}
            suffix={` ${satuanMassa}`}
          />
          <OutputBox
            label="Massa Terurai / Meluruh (N0 - Nt)"
            value={massaMeluruh}
            decimals={4}
            suffix={` ${satuanMassa}`}
          />
        </div>

        {/* Rangkuman Metrik Kinetika Nuklir */}
        <Card className="flex flex-col gap-4 border-accent/30 bg-accent/5">
          <div className="flex items-center gap-2.5 text-accent">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-sm font-semibold font-display tracking-wide uppercase">
              Rangkuman Metrik Kinetika Nuklir
            </h3>
          </div>

          <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-accent/20 bg-base">
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary font-medium">Persentase Sisa Material:</span>
              <span className="text-base font-bold font-mono text-accent">
                {persentaseSisa}%
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary font-medium">Fraksi Peluruhan Meluruh:</span>
              <span className="font-mono text-primary font-semibold">
                {(100 - persentaseSisa).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary font-medium">Periode Paruh Terlampaui (n = t/t½):</span>
              <span className="font-mono text-primary font-semibold">
                {jumlahParuh} siklus
              </span>
            </div>
          </div>
        </Card>

        {/* Verifikasi Parameter Teknis */}
        <Card className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase border-b border-border pb-2 flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent" />
            Verifikasi Parameter Teknis
          </h3>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-secondary">Kuantitas Awal (N0):</span>
              <span className="font-mono text-primary font-medium">
                {massaAwal ?? 0} {satuanMassa}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Waktu Paruh (t½):</span>
              <span className="font-mono text-primary font-medium">
                {waktuParuh ?? 0} {satuanWaktu}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Lama Peluruhan (t):</span>
              <span className="font-mono text-primary font-medium">
                {waktuBerlalu ?? 0} {satuanWaktu}
              </span>
            </div>

            <div className="flex justify-between items-center border-t border-border/50 pt-2">
              <span className="text-secondary">Konstanta Laju Peluruhan (λ):</span>
              <span className="font-mono text-accent font-semibold">
                {konstantaPeluruhan} /{satuanWaktu}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Waktu Hidup Rata-rata (τ = 1/λ):</span>
              <span className="font-mono text-primary font-medium">
                {umurRataRata} {satuanWaktu}
              </span>
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-center font-semibold">
              <span className="text-primary flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Sisa Fraksi (Nt / N0):
              </span>
              <span className="font-mono text-accent text-base">
                {(persentaseSisa / 100).toFixed(6)}
              </span>
            </div>
          </div>
        </Card>

        {/* Tabel Milestone Peluruhan Berjenjang */}
        <Card className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-primary font-display text-xs font-semibold uppercase tracking-wider">
            <TrendingDown className="w-4 h-4 text-accent" />
            Tabel Tahapan Peluruhan (n = 0 s/d 5 Siklus)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border text-secondary">
                  <th className="py-1.5 font-medium">Siklus (n)</th>
                  <th className="py-1.5 font-medium">Waktu (t)</th>
                  <th className="py-1.5 font-medium text-right">Sisa (%)</th>
                  <th className="py-1.5 font-medium text-right">Massa ({satuanMassa})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono">
                {[0, 1, 2, 3, 4, 5].map((cycle) => {
                  const cycleTime = (waktuParuh ?? 0) * cycle;
                  const cycleRemainingPct = 100 * Math.pow(0.5, cycle);
                  const cycleMass = ((massaAwal ?? 0) * cycleRemainingPct) / 100;
                  const isCurrent =
                    Math.abs((jumlahParuh ?? 0) - cycle) < 0.05 && (jumlahParuh ?? 0) > 0;

                  return (
                    <tr
                      key={cycle}
                      className={isCurrent ? "bg-accent/10 text-accent font-semibold" : "text-secondary"}
                    >
                      <td className="py-1.5">{cycle} t½</td>
                      <td className="py-1.5">
                        {cycleTime} {satuanWaktu}
                      </td>
                      <td className="py-1.5 text-right">{cycleRemainingPct.toFixed(2)}%</td>
                      <td className="py-1.5 text-right text-primary">
                        {cycleMass.toFixed(4)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}