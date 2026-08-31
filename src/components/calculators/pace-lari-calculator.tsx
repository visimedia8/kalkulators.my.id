"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Timer,
  RotateCcw,
  Calculator,
  Footprints,
  TrendingUp,
  Info,
  Activity,
  Zap,
} from "lucide-react";
import { useQueryState, parseAsFloat } from "nuqs";
import { cn } from "@/lib/utils";

interface TrainingZone {
  name: string;
  description: string;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
}

interface RaceProjection {
  name: string;
  distanceKm: number;
  timeFormatted: string;
  speed: number;
}

export function PaceCalculator() {
  // State Input via nuqs (URL Query State)
  const [jarak, setJarak] = useQueryState("jarak", parseAsFloat.withDefault(5));
  const [waktuJam, setWaktuJam] = useQueryState("waktuJam", parseAsFloat.withDefault(0));
  const [waktuMenit, setWaktuMenit] = useQueryState("waktuMenit", parseAsFloat.withDefault(27));
  const [waktuDetik, setWaktuDetik] = useQueryState("waktuDetik", parseAsFloat.withDefault(30));

  // Output States
  const [paceDecimal, setPaceDecimal] = React.useState<number>(5.5);
  const [paceMin, setPaceMin] = React.useState<number>(5);
  const [paceSec, setPaceSec] = React.useState<number>(30);
  const [speedKmh, setSpeedKmh] = React.useState<number>(10.91);
  const [paceMileMin, setPaceMileMin] = React.useState<number>(8);
  const [paceMileSec, setPaceMileSec] = React.useState<number>(51);
  const [totalMinutes, setTotalMinutes] = React.useState<number>(27.5);
  const [trainingZone, setTrainingZone] = React.useState<TrainingZone>({
    name: "Zona 3: Aerobic Endurance (Steady State)",
    description: "Membangun efisiensi kardiovaskular dan kapasitas daya tahan aerobik jarak jauh.",
    badgeColor: "text-emerald-400",
    badgeBg: "bg-emerald-500/10",
    badgeBorder: "border-emerald-500/30",
  });
  const [projections, setProjections] = React.useState<RaceProjection[]>([]);

  const calculatePace = React.useCallback(() => {
    const dist = Math.max(0.001, jarak ?? 0);
    const hrs = Math.max(0, waktuJam ?? 0);
    const mins = Math.max(0, waktuMenit ?? 0);
    const secs = Math.max(0, waktuDetik ?? 0);

    const totalSec = hrs * 3600 + mins * 60 + secs;
    const totMin = totalSec / 60;
    setTotalMinutes(Number(totMin.toFixed(2)));

    if (totalSec <= 0 || dist <= 0) {
      setPaceDecimal(0);
      setPaceMin(0);
      setPaceSec(0);
      setSpeedKmh(0);
      setPaceMileMin(0);
      setPaceMileSec(0);
      setProjections([]);
      return;
    }

    // 1. Rumus Pace = Total Waktu (dalam menit) / Jarak (km)
    const pDec = totMin / dist;
    let pM = Math.floor(pDec);
    let pS = Math.round((pDec - pM) * 60);
    if (pS >= 60) {
      pM += 1;
      pS = 0;
    }

    setPaceDecimal(Number(pDec.toFixed(2)));
    setPaceMin(pM);
    setPaceSec(pS);

    // 2. Kecepatan (Speed km/jam) = Jarak (km) / Waktu (jam)
    const hours = totMin / 60;
    const speed = hours > 0 ? dist / hours : 0;
    setSpeedKmh(Number(speed.toFixed(2)));

    // 3. Konversi Pace per Mil (1 mil = 1.609344 km)
    const pMileDec = pDec * 1.609344;
    let pMileM = Math.floor(pMileDec);
    let pMileS = Math.round((pMileDec - pMileM) * 60);
    if (pMileS >= 60) {
      pMileM += 1;
      pMileS = 0;
    }
    setPaceMileMin(pMileM);
    setPaceMileSec(pMileS);

    // 4. Klasifikasi Zona Intensitas Fisiologis
    if (pDec < 3.5) {
      setTrainingZone({
        name: "Zona 5: VO2 Max / Anaerobic Sprint",
        description: "Intensitas maksimal atletik, sprint kompetitif, dan interval anaerobik.",
        badgeColor: "text-purple-400",
        badgeBg: "bg-purple-500/10",
        badgeBorder: "border-purple-500/30",
      });
    } else if (pDec < 4.5) {
      setTrainingZone({
        name: "Zona 4: Lactate Threshold / Tempo Run",
        description: "Meningkatkan ambang batas laktat dan kecepatan ritme kompetisi.",
        badgeColor: "text-blue-400",
        badgeBg: "bg-blue-500/10",
        badgeBorder: "border-blue-500/30",
      });
    } else if (pDec < 5.75) {
      setTrainingZone({
        name: "Zona 3: Aerobic Endurance (Steady State)",
        description: "Membangun efisiensi kardiovaskular dan kapasitas daya tahan aerobik jarak jauh.",
        badgeColor: "text-emerald-400",
        badgeBg: "bg-emerald-500/10",
        badgeBorder: "border-emerald-500/30",
      });
    } else if (pDec < 7.25) {
      setTrainingZone({
        name: "Zona 2: Easy Run / Fat Max Base",
        description: "Pembakaran lemak optimal dan pembentukan fondasi aerobik dasar.",
        badgeColor: "text-amber-400",
        badgeBg: "bg-amber-500/10",
        badgeBorder: "border-amber-500/30",
      });
    } else {
      setTrainingZone({
        name: "Zona 1: Recovery / Active Rest",
        description: "Pemulihan aktif, jalan cepat, atau pemanasan fisiologis.",
        badgeColor: "text-sky-400",
        badgeBg: "bg-sky-500/10",
        badgeBorder: "border-sky-500/30",
      });
    }

    // 5. Proyeksi Waktu Tempuh Standar Lomba
    const formatTimeFromMinutes = (minsTotal: number): string => {
      const s = Math.round(minsTotal * 60);
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      if (h > 0) {
        return `${h}j ${m.toString().padStart(2, "0")}m ${sec.toString().padStart(2, "0")}d`;
      }
      return `${m}m ${sec.toString().padStart(2, "0")}d`;
    };

    const raceList: RaceProjection[] = [
      {
        name: "1 KM (Milestone)",
        distanceKm: 1,
        timeFormatted: formatTimeFromMinutes(pDec * 1),
        speed: Number(speed.toFixed(2)),
      },
      {
        name: "5 KM (5K Fun Run)",
        distanceKm: 5,
        timeFormatted: formatTimeFromMinutes(pDec * 5),
        speed: Number(speed.toFixed(2)),
      },
      {
        name: "10 KM (10K Road Race)",
        distanceKm: 10,
        timeFormatted: formatTimeFromMinutes(pDec * 10),
        speed: Number(speed.toFixed(2)),
      },
      {
        name: "21.1 KM (Half Marathon)",
        distanceKm: 21.0975,
        timeFormatted: formatTimeFromMinutes(pDec * 21.0975),
        speed: Number(speed.toFixed(2)),
      },
      {
        name: "42.2 KM (Full Marathon)",
        distanceKm: 42.195,
        timeFormatted: formatTimeFromMinutes(pDec * 42.195),
        speed: Number(speed.toFixed(2)),
      },
    ];

    setProjections(raceList);
  }, [jarak, waktuJam, waktuMenit, waktuDetik]);

  React.useEffect(() => {
    calculatePace();
  }, [calculatePace]);

  const handleReset = () => {
    setJarak(null);
    setWaktuJam(null);
    setWaktuMenit(null);
    setWaktuDetik(null);
  };

  const handlePresetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val) && val > 0) {
      setJarak(val);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Kolom Kiri: Form Input Parameter */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">Parameter Lari & Waktu Tempuh</h2>
                <p className="text-secondary text-sm">Konfigurasi jarak dan durasi waktu lari Anda</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke nilai default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Select
              label="Preset Jarak Standar Industri"
              onChange={handlePresetSelect}
              value={jarak ?? 5}
              helperText="Pilih standar jarak resmi atau input kustom di bawah"
            >
              <option value="1">1 KM (Time Trial / Sprint)</option>
              <option value="3">3 KM (Cooper Test / Uji Fisik)</option>
              <option value="5">5 KM (5K Fun Run / Standar Pemula)</option>
              <option value="10">10 KM (10K Road Race)</option>
              <option value="21.0975">21.1 KM (Half Marathon)</option>
              <option value="42.195">42.2 KM (Full Marathon)</option>
              <option value="1.60934">1 Mil (1.61 KM)</option>
            </Select>

            <Input
              label="Jarak Tempuh (Kilometer)"
              type="number"
              min={0.01}
              step={0.01}
              value={jarak ?? ""}
              onChange={(e) => setJarak(e.target.value === "" ? null : Number(e.target.value))}
              suffix="km"
              helperText={`Total Jarak: ${((jarak ?? 0) * 1000).toLocaleString("id-ID")} Meter`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-secondary">
              Durasi Waktu Tempuh (Jam : Menit : Detik)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Jam"
                type="number"
                min={0}
                max={99}
                step={1}
                value={waktuJam ?? ""}
                onChange={(e) => setWaktuJam(e.target.value === "" ? null : Number(e.target.value))}
                suffix="j"
                placeholder="0"
              />

              <Input
                label="Menit"
                type="number"
                min={0}
                max={59}
                step={1}
                value={waktuMenit ?? ""}
                onChange={(e) => setWaktuMenit(e.target.value === "" ? null : Number(e.target.value))}
                suffix="m"
                placeholder="27"
              />

              <Input
                label="Detik"
                type="number"
                min={0}
                max={59}
                step={1}
                value={waktuDetik ?? ""}
                onChange={(e) => setWaktuDetik(e.target.value === "" ? null : Number(e.target.value))}
                suffix="d"
                placeholder="30"
              />
            </div>
            <p className="text-[12px] text-secondary">
              Total durasi terkonversi: <span className="font-mono text-primary font-medium">{totalMinutes} Menit</span>
            </p>
          </div>

          <div className="pt-2">
            <Button onClick={calculatePace} className="w-full sm:w-auto flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Hitung Pace Presisi
            </Button>
          </div>
        </Card>

        {/* Technical Validation Banner */}
        <Card className="bg-surface/50 border-border/60 text-secondary text-xs leading-relaxed flex items-start gap-3 p-4">
          <Info className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-primary block mb-0.5">Parameter Teknis Terkalibrasi</span>
            Perhitungan mematuhi standar industri atletik internasional (World Athletics). Algoritma menghitung rasio linier waktu terhadap jarak dengan konversi desimal detik presisi tanpa distorsi pembulatan kasar.
          </div>
        </Card>
      </div>

      {/* Kolom Kanan: Output Hasil & Matriks Split */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Hero Pace Display Card */}
        <Card className="flex flex-col gap-4 p-6 bg-gradient-to-br from-surface to-elevated border-accent/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-secondary text-[13px] font-sans flex items-center gap-1.5">
              <Footprints className="w-4 h-4 text-accent" />
              Laju Pace Rata-Rata (Menit / Km)
            </span>
            <span className="text-xs font-mono text-secondary">
              {paceMileMin}:{paceMileSec.toString().padStart(2, "0")} /mil
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-mono text-5xl md:text-6xl font-bold tracking-tight text-primary">
              {paceMin}:{paceSec.toString().padStart(2, "0")}
            </span>
            <span className="text-secondary text-lg font-medium font-sans">/km</span>
          </div>

          <div
            className={cn(
              "flex items-start gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all",
              trainingZone.badgeBg,
              trainingZone.badgeBorder,
              trainingZone.badgeColor
            )}
          >
            <Activity className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold">{trainingZone.name}</span>
              <span className="text-secondary text-[11px] leading-tight">{trainingZone.description}</span>
            </div>
          </div>
        </Card>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <OutputBox
            label="Kecepatan Rata-Rata"
            value={speedKmh}
            decimals={2}
            suffix=" km/jam"
          />

          <OutputBox
            label="Laju Pace Desimal"
            value={paceDecimal}
            decimals={2}
            suffix=" min/km"
          />
        </div>

        {/* Race Projection Card */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-accent" />
              Proyeksi Waktu Tempuh Lomba
            </h3>
            <span className="text-xs text-secondary font-mono">Pace {paceMin}:{paceSec.toString().padStart(2, "0")}</span>
          </div>

          <div className="flex flex-col gap-2.5 text-sm">
            {projections.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-elevated transition-colors border-b border-border/40 last:border-0"
              >
                <div className="flex flex-col">
                  <span className="text-primary font-medium text-xs md:text-sm">{item.name}</span>
                  <span className="text-secondary text-[11px] font-mono">{item.distanceKm} km</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-accent text-sm md:text-base">
                    {item.timeFormatted}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Trust & Synchronization Badge */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <Zap className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            Data parameter tersinkronisasi <span className="text-primary font-medium">real-time</span> ke URL query. Anda dapat menyalin tautan halaman untuk membagikan rencana latihan atau pace lomba secara presisi.
          </p>
        </div>
      </div>
    </div>
  );
}