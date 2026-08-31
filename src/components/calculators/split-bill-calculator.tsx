"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Users,
  Receipt,
  Calculator,
  RefreshCw,
  Share2,
  Check,
  ShieldCheck,
  Percent,
  Coins,
  CreditCard,
  UserCheck,
} from "lucide-react";
import { useQueryState, parseAsFloat, parseAsInteger, parseAsString } from "nuqs";

export const RESTO_PRESETS: Record<
  string,
  { label: string; pajak: number; servis: number }
> = {
  resto_modern: {
    label: "Restoran Mall / Kafe Modern (PPN 11% + Servis 5%)",
    pajak: 11,
    servis: 5,
  },
  pb1_standard: {
    label: "Restoran Standar PB1 (PB1 10% + Servis 5%)",
    pajak: 10,
    servis: 5,
  },
  fine_dining: {
    label: "Fine Dining / Hotel Lounge (PB1 10% + Servis 8%)",
    pajak: 10,
    servis: 8,
  },
  fast_food: {
    label: "Restoran Cepat Saji (PB1 10% / Tanpa Servis)",
    pajak: 10,
    servis: 0,
  },
  no_tax_service: {
    label: "Kedai / Warung Kopi (Tanpa Pajak & Servis)",
    pajak: 0,
    servis: 0,
  },
  custom: {
    label: "Kustom (Input Manual)",
    pajak: 11,
    servis: 5,
  },
};

export function SplitBillCalculator() {
  // Query States (nuqs URL Query State Synchronization)
  const [totalTagihan, setTotalTagihan] = useQueryState(
    "totalTagihan",
    parseAsFloat.withDefault(350000)
  );
  const [diskon, setDiskon] = useQueryState(
    "diskon",
    parseAsFloat.withDefault(0)
  );
  const [diskonTipe, setDiskonTipe] = useQueryState(
    "diskonTipe",
    parseAsString.withDefault("percent")
  );
  const [pajak, setPajak] = useQueryState(
    "pajak",
    parseAsFloat.withDefault(11)
  );
  const [servis, setServis] = useQueryState(
    "servis",
    parseAsFloat.withDefault(5)
  );
  const [jumlahOrang, setJumlahOrang] = useQueryState(
    "jumlahOrang",
    parseAsInteger.withDefault(4)
  );

  // Preset Selection State
  const [selectedPreset, setSelectedPreset] = React.useState<string>("resto_modern");
  const [isCopied, setIsCopied] = React.useState<boolean>(false);

  // Calculation Output States
  const [tagihanBruto, setTagihanBruto] = React.useState<number>(0);
  const [nominalDiskon, setNominalDiskon] = React.useState<number>(0);
  const [tagihanBersih, setTagihanBersih] = React.useState<number>(0);
  const [nominalPajak, setNominalPajak] = React.useState<number>(0);
  const [nominalServis, setNominalServis] = React.useState<number>(0);
  const [totalAkhir, setTotalAkhir] = React.useState<number>(0);
  const [nominalPerOrang, setNominalPerOrang] = React.useState<number>(0);

  const calculateSplitBill = React.useCallback(() => {
    const rawTagihan = Math.max(0, totalTagihan ?? 0);
    const rawDiskon = Math.max(0, diskon ?? 0);
    const rawPajak = Math.max(0, pajak ?? 0);
    const rawServis = Math.max(0, servis ?? 0);
    const rawOrang = Math.max(1, jumlahOrang ?? 1);

    // 1. Kalkulasi Diskon (Persen atau Nominal Tunai)
    let discountAmount = 0;
    if (diskonTipe === "nominal") {
      discountAmount = Math.min(rawTagihan, rawDiskon);
    } else {
      const pct = Math.min(100, rawDiskon);
      discountAmount = rawTagihan * (pct / 100);
    }

    // 2. Tagihan Bersih (Dasar Pengenaan Pajak / DPP)
    const netBill = Math.max(0, rawTagihan - discountAmount);

    // 3. Pajak Resto (PPN / PB1) dan Service Charge terhadap Tagihan Bersih
    const taxAmount = netBill * (rawPajak / 100);
    const serviceAmount = netBill * (rawServis / 100);

    // 4. Total Akhir dan Nominal Patungan Per Orang
    const finalTotal = netBill + taxAmount + serviceAmount;
    const perPerson = rawOrang > 0 ? finalTotal / rawOrang : 0;

    setTagihanBruto(rawTagihan);
    setNominalDiskon(Math.round(discountAmount));
    setTagihanBersih(Math.round(netBill));
    setNominalPajak(Math.round(taxAmount));
    setNominalServis(Math.round(serviceAmount));
    setTotalAkhir(Math.round(finalTotal));
    setNominalPerOrang(Math.round(perPerson));
  }, [totalTagihan, diskon, diskonTipe, pajak, servis, jumlahOrang]);

  // Reactive calculation on parameter change
  React.useEffect(() => {
    calculateSplitBill();
  }, [calculateSplitBill]);

  const handlePresetChange = (presetKey: string) => {
    setSelectedPreset(presetKey);
    if (presetKey !== "custom" && RESTO_PRESETS[presetKey]) {
      setPajak(RESTO_PRESETS[presetKey].pajak);
      setServis(RESTO_PRESETS[presetKey].servis);
    }
  };

  const handleQuickPeoplePick = (count: number) => {
    setJumlahOrang(count);
  };

  const handleReset = () => {
    setTotalTagihan(null);
    setDiskon(null);
    setDiskonTipe(null);
    setPajak(null);
    setServis(null);
    setJumlahOrang(null);
    setSelectedPreset("resto_modern");
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
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
      {/* Parameter Input Section */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Tagihan & Patungan
                </h2>
                <p className="text-secondary text-sm">
                  Hitung split bill presisi dengan potongan promo, pajak resto, dan service charge
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke konfigurasi default"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Preset Skema Pajak Restoran */}
            <div className="sm:col-span-2">
              <Select
                label="Preset Skema Restoran & Pajak"
                value={selectedPreset}
                onChange={(e) => handlePresetChange(e.target.value)}
                helperText="Pilih standar industri restoran atau sesuaikan parameter teknis secara manual"
              >
                {Object.entries(RESTO_PRESETS).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Total Tagihan Kotor */}
            <div className="sm:col-span-2">
              <Input
                label="Total Tagihan Struk (Kotor / Bruto)"
                type="number"
                min={0}
                step={10000}
                value={totalTagihan ?? ""}
                onChange={(e) =>
                  setTotalTagihan(e.target.value === "" ? null : Number(e.target.value))
                }
                prefix="Rp"
                helperText={`Nominal terbaca: ${formatCurrency(totalTagihan || 0)}`}
              />
            </div>

            {/* Tipe Diskon Promo */}
            <Select
              label="Bentuk Diskon Restoran"
              value={diskonTipe ?? "percent"}
              onChange={(e) => setDiskonTipe(e.target.value)}
              helperText="Pilih diskon persentase promo atau potongan voucher tunai"
            >
              <option value="percent">Persentase Promo (%)</option>
              <option value="nominal">Nominal Voucher Tunai (Rp)</option>
            </Select>

            {/* Nilai Diskon */}
            <Input
              label={
                diskonTipe === "nominal"
                  ? "Nominal Potongan Diskon"
                  : "Persentase Diskon Promo"
              }
              type="number"
              min={0}
              max={diskonTipe === "percent" ? 100 : undefined}
              step={diskonTipe === "percent" ? 1 : 5000}
              value={diskon ?? ""}
              onChange={(e) =>
                setDiskon(e.target.value === "" ? null : Number(e.target.value))
              }
              prefix={diskonTipe === "nominal" ? "Rp" : undefined}
              suffix={diskonTipe === "percent" ? "%" : undefined}
              helperText={
                diskonTipe === "nominal"
                  ? `Hemat: ${formatCurrency(nominalDiskon)}`
                  : `Potongan: ${formatCurrency(nominalDiskon)}`
              }
            />

            {/* Pajak Restoran */}
            <Input
              label="Pajak Restoran (PPN / PB1)"
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={pajak ?? ""}
              onChange={(e) => {
                setSelectedPreset("custom");
                setPajak(e.target.value === "" ? null : Number(e.target.value));
              }}
              suffix="%"
              helperText="Standar PB1 daerah: 10% | PPN: 11%"
            />

            {/* Service Charge */}
            <Input
              label="Biaya Layanan (Service Charge)"
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={servis ?? ""}
              onChange={(e) => {
                setSelectedPreset("custom");
                setServis(e.target.value === "" ? null : Number(e.target.value));
              }}
              suffix="%"
              helperText="Biaya servis restoran (umumnya 5% - 10%)"
            />

            {/* Jumlah Orang Patungan */}
            <div className="sm:col-span-2 flex flex-col gap-2.5">
              <Input
                label="Jumlah Orang Patungan (Split Count)"
                type="number"
                min={1}
                step={1}
                value={jumlahOrang ?? ""}
                onChange={(e) =>
                  setJumlahOrang(e.target.value === "" ? null : Math.max(1, Number(e.target.value)))
                }
                suffix="Orang"
                helperText={`Dibagi rata ke ${jumlahOrang || 1} anggota rombongan`}
              />

              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-xs text-secondary font-medium mr-1">Opsi Cepat:</span>
                {[2, 3, 4, 5, 6, 8, 10].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => handleQuickPeoplePick(count)}
                    className={`px-3 py-1 text-xs font-mono font-medium rounded-lg border transition-all duration-150 ${
                      jumlahOrang === count
                        ? "bg-accent text-white border-accent shadow-sm"
                        : "bg-base text-secondary border-border hover:bg-elevated hover:text-primary"
                    }`}
                  >
                    {count} org
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border/50 flex flex-col sm:flex-row items-center gap-3">
            <Button
              onClick={calculateSplitBill}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Hitung Split Bill Presisi
            </Button>

            <Button
              variant="secondary"
              onClick={handleCopyLink}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Tautan Tersalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Salin Tautan Patungan</span>
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Output & Audit Breakdown Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4">
          <OutputBox
            label="Total Tagihan Akhir yang Harus Dibayar"
            value={totalAkhir}
            prefix="Rp "
          />
          <OutputBox
            label={`Nominal Patungan Per Orang (${jumlahOrang || 1} Orang)`}
            value={nominalPerOrang}
            prefix="Rp "
          />
        </div>

        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-accent" />
              Rincian Audit Struk & Patungan
            </h3>
            <span className="flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <UserCheck className="w-3.5 h-3.5" />
              {jumlahOrang || 1} Porsi Rata
            </span>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-secondary">Subtotal Struk (Bruto):</span>
              <span className="font-mono text-primary font-medium">
                {formatCurrency(tagihanBruto)}
              </span>
            </div>

            {nominalDiskon > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-secondary">
                  Potongan Diskon Promo ({diskonTipe === "percent" ? `${diskon}%` : "Voucher"}):
                </span>
                <span className="font-mono text-emerald-400 font-medium">
                  - {formatCurrency(nominalDiskon)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center border-t border-border/40 pt-2">
              <span className="text-secondary font-medium">Tagihan Bersih (DPP):</span>
              <span className="font-mono text-primary font-semibold">
                {formatCurrency(tagihanBersih)}
              </span>
            </div>

            {(pajak ?? 0) > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-secondary">Pajak Restoran ({pajak}%):</span>
                <span className="font-mono text-amber-400 font-medium">
                  + {formatCurrency(nominalPajak)}
                </span>
              </div>
            )}

            {(servis ?? 0) > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-secondary">Service Charge ({servis}%):</span>
                <span className="font-mono text-sky-400 font-medium">
                  + {formatCurrency(nominalServis)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center border-t border-border/50 pt-2">
              <span className="text-primary font-semibold">Total Tagihan Final:</span>
              <span className="font-mono text-accent font-bold text-base">
                {formatCurrency(totalAkhir)}
              </span>
            </div>

            <div className="pt-2 border-t border-border flex justify-between items-center bg-elevated/40 p-3 rounded-xl">
              <div>
                <span className="text-xs text-secondary block">Iuran Per Orang:</span>
                <span className="font-semibold text-primary text-sm">
                  Dibagi {jumlahOrang || 1} orang
                </span>
              </div>
              <span className="font-mono text-emerald-400 text-lg font-bold">
                {formatCurrency(nominalPerOrang)}
              </span>
            </div>
          </div>
        </Card>

        {/* Security & Lexicon Compliance Badge */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            Perhitungan mematuhi standar industri akuntansi komersial restoran dan kafe. Parameter teknis terkalibrasi secara presisi dan sinkron real-time ke URL peramban Anda.
          </p>
        </div>
      </div>
    </div>
  );
}