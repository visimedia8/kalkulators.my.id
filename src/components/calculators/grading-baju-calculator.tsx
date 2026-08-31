"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Ruler,
  Scissors,
  Shirt,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Info,
  Layers,
  Copy,
  Check,
} from "lucide-react";
import { useQueryState, parseAsString, parseAsFloat } from "nuqs";

const SIZES = ["S", "M", "L", "XL", "XXL"] as const;
type SizeName = (typeof SIZES)[number];

interface SizeGradingResult {
  size: SizeName;
  isBase: boolean;
  deltaStep: number;
  lebarDada: number;
  lingkarDada: number;
  panjangBadan: number;
  lebarBahu: number;
  panjangLengan: number;
}

const PRESET_PATTERNS: Record<
  string,
  {
    name: string;
    lebarDada: number;
    panjangBadan: number;
    lebarBahu: number;
    panjangLengan: number;
    incDada: number;
    incPanjang: number;
    incBahu: number;
    incLengan: number;
  }
> = {
  tshirt: {
    name: "Kaos Polos / T-Shirt Reguler",
    lebarDada: 50,
    panjangBadan: 70,
    lebarBahu: 44,
    panjangLengan: 24,
    incDada: 2,
    incPanjang: 2,
    incBahu: 1.5,
    incLengan: 1,
  },
  kemeja: {
    name: "Kemeja Pria (Kasual / Formal)",
    lebarDada: 52,
    panjangBadan: 72,
    lebarBahu: 45,
    panjangLengan: 25,
    incDada: 2.5,
    incPanjang: 2,
    incBahu: 1.5,
    incLengan: 1.5,
  },
  hoodie: {
    name: "Hoodie / Jaket Crewneck",
    lebarDada: 56,
    panjangBadan: 68,
    lebarBahu: 48,
    panjangLengan: 60,
    incDada: 3,
    incPanjang: 2,
    incBahu: 2,
    incLengan: 1.5,
  },
  blouse: {
    name: "Blouse / Kemeja Wanita",
    lebarDada: 48,
    panjangBadan: 65,
    lebarBahu: 39,
    panjangLengan: 22,
    incDada: 2,
    incPanjang: 1.5,
    incBahu: 1,
    incLengan: 1,
  },
};

export function GradingBajuCalculator() {
  // 1. URL State Synchronized via nuqs
  const [ukuranDasar, setUkuranDasar] = useQueryState(
    "ukuranDasar",
    parseAsString.withDefault("M")
  );
  const [lebarDadaDasar, setLebarDadaDasar] = useQueryState(
    "lebarDada",
    parseAsFloat.withDefault(50)
  );
  const [panjangBadanDasar, setPanjangBadanDasar] = useQueryState(
    "panjangBadan",
    parseAsFloat.withDefault(70)
  );
  const [lebarBahuDasar, setLebarBahuDasar] = useQueryState(
    "lebarBahu",
    parseAsFloat.withDefault(44)
  );
  const [panjangLenganDasar, setPanjangLenganDasar] = useQueryState(
    "panjangLengan",
    parseAsFloat.withDefault(24)
  );
  const [incrementDada, setIncrementDada] = useQueryState(
    "increment",
    parseAsFloat.withDefault(2)
  );
  const [incrementPanjang, setIncrementPanjang] = useQueryState(
    "incrementPanjang",
    parseAsFloat.withDefault(2)
  );
  const [incrementBahu, setIncrementBahu] = useQueryState(
    "incrementBahu",
    parseAsFloat.withDefault(1.5)
  );
  const [incrementLengan, setIncrementLengan] = useQueryState(
    "incrementLengan",
    parseAsFloat.withDefault(1)
  );
  const [presetPola, setPresetPola] = useQueryState(
    "preset",
    parseAsString.withDefault("tshirt")
  );

  const [copied, setCopied] = React.useState<boolean>(false);

  // 2. Kalkulasi Tabel Gradasi S, M, L, XL, XXL
  const gradingTable: SizeGradingResult[] = React.useMemo(() => {
    const baseIdx = SIZES.indexOf((ukuranDasar as SizeName) || "M");
    const validBaseIdx = baseIdx >= 0 ? baseIdx : 1; // Default M

    const baseLD = lebarDadaDasar ?? 50;
    const basePB = panjangBadanDasar ?? 70;
    const baseLB = lebarBahuDasar ?? 44;
    const basePL = panjangLenganDasar ?? 24;

    const incLD = incrementDada ?? 2;
    const incPB = incrementPanjang ?? 2;
    const incLB = incrementBahu ?? 1.5;
    const incPL = incrementLengan ?? 1;

    return SIZES.map((size, index) => {
      const deltaStep = index - validBaseIdx;
      const ld = Number((baseLD + deltaStep * incLD).toFixed(1));
      const pb = Number((basePB + deltaStep * incPB).toFixed(1));
      const lb = Number((baseLB + deltaStep * incLB).toFixed(1));
      const pl = Number((basePL + deltaStep * incPL).toFixed(1));

      return {
        size,
        isBase: index === validBaseIdx,
        deltaStep,
        lebarDada: ld,
        lingkarDada: Number((ld * 2).toFixed(1)),
        panjangBadan: pb,
        lebarBahu: lb,
        panjangLengan: pl,
      };
    });
  }, [
    ukuranDasar,
    lebarDadaDasar,
    panjangBadanDasar,
    lebarBahuDasar,
    panjangLenganDasar,
    incrementDada,
    incrementPanjang,
    incrementBahu,
    incrementLengan,
  ]);

  // Metrik Ringkasan
  const minLebarDada = gradingTable[0]?.lebarDada ?? 48;
  const maxLebarDada = gradingTable[gradingTable.length - 1]?.lebarDada ?? 56;
  const lingkarDadaBase = (lebarDadaDasar ?? 50) * 2;
  const totalRentangDada = Number((maxLebarDada - minLebarDada).toFixed(1));

  const handleApplyPreset = (presetKey: string) => {
    const preset = PRESET_PATTERNS[presetKey];
    if (preset) {
      setPresetPola(presetKey);
      setLebarDadaDasar(preset.lebarDada);
      setPanjangBadanDasar(preset.panjangBadan);
      setLebarBahuDasar(preset.lebarBahu);
      setPanjangLenganDasar(preset.panjangLengan);
      setIncrementDada(preset.incDada);
      setIncrementPanjang(preset.incPanjang);
      setIncrementBahu(preset.incBahu);
      setIncrementLengan(preset.incLengan);
    }
  };

  const handleReset = () => {
    setUkuranDasar("M");
    handleApplyPreset("tshirt");
  };

  const handleCopySpec = () => {
    const header = "Size\tLebar Dada (cm)\tLingkar Dada (cm)\tPanjang Badan (cm)\tLebar Bahu (cm)\tPanjang Lengan (cm)";
    const rows = gradingTable.map(
      (r) =>
        `${r.size}${r.isBase ? " (Base)" : ""}\t${r.lebarDada}\t${r.lingkarDada}\t${r.panjangBadan}\t${r.lebarBahu}\t${r.panjangLengan}`
    );
    const text = [header, ...rows].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Kolom Parameter Input */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Pola Master & Gradasi
                </h2>
                <p className="text-secondary text-sm">
                  Kalkulasi presisi grading pola garmen standar industri
                </p>
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
            <div className="sm:col-span-2">
              <Select
                label="Preset Template Siluet Garmen"
                value={presetPola || "tshirt"}
                onChange={(e) => handleApplyPreset(e.target.value)}
                helperText="Pilih template untuk mengisi parameter teknis awal secara otomatis"
              >
                <option value="tshirt">Kaos Polos / T-Shirt Reguler</option>
                <option value="kemeja">Kemeja Pria (Kasual / Formal)</option>
                <option value="hoodie">Hoodie / Jaket Crewneck</option>
                <option value="blouse">Blouse / Kemeja Wanita</option>
              </Select>
            </div>

            <Select
              label="Ukuran Dasar Acuan (Base Size)"
              value={ukuranDasar || "M"}
              onChange={(e) => setUkuranDasar(e.target.value)}
              helperText="Pola master awal yang dijadikan patokan gradasi"
            >
              <option value="S">Ukuran S (Small)</option>
              <option value="M">Ukuran M (Medium - Rekomendasi)</option>
              <option value="L">Ukuran L (Large)</option>
              <option value="XL">Ukuran XL (Extra Large)</option>
              <option value="XXL">Ukuran XXL (Double XL)</option>
            </Select>

            <Input
              label={`Lebar Dada Pola ${ukuranDasar} (Half Chest)`}
              type="number"
              min={30}
              max={100}
              step={0.5}
              value={lebarDadaDasar ?? ""}
              onChange={(e) =>
                setLebarDadaDasar(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              suffix="cm"
              helperText="Diukur mendatar dari bawah ketiak kiri ke kanan"
            />

            <Input
              label={`Panjang Badan Pola ${ukuranDasar}`}
              type="number"
              min={40}
              max={150}
              step={0.5}
              value={panjangBadanDasar ?? ""}
              onChange={(e) =>
                setPanjangBadanDasar(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              suffix="cm"
              helperText="Diukur dari titik bahu tertinggi (HPS) ke kelim bawah"
            />

            <Input
              label={`Lebar Bahu Pola ${ukuranDasar}`}
              type="number"
              min={25}
              max={70}
              step={0.5}
              value={lebarBahuDasar ?? ""}
              onChange={(e) =>
                setLebarBahuDasar(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              suffix="cm"
              helperText="Ujung tulang bahu kiri ke bahu kanan"
            />

            <Input
              label={`Panjang Lengan Pola ${ukuranDasar}`}
              type="number"
              min={10}
              max={90}
              step={0.5}
              value={panjangLenganDasar ?? ""}
              onChange={(e) =>
                setPanjangLenganDasar(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              suffix="cm"
              helperText="Puncak kerung lengan ke ujung manset/bukaan lengan"
            />

            <div className="sm:col-span-2 pt-2 border-t border-border">
              <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-accent" />
                Parameter Nilai Gradasi (Increment Step tiap Ukuran)
              </h3>
            </div>

            <Input
              label="Selisih Lebar Dada (Increment)"
              type="number"
              min={0.5}
              max={10}
              step={0.5}
              value={incrementDada ?? ""}
              onChange={(e) =>
                setIncrementDada(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              suffix="cm/step"
              helperText="Standar konveksi: 2,0 cm (Total lingkar naik 4,0 cm)"
            />

            <Input
              label="Selisih Panjang Badan"
              type="number"
              min={0.5}
              max={10}
              step={0.5}
              value={incrementPanjang ?? ""}
              onChange={(e) =>
                setIncrementPanjang(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              suffix="cm/step"
              helperText="Standar industri: 1,5 - 2,5 cm per step ukuran"
            />

            <Input
              label="Selisih Lebar Bahu"
              type="number"
              min={0.2}
              max={5}
              step={0.1}
              value={incrementBahu ?? ""}
              onChange={(e) =>
                setIncrementBahu(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              suffix="cm/step"
              helperText="Standar industri: 1,0 - 1,5 cm per step"
            />

            <Input
              label="Selisih Panjang Lengan"
              type="number"
              min={0.2}
              max={5}
              step={0.1}
              value={incrementLengan ?? ""}
              onChange={(e) =>
                setIncrementLengan(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              suffix="cm/step"
              helperText="Standar industri: 0,5 - 1,5 cm per step"
            />
          </div>
        </Card>

        {/* Card Kaidah Teknis Pemotongan Garmen */}
        <Card className="flex flex-col gap-3 bg-base/50">
          <div className="flex items-center gap-2 text-primary font-medium text-sm">
            <Info className="w-4 h-4 text-accent" />
            <span>Kaidah Presisi Grading Pola Garmen</span>
          </div>
          <div className="text-xs text-secondary leading-relaxed space-y-1.5">
            <p>
              • <strong>Keseimbangan Proporsi:</strong> Setiap penambahan 2 cm pada setengah lebar dada merefleksikan peningkatan 4 cm pada lingkar dada penuh (*full chest circumference*).
            </p>
            <p>
              • <strong>Kerung Lengan & Bahu:</strong> Pergeseran bahu berkisar antara 1,0–1,5 cm per ukuran guna menjaga lingkar kerung lengan (*armhole*) tetap ergonomis tanpa menarik badan baju.
            </p>
            <p>
              • <strong>Batu Uji Master Pattern:</strong> Pastikan pola ukuran master (M) telah melewati uji coba jahit sampel (*fitting sample*) sebelum melipatgandakan ukuran ke S hingga XXL.
            </p>
          </div>
        </Card>
      </div>

      {/* Kolom Output & Tabel Grading */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        <Card className="flex flex-col gap-5 border-accent/30 shadow-lg bg-surface">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-lg text-primary">
                Hasil Gradasi Pola Presisi (S – XXL)
              </h3>
            </div>
            <Button
              variant="secondary"
              onClick={handleCopySpec}
              className="text-xs px-3 py-1.5 h-auto min-h-0 flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-accent" />
                  Tersalin
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Salin Data
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <OutputBox
              label={`Lebar Dada (${ukuranDasar})`}
              value={lebarDadaDasar ?? 50}
              suffix=" cm"
              decimals={1}
            />
            <OutputBox
              label={`Lingkar Penuh (${ukuranDasar})`}
              value={lingkarDadaBase}
              suffix=" cm"
              decimals={1}
            />
            <OutputBox
              label="Rentang S ke XXL"
              value={totalRentangDada}
              suffix=" cm"
              decimals={1}
            />
          </div>

          {/* Tabel Matriks Spesifikasi Grading Ukuran */}
          <div className="overflow-x-auto rounded-xl border border-border bg-base">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-elevated/70 text-secondary">
                  <th className="py-3 px-3.5 font-semibold text-primary">Size</th>
                  <th className="py-3 px-3 font-semibold">Lebar Dada</th>
                  <th className="py-3 px-3 font-semibold">Lingkar Dada</th>
                  <th className="py-3 px-3 font-semibold">Panjang</th>
                  <th className="py-3 px-3 font-semibold">Bahu</th>
                  <th className="py-3 px-3 font-semibold">Lengan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-primary font-mono">
                {gradingTable.map((row) => (
                  <tr
                    key={row.size}
                    className={`transition-colors ${
                      row.isBase
                        ? "bg-accent/15 font-semibold text-accent border-l-4 border-l-accent"
                        : "hover:bg-elevated/50"
                    }`}
                  >
                    <td className="py-3 px-3.5 font-sans font-medium flex items-center gap-1.5">
                      <span className="text-sm">{row.size}</span>
                      {row.isBase && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-accent text-white font-sans uppercase">
                          Base
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">{row.lebarDada} cm</td>
                    <td className="py-3 px-3">{row.lingkarDada} cm</td>
                    <td className="py-3 px-3">{row.panjangBadan} cm</td>
                    <td className="py-3 px-3">{row.lebarBahu} cm</td>
                    <td className="py-3 px-3">{row.panjangLengan} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rangkuman Parameter Teknis */}
          <div className="p-4 rounded-xl bg-base border border-border flex flex-col gap-2 text-xs">
            <div className="flex justify-between items-center text-secondary">
              <span>Siluet / Pola:</span>
              <span className="font-medium text-primary">
                {PRESET_PATTERNS[presetPola]?.name || "Kustom"}
              </span>
            </div>
            <div className="flex justify-between items-center text-secondary">
              <span>Ukuran Master Acuan:</span>
              <span className="font-medium text-primary">
                Size {ukuranDasar} (Step: 0)
              </span>
            </div>
            <div className="flex justify-between items-center text-secondary">
              <span>Pertambahan per Step (Increment):</span>
              <span className="font-medium text-accent font-mono">
                LD +{incrementDada} cm | PB +{incrementPanjang} cm | Bahu +{incrementBahu} cm
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-secondary pt-1">
            <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
            <span>Parameter teknis terkalibrasi standar penjahit konveksi & garmen Indonesia.</span>
          </div>
        </Card>
      </div>
    </div>
  );
}