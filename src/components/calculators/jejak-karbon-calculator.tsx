"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Leaf,
  Zap,
  Car,
  Bike,
  Flame,
  Trees,
  RefreshCw,
  Calculator,
  ShieldCheck,
  AlertCircle,
  TrendingDown,
  Info,
} from "lucide-react";
import { useQueryState, parseAsFloat } from "nuqs";
import { cn } from "@/lib/utils";

// Koefisien Faktor Emisi Standar Industri (Indonesia & IPCC)
const EMISSION_FACTORS = {
  listrik: 0.85, // kg CO2 / kWh (Grid Jawa-Madura-Bali / Nasional ESDM)
  bensinMobil: 2.3, // kg CO2 / Liter Bensin RON 90-92
  bensinMotor: 2.3, // kg CO2 / Liter Bensin Sepeda Motor
  gasLpg: 3.0, // kg CO2 / kg Liquefied Petroleum Gas
  treeAnnualAbsorption: 21, // kg CO2 diserap per pohon per tahun
};

interface BreakdownItem {
  name: string;
  value: number;
  emisi: number;
  unit: string;
  factor: number;
  percentage: number;
  color: string;
  bg: string;
  border: string;
}

export function JejakKarbonCalculator() {
  // State Input Parameter (URL Query State via nuqs)
  const [listrikKwh, setListrikKwh] = useQueryState(
    "listrikKwh",
    parseAsFloat.withDefault(150)
  );
  const [bensinMobil, setBensinMobil] = useQueryState(
    "bensinLiter",
    parseAsFloat.withDefault(50)
  );
  const [bensinMotor, setBensinMotor] = useQueryState(
    "motorLiter",
    parseAsFloat.withDefault(20)
  );
  const [gasLpg, setGasLpg] = useQueryState(
    "gasLpg",
    parseAsFloat.withDefault(12)
  );

  // State Output Terkalkulasi
  const [emisiListrik, setEmisiListrik] = React.useState<number>(0);
  const [emisiMobil, setEmisiMobil] = React.useState<number>(0);
  const [emisiMotor, setEmisiMotor] = React.useState<number>(0);
  const [emisiLpg, setEmisiLpg] = React.useState<number>(0);
  const [totalEmisiBulanan, setTotalEmisiBulanan] = React.useState<number>(0);
  const [totalEmisiTahunan, setTotalEmisiTahunan] = React.useState<number>(0);
  const [jumlahPohon, setJumlahPohon] = React.useState<number>(0);
  const [breakdown, setBreakdown] = React.useState<BreakdownItem[]>([]);

  // Kalkulasi Emisi Presisi Real-Time
  const calculateEmissions = React.useCallback(() => {
    const kwh = Math.max(0, listrikKwh || 0);
    const mobil = Math.max(0, bensinMobil || 0);
    const motor = Math.max(0, bensinMotor || 0);
    const lpg = Math.max(0, gasLpg || 0);

    const calcListrik = parseFloat((kwh * EMISSION_FACTORS.listrik).toFixed(2));
    const calcMobil = parseFloat((mobil * EMISSION_FACTORS.bensinMobil).toFixed(2));
    const calcMotor = parseFloat((motor * EMISSION_FACTORS.bensinMotor).toFixed(2));
    const calcLpg = parseFloat((lpg * EMISSION_FACTORS.gasLpg).toFixed(2));

    const totalBulanan = parseFloat(
      (calcListrik + calcMobil + calcMotor + calcLpg).toFixed(2)
    );
    const totalTahunan = parseFloat((totalBulanan * 12).toFixed(2));
    const trees = totalTahunan > 0 ? Math.ceil(totalTahunan / EMISSION_FACTORS.treeAnnualAbsorption) : 0;

    setEmisiListrik(calcListrik);
    setEmisiMobil(calcMobil);
    setEmisiMotor(calcMotor);
    setEmisiLpg(calcLpg);
    setTotalEmisiBulanan(totalBulanan);
    setTotalEmisiTahunan(totalTahunan);
    setJumlahPohon(trees);

    const items: BreakdownItem[] = [
      {
        name: "Listrik Rumah Tangga",
        value: kwh,
        emisi: calcListrik,
        unit: "kWh",
        factor: EMISSION_FACTORS.listrik,
        percentage: totalBulanan > 0 ? Math.round((calcListrik / totalBulanan) * 100) : 0,
        color: "text-amber-400",
        bg: "bg-amber-400",
        border: "border-amber-400/30",
      },
      {
        name: "Bensin Mobil Pribadi",
        value: mobil,
        emisi: calcMobil,
        unit: "Liter",
        factor: EMISSION_FACTORS.bensinMobil,
        percentage: totalBulanan > 0 ? Math.round((calcMobil / totalBulanan) * 100) : 0,
        color: "text-blue-400",
        bg: "bg-blue-400",
        border: "border-blue-400/30",
      },
      {
        name: "Bensin Sepeda Motor",
        value: motor,
        emisi: calcMotor,
        unit: "Liter",
        factor: EMISSION_FACTORS.bensinMotor,
        percentage: totalBulanan > 0 ? Math.round((calcMotor / totalBulanan) * 100) : 0,
        color: "text-indigo-400",
        bg: "bg-indigo-400",
        border: "border-indigo-400/30",
      },
      {
        name: "Gas LPG Dapur",
        value: lpg,
        emisi: calcLpg,
        unit: "kg",
        factor: EMISSION_FACTORS.gasLpg,
        percentage: totalBulanan > 0 ? Math.round((calcLpg / totalBulanan) * 100) : 0,
        color: "text-rose-400",
        bg: "bg-rose-400",
        border: "border-rose-400/30",
      },
    ];

    setBreakdown(items);
  }, [listrikKwh, bensinMobil, bensinMotor, gasLpg]);

  React.useEffect(() => {
    calculateEmissions();
  }, [calculateEmissions]);

  const handleReset = () => {
    setListrikKwh(null);
    setBensinMobil(null);
    setBensinMotor(null);
    setGasLpg(null);
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "kos") {
      setListrikKwh(45);
      setBensinMobil(0);
      setBensinMotor(15);
      setGasLpg(3);
    } else if (val === "kecil") {
      setListrikKwh(150);
      setBensinMobil(0);
      setBensinMotor(30);
      setGasLpg(9);
    } else if (val === "menengah") {
      setListrikKwh(300);
      setBensinMobil(60);
      setBensinMotor(20);
      setGasLpg(15);
    } else if (val === "urban-tinggi") {
      setListrikKwh(500);
      setBensinMobil(120);
      setBensinMotor(10);
      setGasLpg(24);
    }
  };

  // Status Evaluasi Emisi
  const getCarbonStatus = (monthly: number) => {
    if (monthly <= 150) {
      return {
        label: "Rendah (Efisien / Ramah Lingkungan)",
        badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
        desc: "Jejak karbon berada di bawah rata-rata nasional. Efisiensi energi sangat optimal.",
      };
    } else if (monthly <= 350) {
      return {
        label: "Sedang (Rata-rata Domestik Indonesia)",
        badgeColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
        desc: "Jejak karbon setara dengan profil konsumsi rumah tangga perkotaan standar.",
      };
    } else {
      return {
        label: "Tinggi (Intensif Emisi)",
        badgeColor: "text-rose-400 border-rose-500/30 bg-rose-500/10",
        desc: "Konsumsi energi dan bahan bakar tinggi. Diperlukan audit efisiensi dan aksi reduksi.",
      };
    }
  };

  const carbonStatus = getCarbonStatus(totalEmisiBulanan);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Parameter Input Section */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Emisi Karbon Bulanan
                </h2>
                <p className="text-secondary text-sm">
                  Kalkulasi emisi gas rumah kaca (GRK) standar IPCC & ESDM
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke nilai default"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Preset Selector */}
          <div className="w-full">
            <Select
              label="Preset Profil Konsumsi Cepat"
              helperText="Pilih template profil konsumsi untuk mengisi parameter secara instan"
              onChange={handlePresetChange}
              defaultValue=""
            >
              <option value="" disabled>
                -- Pilih Profil Konsumsi Energi --
              </option>
              <option value="kos">Individu / Penghuni Kos (Hemat Energi)</option>
              <option value="kecil">Keluarga Kecil (1 Motor, Listrik 900VA-1300VA)</option>
              <option value="menengah">Keluarga Menengah Urban (1 Mobil, 1 Motor)</option>
              <option value="urban-tinggi">Keluarga Komuter Aktif (Listrik AC 2200VA+, Mobil Harian)</option>
            </Select>
          </div>

          {/* Input Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <Input
                label="Konsumsi Listrik PLN"
                type="number"
                min={0}
                step={1}
                value={listrikKwh ?? ""}
                onChange={(e) => setListrikKwh(Number(e.target.value))}
                suffix="kWh"
                helperText="Faktor: 0.85 kg CO₂ / kWh"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Input
                label="Bahan Bakar Mobil (Bensin)"
                type="number"
                min={0}
                step={1}
                value={bensinMobil ?? ""}
                onChange={(e) => setBensinMobil(Number(e.target.value))}
                suffix="Liter"
                helperText="Faktor: 2.30 kg CO₂ / Liter"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Input
                label="Bahan Bakar Motor (Bensin)"
                type="number"
                min={0}
                step={1}
                value={bensinMotor ?? ""}
                onChange={(e) => setBensinMotor(Number(e.target.value))}
                suffix="Liter"
                helperText="Faktor: 2.30 kg CO₂ / Liter"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Input
                label="Konsumsi Gas LPG Dapur"
                type="number"
                min={0}
                step={0.5}
                value={gasLpg ?? ""}
                onChange={(e) => setGasLpg(Number(e.target.value))}
                suffix="kg"
                helperText="Faktor: 3.00 kg CO₂ / kg (Tabung 3kg/12kg)"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={calculateEmissions}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Kalkulasi Jejak Karbon Presisi
            </Button>
          </div>
        </Card>

        {/* Breakdown Komponen Emisi */}
        <Card className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase border-b border-border pb-2 flex items-center justify-between">
            <span>Rincian Sumber Emisi Terdistribusi</span>
            <span className="text-xs font-normal text-secondary lowercase">
              basis bulanan
            </span>
          </h3>

          <div className="flex flex-col gap-4">
            {breakdown.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-primary font-medium flex items-center gap-2">
                    {item.name}
                    <span className="text-xs text-secondary font-mono">
                      ({item.value} {item.unit} × {item.factor})
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-primary font-semibold">
                      {item.emisi.toLocaleString("id-ID")} kg CO₂
                    </span>
                    <span className={cn("text-xs font-mono font-medium px-2 py-0.5 rounded border", item.border, item.color)}>
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full h-2 rounded-full bg-base overflow-hidden border border-border">
                  <div
                    className={cn("h-full transition-all duration-500 rounded-full", item.bg)}
                    style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Output & Offset Summary Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <OutputBox
          label="Total Emisi CO₂ Bulanan"
          value={totalEmisiBulanan}
          suffix=" kg CO₂"
          decimals={1}
        />

        <OutputBox
          label="Kompensasi Pohon Wajib Ditanam"
          value={jumlahPohon}
          suffix=" Pohon / Tahun"
          decimals={0}
        />

        {/* Status Evaluasi Ekologis */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-sm font-semibold font-display text-primary uppercase">
              Evaluasi Jejak Ekologis
            </span>
            <span
              className={cn(
                "text-xs px-2.5 py-1 rounded-full border font-medium",
                carbonStatus.badgeColor
              )}
            >
              {carbonStatus.label}
            </span>
          </div>

          <p className="text-sm text-secondary leading-relaxed">
            {carbonStatus.desc}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border text-sm">
            <div className="flex flex-col p-3 rounded-xl bg-base border border-border">
              <span className="text-xs text-secondary">Proyeksi Tahunan:</span>
              <span className="font-mono text-base font-semibold text-primary mt-1">
                {(totalEmisiTahunan / 1000).toFixed(2)} Ton CO₂
              </span>
            </div>
            <div className="flex flex-col p-3 rounded-xl bg-base border border-border">
              <span className="text-xs text-secondary">Serapan 1 Pohon:</span>
              <span className="font-mono text-base font-semibold text-emerald-400 mt-1">
                21 kg CO₂ / thn
              </span>
            </div>
          </div>
        </Card>

        {/* Panduan Rekomendasi Reduksi */}
        <Card className="flex flex-col gap-3 bg-elevated/40 border-border">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <span>Target Aksi Reduksi Emisi Mandiri</span>
          </div>
          <ul className="text-xs text-secondary space-y-2 list-disc list-inside">
            <li>
              Turunkan konsumsi AC 1°C lebih tinggi (mis. 24°C - 25°C) untuk mereduksi beban listrik hingga 6% - 10%.
            </li>
            <li>
              Gunakan transportasi publik atau kombinasikan mobilitas komuter motor untuk menekan emisi bensin sektor transportasi.
            </li>
            <li>
              Lakukan penanaman pohon mangrove atau pohon peneduh berdaun lebat untuk mencapai status netral karbon (*carbon neutrality*).
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}