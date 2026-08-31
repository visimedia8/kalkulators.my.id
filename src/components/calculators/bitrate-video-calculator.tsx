"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Video,
  HardDrive,
  Film,
  Camera,
  RotateCcw,
  Calculator,
  Layers,
  Sparkles,
  Info,
  ShieldCheck,
  Zap,
  Sliders,
  Database,
  Clock,
  Disc,
  Server,
  Activity,
} from "lucide-react";
import { useQueryState, parseAsFloat, parseAsInteger, parseAsString } from "nuqs";
import { cn } from "@/lib/utils";

interface VideoCodecPreset {
  id: string;
  name: string;
  bitrate: number; // in Mbps
  resolution: string;
  colorDepth: string;
  description: string;
}

const CODEC_PRESETS: Record<string, VideoCodecPreset> = {
  custom: {
    id: "custom",
    name: "Kustom / Manual Input",
    bitrate: 100,
    resolution: "Sesuai Input",
    colorDepth: "Sesuai Input",
    description: "Tentukan parameter bitrate secara manual sesuai spesifikasi perangkat perekam.",
  },
  "yt-1080p": {
    id: "yt-1080p",
    name: "YouTube / Web Standard 1080p (12 Mbps)",
    bitrate: 12,
    resolution: "1920 x 1080 (FHD 30/60fps)",
    colorDepth: "8-bit 4:2:0 H.264",
    description: "Standar industri streaming web dan konten video YouTube Full HD.",
  },
  "yt-4k": {
    id: "yt-4k",
    name: "YouTube / High Quality 4K (45 Mbps)",
    bitrate: 45,
    resolution: "3840 x 2160 (4K UHD 30fps)",
    colorDepth: "8-bit/10-bit H.264/H.265",
    description: "Rekomendasi resmi pengunggahan video 4K YouTube standar kualitas tinggi.",
  },
  "sony-xavcs-4k": {
    id: "sony-xavcs-4k",
    name: "Sony XAVC S 4K (100 Mbps)",
    bitrate: 100,
    resolution: "3840 x 2160 (4K UHD 24/30fps)",
    colorDepth: "8-bit/10-bit 4:2:0 Long GOP",
    description: "Format populer kamera mirrorless Sony Alpha (A7 III, A7 IV, FX30).",
  },
  "sony-xavcsi-4k": {
    id: "sony-xavcsi-4k",
    name: "Sony XAVC S-I 4K All-Intra (240 Mbps)",
    bitrate: 240,
    resolution: "3840 x 2160 (4K UHD 24/30fps)",
    colorDepth: "10-bit 4:2:2 All-Intra",
    description: "Kompresi Intra-frame kelas produksi profesional Sony FX3 / FX6.",
  },
  "prores-422-lt": {
    id: "prores-422-lt",
    name: "Apple ProRes 422 LT (102 Mbps)",
    bitrate: 102,
    resolution: "3840 x 2160 (4K UHD 24fps)",
    colorDepth: "10-bit 4:2:2 Intra-frame",
    description: "Format ProRes efisien untuk alur kerja broadcast dan editing kilat.",
  },
  "prores-422": {
    id: "prores-422",
    name: "Apple ProRes 422 (147 Mbps)",
    bitrate: 147,
    resolution: "3840 x 2160 (4K UHD 24fps)",
    colorDepth: "10-bit 4:2:2 Intra-frame",
    description: "Standar industri post-production Apple ProRes untuk editing profesional.",
  },
  "prores-422-hq": {
    id: "prores-422-hq",
    name: "Apple ProRes 422 HQ (220 Mbps)",
    bitrate: 220,
    resolution: "3840 x 2160 (4K UHD 24fps)",
    colorDepth: "10-bit 4:2:2 Intra-frame",
    description: "Standar master broadcast dan penayangan komersial visual prima.",
  },
  "braw-4k-51": {
    id: "braw-4k-51",
    name: "Blackmagic RAW 4K 5:1 (320 Mbps)",
    bitrate: 320,
    resolution: "4096 x 2160 (4K DCI 24fps)",
    colorDepth: "12-bit RAW",
    description: "Standar sinematografi kamera Blackmagic Pocket Cinema Camera / URSA.",
  },
  "prores-raw-4k": {
    id: "prores-raw-4k",
    name: "Apple ProRes RAW 4K (440 Mbps)",
    bitrate: 440,
    resolution: "4096 x 2160 (4K DCI 24fps)",
    colorDepth: "12-bit RAW",
    description: "Format RAW terkompresi dengan fleksibilitas color grading tinggi.",
  },
  "canon-craw-4k": {
    id: "canon-craw-4k",
    name: "Canon Cinema RAW Light 4K (1000 Mbps)",
    bitrate: 1000,
    resolution: "4096 x 2160 (4K DCI 24fps)",
    colorDepth: "12-bit RAW",
    description: "Format rekaman RAW internal Canon Cinema EOS C70 / C300 Mark III.",
  },
};

interface StorageTierClassification {
  label: string;
  description: string;
  badgeBg: string;
  badgeBorder: string;
  badgeColor: string;
  mediaRecommendation: string;
}

export function BitrateVideoCalculator() {
  // State Input terhubung ke URL Query Parameters via nuqs
  const [bitrate, setBitrate] = useQueryState(
    "bitrate",
    parseAsFloat.withDefault(100)
  );
  const [durasiMenit, setDurasiMenit] = useQueryState(
    "durasiMenit",
    parseAsFloat.withDefault(60)
  );
  const [jumlahKamera, setJumlahKamera] = useQueryState(
    "jumlahKamera",
    parseAsInteger.withDefault(1)
  );
  const [presetKey, setPresetKey] = useQueryState(
    "preset",
    parseAsString.withDefault("sony-xavcs-4k")
  );

  // State Output Terhitung
  const [totalSizeGB, setTotalSizeGB] = React.useState<number>(45);
  const [totalSizeMB, setTotalSizeMB] = React.useState<number>(45000);
  const [totalSizeTB, setTotalSizeTB] = React.useState<number>(0.045);
  const [sizePerCameraGB, setSizePerCameraGB] = React.useState<number>(45);
  const [writeSpeedMBps, setWriteSpeedMBps] = React.useState<number>(12.5);
  const [totalBandwidthMBps, setTotalBandwidthMBps] = React.useState<number>(12.5);
  const [backupSizeGB, setBackupSizeGB] = React.useState<number>(135);
  const [durationFormatted, setDurationFormatted] = React.useState<string>("1 Jam 0 Menit");

  const [storageClassification, setStorageClassification] = React.useState<StorageTierClassification>({
    label: "Kebutuhan Storage Menengah (SD Card V30 / V60)",
    description: "Kapasitas optimal untuk liputan video komersial, wawancara, dan produksi konten independen.",
    badgeBg: "bg-blue-500/10",
    badgeBorder: "border-blue-500/30",
    badgeColor: "text-blue-400",
    mediaRecommendation: "SDXC UHS-I V30 / UHS-II V60 atau Portable SSD USB 3.2 Gen 2",
  });

  // Komputasi Formula Video Storage Presisi
  // Rumus: Ukuran File (GB) = (Bitrate (Mbps) * Durasi (detik) * Jumlah Kamera) / 8000
  // (1 Byte = 8 bits, 1 GB = 1000 MB)
  const calculateStorage = React.useCallback(() => {
    const br = Math.max(0.1, bitrate ?? 100);
    const durMin = Math.max(0.1, durasiMenit ?? 60);
    const camCount = Math.max(1, jumlahKamera ?? 1);

    const durSec = durMin * 60;

    // 1. Total Ukuran File dalam GB dan MB
    const totalGB = Number(((br * durSec * camCount) / 8000).toFixed(2));
    const totalMB = Number(((br * durSec * camCount) / 8).toFixed(2));
    const totalTB = Number((totalGB / 1000).toFixed(3));

    // 2. Ukuran per Kamera
    const perCamGB = Number((totalGB / camCount).toFixed(2));

    // 3. Kecepatan Tulis Minimum (Write Speed MB/s)
    const writeSpeed = Number((br / 8).toFixed(2));
    const totalThroughput = Number((writeSpeed * camCount).toFixed(2));

    // 4. Cadangan Backup 3-2-1 (Total x 3)
    const backupGB = Number((totalGB * 3).toFixed(2));

    // 5. Format Durasi
    const totalMinutes = Math.floor(durMin);
    const hours = Math.floor(totalMinutes / 60);
    const remainingMins = totalMinutes % 60;
    let formattedTime = "";
    if (hours > 0) {
      formattedTime = `${hours} Jam ${remainingMins > 0 ? `${remainingMins} Menit` : ""}`.trim();
    } else {
      formattedTime = `${totalMinutes} Menit`;
    }

    // 6. Klasifikasi Kebutuhan Media & Hardware
    let classification: StorageTierClassification;
    if (totalGB < 32) {
      classification = {
        label: "Kebutuhan Storage Ringan (SD Card V10 / V30)",
        description: "Alur kerja efisien untuk video podcast singkat, vlogging, dan live streaming online.",
        badgeBg: "bg-emerald-500/10",
        badgeBorder: "border-emerald-500/30",
        badgeColor: "text-emerald-400",
        mediaRecommendation: "SDHC / SDXC UHS-I (Class 10 / V30) atau Flash Drive USB 3.0",
      };
    } else if (totalGB < 150) {
      classification = {
        label: "Kebutuhan Storage Menengah (SD Card V30 / V60)",
        description: "Kapasitas optimal untuk liputan video komersial, wawancara, dan produksi konten independen.",
        badgeBg: "bg-blue-500/10",
        badgeBorder: "border-blue-500/30",
        badgeColor: "text-blue-400",
        mediaRecommendation: "SDXC UHS-I V30 / UHS-II V60 atau Portable SSD USB 3.2 Gen 2",
      };
    } else if (totalGB < 500) {
      classification = {
        label: "Kebutuhan Storage Tinggi (SD Card V90 / Portable NVMe SSD)",
        description: "Perekaman video resolusi tinggi 4K 10-bit All-Intra atau sistem multi-kamera 3+ sudut.",
        badgeBg: "bg-purple-500/10",
        badgeBorder: "border-purple-500/30",
        badgeColor: "text-purple-400",
        mediaRecommendation: "SDXC UHS-II V90 atau Portable NVMe SSD (Kecepatan Tulis >= 1050 MB/s)",
      };
    } else if (totalGB < 2000) {
      classification = {
        label: "Kebutuhan Storage Produksi Berat (CFexpress / Cinema SSD)",
        description: "Produksi film komersial, serial televisi, atau syuting RAW 12-bit durasi panjang.",
        badgeBg: "bg-amber-500/10",
        badgeBorder: "border-amber-500/30",
        badgeColor: "text-amber-400",
        mediaRecommendation: "CFexpress Type A / Type B, Cinema SSD C-Fast 2.0, atau External RAID 0/5 DAS",
      };
    } else {
      classification = {
        label: "Kebutuhan Storage Enterprise & Cinema Multi-Cam (Direct DAS / 10GbE NAS)",
        description: "Skala produksi sinema layar lebar, konser live multi-hari, atau broadcast studio terpusat.",
        badgeBg: "bg-sky-500/10",
        badgeBorder: "border-sky-500/30",
        badgeColor: "text-sky-400",
        mediaRecommendation: "Enterprise NAS 10GbE (RAID 6/Z2) atau Dedicated Thunderbolt 3/4 DAS Storage",
      };
    }

    setTotalSizeGB(totalGB);
    setTotalSizeMB(totalMB);
    setTotalSizeTB(totalTB);
    setSizePerCameraGB(perCamGB);
    setWriteSpeedMBps(writeSpeed);
    setTotalBandwidthMBps(totalThroughput);
    setBackupSizeGB(backupGB);
    setDurationFormatted(formattedTime);
    setStorageClassification(classification);
  }, [bitrate, durasiMenit, jumlahKamera]);

  React.useEffect(() => {
    calculateStorage();
  }, [calculateStorage]);

  const handleReset = () => {
    setBitrate(null);
    setDurasiMenit(null);
    setJumlahKamera(null);
    setPresetKey(null);
  };

  const handlePresetSelect = (key: string) => {
    setPresetKey(key);
    const selected = CODEC_PRESETS[key];
    if (selected && key !== "custom") {
      setBitrate(selected.bitrate);
    }
  };

  const handleDurationPreset = (minutes: number) => {
    setDurasiMenit(minutes);
  };

  const handleCameraPreset = (count: number) => {
    setJumlahKamera(count);
  };

  const activePreset = CODEC_PRESETS[presetKey ?? "sony-xavcs-4k"] || CODEC_PRESETS["custom"];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Kolom Kiri: Form Parameter Input */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Bitrate & Durasi Rekaman
                </h2>
                <p className="text-secondary text-sm">
                  Kalkulasi Kebutuhan Storage Video dan Bandwidth Tulis Presisi
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke parameter default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Preset Codec & Profil Perekaman Populer */}
          <div className="flex flex-col gap-2">
            <Select
              label="Pilih Preset Codec & Standar Industri Video"
              value={presetKey || "sony-xavcs-4k"}
              onChange={(e) => handlePresetSelect(e.target.value)}
              helperText={`Resolusi: ${activePreset.resolution} | Format: ${activePreset.colorDepth} — ${activePreset.description}`}
            >
              {Object.entries(CODEC_PRESETS).map(([key, preset]) => (
                <option key={key} value={key}>
                  {preset.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Input Bitrate Video (Mbps) */}
            <div className="sm:col-span-2">
              <Input
                label="Bitrate Video (Megabits per second)"
                type="number"
                min={0.1}
                max={10000}
                step={1}
                value={bitrate ?? ""}
                onChange={(e) => {
                  setBitrate(e.target.value === "" ? null : Number(e.target.value));
                  if (presetKey !== "custom") {
                    setPresetKey("custom");
                  }
                }}
                suffix="Mbps"
                helperText={`Data Rate: ${((bitrate ?? 0) / 8).toFixed(2)} MB/s per kamera (1 Byte = 8 bits)`}
              />
            </div>

            {/* Input Durasi Rekaman (Menit) */}
            <div>
              <Input
                label="Durasi Perekaman (Menit)"
                type="number"
                min={1}
                max={100000}
                step={1}
                value={durasiMenit ?? ""}
                onChange={(e) =>
                  setDurasiMenit(e.target.value === "" ? null : Number(e.target.value))
                }
                suffix="menit"
                helperText={`Ekuivalen: ${durationFormatted} (${((durasiMenit ?? 0) * 60).toLocaleString("id-ID")} detik)`}
              />
            </div>

            {/* Input Jumlah Kamera */}
            <div>
              <Input
                label="Jumlah Kamera (Multi-Camera Stream)"
                type="number"
                min={1}
                max={64}
                step={1}
                value={jumlahKamera ?? ""}
                onChange={(e) =>
                  setJumlahKamera(e.target.value === "" ? null : Number(e.target.value))
                }
                suffix="unit"
                helperText="Jumlah sudut pengambilan gambar / aliran video simultan"
              />
            </div>
          </div>

          {/* Quick Preset Buttons untuk Durasi */}
          <div className="flex flex-col gap-2 pt-1 border-t border-border/40">
            <span className="text-[12px] font-medium text-secondary">
              Pilihan Cepat Durasi Syuting:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleDurationPreset(15)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-lg border transition-colors",
                  durasiMenit === 15
                    ? "border-accent bg-accent/10 text-accent font-medium"
                    : "border-border bg-base hover:border-accent text-secondary hover:text-primary"
                )}
              >
                15 Menit
              </button>
              <button
                type="button"
                onClick={() => handleDurationPreset(30)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-lg border transition-colors",
                  durasiMenit === 30
                    ? "border-accent bg-accent/10 text-accent font-medium"
                    : "border-border bg-base hover:border-accent text-secondary hover:text-primary"
                )}
              >
                30 Menit
              </button>
              <button
                type="button"
                onClick={() => handleDurationPreset(60)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-lg border transition-colors",
                  durasiMenit === 60
                    ? "border-accent bg-accent/10 text-accent font-medium"
                    : "border-border bg-base hover:border-accent text-secondary hover:text-primary"
                )}
              >
                1 Jam (60m)
              </button>
              <button
                type="button"
                onClick={() => handleDurationPreset(120)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-lg border transition-colors",
                  durasiMenit === 120
                    ? "border-accent bg-accent/10 text-accent font-medium"
                    : "border-border bg-base hover:border-accent text-secondary hover:text-primary"
                )}
              >
                2 Jam (120m)
              </button>
              <button
                type="button"
                onClick={() => handleDurationPreset(240)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-lg border transition-colors",
                  durasiMenit === 240
                    ? "border-accent bg-accent/10 text-accent font-medium"
                    : "border-border bg-base hover:border-accent text-secondary hover:text-primary"
                )}
              >
                Setengah Hari (4 Jam)
              </button>
              <button
                type="button"
                onClick={() => handleDurationPreset(480)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-lg border transition-colors",
                  durasiMenit === 480
                    ? "border-accent bg-accent/10 text-accent font-medium"
                    : "border-border bg-base hover:border-accent text-secondary hover:text-primary"
                )}
              >
                Seharian Penuh (8 Jam)
              </button>
            </div>
          </div>

          {/* Quick Preset Buttons untuk Setup Kamera */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-medium text-secondary">
              Konfigurasi Multi-Kamera:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleCameraPreset(1)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-lg border transition-colors",
                  jumlahKamera === 1
                    ? "border-accent bg-accent/10 text-accent font-medium"
                    : "border-border bg-base hover:border-accent text-secondary hover:text-primary"
                )}
              >
                1 Kamera (Single Cam)
              </button>
              <button
                type="button"
                onClick={() => handleCameraPreset(2)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-lg border transition-colors",
                  jumlahKamera === 2
                    ? "border-accent bg-accent/10 text-accent font-medium"
                    : "border-border bg-base hover:border-accent text-secondary hover:text-primary"
                )}
              >
                2 Kamera (A-Cam + B-Cam)
              </button>
              <button
                type="button"
                onClick={() => handleCameraPreset(3)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-lg border transition-colors",
                  jumlahKamera === 3
                    ? "border-accent bg-accent/10 text-accent font-medium"
                    : "border-border bg-base hover:border-accent text-secondary hover:text-primary"
                )}
              >
                3 Kamera (Podcast Setup)
              </button>
              <button
                type="button"
                onClick={() => handleCameraPreset(4)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-lg border transition-colors",
                  jumlahKamera === 4
                    ? "border-accent bg-accent/10 text-accent font-medium"
                    : "border-border bg-base hover:border-accent text-secondary hover:text-primary"
                )}
              >
                4 Kamera (Live Event / Konser)
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={calculateStorage} className="w-full sm:w-auto flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Hitung Kebutuhan Storage Presisi
            </Button>
          </div>
        </Card>

        {/* Technical Validation Banner */}
        <Card className="bg-surface/50 border-border/60 text-secondary text-xs leading-relaxed flex items-start gap-3 p-4">
          <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-primary block mb-0.5">
              Parameter Teknis Terkalibrasi Standar Industri Broadcast
            </span>
            Kalkulasi kebutuhan kapasitas storage menggunakan formula biner-desimal standar industri perfileman (1 Byte = 8 bits, 1 GB = 1000 MB). Perhitungan mencakup kecepatan transfer data minimum yang diperlukan media penyimpanan untuk mencegah frame drop selama perekaman berlangsung.
          </div>
        </Card>
      </div>

      {/* Kolom Kanan: Output Hasil & Matriks Storage */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Hero Storage Card */}
        <Card className="flex flex-col gap-4 p-6 bg-gradient-to-br from-surface to-elevated border-accent/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-secondary text-[13px] font-sans flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-accent" />
              Total Kapasitas Penyimpanan
            </span>
            <span className="text-xs font-mono text-secondary">
              {bitrate} Mbps • {jumlahKamera} Cam
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            {totalSizeGB >= 1000 ? (
              <>
                <span className="font-mono text-5xl md:text-6xl font-bold tracking-tight text-primary">
                  {totalSizeTB.toFixed(2)}
                </span>
                <span className="text-secondary text-lg font-medium font-sans">
                  Terabyte (TB)
                </span>
              </>
            ) : (
              <>
                <span className="font-mono text-5xl md:text-6xl font-bold tracking-tight text-primary">
                  {totalSizeGB.toFixed(1)}
                </span>
                <span className="text-secondary text-lg font-medium font-sans">
                  Gigabyte (GB)
                </span>
              </>
            )}
          </div>

          <div className="text-xs font-mono text-secondary">
            Ekuivalen: {totalSizeMB.toLocaleString("id-ID")} MB ({totalSizeGB.toLocaleString("id-ID")} GB)
          </div>

          {/* Classification Badge */}
          <div
            className={cn(
              "flex items-start gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all",
              storageClassification.badgeBg,
              storageClassification.badgeBorder,
              storageClassification.badgeColor
            )}
          >
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold">{storageClassification.label}</span>
              <span className="text-secondary text-[11px] leading-tight">
                {storageClassification.description}
              </span>
            </div>
          </div>

          {/* Media Hardware Suggestion Bar */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-border/40">
            <span className="text-[11px] font-medium text-secondary flex items-center gap-1">
              <Disc className="w-3.5 h-3.5 text-accent" />
              Rekomendasi Media Perekaman Minimum:
            </span>
            <span className="text-xs font-semibold text-primary font-mono bg-base/80 p-2 rounded-lg border border-border">
              {storageClassification.mediaRecommendation}
            </span>
          </div>
        </Card>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <OutputBox
            label="Ukuran File per Kamera"
            value={sizePerCameraGB}
            decimals={2}
            suffix=" GB"
          />

          <OutputBox
            label="Kecepatan Tulis Minimum"
            value={writeSpeedMBps}
            decimals={2}
            suffix=" MB/s"
          />
        </div>

        {/* Detailed Storage Matrix Breakdown */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-accent" />
              Rincian Matriks Teknis Video Storage
            </h3>
            <span className="text-xs text-secondary font-mono">
              Standar 8-bit/Byte
            </span>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-accent" />
                Total Durasi Rekaman:
              </span>
              <span className="font-mono text-primary font-medium">{durationFormatted}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-accent" />
                Bitrate per Kamera:
              </span>
              <span className="font-mono text-primary font-medium">{bitrate} Mbps</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                Total Kamera Aktif:
              </span>
              <span className="font-mono text-emerald-400 font-medium">
                {jumlahKamera} Kamera Stream
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-blue-400" />
                Total Throughput Multi-Cam:
              </span>
              <span className="font-mono text-blue-400 font-medium">
                {totalBandwidthMBps} MB/s
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-purple-400" />
                Alokasi Backup 3-2-1 (Total x 3):
              </span>
              <span className="font-mono text-purple-400 font-medium">
                {backupSizeGB >= 1000 ? `${(backupSizeGB / 1000).toFixed(2)} TB` : `${backupSizeGB} GB`}
              </span>
            </div>

            <div className="pt-2 flex justify-between items-center font-semibold">
              <span className="text-primary flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent" />
                Total Kebutuhan Storage Terkalibrasi:
              </span>
              <span className="font-mono text-accent text-base">
                {totalSizeGB >= 1000 ? `${totalSizeTB.toFixed(2)} TB` : `${totalSizeGB} GB`}
              </span>
            </div>
          </div>
        </Card>

        {/* Real-time URL Synchronization Notification */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <Zap className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            Parameter teknis video tersinkronisasi <span className="text-primary font-medium">real-time</span> ke URL query parameters. Anda dapat menyalin tautan browser untuk membagikan konfigurasi alokasi media penyimpanan dan bandwidth kepada tim DIT (Digital Imaging Technician) atau videografer secara presisi.
          </p>
        </div>
      </div>
    </div>
  );
}