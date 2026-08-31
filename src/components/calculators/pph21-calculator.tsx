"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import { Calculator, RefreshCw, Receipt, Wallet, ShieldCheck, HelpCircle, FileText } from "lucide-react";
import { useQueryState, parseAsFloat, parseAsString, parseAsBoolean } from "nuqs";

export const PTKP_RATES: Record<string, { label: string; amount: number; description: string }> = {
  "TK/0": { label: "TK/0 - Tidak Kawin (0 Tanggungan)", amount: 54000000, description: "Wajib Pajak Lajang / Sendiri" },
  "TK/1": { label: "TK/1 - Tidak Kawin (1 Tanggungan)", amount: 58500000, description: "Lajang dengan 1 tanggungan" },
  "TK/2": { label: "TK/2 - Tidak Kawin (2 Tanggungan)", amount: 63000000, description: "Lajang dengan 2 tanggungan" },
  "TK/3": { label: "TK/3 - Tidak Kawin (3 Tanggungan)", amount: 67500000, description: "Lajang dengan 3 tanggungan (maksimal)" },
  "K/0": { label: "K/0 - Kawin (0 Tanggungan)", amount: 58500000, description: "Menikah tanpa tanggungan" },
  "K/1": { label: "K/1 - Kawin (1 Tanggungan)", amount: 63000000, description: "Menikah dengan 1 tanggungan" },
  "K/2": { label: "K/2 - Kawin (2 Tanggungan)", amount: 67500000, description: "Menikah dengan 2 tanggungan" },
  "K/3": { label: "K/3 - Kawin (3 Tanggungan)", amount: 72000000, description: "Menikah dengan 3 tanggungan (maksimal)" },
  "K/I/0": { label: "K/I/0 - Kawin + Istri Gabung (0 Tanggungan)", amount: 112500000, description: "Penghasilan Suami & Istri digabung" },
  "K/I/1": { label: "K/I/1 - Kawin + Istri Gabung (1 Tanggungan)", amount: 117000000, description: "Istri digabung + 1 tanggungan" },
  "K/I/2": { label: "K/I/2 - Kawin + Istri Gabung (2 Tanggungan)", amount: 121500000, description: "Istri digabung + 2 tanggungan" },
  "K/I/3": { label: "K/I/3 - Kawin + Istri Gabung (3 Tanggungan)", amount: 126000000, description: "Istri digabung + 3 tanggungan" },
};

export function Pph21Calculator() {
  // Query States (nuqs)
  const [monthlySalary, setMonthlySalary] = useQueryState("salary", parseAsFloat.withDefault(10000000));
  const [monthlyAllowance, setMonthlyAllowance] = useQueryState("allowance", parseAsFloat.withDefault(0));
  const [ptkpStatus, setPtkpStatus] = useQueryState("ptkp", parseAsString.withDefault("TK/0"));
  const [hasNpwp, setHasNpwp] = useQueryState("npwp", parseAsBoolean.withDefault(true));
  const [bpjsPercent, setBpjsPercent] = useQueryState("bpjs", parseAsFloat.withDefault(2));

  // Calculation Results
  const [monthlyTax, setMonthlyTax] = React.useState<number>(0);
  const [monthlyTakeHomePay, setMonthlyTakeHomePay] = React.useState<number>(0);
  const [annualGross, setAnnualGross] = React.useState<number>(0);
  const [annualPositionCost, setAnnualPositionCost] = React.useState<number>(0);
  const [annualBpjs, setAnnualBpjs] = React.useState<number>(0);
  const [annualNet, setAnnualNet] = React.useState<number>(0);
  const [ptkpAmount, setPtkpAmount] = React.useState<number>(54000000);
  const [pkpAmount, setPkpAmount] = React.useState<number>(0);
  const [annualTax, setAnnualTax] = React.useState<number>(0);
  const [effectiveRate, setEffectiveRate] = React.useState<number>(0);

  const calculatePph21 = React.useCallback(() => {
    const salary = Math.max(0, monthlySalary || 0);
    const allowance = Math.max(0, monthlyAllowance || 0);
    const bpjsRate = Math.max(0, Math.min(100, bpjsPercent || 0));
    const selectedPtkpKey = ptkpStatus in PTKP_RATES ? ptkpStatus : "TK/0";
    const ptkpValue = PTKP_RATES[selectedPtkpKey].amount;

    // 1. Penghasilan Bruto
    const grossMonthly = salary + allowance;
    const grossYearly = grossMonthly * 12;

    // 2. Pengurang Bruto: Biaya Jabatan (5% maks Rp 500.000/bln atau Rp 6.000.000/thn)
    const positionCostMonthly = Math.min(grossMonthly * 0.05, 500000);
    const positionCostYearly = positionCostMonthly * 12;

    // Pengurang Bruto: Iuran JHT/Pensiun Karyawan
    const bpjsMonthly = salary * (bpjsRate / 100);
    const bpjsYearly = bpjsMonthly * 12;

    // 3. Penghasilan Neto Setahun
    const netYearly = Math.max(0, grossYearly - positionCostYearly - bpjsYearly);

    // 4. Penghasilan Kena Pajak (PKP) - Pembulatan ke bawah ribuan penuh
    const rawPkp = Math.max(0, netYearly - ptkpValue);
    const pkp = Math.floor(rawPkp / 1000) * 1000;

    // 5. Perhitungan Tarif Progresif PPh Pasal 17 UU HPP No. 7/2021
    let tax = 0;
    if (pkp > 0) {
      // Bracket 1: 0 s.d. 60 Juta (5%)
      const layer1 = Math.min(pkp, 60000000);
      tax += layer1 * 0.05;

      // Bracket 2: > 60 Juta s.d. 250 Juta (15%)
      if (pkp > 60000000) {
        const layer2 = Math.min(pkp - 60000000, 190000000);
        tax += layer2 * 0.15;
      }

      // Bracket 3: > 250 Juta s.d. 500 Juta (25%)
      if (pkp > 250000000) {
        const layer3 = Math.min(pkp - 250000000, 250000000);
        tax += layer3 * 0.25;
      }

      // Bracket 4: > 500 Juta s.d. 5 Miliar (30%)
      if (pkp > 500000000) {
        const layer4 = Math.min(pkp - 500000000, 4500000000);
        tax += layer4 * 0.30;
      }

      // Bracket 5: Di atas 5 Miliar (35%)
      if (pkp > 5000000000) {
        const layer5 = pkp - 5000000000;
        tax += layer5 * 0.35;
      }
    }

    // Penalti tanpa NPWP (Tarif 20% lebih tinggi)
    if (!hasNpwp) {
      tax = tax * 1.2;
    }

    const calculatedAnnualTax = Math.round(tax);
    const calculatedMonthlyTax = Math.round(calculatedAnnualTax / 12);
    const calculatedTakeHomePay = Math.round(grossMonthly - calculatedMonthlyTax - bpjsMonthly);
    const calculatedEffRate = grossYearly > 0 ? (calculatedAnnualTax / grossYearly) * 100 : 0;

    setAnnualGross(grossYearly);
    setAnnualPositionCost(positionCostYearly);
    setAnnualBpjs(bpjsYearly);
    setAnnualNet(netYearly);
    setPtkpAmount(ptkpValue);
    setPkpAmount(pkp);
    setAnnualTax(calculatedAnnualTax);
    setMonthlyTax(calculatedMonthlyTax);
    setMonthlyTakeHomePay(calculatedTakeHomePay);
    setEffectiveRate(parseFloat(calculatedEffRate.toFixed(2)));
  }, [monthlySalary, monthlyAllowance, ptkpStatus, hasNpwp, bpjsPercent]);

  React.useEffect(() => {
    calculatePph21();
  }, [calculatePph21]);

  const handleReset = () => {
    setMonthlySalary(null);
    setMonthlyAllowance(null);
    setPtkpStatus(null);
    setHasNpwp(null);
    setBpjsPercent(null);
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
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">Parameter Finansial PPh 21</h2>
                <p className="text-secondary text-sm">Hitung pajak penghasilan dan gaji bersih presisi standar UU HPP</p>
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
            <Input
              label="Gaji Pokok Bulanan (Gross)"
              type="number"
              min={0}
              step={500000}
              value={monthlySalary || ""}
              onChange={(e) => setMonthlySalary(Number(e.target.value))}
              prefix="Rp"
              helperText={`Nominal: ${formatCurrency(monthlySalary || 0)} / bulan`}
            />

            <Input
              label="Tunjangan Tetap / Bonus Bulanan"
              type="number"
              min={0}
              step={100000}
              value={monthlyAllowance || ""}
              onChange={(e) => setMonthlyAllowance(Number(e.target.value))}
              prefix="Rp"
              helperText={`Nominal: ${formatCurrency(monthlyAllowance || 0)} / bulan`}
            />

            <div className="sm:col-span-2">
              <Select
                label="Status PTKP (Penghasilan Tidak Kena Pajak)"
                value={ptkpStatus || "TK/0"}
                onChange={(e) => setPtkpStatus(e.target.value)}
                helperText={`Nilai PTKP: ${formatCurrency(ptkpAmount)} / tahun (${PTKP_RATES[ptkpStatus || "TK/0"]?.description || ""})`}
              >
                {Object.entries(PTKP_RATES).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </div>

            <Select
              label="Kepemilikan NPWP"
              value={hasNpwp ? "true" : "false"}
              onChange={(e) => setHasNpwp(e.target.value === "true")}
              helperText={hasNpwp ? "Tarif Standar UU HPP" : "Dikenakan tambahan tarif 20%"}
            >
              <option value="true">Memiliki NPWP / NIK Valid</option>
              <option value="false">Tidak Memiliki NPWP (+20%)</option>
            </Select>

            <Input
              label="Iuran JHT / Pensiun Karyawan"
              type="number"
              min={0}
              max={10}
              step={0.5}
              value={bpjsPercent ?? ""}
              onChange={(e) => setBpjsPercent(Number(e.target.value))}
              suffix="%"
              helperText="Pengurang Bruto (Standar JHT Karyawan: 2%)"
            />
          </div>

          <div className="pt-2">
            <Button onClick={calculatePph21} className="w-full sm:w-auto flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Hitung Pajak Presisi
            </Button>
          </div>
        </Card>
      </div>

      {/* Output & Breakdown Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <OutputBox
            label="Estimasi Pajak PPh 21 Bulanan"
            value={monthlyTax}
            prefix="Rp "
          />
          <OutputBox
            label="Estimasi Gaji Bersih (Take Home Pay)"
            value={monthlyTakeHomePay}
            prefix="Rp "
          />
        </div>

        <Card className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase border-b border-border pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" />
            Rincian Kalkulasi Pajak Tahunan
          </h3>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-secondary">Penghasilan Bruto Setahun:</span>
              <span className="font-mono text-primary font-medium">{formatCurrency(annualGross)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Biaya Jabatan (5% maks 6 Jt):</span>
              <span className="font-mono text-secondary font-medium">- {formatCurrency(annualPositionCost)}</span>
            </div>

            {annualBpjs > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-secondary">Iuran JHT/Pensiun Setahun:</span>
                <span className="font-mono text-secondary font-medium">- {formatCurrency(annualBpjs)}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-secondary">Penghasilan Neto Setahun:</span>
              <span className="font-mono text-primary font-medium">{formatCurrency(annualNet)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">PTKP ({ptkpStatus}):</span>
              <span className="font-mono text-secondary font-medium">- {formatCurrency(ptkpAmount)}</span>
            </div>

            <div className="flex justify-between items-center border-t border-border/50 pt-2">
              <span className="text-secondary font-medium">PKP (Penghasilan Kena Pajak):</span>
              <span className="font-mono text-primary font-bold">{formatCurrency(pkpAmount)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">PPh 21 Terutang Setahun:</span>
              <span className="font-mono text-warning font-semibold">{formatCurrency(annualTax)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Tarif Efektif Pajak (ETR):</span>
              <span className="font-mono text-accent font-semibold">{effectiveRate}%</span>
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-center font-semibold">
              <span className="text-primary">Take Home Pay Bulanan:</span>
              <span className="font-mono text-accent text-base">{formatCurrency(monthlyTakeHomePay)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
