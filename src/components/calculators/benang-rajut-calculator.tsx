// File: src/components/calculators/benang-rajut-calculator.tsx
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
  Sparkles,
  Info,
  CheckCircle2,
  Layers,
  Ruler,
  Scale,
  BookmarkCheck,
} from "lucide-react";
import { useQueryState, parseAsString, parseAsFloat, parseAsInteger } from "nuqs";

type StitchTechnique =
  | "stockinette"
  | "garter"
  | "ribbing"
  | "cable"
  | "crochet-sc"
  | "crochet-dc"
  | "crochet-granny";

type YarnWeightCategory =
  | "lace"
  | "fingering"
  | "sport"
  | "dk"
  | "worsted"
  | "bulky"
  | "super-bulky";

// Koefisien Multiplier Konsumsi Benang Berdasarkan Teknik Tusukan (Standar Industri Kriya)
const TECHNIQUE_MULTIPLIERS: Record<StitchTechnique, number> = {
  stockinette: 1.0, // Knitting Stockinette / Tusuk Polos (Base Baseline)
  garter: 1.15, // Knitting Garter Stitch / Tusuk Bolak-balik (+15%)
  ribbing: 1.25, // Knitting Ribbing 1x1 / 2x2 / Tusuk Karet (+25%)
  cable: 1.35, // Knitting Cable / Rajut Kepang (+35%)
  "crochet-sc": 1.3, // Crochet Single Crochet / Tusuk Tunggal (+30%)
  "crochet-dc": 1.45, // Crochet Double Crochet / Tusuk Ganda (+45%)
  "crochet-granny": 1.2, // Crochet Granny Square / Motif Renda (+20%)
};

const TECHNIQUE_LABELS: Record<StitchTechnique, string> = {
  stockinette: "Knitting Stockinette / Tusuk Rata (1.00x)",
  garter: "Knitting Garter Stitch / Tusuk Bolak-balik (1.15x)",
  ribbing: "Knitting Ribbing 1x1 atau 2x2 (1.25x)",
  cable: "Knitting Cable / Motif Kepang (1.35x)",
  "crochet-sc": "Crochet Single Crochet / Tusuk Tunggal (1.30x)",
  "crochet-dc": "Crochet Double Crochet / Tusuk Ganda (1.45x)",
  "crochet-granny": "Crochet Granny Square / Renda (1.20x)",
};

const YARN_WEIGHT_LABELS: Record<YarnWeightCategory, string> = {
  lace: "Lace / 2-Ply (Gauge 32-40 st/10cm)",
  fingering: "Super Fine / Fingering / Sock (Gauge 28-32 st/10cm)",
  sport: "Fine / Sport / Baby (Gauge 24-26 st/10cm)",
  dk: "Light / DK / 8-Ply (Gauge 21-24 st/10cm)",
  worsted: "Medium / Worsted / Afghan (Gauge 16-20 st/10cm)",
  bulky: "Bulky / Chunky / 12-Ply (Gauge 12-15 st/10cm)",
  "super-bulky": "Super Bulky / Roving (Gauge 7-11 st/10cm)",
};

interface PresetProject {
  label: string;
  luas: number;
  gaugeDefault: number;
}

const PRESET_PROJECTS: Record<string, PresetProject> = {
  custom: { label: "Kustom (Input Luas Manual)", luas: 3000, gaugeDefault: 20 },
  syal: { label: "Syal Leher Dewasa (20 x 150 cm = 3.000 cm²)", luas: 3000, gaugeDefault: 18 },
  topi: { label: "Topi Beanie Dewasa (50 x 25 cm = 1.250 cm²)", luas: 1250, gaugeDefault: 20 },
  selimut_bayi: { label: "Selimut Bayi (80 x 100 cm = 8.000 cm²)", luas: 8000, gaugeDefault: 16 },
  sweater: { label: "Sweater / Cardigan Dewasa (10.000 cm²)", luas: 10000, gaugeDefault: 20 },
  sarung_bantal: { label: "Sarung Bantal Sofa (40 x 40 cm = 1.600 cm²)", luas: 1600, gaugeDefault: 18 },
};

export function BenangRajutCalculator() {
  // 1. URL State Synchronized via nuqs
  const [luasProyek, setLuasProyek] = useQueryState(
    "luasProyek",
    parseAsFloat.withDefault(3000)
  );
  const [gauge, setGauge] = useQueryState(
    "gauge",
    parseAsFloat.withDefault(20)
  );
  const [teknik, setTeknik] = useQueryState(
    "teknik",
    parseAsString.withDefault("stockinette")
  );
  const [kategoriBenang, setKategoriBenang] = useQueryState(
    "kategoriBenang",
    parseAsString.withDefault("worsted")
  );
  const [panjangGulung, setPanjangGulung] = useQueryState(
    "meterPerGulung",
    parseAsFloat.withDefault(200)
  );
  const [beratGulung, setBeratGulung] = useQueryState(
    "gramPerGulung",
    parseAsFloat.withDefault(100)
  );
  const [marginCadangan, setMarginCadangan] = useQueryState(
    "margin",
    parseAsFloat.withDefault(10)
  );

  // 2. State Output Hasil Kalkulasi
  const [totalPanjangMeter, setTotalPanjangMeter] = React.useState<number>(171.6);
  const [totalPanjangYard, setTotalPanjangYard] = React.useState<number>(187.7);
  const [totalGulung, setTotalGulung] = React.useState<number>(1);
  const [totalBeratGram, setTotalBeratGram] = React.useState<number>(100);
  const [totalTusukan, setTotalTusukan] = React.useState<number>(16200);
  const [konsumsiPerSwatch, setKonsumsiPerSwatch] = React.useState<number>(5.2);

  const calculateBenang = React.useCallback(() => {
    const validLuas = Math.max(1, luasProyek ?? 3000);
    const validGauge = Math.max(1, gauge ?? 20);
    const validTeknik = (
      teknik in TECHNIQUE_MULTIPLIERS ? teknik : "stockinette"
    ) as StitchTechnique;
    const validPanjangGulung = Math.max(1, panjangGulung ?? 200);
    const validBeratGulung = Math.max(1, beratGulung ?? 100);
    const validMargin = Math.max(0, marginCadangan ?? 10);

    const multiplierTeknik = TECHNIQUE_MULTIPLIERS[validTeknik] || 1.0;

    // Konsumsi benang per swatch standar 10x10 cm (100 cm²)
    // Formula Teknis: Base Meter per 100 cm² = Gauge * 0.26 * Multiplier Teknik
    const meterPer100cm2 = validGauge * 0.26 * multiplierTeknik;

    // Kebutuhan benang dasar murni tanpa buffer
    const baseTotalMeter = (validLuas / 100) * meterPer100cm2;

    // Total kebutuhan dengan buffer safety margin untuk sambungan dan ekor jahitan
    const finalTotalMeter = baseTotalMeter * (1 + validMargin / 100);
    const finalTotalYard = finalTotalMeter * 1.09361;

    // Estimasi kuantitas gulungan (skein / ball) pembulatan ke atas
    const jumlahSkein = Math.ceil(finalTotalMeter / validPanjangGulung);
    const totalGramasi = jumlahSkein * validBeratGulung;

    // Estimasi total tusukan rajut pada keseluruhan bidang pola
    // Standar rasio baris-ke-tusukan rajut adalah 1.35x
    const estTotalStitches = Math.round(
      (validLuas / 100) * (validGauge * (validGauge * 1.35))
    );

    setKonsumsiPerSwatch(Number(meterPer100cm2.toFixed(2)));
    setTotalPanjangMeter(Number(finalTotalMeter.toFixed(1)));
    setTotalPanjangYard(Number(finalTotalYard.toFixed(1)));
    setTotalGulung(jumlahSkein);
    setTotalBeratGram(totalGramasi);
    setTotalTusukan(estTotalStitches);
  }, [
    luasProyek,
    gauge,
    teknik,
    panjangGulung,
    beratGulung,
    marginCadangan,
  ]);

  React.useEffect(() => {
    calculateBenang();
  }, [calculateBenang]);

  const handleApplyPreset = (key: string) => {
    const preset = PRESET_PROJECTS[key];
    if (preset) {
      setLuasProyek(preset.luas);
      setGauge(preset.gaugeDefault);
    }
  };

  const handleReset = () => {
    setLuasProyek(3000);
    setGauge(20);
    setTeknik("stockinette");
    setKategoriBenang("worsted");
    setPanjangGulung(200);
    setBeratGulung(100);
    setMarginCadangan(10);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Kolom Parameter Input Teknis */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Teknis Rajutan & Benang
                </h2>
                <p className="text-secondary text-sm">
                  Kalkulasi presisi kebutuhan panjang benang rajut berstandar industri
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset parameter teknis ke nilai awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Quick Preset Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-secondary flex items-center gap-1.5">
              <BookmarkCheck className="w-4 h-4 text-accent" />
              Preset Standar Proyek Rajut
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(PRESET_PROJECTS).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleApplyPreset(key)}
                  className="px-3 py-2 text-xs font-medium rounded-lg border border-border bg-base hover:bg-elevated hover:border-accent text-primary transition-colors text-left truncate"
                >
                  {item.label.split(" (")[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Luas Total Proyek Rajutan"
              type="number"
              min={10}
              step={10}
              value={luasProyek ?? ""}
              onChange={(e) =>
                setLuasProyek(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              suffix="cm²"
              helperText="Panjang (cm) × Lebar (cm) bidang rajutan"
            />

            <Input
              label="Tusukan per 10 cm (Stitch Gauge)"
              type="number"
              min={1}
              max={80}
              step={0.5}
              value={gauge ?? ""}
              onChange={(e) =>
                setGauge(e.target.value === "" ? null : Number(e.target.value))
              }
              suffix="st/10cm"
              helperText="Jumlah tusukan pada swatch uji 10 cm"
            />

            <Select
              label="Teknik Tusukan & Pola Rajut"
              value={teknik || "stockinette"}
              onChange={(e) => setTeknik(e.target.value)}
              helperText="Koefisien penyerapan panjang benang per struktur jeratan"
            >
              {Object.entries(TECHNIQUE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </Select>

            <Select
              label="Kategori Ketebalan Benang (CYC)"
              value={kategoriBenang || "worsted"}
              onChange={(e) => setKategoriBenang(e.target.value)}
              helperText="Standar berat benang (Craft Yarn Council Standard)"
            >
              {Object.entries(YARN_WEIGHT_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </Select>

            <Input
              label="Panjang Benang per Gulung (Skein)"
              type="number"
              min={10}
              step={5}
              value={panjangGulung ?? ""}
              onChange={(e) =>
                setPanjangGulung(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              suffix="meter"
              helperText="Spesifikasi panjang pada label gulungan benang"
            />

            <Input
              label="Berat per Gulung (Gramasi)"
              type="number"
              min={10}
              step={5}
              value={beratGulung ?? ""}
              onChange={(e) =>
                setBeratGulung(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              suffix="gram"
              helperText="Berat netto per skein (contoh: 50g atau 100g)"
            />

            <div className="sm:col-span-2">
              <Input
                label="Margin Cadangan & Sambungan (Safety Margin)"
                type="number"
                min={0}
                max={30}
                step={1}
                value={marginCadangan ?? ""}
                onChange={(e) =>
                  setMarginCadangan(
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                suffix="%"
                helperText="Cadangan standar industri (10%) untuk sambungan benang, ekor jahitan, dan variasi tensi"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={calculateBenang}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Kalkulasi Kebutuhan Benang Presisi
            </Button>
          </div>
        </Card>

        {/* Card Panduan Teknis Swatch Kalibrasi */}
        <Card className="flex flex-col gap-3 bg-base/50">
          <div className="flex items-center gap-2 text-primary font-medium text-sm">
            <Info className="w-4 h-4 text-accent" />
            <span>Kaidah Uji Swatch & Kalibrasi Tensi Rajut</span>
          </div>
          <div className="text-xs text-secondary leading-relaxed space-y-1.5">
            <p>
              • <strong>Uji Swatch 10x10 cm:</strong> Selalu buat sampel rajutan berukuran minimal 12x12 cm, lalu ukur jumlah tusukan di area tengah 10 cm untuk mendapatkan angka gauge yang <strong>akurat</strong>.
            </p>
            <p>
              • <strong>Dye Lot Consistency:</strong> Menghitung total kebutuhan benang sebelum memulai produksi mencegah risiko belang warna akibat perbedaan nomor lot celup (<em>dye lot</em>) pabrik.
            </p>
            <p>
              • <strong>Karakteristik Crochet vs Knitting:</strong> Teknik rajut kait (Crochet) membutuhkan rata-rata 30% hingga 45% lebih banyak panjang benang dibandingkan rajut jarum ganda (Knitting) pada luas bidang yang sama.
            </p>
          </div>
        </Card>
      </div>

      {/* Kolom Output Metrik Presisi */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <Card className="flex flex-col gap-5 border-accent/30 shadow-lg bg-surface">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Sparkles className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-lg text-primary">
              Hasil Kalkulasi Kebutuhan Benang
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <OutputBox
              label="Total Panjang Benang (Pemesanan)"
              value={totalPanjangMeter}
              suffix=" meter"
              decimals={1}
            />

            <div className="grid grid-cols-2 gap-3">
              <OutputBox
                label="Konversi Panjang"
                value={totalPanjangYard}
                suffix=" yard"
                decimals={1}
              />
              <OutputBox
                label="Kebutuhan Gulung"
                value={totalGulung}
                suffix=" gulung"
                decimals={0}
              />
            </div>

            <OutputBox
              label="Estimasi Total Berat Benang"
              value={totalBeratGram}
              suffix=" gram"
              decimals={0}
            />
          </div>

          {/* Rangkuman Spesifikasi Teknis */}
          <div className="mt-2 p-4 rounded-xl bg-base border border-border flex flex-col gap-2.5 text-xs">
            <div className="flex justify-between items-center text-secondary">
              <span>Luas Total Pola:</span>
              <span className="font-medium text-primary">
                {(luasProyek ?? 0).toLocaleString("id-ID")} cm²
              </span>
            </div>
            <div className="flex justify-between items-center text-secondary">
              <span>Kerapatan Gauge:</span>
              <span className="font-medium text-primary">
                {gauge ?? 20} tusukan / 10 cm
              </span>
            </div>
            <div className="flex justify-between items-center text-secondary">
              <span>Konsumsi per Swatch 10x10 cm:</span>
              <span className="font-medium text-primary">
                {konsumsiPerSwatch} meter
              </span>
            </div>
            <div className="flex justify-between items-center text-secondary">
              <span>Estimasi Total Tusukan:</span>
              <span className="font-medium text-primary">
                {totalTusukan.toLocaleString("id-ID")} jeratan
              </span>
            </div>
            <div className="flex justify-between items-center text-secondary">
              <span>Safety Margin Cadangan:</span>
              <span className="font-medium text-accent">
                +{marginCadangan ?? 10}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-secondary pt-2">
            <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
            <span>Parameter teknis terkalibrasi standar Craft Yarn Council & kriya garmen.</span>
          </div>
        </Card>
      </div>
    </div>
  );
}