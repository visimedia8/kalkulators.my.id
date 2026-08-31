"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Calculator, RefreshCw, Home } from "lucide-react";
import { useQueryState, parseAsFloat } from "nuqs";

export function KprCalculator() {
  // State Input (URL Synced)
  const [propertyPrice, setPropertyPrice] = useQueryState("price", parseAsFloat.withDefault(500000000));
  const [dpPercent, setDpPercent] = useQueryState("dp", parseAsFloat.withDefault(20));
  const [annualInterestRate, setAnnualInterestRate] = useQueryState("rate", parseAsFloat.withDefault(5.5));
  const [tenorYears, setTenorYears] = useQueryState("tenor", parseAsFloat.withDefault(15));

  // State Output
  const [monthlyInstallment, setMonthlyInstallment] = React.useState<number>(0);
  const [dpAmount, setDpAmount] = React.useState<number>(0);
  const [principalLoan, setPrincipalLoan] = React.useState<number>(0);
  const [totalInterest, setTotalInterest] = React.useState<number>(0);
  const [totalPayment, setTotalPayment] = React.useState<number>(0);

  const calculateKPR = React.useCallback(() => {
    const price = Math.max(0, propertyPrice || 0);
    const dpPct = Math.min(100, Math.max(0, dpPercent || 0));
    const annualRate = Math.max(0, annualInterestRate || 0);
    const tenor = Math.max(0, tenorYears || 0);

    const calculatedDp = price * (dpPct / 100);
    const principal = price - calculatedDp;
    const totalMonths = tenor * 12;

    setDpAmount(calculatedDp);
    setPrincipalLoan(principal);

    if (totalMonths <= 0 || principal <= 0) {
      setMonthlyInstallment(0);
      setTotalInterest(0);
      setTotalPayment(0);
      return;
    }

    let monthly = 0;
    if (annualRate === 0) {
      monthly = principal / totalMonths;
    } else {
      const monthlyRate = annualRate / 100 / 12;
      const compoundFactor = Math.pow(1 + monthlyRate, totalMonths);
      monthly = principal * (monthlyRate * compoundFactor) / (compoundFactor - 1);
    }

    const calculatedTotalPayment = monthly * totalMonths;
    const calculatedTotalInterest = calculatedTotalPayment - principal;

    setMonthlyInstallment(Math.round(monthly));
    setTotalInterest(Math.max(0, Math.round(calculatedTotalInterest)));
    setTotalPayment(Math.round(calculatedTotalPayment));
  }, [propertyPrice, dpPercent, annualInterestRate, tenorYears]);

  // Auto calculate on initial load & dependency changes
  React.useEffect(() => {
    calculateKPR();
  }, [calculateKPR]);

  const handleReset = () => {
    setPropertyPrice(null);
    setDpPercent(null);
    setAnnualInterestRate(null);
    setTenorYears(null);
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
      {/* Form Input Section */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">Parameter Finansial KPR</h2>
                <p className="text-secondary text-sm">Masukkan data properti dan skema pinjaman Anda</p>
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
              label="Harga Properti"
              type="number"
              min={0}
              step={1000000}
              value={propertyPrice || ""}
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
              prefix="Rp"
              helperText={`Nominal: ${formatCurrency(propertyPrice || 0)}`}
            />

            <Input
              label="Uang Muka (DP)"
              type="number"
              min={0}
              max={100}
              step={1}
              value={dpPercent || ""}
              onChange={(e) => setDpPercent(Number(e.target.value))}
              suffix="%"
              helperText={`Nominal DP: ${formatCurrency(dpAmount)}`}
            />

            <Input
              label="Suku Bunga Tahunan"
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={annualInterestRate || ""}
              onChange={(e) => setAnnualInterestRate(Number(e.target.value))}
              suffix="%"
              helperText="Per tahun (Fixed/Floating)"
            />

            <Input
              label="Tenor Pinjaman"
              type="number"
              min={1}
              max={40}
              step={1}
              value={tenorYears || ""}
              onChange={(e) => setTenorYears(Number(e.target.value))}
              suffix="Tahun"
              helperText={`${(tenorYears || 0) * 12} Bulan Pembayaran`}
            />
          </div>

          <div className="pt-2">
            <Button onClick={calculateKPR} className="w-full sm:w-auto flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Hitung Cicilan Presisi
            </Button>
          </div>
        </Card>
      </div>

      {/* Output & Breakdown Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <OutputBox
          label="Estimasi Cicilan Bulanan"
          value={monthlyInstallment}
          prefix="Rp "
        />

        <Card className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase border-b border-border pb-2">
            Rincian Amortisasi Pinjaman
          </h3>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-secondary">Harga Properti:</span>
              <span className="font-mono text-primary font-medium">{formatCurrency(propertyPrice || 0)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Uang Muka ({dpPercent}%):</span>
              <span className="font-mono text-primary font-medium">{formatCurrency(dpAmount)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Pokok Pinjaman (Plafon):</span>
              <span className="font-mono text-primary font-medium">{formatCurrency(principalLoan)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Total Bunga ({annualInterestRate}% / {tenorYears} Thn):</span>
              <span className="font-mono text-warning font-medium">{formatCurrency(totalInterest)}</span>
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-center font-semibold">
              <span className="text-primary">Total Pembayaran:</span>
              <span className="font-mono text-accent text-base">{formatCurrency(totalPayment)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
