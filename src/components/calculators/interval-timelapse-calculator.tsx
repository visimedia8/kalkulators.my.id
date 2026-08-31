"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Camera,
  Clock,
  Film,
  HardDrive,
  RotateCcw,
  Sparkles,
  Zap,
  Layers,
  Sliders,
  Play,
  CheckCircle2,
  AlertTriangle,
  Info,
  Timer,
  Eye,
  Activity,
  Maximize2,
} from "lucide-react";
import { useQueryState, parseAsFloat, parseAsInteger, parseAsString } from "nuqs";
import { cn } from "@/lib/utils";

interface TimelapseScenarioPreset {
  name: string;
  category: string;
  suggestedIntervalSec: number;
  description: string;
  defaultEventDuration: number;
  defaultUnit: "menit" | "jam" | "hari";
  defaultVideoDuration: number;
  defaultFps: number;
}

const TIMELAPSE_PRESETS: Record<string, TimelapseScenarioPreset> = {
  "fast-clouds": {
    name: "Awan Cepat & Angin Kencang",
    category: "Lanskap Dinamis",
    suggestedIntervalSec: 1.5,
    description: "Pergerakan awan kumulus rendah yang terdorong angin kencang di langit cerah.",
    defaultEventDuration: 30,
    defaultUnit: "menit",
    defaultVideoDuration: 20,
    defaultFps: 30,
  },
  "sunset-sunrise": {
    name: "Matahari Terbit / Terbenam (Sunset/Sunrise)",
    category: "Transisi Golden Hour",
    suggestedIntervalSec: 4,
    description: "Perubahan gradasi warna langit dan intensitas cahaya matahari saat horizon terbit/tenggelam.",
    defaultEventDuration: 90,
    defaultUnit: "menit",
    defaultVideoDuration: 25,
    defaultFps: 30,
  },
  "city-traffic": {
    name: "Lalu Lintas Kota & Garis Lampu (Light Trails)",
    category: "Perkotaan & Malam",
    suggestedIntervalSec: 3,
    description: "Aliran kendaraan dinamis dengan jejak lampu malam (long exposure motion blur).",
    defaultEventDuration: 60,
    defaultUnit: "menit",
    defaultVideoDuration: 20,
    defaultFps: 30,
  },
  "pedestrian-street": {
    name: "Pejalan Kaki & Keramaian Publik",
    category: "Street & Urban",
    suggestedIntervalSec: 2,
    description: "Lalu-lalang kerumunan orang di trotoar jalan raya, stasiun, atau pusat perbelanjaan.",
    defaultEventDuration: 45,
    defaultUnit: "menit",
    defaultVideoDuration: 20,
    defaultFps: 30,
  },
  "milky-way": {
    name: "Bintang & Galaksi Bima Sakti (Milky Way)",
    category: "Astrofotografi",
    suggestedIntervalSec: 25,
    description: "Rotasi bumi terhadap kubah langit malam gelap gulita tanpa polusi cahaya.",
    defaultEventDuration: 5,
    defaultUnit: "jam",
    defaultVideoDuration: 24,
    defaultFps: 24,
  },
  "plant-growth": {
    name: "Pertumbuhan Tanaman & Mekar Bunga",
    category: "Botani & Makro",
    suggestedIntervalSec: 300,
    description: "Mekarnya kelopak bunga atau perkecambahan bibit tanaman dalam interval harian.",
    defaultEventDuration: 2,
    defaultUnit: "hari",
    defaultVideoDuration: 20,
    defaultFps: 30,
  },
  "construction-site": {
    name: "Proyek Konstruksi & Pembangunan Gedung",
    category: "Dokumentasi Arsitektur",
    suggestedIntervalSec: 900,
    description: "Perkembangan proyek struktur fisik skala besar dari fondasi hingga atap.",
    defaultEventDuration: 14,
    defaultUnit: "hari",
    defaultVideoDuration: 40,
    defaultFps: 30,
  },
};

interface MotionEvaluation {
  status: "ideal" | "fast" | "slow" | "critical";
  label: string;
  description: string;
  badgeBg: string;
  badgeBorder: string;
  badgeColor: string;
}

export function IntervalTimelapseCalculator() {
  // State Input terikat langsung ke URL Query Parameters via nuqs
  const [durasiEvent, setDurasiEvent] = useQueryState(
    "durasiEvent",
    parseAsFloat.withDefault(120) // Default: 120 menit (2 Jam)
  );
  const [unitEvent, setUnitEvent] = useQueryState(
    "unitEvent",
    parseAsString.withDefault("menit") // "detik", "menit", "jam", "hari"
  );
  const [fps, setFps] = useQueryState(
    "fps",
    parseAsInteger.withDefault(30) // Default: 30 fps
  );
  const [durasiVideo, setDurasiVideo] = useQueryState(
    "durasiVideo",
    parseAsFloat.withDefault(20) // Default: 20 Detik Video Akhir
  );
  const [photoSizeMb, setPhotoSizeMb] = useQueryState(
    "photoSizeMb",
    parseAsFloat.withDefault(25) // Default: 25 MB per RAW frame
  );

  // State Output Terhitung
  const [totalFrames, setTotalFrames] = React.useState<number>(600);
  const [intervalSec, setIntervalSec] = React.useState<number>(12.0);
  const [intervalMs, setIntervalMs] = React.useState<number>(12000);
  const [eventDurationSec, setEventDurationSec] = React.useState<number>(7200);
  const [speedupFactor, setSpeedupFactor] = React.useState<number>(360);
  const [shotsPerMinute, setShotsPerMinute] = React.useState<number>(5);
  const [totalStorageGb, setTotalStorageGb] = React.useState<number>(14.65);
  const [maxShutterSpeed, setMaxShutterSpeed] = React.useState<string>("10 detik");
  const [motionEval, setMotionEval] = React.useState<MotionEvaluation>({
    status: "ideal",
    label: "Interval Standar Terkalibrasi",
    description: "Laju pemotretan sangat seimbang untuk transisi pergerakan yang mulus dan natural.",
    badgeBg: "bg-emerald-500/10",
    badgeBorder: "border-emerald-500/30",
    badgeColor: "text-emerald-400",
  });

  // Kalkulasi Matematis Parameter Timelapse Presisi
  const calculateTimelapse = React.useCallback(() => {
    const rawDurasi = Math.max(0.1, durasiEvent ?? 120);
    const selectedUnit = unitEvent ?? "menit";
    const selectedFps = Math.max(1, fps ?? 30);
    const targetVideoSec = Math.max(1, durasiVideo ?? 20);
    const sizeMb = Math.max(0.5, photoSizeMb ?? 25);

    // 1. Konversi Durasi Kejadian Nyata ke Detik
    let durasiDetik = rawDurasi;
    if (selectedUnit === "menit") {
      durasiDetik = rawDurasi * 60;
    } else if (selectedUnit === "jam") {
      durasiDetik = rawDurasi * 3600;
    } else if (selectedUnit === "hari") {
      durasiDetik = rawDurasi * 86400;
    }

    // 2. Total Frame = durasiVideo * fps
    const calculatedFrames = Math.round(targetVideoSec * selectedFps);

    // 3. Interval Jepretan (detik) = durasiEvent (detik) / Total Frame
    const calculatedIntervalSec =
      calculatedFrames > 0 ? Number((durasiDetik / calculatedFrames).toFixed(2)) : 1;
    const calculatedIntervalMs = Math.round(calculatedIntervalSec * 1000);

    // 4. Faktor Akselerasi Waktu (Speedup Factor) = Durasi Nyata / Durasi Video
    const calculatedSpeedup =
      targetVideoSec > 0 ? Math.round(durasiDetik / targetVideoSec) : 1;

    // 5. Laju Jepretan (Foto per Menit)
    const ratePerMin =
      calculatedIntervalSec > 0
        ? Number((60 / calculatedIntervalSec).toFixed(1))
        : 0;

    // 6. Estimasi Kebutuhan Memori Penyimpanan (GB)
    const storageGb = Number(((calculatedFrames * sizeMb) / 1024).toFixed(2));

    // 7. Rekomendasi Shutter Speed Maksimal (Buffer Headroom Rule: Shutter Speed < Interval)
    let shutterRec = "Sesuai eksposur";
    if (calculatedIntervalSec <= 1) {
      shutterRec = "1/200 s - 1/50 s (Sangat Cepat)";
    } else if (calculatedIntervalSec <= 2) {
      shutterRec = "Maks. 1.0 detik (Safe Buffer)";
    } else if (calculatedIntervalSec <= 5) {
      shutterRec = `Maks. ${(calculatedIntervalSec - 1).toFixed(1)} detik`;
    } else {
      shutterRec = `Maks. ${(calculatedIntervalSec - 1.5).toFixed(1)} detik`;
    }

    // 8. Evaluasi Kelayakan Gerak & Karakteristik Interval
    let evaluation: MotionEvaluation;
    if (calculatedIntervalSec < 0.5) {
      evaluation = {
        status: "critical",
        label: "Interval Sangat Ekstrem (<0.5s)",
        description:
          "Batas waktu antar jepretan sangat mepet dengan kecepatan tulis kartu memori. Risiko buffer lag kamera tinggi.",
        badgeBg: "bg-rose-500/10",
        badgeBorder: "border-rose-500/30",
        badgeColor: "text-rose-400",
      };
    } else if (calculatedIntervalSec <= 3) {
      evaluation = {
        status: "fast",
        label: "Interval Cepat (Objek Dinamis)",
        description:
          "Sangat ideal untuk menangkap subjek berkecepatan tinggi seperti arus pejalan kaki, awan berkecepatan tinggi, dan lalu lintas.",
        badgeBg: "bg-sky-500/10",
        badgeBorder: "border-sky-500/30",
        badgeColor: "text-sky-400",
      };
    } else if (calculatedIntervalSec <= 15) {
      evaluation = {
        status: "ideal",
        label: "Interval Menengah (Transisi Sunset / Golden Hour)",
        description:
          "Rentang interval paling fleksibel dan populer untuk perubahan cahaya matahari terbenam atau pergerakan awan umum.",
        badgeBg: "bg-emerald-500/10",
        badgeBorder: "border-emerald-500/30",
        badgeColor: "text-emerald-400",
      };
    } else if (calculatedIntervalSec <= 60) {
      evaluation = {
        status: "slow",
        label: "Interval Panjang (Astrofotografi / Milky Way)",
        description:
          "Memberikan jendela eksposur panjang (15s - 25s) yang memadai bagi sensor kamera untuk mengumpulkan foton cahaya malam.",
        badgeBg: "bg-purple-500/10",
        badgeBorder: "border-purple-500/30",
        badgeColor: "text-purple-400",
      };
    } else {
      evaluation = {
        status: "slow",
        label: "Interval Ultra Panjang (Long-Term / Konstruksi)",
        description:
          "Diperlukan sumber daya eksternal (AC power adapter / dummy battery) dan intervalometer terjadwal untuk durasi hari/minggu.",
        badgeBg: "bg-amber-500/10",
        badgeBorder: "border-amber-500/30",
        badgeColor: "text-amber-400",
      };
    }

    setTotalFrames(calculatedFrames);
    setIntervalSec(calculatedIntervalSec);
    setIntervalMs(calculatedIntervalMs);
    setEventDurationSec(durasiDetik);
    setSpeedupFactor(calculatedSpeedup);
    setShotsPerMinute(ratePerMin);
    setTotalStorageGb(storageGb);
    setMaxShutterSpeed(shutterRec);
    setMotionEval(evaluation);
  }, [durasiEvent, unitEvent, fps, durasiVideo, photoSizeMb]);

  React.useEffect(() => {
    calculateTimelapse();
  }, [calculateTimelapse]);

  const handleReset = () => {
    setDurasiEvent(120);
    setUnitEvent("menit");
    setFps(30);
    setDurasiVideo(20);
    setPhotoSizeMb(25);
  };

  const handleApplyPreset = (presetKey: string) => {
    const p = TIMELAPSE_PRESETS[presetKey];
    if (!p) return;
    setDurasiEvent(p.defaultEventDuration);
    setUnitEvent(p.defaultUnit);
    setDurasiVideo(p.defaultVideoDuration);
    setFps(p.defaultFps);
  };

  // Format Helper untuk representasi waktu ramah baca
  const formatHumanTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)} Detik`;
    if (seconds < 3600) {
      const m = Math.floor(seconds / 60);
      const s = Math.round(seconds % 60);
      return s > 0 ? `${m} Menit ${s} Detik` : `${m} Menit`;
    }
    if (seconds < 86400) {
      const h = (seconds / 3600).toFixed(1);
      return `${h} Jam`;
    }
    const d = (seconds / 86400).toFixed(1);
    return `${d} Hari`;
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Kolom Kiri: Form Input Parameter Teknis */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Pemotretan Timelapse
                </h2>
                <p className="text-secondary text-sm">
                  Kalkulasi Interval Jepretan, Total Frame, dan Durasi Video Standar Industri
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke parameter acuan default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Preset Skenario Populer */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-secondary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                Pilih Preset Skenario Fotografi Cepat:
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(TIMELAPSE_PRESETS).map(([key, p]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleApplyPreset(key)}
                  className="text-left text-xs p-2.5 rounded-xl border border-border bg-base hover:border-accent hover:text-accent transition-all duration-150 flex flex-col gap-1 group"
                >
                  <span className="font-semibold text-primary group-hover:text-accent truncate w-full">
                    {p.name}
                  </span>
                  <span className="text-[10px] text-secondary">
                    {p.category} • {p.suggestedIntervalSec}s
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Parameter Form Inputs */}
          <div className="flex flex-col gap-5 pt-2">
            {/* Input 1: Durasi Kejadian Nyata */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-7">
                <Input
                  label="Durasi Kejadian Nyata (Waktu Perekaman Riil)"
                  type="number"
                  step="any"
                  min="0.1"
                  value={durasiEvent ?? 120}
                  onChange={(e) =>
                    setDurasiEvent(
                      e.target.value ? parseFloat(e.target.value) : null
                    )
                  }
                  helperText="Lama waktu kamera berada di lokasi memotret."
                />
              </div>
              <div className="sm:col-span-5">
                <Select
                  label="Satuan Waktu Kejadian"
                  value={unitEvent ?? "menit"}
                  onChange={(e) => setUnitEvent(e.target.value)}
                >
                  <option value="detik">Detik (Seconds)</option>
                  <option value="menit">Menit (Minutes)</option>
                  <option value="jam">Jam (Hours)</option>
                  <option value="hari">Hari (Days)</option>
                </Select>
              </div>
            </div>

            {/* Input 2: Durasi Video Akhir & FPS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Durasi Video Timelapse yang Diinginkan"
                type="number"
                step="any"
                min="1"
                suffix="detik"
                value={durasiVideo ?? 20}
                onChange={(e) =>
                  setDurasiVideo(
                    e.target.value ? parseFloat(e.target.value) : null
                  )
                }
                helperText="Panjang klip video akhir hasil render timeline."
              />

              <Select
                label="Frame Rate Video Akhir (FPS)"
                value={String(fps ?? 30)}
                onChange={(e) => setFps(parseInt(e.target.value, 10))}
                helperText="Standar laju bingkai pemutaran video."
              >
                <option value="24">24 FPS (Sinematik Film Bioskop)</option>
                <option value="25">25 FPS (Standar Siaran TV PAL)</option>
                <option value="30">30 FPS (Standar Web & YouTube)</option>
                <option value="50">50 FPS (PAL High Frame Rate)</option>
                <option value="60">60 FPS (Ultra Smooth Motion)</option>
              </Select>
            </div>

            {/* Input 3: Ukuran File Foto per Frame */}
            <div className="flex flex-col gap-1.5">
              <Select
                label="Format & Estimasi Ukuran File Foto Kamera"
                value={String(photoSizeMb ?? 25)}
                onChange={(e) => setPhotoSizeMb(parseFloat(e.target.value))}
                helperText="Digunakan untuk memproyeksikan kapasitas kartu memori SD/CFexpress."
              >
                <option value="6">JPEG Standard / Resolusi 12MP (~6 MB / Foto)</option>
                <option value="12">JPEG Fine / Resolusi 24MP-33MP (~12 MB / Foto)</option>
                <option value="25">RAW Terkompresi 24MP-33MP (~25 MB / Foto)</option>
                <option value="45">RAW Uncompressed 45MP-50MP (~45 MB / Foto)</option>
                <option value="65">RAW High Resolution 61MP+ (~65 MB / Foto)</option>
              </Select>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="button"
              variant="primary"
              onClick={calculateTimelapse}
              className="w-full flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Kalkulasi Parameter Interval Sekarang
            </Button>
          </div>
        </Card>

        {/* Panduan Cepat Intervalometer Kamera */}
        <Card className="flex flex-col gap-3.5 bg-surface/50">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Info className="w-4 h-4 text-accent" />
            <span>Panduan Pengaturan Intervalometer Kamera Kamera DSLR / Mirrorless:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-secondary">
            <div className="p-3 rounded-xl border border-border bg-base flex flex-col gap-1">
              <span className="font-semibold text-primary">1. Interval Setting:</span>
              <span>
                Set menu intervalometer internal atau remote kabel ke nilai{" "}
                <strong className="text-accent">{intervalSec} detik</strong>.
              </span>
            </div>
            <div className="p-3 rounded-xl border border-border bg-base flex flex-col gap-1">
              <span className="font-semibold text-primary">2. Number of Shots:</span>
              <span>
                Set jumlah bidikan kamera ke minimum{" "}
                <strong className="text-accent">{totalFrames} frame</strong> (atau tak terhingga / ∞).
              </span>
            </div>
            <div className="p-3 rounded-xl border border-border bg-base flex flex-col gap-1">
              <span className="font-semibold text-primary">3. Batas Shutter Speed:</span>
              <span>
                Shutter speed wajib lebih singkat dari {intervalSec} detik (disarankan{" "}
                <strong className="text-primary">{maxShutterSpeed}</strong>) agar buffer tidak penuh.
              </span>
            </div>
            <div className="p-3 rounded-xl border border-border bg-base flex flex-col gap-1">
              <span className="font-semibold text-primary">4. Autofokus & White Balance:</span>
              <span>
                Kunci ke mode <strong>Manual Focus (MF)</strong> dan Manual White Balance (Kelvin) untuk mencegah flicker.
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Kolom Kanan: Hasil Perhitungan & Analisis Presisi */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold font-display text-primary">
                Hasil Kalkulasi Presisi
              </h3>
            </div>
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent">
              Real-time Output
            </span>
          </div>

          {/* Primary Output Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <OutputBox
              label="Interval Jepretan (Shooting Interval)"
              value={intervalSec}
              suffix=" Detik"
              decimals={intervalSec < 10 ? 2 : 1}
              className="bg-gradient-to-br from-accent/15 via-accent/5 to-transparent border-accent/30"
            />
            <OutputBox
              label="Total Frame yang Dibutuhkan"
              value={totalFrames}
              suffix=" Frame"
              decimals={0}
              className="bg-gradient-to-br from-accent/15 via-accent/5 to-transparent border-accent/30"
            />
          </div>

          {/* Secondary Output Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <OutputBox
              label="Faktor Akselerasi Waktu"
              value={speedupFactor}
              suffix="x Lebih Cepat"
              decimals={0}
            />
            <OutputBox
              label="Kebutuhan Memori Penyimpanan"
              value={totalStorageGb}
              suffix=" GB"
              decimals={2}
            />
          </div>

          {/* Evaluasi Status Gerak */}
          <div
            className={cn(
              "p-4 rounded-xl border flex flex-col gap-1.5 transition-all duration-200",
              motionEval.badgeBg,
              motionEval.badgeBorder
            )}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className={cn("w-4 h-4", motionEval.badgeColor)} />
              <span className={cn("text-sm font-semibold", motionEval.badgeColor)}>
                {motionEval.label}
              </span>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              {motionEval.description}
            </p>
          </div>

          {/* Rincian Parameter Teknis Terkalibrasi */}
          <div className="flex flex-col gap-3 border-t border-border pt-4 text-xs">
            <span className="font-semibold text-primary uppercase tracking-wider text-[11px]">
              Parameter Teknis Terkalibrasi:
            </span>

            <div className="flex items-center justify-between py-1.5 border-b border-border/60">
              <span className="text-secondary">Durasi Kejadian Nyata:</span>
              <span className="font-mono font-medium text-primary">
                {formatHumanTime(eventDurationSec)} ({eventDurationSec.toLocaleString("id-ID")} detik)
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-border/60">
              <span className="text-secondary">Durasi Video Akhir:</span>
              <span className="font-mono font-medium text-primary">
                {durasiVideo} Detik @ {fps} FPS
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-border/60">
              <span className="text-secondary">Interval dalam Milidetik:</span>
              <span className="font-mono font-medium text-primary">
                {intervalMs.toLocaleString("id-ID")} ms
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-border/60">
              <span className="text-secondary">Frekuensi Pemotretan:</span>
              <span className="font-mono font-medium text-primary">
                {shotsPerMinute} foto / menit
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-border/60">
              <span className="text-secondary">Rekomendasi Shutter Speed:</span>
              <span className="font-mono font-medium text-accent">
                {maxShutterSpeed}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-secondary">Beban Shutter Kamera:</span>
              <span className="font-mono font-medium text-primary">
                {totalFrames.toLocaleString("id-ID")} siklus aktuasi
              </span>
            </div>
          </div>
        </Card>

        {/* Tabel Standar Interval Fotografi */}
        <Card className="flex flex-col gap-3 text-xs">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Sliders className="w-4 h-4 text-accent" />
            <span>Tabel Rujukan Interval Standar Industri:</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-secondary text-[11px]">
                  <th className="pb-2 font-medium">Subjek / Peristiwa</th>
                  <th className="pb-2 font-medium text-right">Rekomendasi Interval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-secondary">
                <tr>
                  <td className="py-2 text-primary">Lalu Lintas Cepat / Mobil</td>
                  <td className="py-2 text-right font-mono text-accent">1 - 2 detik</td>
                </tr>
                <tr>
                  <td className="py-2 text-primary">Awan Cumulus Cepat</td>
                  <td className="py-2 text-right font-mono text-accent">1 - 3 detik</td>
                </tr>
                <tr>
                  <td className="py-2 text-primary">Sunset / Sunrise</td>
                  <td className="py-2 text-right font-mono text-accent">2 - 5 detik</td>
                </tr>
                <tr>
                  <td className="py-2 text-primary">Pergerakan Bayangan Matahari</td>
                  <td className="py-2 text-right font-mono text-accent">10 - 20 detik</td>
                </tr>
                <tr>
                  <td className="py-2 text-primary">Milky Way / Bintang Bergerak</td>
                  <td className="py-2 text-right font-mono text-accent">20 - 30 detik</td>
                </tr>
                <tr>
                  <td className="py-2 text-primary">Mekarnya Bunga (Plant Bloom)</td>
                  <td className="py-2 text-right font-mono text-accent">2 - 10 menit</td>
                </tr>
                <tr>
                  <td className="py-2 text-primary">Proyek Konstruksi Bangunan</td>
                  <td className="py-2 text-right font-mono text-accent">15 - 60 menit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}