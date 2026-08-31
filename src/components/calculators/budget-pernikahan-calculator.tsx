"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Utensils,
  Building2,
  Palette,
  Camera,
  Shirt,
  ShieldAlert,
  Wallet,
  PieChart,
  RotateCcw,
  Calculator,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
} from "lucide-react";
import { useQueryState, parseAsFloat } from "nuqs";
import { cn } from "@/lib/utils";

interface BudgetItem {
  id: string;
  name: string;
  percentage: number;
  nominal: number;
  icon: React.ElementType;
  color: string;
  bgLight: string;
  description: string;
}

export function BudgetPernikahanCalculator() {
  // 1. State Input tersinkronisasi URL via nuqs
  const [totalBudget, setTotalBudget] = useQueryState(
    "totalBudget",
    parseAsFloat.withDefault(100000000)
  );

  // 2. Computed States
  const [allocations, setAllocations] = React.useState<BudgetItem[]>([]);
  const [cateringAmount, setCateringAmount] = React.useState<number>(0);

  // 3. Logika Perhitungan Presisi Berbasis Standar Industri Wedding Organizer
  const calculateBudget = React.useCallback(() => {
    const budget = Math.max(0, totalBudget ?? 0);

    const catering = Math.round(budget * 0.40);
    const venue = Math.round(budget * 0.15);
    const dekorasi = Math.round(budget * 0.15);
    const dokumentasi = Math.round(budget * 0.10);
    const busanaMua = Math.round(budget * 0.10);
    const darurat = Math.round(budget * 0.10);

    setCateringAmount(catering);

    const items: BudgetItem[] = [
      {
        id: "catering",
        name: "Katering & Konsumsi",
        percentage: 40,
        nominal: catering,
        icon: Utensils,
        color: "text-amber-400",
        bgLight: "bg-amber-500/10",
        description: "Buffet utama, pondokan/food stall, minuman, dan konsumsi panitia/keluarga.",
      },
      {
        id: "venue",
        name: "Gedung & Lokasi Venue",
        percentage: 15,
        nominal: venue,
        icon: Building2,
        color: "text-blue-400",
        bgLight: "bg-blue-500/10",
        description: "Sewa aula, ballroom, fasilitas listrik/genset, kebersihan, dan izin keramaian.",
      },
      {
        id: "dekorasi",
        name: "Dekorasi & Pelaminan",
        percentage: 15,
        nominal: dekorasi,
        icon: Palette,
        color: "text-purple-400",
        bgLight: "bg-purple-500/10",
        description: "Pelaminan, lorong masuk (aisle), photobooth, tata lampu (lighting), & bunga segar.",
      },
      {
        id: "dokumentasi",
        name: "Dokumentasi (Foto & Video)",
        percentage: 10,
        nominal: dokumentasi,
        icon: Camera,
        color: "text-emerald-400",
        bgLight: "bg-emerald-500/10",
        description: "Fotografer, videografer sinematik, album cetak kolase, & teaser video akad/resepsi.",
      },
      {
        id: "busana-mua",
        name: "Busana & Rias Pengantin (MUA)",
        percentage: 10,
        nominal: busanaMua,
        icon: Shirt,
        color: "text-rose-400",
        bgLight: "bg-rose-500/10",
        description: "Baju akad & resepsi, makeup pengantin, busana orang tua, & seragam penerima tamu.",
      },
      {
        id: "darurat",
        name: "Dana Darurat & Pos Lainnya",
        percentage: 10,
        nominal: darurat,
        icon: ShieldAlert,
        color: "text-orange-400",
        bgLight: "bg-orange-500/10",
        description: "Administrasi KUA, suvenir, undangan cetak/digital, sound system, & contingency fund.",
      },
    ];

    setAllocations(items);
  }, [totalBudget]);

  React.useEffect(() => {
    calculateBudget();
  }, [calculateBudget]);

  const handleReset = () => {
    setTotalBudget(100000000);
  };

  const handlePresetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val) && val > 0) {
      setTotalBudget(val);
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
      {/* Kolom Kiri: Form Input Parameter Anggaran */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Anggaran Pernikahan
                </h2>
                <p className="text-secondary text-sm">
                  Masukkan total dana yang disiapkan untuk resepsi & akad
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke nilai default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="flex flex-col gap-5">
            <Select
              label="Preset Skala Pernikahan"
              onChange={handlePresetSelect}
              defaultValue="100000000"
              helperText="Pilih simulasi standar industri atau masukkan nominal kustom"
            >
              <option value="50000000">Intimate Wedding / Sederhana (Rp 50 Juta)</option>
              <option value="100000000">Standard Ballroom / Gedung Aula (Rp 100 Juta)</option>
              <option value="200000000">Medium Luxury / Hotel Bintang Tiga (Rp 200 Juta)</option>
              <option value="350000000">Exclusive Celebration (Rp 350 Juta)</option>
              <option value="500000000">Grand Luxury Ballroom (Rp 500 Juta)</option>
            </Select>

            <Input
              label="Total Anggaran Pernikahan (Rp)"
              type="number"
              min={10000000}
              step={5000000}
              value={totalBudget ?? ""}
              onChange={(e) =>
                setTotalBudget(e.target.value === "" ? null : Math.max(0, Number(e.target.value)))
              }
              prefix="Rp"
              helperText={`Nominal Terbaca: ${formatCurrency(totalBudget || 0)}`}
            />

            <div className="pt-2">
              <Button
                onClick={calculateBudget}
                className="w-full flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                Hitung Alokasi Presisi
              </Button>
            </div>
          </div>
        </Card>

        {/* Technical Assurance Card */}
        <Card className="bg-surface/50 border-border/60 text-secondary text-xs leading-relaxed flex items-start gap-3 p-4">
          <ShieldCheck className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-primary block mb-0.5">
              Standar Industri Wedding Organizer
            </span>
            Formulasi alokasi mengacu pada rasio persentase baku industri pernikahan Indonesia: Katering (40%), Gedung (15%), Dekorasi (15%), Dokumentasi (10%), Busana & MUA (10%), serta Dana Darurat (10%) untuk mencegah defisit anggaran pada saat eksekusi acara.
          </div>
        </Card>
      </div>

      {/* Kolom Kanan: Output & Rincian Alokasi Finansial */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <OutputBox
            label="Total Anggaran Pernikahan"
            value={totalBudget || 0}
            prefix="Rp "
          />
          <OutputBox
            label="Alokasi Katering (40%)"
            value={cateringAmount}
            prefix="Rp "
          />
        </div>

        {/* Matriks Rincian Pos Pengeluaran */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-accent" />
              Distribusi 6 Pos Anggaran Utama
            </h3>
            <span className="text-xs font-mono text-secondary">
              Total Rasio: 100%
            </span>
          </div>

          <div className="flex flex-col gap-4 text-sm">
            {allocations.map((item) => {
              const IconComp = item.icon;
              return (
                <div key={item.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("p-1.5 rounded-md", item.bgLight, item.color)}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-primary text-xs font-semibold block">{item.name}</span>
                        <span className="text-[11px] text-secondary leading-tight line-clamp-1">
                          {item.description}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0 ml-2">
                      <span className="font-mono text-xs font-semibold text-primary">
                        {formatCurrency(item.nominal)}
                      </span>
                      <span className="text-[11px] font-mono text-accent">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                  {/* Visual Allocation Bar */}
                  <div className="w-full bg-base rounded-full h-1.5 overflow-hidden border border-border/40">
                    <div
                      className="bg-accent h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="pt-3 border-t border-border flex justify-between items-center font-semibold">
              <span className="text-primary text-sm flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-accent" />
                Total Realisasi Alokasi:
              </span>
              <span className="font-mono text-accent text-lg">
                {formatCurrency(totalBudget || 0)}
              </span>
            </div>
          </div>
        </Card>

        {/* Real-time State Synchronization Card */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            Parameter tersinkronisasi secara <span className="text-primary font-medium">real-time</span> melalui URL query. Bagikan tautan peramban ini kepada pasangan, keluarga, atau Wedding Organizer untuk mendiskusikan rancangan anggaran pernikahan secara presisi.
          </p>
        </div>
      </div>
    </div>
  );
}