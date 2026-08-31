"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import { Tag, RefreshCw, Calculator, Percent, ShieldCheck, TrendingDown } from "lucide-react";
import { useQueryState, parseAsFloat } from "nuqs";

export function DiscountCalculator() {
  // State Input (URL Synced via nuqs)
  const [initialPrice, setInitialPrice] = useQueryState("price", parseAsFloat.withDefault(500000));
  const [discountPercent, setDiscountPercent] = useQueryState("discount", parseAsFloat.withDefault(20));
  const [secondaryDiscount, setSecondaryDiscount] = useQueryState("discount2", parseAsFloat.withDefault(0));
  const [taxPercent, setTaxPercent] = useQueryState("tax", parseAsFloat.withDefault(0));

  // State Output
  const [finalPrice, setFinalPrice] = React.useState<number>(0);
  const [totalSavings, setTotalSavings] = React.useState<number>(0);
  const [effectiveDiscount, setEffectiveDiscount] = React.useState<number>(0);
  const [priceAfterFirstDiscount, setPriceAfterFirstDiscount] = React.useState<number>(0);
  const [taxAmount, setTaxAmount] = React.useState<number>(0);

  const calculateDiscount = React.useCallback(() => {
    const rawPrice = Math.max(0, initialPrice || 0);
    const d1 = Math.min(100, Math.max(0, discountPercent || 0));
    const d2 = Math.min(100, Math.max(0, secondaryDiscount || 0));
    const tax = Math.max(0, taxPercent || 0);

    if (rawPrice === 0) {
      setFinalPrice(0);
      setTotalSavings(0);
      setEffectiveDiscount(0);
      setPriceAfterFirstDiscount(0);
      setTaxAmount(0);
      return;
    }

    // 1. Kalkulasi Diskon Pertama
    const firstDiscountAmount = rawPrice * (d1 / 100);
    const afterFirst = rawPrice - firstDiscountAmount;

    // 2. Kalkulasi Diskon Bertingkat (Tiered / Double Discount)
    const secondDiscountAmount = afterFirst * (d2 / 100);
    const afterSecond = afterFirst - secondDiscountAmount;

    // 3. Total Penghematan & Persentase Diskon Efektif
    const totalDiscountAmount = firstDiscountAmount + secondDiscountAmount;
    const effectivePct = rawPrice > 0 ? (totalDiscountAmount / rawPrice) * 100 : 0;

    // 4. Kalkulasi Pajak (PPN jika berlaku) terhadap harga setelah diskon
    const calculatedTax = afterSecond * (tax / 100);
    const totalFinal = afterSecond + calculatedTax;

    setPriceAfterFirstDiscount(Math.round(afterFirst));
    setTotalSavings(Math.round(totalDiscountAmount));
    setEffectiveDiscount(Number(effectivePct.toFixed(2)));
    setTaxAmount(Math.round(calculatedTax));
    setFinalPrice(Math.round(totalFinal));
  }, [initialPrice, discountPercent, secondaryDiscount, taxPercent]);

  // Otomatis kalkulasi real-time saat parameter URL atau input berubah
  React.useEffect(() => {
    calculateDiscount();
  }, [calculateDiscount]);

  const handleReset = () => {
    setInitialPrice(null);
    setDiscountPercent(null);
    setSecondaryDiscount(null);
    setTaxPercent(null);
  };

  const handlePresetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val)) {
      setDiscountPercent(val);
    }
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
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">Parameter Finansial Diskon</h2>
                <p className="text-secondary text-sm">Konfigurasi harga bruto, persentase potongan, dan skema pajak</p>
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
              label="Harga Awal (Bruto)"
              type="number"
              min={0}
              step={10000}
              value={initialPrice ?? ""}
              onChange={(e) => setInitialPrice(e.target.value === "" ? null : Number(e.target.value))}
              prefix="Rp"
              helperText={`Nominal: ${formatCurrency(initialPrice || 0)}`}
            />

            <Select
              label="Preset Diskon Populer"
              onChange={handlePresetSelect}
              value={discountPercent || 0}
              helperText="Pilih skema standar industri atau ketik manual"
            >
              <option value="5">Diskon 5%</option>
              <option value="10">Diskon 10% (Promo Standar)</option>
              <option value="15">Diskon 15%</option>
              <option value="20">Diskon 20% (Komersial B2B)</option>
              <option value="25">Diskon 25%</option>
              <option value="30">Diskon 30%</option>
              <option value="50">Diskon 50% (Mid-Season Sale)</option>
              <option value="70">Diskon 70% (Clearance Sale)</option>
            </Select>

            <Input
              label="Persen Diskon Utama"
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={discountPercent ?? ""}
              onChange={(e) => setDiscountPercent(e.target.value === "" ? null : Number(e.target.value))}
              suffix="%"
              helperText="Potongan harga primer"
            />

            <Input
              label="Diskon Tambahan (Ganda / Tier 2)"
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={secondaryDiscount ?? ""}
              onChange={(e) => setSecondaryDiscount(e.target.value === "" ? null : Number(e.target.value))}
              suffix="%"
              helperText="Contoh skema promo bertingkat (50% + 20%)"
            />

            <Input
              label="Pajak Pertambahan Nilai (PPN)"
              type="number"
              min={0}
              max={100}
              step={1}
              value={taxPercent ?? ""}
              onChange={(e) => setTaxPercent(e.target.value === "" ? null : Number(e.target.value))}
              suffix="%"
              helperText="Standar PPN di Indonesia: 11% (Opsional)"
            />
          </div>

          <div className="pt-2">
            <Button onClick={calculateDiscount} className="w-full sm:w-auto flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Hitung Harga Akhir Presisi
            </Button>
          </div>
        </Card>
      </div>

      {/* Output & Breakdown Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <OutputBox
          label="Harga Akhir yang Harus Dibayar"
          value={finalPrice}
          prefix="Rp "
        />

        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase">
              Rincian Efisiensi & Penghematan
            </h3>
            <span className="flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <TrendingDown className="w-3 h-3" />
              Hemat {effectiveDiscount}%
            </span>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-secondary">Harga Awal (Bruto):</span>
              <span className="font-mono text-primary font-medium">{formatCurrency(initialPrice || 0)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Diskon Utama ({discountPercent || 0}%):</span>
              <span className="font-mono text-emerald-400 font-medium">
                - {formatCurrency((initialPrice || 0) * ((discountPercent || 0) / 100))}
              </span>
            </div>

            {(secondaryDiscount || 0) > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-secondary">Diskon Tambahan ({secondaryDiscount}% dari sisa):</span>
                <span className="font-mono text-emerald-400 font-medium">
                  - {formatCurrency(priceAfterFirstDiscount * ((secondaryDiscount || 0) / 100))}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center border-t border-border/50 pt-2">
              <span className="text-secondary font-medium">Total Nilai yang Dihemat:</span>
              <span className="font-mono text-emerald-400 font-semibold">{formatCurrency(totalSavings)}</span>
            </div>

            {(taxPercent || 0) > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-secondary">PPN ({taxPercent}%):</span>
                <span className="font-mono text-warning font-medium">+ {formatCurrency(taxAmount)}</span>
              </div>
            )}

            <div className="pt-3 border-t border-border flex justify-between items-center font-semibold">
              <span className="text-primary">Harga Netto Akhir:</span>
              <span className="font-mono text-accent text-lg">{formatCurrency(finalPrice)}</span>
            </div>
          </div>
        </Card>

        {/* Security & Industry Badge */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            Perhitungan mematuhi standar industri akuntansi komersial. Data parameter teknis dihitung secara presisi dan sinkron real-time ke parameter URL.
          </p>
        </div>
      </div>
    </div>
  );
}
