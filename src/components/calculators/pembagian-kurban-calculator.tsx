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
  Users,
  HeartHandshake,
  FileText,
  PackageCheck,
  CheckCircle2,
  Gift,
  PieChart,
} from "lucide-react";
import { useQueryState, parseAsFloat, parseAsInteger } from "nuqs";

export const KURBAN_PRESETS: Record<
  string,
  { label: string; karkas: number; shohibul: number; desc: string }
> = {
  custom: {
    label: "Input Manual (Kustom)",
    karkas: 0,
    shohibul: 1,
    desc: "Tentukan berat karkas dan jumlah shohibul secara mandiri",
  },
  sapi_standar: {
    label: "Sapi Standar 7 Shohibul (150 kg karkas)",
    karkas: 150,
    shohibul: 7,
    desc: "Sapi bobot hidup ± 300–350 kg menghasilkan karkas 150 kg untuk 7 pekurban",
  },
  sapi_jumbo: {
    label: "Sapi Jumbo / Limousin (300 kg karkas)",
    karkas: 300,
    shohibul: 7,
    desc: "Sapi premium bobot hidup ± 600–700 kg dengan karkas 300 kg untuk 7 pekurban",
  },
  sapi_tunggal: {
    label: "Sapi 1 Shohibul Mandiri (150 kg karkas)",
    karkas: 150,
    shohibul: 1,
    desc: "Sapi kurban mandiri atas nama 1 orang shohibul",
  },
  kambing_dewasa: {
    label: "Kambing / Domba Dewasa (24 kg karkas)",
    karkas: 24,
    shohibul: 1,
    desc: "Kambing bobot hidup ± 45–50 kg menghasilkan karkas 24 kg untuk 1 pekurban",
  },
  kambing_standar: {
    label: "Kambing / Domba Standar (18 kg karkas)",
    karkas: 18,
    shohibul: 1,
    desc: "Kambing bobot hidup ± 35–40 kg menghasilkan karkas 18 kg untuk 1 pekurban",
  },
};

export const PACKAGE_SIZE_OPTIONS: Record<string, { label: string; size: number }> = {
  "1.0": { label: "1,0 kg per kantong / paket (Standar DKM)", size: 1.0 },
  "0.75": { label: "0,75 kg per kantong / paket (Porsi Menengah)", size: 0.75 },
  "0.5": { label: "0,5 kg per kantong / paket (Distribusi Luas)", size: 0.5 },
  "1.5": { label: "1,5 kg per kantong / paket (Porsi Keluarga)", size: 1.5 },
  "2.0": { label: "2,0 kg per kantong / paket (Porsi Besar)", size: 2.0 },
};

export function KurbanCalculator() {
  // Query States (nuqs URL Parameters)
  const [beratKarkas, setBeratKarkas] = useQueryState(
    "beratKarkas",
    parseAsFloat.withDefault(150)
  );
  const [jumlahShohibul, setJumlahShohibul] = useQueryState(
    "jumlahShohibul",
    parseAsInteger.withDefault(7)
  );

  // Local States
  const [selectedPreset, setSelectedPreset] = React.useState<string>("sapi_standar");
  const [packageSizeKey, setPackageSizeKey] = React.useState<string>("1.0");

  // Output Calculation States
  const [shohibulTotal, setShohibulTotal] = React.useState<number>(50);
  const [shohibulPerPerson, setShohibulPerPerson] = React.useState<number>(7.14);
  const [fakirTotal, setFakirTotal] = React.useState<number>(50);
  const [fakirPackages, setFakirPackages] = React.useState<number>(50);
  const [hadiahTotal, setHadiahTotal] = React.useState<number>(50);
  const [hadiahPackages, setHadiahPackages] = React.useState<number>(50);
  const [totalPublicPackages, setTotalPublicPackages] = React.useState<number>(100);

  const activePackageSize = PACKAGE_SIZE_OPTIONS[packageSizeKey]?.size || 1.0;

  const calculateKurban = React.useCallback(() => {
    const karkas = Math.max(0.1, beratKarkas ?? 150);
    const shohibulCount = Math.max(1, Math.min(7, jumlahShohibul ?? 7));
    const pSize = Math.max(0.1, activePackageSize);

    // Rumus Fikih: 1/3 Shohibul, 1/3 Fakir Miskin, 1/3 Hadiah Kerabat
    const shohibulWeight = parseFloat((karkas / 3).toFixed(2));
    const perPerson = parseFloat((shohibulWeight / shohibulCount).toFixed(2));

    const fakirWeight = parseFloat((karkas / 3).toFixed(2));
    const fakirPkt = Math.floor(fakirWeight / pSize);

    const hadiahWeight = parseFloat((karkas / 3).toFixed(2));
    const hadiahPkt = Math.floor(hadiahWeight / pSize);

    const totalPkt = fakirPkt + hadiahPkt;

    setShohibulTotal(shohibulWeight);
    setShohibulPerPerson(perPerson);
    setFakirTotal(fakirWeight);
    setFakirPackages(fakirPkt);
    setHadiahTotal(hadiahWeight);
    setHadiahPackages(hadiahPkt);
    setTotalPublicPackages(totalPkt);
  }, [beratKarkas, jumlahShohibul, activePackageSize]);

  // Reactive calculation on parameter changes
  React.useEffect(() => {
    calculateKurban();
  }, [calculateKurban]);

  const handlePresetChange = (presetKey: string) => {
    setSelectedPreset(presetKey);
    if (presetKey !== "custom" && KURBAN_PRESETS[presetKey]) {
      setBeratKarkas(KURBAN_PRESETS[presetKey].karkas);
      setJumlahShohibul(KURBAN_PRESETS[presetKey].shohibul);
    }
  };

  const handleReset = () => {
    setBeratKarkas(150);
    setJumlahShohibul(7);
    setSelectedPreset("sapi_standar");
    setPackageSizeKey("1.0");
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Parameters Section */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Pembagian Daging Kurban
                </h2>
                <p className="text-secondary text-sm">
                  Hitung alokasi proporsional 1/3 syariah untuk shohibul, fakir miskin, dan hadiah
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
            {/* Preset Hewan Kurban */}
            <div className="sm:col-span-2">
              <Select
                label="Pilihan Preset Hewan Kurban"
                value={selectedPreset}
                onChange={(e) => handlePresetChange(e.target.value)}
                helperText="Pilih standar bobot hewan kurban atau masukkan parameter teknis kustom"
              >
                {Object.entries(KURBAN_PRESETS).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Input Berat Karkas */}
            <div className="sm:col-span-2">
              <Input
                label="Total Berat Karkas / Daging Bersih Siap Bagi"
                type="number"
                min={1}
                step={0.5}
                value={beratKarkas ?? ""}
                onChange={(e) => {
                  setSelectedPreset("custom");
                  setBeratKarkas(
                    e.target.value ? Math.max(0.1, parseFloat(e.target.value)) : null
                  );
                }}
                suffix="kg"
                helperText="Total bobot daging dan tulang bersih karkas yang siap didistribusikan"
              />
            </div>

            {/* Input Jumlah Shohibul */}
            <div>
              <Input
                label="Jumlah Shohibul Kurban (Pekurban)"
                type="number"
                min={1}
                max={7}
                step={1}
                value={jumlahShohibul ?? ""}
                onChange={(e) => {
                  setSelectedPreset("custom");
                  setJumlahShohibul(
                    e.target.value ? Math.max(1, Math.min(7, parseInt(e.target.value, 10))) : null
                  );
                }}
                suffix="Orang"
                helperText="Maksimal 7 orang untuk sapi/unta, 1 orang untuk kambing"
              />
            </div>

            {/* Pilihan Ukuran Paket */}
            <div>
              <Select
                label="Ukuran Kantong Paket Distribusi"
                value={packageSizeKey}
                onChange={(e) => setPackageSizeKey(e.target.value)}
                helperText="Bobot bersih per kantong pembagian untuk masyarakat"
              >
                {Object.entries(PACKAGE_SIZE_OPTIONS).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={calculateKurban}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Hitung Alokasi Kurban Presisi
            </Button>
          </div>
        </Card>
      </div>

      {/* Output & Breakdown Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Status Card Indicator */}
        <div className="p-4 rounded-2xl border flex items-center gap-3 transition-colors bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-semibold text-primary">
              Status Fikih: Sesuai Sunnah & Syariat
            </div>
            <div className="text-secondary text-xs mt-0.5">
              Pembagian proporsional 1/3 Shohibul : 1/3 Fakir Miskin : 1/3 Hadiah Kerabat
            </div>
          </div>
        </div>

        {/* Primary Metric Output Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <OutputBox
            label="Total Jatah Shohibul (1/3)"
            value={shohibulTotal}
            suffix=" kg"
            decimals={2}
          />
          <OutputBox
            label="Jatah per Orang Shohibul"
            value={shohibulPerPerson}
            suffix=" kg"
            decimals={2}
          />
          <OutputBox
            label="Jatah Fakir Miskin (1/3)"
            value={fakirTotal}
            suffix=" kg"
            decimals={2}
          />
          <OutputBox
            label="Jatah Hadiah & Kerabat (1/3)"
            value={hadiahTotal}
            suffix=" kg"
            decimals={2}
          />
        </div>

        {/* Audit Breakdown Card */}
        <Card className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase border-b border-border pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" />
            Rincian Audit Distribusi Kurban
          </h3>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-secondary">Total Bobot Karkas Siap Bagi:</span>
              <span className="font-mono text-primary font-medium">
                {(beratKarkas || 0).toFixed(2)} kg
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Jumlah Shohibul Terdaftar:</span>
              <span className="font-mono text-primary font-medium">
                {jumlahShohibul || 1} Orang
              </span>
            </div>

            <div className="flex justify-between items-center border-t border-border/40 pt-2">
              <span className="text-secondary flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-accent" />
                Shohibul (Maks. 33,33%):
              </span>
              <span className="font-mono text-primary font-semibold">
                {shohibulTotal.toFixed(2)} kg ({shohibulPerPerson.toFixed(2)} kg/org)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
                Fakir Miskin (Sedekah 33,33%):
              </span>
              <span className="font-mono text-emerald-400 font-semibold">
                {fakirTotal.toFixed(2)} kg ({fakirPackages} kantong)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-blue-400" />
                Hadiah / Kerabat (33,33%):
              </span>
              <span className="font-mono text-blue-400 font-semibold">
                {hadiahTotal.toFixed(2)} kg ({hadiahPackages} kantong)
              </span>
            </div>

            <div className="flex justify-between items-center border-t border-border/50 pt-2">
              <span className="text-secondary font-medium">
                Spesifikasi Paket Kantong:
              </span>
              <span className="font-mono text-primary font-medium">
                {activePackageSize} kg / kantong
              </span>
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-center font-semibold">
              <span className="text-primary flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4 text-accent" />
                Total Paket Terdistribusi:
              </span>
              <span className="font-mono text-accent text-base">
                {totalPublicPackages} Kantong Paket
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}