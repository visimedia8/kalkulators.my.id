"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Plane,
  Clock,
  Sun,
  Moon,
  Compass,
  RotateCcw,
  Calculator,
  ShieldCheck,
  Calendar,
  Zap,
  Sparkles,
  Coffee,
  Bed,
  AlertCircle,
  ArrowRight,
  MapPin,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { useQueryState, parseAsInteger } from "nuqs";
import { cn } from "@/lib/utils";

interface TimeZoneOption {
  offset: number;
  label: string;
  cities: string;
}

const TIME_ZONE_OPTIONS: TimeZoneOption[] = [
  { offset: -12, label: "GMT-12:00", cities: "Baker Island, Howland Island" },
  { offset: -11, label: "GMT-11:00", cities: "Pago Pago, Niue, Samoa Amerika" },
  { offset: -10, label: "GMT-10:00", cities: "Honolulu (Hawaii), Tahiti" },
  { offset: -9, label: "GMT-09:00", cities: "Anchorage, Gambier Islands" },
  { offset: -8, label: "GMT-08:00 (PST)", cities: "Los Angeles, San Francisco, Vancouver" },
  { offset: -7, label: "GMT-07:00 (MST)", cities: "Denver, Phoenix, Calgary" },
  { offset: -6, label: "GMT-06:00 (CST)", cities: "Chicago, Mexico City, Dallas" },
  { offset: -5, label: "GMT-05:00 (EST)", cities: "New York, Toronto, Miami, Lima" },
  { offset: -4, label: "GMT-04:00 (AST)", cities: "Santiago, Caracas, Halifax, Manaus" },
  { offset: -3, label: "GMT-03:00 (ART/BRT)", cities: "Buenos Aires, São Paulo, Rio de Janeiro" },
  { offset: -2, label: "GMT-02:00", cities: "South Georgia, Fernando de Noronha" },
  { offset: -1, label: "GMT-01:00", cities: "Azores, Tanjung Verde" },
  { offset: 0, label: "GMT+00:00 (UTC/WET)", cities: "London, Dublin, Lisbon, Casablanca" },
  { offset: 1, label: "GMT+01:00 (CET)", cities: "Paris, Berlin, Roma, Madrid, Amsterdam" },
  { offset: 2, label: "GMT+02:00 (EET)", cities: "Kairo, Athena, Yerusalem, Johannesburg" },
  { offset: 3, label: "GMT+03:00 (MSK/AST)", cities: "Mekkah, Riyadh, Istanbul, Moskow, Doha" },
  { offset: 4, label: "GMT+04:00 (GST)", cities: "Dubai, Abu Dhabi, Baku, Muscat" },
  { offset: 5, label: "GMT+05:00 (PKT)", cities: "Karachi, Tashkent, Islamabad, Maladewa" },
  { offset: 6, label: "GMT+06:00 (BST)", cities: "Dhaka, Almaty, Astana, Omsk" },
  { offset: 7, label: "GMT+07:00 (WIB)", cities: "Jakarta, Surabaya, Bangkok, Hanoi" },
  { offset: 8, label: "GMT+08:00 (WITA/SGT)", cities: "Bali, Singapura, Kuala Lumpur, Hong Kong, Perth" },
  { offset: 9, label: "GMT+09:00 (WIT/JST/KST)", cities: "Tokyo, Seoul, Jayapura, Ambon, Osaka" },
  { offset: 10, label: "GMT+10:00 (AEST)", cities: "Sydney, Melbourne, Brisbane, Guam" },
  { offset: 11, label: "GMT+11:00", cities: "Noumea, Kepulauan Solomon, Vladivostok" },
  { offset: 12, label: "GMT+12:00 (NZST)", cities: "Auckland, Wellington, Fiji, Marshall Islands" },
  { offset: 13, label: "GMT+13:00", cities: "Nuku'alofa (Tonga), Apia (Samoa)" },
  { offset: 14, label: "GMT+14:00", cities: "Kiritimati (Christmas Island, Kiribati)" },
];

interface FlightPreset {
  id: string;
  name: string;
  originOffset: number;
  destOffset: number;
  flightHours: number;
  departureHour: number;
  description: string;
}

const POPULAR_FLIGHT_PRESETS: FlightPreset[] = [
  {
    id: "jkt-tyo",
    name: "Jakarta (WIB) ➔ Tokyo (JST)",
    originOffset: 7,
    destOffset: 9,
    flightHours: 7,
    departureHour: 8,
    description: "Perjalanan ke Timur (+2 Jam). Jet lag ringan.",
  },
  {
    id: "jkt-jed",
    name: "Jakarta (WIB) ➔ Mekkah/Jeddah (AST)",
    originOffset: 7,
    destOffset: 3,
    flightHours: 9,
    departureHour: 11,
    description: "Rute Umroh & Haji ke Barat (-4 Jam). Adaptasi moderat.",
  },
  {
    id: "jkt-lon",
    name: "Jakarta (WIB) ➔ London (GMT)",
    originOffset: 7,
    destOffset: 0,
    flightHours: 15,
    departureHour: 23,
    description: "Perjalanan jarak jauh ke Barat (-7 Jam). Jet lag signifikan.",
  },
  {
    id: "jkt-nyc",
    name: "Jakarta (WIB) ➔ New York (EST)",
    originOffset: 7,
    destOffset: -5,
    flightHours: 20,
    departureHour: 6,
    description: "Pergeseran belahan bumi ekstrem (-12 Jam). Jet lag penuh.",
  },
  {
    id: "dps-syd",
    name: "Bali (WITA) ➔ Sydney (AEST)",
    originOffset: 8,
    destOffset: 10,
    flightHours: 6,
    departureHour: 22,
    description: "Perjalanan liburan ke Timur (+2 Jam). Penyesuaian cepat.",
  },
  {
    id: "jkt-par",
    name: "Jakarta (WIB) ➔ Paris (CET)",
    originOffset: 7,
    destOffset: 1,
    flightHours: 16,
    departureHour: 19,
    description: "Perjalanan ke Barat (-6 Jam). Perlu protokol cahaya pagi.",
  },
  {
    id: "sub-dxb",
    name: "Surabaya (WIB) ➔ Dubai (GST)",
    originOffset: 7,
    destOffset: 4,
    flightHours: 8,
    departureHour: 14,
    description: "Perjalanan bisnis/transit ke Barat (-3 Jam). Adaptasi 2 hari.",
  },
];

export function JetLagZonaWaktuCalculator() {
  // 1. State Input tersinkronisasi URL via nuqs
  const [zonaAsal, setZonaAsal] = useQueryState("zonaAsal", parseAsInteger.withDefault(7));
  const [zonaTujuan, setZonaTujuan] = useQueryState("zonaTujuan", parseAsInteger.withDefault(9));
  const [jamKeberangkatan, setJamKeberangkatan] = useQueryState("jamKeberangkatan", parseAsInteger.withDefault(8));
  const [durasiPenerbangan, setDurasiPenerbangan] = useQueryState("durasiPenerbangan", parseAsInteger.withDefault(7));

  // 2. Computed Outputs
  const [bedaZona, setBedaZona] = React.useState<number>(2);
  const [arahPerjalanan, setArahPerjalanan] = React.useState<"timur" | "barat" | "sama">("timur");
  const [hariPemulihan, setHariPemulihan] = React.useState<number>(2);
  const [severity, setSeverity] = React.useState<{
    level: string;
    badgeColor: string;
    bgLight: string;
    description: string;
  }>({
    level: "Ringan (Mild)",
    badgeColor: "text-emerald-400 border-emerald-500/30",
    bgLight: "bg-emerald-500/10",
    description: "Pergeseran waktu minimal. Ritme sirkadian dapat menyesuaikan diri dalam 1-2 hari.",
  });
  const [waktuTibaLokal, setWaktuTibaLokal] = React.useState<string>("17:00");
  const [bedaHariTiba, setBedaHariTiba] = React.useState<string>("Hari yang sama");

  // 3. Logika Perhitungan Presisi
  const calculateJetLag = React.useCallback(() => {
    const asal = zonaAsal ?? 7;
    const tujuan = zonaTujuan ?? 9;
    const depHour = Math.min(23, Math.max(0, jamKeberangkatan ?? 8));
    const flightHours = Math.max(1, durasiPenerbangan ?? 7);

    // Beda Zona Mutlak
    const selisih = Math.abs(tujuan - asal);
    setBedaZona(selisih);

    // Tentukan Arah Perjalanan
    let arah: "timur" | "barat" | "sama" = "sama";
    if (tujuan > asal) {
      arah = "timur";
    } else if (tujuan < asal) {
      arah = "barat";
    }
    setArahPerjalanan(arah);

    // Rumus Estimasi Hari Pemulihan:
    // Ke Timur (Phase Advance / Kehilangan Waktu): Tubuh menyesuaikan ~1 jam per 1.0 hari -> Hari = Beda Zona / 1.0 (atau Beda Zona x 1.0)
    // Ke Barat (Phase Delay / Mendapat Waktu Tambahan): Tubuh menyesuaikan ~1.5 jam per hari -> Hari = Beda Zona / 1.5
    let days = 0;
    if (selisih === 0) {
      days = 0;
    } else if (arah === "timur") {
      days = Number((selisih / 1.0).toFixed(1));
    } else {
      days = Number((selisih / 1.5).toFixed(1));
    }
    setHariPemulihan(days);

    // Evaluasi Tingkat Keparahan Desinkronisasi Sirkadian
    if (selisih === 0) {
      setSeverity({
        level: "Nir-Jet Lag (Zona Sama)",
        badgeColor: "text-emerald-400 border-emerald-500/30",
        bgLight: "bg-emerald-500/10",
        description: "Tidak ada pergeseran jam sirkadian. Anda hanya perlu memulihkan kelelahan fisik penerbangan (*travel fatigue*).",
      });
    } else if (selisih <= 2) {
      setSeverity({
        level: "Ringan (Mild)",
        badgeColor: "text-emerald-400 border-emerald-500/30",
        bgLight: "bg-emerald-500/10",
        description: "Pergeseran ritme biologis minor. Gejala kantuk ringan teratasi cepat dalam 1 hingga 2 hari.",
      });
    } else if (selisih <= 5) {
      setSeverity({
        level: "Moderat (Moderate)",
        badgeColor: "text-amber-400 border-amber-500/30",
        bgLight: "bg-amber-500/10",
        description: "Penurunan konsentrasi dan gangguan fase tidur awal. Butuh penyesuaian paparan cahaya terencana.",
      });
    } else if (selisih <= 8) {
      setSeverity({
        level: "Signifikan (Significant)",
        badgeColor: "text-orange-400 border-orange-500/30",
        bgLight: "bg-orange-500/10",
        description: "Desinkronisasi hormonal kortisol dan melatonin nyata. Diperlukan pengaturan jam tidur dan hindari kafein petang.",
      });
    } else {
      setSeverity({
        level: "Ekstrem / Penuh (Severe)",
        badgeColor: "text-red-400 border-red-500/30",
        bgLight: "bg-red-500/10",
        description: "Perbedaan siang-malam terbalik total (fase antipoda). Butuh adaptasi bertahap 6-12 hari dengan manajemen melatonin.",
      });
    }

    // Kalkulasi Waktu Kedatangan di Kota Tujuan
    const netHourArrival = depHour + flightHours + (tujuan - asal);
    let arrivalHour = netHourArrival % 24;
    if (arrivalHour < 0) arrivalHour += 24;

    const formattedHour = String(Math.floor(arrivalHour)).padStart(2, "0");
    setWaktuTibaLokal(`${formattedHour}:00`);

    const daysOffset = Math.floor(netHourArrival / 24);
    if (daysOffset === 0) {
      setBedaHariTiba("Hari yang sama (H+0)");
    } else if (daysOffset === 1) {
      setBedaHariTiba("Keesokan harinya (H+1)");
    } else if (daysOffset >= 2) {
      setBedaHariTiba(`H+${daysOffset} hari berikutnya`);
    } else {
      setBedaHariTiba(`H${daysOffset} hari sebelumnya (Melintasi IDL)`);
    }
  }, [zonaAsal, zonaTujuan, jamKeberangkatan, durasiPenerbangan]);

  React.useEffect(() => {
    calculateJetLag();
  }, [calculateJetLag]);

  const handleReset = () => {
    setZonaAsal(7);
    setZonaTujuan(9);
    setJamKeberangkatan(8);
    setDurasiPenerbangan(7);
  };

  const handlePresetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const preset = POPULAR_FLIGHT_PRESETS.find((p) => p.id === val);
    if (preset) {
      setZonaAsal(preset.originOffset);
      setZonaTujuan(preset.destOffset);
      setDurasiPenerbangan(preset.flightHours);
      setJamKeberangkatan(preset.departureHour);
    }
  };

  const formatOffsetLabel = (offset: number) => {
    if (offset === 0) return "GMT+0 (UTC)";
    return offset > 0 ? `GMT+${offset}` : `GMT${offset}`;
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Kolom Kiri: Form Parameter Rute & Zona Waktu */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Perjalanan & Zona Waktu
                </h2>
                <p className="text-secondary text-sm">
                  Simulasikan selisih offset GMT, arah penerbangan, dan waktu pemulihan biologis
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke rute default (Jakarta ➔ Tokyo)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Preset Penerbangan Populer */}
          <div className="flex flex-col gap-1.5">
            <Select
              label="Preset Rute Penerbangan Internasional"
              onChange={handlePresetSelect}
              defaultValue="jkt-tyo"
              helperText="Pilih rute wisata, umroh, atau bisnis populer untuk mengisi parameter instan"
            >
              {POPULAR_FLIGHT_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.description})
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Zona Asal */}
            <Select
              label="Zona Waktu Asal (Keberangkatan)"
              value={zonaAsal ?? 7}
              onChange={(e) => setZonaAsal(Number(e.target.value))}
              helperText={`Kota: ${TIME_ZONE_OPTIONS.find((t) => t.offset === (zonaAsal ?? 7))?.cities || ""}`}
            >
              {TIME_ZONE_OPTIONS.map((item) => (
                <option key={`asal-${item.offset}`} value={item.offset}>
                  {item.label} — {item.cities.split(",")[0]}
                </option>
              ))}
            </Select>

            {/* Zona Tujuan */}
            <Select
              label="Zona Waktu Tujuan (Kedatangan)"
              value={zonaTujuan ?? 9}
              onChange={(e) => setZonaTujuan(Number(e.target.value))}
              helperText={`Kota: ${TIME_ZONE_OPTIONS.find((t) => t.offset === (zonaTujuan ?? 9))?.cities || ""}`}
            >
              {TIME_ZONE_OPTIONS.map((item) => (
                <option key={`tujuan-${item.offset}`} value={item.offset}>
                  {item.label} — {item.cities.split(",")[0]}
                </option>
              ))}
            </Select>

            {/* Jam Keberangkatan */}
            <Input
              label="Jam Keberangkatan (Waktu Lokal Asal)"
              type="number"
              min={0}
              max={23}
              step={1}
              value={jamKeberangkatan ?? ""}
              onChange={(e) =>
                setJamKeberangkatan(
                  e.target.value === "" ? null : Math.min(23, Math.max(0, Number(e.target.value)))
                )
              }
              suffix=":00 WIB/Lokal"
              helperText="Format 24 Jam (Contoh: 08 untuk 08:00 pagi, 21 untuk 21:00 malam)"
            />

            {/* Durasi Penerbangan */}
            <Input
              label="Estimasi Durasi Terbang (Termasuk Transit)"
              type="number"
              min={1}
              max={48}
              step={1}
              value={durasiPenerbangan ?? ""}
              onChange={(e) =>
                setDurasiPenerbangan(
                  e.target.value === "" ? null : Math.max(1, Number(e.target.value))
                )
              }
              suffix="Jam"
              helperText="Lama total waktu di udara dan transit bandara"
            />
          </div>

          <div className="pt-2">
            <Button
              onClick={calculateJetLag}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Hitung Pemulihan Sirkadian
            </Button>
          </div>
        </Card>

        {/* Technical Assurance / Chronobiology Note */}
        <Card className="bg-surface/50 border-border/60 text-secondary text-xs leading-relaxed flex items-start gap-3 p-4">
          <ShieldCheck className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-primary block mb-0.5">
              Standar Medis Kronobiologi Terkalibrasi
            </span>
            Perhitungan menerapkan asimetri adaptasi sirkadian: perjalanan ke arah <strong>Timur (*Phase Advance*)</strong> membutuhkan adaptasi ~1 hari per jam pergeseran waktu karena tubuh dipaksa memajukan jam tidur, sedangkan perjalanan ke <strong>Barat (*Phase Delay*)</strong> lebih cepat pulih (~1.5 jam per hari) karena ritme alami sirkadian manusia secara natural sedikit lebih panjang dari 24 jam (~24.2 jam).
          </div>
        </Card>

        {/* Rencana Aksi Adaptasi Harian */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-semibold font-display text-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Protokol Adaptasi Sirkadian di Kota Tujuan
            </h3>
            <span className="text-xs font-mono text-secondary">
              Arah: {arahPerjalanan === "timur" ? "Ke Timur (Maju)" : arahPerjalanan === "barat" ? "Ke Barat (Mundur)" : "Zona Sama"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            {/* Strategi Paparan Cahaya */}
            <div className="p-3.5 rounded-xl border border-border/60 bg-base/50 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Sun className="w-4 h-4" />
                <span>Manajemen Paparan Cahaya Terang</span>
              </div>
              <p className="text-secondary leading-relaxed">
                {arahPerjalanan === "timur"
                  ? "Cari sinar matahari pagi (07:00 - 10:00 waktu setempat) untuk merangsang nukleus suprakiasmatik memajukan jam biologis. Hindari cahaya biru/lampu terang 2 jam sebelum tidur."
                  : arahPerjalanan === "barat"
                  ? "Dapatkan paparan sinar matahari di sore hari menjelang magrib (16:00 - 18:30 waktu setempat) guna menunda pelepasan melatonin dan memperpanjang rasa terjaga."
                  : "Tetap ikuti siklus pencahayaan normal karena tidak terjadi pergeseran jam sirkadian."}
              </p>
            </div>

            {/* Strategi Jam Tidur & Melatonin */}
            <div className="p-3.5 rounded-xl border border-border/60 bg-base/50 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                <Moon className="w-4 h-4" />
                <span>Waktu Tidur & Suplementasi Melatonin</span>
              </div>
              <p className="text-secondary leading-relaxed">
                {arahPerjalanan === "timur"
                  ? "Paksa tidur sesuai jam malam lokal (22:00-23:00). Jika diperlukan suplemen melatonin dosis rendah (0.5-3 mg), konsumsi 30-60 menit sebelum jam tidur target lokal."
                  : arahPerjalanan === "barat"
                  ? "Tahan rasa kantuk di sore hari. Jangan tidur sebelum pukul 21:30 waktu lokal. Jika terbangun pukul 03:00 pagi, tetaplah di tempat tidur dalam ruangan gelap gulita."
                  : "Pertahankan jadwal tidur reguler 7-8 jam per malam."}
              </p>
            </div>

            {/* Strategi Kafein & Hidrasi */}
            <div className="p-3.5 rounded-xl border border-border/60 bg-base/50 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-rose-400 font-semibold">
                <Coffee className="w-4 h-4" />
                <span>Batas Cut-off Kafein & Nutrisi</span>
              </div>
              <p className="text-secondary leading-relaxed">
                Hentikan konsumsi kopi, teh, dan minuman berenergi minimal <strong>6 jam sebelum jam tidur target</strong> di kota tujuan. Minum air putih 250 ml per jam penerbangan guna mencegah dehidrasi kabin pesawat.
              </p>
            </div>

            {/* Waktu Olahraga Ringan */}
            <div className="p-3.5 rounded-xl border border-border/60 bg-base/50 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Activity className="w-4 h-4" />
                <span>Aktivitas Fisik & Peregangan</span>
              </div>
              <p className="text-secondary leading-relaxed">
                Lakukan jalan santai atau kardio intensitas ringan di pagi/siang hari waktu setempat. Hindari olahraga berat 3 jam menjelang waktu tidur karena meningkatkan suhu tubuh inti (*core temperature*).
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Kolom Kanan: Output & Ringkasan Pemulihan Sirkadian */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Output Box 1: Hari Pemulihan */}
        <OutputBox
          label="Estimasi Waktu Pemulihan Penuh"
          value={hariPemulihan}
          decimals={1}
          suffix=" Hari"
        />

        {/* Output Box 2: Beda Jam */}
        <OutputBox
          label="Selisih Perbedaan Waktu Antar-Zona"
          value={bedaZona}
          decimals={0}
          suffix=" Jam"
        />

        {/* Matriks Parameter Sirkadian */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase flex items-center gap-1.5">
              <Plane className="w-4 h-4 text-accent" />
              Matriks Ringkasan Rute
            </h3>
            <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full border", severity.badgeColor, severity.bgLight)}>
              {severity.level}
            </span>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            {/* Visualisasi Rute Asal ➔ Tujuan */}
            <div className="p-3 rounded-xl bg-base border border-border flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-secondary text-[11px]">Kota Asal ({formatOffsetLabel(zonaAsal ?? 7)})</span>
                <span className="font-semibold text-primary text-sm">
                  {TIME_ZONE_OPTIONS.find((t) => t.offset === (zonaAsal ?? 7))?.cities.split(",")[0]}
                </span>
                <span className="text-secondary font-mono text-[11px]">Berangkat: {String(jamKeberangkatan ?? 8).padStart(2, "0")}:00</span>
              </div>

              <div className="flex flex-col items-center px-2">
                <ArrowRight className="w-5 h-5 text-accent" />
                <span className="text-[10px] font-mono text-secondary">{durasiPenerbangan ?? 7} Jam Terbang</span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-secondary text-[11px]">Kota Tujuan ({formatOffsetLabel(zonaTujuan ?? 9)})</span>
                <span className="font-semibold text-primary text-sm">
                  {TIME_ZONE_OPTIONS.find((t) => t.offset === (zonaTujuan ?? 9))?.cities.split(",")[0]}
                </span>
                <span className="text-accent font-mono text-[11px]">Tiba: ~{waktuTibaLokal}</span>
              </div>
            </div>

            {/* Baris Status Kedatangan */}
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-secondary flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-accent" />
                Estimasi Waktu Tiba Lokal
              </span>
              <span className="font-mono font-semibold text-primary">
                {waktuTibaLokal} ({bedaHariTiba})
              </span>
            </div>

            {/* Baris Arah Pergeseran */}
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-secondary flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-blue-400" />
                Arah Penyesuaian Sirkadian
              </span>
              <span className="font-semibold text-primary">
                {arahPerjalanan === "timur"
                  ? "Ke Timur (Phase Advance / Maju)"
                  : arahPerjalanan === "barat"
                  ? "Ke Barat (Phase Delay / Mundur)"
                  : "Tanpa Pergeseran Jam"}
              </span>
            </div>

            {/* Baris Laju Adaptasi */}
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-secondary flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Kecepatan Adaptasi Biologis
              </span>
              <span className="font-mono text-primary">
                {arahPerjalanan === "timur"
                  ? "1.0 Jam / Hari (Lebih Berat)"
                  : arahPerjalanan === "barat"
                  ? "1.5 Jam / Hari (Lebih Ringan)"
                  : "0 Jam (Adaptasi Instan)"}
              </span>
            </div>

            {/* Penjelasan Tingkat Keparahan */}
            <div className="p-3 rounded-xl bg-surface border border-border/60 text-secondary text-[11px] leading-relaxed">
              <div className="font-semibold text-primary mb-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-accent" />
                Diagnosis Desinkronisasi
              </div>
              {severity.description}
            </div>
          </div>
        </Card>

        {/* Timeline Hari Pemulihan Bertahap */}
        {bedaZona > 0 && (
          <Card className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-sm font-semibold font-display text-primary flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-accent" />
                Progres Adaptasi Harian Tubuh
              </h3>
              <span className="text-xs font-mono text-secondary">Target 100% Sembuh</span>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              {Array.from({ length: Math.min(5, Math.ceil(hariPemulihan)) }).map((_, idx) => {
                const dayNum = idx + 1;
                const progressPct = Math.min(100, Math.round((dayNum / hariPemulihan) * 100));
                return (
                  <div key={`day-${dayNum}`} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-secondary">
                        Hari ke-{dayNum}: {progressPct >= 100 ? "Penyesuaian Penuh" : `Adaptasi Fase Sirkadian ~${progressPct}%`}
                      </span>
                      <span className="font-mono text-primary">{progressPct}%</span>
                    </div>
                    <div className="w-full bg-base rounded-full h-1.5 overflow-hidden border border-border/40">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          progressPct >= 100 ? "bg-emerald-500" : "bg-accent"
                        )}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}