"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Volume2,
  RotateCcw,
  Calculator,
  Zap,
  ShieldCheck,
  Activity,
  Sliders,
  Radio,
  Info,
  Layers,
  Gauge,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useQueryState, parseAsFloat } from "nuqs";

interface ImpedanceMatrixRow {
  impedance: number;
  label: string;
  rmsPower: number;
  voltageRms: number;
  currentRms: number;
}

interface AudioPreset {
  name: string;
  power: number;
  impedance: number;
  headroom: number;
  desc: string;
}

export function DayaAmplifierCalculator() {
  // State Input via nuqs (URL Query State tersinkronisasi real-time)
  const [dayaSpeaker, setDayaSpeaker] = useQueryState(
    "dayaSpeaker",
    parseAsFloat.withDefault(300)
  );
  const [impedansiSpeaker, setImpedansiSpeaker] = useQueryState(
    "impedansiSpeaker",
    parseAsFloat.withDefault(8)
  );
  const [targetHeadroom, setTargetHeadroom] = useQueryState(
    "targetHeadroom",
    parseAsFloat.withDefault(50)
  );

  // Output States
  const [ampRmsPower, setAmpRmsPower] = React.useState<number>(450);
  const [headroomDb, setHeadroomDb] = React.useState<number>(1.76);
  const [multiplier, setMultiplier] = React.useState<number>(1.5);
  const [voltageRms, setVoltageRms] = React.useState<number>(60);
  const [voltagePeak, setVoltagePeak] = React.useState<number>(84.85);
  const [currentRms, setCurrentRms] = React.useState<number>(7.5);
  const [minAmpPower, setMinAmpPower] = React.useState<number>(300);
  const [optimalAmpPower, setOptimalAmpPower] = React.useState<number>(600);
  const [programPower, setProgramPower] = React.useState<number>(600);
  const [peakPower, setPeakPower] = React.useState<number>(1200);

  const [matrix, setMatrix] = React.useState<ImpedanceMatrixRow[]>([]);

  const calculateAmplifierMatching = React.useCallback(() => {
    const pSpeaker = Math.max(1, dayaSpeaker ?? 300);
    const zSpeaker = Math.max(1, impedansiSpeaker ?? 8);
    const hPercent = Math.max(0, targetHeadroom ?? 50);

    // 1. Rumus Utama: Rekomendasi Daya Amplifier (RMS)
    // P_amp = P_speaker + (P_speaker * Headroom / 100)
    const mult = 1 + hPercent / 100;
    const pAmp = pSpeaker + (pSpeaker * hPercent) / 100;

    // 2. Perhitungan Headroom dalam Decibel (dB)
    // Headroom (dB) = 10 * log10(P_amp / P_speaker) = 10 * log10(1 + Headroom/100)
    const hDb = 10 * Math.log10(Math.max(1, mult));

    // 3. Perhitungan Parameter Elektrikal (Hukum Ohm Audio)
    // V_rms = sqrt(P * R)
    // V_peak = V_rms * sqrt(2)
    // I_rms = sqrt(P / R)
    const vRms = Math.sqrt(pAmp * zSpeaker);
    const vPeak = vRms * Math.SQRT2;
    const iRms = Math.sqrt(pAmp / zSpeaker);

    // 4. Standar Rating Daya Speaker (AES / IEC Standard)
    const pProg = pSpeaker * 2;
    const pPk = pSpeaker * 4;
    const minP = pSpeaker * 1.0;
    const optP = pSpeaker * 2.0;

    setAmpRmsPower(Number(pAmp.toFixed(1)));
    setMultiplier(Number(mult.toFixed(2)));
    setHeadroomDb(Number(hDb.toFixed(2)));
    setVoltageRms(Number(vRms.toFixed(2)));
    setVoltagePeak(Number(vPeak.toFixed(2)));
    setCurrentRms(Number(iRms.toFixed(2)));
    setMinAmpPower(Number(minP.toFixed(1)));
    setOptimalAmpPower(Number(optP.toFixed(1)));
    setProgramPower(Number(pProg.toFixed(1)));
    setPeakPower(Number(pPk.toFixed(1)));

    // 5. Matriks Beban Impedansi Standar Industri (2Ω, 4Ω, 8Ω, 16Ω)
    const impedanceLoads = [
      { impedance: 2, label: "2 Ohm (Parallel Quad / Low-Z Load)" },
      { impedance: 4, label: "4 Ohm (Dual Speaker Parallel / Subwoofer)" },
      { impedance: 8, label: "8 Ohm (Standar Single Speaker PA/Hi-Fi)" },
      { impedance: 16, label: "16 Ohm (Series Cab / High-Z Driver)" },
    ];

    const matrixData: ImpedanceMatrixRow[] = impedanceLoads.map((item) => {
      // Menghitung daya ekuivalen pada tegangan output konstan
      // Pada tegangan output amplifier yang sama, P = V^2 / R
      const loadPower = (vRms * vRms) / item.impedance;
      const loadVolt = Math.sqrt(loadPower * item.impedance);
      const loadCurrent = Math.sqrt(loadPower / item.impedance);

      return {
        impedance: item.impedance,
        label: item.label,
        rmsPower: Number(loadPower.toFixed(1)),
        voltageRms: Number(loadVolt.toFixed(2)),
        currentRms: Number(loadCurrent.toFixed(2)),
      };
    });

    setMatrix(matrixData);
  }, [dayaSpeaker, impedansiSpeaker, targetHeadroom]);

  React.useEffect(() => {
    calculateAmplifierMatching();
  }, [calculateAmplifierMatching]);

  const handleReset = () => {
    setDayaSpeaker(300);
    setImpedansiSpeaker(8);
    setTargetHeadroom(50);
  };

  const handlePresetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "studio") {
      setDayaSpeaker(100);
      setImpedansiSpeaker(8);
      setTargetHeadroom(30);
    } else if (val === "live-mid") {
      setDayaSpeaker(300);
      setImpedansiSpeaker(8);
      setTargetHeadroom(50);
    } else if (val === "subwoofer") {
      setDayaSpeaker(600);
      setImpedansiSpeaker(4);
      setTargetHeadroom(100);
    } else if (val === "large-pa") {
      setDayaSpeaker(1000);
      setImpedansiSpeaker(4);
      setTargetHeadroom(60);
    } else if (val === "stage-monitor") {
      setDayaSpeaker(250);
      setImpedansiSpeaker(8);
      setTargetHeadroom(50);
    }
  };

  const getMatchingStatus = () => {
    const ratio = multiplier;
    if (ratio < 1.2) {
      return {
        badge: "Headroom Rendah (Rawan Clipping)",
        color: "text-amber-400 bg-amber-400/10 border-amber-400/30",
        icon: AlertTriangle,
        desc: "Daya amplifier terlalu dekat dengan RMS speaker. Sinyal transien dinamis berisiko mengalami clipping yang memicu distorsi harmonik berbahaya pada voice coil.",
      };
    }
    if (ratio <= 2.1) {
      return {
        badge: "Sweet Spot Standar Industri (Optimal & Aman)",
        color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
        icon: CheckCircle2,
        desc: "Rasio 1.5x hingga 2.0x (Headroom 50%–100%) memberikan dinamika suara bersih, bebas distorsi, dan menjaga umur pakai komponen transduser audio.",
      };
    }
    return {
      badge: "High Headroom (Wajib Dilengkapi Limiter)",
      color: "text-accent bg-accent/10 border-accent/30",
      icon: ShieldCheck,
      desc: "Daya amplifier melebihi 2x RMS speaker. Pastikan DSP / Speaker Management Processor memiliki brickwall limiter aktif untuk mencegah kerusakan termal dan mekanikal.",
    };
  };

  const status = getMatchingStatus();
  const StatusIcon = status.icon;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Kolom Kiri: Form Input Parameter Speaker & Amplifier Matching */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Speaker & Target Headroom
                </h2>
                <p className="text-secondary text-sm">
                  Konfigurasi spesifikasi teknis transduser untuk pencocokan daya (*speaker matching*)
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <Select
                label="Preset Sistem Suara Standar Industri"
                onChange={handlePresetSelect}
                defaultValue="live-mid"
                helperText="Pilih skenario instalasi audio untuk konfigurasi otomatis"
              >
                <option value="studio">Studio Monitor Hi-Fi (100W RMS @ 8Ω, +30% Headroom)</option>
                <option value="live-mid">Live PA Mid-High Vocal (300W RMS @ 8Ω, +50% Headroom - Standar 1.5x)</option>
                <option value="stage-monitor">Floor Wedge Stage Monitor (250W RMS @ 8Ω, +50% Headroom)</option>
                <option value="subwoofer">Subwoofer Panggung Konser (600W RMS @ 4Ω, +100% Headroom - 2.0x Peak)</option>
                <option value="large-pa">Line Array Touring Rig (1000W RMS @ 4Ω, +60% Headroom)</option>
              </Select>
            </div>

            <Input
              label="Daya Nominal Speaker (Continuous / RMS)"
              type="number"
              min={1}
              max={10000}
              step={5}
              value={dayaSpeaker ?? ""}
              onChange={(e) =>
                setDayaSpeaker(e.target.value === "" ? null : Number(e.target.value))
              }
              suffix="Watt RMS"
              helperText={`Program: ${programPower} W | Peak: ${peakPower} W (AES Standard)`}
            />

            <Select
              label="Impedansi Nominal Speaker (Z)"
              value={impedansiSpeaker ?? 8}
              onChange={(e) => setImpedansiSpeaker(Number(e.target.value))}
              helperText="Beban resistansi AC nominal pada terminal speaker"
            >
              <option value="2">2 Ohm (Parallel Sub / Low-Z)</option>
              <option value="4">4 Ohm (Beban Ganda Paralel / Car Audio)</option>
              <option value="8">8 Ohm (Standar Pro Audio & Hi-Fi)</option>
              <option value="16">16 Ohm (Koneksi Seri / Compression Driver)</option>
            </Select>

            <div className="sm:col-span-2">
              <Input
                label="Target Headroom Dinamis (%)"
                type="number"
                min={0}
                max={300}
                step={5}
                value={targetHeadroom ?? ""}
                onChange={(e) =>
                  setTargetHeadroom(e.target.value === "" ? null : Number(e.target.value))
                }
                suffix="%"
                helperText={`Faktor Pengali: ${multiplier}x (${headroomDb} dB headroom di atas RMS)`}
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={calculateAmplifierMatching}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Kalkulasi Rekomendasi Daya Amplifier Presisi
            </Button>
          </div>
        </Card>

        {/* Tabel Matriks Beban Impedansi Multi-Channel */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase">
                Matriks Daya Amplifier pada Variasi Beban Impedansi
              </h3>
            </div>
            <span className="text-xs font-mono text-secondary">
              Tegangan Output: {voltageRms} V RMS
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-secondary font-medium">
                  <th className="py-2.5 px-3">Beban Impedansi</th>
                  <th className="py-2.5 px-3 text-right">Daya Amp (RMS)</th>
                  <th className="py-2.5 px-3 text-right">Tegangan (V RMS)</th>
                  <th className="py-2.5 px-3 text-right">Arus Beban (I RMS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono">
                {matrix.map((row) => {
                  const isSelected = row.impedance === impedansiSpeaker;
                  return (
                    <tr
                      key={row.impedance}
                      className={
                        isSelected
                          ? "bg-accent/10 hover:bg-accent/15 transition-colors"
                          : "hover:bg-elevated transition-colors"
                      }
                    >
                      <td className="py-2.5 px-3 font-sans text-primary font-medium flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded font-mono text-[11px] ${
                            isSelected
                              ? "bg-accent text-white font-bold"
                              : "bg-base text-secondary border border-border"
                          }`}
                        >
                          {row.impedance} Ω
                        </span>
                        <span className="hidden sm:inline text-secondary text-[11px]">
                          {row.label}
                        </span>
                      </td>
                      <td
                        className={`py-2.5 px-3 text-right font-semibold ${
                          isSelected ? "text-accent text-sm" : "text-primary"
                        }`}
                      >
                        {row.rmsPower.toLocaleString("id-ID")} Watt
                      </td>
                      <td className="py-2.5 px-3 text-right text-secondary">
                        {row.voltageRms.toLocaleString("id-ID")} V
                      </td>
                      <td className="py-2.5 px-3 text-right text-secondary">
                        {row.currentRms.toLocaleString("id-ID")} A
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Technical Validation Banner */}
        <Card className="bg-surface/50 border-border/60 text-secondary text-xs leading-relaxed flex items-start gap-3 p-4">
          <Info className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-primary block mb-0.5">
              Parameter Teknis Terkalibrasi Standar Industri
            </span>
            Kalkulasi daya amplifier menerapkan standar internasional AES2-1984 (r2003) dan IEC 60268-5.
            Rekomendasi daya continuous amplifier dirancang pada rasio 1.5x hingga 2.0x dari daya nominal
            transduser guna mengakomodasi faktor puncak sinyal audio (*crest factor*) 6 dB hingga 12 dB
            tanpa memicu *hard-clipping* pada rangkaian daya power amplifier.
          </div>
        </Card>
      </div>

      {/* Kolom Kanan: Output Utama & Evaluasi Matching */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Hero Output Card */}
        <OutputBox
          label={`Rekomendasi Daya Amplifier (${impedansiSpeaker} Ohm)`}
          value={ampRmsPower}
          decimals={1}
          suffix=" Watt RMS"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <OutputBox
            label="Headroom Dinamis Terkalibrasi"
            value={headroomDb}
            decimals={2}
            prefix="+"
            suffix=" dB"
          />

          <OutputBox
            label="Tegangan Output Maksimum"
            value={voltageRms}
            decimals={1}
            suffix=" V RMS"
          />
        </div>

        {/* Evaluasi Kompatibilitas Matching */}
        <Card className="flex flex-col gap-3 p-5 bg-gradient-to-br from-surface to-elevated border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans text-secondary flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-accent" />
              Evaluasi Status Headroom
            </span>
            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1 ${status.color}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              {status.badge}
            </span>
          </div>

          <p className="text-secondary text-xs leading-relaxed border-t border-border/60 pt-2.5">
            {status.desc}
          </p>
        </Card>

        {/* Spesifikasi Elektrikal & Rentang Rekomendasi */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-accent" />
              Rentang Rating Daya & Elektrikal
            </h3>
            <span className="text-xs text-secondary font-mono">AES Standard</span>
          </div>

          <div className="flex flex-col gap-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-base">
              <span className="text-secondary">Daya Minimum (Continuous 1.0x)</span>
              <span className="font-mono font-semibold text-primary">
                {minAmpPower.toLocaleString("id-ID")} W @ {impedansiSpeaker}Ω
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl border border-accent/40 bg-accent/5">
              <span className="text-accent font-medium">Target Rekomendasi ({multiplier}x)</span>
              <span className="font-mono font-bold text-accent">
                {ampRmsPower.toLocaleString("id-ID")} W @ {impedansiSpeaker}Ω
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-base">
              <span className="text-secondary">Optimal High-Headroom (2.0x Peak)</span>
              <span className="font-mono font-semibold text-emerald-400">
                {optimalAmpPower.toLocaleString("id-ID")} W @ {impedansiSpeaker}Ω
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2 rounded-lg bg-base border border-border/80 flex flex-col gap-0.5">
                <span className="text-secondary font-sans text-[10px]">Tegangan Puncak (V Peak)</span>
                <span className="font-semibold text-primary">{voltagePeak} Volt</span>
              </div>
              <div className="p-2 rounded-lg bg-base border border-border/80 flex flex-col gap-0.5">
                <span className="text-secondary font-sans text-[10px]">Kebutuhan Arus Beban</span>
                <span className="font-semibold text-primary">{currentRms} Ampere</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Real-time URL Synchronization Badge */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <Zap className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            Konfigurasi sistem tersinkronisasi <span className="text-primary font-medium">real-time</span> ke URL query parameters. Tautan dapat disalin langsung untuk membagikan spesifikasi pencocokan daya amplifier kepada tim teknis tata suara atau vendor rental sound system secara presisi.
          </p>
        </div>
      </div>
    </div>
  );
}