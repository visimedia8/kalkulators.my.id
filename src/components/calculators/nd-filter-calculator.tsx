"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Camera,
  Sliders,
  RotateCcw,
  Sparkles,
  Clock,
  Timer,
  Sun,
  Eye,
  Layers,
  ShieldCheck,
  Zap,
  Info,
  Gauge,
  Film,
  AlertCircle,
} from "lucide-react";
import { useQueryState, parseAsString, parseAsFloat } from "nuqs";
import { cn } from "@/lib/utils";

interface NdFilterStandard {
  stops: number;
  ndNumber: string;
  opticalDensity: string;
  transmittance: number;
  description: string;
}

const ND_STANDARDS: NdFilterStandard[] = [
  { stops: 1, ndNumber: "ND2", opticalDensity: "0.3", transmittance: 50.0, description: "Reduksi 1 Stop - Kompensasi bukaan tipis pada pencahayaan sedang" },
  { stops: 2, ndNumber: "ND4", opticalDensity: "0.6", transmittance: 25.0, description: "Reduksi 2 Stop - Ideal untuk video outdoor aperture sedang" },
  { stops: 3, ndNumber: "ND8", opticalDensity: "0.9", transmittance: 12.5, description: "Reduksi 3 Stop - Standar sinematografi aturan 180° shutter" },
  { stops: 4, ndNumber: "ND16", opticalDensity: "1.2", transmittance: 6.25, description: "Reduksi 4 Stop - Video sinematik di bawah terik matahari siang" },
  { stops: 5, ndNumber: "ND32", opticalDensity: "1.5", transmittance: 3.125, description: "Reduksi 5 Stop - Mengaburkan riak ombak dan pejalan kaki lambat" },
  { stops: 6, ndNumber: "ND64", opticalDensity: "1.8", transmittance: 1.56, description: "Reduksi 6 Stop (Little Stopper) - Air terjun sutra & aliran sungai" },
  { stops: 7, ndNumber: "ND128", opticalDensity: "2.1", transmittance: 0.78, description: "Reduksi 7 Stop - Efek kabut lembut pada aliran air deras" },
  { stops: 8, ndNumber: "ND256", opticalDensity: "2.4", transmittance: 0.39, description: "Reduksi 8 Stop - Dinamika awan sore dan pergerakan ombak" },
  { stops: 9, ndNumber: "ND512", opticalDensity: "2.7", transmittance: 0.20, description: "Reduksi 9 Stop - Efek air kaca dan pencahayaan kontras tinggi" },
  { stops: 10, ndNumber: "ND1000 / ND1024", opticalDensity: "3.0", transmittance: 0.098, description: "Reduksi 10 Stop (Big Stopper) - Danau kaca, awan dramatis, street kosong" },
  { stops: 12, ndNumber: "ND4096", opticalDensity: "3.6", transmittance: 0.024, description: "Reduksi 12 Stop (Super Stopper) - Long exposure ekstrem siang terik" },
  { stops: 15, ndNumber: "ND32768", opticalDensity: "4.5", transmittance: 0.003, description: "Reduksi 15 Stop - Penghilang kerumunan total di tempat wisata" },
  { stops: 16, ndNumber: "ND65536", opticalDensity: "4.8", transmittance: 0.0015, description: "Reduksi 16 Stop - Fotografi matahari, solar eclipse & arsitektur ekstrem" },
];

const STANDARD_SHUTTER_SPEEDS = [
  { value: "1/8000", label: "1/8000 detik" },
  { value: "1/4000", label: "1/4000 detik" },
  { value: "1/2000", label: "1/2000 detik" },
  { value: "1/1000", label: "1/1000 detik" },
  { value: "1/500", label: "1/500 detik" },
  { value: "1/250", label: "1/250 detik" },
  { value: "1/125", label: "1/125 detik" },
  { value: "1/60", label: "1/60 detik" },
  { value: "1/30", label: "1/30 detik" },
  { value: "1/15", label: "1/15 detik" },
  { value: "1/8", label: "1/8 detik" },
  { value: "1/4", label: "1/4 detik" },
  { value: "1/2", label: "1/2 detik" },
  { value: "1", label: "1 detik" },
  { value: "2", label: "2 detik" },
  { value: "4", label: "4 detik" },
  { value: "8", label: "8 detik" },
  { value: "15", label: "15 detik" },
  { value: "30", label: "30 detik" },
];

function parseShutterSpeedToSeconds(val: string): number {
  if (!val) return 1 / 125;
  const clean = val.trim().replace(",", ".");
  if (clean.includes("/")) {
    const parts = clean.split("/");
    const num = parseFloat(parts[0]);
    const den = parseFloat(parts[1]);
    if (!isNaN(num) && !isNaN(den) && den !== 0) {
      return num / den;
    }
  }
  const parsed = parseFloat(clean);
  return isNaN(parsed) || parsed <= 0 ? 1 / 125 : parsed;
}

function formatFinalShutter(seconds: number): string {
  if (seconds <= 0) return "0 detik";

  if (seconds < 1) {
    const denominator = Math.round(1 / seconds);
    if (denominator >= 1) {
      return `1/${denominator} detik`;
    }
    return `${seconds.toFixed(3)} detik`;
  }

  if (seconds < 60) {
    if (Number.isInteger(seconds)) {
      return `${seconds} detik`;
    }
    return `${seconds.toLocaleString("id-ID", { maximumFractionDigits: 2 })} detik`;
  }

  const mins = Math.floor(seconds / 60);
  const remainingSecs = Math.round((seconds % 60) * 10) / 10;
  if (remainingSecs === 0) {
    return `${mins} menit`;
  }
  return `${mins} menit ${remainingSecs.toLocaleString("id-ID", { maximumFractionDigits: 1 })} detik`;
}

export function NdFilterCalculator() {
  // State Input terhubung ke URL Query Parameters via nuqs
  const [shutterSpeedAwal, setShutterSpeedAwal] = useQueryState(
    "shutterSpeedAwal",
    parseAsString.withDefault("1/125")
  );
  const [ndStop, setNdStop] = useQueryState(
    "ndStop",
    parseAsFloat.withDefault(10)
  );

  // Mode input kustom jika user ingin mengetik pecahan manual
  const [isCustomShutter, setIsCustomShutter] = React.useState<boolean>(false);
  const [customShutterInput, setCustomShutterInput] = React.useState<string>("1/125");

  // Filter Stacking (Filter Tambahan Opsional)
  const [enableStacking, setEnableStacking] = React.useState<boolean>(false);
  const [stackedStop, setStackedStop] = React.useState<number>(6);

  // State Output Terhitung
  const [finalShutterSec, setFinalShutterSec] = React.useState<number>(8.192);
  const [formattedResult, setFormattedResult] = React.useState<string>("8 detik");
  const [totalStops, setTotalStops] = React.useState<number>(10);
  const [ndMultiplier, setNdMultiplier] = React.useState<number>(1024);
  const [opticalDensity, setOpticalDensity] = React.useState<string>("3.0");
  const [transmittancePercent, setTransmittancePercent] = React.useState<number>(0.098);
  const [isBulbMode, setIsBulbMode] = React.useState<boolean>(false);
  const [effectRecommendation, setEffectRecommendation] = React.useState<string>(
    "Permukaan air menjadi seperti kaca lembut, awan bergerak mulus, kerumunan pejalan kaki mulai memudar."
  );

  // Komputasi Formula Optik Shutter Speed ND Filter
  const calculateExposure = React.useCallback(() => {
    const rawShutter = shutterSpeedAwal ?? "1/125";
    const baseSec = parseShutterSpeedToSeconds(rawShutter);
    const mainStopVal = Math.max(0, ndStop ?? 10);
    const effectiveTotalStops = enableStacking ? mainStopVal + Math.max(0, stackedStop) : mainStopVal;

    // Formula Standar Industri: Shutter Speed Akhir (detik) = Shutter Speed Awal * (2 ^ ND Stop)
    const factor = Math.pow(2, effectiveTotalStops);
    const finalSec = baseSec * factor;

    const od = (effectiveTotalStops * 0.30103).toFixed(1);
    const transmittance = effectiveTotalStops > 0 ? (100 / factor) : 100;
    const bulb = finalSec > 30;

    // Rekomendasi Efek Visual Fotografi
    let visualEffect = "";
    if (finalSec < 0.02) {
      // < 1/50 detik
      visualEffect = "Aksi gerakan cepat masih relatif beku; ideal untuk kontrol bukaan aperture lensa di kondisi terik.";
    } else if (finalSec <= 0.5) {
      // 1/50 - 1/2 detik
      visualEffect = "Efek gerakan dinamis alami pada ombak laut, laju air terjun bertekstur, dan panning kendaraan.";
    } else if (finalSec <= 4) {
      // 1/2 - 4 detik
      visualEffect = "Air terjun berubah menjadi tekstur sutra halus (silky smooth) dengan jejak buih air terdistribusi lembut.";
    } else if (finalSec <= 30) {
      // 4 - 30 detik
      visualEffect = "Permukaan danau/laut menyerupai kaca cermin, formasi awan tampak tersapu angin dengan garis halus.";
    } else {
      // > 30 detik (Bulb Mode)
      visualEffect = "Long exposure ekstrem: permukaan air berkabut tebal, jejak awan dramatis, dan kerumunan manusia hilang sepenuhnya (crowd eraser).";
    }

    setFinalShutterSec(finalSec);
    setFormattedResult(formatFinalShutter(finalSec));
    setTotalStops(effectiveTotalStops);
    setNdMultiplier(factor);
    setOpticalDensity(od);
    setTransmittancePercent(transmittance);
    setIsBulbMode(bulb);
    setEffectRecommendation(visualEffect);
  }, [shutterSpeedAwal, ndStop, enableStacking, stackedStop]);

  React.useEffect(() => {
    calculateExposure();
  }, [calculateExposure]);

  const handleReset = () => {
    setShutterSpeedAwal("1/125");
    setNdStop(10);
    setIsCustomShutter(false);
    setCustomShutterInput("1/125");
    setEnableStacking(false);
    setStackedStop(6);
  };

  const handlePreset = (base: string, stop: number, stack: boolean = false, secondStop: number = 0) => {
    setShutterSpeedAwal(base);
    setNdStop(stop);
    setIsCustomShutter(false);
    setCustomShutterInput(base);
    setEnableStacking(stack);
    setStackedStop(secondStop);
  };

  const handleCustomShutterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomShutterInput(val);
    setShutterSpeedAwal(val);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Kolom Kiri: Form Parameter Input */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Eksposur & Filter ND
                </h2>
                <p className="text-secondary text-sm">
                  Kalkulasi Waktu Eksposur Long Exposure Standar Optik Fotografi
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

          {/* Preset Skenario Fotografi Cepat */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-medium text-secondary">
              Preset Skenario Fotografi & Sinematografi Populer:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handlePreset("1/125", 6, false)}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Air Terjun Sutra (1/125s + 6-Stop)
              </button>
              <button
                type="button"
                onClick={() => handlePreset("1/60", 10, false)}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Danau Kaca (1/60s + 10-Stop)
              </button>
              <button
                type="button"
                onClick={() => handlePreset("1/15", 10, false)}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Sunset Long Exposure (1/15s + 10-Stop)
              </button>
              <button
                type="button"
                onClick={() => handlePreset("1/1000", 4, false)}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Video Sinematik 180° (1/1000s + 4-Stop)
              </button>
              <button
                type="button"
                onClick={() => handlePreset("1/30", 10, true, 6)}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Penghilang Kerumunan (1/30s + Stack 16-Stop)
              </button>
            </div>
          </div>

          {/* Form Input Utama */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input 1: Kecepatan Rana Awal */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-secondary">
                  Shutter Speed Awal (Tanpa Filter)
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomShutter(!isCustomShutter)}
                  className="text-[11px] text-accent hover:underline"
                >
                  {isCustomShutter ? "Pilih Standar" : "Ketik Manual"}
                </button>
              </div>

              {isCustomShutter ? (
                <Input
                  type="text"
                  value={customShutterInput}
                  onChange={handleCustomShutterChange}
                  placeholder="Contoh: 1/200 atau 0.005"
                  helperText="Format pecahan (misal 1/200) atau detik (misal 2)"
                />
              ) : (
                <Select
                  value={shutterSpeedAwal ?? "1/125"}
                  onChange={(e) => {
                    setShutterSpeedAwal(e.target.value);
                    setCustomShutterInput(e.target.value);
                  }}
                  helperText="Kecepatan rana terukur pada exposure meter kamera"
                >
                  {STANDARD_SHUTTER_SPEEDS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label} ({s.value}s)
                    </option>
                  ))}
                </Select>
              )}
            </div>

            {/* Input 2: Kekuatan ND Filter Utama */}
            <div className="flex flex-col gap-2">
              <Select
                label="Kekuatan ND Filter (Stop / Densitas)"
                value={String(ndStop ?? 10)}
                onChange={(e) => setNdStop(parseFloat(e.target.value))}
                helperText="Tingkat peredupan intensitas cahaya optik"
              >
                {ND_STANDARDS.map((nd) => (
                  <option key={nd.stops} value={nd.stops}>
                    {nd.stops} Stop — {nd.ndNumber} (OD {nd.opticalDensity})
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Filter Stacking Accordion */}
          <div className="border border-border/80 rounded-xl p-4 bg-base/50 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-primary">
                  Tumpuk Filter Tambahan (Filter Stacking)
                </span>
              </div>
              <Button
                type="button"
                variant={enableStacking ? "primary" : "secondary"}
                onClick={() => setEnableStacking(!enableStacking)}
                className="text-xs px-3 py-1.5 h-auto min-h-[32px]"
              >
                {enableStacking ? "Aktif (+ Stack)" : "+ Pasang Filter ke-2"}
              </Button>
            </div>

            {enableStacking && (
              <div className="pt-2 border-t border-border flex flex-col gap-2 animate-fadeIn">
                <Select
                  label="Filter ND Kedua"
                  value={String(stackedStop)}
                  onChange={(e) => setStackedStop(parseFloat(e.target.value))}
                  helperText="Kombinasi 2 filter menghasilkan total stop kumulatif (Stop 1 + Stop 2)"
                >
                  {ND_STANDARDS.map((nd) => (
                    <option key={nd.stops} value={nd.stops}>
                      + {nd.stops} Stop — {nd.ndNumber} (OD {nd.opticalDensity})
                    </option>
                  ))}
                </Select>
                <p className="text-[12px] text-accent">
                  Total Reduksi Terpasang: <strong>{totalStops} Stop</strong> (Faktor Reduksi 2^{totalStops} = {ndMultiplier.toLocaleString("id-ID")}x)
                </p>
              </div>
            )}
          </div>

          {/* Tips Mode Kamera */}
          {isBulbMode ? (
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1 text-xs text-secondary">
                <strong className="text-amber-300 font-semibold text-sm">
                  Wajib Gunakan Mode Bulb (B) / Timer Kamera
                </strong>
                <p>
                  Waktu eksposur melebihi batas dial rana standar (30 detik). Atur kamera ke mode <strong>Bulb (B)</strong> atau <strong>Time (T)</strong> serta gunakan shutter release cable / intervalometer eksternal untuk menghindari guncangan kamera (*shutter vibration*).
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1 text-xs text-secondary">
                <strong className="text-emerald-300 font-semibold text-sm">
                  Dapat Menggunakan Mode Manual (M) Standar
                </strong>
                <p>
                  Waktu eksposur berada dalam batas dial rana standar (≤ 30 detik). Anda dapat langsung memutar dial shutter kamera ke angka yang tertera tanpa memerlukan kabel rilis timer.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Tabel Komparasi Matriks Standar Filter ND */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Gauge className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-semibold text-primary">
              Matriks Karakteristik Standar Optik ND Filter
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-secondary font-medium">
                  <th className="pb-2">Kekuatan (Stop)</th>
                  <th className="pb-2">Kode ND</th>
                  <th className="pb-2">Optical Density</th>
                  <th className="pb-2">Transmisi Cahaya</th>
                  <th className="pb-2">Hasil dari {shutterSpeedAwal}s</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-secondary">
                {ND_STANDARDS.map((item) => {
                  const baseSec = parseShutterSpeedToSeconds(shutterSpeedAwal ?? "1/125");
                  const calcSec = baseSec * Math.pow(2, item.stops);
                  const isSelected = item.stops === ndStop && !enableStacking;
                  return (
                    <tr
                      key={item.stops}
                      className={cn(
                        "hover:bg-elevated/50 transition-colors",
                        isSelected && "bg-accent/10 font-semibold text-primary"
                      )}
                    >
                      <td className="py-2.5">{item.stops} Stop</td>
                      <td className="py-2.5 text-primary font-mono">{item.ndNumber}</td>
                      <td className="py-2.5 font-mono">{item.opticalDensity}</td>
                      <td className="py-2.5 font-mono">{item.transmittance}%</td>
                      <td className="py-2.5 font-mono text-accent font-medium">
                        {formatFinalShutter(calcSec)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Kolom Kanan: Output Display */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <Card className="flex flex-col gap-6 bg-gradient-to-br from-surface to-elevated">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Timer className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold font-display text-primary">
              Hasil Waktu Eksposur Akhir
            </h3>
          </div>

          {/* Primary Output Box */}
          <OutputBox
            label="WAKTU RANA AKHIR (DETIK)"
            value={Number(finalShutterSec.toFixed(2))}
            decimals={finalShutterSec < 1 ? 3 : 2}
            suffix=" s"
            className="w-full"
          />

          {/* Representasi Format Fotografi */}
          <div className="p-4 rounded-xl border border-accent/30 bg-accent/5 flex flex-col items-center justify-center text-center gap-1">
            <span className="text-xs text-secondary font-medium">
              Pengaturan Rana pada Kamera:
            </span>
            <span className="text-2xl font-bold font-mono text-accent">
              {formattedResult}
            </span>
            <span className="text-[11px] text-secondary">
              {finalShutterSec >= 60 ? `Setara dengan ${finalShutterSec.toFixed(1)} detik total` : "Presisi Standar Optik"}
            </span>
          </div>

          {/* Rincian Parameter Optik Terkalibrasi */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-border bg-base flex flex-col">
              <span className="text-[11px] text-secondary">Total Reduksi Cahaya</span>
              <span className="text-base font-semibold font-mono text-primary mt-0.5">
                {totalStops} Stop (EV -{totalStops})
              </span>
            </div>

            <div className="p-3 rounded-xl border border-border bg-base flex flex-col">
              <span className="text-[11px] text-secondary">Faktor Multiplier ND</span>
              <span className="text-base font-semibold font-mono text-primary mt-0.5">
                {ndMultiplier.toLocaleString("id-ID")}x
              </span>
            </div>

            <div className="p-3 rounded-xl border border-border bg-base flex flex-col">
              <span className="text-[11px] text-secondary">Optical Density (OD)</span>
              <span className="text-base font-semibold font-mono text-primary mt-0.5">
                {opticalDensity}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-border bg-base flex flex-col">
              <span className="text-[11px] text-secondary">Transmisi Cahaya</span>
              <span className="text-base font-semibold font-mono text-primary mt-0.5">
                {transmittancePercent < 0.01 ? transmittancePercent.toFixed(4) : transmittancePercent.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Rekomendasi Efek Visual */}
          <div className="p-4 rounded-xl border border-border bg-base flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-accent" />
              Karakteristik Visual yang Dihasilkan
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              {effectRecommendation}
            </p>
          </div>

          {/* Panduan Eksekusi Lapangan */}
          <div className="p-4 rounded-xl border border-border/70 bg-elevated/40 flex flex-col gap-2 text-xs text-secondary">
            <div className="flex items-center gap-1.5 font-medium text-primary">
              <Film className="w-3.5 h-3.5 text-accent" />
              SOP Pengambilan Gambar di Lapangan:
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px]">
              <li>Lakukan komposisi dan kunci fokus (MF) sebelum memasang filter ND tebal.</li>
              <li>Catat metering shutter speed awal kamera tanpa filter.</li>
              <li>Pasang filter ND pada lensa dengan hati-hati.</li>
              <li>Atur shutter speed kamera sesuai angka kalkulator ({formattedResult}).</li>
              <li>Gunakan 2s self-timer atau remote shutter untuk mencegah getaran tangan.</li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
}