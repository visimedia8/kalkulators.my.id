"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Users,
  UserMinus,
  UserCheck,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Calculator,
  ShieldCheck,
  Briefcase,
  Info,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Building2,
  Percent
} from "lucide-react";
import { useQueryState, parseAsFloat } from "nuqs";

export function TurnoverRateCalculator() {
  // 1. Parameter Teknis Input via URL Query State (nuqs)
  const [karyawanAwal, setKaryawanAwal] = useQueryState(
    "karyawanAwal",
    parseAsFloat.withDefault(100)
  );
  const [karyawanAkhir, setKaryawanAkhir] = useQueryState(
    "karyawanAkhir",
    parseAsFloat.withDefault(95)
  );
  const [karyawanKeluar, setKaryawanKeluar] = useQueryState(
    "karyawanKeluar",
    parseAsFloat.withDefault(12)
  );

  // 2. State Output Hasil Komputasi
  const [rataRataKaryawan, setRataRataKaryawan] = React.useState<number>(0);
  const [turnoverRate, setTurnoverRate] = React.useState<number>(0);
  const [retentionRate, setRetentionRate] = React.useState<number>(0);
  const [netHeadcountChange, setNetHeadcountChange] = React.useState<number>(0);
  const [benchmarkStatus, setBenchmarkStatus] = React.useState<string>("Optimal");
  const [benchmarkDesc, setBenchmarkDesc] = React.useState<string>("");

  // 3. Mathematical Formula Engine
  const calculateTurnover = React.useCallback(() => {
    const awal = Math.max(0, karyawanAwal ?? 0);
    const akhir = Math.max(0, karyawanAkhir ?? 0);
    const keluar = Math.max(0, karyawanKeluar ?? 0);

    // A. Rata-rata Karyawan = (Karyawan Awal + Karyawan Akhir) / 2
    const avgHeadcount = (awal + akhir) / 2;

    // B. Turnover Rate = (Karyawan Keluar / Rata-rata Karyawan) x 100%
    const rate = avgHeadcount > 0 ? (keluar / avgHeadcount) * 100 : 0;
    const finalRate = Number(rate.toFixed(2));

    // C. Retention Rate = 100% - Turnover Rate (Presisi Matematis)
    const retention = Math.max(0, Number((100 - finalRate).toFixed(2)));

    // D. Perubahan Bersih Headcount (Net Growth/Decline)
    const netChange = akhir - awal;

    setRataRataKaryawan(Number(avgHeadcount.toFixed(1)));
    setTurnoverRate(finalRate);
    setRetentionRate(retention);
    setNetHeadcountChange(netChange);

    // Evaluasi Standar Industri HR & People Operations Benchmark
    if (finalRate <= 5) {
      setBenchmarkStatus("Sangat Rendah (Retensi Prima)");
      setBenchmarkDesc(
        "Stabilitas tenaga kerja sangat prima dengan tingkat retensi talenta optimal. Pertahankan iklim kerja dan jalur karir internal."
      );
    } else if (finalRate <= 15) {
      setBenchmarkStatus("Standar Industri Optimal (Sehat)");
      setBenchmarkDesc(
        "Tingkat turnover berada dalam ambang batas sehat standar industri. Memberikan ruang penyegaran kompetensi tanpa mengorbankan produktivitas."
      );
    } else if (finalRate <= 25) {
      setBenchmarkStatus("Moderat (Perlu Evaluasi)");
      setBenchmarkDesc(
        "Terdeteksi potensi friksi pada kepuasan kerja, kompensasi, atau beban kerja. Disarankan melakukan audit wawancara keluar (exit interview)."
      );
    } else {
      setBenchmarkStatus("Tinggi / Kritis (Risiko Operasional)");
      setBenchmarkDesc(
        "Turnover melampaui batas aman standar industri. Berisiko membengkakkan biaya rekrutmen/onboarding dan menurunkan efisiensi tim."
      );
    }
  }, [karyawanAwal, karyawanAkhir, karyawanKeluar]);

  // Kalkulasi Real-Time saat parameter berubah
  React.useEffect(() => {
    calculateTurnover();
  }, [calculateTurnover]);

  const handleReset = () => {
    setKaryawanAwal(100);
    setKaryawanAkhir(95);
    setKaryawanKeluar(12);
  };

  const handlePresetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) return;

    const presets: Record<
      string,
      { awal: number; akhir: number; keluar: number }
    > = {
      corporate: { awal: 250, akhir: 245, keluar: 20 },
      tech_startup: { awal: 60, akhir: 70, keluar: 9 },
      manufacturing: { awal: 600, akhir: 580, keluar: 55 },
      retail_fmcg: { awal: 300, akhir: 285, keluar: 72 },
      banking_finance: { awal: 400, akhir: 410, keluar: 28 },
      hospitality_fnb: { awal: 120, akhir: 110, keluar: 35 }
    };

    const selected = presets[val];
    if (selected) {
      setKaryawanAwal(selected.awal);
      setKaryawanAkhir(selected.akhir);
      setKaryawanKeluar(selected.keluar);
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
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Teknis Turnover Karyawan
                </h2>
                <p className="text-secondary text-sm">
                  Konfigurasi metrik headcount dan separasi tenaga kerja terkalibrasi
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
                label="Preset Skenario Sektor Industri (Opsional)"
                onChange={handlePresetSelect}
                defaultValue=""
                helperText="Pilih simulasi tolok ukur standar industri atau masukkan parameter teknis secara manual"
              >
                <option value="">-- Pilih Sektor Industri --</option>
                <option value="corporate">Korporat / Holding Komersial (Benchmark ~8%)</option>
                <option value="tech_startup">Teknologi & SaaS Startup (Benchmark ~13%)</option>
                <option value="manufacturing">Manufaktur & Pabrikasi (Benchmark ~9%)</option>
                <option value="retail_fmcg">Ritel & Distribusi FMCG (Benchmark ~24%)</option>
                <option value="banking_finance">Perbankan & Institusi Finansial (Benchmark ~7%)</option>
                <option value="hospitality_fnb">Hospitality, Restoran & F&B (Benchmark ~30%)</option>
              </Select>
            </div>

            <Input
              label="Jumlah Karyawan Awal Periode"
              type="number"
              min={0}
              step={1}
              value={karyawanAwal ?? ""}
              onChange={(e) =>
                setKaryawanAwal(e.target.value === "" ? null : Number(e.target.value))
              }
              suffix="Orang"
              helperText="Total headcount aktif pada hari pertama siklus evaluasi"
            />

            <Input
              label="Jumlah Karyawan Akhir Periode"
              type="number"
              min={0}
              step={1}
              value={karyawanAkhir ?? ""}
              onChange={(e) =>
                setKaryawanAkhir(e.target.value === "" ? null : Number(e.target.value))
              }
              suffix="Orang"
              helperText="Total headcount aktif pada hari terakhir siklus evaluasi"
            />

            <div className="sm:col-span-2">
              <Input
                label="Jumlah Karyawan Keluar (Separasi)"
                type="number"
                min={0}
                step={1}
                value={karyawanKeluar ?? ""}
                onChange={(e) =>
                  setKaryawanKeluar(e.target.value === "" ? null : Number(e.target.value))
                }
                suffix="Orang"
                helperText="Akumulasi karyawan yang mengundurkan diri (voluntary) atau terminasi (involuntary)"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={calculateTurnover}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Kalkulasi Turnover Rate Presisi
            </Button>
          </div>
        </Card>

        {/* Industry Guidance Note */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            <span className="font-semibold text-primary block mb-0.5">
              Standar Metrik People Operations:
            </span>
            Kalkulator ini mengadopsi formulasi baku standar industri HR internasional (SHRM). Komputasi dilakukan secara akurat tanpa pembulatan prematur guna menjaga konsistensi audit human capital.
          </p>
        </div>
      </div>

      {/* Output & Breakdown Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <OutputBox
          label="Tingkat Perputaran Karyawan (Turnover Rate)"
          value={turnoverRate}
          suffix="%"
          decimals={2}
        />

        {/* Status Benchmark Card */}
        <div className="p-5 rounded-2xl border flex flex-col gap-3 transition-all bg-accent/5 border-accent/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-base/60 text-accent">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-secondary">
                  Status Retensi Organisasi
                </span>
                <h3 className="text-lg font-bold font-display text-primary">
                  {benchmarkStatus}
                </h3>
              </div>
            </div>
            {turnoverRate <= 15 ? (
              <span className="flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sehat
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                <AlertTriangle className="w-3.5 h-3.5" />
                {turnoverRate > 25 ? "Kritis" : "Perhatian"}
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed text-secondary border-t border-border/50 pt-2">
            {benchmarkDesc}
          </p>
        </div>

        {/* Headcount Breakdown Card */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" />
              Rincian Metrik Tenaga Kerja
            </h3>
            <span className="text-xs text-secondary font-mono">Formula: (L / N_avg) × 100%</span>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            {/* Rata-rata Karyawan */}
            <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-base border border-border">
              <div className="flex justify-between items-center">
                <span className="text-secondary text-xs flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-accent" />
                  Rata-rata Karyawan (Average Headcount)
                </span>
                <span className="font-mono text-primary font-semibold">
                  {rataRataKaryawan} Orang
                </span>
              </div>
              <span className="text-[11px] text-secondary">
                ({karyawanAwal || 0} awal + {karyawanAkhir || 0} akhir) / 2
              </span>
            </div>

            {/* Retention Rate */}
            <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-base border border-border">
              <div className="flex justify-between items-center">
                <span className="text-secondary text-xs flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Tingkat Retensi (Retention Rate)
                </span>
                <span className="font-mono text-primary font-semibold">
                  {retentionRate}%
                </span>
              </div>
              <span className="text-[11px] text-secondary">
                Proporsi tenaga kerja yang bertahan dalam periode berjalan
              </span>
            </div>

            {/* Net Change */}
            <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-base border border-border">
              <div className="flex justify-between items-center">
                <span className="text-secondary text-xs flex items-center gap-1.5">
                  {netHeadcountChange >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                  )}
                  Pertumbuhan Bersih (Net Headcount)
                </span>
                <span
                  className={`font-mono font-semibold ${
                    netHeadcountChange >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {netHeadcountChange > 0 ? `+${netHeadcountChange}` : netHeadcountChange} Orang
                </span>
              </div>
              <span className="text-[11px] text-secondary">
                Selisih tenaga kerja akhir dikurangi tenaga kerja awal periode
              </span>
            </div>
          </div>
        </Card>

        {/* Technical Intelligence Parameters */}
        <Card className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold font-display text-secondary tracking-wider uppercase flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-accent" />
            Parameter Teknis Lanjutan
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex flex-col gap-0.5 p-2 rounded-lg bg-base">
              <span className="text-secondary text-[11px]">Separasi Karyawan</span>
              <span className="font-mono font-medium text-danger">
                {karyawanKeluar || 0} Orang
              </span>
            </div>
            <div className="flex flex-col gap-0.5 p-2 rounded-lg bg-base">
              <span className="text-secondary text-[11px]">Rasio Separasi Total</span>
              <span className="font-mono font-medium text-warning">
                {karyawanAwal && karyawanAwal > 0
                  ? (((karyawanKeluar || 0) / karyawanAwal) * 100).toFixed(1)
                  : 0}
                %
              </span>
            </div>
          </div>
        </Card>

        {/* Standard Assurance Badge */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            Kalkulasi mengikuti standar industri Human Capital Analytics. Parameter teknis tersinkronisasi presisi dan real-time via URL Query State.
          </p>
        </div>
      </div>
    </div>
  );
}