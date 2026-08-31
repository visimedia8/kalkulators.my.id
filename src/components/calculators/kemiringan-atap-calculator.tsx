// File: src/components/calculators/kemiringan-atap-calculator.tsx
"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Triangle,
  Calculator,
  RefreshCw,
  Ruler,
  Maximize2,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import { useQueryState, parseAsFloat, parseAsString } from "nuqs";

interface MaterialStandard {
  label: string;
  minPitch: number;
  maxPitch: number;
  recommendedPitch: number;
  description: string;
}

const MATERIAL_STANDARDS: Record<string, MaterialStandard> = {
  "genteng-keramik": {
    label: "Genteng Keramik / Glazur",
    minPitch: 25,
    maxPitch: 45,
    recommendedPitch: 30,
    description: "Standar SNI menyarankan sudut 30°–35° agar air hujan mengalir deras tanpa risiko tampias.",
  },
  "genteng-tanah-liat": {
    label: "Genteng Tanah Liat / Plentong",
    minPitch: 25,
    maxPitch: 40,
    recommendedPitch: 30,
    description: "Memerlukan kemiringan minimal 25°–30° untuk mencegah genangan kapiler di sela sambungan interlock.",
  },
  "genteng-beton": {
    label: "Genteng Beton (Flat / Gelombang)",
    minPitch: 25,
    maxPitch: 40,
    recommendedPitch: 35,
    description: "Bobot material berat; sudut optimal 30°–35° menjamin distribusi beban gravitasi dan kerapatan modul.",
  },
  "spandek-metal": {
    label: "Atap Spandek / Seng Metal Galvalum",
    minPitch: 5,
    maxPitch: 25,
    recommendedPitch: 12,
    description: "Bisa dipasang landai (5°–15°) berkat lembaran panjang tanpa sambungan horizontal rapat.",
  },
  "genteng-bitumen": {
    label: "Genteng Aspal / Bitumen Selulosa",
    minPitch: 15,
    maxPitch: 60,
    recommendedPitch: 25,
    description: "Fleksibel dan kedap air tinggi; dapat diaplikasikan pada atap landai (15°) hingga sangat curam (60°).",
  },
  "sirap-kayu": {
    label: "Sirap Kayu Ulin",
    minPitch: 25,
    maxPitch: 50,
    recommendedPitch: 40,
    description: "Membutuhkan sudut curam minimal 35°–40° agar serat kayu cepat kering dan terhindar dari pelapukan.",
  },
};

export function KemiringanAtapCalculator() {
  // State Input (URL Synced via nuqs)
  const [panjangBangunan, setPanjangBangunan] = useQueryState(
    "panjangBangunan",
    parseAsFloat.withDefault(10)
  );
  const [lebarBangunan, setLebarBangunan] = useQueryState(
    "lebarBangunan",
    parseAsFloat.withDefault(8)
  );
  const [sudutKemiringan, setSudutKemiringan] = useQueryState(
    "sudutKemiringan",
    parseAsFloat.withDefault(30)
  );
  const [overstek, setOverstek] = useQueryState(
    "overstek",
    parseAsFloat.withDefault(0.8)
  );
  const [materialPreset, setMaterialPreset] = useQueryState(
    "material",
    parseAsString.withDefault("genteng-keramik")
  );

  // State Output
  const [setengahBentang, setSetengahBentang] = React.useState<number>(0);
  const [tinggiAtap, setTinggiAtap] = React.useState<number>(0);
  const [panjangKaso, setPanjangKaso] = React.useState<number>(0);
  const [panjangTotalBangunan, setPanjangTotalBangunan] = React.useState<number>(0);
  const [luasAtapTotal, setLuasAtapTotal] = React.useState<number>(0);
  const [luasDenganWaste, setLuasDenganWaste] = React.useState<number>(0);
  const [kemiringanPersen, setKemiringanPersen] = React.useState<number>(0);
  const [statusMaterial, setStatusMaterial] = React.useState<{
    isValid: boolean;
    statusText: string;
    description: string;
  }>({
    isValid: true,
    statusText: "Optimal",
    description: "",
  });

  const calculateRoof = React.useCallback(() => {
    const panjang = Math.max(0.1, panjangBangunan || 0);
    const lebar = Math.max(0.1, lebarBangunan || 0);
    const sudut = Math.min(85, Math.max(1, sudutKemiringan || 1));
    const ovstk = Math.max(0, overstek || 0);

    // Konversi Sudut ke Radian
    const sudutRadian = (sudut * Math.PI) / 180;
    const tanSudut = Math.tan(sudutRadian);
    const cosSudut = Math.cos(sudutRadian);

    // 1. Setengah Bentang = (Lebar Bangunan / 2) + Overstek
    const calculatedSetengahBentang = lebar / 2 + ovstk;

    // 2. Tinggi Atap = Setengah Bentang * tan(sudutKemiringan)
    const calculatedTinggiAtap = calculatedSetengahBentang * tanSudut;

    // 3. Panjang Rangka Miring (Kaso) = Setengah Bentang / cos(sudutKemiringan)
    const calculatedPanjangKaso = calculatedSetengahBentang / cosSudut;

    // 4. Panjang Total Bangunan Termasuk Overstek Depan-Belakang
    const calculatedPanjangTotal = panjang + 2 * ovstk;

    // 5. Luas Atap Total = 2 x (Panjang Bangunan + 2 x Overstek) x Panjang Rangka Miring
    const calculatedLuasAtap = 2 * calculatedPanjangTotal * calculatedPanjangKaso;

    // 6. Luas Atap dengan Waste Factor 10% (Standar Pemotongan Rangka & Penutup)
    const calculatedLuasWaste = calculatedLuasAtap * 1.1;

    // 7. Kemiringan dalam Persentase (%)
    const calculatedKemiringanPersen = tanSudut * 100;

    // Update States
    setSetengahBentang(parseFloat(calculatedSetengahBentang.toFixed(2)));
    setTinggiAtap(parseFloat(calculatedTinggiAtap.toFixed(2)));
    setPanjangKaso(parseFloat(calculatedPanjangKaso.toFixed(2)));
    setPanjangTotalBangunan(parseFloat(calculatedPanjangTotal.toFixed(2)));
    setLuasAtapTotal(parseFloat(calculatedLuasAtap.toFixed(2)));
    setLuasDenganWaste(parseFloat(calculatedLuasWaste.toFixed(2)));
    setKemiringanPersen(parseFloat(calculatedKemiringanPersen.toFixed(1)));

    // Evaluasi Kesesuaian Material berdasarkan Sudut
    const activeMat = MATERIAL_STANDARDS[materialPreset || "genteng-keramik"];
    if (activeMat) {
      if (sudut < activeMat.minPitch) {
        setStatusMaterial({
          isValid: false,
          statusText: "Sudut Terlalu Landai",
          description: `Sudut ${sudut}° berada di bawah batas minimum ${activeMat.minPitch}° untuk ${activeMat.label}. Rawan kebocoran kapiler atau tampias saat hujan lebat.`,
        });
      } else if (sudut > activeMat.maxPitch) {
        setStatusMaterial({
          isValid: false,
          statusText: "Sudut Terlalu Curam",
          description: `Sudut ${sudut}° melebihi batas umum ${activeMat.maxPitch}° untuk ${activeMat.label}. Membutuhkan perkuatan klem/paku ekstra agar penutup tidak merosot.`,
        });
      } else {
        setStatusMaterial({
          isValid: true,
          statusText: "Sesuai Standar Industri",
          description: activeMat.description,
        });
      }
    }
  }, [panjangBangunan, lebarBangunan, sudutKemiringan, overstek, materialPreset]);

  React.useEffect(() => {
    calculateRoof();
  }, [calculateRoof]);

  const handleReset = () => {
    setPanjangBangunan(10);
    setLebarBangunan(8);
    setSudutKemiringan(30);
    setOverstek(0.8);
    setMaterialPreset("genteng-keramik");
  };

  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value;
    setMaterialPreset(key);
    const standard = MATERIAL_STANDARDS[key];
    if (standard) {
      setSudutKemiringan(standard.recommendedPitch);
    }
  };

  const applyPreset = (p: number, l: number, s: number, o: number, mat: string) => {
    setPanjangBangunan(p);
    setLebarBangunan(l);
    setSudutKemiringan(s);
    setOverstek(o);
    setMaterialPreset(mat);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Parameter Input Section */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Triangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Teknis Kemiringan Atap
                </h2>
                <p className="text-secondary text-sm">
                  Kalkulasi presisi geometri atap pelana, tinggi nok, kaso, dan luas bidang atap
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset parameter ke default"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-medium text-secondary">
              Preset Struktur Bangunan Cepat:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset(10, 8, 30, 0.8, "genteng-keramik")}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Rumah Tinggal (10x8m, 30°)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(12, 6, 12, 0.5, "spandek-metal")}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Gudang / Kanopi Spandek (12x6m, 12°)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(14, 9, 35, 1.0, "genteng-beton")}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Villa / Tropis Mewah (14x9m, 35°)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(6, 6, 40, 0.6, "sirap-kayu")}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Gazebo / Paviliun (6x6m, 40°)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <Select
                label="Standar Material Penutup Atap"
                value={materialPreset || "genteng-keramik"}
                onChange={handleMaterialChange}
                helperText="Memilih material akan otomatis menyesuaikan rekomendasi sudut kemiringan standar industri"
              >
                <option value="genteng-keramik">
                  Genteng Keramik / Glazur (Rekomendasi: 30° | Rentang: 25°–45°)
                </option>
                <option value="genteng-tanah-liat">
                  Genteng Tanah Liat / Plentong (Rekomendasi: 30° | Rentang: 25°–40°)
                </option>
                <option value="genteng-beton">
                  Genteng Beton Flat / Gelombang (Rekomendasi: 35° | Rentang: 25°–40°)
                </option>
                <option value="spandek-metal">
                  Spandek / Seng Metal Galvalum (Rekomendasi: 12° | Rentang: 5°–25°)
                </option>
                <option value="genteng-bitumen">
                  Genteng Aspal / Bitumen (Rekomendasi: 25° | Rentang: 15°–60°)
                </option>
                <option value="sirap-kayu">
                  Sirap Kayu Ulin (Rekomendasi: 40° | Rentang: 25°–50°)
                </option>
              </Select>
            </div>

            <Input
              label="Panjang Bangunan"
              type="number"
              min={1}
              max={100}
              step={0.1}
              value={panjangBangunan ?? ""}
              onChange={(e) =>
                setPanjangBangunan(e.target.value ? Number(e.target.value) : null)
              }
              suffix="m"
              helperText="Panjang dinding luar sejajar bubungan/nok"
            />

            <Input
              label="Lebar Bangunan (Bentang)"
              type="number"
              min={1}
              max={50}
              step={0.1}
              value={lebarBangunan ?? ""}
              onChange={(e) =>
                setLebarBangunan(e.target.value ? Number(e.target.value) : null)
              }
              suffix="m"
              helperText="Jarak bentang kuda-kuda dari dinding ke dinding"
            />

            <Input
              label="Sudut Kemiringan Atap"
              type="number"
              min={1}
              max={85}
              step={0.5}
              value={sudutKemiringan ?? ""}
              onChange={(e) =>
                setSudutKemiringan(e.target.value ? Number(e.target.value) : null)
              }
              suffix="° (derajat)"
              helperText={`Gradien kemiringan: ${kemiringanPersen}%`}
            />

            <Input
              label="Panjang Overstek (Titisan)"
              type="number"
              min={0}
              max={5}
              step={0.05}
              value={overstek ?? ""}
              onChange={(e) =>
                setOverstek(e.target.value ? Number(e.target.value) : null)
              }
              suffix="m"
              helperText="Kelebihan atap keluar dari garis dinding luar"
            />
          </div>

          <div className="pt-2">
            <Button
              onClick={calculateRoof}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Hitung Geometri & Luas Atap
            </Button>
          </div>
        </Card>
      </div>

      {/* Output & Breakdown Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <OutputBox
            label="Luas Bidang Atap Total"
            value={luasAtapTotal}
            suffix=" m²"
            decimals={2}
          />
          <OutputBox
            label="Tinggi Nok / Bubungan (Rise)"
            value={tinggiAtap}
            suffix=" m"
            decimals={2}
          />
        </div>

        {/* Material Evaluation Card */}
        <Card
          className={`flex flex-col gap-3 border ${
            statusMaterial.isValid
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-amber-500/30 bg-amber-500/5"
          }`}
        >
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles
                className={`w-4 h-4 ${
                  statusMaterial.isValid ? "text-emerald-400" : "text-amber-400"
                }`}
              />
              <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase">
                Verifikasi Standar Material
              </h3>
            </div>
            <span
              className={`flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-md border ${
                statusMaterial.isValid
                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                  : "text-amber-400 bg-amber-500/10 border-amber-500/20"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              {statusMaterial.statusText}
            </span>
          </div>

          <p className="text-xs text-secondary leading-relaxed">
            {statusMaterial.description}
          </p>
        </Card>

        {/* Detailed Geometric Breakdown */}
        <Card className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase border-b border-border pb-2 flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent" />
            Rincian Teknis Dimensi & Rangka
          </h3>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-secondary flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5" />
                Setengah Bentang Efektif (Run):
              </span>
              <span className="font-mono text-primary font-medium">
                {setengahBentang} m
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Tinggi Bubungan / Nok (Rise):</span>
              <span className="font-mono text-primary font-medium">
                {tinggiAtap} m
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Panjang Rangka Miring (Kaso):</span>
              <span className="font-mono text-accent font-semibold">
                {panjangKaso} m
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5" />
                Panjang Total Bidang Atap:
              </span>
              <span className="font-mono text-primary font-medium">
                {panjangTotalBangunan} m
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Kemiringan Gradien:</span>
              <span className="font-mono text-primary font-medium">
                {kemiringanPersen}% ({sudutKemiringan}°)
              </span>
            </div>

            <div className="flex justify-between items-center border-t border-border/50 pt-2">
              <span className="text-secondary font-medium">
                Luas Rangka Bersih (Net):
              </span>
              <span className="font-mono text-primary font-semibold">
                {luasAtapTotal} m²
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-accent" />
                Estimasi Kebutuhan (+10% Waste Margin):
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                {luasDenganWaste} m²
              </span>
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-center font-semibold">
              <span className="text-primary flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent" />
                Total Kebutuhan Bidang Atap:
              </span>
              <span className="font-mono text-accent text-base">
                {luasAtapTotal} m²
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}