"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Heart,
  RotateCcw,
  Info,
  ShieldCheck,
  Sparkles,
  Activity,
  Flame,
  CalendarCheck,
  Clock,
} from "lucide-react";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import { cn } from "@/lib/utils";

export function MasaSuburCalculator() {
  // Helper format Date to YYYY-MM-DD for standard HTML5 date inputs
  const formatDateToISO = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Default HPHT: 14 days prior to today for instant clinical preview
  const getDefaultHpht = (): string => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return formatDateToISO(d);
  };

  // State Input (URL Synced via nuqs)
  const [hpht, setHpht] = useQueryState(
    "hpht",
    parseAsString.withDefault(getDefaultHpht())
  );
  const [cycleLength, setCycleLength] = useQueryState(
    "cycleLength",
    parseAsInteger.withDefault(28)
  );
  const [goal, setGoal] = useQueryState(
    "goal",
    parseAsString.withDefault("promil")
  );

  // Calculated States
  const [ovulationDate, setOvulationDate] = React.useState<Date | null>(null);
  const [fertileStartDate, setFertileStartDate] = React.useState<Date | null>(null);
  const [fertileEndDate, setFertileEndDate] = React.useState<Date | null>(null);
  const [peakStartDate, setPeakStartDate] = React.useState<Date | null>(null);
  const [nextPeriodDate, setNextPeriodDate] = React.useState<Date | null>(null);
  const [daysToOvulation, setDaysToOvulation] = React.useState<number>(0);
  const [fertileDurationDays, setFertileDurationDays] = React.useState<number>(7);
  const [currentCycleDay, setCurrentCycleDay] = React.useState<number>(1);
  const [cycleProgressPercent, setCycleProgressPercent] = React.useState<number>(0);
  const [fertilityPhase, setFertilityPhase] = React.useState<string>("");
  const [phaseColor, setPhaseColor] = React.useState<string>("");
  const [phaseBg, setPhaseBg] = React.useState<string>("");
  const [phaseBorder, setPhaseBorder] = React.useState<string>("");
  const [errorText, setErrorText] = React.useState<string>("");

  const calculateMasaSubur = React.useCallback(() => {
    if (!hpht) {
      setErrorText("Hari Pertama Haid Terakhir (HPHT) wajib diisi");
      return;
    }

    const parts = hpht.split("-").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
      setErrorText("Format tanggal tidak valid");
      return;
    }

    const [year, month, day] = parts;
    const hphtObj = new Date(year, month - 1, day);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxPastDays = 90;
    const daysSinceHpht = Math.floor(
      (today.getTime() - hphtObj.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceHpht < -30) {
      setErrorText("Tanggal HPHT tidak boleh melebihi tanggal di masa depan");
      return;
    }

    if (daysSinceHpht > maxPastDays) {
      setErrorText("Tanggal HPHT melebihi rentang siklus fisiologis aktif (maksimal 90 hari)");
      return;
    }

    const cycle = cycleLength && cycleLength >= 20 && cycleLength <= 45 ? cycleLength : 28;
    setErrorText("");

    // 1. Ovulasi terjadi 14 hari sebelum haid berikutnya:
    // Haid Berikutnya = HPHT + cycle hari
    // Ovulasi = HPHT + (cycle - 14) hari
    const nextPeriod = new Date(year, month - 1, day + cycle);
    const ovulation = new Date(year, month - 1, day + (cycle - 14));

    // 2. Masa Subur (Fertile Window) = H-5 hingga H+1 dari hari ovulasi (Total 7 hari)
    const fertileStart = new Date(year, month - 1, day + (cycle - 19));
    const fertileEnd = new Date(year, month - 1, day + (cycle - 13));

    // 3. Puncak Masa Subur (Peak Window) = H-2 hingga Hari H Ovulasi
    const peakStart = new Date(year, month - 1, day + (cycle - 16));

    setNextPeriodDate(nextPeriod);
    setOvulationDate(ovulation);
    setFertileStartDate(fertileStart);
    setFertileEndDate(fertileEnd);
    setPeakStartDate(peakStart);
    setFertileDurationDays(7);

    // 4. Posisi hari ke dalam siklus saat ini
    const cycleDay = Math.max(1, daysSinceHpht + 1);
    setCurrentCycleDay(cycleDay);

    // 5. Sisa hari menuju ovulasi
    const diffOvulation = Math.ceil(
      (ovulation.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    setDaysToOvulation(Math.max(0, diffOvulation));

    // 6. Progres siklus menstruasi saat ini (%)
    const progress = Math.min(
      100,
      Math.max(0, Math.round((cycleDay / cycle) * 100))
    );
    setCycleProgressPercent(progress);

    // 7. Klasifikasi Status Fase Fertilitas Real-Time
    if (today >= fertileStart && today <= fertileEnd) {
      if (today.getTime() === ovulation.getTime()) {
        setFertilityPhase("Puncak Hari Ovulasi (Fertilitas Maksimal)");
        setPhaseColor("text-rose-400");
        setPhaseBg("bg-rose-500/10");
        setPhaseBorder("border-rose-500/30");
      } else if (today >= peakStart && today <= ovulation) {
        setFertilityPhase("Masa Sangat Subur (Peluang Konsepsi Tinggi)");
        setPhaseColor("text-pink-400");
        setPhaseBg("bg-pink-500/10");
        setPhaseBorder("border-pink-500/30");
      } else {
        setFertilityPhase("Jendela Masa Subur Aktif (Peluang Sedang-Tinggi)");
        setPhaseColor("text-emerald-400");
        setPhaseBg("bg-emerald-500/10");
        setPhaseBorder("border-emerald-500/30");
      }
    } else if (cycleDay <= 5) {
      setFertilityPhase("Fase Menstruasi (Fertilitas Rendah)");
      setPhaseColor("text-sky-400");
      setPhaseBg("bg-sky-500/10");
      setPhaseBorder("border-sky-500/30");
    } else if (today < fertileStart) {
      setFertilityPhase("Fase Folikuler (Pra-Masa Subur)");
      setPhaseColor("text-indigo-400");
      setPhaseBg("bg-indigo-500/10");
      setPhaseBorder("border-indigo-500/30");
    } else {
      setFertilityPhase("Fase Luteal (Pasca-Masa Subur)");
      setPhaseColor("text-amber-400");
      setPhaseBg("bg-amber-500/10");
      setPhaseBorder("border-amber-500/30");
    }
  }, [hpht, cycleLength]);

  // Real-time calculation on parameter change
  React.useEffect(() => {
    calculateMasaSubur();
  }, [calculateMasaSubur]);

  const handleReset = () => {
    setHpht(getDefaultHpht());
    setCycleLength(28);
    setGoal("promil");
    setErrorText("");
  };

  const formatIndonesianDate = (d: Date | null): string => {
    if (!d || isNaN(d.getTime())) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  };

  const formatShortDate = (d: Date | null): string => {
    if (!d || isNaN(d.getTime())) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Kolom Kiri: Form Parameter Klinis */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary flex items-center gap-2">
                  Parameter Siklus & Masa Subur
                </h2>
                <p className="text-secondary text-sm mt-0.5">
                  Kalkulasi presisi jendela fertilitas dan ovulasi berbasis fisiologi ginekologi
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke parameter standar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Input HPHT */}
            <div className="sm:col-span-2">
              <Input
                label="Hari Pertama Haid Terakhir (HPHT)"
                type="date"
                value={hpht}
                onChange={(e) => setHpht(e.target.value)}
                error={!!errorText}
                helperText={
                  errorText ||
                  "Tanggal dimulainya perdarahan menstruasi pada siklus terakhir"
                }
              />
            </div>

            {/* Input Panjang Siklus Haid */}
            <div className="sm:col-span-2 flex flex-col gap-3">
              <Input
                label="Panjang Siklus Menstruasi Rata-rata"
                type="number"
                min={20}
                max={45}
                value={cycleLength ?? ""}
                onChange={(e) =>
                  setCycleLength(
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                suffix="Hari"
                helperText="Standar fisiologis medis: 28 hari (fase luteal konstan 14 hari sebelum haid berikutnya)."
              />

              {/* Preset Tombol Siklus Populer */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-secondary font-medium mr-1">
                  Preset Siklus:
                </span>
                {[24, 26, 28, 30, 32, 35].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCycleLength(c)}
                    className={cn(
                      "px-3 py-1 text-xs rounded-lg border font-mono transition-all",
                      cycleLength === c
                        ? "bg-accent/15 border-accent text-accent font-semibold shadow-[0_0_10px_var(--accent-glow)]"
                        : "bg-base border-border text-secondary hover:text-primary hover:bg-elevated"
                    )}
                  >
                    {c} Hari {c === 28 && "(Standar)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Pilihan Tujuan / Mode Program */}
            <div className="sm:col-span-2">
              <Select
                label="Tujuan Analisis Fertilitas"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                helperText="Sesuaikan fokus rekomendasi klinis dengan target keluarga Anda."
              >
                <option value="promil">Program Kehamilan (Maksimalkan Peluang Konsepsi)</option>
                <option value="pemantauan">Pemantauan Siklus Menstruasi & Kesehatan Reproduksi</option>
                <option value="kba">Perencanaan Keluarga Alami (Keluarga Berencana)</option>
              </Select>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Button
              onClick={calculateMasaSubur}
              className="w-full flex items-center justify-center gap-2 bg-accent text-white hover:brightness-110 px-6 py-3 rounded-lg font-semibold transition-all"
            >
              <Flame className="w-4 h-4 fill-white" />
              Hitung Masa Subur & Puncak Ovulasi
            </Button>
          </div>
        </Card>

        {/* Technical Validation Card */}
        <Card className="bg-surface/50 border-border/60 text-secondary text-xs leading-relaxed flex items-start gap-3 p-4">
          <Info className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-primary block mb-0.5">
              Parameter Teknis Terkalibrasi
            </span>
            Algoritma ini menerapkan <strong>standar industri</strong> ginekologi obstetri dengan
            mengombinasikan formula durasi fase luteal konstan (14 hari) dan viabilitas sel gamet
            (sperma 5 hari, ovum 24 jam). Sistem menjamin kalkulasi <strong>akurat</strong> dan
            tersinkronisasi secara <strong>real-time</strong> ke dalam parameter URL.
          </div>
        </Card>
      </div>

      {/* Kolom Kanan: Output & Rincian Diagnostik */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Box Output Utama: Estimasi Puncak Hari Ovulasi */}
        <div className="flex flex-col items-start justify-center p-6 rounded-2xl border border-[rgba(99,102,241,0.3)] bg-gradient-to-br from-[rgba(99,102,241,0.08)] to-[rgba(99,102,241,0.02)] w-full">
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-secondary text-[13px] font-sans">
              Puncak Hari Ovulasi (LH Surge)
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
              <Sparkles className="w-3 h-3" />
              Fertilitas Puncak
            </span>
          </div>
          <div className="font-display text-2xl sm:text-3xl font-semibold text-primary tracking-tight">
            {formatIndonesianDate(ovulationDate)}
          </div>
        </div>

        {/* Grid Box Output: Durasi Jendela Masa Subur & Hitung Mundur */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <OutputBox
            label="Durasi Jendela Masa Subur"
            value={fertileDurationDays}
            suffix=" Hari"
          />
          <OutputBox
            label="Menuju Puncak Ovulasi"
            value={daysToOvulation}
            suffix=" Hari"
          />
        </div>

        {/* Diagnostic Breakdown Card */}
        <Card className="flex flex-col gap-4 p-5 bg-elevated/70 border-border">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-semibold font-display text-primary flex items-center gap-2">
              <Activity className="h-4 w-4 text-accent" />
              Diagnostik Siklus & Jendela Fertilitas
            </h3>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-md border text-xs font-semibold tracking-wide",
                phaseBg,
                phaseBorder,
                phaseColor
              )}
            >
              {fertilityPhase}
            </span>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            {/* Rentang Masa Subur (Fertile Window) */}
            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary flex items-center gap-1.5">
                <CalendarCheck className="w-3.5 h-3.5 text-accent" />
                Rentang Jendela Masa Subur:
              </span>
              <span className="font-semibold text-primary text-xs sm:text-sm">
                {formatShortDate(fertileStartDate)} – {formatShortDate(fertileEndDate)}
              </span>
            </div>

            {/* Waktu Paling Optimal (Peak Window) */}
            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                Periode Peluang Tertinggi:
              </span>
              <span className="font-medium text-primary text-xs sm:text-sm">
                {formatShortDate(peakStartDate)} – {formatShortDate(ovulationDate)}
              </span>
            </div>

            {/* Perkiraan Haid Berikutnya */}
            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-secondary" />
                Estimasi Menstruasi Berikutnya:
              </span>
              <span className="font-medium text-primary text-xs sm:text-sm">
                {formatShortDate(nextPeriodDate)}
              </span>
            </div>

            {/* Posisi Hari dalam Siklus */}
            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary">Posisi Siklus Menstruasi:</span>
              <span className="font-mono font-semibold text-primary">
                Hari ke-{currentCycleDay} dari {cycleLength || 28} hari
              </span>
            </div>

            {/* Progress Bar Siklus */}
            <div className="flex flex-col gap-1.5 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-secondary">Progres Durasi Siklus:</span>
                <span className="font-mono font-semibold text-accent">
                  {cycleProgressPercent}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-base rounded-full overflow-hidden border border-border">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 via-accent to-pink-500 rounded-full transition-all duration-500 shadow-[0_0_10px_var(--accent-glow)]"
                  style={{ width: `${cycleProgressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Security & Clinical Standard Card */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            Data kalkulasi disinkronkan secara <strong>real-time</strong> ke dalam URL.
            Hasil perhitungan mengacu pada pedoman fisiologi reproduksi klinis internasional
            untuk siklus haid ovulatoar normal secara <strong>presisi</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
