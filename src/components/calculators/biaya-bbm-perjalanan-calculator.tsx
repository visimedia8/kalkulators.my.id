"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Fuel,
  Car,
  Users,
  Route,
  Calculator,
  RotateCcw,
  Share2,
  Check,
  ShieldCheck,
  Coins,
  Gauge,
  Sparkles,
  TrendingDown,
  Info,
} from "lucide-react";
import { useQueryState, parseAsFloat, parseAsInteger } from "nuqs";
import { cn } from "@/lib/utils";

// Preset Konsumsi BBM Berdasarkan Kategori Kendaraan
export const VEHICLE_PRESETS: Record<
  string,
  { label: string; consumption: number; desc: string }
> = {
  custom: {
    label: "Kustom (Input Manual)",
    consumption: 15,
    desc: "Tentukan angka konsumsi rata-rata kendaraan sendiri",
  },
  motor_matic: {
    label: "Sepeda Motor Matic / Bebek (45 km/liter)",
    consumption: 45,
    desc: "Honda Beat, Vario, Yamaha NMAX, Aerox, Scoopy",
  },
  motor_sport: {
    label: "Sepeda Motor Sport / Tourer (30 km/liter)",
    consumption: 30,
    desc: "250cc, CB150R, MT-25, Versys, CB500X",
  },
  lcgc_city: {
    label: "LCGC / City Car 1.0 - 1.2L (17 km/liter)",
    consumption: 17,
    desc: "Honda Brio, Toyota Agya, Daihatsu Ayla, Sigra, Calya",
  },
  mpv_family: {
    label: "LMPV / Small MPV 1.5L (14 km/liter)",
    consumption: 14,
    desc: "Toyota Avanza, Xpander, Ertiga, Stargazer, Veloz",
  },
  medium_suv: {
    label: "Medium SUV / Crossover (11 km/liter)",
    consumption: 11,
    desc: "Honda HR-V, CR-V, Wuling Almaz, Hyundai Creta",
  },
  big_suv_diesel: {
    label: "Big SUV / Diesel Ladder Frame (12 km/liter)",
    consumption: 12,
    desc: "Toyota Fortuner, Pajero Sport, Isuzu MU-X",
  },
  sedan_premium: {
    label: "Sedan Eksekutif / Turbo (13 km/liter)",
    consumption: 13,
    desc: "Civic Turbo, Camry, BMW Seri 3, Mercedes C-Class",
  },
  minibus_van: {
    label: "Minibus / Van Travel (9 km/liter)",
    consumption: 9,
    desc: "Toyota HiAce, Isuzu Elf, Hyundai Staria",
  },
};

// Preset Bahan Bakar Indonesia Standar
export const FUEL_PRESETS: Record<
  string,
  { label: string; price: number; type: string }
> = {
  custom: {
    label: "Kustom (Input Manual)",
    price: 10000,
    type: "Kustom",
  },
  pertalite: {
    label: "Pertalite RON 90 (Rp 10.000 / L)",
    price: 10000,
    type: "Bensin RON 90",
  },
  pertamax: {
    label: "Pertamax RON 92 (Rp 12.100 / L)",
    price: 12100,
    type: "Bensin RON 92",
  },
  pertamax_turbo: {
    label: "Pertamax Turbo RON 98 (Rp 13.500 / L)",
    price: 13500,
    type: "Bensin RON 98",
  },
  solar_subsidi: {
    label: "Biosolar Subsidi CN 48 (Rp 6.800 / L)",
    price: 6800,
    type: "Diesel Cetane 48",
  },
  dexlite: {
    label: "Dexlite CN 51 (Rp 13.050 / L)",
    price: 13050,
    type: "Diesel Cetane 51",
  },
  pertamina_dex: {
    label: "Pertamina Dex CN 53 (Rp 13.850 / L)",
    price: 13850,
    type: "Diesel Cetane 53",
  },
  shell_super: {
    label: "Shell Super / BP 92 (Rp 12.500 / L)",
    price: 12500,
    type: "Bensin RON 92",
  },
  shell_vpower: {
    label: "Shell V-Power / BP Ultimate (Rp 13.300 / L)",
    price: 13300,
    type: "Bensin RON 95",
  },
};

// Preset Rute Populer Roadtrip
export const POPULAR_ROUTES = [
  { label: "Jkt - Bdg", distance: 150 },
  { label: "Jkt - Smg", distance: 440 },
  { label: "Jkt - Ygy", distance: 560 },
  { label: "Jkt - Sby", distance: 780 },
  { label: "Jkt - Bali", distance: 1180 },
  { label: "Sby - Mlg", distance: 95 },
  { label: "Mdn - Toba", distance: 165 },
];

export function BiayaBbmPerjalananCalculator() {
  // 1. URL Query State Sync via nuqs
  const [jarakTempuh, setJarakTempuh] = useQueryState(
    "jarakTempuh",
    parseAsFloat.withDefault(150)
  );
  const [konsumsiBBM, setKonsumsiBBM] = useQueryState(
    "konsumsiBBM",
    parseAsFloat.withDefault(15)
  );
  const [hargaBBM, setHargaBBM] = useQueryState(
    "hargaBBM",
    parseAsFloat.withDefault(10000)
  );
  const [jumlahPenumpang, setJumlahPenumpang] = useQueryState(
    "jumlahPenumpang",
    parseAsInteger.withDefault(1)
  );

  // 2. Local State untuk Preset & UI Feedback
  const [selectedVehicle, setSelectedVehicle] = React.useState<string>("custom");
  const [selectedFuel, setSelectedFuel] = React.useState<string>("pertalite");
  const [isCopied, setIsCopied] = React.useState<boolean>(false);

  // 3. Output States
  const [totalLiter, setTotalLiter] = React.useState<number>(0);
  const [totalBiaya, setTotalBiaya] = React.useState<number>(0);
  const [biayaPerOrang, setBiayaPerOrang] = React.useState<number>(0);
  const [biayaPerKm, setBiayaPerKm] = React.useState<number>(0);
  const [literPer100Km, setLiterPer100Km] = React.useState<number>(0);

  // 4. Formula Perhitungan Presisi
  const calculateFuelTrip = React.useCallback(() => {
    const rawDistance = Math.max(0, jarakTempuh ?? 0);
    const rawConsumption = Math.max(0.01, konsumsiBBM ?? 15);
    const rawPrice = Math.max(0, hargaBBM ?? 10000);
    const rawPassengers = Math.max(1, jumlahPenumpang ?? 1);

    // Formula Utama
    const computedLiters = rawDistance / rawConsumption;
    const computedTotalCost = computedLiters * rawPrice;
    const computedPerPerson = computedTotalCost / rawPassengers;

    // Metrik Turunan
    const computedCostPerKm = rawDistance > 0 ? computedTotalCost / rawDistance : 0;
    const computedL100 = rawConsumption > 0 ? 100 / rawConsumption : 0;

    setTotalLiter(Number(computedLiters.toFixed(2)));
    setTotalBiaya(Math.round(computedTotalCost));
    setBiayaPerOrang(Math.round(computedPerPerson));
    setBiayaPerKm(Math.round(computedCostPerKm));
    setLiterPer100Km(Number(computedL100.toFixed(2)));
  }, [jarakTempuh, konsumsiBBM, hargaBBM, jumlahPenumpang]);

  React.useEffect(() => {
    calculateFuelTrip();
  }, [calculateFuelTrip]);

  // Handler Ganti Preset Kendaraan
  const handleVehicleChange = (key: string) => {
    setSelectedVehicle(key);
    if (key !== "custom" && VEHICLE_PRESETS[key]) {
      setKonsumsiBBM(VEHICLE_PRESETS[key].consumption);
    }
  };

  // Handler Ganti Preset BBM
  const handleFuelChange = (key: string) => {
    setSelectedFuel(key);
    if (key !== "custom" && FUEL_PRESETS[key]) {
      setHargaBBM(FUEL_PRESETS[key].price);
    }
  };

  // Handler Reset Nilai Input
  const handleReset = () => {
    setJarakTempuh(150);
    setKonsumsiBBM(15);
    setHargaBBM(10000);
    setJumlahPenumpang(1);
    setSelectedVehicle("custom");
    setSelectedFuel("pertalite");
  };

  // Salin Tautan URL Berisi Parameter
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
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
      {/* Kolom Kiri: Form Parameter Perjalanan & Konsumsi */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Fuel className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter BBM & Rute Roadtrip
                </h2>
                <p className="text-secondary text-sm">
                  Kalkulasi bensin, estimasi liter, dan pembagian patungan rombongan
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated cursor-pointer"
              title="Reset ke konfigurasi default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Input Jarak Tempuh & Preset Rute */}
            <div className="sm:col-span-2 flex flex-col gap-2.5">
              <Input
                label="Jarak Tempuh Perjalanan (Kilometer)"
                type="number"
                min={0}
                step={1}
                value={jarakTempuh ?? ""}
                onChange={(e) =>
                  setJarakTempuh(e.target.value === "" ? null : Number(e.target.value))
                }
                suffix="km"
                helperText="Jarak total satu arah atau pulang-pergi (PP)"
              />

              {/* Rute Cepat Populer */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-xs text-secondary font-medium mr-1 flex items-center gap-1">
                  <Route className="w-3.5 h-3.5 text-accent" />
                  Rute Cepat:
                </span>
                {POPULAR_ROUTES.map((route) => (
                  <button
                    key={route.label}
                    type="button"
                    onClick={() => setJarakTempuh(route.distance)}
                    className={cn(
                      "px-2.5 py-1 text-xs font-mono rounded-lg border transition-all duration-150 cursor-pointer",
                      jarakTempuh === route.distance
                        ? "bg-accent text-white border-accent shadow-sm"
                        : "bg-base text-secondary border-border hover:bg-elevated hover:text-primary"
                    )}
                  >
                    {route.label} ({route.distance}km)
                  </button>
                ))}
              </div>
            </div>

            {/* Pilihan Preset Kendaraan */}
            <div className="sm:col-span-2">
              <Select
                label="Profil Kendaraan & Rasio Bahan Bakar"
                value={selectedVehicle}
                onChange={(e) => handleVehicleChange(e.target.value)}
                helperText="Pilih standar efisiensi kendaraan atau masukkan angka spesifik"
              >
                {Object.entries(VEHICLE_PRESETS).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Input Konsumsi BBM (km/liter) */}
            <Input
              label="Efisiensi Bahan Bakar (Konsumsi BBM)"
              type="number"
              min={0.1}
              step={0.5}
              value={konsumsiBBM ?? ""}
              onChange={(e) => {
                setSelectedVehicle("custom");
                setKonsumsiBBM(e.target.value === "" ? null : Number(e.target.value));
              }}
              suffix="km/L"
              helperText={`Setara dengan ${literPer100Km} L / 100km`}
            />

            {/* Pilihan Preset BBM */}
            <Select
              label="Jenis & Harga Bahan Bakar (BBM)"
              value={selectedFuel}
              onChange={(e) => handleFuelChange(e.target.value)}
              helperText="Pilihan harga resmi SPBU di Indonesia"
            >
              {Object.entries(FUEL_PRESETS).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.label}
                </option>
              ))}
            </Select>

            {/* Input Harga BBM per Liter */}
            <Input
              label="Harga BBM Satuan (per Liter)"
              type="number"
              min={0}
              step={100}
              value={hargaBBM ?? ""}
              onChange={(e) => {
                setSelectedFuel("custom");
                setHargaBBM(e.target.value === "" ? null : Number(e.target.value));
              }}
              prefix="Rp"
              suffix="/L"
              helperText={`Harga terhitung: ${formatCurrency(hargaBBM ?? 0)}/liter`}
            />

            {/* Input Jumlah Penumpang untuk Split Bill */}
            <div className="sm:col-span-2 flex flex-col gap-2.5">
              <Input
                label="Jumlah Penumpang (Split Bill Patungan)"
                type="number"
                min={1}
                max={60}
                step={1}
                value={jumlahPenumpang ?? ""}
                onChange={(e) =>
                  setJumlahPenumpang(
                    e.target.value === "" ? null : Math.max(1, Number(e.target.value))
                  )
                }
                suffix="Orang"
                helperText={`Biaya bahan bakar dibagi rata untuk ${jumlahPenumpang || 1} orang`}
              />

              {/* Tombol Cepat Jumlah Penumpang */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-xs text-secondary font-medium mr-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-accent" />
                  Patungan:
                </span>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setJumlahPenumpang(count)}
                    className={cn(
                      "px-2.5 py-1 text-xs font-mono font-medium rounded-lg border transition-all duration-150 cursor-pointer",
                      jumlahPenumpang === count
                        ? "bg-accent text-white border-accent shadow-sm"
                        : "bg-base text-secondary border-border hover:bg-elevated hover:text-primary"
                    )}
                  >
                    {count} org
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border/50 flex flex-col sm:flex-row items-center gap-3">
            <Button
              onClick={calculateFuelTrip}
              className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              Hitung Biaya BBM Roadtrip
            </Button>

            <Button
              variant="secondary"
              onClick={handleCopyLink}
              className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Tautan Parameter Tersalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Bagikan Hasil / Salin Link</span>
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Technical Assurance Card */}
        <Card className="bg-surface/50 border-border/60 text-secondary text-xs leading-relaxed flex items-start gap-3 p-4">
          <ShieldCheck className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-primary block mb-0.5">
              Standar Presisi Keekonomian Perjalanan
            </span>
            Kalkulator menggunakan formula efisiensi volumetrik terstandarisasi untuk memetakan konsumsi bahan bakar riil, biaya per kilometer, dan pembagian iuran patungan tanpa pembulatan yang merugikan.
          </div>
        </Card>
      </div>

      {/* Kolom Kanan: Tiga Kotak Output Utama & Rincian Keekonomian */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Tiga OutputBox Utama */}
        <OutputBox
          label="Total Kebutuhan Bahan Bakar (Volume BBM)"
          value={totalLiter}
          suffix=" Liter"
          decimals={2}
        />

        <OutputBox
          label="Total Estimasi Biaya BBM Perjalanan"
          value={totalBiaya}
          prefix="Rp "
        />

        <OutputBox
          label={`Biaya BBM per Orang (Patungan ${jumlahPenumpang || 1} Orang)`}
          value={biayaPerOrang}
          prefix="Rp "
        />

        {/* Card Rincian Audit & Efisiensi */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase flex items-center gap-2">
              <Coins className="w-4 h-4 text-accent" />
              Rincian Keekonomian Perjalanan
            </h3>
            <span className="text-xs font-mono text-secondary">
              {jarakTempuh || 0} km
            </span>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-secondary flex items-center gap-1.5">
                <Route className="w-3.5 h-3.5 text-secondary" />
                Jarak Tempuh Total:
              </span>
              <span className="font-mono text-primary font-medium">
                {jarakTempuh || 0} km
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-secondary" />
                Konsumsi Rata-Rata:
              </span>
              <span className="font-mono text-primary font-medium">
                1 : {konsumsiBBM || 0} km/L ({literPer100Km} L/100km)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary flex items-center gap-1.5">
                <Fuel className="w-3.5 h-3.5 text-secondary" />
                Harga BBM Satuan:
              </span>
              <span className="font-mono text-primary font-medium">
                {formatCurrency(hargaBBM || 0)} / Liter
              </span>
            </div>

            <div className="flex justify-between items-center border-t border-border/40 pt-2">
              <span className="text-secondary flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                Biaya Bahan Bakar per Km:
              </span>
              <span className="font-mono text-emerald-400 font-semibold">
                {formatCurrency(biayaPerKm)} / km
              </span>
            </div>

            <div className="flex justify-between items-center border-t border-border/50 pt-2">
              <span className="text-primary font-semibold">Total Biaya Bahan Bakar:</span>
              <span className="font-mono text-accent font-bold text-base">
                {formatCurrency(totalBiaya)}
              </span>
            </div>

            {/* Highlight Iuran Patungan */}
            <div className="pt-2 border-t border-border flex justify-between items-center bg-elevated/40 p-3 rounded-xl">
              <div>
                <span className="text-xs text-secondary block">Iuran Bersih Per Orang:</span>
                <span className="font-semibold text-primary text-sm flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-accent" />
                  Dibagi {jumlahPenumpang || 1} penumpang
                </span>
              </div>
              <span className="font-mono text-emerald-400 text-lg font-bold">
                {formatCurrency(biayaPerOrang)}
              </span>
            </div>
          </div>
        </Card>

        {/* Real-time State Synchronization Card */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            Parameter perjalanan disinkronkan secara <span className="text-primary font-medium">real-time</span> ke dalam tautan URL. Anda dapat menyalin tautan browser untuk membagikan estimasi biaya dan patungan BBM ke grup roadtrip Anda.
          </p>
        </div>
      </div>
    </div>
  );
}