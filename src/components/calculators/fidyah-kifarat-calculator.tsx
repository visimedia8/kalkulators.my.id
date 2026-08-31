"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Calculator,
  RefreshCw,
  Scale,
  FileText,
  HeartHandshake,
  Coins,
  Info,
  ShieldCheck,
  Users,
  PackageCheck,
  CheckCircle2,
} from "lucide-react";
import { useQueryState, parseAsFloat, parseAsInteger, parseAsString } from "nuqs";

interface ObligationConfig {
  label: string;
  category: "Fidyah" | "Kifarat";
  multiplier: number;
  unitLabel: string;
  unitHelper: string;
  description: string;
  dalil: string;
  targetMustahik: string;
}

export const OBLIGATION_CONFIGS: Record<string, ObligationConfig> = {
  fidyah_puasa: {
    label: "Fidyah Puasa Ramadhan (1 Porsi / Hari)",
    category: "Fidyah",
    multiplier: 1,
    unitLabel: "Total Hari Puasa Ditinggalkan",
    unitHelper: "Jumlah hari tidak berpuasa karena lansia, sakit menahun, hamil/menyusui",
    description: "Kewajiban fidyah bagi yang tidak sanggup berpuasa dan tidak memungkinkan qadha.",
    dalil: "QS. Al-Baqarah: 184 (Fidyah memberi makan 1 orang miskin per hari)",
    targetMustahik: "1 Orang Miskin / Hari",
  },
  kifarat_sumpah: {
    label: "Kifarat Sumpah / Kafarat Yamin (10 Porsi / Kasus)",
    category: "Kifarat",
    multiplier: 10,
    unitLabel: "Total Kasus Pelanggaran Sumpah",
    unitHelper: "Jumlah pelanggaran sumpah atas nama Allah (Yamin Mun'aqidah)",
    description: "Tebusan syariah atas pelanggaran sumpah sah yang tidak ditepati.",
    dalil: "QS. Al-Ma'idah: 89 (Memberi makan 10 orang miskin per sumpah)",
    targetMustahik: "10 Orang Miskin / Kasus",
  },
  kifarat_dzihar_jima: {
    label: "Kifarat Dzihar / Jima' Ramadhan (60 Porsi / Kasus)",
    category: "Kifarat",
    multiplier: 60,
    unitLabel: "Total Kasus Pelanggaran Jima' / Dzihar",
    unitHelper: "Jumlah hari hubungan intim siang Ramadhan atau insiden dzihar",
    description: "Kafarat berat bagi yang melanggar dan tidak mampu puasa 2 bulan berturut-turut.",
    dalil: "QS. Al-Mujadilah: 4 & HR. Bukhari Muslim (Memberi makan 60 orang miskin)",
    targetMustahik: "60 Orang Miskin / Kasus",
  },
  fidyah_sholat: {
    label: "Fidyah Sholat Fardhu (1 Porsi / Satuan Sholat)",
    category: "Fidyah",
    multiplier: 1,
    unitLabel: "Total Waktu / Hari Sholat Ditinggalkan",
    unitHelper: "Jumlah waktu sholat fardhu yang ditinggalkan oleh almarhum/almarhumah",
    description: "Fidyah pengganti sholat almarhum menurut mazhab Hanafi & fatwa sebagian Syafi'iyyah.",
    dalil: "Fatwa Fikih Mazhab Hanafi & Kitab I'anatuth Thalibin",
    targetMustahik: "1 Orang Miskin / Satuan Sholat",
  },
};

export const MEAL_PRICE_PRESETS: Record<string, { label: string; price: number; desc: string }> = {
  custom: { label: "Input Manual (Kustom)", price: 0, desc: "Tentukan nominal sendiri" },
  baznas_lengkap: {
    label: "Standar BAZNAS Porsi Matang Lengkap (Rp 60.000 / porsi)",
    price: 60000,
    desc: "Nasi kotak lengkap (lauk hewani, sayur, buah, air) standar BAZNAS RI",
  },
  standar_menengah: {
    label: "Standar Porsi Siap Santap Sedang (Rp 45.000 / porsi)",
    price: 45000,
    desc: "Menu siap santap bergizi seimbang standar amil zakat",
  },
  warung_ekonomis: {
    label: "Standar Porsi Makanan Harian (Rp 30.000 / porsi)",
    price: 30000,
    desc: "Porsi makanan standar harian masyarakat umum",
  },
  beras_mentah_mud: {
    label: "Standar Beras Mentah 1 Mud / 0,75 kg (Rp 15.000 / porsi)",
    price: 15000,
    desc: "Nilai komoditas beras premium 1 mud (± 0,75 kg) standar fikih",
  },
};

export function FidyahKifaratCalculator() {
  // Query States (nuqs URL Parameters)
  const [jenisKewajiban, setJenisKewajiban] = useQueryState(
    "jenisKewajiban",
    parseAsString.withDefault("fidyah_puasa")
  );
  const [jumlahHari, setJumlahHari] = useQueryState(
    "jumlahHari",
    parseAsInteger.withDefault(1)
  );
  const [hargaBeras, setHargaBeras] = useQueryState(
    "hargaBeras",
    parseAsFloat.withDefault(45000)
  );

  // Preset Selection Helper
  const [selectedPreset, setSelectedPreset] = React.useState<string>("standar_menengah");

  // Output Calculation States
  const [totalPortions, setTotalPortions] = React.useState<number>(1);
  const [totalCostRupiah, setTotalCostRupiah] = React.useState<number>(45000);
  const [totalRiceKg, setTotalRiceKg] = React.useState<number>(0.75);
  const [totalRiceMud, setTotalRiceMud] = React.useState<number>(1);
  const [totalRiceSha, setTotalRiceSha] = React.useState<number>(0.25);

  const activeConfig = OBLIGATION_CONFIGS[jenisKewajiban] || OBLIGATION_CONFIGS.fidyah_puasa;

  const calculateObligation = React.useCallback(() => {
    const qty = Math.max(1, jumlahHari || 1);
    const unitPrice = Math.max(0, hargaBeras || 0);
    const multiplier = activeConfig.multiplier;

    // 1. Total Porsi Mustahik = Jumlah Hari/Kasus x Pengali Syariah
    const calculatedPortions = qty * multiplier;

    // 2. Total Biaya Nominal Rupiah = Total Porsi x Harga per Porsi
    const calculatedTotalCost = calculatedPortions * unitPrice;

    // 3. Ekivalen Beras Mentah (1 Mud = 0.75 kg)
    const calculatedRiceKg = parseFloat((calculatedPortions * 0.75).toFixed(2));
    const calculatedRiceMud = calculatedPortions;
    const calculatedRiceSha = parseFloat((calculatedPortions / 4).toFixed(2));

    setTotalPortions(calculatedPortions);
    setTotalCostRupiah(calculatedTotalCost);
    setTotalRiceKg(calculatedRiceKg);
    setTotalRiceMud(calculatedRiceMud);
    setTotalRiceSha(calculatedRiceSha);
  }, [jumlahHari, hargaBeras, activeConfig]);

  // Reactive calculation on parameter changes
  React.useEffect(() => {
    calculateObligation();
  }, [calculateObligation]);

  const handlePresetChange = (presetKey: string) => {
    setSelectedPreset(presetKey);
    if (presetKey !== "custom" && MEAL_PRICE_PRESETS[presetKey]) {
      setHargaBeras(MEAL_PRICE_PRESETS[presetKey].price);
    }
  };

  const handleReset = () => {
    setJenisKewajiban("fidyah_puasa");
    setJumlahHari(1);
    setHargaBeras(45000);
    setSelectedPreset("standar_menengah");
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Parameters Section */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Fidyah & Kifarat
                </h2>
                <p className="text-secondary text-sm">
                  Hitung kewajiban tebusan syariah presisi standar fikih zakat & BAZNAS
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke parameter default"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Jenis Kewajiban Syariah */}
            <div className="sm:col-span-2">
              <Select
                label="Pilihan Jenis Kewajiban Syariah"
                value={jenisKewajiban}
                onChange={(e) => setJenisKewajiban(e.target.value)}
                helperText={activeConfig.description}
              >
                {Object.entries(OBLIGATION_CONFIGS).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Jumlah Hari / Kasus Pelanggaran */}
            <div className="sm:col-span-2">
              <Input
                label={activeConfig.unitLabel}
                type="number"
                min={1}
                step={1}
                value={jumlahHari ?? ""}
                onChange={(e) =>
                  setJumlahHari(e.target.value ? Math.max(1, parseInt(e.target.value, 10)) : null)
                }
                suffix="Hari / Kasus"
                helperText={activeConfig.unitHelper}
              />
            </div>

            {/* Preset Acuan Harga */}
            <div className="sm:col-span-2">
              <Select
                label="Pilihan Acuan Harga Makanan / Beras"
                value={selectedPreset}
                onChange={(e) => handlePresetChange(e.target.value)}
                helperText="Pilih standar porsi BAZNAS atau tentukan nominal rupiah per porsi secara kustom"
              >
                {Object.entries(MEAL_PRICE_PRESETS).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Input Harga Per Porsi */}
            <div className="sm:col-span-2">
              <Input
                label="Harga Makanan / Beras per Porsi (Rp)"
                type="number"
                min={0}
                step={1000}
                value={hargaBeras ?? ""}
                onChange={(e) => {
                  setSelectedPreset("custom");
                  setHargaBeras(e.target.value ? Math.max(0, Number(e.target.value)) : null);
                }}
                prefix="Rp"
                suffix="/ porsi"
                helperText={`Biaya per porsi: ${formatCurrency(hargaBeras || 0)} (1 porsi setara 1 mud / 0,75 kg beras)`}
              />
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={calculateObligation} className="w-full sm:w-auto flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Hitung Kewajiban Presisi
            </Button>
          </div>
        </Card>

        {/* Informational Guidance Card */}
        <Card className="bg-surface/50 border-border/60 text-secondary text-xs leading-relaxed flex items-start gap-3 p-4">
          <Info className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-primary block mb-0.5">Parameter Teknis Terkalibrasi Fikih</span>
            Kadar 1 mud menurut jumhur ulama (Mazhab Syafi&apos;i, Maliki, Hanbali) setara dengan 1/4 sha&apos; atau dibulatkan menjadi <code className="text-accent">0,75 kg (750 gram)</code> beras berkualitas layak konsumsi per porsi mustahik fakir miskin.
          </div>
        </Card>
      </div>

      {/* Output & Breakdown Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Status Classification Badge */}
        <div className="p-4 rounded-2xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-400 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-semibold text-primary">Kategori: {activeConfig.category} Syariah</div>
            <div className="text-secondary text-xs mt-0.5">
              {activeConfig.dalil}
            </div>
          </div>
        </div>

        {/* Output Boxes */}
        <div className="grid grid-cols-1 gap-4">
          <OutputBox
            label="Total Nominal Tebusan Wajib Dibayarkan"
            value={totalCostRupiah}
            prefix="Rp "
          />
          <OutputBox
            label="Total Ekivalen Beras Mentah (1 Mud = 0,75 kg)"
            value={totalRiceKg}
            suffix=" kg Beras"
            decimals={2}
          />
        </div>

        {/* Detailed Breakdown Card */}
        <Card className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase border-b border-border pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" />
            Rincian Audit Distribusi Syariah
          </h3>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-secondary">Jenis Kewajiban:</span>
              <span className="font-medium text-primary text-right max-w-[200px] truncate">{activeConfig.label}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Kuantitas Hari / Kasus:</span>
              <span className="font-mono text-primary font-medium">{jumlahHari || 1} Hari/Kasus</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-accent" />
                Target Distribusi Mustahik:
              </span>
              <span className="font-mono text-accent font-semibold">{totalPortions} Jiwa Mustahik</span>
            </div>

            <div className="flex justify-between items-center border-t border-border/40 pt-2">
              <span className="text-secondary flex items-center gap-1">
                <PackageCheck className="w-3.5 h-3.5 text-secondary" />
                Total Takaran Mud Fikih:
              </span>
              <span className="font-mono text-primary font-medium">{totalRiceMud} Mud (≈ {totalRiceSha} Sha&apos;)</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-secondary" />
                Total Bobot Beras Mentah:
              </span>
              <span className="font-mono text-primary font-bold">{totalRiceKg} kg</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-secondary" />
                Biaya Acuan per Porsi:
              </span>
              <span className="font-mono text-primary font-medium">{formatCurrency(hargaBeras || 0)}</span>
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-center font-semibold">
              <span className="text-primary flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent" />
                Total Nilai Tebusan Finansial:
              </span>
              <span className="font-mono text-accent text-base">
                {formatCurrency(totalCostRupiah)}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default FidyahKifaratCalculator;