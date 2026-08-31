"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Camera,
  Maximize2,
  RotateCcw,
  Sparkles,
  Layers,
  Eye,
  Info,
  Scan,
  Compass,
  Grid,
  ShieldCheck,
  Zap,
  Sliders,
} from "lucide-react";
import { useQueryState, parseAsFloat } from "nuqs";
import { cn } from "@/lib/utils";

interface SensorSpec {
  name: string;
  cropFactor: number;
  widthMm: number;
  heightMm: number;
  diagonalMm: number;
  description: string;
  commonCameras: string;
}

const SENSOR_SPECS: Record<string, SensorSpec> = {
  "1": {
    name: "Full Frame 35mm (1.0x)",
    cropFactor: 1.0,
    widthMm: 36.0,
    heightMm: 24.0,
    diagonalMm: 43.27,
    description: "Standar industri sensor 35mm (Format Acuan Global)",
    commonCameras: "Sony A7/A9/A1, Canon EOS R5/R6, Nikon Z6/Z8",
  },
  "1.5": {
    name: "APS-C Sony / Nikon / Fuji (1.5x)",
    cropFactor: 1.5,
    widthMm: 23.6,
    heightMm: 15.6,
    diagonalMm: 28.29,
    description: "Format sensor crop standar Sony E, Nikon DX, Fujifilm X",
    commonCameras: "Sony A6700/ZV-E10, Fujifilm X-T5, Nikon Z50",
  },
  "1.6": {
    name: "APS-C Canon (1.6x)",
    cropFactor: 1.6,
    widthMm: 22.2,
    heightMm: 14.8,
    diagonalMm: 26.68,
    description: "Format sensor crop khusus Canon EOS R/EF-S",
    commonCameras: "Canon EOS R7/R10/R50, Canon 90D/Rebel",
  },
  "2": {
    name: "Micro Four Thirds / M4/3 (2.0x)",
    cropFactor: 2.0,
    widthMm: 17.3,
    heightMm: 13.0,
    diagonalMm: 21.64,
    description: "Format sensor rasio 4:3 portabel dan telefoto",
    commonCameras: "OM System OM-1, Panasonic Lumix GH6/G9 II",
  },
  "2.7": {
    name: "1-Inch Type (2.7x)",
    cropFactor: 2.7,
    widthMm: 13.2,
    heightMm: 8.8,
    diagonalMm: 15.86,
    description: "Sensor kamera saku ringkas, vlogging, dan drone",
    commonCameras: "Sony RX100 VII, Sony ZV-1, DJI Air / Pocket",
  },
};

interface LensClassification {
  label: string;
  category: string;
  description: string;
  recommendedUse: string;
  badgeBg: string;
  badgeBorder: string;
  badgeColor: string;
}

interface QuickPreset {
  label: string;
  focal: number;
  description: string;
}

const QUICK_PRESETS: QuickPreset[] = [
  { label: "16mm Ultra-Wide", focal: 16, description: "Lanskap & Arsitektur" },
  { label: "24mm Wide", focal: 24, description: "Landscape & Vlogging" },
  { label: "35mm Street", focal: 35, description: "Human Interest & Jurnalistik" },
  { label: "50mm Standard", focal: 50, description: "Perspektif Mata Alami" },
  { label: "85mm Portrait", focal: 85, description: "Potret Headshot Bokeh" },
  { label: "135mm Tele", focal: 135, description: "Kompresi Latar & Modeling" },
  { label: "200mm Telephoto", focal: 200, description: "Panggung & Olahraga" },
  { label: "400mm Super-Tele", focal: 400, description: "Satwa Liar & Birding" },
];

export function CropFactorCalculator() {
  // State Input terintegrasi URL Query Parameters via nuqs
  const [focalLength, setFocalLength] = useQueryState(
    "focalLength",
    parseAsFloat.withDefault(50)
  );
  const [cropFactor, setCropFactor] = useQueryState(
    "cropFactor",
    parseAsFloat.withDefault(1.5)
  );

  // State Output Terhitung
  const [equivalentFocal, setEquivalentFocal] = React.useState<number>(75);
  const [diagonalFov, setDiagonalFov] = React.useState<number>(32.18);
  const [horizontalFov, setHorizontalFov] = React.useState<number>(26.54);
  const [verticalFov, setVerticalFov] = React.useState<number>(17.75);
  const [magnificationFactor, setMagnificationFactor] = React.useState<number>(1.5);

  const [classification, setClassification] = React.useState<LensClassification>({
    label: "Short Telephoto / Portrait",
    category: "Lensa Potret & Modeling",
    description: "Memberikan kompresi perspektif yang proporsional untuk foto potret wajah tanpa distorsi hidung.",
    recommendedUse: "Foto Potret, Modeling, Human Interest, Studio",
    badgeBg: "bg-amber-500/10",
    badgeBorder: "border-amber-500/30",
    badgeColor: "text-amber-400",
  });

  // Komputasi Formula Optik Presisi & Field of View
  const calculateOptics = React.useCallback(() => {
    const f = Math.max(1, focalLength ?? 50);
    const cf = Math.max(0.1, cropFactor ?? 1.5);

    // 1. Rumus Ekuivalen Fokal 35mm: f_eq = f * CF
    const eqF = f * cf;
    setEquivalentFocal(Number(eqF.toFixed(1)));
    setMagnificationFactor(Number(cf.toFixed(2)));

    // 2. Ambil dimensi sensor aktif
    const activeSpecKey = String(cf) in SENSOR_SPECS ? String(cf) : "1.5";
    const spec = SENSOR_SPECS[activeSpecKey] || {
      widthMm: 36.0 / cf,
      heightMm: 24.0 / cf,
      diagonalMm: 43.27 / cf,
    };

    // 3. Rumus Sudut Pandang Trigonometri Rectilinear:
    // FoV = 2 * arctan(sensor_dimension / (2 * f)) * (180 / PI)
    const radToDeg = 180 / Math.PI;
    const fovDiag = 2 * Math.atan(spec.diagonalMm / (2 * f)) * radToDeg;
    const fovHoriz = 2 * Math.atan(spec.widthMm / (2 * f)) * radToDeg;
    const fovVert = 2 * Math.atan(spec.heightMm / (2 * f)) * radToDeg;

    setDiagonalFov(Number(fovDiag.toFixed(1)));
    setHorizontalFov(Number(fovHoriz.toFixed(1)));
    setVerticalFov(Number(fovVert.toFixed(1)));

    // 4. Klasifikasi Sudut Pandang berdasarkan Fokal Ekuivalen 35mm
    if (eqF < 24) {
      setClassification({
        label: "Ultra-Wide Angle",
        category: "Lensa Sudut Ultra Lebar",
        description: "Mencakup bidang pandang panorama yang sangat lapang. Objek di dekat lensa tampak dramatis dan megah.",
        recommendedUse: "Fotografi Lanskap, Arsitektur Interior, Astrofotografi Milky Way",
        badgeBg: "bg-purple-500/10",
        badgeBorder: "border-purple-500/30",
        badgeColor: "text-purple-400",
      });
    } else if (eqF < 40) {
      setClassification({
        label: "Wide Angle",
        category: "Lensa Sudut Lebar",
        description: "Sudut pandang kontekstual yang ideal untuk menceritakan interaksi subjek dengan lingkungannya.",
        recommendedUse: "Street Photography, Jurnalisme Visual, Dokumenter Lingkungan",
        badgeBg: "bg-blue-500/10",
        badgeBorder: "border-blue-500/30",
        badgeColor: "text-blue-400",
      });
    } else if (eqF <= 60) {
      setClassification({
        label: "Standard / Normal",
        category: "Lensa Standar Alami",
        description: "Memberikan perspektif spasial yang menyerupai sudut penglihatan fokus mata manusia tanpa distorsi optik berlebih.",
        recommendedUse: "Fotografi Sehari-hari, Human Interest, Produk, Dokumentasi",
        badgeBg: "bg-emerald-500/10",
        badgeBorder: "border-emerald-500/30",
        badgeColor: "text-emerald-400",
      });
    } else if (eqF <= 135) {
      setClassification({
        label: "Short Telephoto / Portrait",
        category: "Lensa Potret & Modeling",
        description: "Memberikan kompresi perspektif yang proporsional untuk foto potret wajah tanpa distorsi hidung.",
        recommendedUse: "Foto Potret, Modeling, Human Interest, Studio",
        badgeBg: "bg-amber-500/10",
        badgeBorder: "border-amber-500/30",
        badgeColor: "text-amber-400",
      });
    } else if (eqF <= 300) {
      setClassification({
        label: "Medium Telephoto",
        category: "Lensa Tele Menengah",
        description: "Memperbesar subjek yang jauh dan mengompresi latar belakang secara tajam dengan pemisahan objek superior.",
        recommendedUse: "Olahraga Lapangan Luar, Konser Musik, Dokumentasi Aksi Jarak Jauh",
        badgeBg: "bg-orange-500/10",
        badgeBorder: "border-orange-500/30",
        badgeColor: "text-orange-400",
      });
    } else {
      setClassification({
        label: "Super Telephoto",
        category: "Lensa Super Jauh",
        description: "Jangkauan optik ekstrem untuk mengabadikan detail subjek satwa liar dan aksi berkecepatan tinggi dari jarak aman.",
        recommendedUse: "Birding (Burung Liar), Safari Alam Bebas, Astro-fotografi Bulan",
        badgeBg: "bg-rose-500/10",
        badgeBorder: "border-rose-500/30",
        badgeColor: "text-rose-400",
      });
    }
  }, [focalLength, cropFactor]);

  // Eksekusi kalkulasi otomatis saat state berubah (Real-time synchronization)
  React.useEffect(() => {
    calculateOptics();
  }, [calculateOptics]);

  const handleReset = () => {
    setFocalLength(50);
    setCropFactor(1.5);
  };

  const activeSensorKey = String(cropFactor ?? 1.5);
  const currentSensor = SENSOR_SPECS[activeSensorKey] || SENSOR_SPECS["1.5"];

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <Card className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-surface to-surface">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              Kalkulator FoV & Crop Factor Kamera
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                Presisi Optik
              </span>
            </h2>
            <p className="text-sm text-secondary">
              Hitung fokal ekuivalen 35mm, sudut pandang diagonal, horizontal, dan vertikal secara real-time.
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={handleReset}
          className="flex items-center gap-2 text-sm self-stretch md:self-auto justify-center"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Default
        </Button>
      </Card>

      {/* Preset Fokal Cepat */}
      <Card className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Sparkles className="w-4 h-4 text-accent" />
          Preset Lensa Populer
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {QUICK_PRESETS.map((preset) => {
            const isSelected = focalLength === preset.focal;
            return (
              <button
                key={preset.focal}
                type="button"
                onClick={() => setFocalLength(preset.focal)}
                className={cn(
                  "flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer",
                  isSelected
                    ? "bg-accent/20 border-accent text-accent shadow-sm"
                    : "bg-base border-border text-secondary hover:border-accent/40 hover:text-primary"
                )}
              >
                <span className="text-xs font-bold">{preset.focal} mm</span>
                <span className="text-[10px] text-secondary line-clamp-1">
                  {preset.description.split("&")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Form Input Parameter Teknis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col gap-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary border-b border-border pb-3">
            <Sliders className="w-4 h-4 text-accent" />
            Parameter Fisik Lensa & Sensor
          </div>

          <div className="flex flex-col gap-4">
            <Input
              label="Panjang Fokus Fisik Lensa (Focal Length)"
              type="number"
              value={focalLength ?? 50}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setFocalLength(isNaN(val) ? 50 : Math.max(1, Math.min(2000, val)));
              }}
              suffix="mm"
              placeholder="50"
              helperText="Panjang fokal fisik optik yang tercetak pada lensa (contoh: 24, 35, 50, 85mm)"
            />

            <Select
              label="Format Sensor Kamera & Crop Factor"
              value={String(cropFactor ?? 1.5)}
              onChange={(e) => setCropFactor(parseFloat(e.target.value))}
              helperText={`Sensor aktif: ${currentSensor.widthMm} × ${currentSensor.heightMm} mm (Diagonal: ${currentSensor.diagonalMm} mm)`}
            >
              <option value="1">Full Frame (1.0x — 36 × 24 mm)</option>
              <option value="1.5">APS-C Sony / Nikon / Fuji (1.5x — ~23.6 × 15.6 mm)</option>
              <option value="1.6">APS-C Canon (1.6x — ~22.2 × 14.8 mm)</option>
              <option value="2">Micro Four Thirds / M4/3 (2.0x — 17.3 × 13.0 mm)</option>
              <option value="2.7">1-Inch Type (2.7x — 13.2 × 8.8 mm)</option>
            </Select>

            <div className="p-3.5 rounded-xl bg-base border border-border flex flex-col gap-1.5 text-xs">
              <span className="font-semibold text-primary flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-accent" />
                Info Format Sensor: {currentSensor.name}
              </span>
              <p className="text-secondary">{currentSensor.description}</p>
              <p className="text-secondary/80">
                <strong className="text-primary/90">Kamera Populer:</strong> {currentSensor.commonCameras}
              </p>
            </div>
          </div>
        </Card>

        {/* Klasifikasi Sudut Pandang */}
        <Card className="flex flex-col justify-between gap-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary border-b border-border pb-3">
            <Compass className="w-4 h-4 text-accent" />
            Karakteristik & Klasifikasi Sudut Pandang
          </div>

          <div className="flex flex-col gap-3">
            <div
              className={cn(
                "p-4 rounded-xl border flex flex-col gap-2 transition-all",
                classification.badgeBg,
                classification.badgeBorder
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn("text-sm font-bold", classification.badgeColor)}>
                  {classification.label}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-base/80 border border-border text-primary font-mono">
                  {equivalentFocal} mm (35mm Eq.)
                </span>
              </div>
              <p className="text-xs text-secondary leading-relaxed">
                {classification.description}
              </p>
              <div className="text-[11px] pt-1 border-t border-border/50 text-secondary">
                <strong className="text-primary">Rekomendasi Penggunaan:</strong>{" "}
                {classification.recommendedUse}
              </div>
            </div>

            {/* Visualisasi Framing Sensor Terhadap Full Frame */}
            <div className="p-4 rounded-xl bg-base border border-border flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-semibold text-primary">
                <span className="flex items-center gap-1.5">
                  <Scan className="w-3.5 h-3.5 text-indigo-400" />
                  Simulasi Komparasi Framing Sensor
                </span>
                <span className="text-[11px] text-secondary font-mono">
                  Crop: {magnificationFactor}x
                </span>
              </div>

              {/* Diagram Framing Aspect Ratio */}
              <div className="relative w-full h-36 bg-elevated rounded-lg border border-border flex items-center justify-center overflow-hidden p-2">
                {/* Full Frame Outer Guide */}
                <div className="absolute inset-3 border border-dashed border-secondary/40 rounded flex flex-col justify-between p-1.5 pointer-events-none">
                  <span className="text-[9px] text-secondary font-mono">
                    Full Frame 35mm (1.0x / 36×24mm)
                  </span>
                  <span className="text-[9px] text-secondary/70 self-end font-mono">
                    Diagonal: 43.3mm
                  </span>
                </div>

                {/* Cropped Area Guide */}
                <div
                  className="relative border-2 border-accent bg-accent/15 rounded flex flex-col items-center justify-center transition-all duration-300 shadow-lg"
                  style={{
                    width: `${Math.max(25, Math.min(100, (1 / (cropFactor ?? 1.5)) * 90))}%`,
                    height: `${Math.max(25, Math.min(100, (1 / (cropFactor ?? 1.5)) * 85))}%`,
                  }}
                >
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-base/90 border border-accent/40 text-[10px] font-bold text-accent shadow-sm">
                    <Grid className="w-2.5 h-2.5" />
                    {cropFactor}x Crop
                  </div>
                  <span className="text-[9px] text-primary/80 font-mono mt-0.5">
                    {currentSensor.widthMm} × {currentSensor.heightMm} mm
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-secondary text-center">
                Sensor crop memotong tepi lingkaran gambar lensa, mempersempit sudut pandang (FoV) seperti memakai lensa {equivalentFocal}mm pada Full Frame.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Rincian Output Metrik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <OutputBox
          label="Fokal Ekuivalen Full Frame (35mm)"
          value={equivalentFocal}
          suffix=" mm"
          decimals={1}
        />
        <OutputBox
          label="Sudut Pandang Diagonal (FoV)"
          value={diagonalFov}
          suffix="°"
          decimals={1}
        />
        <OutputBox
          label="Sudut Pandang Horizontal (H-FoV)"
          value={horizontalFov}
          suffix="°"
          decimals={1}
        />
        <OutputBox
          label="Sudut Pandang Vertikal (V-FoV)"
          value={verticalFov}
          suffix="°"
          decimals={1}
        />
      </div>

      {/* Tabel Matriks Fokal Lensa Ekuivalen Antar Format Sensor */}
      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Layers className="w-4 h-4 text-accent" />
            Matriks Ekuivalensi Fokal Lensa untuk Sudut Pandang ({diagonalFov}°) yang Sama
          </div>
          <span className="text-xs text-secondary hidden sm:inline-block">
            Target Ekuivalen: {equivalentFocal}mm (35mm)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-secondary font-medium bg-base">
                <th className="p-3">Format Sensor</th>
                <th className="p-3">Faktor Crop</th>
                <th className="p-3">Dimensi Sensor (mm)</th>
                <th className="p-3 font-semibold text-primary">Panjang Fokal Fisik Dibutuhkan</th>
                <th className="p-3">Sudut Pandang Diagonal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Object.entries(SENSOR_SPECS).map(([key, spec]) => {
                const requiredFocal = (equivalentFocal / spec.cropFactor).toFixed(1);
                const isCurrent = key === String(cropFactor ?? 1.5);
                return (
                  <tr
                    key={key}
                    className={cn(
                      "transition-colors",
                      isCurrent
                        ? "bg-accent/10 font-medium text-accent"
                        : "hover:bg-elevated text-secondary"
                    )}
                  >
                    <td className="p-3 flex items-center gap-1.5 text-primary">
                      {isCurrent && <ShieldCheck className="w-3.5 h-3.5 text-accent" />}
                      {spec.name}
                    </td>
                    <td className="p-3 font-mono">{spec.cropFactor}x</td>
                    <td className="p-3 font-mono">
                      {spec.widthMm} × {spec.heightMm} mm
                    </td>
                    <td className="p-3 font-mono font-bold text-accent">
                      {requiredFocal} mm
                    </td>
                    <td className="p-3 font-mono">{diagonalFov}°</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edukasi Teknis & Standar Optik */}
      <Card className="flex flex-col gap-3 bg-base/50">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Eye className="w-4 h-4 text-accent" />
          Kaidah Fisika Optik & Sensor Crop
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-secondary leading-relaxed">
          <div className="p-3 rounded-lg bg-surface border border-border">
            <span className="font-semibold text-primary block mb-1">
              1. Fokal Fisik Tidak Pernah Berubah
            </span>
            Lensa 50mm tetap memiliki panjang fokus optik fisik 50mm pada bodi apa pun. Sensor crop hanya memotong (*crop*) proyeksi lingkaran gambar cahaya.
          </div>
          <div className="p-3 rounded-lg bg-surface border border-border">
            <span className="font-semibold text-primary block mb-1">
              2. Sudut Pandang (FoV) Menyempit
            </span>
            Karena area penangkap sensor lebih kecil dari bidang 35mm, sudut pandang menyempit menyerupai lensa fokal lebih panjang pada sensor Full Frame.
          </div>
          <div className="p-3 rounded-lg bg-surface border border-border">
            <span className="font-semibold text-primary block mb-1">
              3. Kedalaman Ruang & Bokeh Ekuivalen
            </span>
            Untuk framing dan sudut pandang yang sama, sensor crop menghasilkan Depth of Field (DoF) yang lebih dalam dibandingkan sensor Full Frame pada f-number yang sama.
          </div>
        </div>
      </Card>
    </div>
  );
}