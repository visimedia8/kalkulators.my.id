"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Scissors,
  RotateCcw,
  Calculator,
  Shirt,
  Ruler,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useQueryState, parseAsString, parseAsInteger, parseAsFloat } from "nuqs";

type GarmentType = "kemeja-pendek" | "kemeja-panjang" | "gamis" | "celana-panjang";
type FabricWidth = "115" | "150";
type GarmentSize = "s-m" | "l-xl" | "xxl";

// Lookup Matriks Kebutuhan Kain Standar Industri Konveksi & Garmen (dalam meter per pcs)
const FABRIC_CONSUMPTION_MAP: Record<GarmentType, Record<FabricWidth, Record<GarmentSize, number>>> = {
  "kemeja-pendek": {
    "115": { "s-m": 1.50, "l-xl": 1.75, "xxl": 2.00 },
    "150": { "s-m": 1.25, "l-xl": 1.50, "xxl": 1.75 },
  },
  "kemeja-panjang": {
    "115": { "s-m": 1.75, "l-xl": 2.00, "xxl": 2.25 },
    "150": { "s-m": 1.50, "l-xl": 1.75, "xxl": 2.00 },
  },
  "gamis": {
    "115": { "s-m": 3.00, "l-xl": 3.50, "xxl": 4.00 },
    "150": { "s-m": 2.50, "l-xl": 3.00, "xxl": 3.50 },
  },
  "celana-panjang": {
    "115": { "s-m": 1.50, "l-xl": 1.75, "xxl": 2.00 },
    "150": { "s-m": 1.25, "l-xl": 1.50, "xxl": 1.75 },
  },
};

const GARMENT_LABELS: Record<GarmentType, string> = {
  "kemeja-pendek": "Kemeja Lengan Pendek",
  "kemeja-panjang": "Kemeja Lengan Panjang",
  "gamis": "Gamis / Maxi Dress",
  "celana-panjang": "Celana Panjang Standar",
};

export function KainBajuCalculator() {
  // 1. URL State Synchronized via nuqs
  const [jenisBaju, setJenisBaju] = useQueryState(
    "jenisBaju",
    parseAsString.withDefault("kemeja-pendek")
  );
  const [lebarKain, setLebarKain] = useQueryState(
    "lebarKain",
    parseAsString.withDefault("150")
  );
  const [ukuran, setUkuran] = useQueryState(
    "ukuran",
    parseAsString.withDefault("l-xl")
  );
  const [jumlahPotong, setJumlahPotong] = useQueryState(
    "qty",
    parseAsInteger.withDefault(1)
  );
  const [marginSusut, setMarginSusut] = useQueryState(
    "margin",
    parseAsFloat.withDefault(5)
  );

  // 2. State Output
  const [kebutuhanPerPcs, setKebutuhanPerPcs] = React.useState<number>(1.5);
  const [totalKebutuhanMeter, setTotalKebutuhanMeter] = React.useState<number>(1.575);
  const [totalKebutuhanYard, setTotalKebutuhanYard] = React.useState<number>(1.72);
  const [estimasiRoll, setEstimasiRoll] = React.useState<number>(0.03);
  const [efisiensiPola, setEfisiensiPola] = React.useState<string>("Tinggi");

  const calculateKain = React.useCallback(() => {
    const validJenis = (jenisBaju in FABRIC_CONSUMPTION_MAP ? jenisBaju : "kemeja-pendek") as GarmentType;
    const validLebar = (lebarKain === "115" || lebarKain === "150" ? lebarKain : "150") as FabricWidth;
    const validUkuran = (ukuran === "s-m" || ukuran === "l-xl" || ukuran === "xxl" ? ukuran : "l-xl") as GarmentSize;

    const basePerPcs = FABRIC_CONSUMPTION_MAP[validJenis][validLebar][validUkuran];
    const qty = Math.max(1, jumlahPotong || 1);
    const margin = Math.max(0, marginSusut || 0);

    const perPcsBuffer = basePerPcs * (1 + margin / 100);
    const totalMeter = perPcsBuffer * qty;
    const totalYard = totalMeter * 1.09361; // 1 Meter = 1.09361 Yard
    const rollCount = totalYard / 50; // Standar 1 Roll Kain Komersial = 50 Yard

    setKebutuhanPerPcs(Number(perPcsBuffer.toFixed(2)));
    setTotalKebutuhanMeter(Number(totalMeter.toFixed(2)));
    setTotalKebutuhanYard(Number(totalYard.toFixed(2)));
    setEstimasiRoll(Number(rollCount.toFixed(2)));

    if (validLebar === "150") {
      setEfisiensiPola("Optimal (Bidang Lebar / Minimal Sambungan Pola)");
    } else {
      setEfisiensiPola("Standar (Bidang Sempit / Memerlukan Penataan Marker Presisi)");
    }
  }, [jenisBaju, lebarKain, ukuran, jumlahPotong, marginSusut]);

  React.useEffect(() => {
    calculateKain();
  }, [calculateKain]);

  const handleReset = () => {
    setJenisBaju("kemeja-pendek");
    setLebarKain("150");
    setUkuran("l-xl");
    setJumlahPotong(1);
    setMarginSusut(5);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Kolom Parameter Input */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Teknis Pola & Bahan Kain
                </h2>
                <p className="text-secondary text-sm">
                  Kalkulasi presisi kebutuhan kain berdasarkan pola potong standar industri
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke nilai awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Select
              label="Jenis Pakaian / Pola Baju"
              value={jenisBaju || "kemeja-pendek"}
              onChange={(e) => setJenisBaju(e.target.value)}
              helperText="Tentukan siluet dan pola konstruksi garmen"
            >
              <option value="kemeja-pendek">Kemeja Lengan Pendek</option>
              <option value="kemeja-panjang">Kemeja Lengan Panjang</option>
              <option value="gamis">Gamis / Maxi Dress Muslimah</option>
              <option value="celana-panjang">Celana Panjang Formal / Chino</option>
            </Select>

            <Select
              label="Lebar / Bidang Kain Tekstil"
              value={lebarKain || "150"}
              onChange={(e) => setLebarKain(e.target.value)}
              helperText="Lebar gulungan kain tekstil di pasaran"
            >
              <option value="115">Bidang Kecil (115 cm / 45 inch)</option>
              <option value="150">Bidang Besar (150 cm / 60 inch)</option>
            </Select>

            <Select
              label="Ukuran / Size Baju"
              value={ukuran || "l-xl"}
              onChange={(e) => setUkuran(e.target.value)}
              helperText="Grading ukuran pola standar produksi"
            >
              <option value="s-m">Size S - M (Small to Medium)</option>
              <option value="l-xl">Size L - XL (Large to Extra Large)</option>
              <option value="xxl">Size XXL (Jumbo / Double XL)</option>
            </Select>

            <Input
              label="Jumlah Pesanan (Quantity)"
              type="number"
              min={1}
              step={1}
              value={jumlahPotong ?? ""}
              onChange={(e) =>
                setJumlahPotong(e.target.value === "" ? null : Number(e.target.value))
              }
              suffix="pcs"
              helperText="Total kuantitas potong yang akan diproduksi"
            />

            <div className="sm:col-span-2">
              <Input
                label="Toleransi Penyusutan & Limbah Potong (Wastage Margin)"
                type="number"
                min={0}
                max={25}
                step={0.5}
                value={marginSusut ?? ""}
                onChange={(e) =>
                  setMarginSusut(e.target.value === "" ? null : Number(e.target.value))
                }
                suffix="%"
                helperText="Cadangan untuk susut cuci kain alami (katun/linen) & sisa perca potongan"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={calculateKain}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Hitung Kebutuhan Bahan Presisi
            </Button>
          </div>
        </Card>

        {/* Card Petunjuk Teknis Marker */}
        <Card className="flex flex-col gap-3 bg-base/50">
          <div className="flex items-center gap-2 text-primary font-medium text-sm">
            <Info className="w-4 h-4 text-accent" />
            <span>Rekomendasi Pemotongan & Gelaran Marker</span>
          </div>
          <div className="text-xs text-secondary leading-relaxed space-y-1.5">
            <p>
              • <strong>Kain Bidang 150 cm:</strong> Pola badan depan dan belakang kemeja/celana dapat diletakkan berdampingan, menghemat 15–20% panjang kain.
            </p>
            <p>
              • <strong>Kain Bidang 115 cm:</strong> Memerlukan penataan pola bertingkat (atas-bawah), disarankan menambahkan buffer 10% untuk pola berukuran XXL.
            </p>
            <p>
              • <strong>Kain Bermotif (Salur/Kotak/Batik):</strong> Memerlukan tambahan kain 10–15% untuk pencocokan motif (pattern matching).
            </p>
          </div>
        </Card>
      </div>

      {/* Kolom Output & Metrik Presisi */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <Card className="flex flex-col gap-5 border-accent/30 shadow-lg bg-surface">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Sparkles className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-lg text-primary">
              Hasil Kalkulasi Bahan Baku Tekstil
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <OutputBox
              label="Total Kebutuhan Kain (Panjang Pemesanan)"
              value={totalKebutuhanMeter}
              suffix=" meter"
              decimals={2}
            />

            <div className="grid grid-cols-2 gap-3">
              <OutputBox
                label="Kebutuhan per Potong"
                value={kebutuhanPerPcs}
                suffix=" m/pcs"
                decimals={2}
              />
              <OutputBox
                label="Konversi ke Yard"
                value={totalKebutuhanYard}
                suffix=" yard"
                decimals={2}
              />
            </div>

            <OutputBox
              label="Estimasi Kebutuhan Roll (50 Yard/Roll)"
              value={estimasiRoll}
              suffix=" roll"
              decimals={2}
            />
          </div>

          {/* Rangkuman Spesifikasi Teknis */}
          <div className="mt-2 p-4 rounded-xl bg-base border border-border flex flex-col gap-2.5 text-xs">
            <div className="flex justify-between items-center text-secondary">
              <span>Pola Busana:</span>
              <span className="font-medium text-primary">
                {GARMENT_LABELS[jenisBaju as GarmentType] || "Kemeja"}
              </span>
            </div>
            <div className="flex justify-between items-center text-secondary">
              <span>Lebar Bidang Kain:</span>
              <span className="font-medium text-primary">
                {lebarKain === "150" ? "150 cm (60\")" : "115 cm (45\")"}
              </span>
            </div>
            <div className="flex justify-between items-center text-secondary">
              <span>Grading Ukuran:</span>
              <span className="font-medium text-primary uppercase">
                {ukuran}
              </span>
            </div>
            <div className="flex justify-between items-center text-secondary">
              <span>Efisiensi Pola:</span>
              <span className="font-medium text-accent">
                {efisiensiPola}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-secondary pt-2">
            <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
            <span>Parameter teknis terkalibrasi standar penjahit konveksi & garmen Indonesia.</span>
          </div>
        </Card>
      </div>
    </div>
  );
}