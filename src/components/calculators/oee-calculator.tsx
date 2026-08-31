"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Factory,
  RotateCcw,
  Calculator,
  ShieldCheck,
  Activity,
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Gauge,
  Info
} from "lucide-react";
import { useQueryState, parseAsFloat } from "nuqs";

export function OeeCalculator() {
  // 1. State Input via URL Query (nuqs)
  const [plannedTime, setPlannedTime] = useQueryState("plannedTime", parseAsFloat.withDefault(480));
  const [downtime, setDowntime] = useQueryState("downtime", parseAsFloat.withDefault(60));
  const [idealCycleTime, setIdealCycleTime] = useQueryState("idealCycleTime", parseAsFloat.withDefault(30));
  const [totalCount, setTotalCount] = useQueryState("totalCount", parseAsFloat.withDefault(800));
  const [goodCount, setGoodCount] = useQueryState("goodCount", parseAsFloat.withDefault(760));

  // 2. Output State
  const [availabilityRate, setAvailabilityRate] = React.useState<number>(0);
  const [performanceRate, setPerformanceRate] = React.useState<number>(0);
  const [qualityRate, setQualityRate] = React.useState<number>(0);
  const [oeeScore, setOeeScore] = React.useState<number>(0);

  // Parameter Operasional Tambahan
  const [operatingTimeMinutes, setOperatingTimeMinutes] = React.useState<number>(0);
  const [defectCount, setDefectCount] = React.useState<number>(0);
  const [defectRate, setDefectRate] = React.useState<number>(0);
  const [theoreticalMaxUnits, setTheoreticalMaxUnits] = React.useState<number>(0);
  const [benchmarkStatus, setBenchmarkStatus] = React.useState<string>("World-Class");
  const [benchmarkDesc, setBenchmarkDesc] = React.useState<string>("");

  // 3. Mathematical Formula Engine
  const calculateOEE = React.useCallback(() => {
    const pt = Math.max(0, plannedTime ?? 480);
    const dt = Math.max(0, downtime ?? 0);
    const ict = Math.max(0, idealCycleTime ?? 30);
    const tc = Math.max(0, totalCount ?? 0);
    const gc = Math.min(tc, Math.max(0, goodCount ?? 0));

    // A. Operating Time (Run Time)
    const operatingTime = Math.max(0, pt - dt);
    const operatingTimeSec = operatingTime * 60;

    // B. Availability = (Planned Time - Downtime) / Planned Time
    const availability = pt > 0 ? operatingTime / pt : 0;

    // C. Performance = (Ideal Cycle Time * Total Count) / Operating Time (dalam detik)
    const performance = (operatingTimeSec > 0 && ict > 0)
      ? (ict * tc) / operatingTimeSec
      : 0;

    // D. Quality = Good Count / Total Count
    const quality = tc > 0 ? gc / tc : 0;

    // E. Overall Equipment Effectiveness (OEE) = A x P x Q
    const oee = availability * performance * quality;

    const availPct = Number((availability * 100).toFixed(2));
    const perfPct = Number((performance * 100).toFixed(2));
    const qualPct = Number((quality * 100).toFixed(2));
    const oeeFinalPct = Number((oee * 100).toFixed(2));

    const rejects = Math.max(0, tc - gc);
    const rejectPct = tc > 0 ? Number(((rejects / tc) * 100).toFixed(2)) : 0;
    const maxUnits = ict > 0 ? Math.floor(operatingTimeSec / ict) : 0;

    setOperatingTimeMinutes(operatingTime);
    setAvailabilityRate(availPct);
    setPerformanceRate(perfPct);
    setQualityRate(qualPct);
    setOeeScore(oeeFinalPct);
    setDefectCount(rejects);
    setDefectRate(rejectPct);
    setTheoreticalMaxUnits(maxUnits);

    // Evaluasi Standar Industri (TPM / Six Sigma Benchmark)
    if (oeeFinalPct >= 85) {
      setBenchmarkStatus("World-Class (Kelas Dunia)");
      setBenchmarkDesc("Kinerja operasional berada pada efisiensi puncak standar industri global (≥85%).");
    } else if (oeeFinalPct >= 70) {
      setBenchmarkStatus("Tipikal / Kompetitif");
      setBenchmarkDesc("Produktivitas stabil dengan ruang peningkatan minor pada kecepatan dan setup time.");
    } else if (oeeFinalPct >= 60) {
      setBenchmarkStatus("Wajar (Perlu Optimasi)");
      setBenchmarkDesc("Terdapat potensi kerugian kapasitas tersembunyi (Six Big Losses) yang perlu mitigasi.");
    } else {
      setBenchmarkStatus("Kritis (Inefisiensi Berat)");
      setBenchmarkDesc("Lini produksi terhambat oleh downtime tinggi, siklus lambat, atau rasio reject signifikan.");
    }
  }, [plannedTime, downtime, idealCycleTime, totalCount, goodCount]);

  // Kalkulasi Real-Time saat parameter berubah
  React.useEffect(() => {
    calculateOEE();
  }, [calculateOEE]);

  const handleReset = () => {
    setPlannedTime(480);
    setDowntime(60);
    setIdealCycleTime(30);
    setTotalCount(800);
    setGoodCount(760);
  };

  const handlePresetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) return;

    const presets: Record<string, { pt: number; dt: number; ict: number; tc: number; gc: number }> = {
      automotive: { pt: 480, dt: 45, ict: 45, tc: 550, gc: 540 },
      smt_electronics: { pt: 480, dt: 20, ict: 5, tc: 5200, gc: 5140 },
      cnc_machining: { pt: 480, dt: 80, ict: 120, tc: 185, gc: 175 },
      injection_molding: { pt: 720, dt: 60, ict: 20, tc: 1900, gc: 1840 },
      fmcg_packaging: { pt: 480, dt: 35, ict: 2, tc: 12000, gc: 11800 },
    };

    const selected = presets[val];
    if (selected) {
      setPlannedTime(selected.pt);
      setDowntime(selected.dt);
      setIdealCycleTime(selected.ict);
      setTotalCount(selected.tc);
      setGoodCount(selected.gc);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form Input Section */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Factory className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Teknis OEE Manufaktur
                </h2>
                <p className="text-secondary text-sm">
                  Konfigurasi waktu siklus, kapasitas lini, dan parameter produksi terkalibrasi
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke nilai parameter standar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <Select
                label="Preset Lini Produksi Sektor Industri"
                onChange={handlePresetSelect}
                defaultValue=""
                helperText="Pilih simulasi kasus standar industri atau sesuaikan angka secara manual"
              >
                <option value="">-- Pilih Sektor Industri (Opsional) --</option>
                <option value="automotive">Otomotif & Komponen Presisi (Shift 8 Jam, Target 550 Unit)</option>
                <option value="smt_electronics">SMT & Elektronik Berkecepatan Tinggi (Cycle 5s, High Yield)</option>
                <option value="cnc_machining">CNC Machining & Pemotongan Logam (Cycle 120s)</option>
                <option value="injection_molding">Plastic Injection Molding (Shift 12 Jam)</option>
                <option value="fmcg_packaging">FMCG & Lini Pengemasan Massal (Cycle 2s)</option>
              </Select>
            </div>

            <Input
              label="Planned Production Time (Waktu Rencana)"
              type="number"
              min={1}
              step={10}
              value={plannedTime ?? ""}
              onChange={(e) => setPlannedTime(e.target.value === "" ? null : Number(e.target.value))}
              suffix="Menit"
              helperText={`Total shift kerja dikurangi jeda terencana (${Math.round((plannedTime || 0) / 60 * 10) / 10} Jam)`}
            />

            <Input
              label="Unplanned Downtime (Waktu Henti)"
              type="number"
              min={0}
              step={5}
              value={downtime ?? ""}
              onChange={(e) => setDowntime(e.target.value === "" ? null : Number(e.target.value))}
              suffix="Menit"
              helperText="Kerusakan mesin, pergantian dies, setup tak terencana"
            />

            <Input
              label="Ideal Cycle Time (Waktu Siklus Standar)"
              type="number"
              min={0.01}
              step={0.1}
              value={idealCycleTime ?? ""}
              onChange={(e) => setIdealCycleTime(e.target.value === "" ? null : Number(e.target.value))}
              suffix="Detik/Unit"
              helperText="Kecepatan teoritis tercepat desain mesin per unit produk"
            />

            <Input
              label="Total Output (Total Produksi)"
              type="number"
              min={1}
              step={10}
              value={totalCount ?? ""}
              onChange={(e) => setTotalCount(e.target.value === "" ? null : Number(e.target.value))}
              suffix="Pcs"
              helperText="Akumulasi kuantitas produk yang diproses (Good + Reject)"
            />

            <div className="sm:col-span-2">
              <Input
                label="Good Output (Produk Lolos QC)"
                type="number"
                min={0}
                max={totalCount || undefined}
                step={10}
                value={goodCount ?? ""}
                onChange={(e) => setGoodCount(e.target.value === "" ? null : Number(e.target.value))}
                suffix="Pcs"
                helperText="Produk presisi yang memenuhi toleransi spesifikasi teknis (First Pass Yield)"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={calculateOEE} className="w-full sm:w-auto flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Kalkulasi Efektivitas OEE Presisi
            </Button>
          </div>
        </Card>

        {/* Industry Guidance Note */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            <span className="font-semibold text-primary block mb-0.5">
              Standar Total Productive Maintenance (TPM):
            </span>
            Kalkulator ini menerapkan model perkalian 3 pilar teknis standar industri. Setiap variabel dihitung secara akurat tanpa pembulatan prematur untuk memastikan data real-time selaras dengan audit lantai produksi.
          </p>
        </div>
      </div>

      {/* Output & Breakdown Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <OutputBox
          label="Overall Equipment Effectiveness (OEE)"
          value={oeeScore}
          suffix="%"
          decimals={2}
        />

        {/* Status Benchmark Card */}
        <div className="p-5 rounded-2xl border flex flex-col gap-3 transition-all bg-accent/5 border-accent/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-base/60 text-accent">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-secondary">
                  Klasifikasi Kinerja Pabrik
                </span>
                <h3 className="text-lg font-bold font-display text-primary">
                  {benchmarkStatus}
                </h3>
              </div>
            </div>
            {oeeScore >= 85 ? (
              <span className="flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Optimal
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                <AlertTriangle className="w-3.5 h-3.5" />
                Gap: {(85 - oeeScore > 0 ? (85 - oeeScore).toFixed(1) : "0")}%
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed text-secondary border-t border-border/50 pt-2">
            {benchmarkDesc}
          </p>
        </div>

        {/* 3 Pillars Breakdown */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent" />
              Rincian 3 Pilar OEE
            </h3>
            <span className="text-xs text-secondary font-mono">Formula: A × P × Q</span>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            {/* Availability */}
            <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-base border border-border">
              <div className="flex justify-between items-center">
                <span className="text-secondary text-xs flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  Availability (Ketersediaan)
                </span>
                <span className="font-mono text-primary font-semibold">{availabilityRate}%</span>
              </div>
              <span className="text-[11px] text-secondary">
                Operating Time: {operatingTimeMinutes} mnt / Planned: {plannedTime || 0} mnt
              </span>
            </div>

            {/* Performance */}
            <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-base border border-border">
              <div className="flex justify-between items-center">
                <span className="text-secondary text-xs flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Performance (Efisiensi Kecepatan)
                </span>
                <span className="font-mono text-primary font-semibold">{performanceRate}%</span>
              </div>
              <span className="text-[11px] text-secondary">
                Output Aktual: {totalCount || 0} pcs / Kapasitas Teori: {theoreticalMaxUnits} pcs
              </span>
            </div>

            {/* Quality */}
            <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-base border border-border">
              <div className="flex justify-between items-center">
                <span className="text-secondary text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Quality (Tingkat Mutu Produk)
                </span>
                <span className="font-mono text-primary font-semibold">{qualityRate}%</span>
              </div>
              <span className="text-[11px] text-secondary">
                Produk Bagus: {goodCount || 0} pcs | Reject: {defectCount} pcs ({defectRate}%)
              </span>
            </div>
          </div>
        </Card>

        {/* Operational Intelligence Card */}
        <Card className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold font-display text-secondary tracking-wider uppercase flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-accent" />
            Parameter Teknis Lanjutan
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex flex-col gap-0.5 p-2 rounded-lg bg-base">
              <span className="text-secondary text-[11px]">Waktu Henti Mesin</span>
              <span className="font-mono font-medium text-danger">{downtime || 0} Menit</span>
            </div>
            <div className="flex flex-col gap-0.5 p-2 rounded-lg bg-base">
              <span className="text-secondary text-[11px]">Reject Rate</span>
              <span className="font-mono font-medium text-warning">{defectRate}%</span>
            </div>
          </div>
        </Card>

        {/* Standard Assurance Badge */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            Kalkulasi mengikuti standar industri Lean Manufacturing dan ISO 22400. Hasil komputasi presisi dan tersinkronisasi real-time ke URL state.
          </p>
        </div>
      </div>
    </div>
  );
}