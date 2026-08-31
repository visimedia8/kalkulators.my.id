"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Calculator,
  RefreshCw,
  Scale,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useQueryState, parseAsFloat } from "nuqs";

export const GOLD_PRICE_PRESETS: Record<string, { label: string; price: number }> = {
  custom: { label: "Input Manual (Kustom)", price: 0 },
  antam: { label: "Harga Emas Antam (Estimasi Rp 1.450.000/g)", price: 1450000 },
  baznas: { label: "Standar Acuan BAZNAS (Rp 1.400.000/g)", price: 1400000 },
  pegadaian: { label: "Harga Emas Pegadaian (Rp 1.420.000/g)", price: 1420000 },
};

export function ZakatMalCalculator() {
  // Query States (nuqs URL Parameters)
  const [goldPrice, setGoldPrice] = useQueryState("emas", parseAsFloat.withDefault(1400000));
  const [savings, setSavings] = useQueryState("tabungan", parseAsFloat.withDefault(100000000));
  const [assets, setAssets] = useQueryState("aset", parseAsFloat.withDefault(50000000));
  const [debt, setDebt] = useQueryState("hutang", parseAsFloat.withDefault(10000000));

  // Preset Selection Helper
  const [selectedPreset, setSelectedPreset] = React.useState<string>("baznas");

  // Output Calculation States
  const [nisabAmount, setNisabAmount] = React.useState<number>(0);
  const [grossAssets, setGrossAssets] = React.useState<number>(0);
  const [netAssets, setNetAssets] = React.useState<number>(0);
  const [isEligible, setIsEligible] = React.useState<boolean>(false);
  const [zakatAmount, setZakatAmount] = React.useState<number>(0);
  const [monthlyZakat, setMonthlyZakat] = React.useState<number>(0);
  const [differenceToNisab, setDifferenceToNisab] = React.useState<number>(0);

  const calculateZakatMal = React.useCallback(() => {
    const emas = Math.max(0, goldPrice || 0);
    const tabunganVal = Math.max(0, savings || 0);
    const asetVal = Math.max(0, assets || 0);
    const hutangVal = Math.max(0, debt || 0);

    // 1. Nisab = 85 gram emas murni
    const calculatedNisab = 85 * emas;

    // 2. Total Harta Bruto & Harta Bersih
    const calculatedGross = tabunganVal + asetVal;
    const calculatedNet = calculatedGross - hutangVal;

    // 3. Status Wajib Zakat: Harta Bersih >= Nisab
    const eligible = calculatedNet >= calculatedNisab && calculatedNet > 0;

    // 4. Nominal Zakat Mal = 2.5% dari Harta Bersih
    const calculatedZakat = eligible ? Math.round(calculatedNet * 0.025) : 0;
    const calculatedMonthly = eligible ? Math.round(calculatedZakat / 12) : 0;
    const diff = calculatedNet - calculatedNisab;

    setNisabAmount(calculatedNisab);
    setGrossAssets(calculatedGross);
    setNetAssets(calculatedNet);
    setIsEligible(eligible);
    setZakatAmount(calculatedZakat);
    setMonthlyZakat(calculatedMonthly);
    setDifferenceToNisab(diff);
  }, [goldPrice, savings, assets, debt]);

  // Reactive calculation on parameter changes
  React.useEffect(() => {
    calculateZakatMal();
  }, [calculateZakatMal]);

  const handlePresetChange = (presetKey: string) => {
    setSelectedPreset(presetKey);
    if (presetKey !== "custom" && GOLD_PRICE_PRESETS[presetKey]) {
      setGoldPrice(GOLD_PRICE_PRESETS[presetKey].price);
    }
  };

  const handleReset = () => {
    setGoldPrice(null);
    setSavings(null);
    setAssets(null);
    setDebt(null);
    setSelectedPreset("baznas");
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Parameters Section */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">Parameter Harta Zakat Mal</h2>
                <p className="text-secondary text-sm">Hitung kewajiban zakat mal presisi standar nisab 85 gram emas</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke nilai default"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <Select
                label="Pilihan Acuan Harga Emas"
                value={selectedPreset}
                onChange={(e) => handlePresetChange(e.target.value)}
                helperText="Pilih standar harga acuan pasar atau tentukan nilai per gram secara manual"
              >
                {Object.entries(GOLD_PRICE_PRESETS).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Harga Emas per Gram Saat Ini"
                type="number"
                min={0}
                step={10000}
                value={goldPrice || ""}
                onChange={(e) => {
                  setSelectedPreset("custom");
                  setGoldPrice(Number(e.target.value));
                }}
                prefix="Rp"
                suffix="/ gram"
                helperText={`Nilai Nisab (85g Emas): ${formatCurrency(nisabAmount)}`}
              />
            </div>

            <Input
              label="Total Tabungan & Deposito"
              type="number"
              min={0}
              step={1000000}
              value={savings || ""}
              onChange={(e) => setSavings(Number(e.target.value))}
              prefix="Rp"
              helperText={`Nominal: ${formatCurrency(savings || 0)}`}
            />

            <Input
              label="Total Nilai Aset / Bisnis Lancar"
              type="number"
              min={0}
              step={1000000}
              value={assets || ""}
              onChange={(e) => setAssets(Number(e.target.value))}
              prefix="Rp"
              helperText={`Nominal: ${formatCurrency(assets || 0)}`}
            />

            <div className="sm:col-span-2">
              <Input
                label="Total Hutang Jatuh Tempo"
                type="number"
                min={0}
                step={500000}
                value={debt || ""}
                onChange={(e) => setDebt(Number(e.target.value))}
                prefix="Rp"
                helperText={`Pengurang harta: ${formatCurrency(debt || 0)} (Hutang jangka pendek yang wajib dilunasi)`}
              />
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={calculateZakatMal} className="w-full sm:w-auto flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Hitung Zakat Mal Presisi
            </Button>
          </div>
        </Card>
      </div>

      {/* Output & Breakdown Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Status Card Indicator */}
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 transition-colors ${
            isEligible
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-amber-500/10 border-amber-500/30 text-amber-400"
          }`}
        >
          {isEligible ? (
            <>
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-semibold text-primary">Status: Wajib Zakat (Telah Memenuhi Nisab)</div>
                <div className="text-secondary text-xs mt-0.5">
                  Harta bersih Anda melebihi ambang nisab sebesar {formatCurrency(Math.max(0, differenceToNisab))}
                </div>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-semibold text-primary">Status: Belum Wajib Zakat Mal</div>
                <div className="text-secondary text-xs mt-0.5">
                  Harta bersih berada di bawah nisab (selisih {formatCurrency(Math.abs(differenceToNisab))})
                </div>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <OutputBox
            label="Nominal Zakat Mal Wajib Ditunaikan (Tahunan)"
            value={zakatAmount}
            prefix="Rp "
          />
          <OutputBox
            label="Ambang Batas Nisab Standar (85 Gram Emas)"
            value={nisabAmount}
            prefix="Rp "
          />
        </div>

        <Card className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase border-b border-border pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" />
            Rincian Audit Finansial Syariah
          </h3>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-secondary">Tabungan & Deposito:</span>
              <span className="font-mono text-primary font-medium">{formatCurrency(savings || 0)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Aset Likuid & Bisnis Lancar:</span>
              <span className="font-mono text-primary font-medium">{formatCurrency(assets || 0)}</span>
            </div>

            <div className="flex justify-between items-center border-t border-border/40 pt-2">
              <span className="text-secondary font-medium">Total Harta Bruto:</span>
              <span className="font-mono text-primary font-semibold">{formatCurrency(grossAssets)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Hutang Jatuh Tempo (Pengurang):</span>
              <span className="font-mono text-danger font-medium">- {formatCurrency(debt || 0)}</span>
            </div>

            <div className="flex justify-between items-center border-t border-border/50 pt-2">
              <span className="text-secondary font-medium">Total Harta Bersih:</span>
              <span className="font-mono text-primary font-bold">{formatCurrency(netAssets)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Batas Nisab (85g Emas):</span>
              <span className="font-mono text-secondary font-medium">{formatCurrency(nisabAmount)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Kadar Zakat Syariah:</span>
              <span className="font-mono text-accent font-semibold">2,5% (1/40)</span>
            </div>

            {isEligible && (
              <div className="flex justify-between items-center border-t border-border/40 pt-2 text-xs">
                <span className="text-secondary">Estimasi Zakat jika Dicicil Bulanan:</span>
                <span className="font-mono text-secondary font-medium">{formatCurrency(monthlyZakat)} / bulan</span>
              </div>
            )}

            <div className="pt-3 border-t border-border flex justify-between items-center font-semibold">
              <span className="text-primary">Total Kewajiban Zakat:</span>
              <span className="font-mono text-accent text-base">{formatCurrency(zakatAmount)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}