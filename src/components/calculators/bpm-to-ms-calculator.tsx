"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Music,
  RotateCcw,
  Calculator,
  Sliders,
  Volume2,
  Clock,
  Sparkles,
  Radio,
  Zap,
  Info,
  Layers,
  Disc,
} from "lucide-react";
import { useQueryState, parseAsFloat } from "nuqs";
import { cn } from "@/lib/utils";

interface NoteDivisionRow {
  name: string;
  fraction: string;
  normalMs: number;
  dottedMs: number;
  tripletMs: number;
  hz: number;
}

interface ReverbPresetGuide {
  space: string;
  preDelayMs: number;
  decayTimeMs: number;
  description: string;
}

export function BpmToMsCalculator() {
  // State Input via nuqs (URL Query State terintegrasi real-time)
  const [bpm, setBpm] = useQueryState("bpm", parseAsFloat.withDefault(120));

  // Output States
  const [quarterMs, setQuarterMs] = React.useState<number>(500);
  const [eighthMs, setEighthMs] = React.useState<number>(250);
  const [sixteenthMs, setSixteenthMs] = React.useState<number>(125);
  const [dottedEighthMs, setDottedEighthMs] = React.useState<number>(375);
  const [tripletQuarterMs, setTripletQuarterMs] = React.useState<number>(333.33);
  const [lfoFrequencyHz, setLfoFrequencyHz] = React.useState<number>(2.0);

  const [divisions, setDivisions] = React.useState<NoteDivisionRow[]>([]);
  const [reverbGuides, setReverbGuides] = React.useState<ReverbPresetGuide[]>([]);

  const calculateTiming = React.useCallback(() => {
    const validBpm = Math.max(1, bpm ?? 120);

    // 1. Rumus Dasar: 1 Beat (Quarter Note / 1/4 note) dalam milidetik
    // T_quarter = 60.000 / BPM
    const qMs = 60000 / validBpm;
    const eMs = qMs / 2;
    const sMs = qMs / 4;
    const dotEighth = eMs * 1.5;
    const tripQuarter = qMs * (2 / 3);
    const lfoHz = validBpm / 60;

    setQuarterMs(Number(qMs.toFixed(2)));
    setEighthMs(Number(eMs.toFixed(2)));
    setSixteenthMs(Number(sMs.toFixed(2)));
    setDottedEighthMs(Number(dotEighth.toFixed(2)));
    setTripletQuarterMs(Number(tripQuarter.toFixed(2)));
    setLfoFrequencyHz(Number(lfoHz.toFixed(3)));

    // 2. Matriks Pembagian Nilai Notasi (Standard, Dotted x1.5, Triplet x2/3)
    const rawNoteList = [
      { name: "Whole Note (1 Bar 4/4)", fraction: "1/1", baseFactor: 4 },
      { name: "Half Note", fraction: "1/2", baseFactor: 2 },
      { name: "Quarter Note (Beat)", fraction: "1/4", baseFactor: 1 },
      { name: "Eighth Note", fraction: "1/8", baseFactor: 0.5 },
      { name: "Sixteenth Note", fraction: "1/16", baseFactor: 0.25 },
      { name: "Thirty-Second Note", fraction: "1/32", baseFactor: 0.125 },
      { name: "Sixty-Fourth Note", fraction: "1/64", baseFactor: 0.0625 },
    ];

    const divisionMatrix: NoteDivisionRow[] = rawNoteList.map((item) => {
      const normal = qMs * item.baseFactor;
      const dotted = normal * 1.5;
      const triplet = normal * (2 / 3);
      const freq = 1000 / normal;

      return {
        name: item.name,
        fraction: item.fraction,
        normalMs: Number(normal.toFixed(2)),
        dottedMs: Number(dotted.toFixed(2)),
        tripletMs: Number(triplet.toFixed(2)),
        hz: Number(freq.toFixed(2)),
      };
    });

    setDivisions(divisionMatrix);

    // 3. Rekomendasi Pengaturan Reverb & Pre-Delay Terkalibrasi
    const guides: ReverbPresetGuide[] = [
      {
        space: "Tight Vocal Ambience",
        preDelayMs: Number((qMs / 32).toFixed(2)), // 1/128 note
        decayTimeMs: Number((qMs * 1).toFixed(2)), // 1 beat decay
        description: "Memberikan kejelasan artikulasi vokal tanpa mengotori domain frekuensi menengah.",
      },
      {
        space: "Medium Plate / Snare Reverb",
        preDelayMs: Number((qMs / 16).toFixed(2)), // 1/64 note
        decayTimeMs: Number((qMs * 2).toFixed(2)), // 1/2 note decay
        description: "Menjaga transient snare drum tetap punchy sebelum pantulan ekor reverb masuk.",
      },
      {
        space: "Large Hall / Synth Space",
        preDelayMs: Number((qMs / 8).toFixed(2)), // 1/32 note
        decayTimeMs: Number((qMs * 4).toFixed(2)), // 1 bar decay
        description: "Pelebaran stereo dinamis untuk pad, lead synth, atau soundscape sinematik.",
      },
    ];

    setReverbGuides(guides);
  }, [bpm]);

  React.useEffect(() => {
    calculateTiming();
  }, [calculateTiming]);

  const handleReset = () => {
    setBpm(120);
  };

  const handlePresetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val) && val > 0) {
      setBpm(val);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Kolom Kiri: Form Input Parameter Tempo */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Tempo Musik (BPM)
                </h2>
                <p className="text-secondary text-sm">
                  Konfigurasi nilai Beats Per Minute untuk sinkronisasi waktu delay dan reverb
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke default 120 BPM"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Select
              label="Preset Genre & Tempo Standar Industri"
              onChange={handlePresetSelect}
              value={bpm ?? 120}
              helperText="Pilih standar tempo produksi audio populer"
            >
              <option value="60">60 BPM — Lento / Ballad Lambat</option>
              <option value="75">75 BPM — Lo-Fi / Downtempo</option>
              <option value="90">90 BPM — Boom Bap / Hip Hop</option>
              <option value="100">100 BPM — R&B / Pop Modern</option>
              <option value="120">120 BPM — House / Dance Standar</option>
              <option value="128">128 BPM — EDM / Electro Club</option>
              <option value="140">140 BPM — Trap / Dubstep</option>
              <option value="150">150 BPM — Hardstyle / Rock</option>
              <option value="174">174 BPM — Drum & Bass / Jungle</option>
            </Select>

            <Input
              label="Tempo Trek (Beats Per Minute)"
              type="number"
              min={20}
              max={400}
              step={0.1}
              value={bpm ?? ""}
              onChange={(e) =>
                setBpm(e.target.value === "" ? null : Number(e.target.value))
              }
              suffix="BPM"
              helperText={`Frekuensi LFO: ${lfoFrequencyHz} Hz (${quarterMs} ms per ketukan)`}
            />
          </div>

          <div className="pt-2">
            <Button
              onClick={calculateTiming}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Hitung Waktu Delay & Reverb Presisi
            </Button>
          </div>
        </Card>

        {/* Tabel Matriks Pembagian Nilai Notasi Lengkap */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase">
                Matriks Pembagian Waktu Notasi (Milidetik)
              </h3>
            </div>
            <span className="text-xs font-mono text-secondary">Tempo: {bpm ?? 120} BPM</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-secondary font-medium">
                  <th className="py-2.5 px-3">Notasi</th>
                  <th className="py-2.5 px-3 text-right">Normal (ms)</th>
                  <th className="py-2.5 px-3 text-right">Dotted (x1.5)</th>
                  <th className="py-2.5 px-3 text-right">Triplet (x0.667)</th>
                  <th className="py-2.5 px-3 text-right">LFO (Hz)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono">
                {divisions.map((row) => (
                  <tr
                    key={row.fraction}
                    className="hover:bg-elevated transition-colors"
                  >
                    <td className="py-2.5 px-3 font-sans text-primary font-medium flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-accent/10 text-accent font-mono text-[11px]">
                        {row.fraction}
                      </span>
                      <span className="hidden sm:inline text-secondary text-[11px]">
                        {row.name}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-primary font-semibold">
                      {row.normalMs.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2.5 px-3 text-right text-accent">
                      {row.dottedMs.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2.5 px-3 text-right text-amber-400">
                      {row.tripletMs.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2.5 px-3 text-right text-secondary">
                      {row.hz} Hz
                    </td>
                  </tr>
                ))}
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
            Formula kalkulasi mengonversi durasi waktu fisik 60.000 ms per menit dibagi BPM.
            Nilai dotted dihitung menggunakan rasio 1.5x dan notasi triplet menggunakan rasio 2/3 (0.6667x)
            untuk integrasi presisi pada plugin VST, delay hardware, kompresor sidechain, dan reverb digital.
          </div>
        </Card>
      </div>

      {/* Kolom Kanan: Output Utama & Panduan Mixing */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Hero Output Cards */}
        <OutputBox
          label="1/4 Note Delay (1 Beat / Ketukan)"
          value={quarterMs}
          decimals={2}
          suffix=" ms"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <OutputBox
            label="Dotted 1/8 Note (U2 / Pink Floyd Delay)"
            value={dottedEighthMs}
            decimals={2}
            suffix=" ms"
          />

          <OutputBox
            label="1/16 Note (Fast Vocal Slapback)"
            value={sixteenthMs}
            decimals={2}
            suffix=" ms"
          />
        </div>

        {/* Triplet & Frequency Spotlight */}
        <Card className="flex flex-col gap-3 p-5 bg-gradient-to-br from-surface to-elevated border-accent/30">
          <div className="flex items-center justify-between">
            <span className="text-secondary text-xs font-sans flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-accent" />
              Triplet 1/4 Note (3 Not per 2 Ketukan)
            </span>
            <span className="text-xs font-mono text-accent font-semibold">
              {tripletQuarterMs} ms
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-border/60 pt-2 text-xs">
            <span className="text-secondary flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-secondary" />
              Frekuensi LFO Modulasi (1/4 Note)
            </span>
            <span className="font-mono text-primary font-medium">
              {lfoFrequencyHz} Hz
            </span>
          </div>
        </Card>

        {/* Rekomendasi Pengaturan Ruang Reverb */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-accent" />
              Panduan Pre-Delay & Decay Reverb
            </h3>
            <span className="text-xs text-secondary font-mono">RT60 Sync</span>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            {reverbGuides.map((guide) => (
              <div
                key={guide.space}
                className="flex flex-col gap-1 p-2.5 rounded-xl border border-border bg-base hover:bg-elevated transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-primary">{guide.space}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-accent font-medium">
                      Pre: {guide.preDelayMs} ms
                    </span>
                    <span className="text-secondary">|</span>
                    <span className="text-emerald-400 font-medium">
                      Decay: {guide.decayTimeMs} ms
                    </span>
                  </div>
                </div>
                <p className="text-secondary text-[11px] leading-relaxed">
                  {guide.description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Real-time URL Synchronization Badge */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <Zap className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            Data tempo tersinkronisasi <span className="text-primary font-medium">real-time</span> ke URL query parameters. Anda dapat menyalin tautan browser untuk membagikan parameter waktu delay dan reverb ke rekan produser atau teknisi mixing secara presisi.
          </p>
        </div>
      </div>
    </div>
  );
}