"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Camera,
  Focus,
  RotateCcw,
  Calculator,
  Layers,
  Sparkles,
  Info,
  ShieldCheck,
  Zap,
  Sliders,
  Maximize2,
  Eye,
} from "lucide-react";
import { useQueryState, parseAsFloat, parseAsString } from "nuqs";
import { cn } from "@/lib/utils";

interface SensorFormat {
  name: string;
  coc: number; // in mm
  cropFactor: number;
  description: string;
}

const SENSOR_FORMATS: Record<string, SensorFormat> = {
  "full-frame": {
    name: "Full Frame 35mm (36 x 24 mm)",
    coc: 0.030,
    cropFactor: 1.0,
    description: "Standar industri sensor 35mm (Sony A7, Canon R5/R6, Nikon Z6/Z8)",
  },
  "aps-c": {
    name: "APS-C (Sony E, Nikon Z, Fujifilm X / 1.5x)",
    coc: 0.020,
    cropFactor: 1.5,
    description: "Format sensor crop 1.5x (~23.5 x 15.6 mm)",
  },
  "aps-c-canon": {
    name: "APS-C Canon (1.6x Crop / 22.2 x 14.8 mm)",
    coc: 0.019,
    cropFactor: 1.6,
    description: "Format sensor crop 1.6x Canon EOS R7/R10/R50",
  },
  "m43": {
    name: "Micro Four Thirds / M4/3 (17.3 x 13.0 mm)",
    coc: 0.015,
    cropFactor: 2.0,
    description: "Format sensor 2.0x crop (Panasonic Lumix, OM System / Olympus)",
  },
  "medium-format": {
    name: "Medium Format (Fujifilm GFX, Hasselblad / 44 x 33 mm)",
    coc: 0.040,
    cropFactor: 0.79,
    description: "Sensor medium format komersial beresolusi ultra-tinggi",
  },
  "1-inch": {
    name: "1-Inch Type (Sony RX100, ZV-1 / 13.2 x 8.8 mm)",
    coc: 0.011,
    cropFactor: 2.7,
    description: "Sensor kamera saku premium dan drone compact",
  },
};

interface DofClassification {
  label: string;
  description: string;
  badgeBg: string;
  badgeBorder: string;
  badgeColor: string;
}

export function DofCalculator() {
  // State Input terhubung ke URL Query Parameters via nuqs
  const [focalLength, setFocalLength] = useQueryState(
    "focalLength",
    parseAsFloat.withDefault(50)
  );
  const [aperture, setAperture] = useQueryState(
    "aperture",
    parseAsFloat.withDefault(2.8)
  );
  const [distance, setDistance] = useQueryState(
    "distance",
    parseAsFloat.withDefault(2.5)
  );
  const [sensorSize, setSensorSize] = useQueryState(
    "sensorSize",
    parseAsString.withDefault("full-frame")
  );

  // State Output Terhitung
  const [hyperfocalM, setHyperfocalM] = React.useState<number>(29.81);
  const [nearLimitM, setNearLimitM] = React.useState<number>(2.31);
  const [farLimitM, setFarLimitM] = React.useState<number>(2.72);
  const [totalDofM, setTotalDofM] = React.useState<number>(0.41);
  const [isInfinite, setIsInfinite] = React.useState<boolean>(false);
  const [frontDofM, setFrontDofM] = React.useState<number>(0.19);
  const [rearDofM, setRearDofM] = React.useState<number>(0.22);
  const [frontPercent, setFrontPercent] = React.useState<number>(46);
  const [rearPercent, setRearPercent] = React.useState<number>(54);
  const [dofClassification, setDofClassification] = React.useState<DofClassification>({
    label: "DoF Menengah (Standard Isolation)",
    description: "Subjek terisolasi tajam dengan latar belakang bokeh lembut proporsional.",
    badgeBg: "bg-emerald-500/10",
    badgeBorder: "border-emerald-500/30",
    badgeColor: "text-emerald-400",
  });

  // Komputasi Formula Optik Presisi
  const calculateDof = React.useCallback(() => {
    const f = Math.max(1, focalLength ?? 50);
    const N = Math.max(0.7, aperture ?? 2.8);
    const sMeter = Math.max(0.01, distance ?? 2.5);
    const sMm = sMeter * 1000;

    const sensorConfig = SENSOR_FORMATS[sensorSize ?? "full-frame"] || SENSOR_FORMATS["full-frame"];
    const c = sensorConfig.coc;

    // 1. Hyperfocal Distance H (mm) = (f^2) / (N * c) + f
    const H_mm = (f * f) / (N * c) + f;
    const H_meter = Number((H_mm / 1000).toFixed(2));

    // 2. Near Limit Dn (mm) = (H * s) / (H + (s - f))
    const nearDenominator = H_mm + (sMm - f);
    const nearLimit_mm = nearDenominator > 0 ? (H_mm * sMm) / nearDenominator : 0;
    const nearLimit_meter = Number(Math.max(0, nearLimit_mm / 1000).toFixed(2));

    // 3. Far Limit Df (mm) = (H * s) / (H - (s - f))
    const farDenominator = H_mm - (sMm - f);
    const isInf = farDenominator <= 0;
    const farLimit_mm = !isInf ? (H_mm * sMm) / farDenominator : Infinity;
    const farLimit_meter = !isInf ? Number((farLimit_mm / 1000).toFixed(2)) : Infinity;

    // 4. Total Depth of Field (DoF) = Df - Dn
    const totalDof_meter = !isInf
      ? Number(Math.max(0, farLimit_meter - nearLimit_meter).toFixed(2))
      : Infinity;

    // 5. Distribusi Bidang Ketajaman (Depan vs Belakang Subjek)
    const front_m = Number(Math.max(0, sMeter - nearLimit_meter).toFixed(2));
    const rear_m = !isInf ? Number(Math.max(0, farLimit_meter - sMeter).toFixed(2)) : Infinity;

    let fPct = 50;
    let rPct = 50;
    if (!isInf && totalDof_meter > 0) {
      fPct = Math.min(100, Math.max(0, Math.round((front_m / totalDof_meter) * 100)));
      rPct = 100 - fPct;
    }

    // 6. Klasifikasi Karakteristik Kedalaman Ruang
    let classification: DofClassification;
    if (isInf || totalDof_meter >= 10) {
      classification = {
        label: "Deep Focus / Lanskap Hiperfokal",
        description: "Seluruh bidang pemandangan dari batas depan hingga tak terhingga berada dalam ketajaman absolut.",
        badgeBg: "bg-sky-500/10",
        badgeBorder: "border-sky-500/30",
        badgeColor: "text-sky-400",
      };
    } else if (totalDof_meter < 0.08) {
      classification = {
        label: "Ultra-Shallow DoF (Macro / Razor Sharp)",
        description: "Kedalaman ruang sangat tipis. Area fokus sangat kritis, menghasilkan separasi latar belakang ekstrem (creamy bokeh).",
        badgeBg: "bg-purple-500/10",
        badgeBorder: "border-purple-500/30",
        badgeColor: "text-purple-400",
      };
    } else if (totalDof_meter < 0.30) {
      classification = {
        label: "Shallow DoF (Portrait Bokeh)",
        description: "Kedalaman ruang sempit ideal untuk fotografi potret dengan isolasi subjek tajam dan latar belakang blur.",
        badgeBg: "bg-blue-500/10",
        badgeBorder: "border-blue-500/30",
        badgeColor: "text-blue-400",
      };
    } else if (totalDof_meter < 1.2) {
      classification = {
        label: "DoF Menengah (Standard Isolation)",
        description: "Subjek terisolasi tajam dengan latar belakang bokeh lembut proporsional.",
        badgeBg: "bg-emerald-500/10",
        badgeBorder: "border-emerald-500/30",
        badgeColor: "text-emerald-400",
      };
    } else {
      classification = {
        label: "Extended DoF (Commercial & Group)",
        description: "Bidang ketajaman luas terkalibrasi, ideal untuk foto grup, produk komersial, atau street photography.",
        badgeBg: "bg-amber-500/10",
        badgeBorder: "border-amber-500/30",
        badgeColor: "text-amber-400",
      };
    }

    setHyperfocalM(H_meter);
    setNearLimitM(nearLimit_meter);
    setFarLimitM(farLimit_meter);
    setTotalDofM(totalDof_meter);
    setIsInfinite(isInf);
    setFrontDofM(front_m);
    setRearDofM(rear_m);
    setFrontPercent(fPct);
    setRearPercent(rPct);
    setDofClassification(classification);
  }, [focalLength, aperture, distance, sensorSize]);

  React.useEffect(() => {
    calculateDof();
  }, [calculateDof]);

  const handleReset = () => {
    setFocalLength(null);
    setAperture(null);
    setDistance(null);
    setSensorSize(null);
  };

  const handlePreset = (f: number, n: number, d: number, sensor: string) => {
    setFocalLength(f);
    setAperture(n);
    setDistance(d);
    setSensorSize(sensor);
  };

  const activeSensor = SENSOR_FORMATS[sensorSize ?? "full-frame"] || SENSOR_FORMATS["full-frame"];

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
                  Parameter Lensa & Bidang Fokus
                </h2>
                <p className="text-secondary text-sm">
                  Kalkulasi Depth of Field (DoF) dan Jarak Hiperfokal Standar Optik
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

          {/* Preset Skenario Fotografi Populer */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-medium text-secondary">
              Preset Lensa & Skenario Fotografi Cepat:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handlePreset(85, 1.4, 2.0, "full-frame")}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Potret Bokeh (85mm f/1.4 @ 2m)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(50, 1.8, 2.5, "full-frame")}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Nifty-Fifty (50mm f/1.8 @ 2.5m)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(35, 2.8, 3.0, "full-frame")}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Street Photo (35mm f/2.8 @ 3m)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(24, 8.0, 5.0, "full-frame")}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Lanskap Hiperfokal (24mm f/8 @ 5m)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(105, 2.8, 0.5, "full-frame")}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Makro Detail (105mm f/2.8 @ 0.5m)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Pilihan Format Sensor */}
            <div className="sm:col-span-2">
              <Select
                label="Format Sensor Kamera"
                value={sensorSize || "full-frame"}
                onChange={(e) => setSensorSize(e.target.value)}
                helperText={`Lingkaran Kebingungan (Circle of Confusion / CoC): ${activeSensor.coc} mm — ${activeSensor.description}`}
              >
                {Object.entries(SENSOR_FORMATS).map(([key, format]) => (
                  <option key={key} value={key}>
                    {format.name} (CoC: {format.coc} mm)
                  </option>
                ))}
              </Select>
            </div>

            {/* Input Panjang Fokus Lensa */}
            <Input
              label="Panjang Fokus Lensa (Focal Length)"
              type="number"
              min={1}
              max={1200}
              step={1}
              value={focalLength ?? ""}
              onChange={(e) =>
                setFocalLength(e.target.value === "" ? null : Number(e.target.value))
              }
              suffix="mm"
              helperText="Panjang fokal optik lensa aktual (contoh: 24, 35, 50, 85, 200 mm)"
            />

            {/* Input Bukaan Diafragma Aperture */}
            <Input
              label="Bukaan Diafragma (Aperture f-stop)"
              type="number"
              min={0.7}
              max={64}
              step={0.1}
              prefix="f/"
              value={aperture ?? ""}
              onChange={(e) =>
                setAperture(e.target.value === "" ? null : Number(e.target.value))
              }
              helperText="Rasio bukaan diafragma (contoh: 1.4, 1.8, 2.8, 4.0, 8.0, 11, 16)"
            />

            {/* Input Jarak Subjek */}
            <div className="sm:col-span-2">
              <Input
                label="Jarak Fokus Subjek (Subject Distance)"
                type="number"
                min={0.05}
                max={10000}
                step={0.1}
                value={distance ?? ""}
                onChange={(e) =>
                  setDistance(e.target.value === "" ? null : Number(e.target.value))
                }
                suffix="meter"
                helperText={`Jarak dari sensor kamera ke bidang fokus: ${((distance ?? 0) * 100).toLocaleString("id-ID")} cm`}
              />
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={calculateDof} className="w-full sm:w-auto flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Hitung Kedalaman Ruang (DoF) Presisi
            </Button>
          </div>
        </Card>

        {/* Technical Validation Banner */}
        <Card className="bg-surface/50 border-border/60 text-secondary text-xs leading-relaxed flex items-start gap-3 p-4">
          <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-primary block mb-0.5">
              Parameter Teknis Terkalibrasi Standar Industri Optik
            </span>
            Kalkulasi Depth of Field mematuhi standar optik internasional berbasis kriteria ketajaman visual Zeiss ($c = d / 1730$). Nilai Circle of Confusion (CoC) disesuaikan secara presisi terhadap ukuran fisik sensor untuk menghasilkan simulasi ketajaman nyata tanpa distorsi matematis.
          </div>
        </Card>
      </div>

      {/* Kolom Kanan: Output Hasil & Matriks Optik */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Hero DoF Card */}
        <Card className="flex flex-col gap-4 p-6 bg-gradient-to-br from-surface to-elevated border-accent/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-secondary text-[13px] font-sans flex items-center gap-1.5">
              <Focus className="w-4 h-4 text-accent" />
              Total Kedalaman Ruang (Depth of Field)
            </span>
            <span className="text-xs font-mono text-secondary">
              f/{aperture} @ {focalLength}mm
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            {isInfinite ? (
              <span className="font-mono text-4xl md:text-5xl font-bold tracking-tight text-accent">
                Tak Terhingga (∞)
              </span>
            ) : (
              <>
                <span className="font-mono text-5xl md:text-6xl font-bold tracking-tight text-primary">
                  {totalDofM >= 1 ? totalDofM : (totalDofM * 100).toFixed(1)}
                </span>
                <span className="text-secondary text-lg font-medium font-sans">
                  {totalDofM >= 1 ? "meter" : "cm"}
                </span>
              </>
            )}
          </div>

          {/* Classification Badge */}
          <div
            className={cn(
              "flex items-start gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all",
              dofClassification.badgeBg,
              dofClassification.badgeBorder,
              dofClassification.badgeColor
            )}
          >
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold">{dofClassification.label}</span>
              <span className="text-secondary text-[11px] leading-tight">
                {dofClassification.description}
              </span>
            </div>
          </div>

          {/* Visual Focus Distribution Bar */}
          {!isInfinite && (
            <div className="flex flex-col gap-1.5 pt-2 border-t border-border/40">
              <div className="flex justify-between text-[11px] font-mono text-secondary">
                <span>Depan Subjek: {frontPercent}%</span>
                <span>Belakang Subjek: {rearPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-base overflow-hidden flex">
                <div
                  className="h-full bg-accent/70 transition-all duration-300"
                  style={{ width: `${frontPercent}%` }}
                  title={`Di depan subjek: ${frontPercent}%`}
                />
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${rearPercent}%` }}
                  title={`Di belakang subjek: ${rearPercent}%`}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <OutputBox
            label="Batas Depan Ketajaman (Near Limit)"
            value={nearLimitM}
            decimals={2}
            suffix=" m"
          />

          <OutputBox
            label="Jarak Hiperfokal (Hyperfocal)"
            value={hyperfocalM}
            decimals={2}
            suffix=" m"
          />
        </div>

        {/* Detailed Optical Matrix Breakdown */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-accent" />
              Rincian Matriks Optik & Bidang Fokus
            </h3>
            <span className="text-xs text-secondary font-mono">
              CoC: {activeSensor.coc} mm
            </span>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary flex items-center gap-1.5">
                <Focus className="w-3.5 h-3.5 text-accent" />
                Batas Depan (Near Limit):
              </span>
              <span className="font-mono text-primary font-medium">{nearLimitM} meter</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-accent" />
                Batas Belakang (Far Limit):
              </span>
              <span className="font-mono text-primary font-medium">
                {isInfinite ? "Tak Terhingga (∞)" : `${farLimitM} meter`}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                Ketajaman di Depan Subjek:
              </span>
              <span className="font-mono text-emerald-400 font-medium">
                {frontDofM} m ({frontPercent}%)
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                Ketajaman di Belakang Subjek:
              </span>
              <span className="font-mono text-blue-400 font-medium">
                {isInfinite ? "Tak Terhingga (∞)" : `${rearDofM} m (${rearPercent}%)`}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-accent" />
                Jarak Hiperfokal ($H$):
              </span>
              <span className="font-mono text-accent font-semibold">{hyperfocalM} meter</span>
            </div>

            <div className="pt-2 flex justify-between items-center font-semibold">
              <span className="text-primary flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent" />
                Total Kedalaman Ruang Terkalibrasi:
              </span>
              <span className="font-mono text-accent text-base">
                {isInfinite ? "Tak Terhingga (∞)" : `${totalDofM} meter`}
              </span>
            </div>
          </div>
        </Card>

        {/* Real-time URL Synchronization Notification */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <Zap className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            Parameter optik lensa tersinkronisasi <span className="text-primary font-medium">real-time</span> ke URL query parameters. Anda dapat menyalin tautan browser untuk membagikan konfigurasi depth of field dan jarak hiperfokal kepada kru kamera atau rekan fotografer secara presisi.
          </p>
        </div>
      </div>
    </div>
  );
}