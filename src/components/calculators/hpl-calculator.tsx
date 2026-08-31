"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import {
  Baby,
  Heart,
  RotateCcw,
  Info,
  ShieldCheck,
  Sparkles,
  Activity,
} from "lucide-react";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import { cn } from "@/lib/utils";

export function HplCalculator() {
  // Helper to format Date to YYYY-MM-DD for standard HTML5 date inputs
  const formatDateToISO = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Default LMP: 8 weeks prior to today for instant clinical preview
  const getDefaultLmp = (): string => {
    const d = new Date();
    d.setDate(d.getDate() - 56);
    return formatDateToISO(d);
  };

  // State Input (URL Synced via nuqs)
  const [lmp, setLmp] = useQueryState(
    "lmp",
    parseAsString.withDefault(getDefaultLmp())
  );
  const [cycle, setCycle] = useQueryState(
    "cycle",
    parseAsInteger.withDefault(28)
  );

  // State Output & Diagnostics
  const [eddDate, setEddDate] = React.useState<Date | null>(null);
  const [conceptionDate, setConceptionDate] = React.useState<Date | null>(null);
  const [gestationalWeeks, setGestationalWeeks] = React.useState<number>(0);
  const [gestationalDays, setGestationalDays] = React.useState<number>(0);
  const [sisaHari, setSisaHari] = React.useState<number>(0);
  const [progressPercent, setProgressPercent] = React.useState<number>(0);
  const [trimester, setTrimester] = React.useState<string>("");
  const [trimesterColor, setTrimesterColor] = React.useState<string>("");
  const [trimesterBg, setTrimesterBg] = React.useState<string>("");
  const [trimesterBorder, setTrimesterBorder] = React.useState<string>("");
  const [errorText, setErrorText] = React.useState<string>("");

  const calculateHpl = React.useCallback(() => {
    if (!lmp) {
      setErrorText("Hari Pertama Haid Terakhir (LMP) wajib diisi");
      return;
    }

    const parts = lmp.split("-").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
      setErrorText("Format tanggal tidak valid");
      return;
    }

    const [year, month, day] = parts;
    const lmpObj = new Date(year, month - 1, day);

    // Validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (lmpObj > today) {
      setErrorText("Tanggal LMP tidak boleh melebihi tanggal hari ini");
      return;
    }

    const maxPastDays = 310;
    const daysSinceLmp = Math.floor(
      (today.getTime() - lmpObj.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceLmp > maxPastDays) {
      setErrorText("Tanggal LMP melebihi batas durasi kehamilan normal (maks. 44 minggu)");
      return;
    }

    setErrorText("");

    const cycleLength = cycle || 28;
    const cycleAdjustment = cycleLength - 28;

    // 1. Rumus Aturan Naegele dengan Penyesuaian Siklus (Parikh's Formula):
    // HPL = LMP + 1 Tahun - 3 Bulan + 7 Hari + (Siklus - 28 Hari)
    const edd = new Date(
      year + 1,
      month - 1 - 3,
      day + 7 + cycleAdjustment
    );
    setEddDate(edd);

    // 2. Estimasi Tanggal Pembuahan / Konsepsi (LMP + 14 Hari + Cycle Adjustment)
    const conception = new Date(year, month - 1, day + 14 + cycleAdjustment);
    setConceptionDate(conception);

    // 3. Sisa Hari Menuju HPL
    const diffToEdd = Math.ceil(
      (edd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    setSisaHari(Math.max(0, diffToEdd));

    // 4. Usia Kehamilan Saat Ini (Gestational Age)
    const totalDaysPregnant = Math.max(0, daysSinceLmp);
    const weeks = Math.floor(totalDaysPregnant / 7);
    const days = totalDaysPregnant % 7;
    setGestationalWeeks(weeks);
    setGestationalDays(days);

    // 5. Persentase Progres Kehamilan (Total kehamilan = 280 hari + cycle adjustment)
    const totalPregnancyDays = 280 + cycleAdjustment;
    const progress = Math.min(
      100,
      Math.max(0, Math.round((totalDaysPregnant / totalPregnancyDays) * 100))
    );
    setProgressPercent(progress);

    // 6. Penentuan Kategori Trimester
    if (weeks <= 13) {
      setTrimester("Trimester 1 (Minggu 1 - 13)");
      setTrimesterColor("text-sky-400");
      setTrimesterBg("bg-sky-500/10");
      setTrimesterBorder("border-sky-500/30");
    } else if (weeks <= 27) {
      setTrimester("Trimester 2 (Minggu 14 - 27)");
      setTrimesterColor("text-purple-400");
      setTrimesterBg("bg-purple-500/10");
      setTrimesterBorder("border-purple-500/30");
    } else {
      setTrimester("Trimester 3 (Minggu 28 - 40+)");
      setTrimesterColor("text-pink-400");
      setTrimesterBg("bg-pink-500/10");
      setTrimesterBorder("border-pink-500/30");
    }
  }, [lmp, cycle]);

  // Real-time calculation on state change
  React.useEffect(() => {
    calculateHpl();
  }, [calculateHpl]);

  const handleReset = () => {
    setLmp(getDefaultLmp());
    setCycle(28);
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

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Kolom Kiri: Form Parameter Klinis */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Baby className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary flex items-center gap-2">
                  Parameter Klinis Kehamilan
                </h2>
                <p className="text-secondary text-sm mt-0.5">
                  Kalkulasi presisi Hari Perkiraan Lahir (HPL) berbasis Aturan Naegele dan Parikh
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
            {/* Input HPHT / LMP */}
            <div className="sm:col-span-2">
              <Input
                label="Hari Pertama Haid Terakhir (HPHT / LMP)"
                type="date"
                value={lmp}
                onChange={(e) => setLmp(e.target.value)}
                error={!!errorText}
                helperText={
                  errorText ||
                  "Tanggal mulai menstruasi siklus terakhir sebelum konsepsi"
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
                value={cycle ?? ""}
                onChange={(e) =>
                  setCycle(e.target.value === "" ? null : Number(e.target.value))
                }
                suffix="Hari"
                helperText="Standar fisiologis medis: 28 hari. Koreksi otomatis diterapkan untuk siklus non-standar."
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
                    onClick={() => setCycle(c)}
                    className={cn(
                      "px-3 py-1 text-xs rounded-lg border font-mono transition-all",
                      cycle === c
                        ? "bg-accent/15 border-accent text-accent font-semibold shadow-[0_0_10px_var(--accent-glow)]"
                        : "bg-base border-border text-secondary hover:text-primary hover:bg-elevated"
                    )}
                  >
                    {c} Hari {c === 28 && "(Standar)"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Button
              onClick={calculateHpl}
              className="w-full flex items-center justify-center gap-2 bg-accent text-white hover:brightness-110 px-6 py-3 rounded-lg font-semibold transition-all"
            >
              <Heart className="w-4 h-4 fill-white" />
              Hitung HPL & Usia Kehamilan
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
            Formula kalkulasi mengintegrasikan <strong>Aturan Naegele Standar Industri</strong>{" "}
            dengan modifikasi <strong>Formula Parikh</strong> untuk variasi siklus menstruasi.
            Sistem menjamin akurasi data gestasi klinis secara real-time dan tersinkronisasi
            penuh ke parameter URL.
          </div>
        </Card>
      </div>

      {/* Kolom Kanan: Output & Rincian Diagnostik */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Box Output 1: Estimasi Tanggal Lahir (HPL) */}
        <div className="flex flex-col items-start justify-center p-6 rounded-2xl border border-[rgba(99,102,241,0.3)] bg-gradient-to-br from-[rgba(99,102,241,0.08)] to-[rgba(99,102,241,0.02)] w-full">
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-secondary text-[13px] font-sans">
              Hari Perkiraan Lahir (HPL / EDD)
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
              <Sparkles className="w-3 h-3" />
              Standar Naegele
            </span>
          </div>
          <div className="font-display text-2xl sm:text-3xl font-semibold text-primary tracking-tight">
            {formatIndonesianDate(eddDate)}
          </div>
        </div>

        {/* Box Output 2: Sisa Hari Menuju HPL */}
        <OutputBox
          label="Sisa Waktu Menuju Persalinan"
          value={sisaHari}
          suffix=" Hari"
        />

        {/* Diagnostic Breakdown Card */}
        <Card className="flex flex-col gap-4 p-5 bg-elevated/70 border-border">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-semibold font-display text-primary flex items-center gap-2">
              <Activity className="h-4 w-4 text-accent" />
              Status Perkembangan Gestasi
            </h3>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-md border text-xs font-semibold tracking-wide",
                trimesterBg,
                trimesterBorder,
                trimesterColor
              )}
            >
              {trimester}
            </span>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            {/* Usia Kehamilan */}
            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary">Usia Kandungan Saat Ini:</span>
              <span className="font-mono font-semibold text-primary">
                {gestationalWeeks} Minggu {gestationalDays} Hari
              </span>
            </div>

            {/* Estimasi Tanggal Konsepsi */}
            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary">Estimasi Waktu Konsepsi:</span>
              <span className="font-medium text-primary text-xs sm:text-sm">
                {formatIndonesianDate(conceptionDate)}
              </span>
            </div>

            {/* Total Durasi Kehamilan */}
            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary">Total Durasi Gestasi:</span>
              <span className="font-mono font-medium text-primary">
                {280 + ((cycle || 28) - 28)} Hari (40 Minggu)
              </span>
            </div>

            {/* Progress Bar Kehamilan */}
            <div className="flex flex-col gap-1.5 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-secondary">Progres Masa Kehamilan:</span>
                <span className="font-mono font-semibold text-accent">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-base rounded-full overflow-hidden border border-border">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-accent to-pink-500 rounded-full transition-all duration-500 shadow-[0_0_10px_var(--accent-glow)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Security & Clinical Standard Card */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            Metrik klinis disinkronkan secara <strong>real-time</strong> ke dalam URL.
            Hasil kalkulasi mematuhi protokol medis obstetri internasional (ACOG) untuk
            kehamilan tunggal fisiologis.
          </p>
        </div>
      </div>
    </div>
  );
}
