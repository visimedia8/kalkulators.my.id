"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  AirVent,
  Calculator,
  RefreshCw,
  Sun,
  Users,
  Maximize2,
  Zap,
  ThermometerSnowflake,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useQueryState, parseAsFloat, parseAsInteger, parseAsString } from "nuqs";

interface PkRecommendation {
  pkLabel: string;
  exactPk: number;
  commercialPk: string;
  ratingBtu: number;
  powerWattRange: string;
  description: string;
}

export function BtuAcCalculator() {
  // State Input (URL Synced via nuqs)
  const [panjang, setPanjang] = useQueryState("panjang", parseAsFloat.withDefault(4));
  const [lebar, setLebar] = useQueryState("lebar", parseAsFloat.withDefault(3));
  const [tinggi, setTinggi] = useQueryState("tinggi", parseAsFloat.withDefault(3));
  const [jumlahOrang, setJumlahOrang] = useQueryState("jumlahOrang", parseAsInteger.withDefault(2));
  const [terpaparMatahari, setTerpaparMatahari] = useQueryState(
    "terpaparMatahari",
    parseAsString.withDefault("tidak")
  );

  // State Output
  const [areaSquareMeter, setAreaSquareMeter] = React.useState<number>(0);
  const [volumeCubicMeter, setVolumeCubicMeter] = React.useState<number>(0);
  const [baseRoomBtu, setBaseRoomBtu] = React.useState<number>(0);
  const [occupantsBtu, setOccupantsBtu] = React.useState<number>(0);
  const [solarSurchargeBtu, setSolarSurchargeBtu] = React.useState<number>(0);
  const [totalBtu, setTotalBtu] = React.useState<number>(0);
  const [recommendation, setRecommendation] = React.useState<PkRecommendation>({
    pkLabel: "1 PK",
    exactPk: 1.0,
    commercialPk: "1 PK (9.000 BTU/h)",
    ratingBtu: 9000,
    powerWattRange: "750 - 840 Watt",
    description: "Kapasitas standar ideal untuk kamar tidur utama atau ruang kerja.",
  });

  const getPkRecommendation = (btu: number): PkRecommendation => {
    const rawPk = btu / 9000;
    const roundedExactPk = parseFloat(rawPk.toFixed(2));

    if (btu <= 5000) {
      return {
        pkLabel: "1/2 PK",
        exactPk: roundedExactPk,
        commercialPk: "1/2 PK (5.000 BTU/h)",
        ratingBtu: 5000,
        powerWattRange: "350 - 400 Watt",
        description: "Direkomendasikan untuk kamar tidur kecil atau ruangan kompak (< 10 m²).",
      };
    } else if (btu <= 7000) {
      return {
        pkLabel: "3/4 PK",
        exactPk: roundedExactPk,
        commercialPk: "3/4 PK (7.000 BTU/h)",
        ratingBtu: 7000,
        powerWattRange: "500 - 600 Watt",
        description: "Optimal untuk kamar tidur standar atau ruang belajar (10 - 14 m²).",
      };
    } else if (btu <= 9000) {
      return {
        pkLabel: "1 PK",
        exactPk: roundedExactPk,
        commercialPk: "1 PK (9.000 BTU/h)",
        ratingBtu: 9000,
        powerWattRange: "750 - 840 Watt",
        description: "Kapasitas standar ideal untuk kamar tidur utama atau ruang kerja (14 - 18 m²).",
      };
    } else if (btu <= 12000) {
      return {
        pkLabel: "1.5 PK",
        exactPk: roundedExactPk,
        commercialPk: "1.5 PK (12.000 BTU/h)",
        ratingBtu: 12000,
        powerWattRange: "1.050 - 1.170 Watt",
        description: "Direkomendasikan untuk ruang keluarga, ruang tamu, atau studio (18 - 24 m²).",
      };
    } else if (btu <= 18000) {
      return {
        pkLabel: "2 PK",
        exactPk: roundedExactPk,
        commercialPk: "2 PK (18.000 BTU/h)",
        ratingBtu: 18000,
        powerWattRange: "1.500 - 1.900 Watt",
        description: "Dirancang untuk ruang keluarga luas, kantor terbuka, atau ruko (24 - 36 m²).",
      };
    } else if (btu <= 24000) {
      return {
        pkLabel: "2.5 PK",
        exactPk: roundedExactPk,
        commercialPk: "2.5 PK (24.000 BTU/h)",
        ratingBtu: 24000,
        powerWattRange: "2.000 - 2.400 Watt",
        description: "Sangat bertenaga untuk ruang rapat besar, restoran, atau galeri (36 - 48 m²).",
      };
    } else {
      const unitsCount = Math.ceil(btu / 18000);
      return {
        pkLabel: `${roundedExactPk} PK`,
        exactPk: roundedExactPk,
        commercialPk: `${unitsCount} Unit x 2 PK (${unitsCount * 18000} BTU/h)`,
        ratingBtu: unitsCount * 18000,
        powerWattRange: `${unitsCount * 1500} - ${unitsCount * 1900} Watt`,
        description: `Beban termal tinggi. Disarankan menggunakan sistem multi-split ${unitsCount} unit 2 PK atau AC Floor Standing / Cassette.`,
      };
    }
  };

  const calculateBtu = React.useCallback(() => {
    const p = Math.max(0, panjang || 0);
    const l = Math.max(0, lebar || 0);
    const t = Math.max(0, tinggi || 0);
    const people = Math.max(0, jumlahOrang || 0);
    const isSunny = terpaparMatahari === "ya";

    // 1. Luas & Volume
    const area = p * l;
    const volume = area * t;

    // 2. Beban Ruangan ASHRAE (Volume x 200 BTU/m3)
    const baseBtu = volume * 200;

    // 3. Beban Kalor Penghuni (Orang x 400 BTU/h)
    const occBtu = people * 400;

    // 4. Subtotal Beban Termal
    const subtotal = baseBtu + occBtu;

    // 5. Koreksi Paparan Radiasi Matahari Langsung (+10%)
    const solarExtra = isSunny ? subtotal * 0.1 : 0;
    const finalCalculatedBtu = Math.round(subtotal + solarExtra);

    setAreaSquareMeter(parseFloat(area.toFixed(2)));
    setVolumeCubicMeter(parseFloat(volume.toFixed(2)));
    setBaseRoomBtu(Math.round(baseBtu));
    setOccupantsBtu(Math.round(occBtu));
    setSolarSurchargeBtu(Math.round(solarExtra));
    setTotalBtu(finalCalculatedBtu);
    setRecommendation(getPkRecommendation(finalCalculatedBtu));
  }, [panjang, lebar, tinggi, jumlahOrang, terpaparMatahari]);

  React.useEffect(() => {
    calculateBtu();
  }, [calculateBtu]);

  const handleReset = () => {
    setPanjang(null);
    setLebar(null);
    setTinggi(null);
    setJumlahOrang(null);
    setTerpaparMatahari(null);
  };

  const handlePreset = (
    p: number,
    l: number,
    t: number,
    org: number,
    matahari: "ya" | "tidak"
  ) => {
    setPanjang(p);
    setLebar(l);
    setTinggi(t);
    setJumlahOrang(org);
    setTerpaparMatahari(matahari);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Parameter Input Section */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <AirVent className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Ruangan & Beban Termal
                </h2>
                <p className="text-secondary text-sm">
                  Kalkulasi kapasitas pendinginan AC standar industri ASHRAE
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
            <span className="text-[12px] font-medium text-secondary">Preset Tipe Ruangan Cepat:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handlePreset(3, 3, 2.8, 1, "tidak")}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Kamar Tidur Kecil (3x3m)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(4, 4, 3, 2, "tidak")}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Kamar Utama (4x4m)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(6, 4, 3.2, 4, "ya")}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Ruang Tamu Terbuka (6x4m)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(8, 5, 3.2, 8, "ya")}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Ruang Rapat Kantor (8x5m)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Panjang Ruangan"
              type="number"
              min={1}
              max={50}
              step={0.1}
              value={panjang ?? ""}
              onChange={(e) => setPanjang(e.target.value ? Number(e.target.value) : null)}
              suffix="m"
              helperText="Panjang sisi ruang terpanjang"
            />

            <Input
              label="Lebar Ruangan"
              type="number"
              min={1}
              max={50}
              step={0.1}
              value={lebar ?? ""}
              onChange={(e) => setLebar(e.target.value ? Number(e.target.value) : null)}
              suffix="m"
              helperText="Lebar sisi ruangan"
            />

            <Input
              label="Tinggi Plafon Ruangan"
              type="number"
              min={1.5}
              max={10}
              step={0.1}
              value={tinggi ?? ""}
              onChange={(e) => setTinggi(e.target.value ? Number(e.target.value) : null)}
              suffix="m"
              helperText="Jarak vertikal lantai ke plafon"
            />

            <Input
              label="Jumlah Penghuni / Orang"
              type="number"
              min={1}
              max={100}
              step={1}
              value={jumlahOrang ?? ""}
              onChange={(e) => setJumlahOrang(e.target.value ? Number(e.target.value) : null)}
              suffix="Orang"
              helperText="Disipasi panas 400 BTU/h per orang"
            />

            <div className="sm:col-span-2">
              <Select
                label="Paparan Radiasi Sinar Matahari Langsung"
                value={terpaparMatahari || "tidak"}
                onChange={(e) => setTerpaparMatahari(e.target.value)}
                helperText={
                  terpaparMatahari === "ya"
                    ? "Koreksi +10% beban termal karena radiasi panas dinding/jendela barat"
                    : "Kondisi ruangan terlindung / dinding standar tanpa radiasi intensif"
                }
              >
                <option value="tidak">
                  Tidak Terpapar Langsung (Terlindung / Dinding Standar)
                </option>
                <option value="ya">
                  Terpapar Matahari Langsung (+10% Beban Termal Radiasi)
                </option>
              </Select>
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={calculateBtu} className="w-full sm:w-auto flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Hitung Kapasitas BTU Presisi
            </Button>
          </div>
        </Card>
      </div>

      {/* Output & Engineering Breakdown Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <OutputBox
            label="Total Beban Pendinginan Ruangan"
            value={totalBtu}
            suffix=" BTU/h"
          />
          <OutputBox
            label="Kapasitas Daya Teoritis"
            value={recommendation.exactPk}
            suffix=" PK"
            decimals={2}
          />
        </div>

        {/* Commercial Unit Recommendation Card */}
        <Card className="flex flex-col gap-4 border-accent/30 bg-accent/5">
          <div className="flex items-center gap-2.5 text-accent">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-sm font-semibold font-display tracking-wide uppercase">
              Rekomendasi Unit Komersial
            </h3>
          </div>

          <div className="flex flex-col gap-1.5 p-3.5 rounded-xl border border-accent/20 bg-base">
            <div className="flex justify-between items-center">
              <span className="text-xs text-secondary font-medium">Ukuran PK Rekomendasi:</span>
              <span className="text-lg font-bold font-mono text-accent">
                {recommendation.commercialPk}
              </span>
            </div>
            <p className="text-xs text-secondary leading-relaxed pt-1">
              {recommendation.description}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50">
            <span className="text-secondary flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-warning" />
              Estimasi Konsumsi Listrik:
            </span>
            <span className="font-mono text-primary font-semibold">
              {recommendation.powerWattRange}
            </span>
          </div>
        </Card>

        {/* Detailed Engineering Breakdown */}
        <Card className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase border-b border-border pb-2 flex items-center gap-2">
            <ThermometerSnowflake className="w-4 h-4 text-accent" />
            Rincian Komponen Beban Termal
          </h3>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-secondary flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5" />
                Luas Lantai ({panjang}m x {lebar}m):
              </span>
              <span className="font-mono text-primary font-medium">{areaSquareMeter} m²</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Volume Ruang ({areaSquareMeter}m² x {tinggi}m):</span>
              <span className="font-mono text-primary font-medium">{volumeCubicMeter} m³</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Beban Volume Dasar (200 BTU/m³):</span>
              <span className="font-mono text-primary font-medium">
                {baseRoomBtu.toLocaleString("id-ID")} BTU/h
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Beban Kalor Tubuh ({jumlahOrang} Org x 400):
              </span>
              <span className="font-mono text-primary font-medium">
                + {occupantsBtu.toLocaleString("id-ID")} BTU/h
              </span>
            </div>

            {solarSurchargeBtu > 0 ? (
              <div className="flex justify-between items-center">
                <span className="text-secondary flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-warning" />
                  Koreksi Paparan Radiasi (+10%):
                </span>
                <span className="font-mono text-warning font-medium">
                  + {solarSurchargeBtu.toLocaleString("id-ID")} BTU/h
                </span>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-secondary">Koreksi Radiasi Sinar Matahari:</span>
                <span className="font-mono text-secondary font-medium">0 BTU/h (Netral)</span>
              </div>
            )}

            <div className="pt-3 border-t border-border flex justify-between items-center font-semibold">
              <span className="text-primary flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent" />
                Total Beban Termal Terkalibrasi:
              </span>
              <span className="font-mono text-accent text-base">
                {totalBtu.toLocaleString("id-ID")} BTU/h
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}