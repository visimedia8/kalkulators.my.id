"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Plane,
  Hotel,
  Utensils,
  Car,
  Ticket,
  Calendar,
  RotateCcw,
  Calculator,
  ShieldCheck,
  Wallet,
  PieChart,
  TrendingUp,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useQueryState, parseAsFloat } from "nuqs";
import { cn } from "@/lib/utils";

interface CostAllocation {
  name: string;
  nominal: number;
  percentage: number;
  icon: React.ElementType;
  color: string;
  bgLight: string;
}

export function ItineraryBudgetCalculator() {
  // 1. State Input tersinkronisasi URL via nuqs
  const [hari, setHari] = useQueryState("hari", parseAsFloat.withDefault(4));
  const [tiket, setTiket] = useQueryState("tiket", parseAsFloat.withDefault(1500000));
  const [hotel, setHotel] = useQueryState("hotel", parseAsFloat.withDefault(500000));
  const [makan, setMakan] = useQueryState("makan", parseAsFloat.withDefault(200000));
  const [transport, setTransport] = useQueryState("transport", parseAsFloat.withDefault(100000));
  const [wisata, setWisata] = useQueryState("wisata", parseAsFloat.withDefault(300000));

  // 2. Output & Computed States
  const [totalBudget, setTotalBudget] = React.useState<number>(0);
  const [dailyAverage, setDailyAverage] = React.useState<number>(0);
  const [totalMalam, setTotalMalam] = React.useState<number>(0);
  const [totalHotelCost, setTotalHotelCost] = React.useState<number>(0);
  const [totalMakanCost, setTotalMakanCost] = React.useState<number>(0);
  const [totalTransportCost, setTotalTransportCost] = React.useState<number>(0);
  const [allocations, setAllocations] = React.useState<CostAllocation[]>([]);

  // 3. Logika Perhitungan Presisi
  const calculateBudget = React.useCallback(() => {
    const dHari = Math.max(1, Math.floor(hari ?? 1));
    const dTiket = Math.max(0, tiket ?? 0);
    const dHotel = Math.max(0, hotel ?? 0);
    const dMakan = Math.max(0, makan ?? 0);
    const dTransport = Math.max(0, transport ?? 0);
    const dWisata = Math.max(0, wisata ?? 0);

    const nights = Math.max(0, dHari - 1);
    const costHotel = dHotel * nights;
    const costMakan = dMakan * dHari;
    const costTransport = dTransport * dHari;

    // Total Budget = Tiket PP + (Hotel x (Hari - 1)) + (Makan x Hari) + (Transport x Hari) + Wisata
    const total = dTiket + costHotel + costMakan + costTransport + dWisata;
    const avgPerDay = dHari > 0 ? Math.round(total / dHari) : 0;

    setTotalMalam(nights);
    setTotalHotelCost(costHotel);
    setTotalMakanCost(costMakan);
    setTotalTransportCost(costTransport);
    setTotalBudget(total);
    setDailyAverage(avgPerDay);

    // Hitung proporsi persentase alokasi biaya
    if (total > 0) {
      setAllocations([
        {
          name: "Transportasi Utama (PP)",
          nominal: dTiket,
          percentage: Number(((dTiket / total) * 100).toFixed(1)),
          icon: Plane,
          color: "text-blue-400",
          bgLight: "bg-blue-500/10",
        },
        {
          name: `Akomodasi (${nights} Malam)`,
          nominal: costHotel,
          percentage: Number(((costHotel / total) * 100).toFixed(1)),
          icon: Hotel,
          color: "text-indigo-400",
          bgLight: "bg-indigo-500/10",
        },
        {
          name: `Konsumsi & Makan (${dHari} Hari)`,
          nominal: costMakan,
          percentage: Number(((costMakan / total) * 100).toFixed(1)),
          icon: Utensils,
          color: "text-amber-400",
          bgLight: "bg-amber-500/10",
        },
        {
          name: `Transportasi Lokal (${dHari} Hari)`,
          nominal: costTransport,
          percentage: Number(((costTransport / total) * 100).toFixed(1)),
          icon: Car,
          color: "text-emerald-400",
          bgLight: "bg-emerald-500/10",
        },
        {
          name: "Tiket Wisata & Rekreasi",
          nominal: dWisata,
          percentage: Number(((dWisata / total) * 100).toFixed(1)),
          icon: Ticket,
          color: "text-purple-400",
          bgLight: "bg-purple-500/10",
        },
      ]);
    } else {
      setAllocations([]);
    }
  }, [hari, tiket, hotel, makan, transport, wisata]);

  // Kalkulasi otomatis saat parameter URL berubah
  React.useEffect(() => {
    calculateBudget();
  }, [calculateBudget]);

  const handleReset = () => {
    setHari(null);
    setTiket(null);
    setHotel(null);
    setMakan(null);
    setTransport(null);
    setWisata(null);
  };

  const handlePresetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    switch (val) {
      case "weekend-getaway":
        setHari(2);
        setTiket(600000);
        setHotel(400000);
        setMakan(150000);
        setTransport(75000);
        setWisata(150000);
        break;
      case "backpacker-3d":
        setHari(3);
        setTiket(800000);
        setHotel(200000);
        setMakan(100000);
        setTransport(50000);
        setWisata(200000);
        break;
      case "jogja-culture-4d":
        setHari(4);
        setTiket(900000);
        setHotel(350000);
        setMakan(150000);
        setTransport(100000);
        setWisata(250000);
        break;
      case "bali-family-4d":
        setHari(4);
        setTiket(1800000);
        setHotel(750000);
        setMakan(300000);
        setTransport(200000);
        setWisata(500000);
        break;
      case "overseas-asia-6d":
        setHari(6);
        setTiket(4500000);
        setHotel(1000000);
        setMakan(400000);
        setTransport(200000);
        setWisata(1200000);
        break;
      default:
        break;
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
      {/* Kolom Kiri: Form Parameter Biaya Itinerary */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Anggaran Liburan
                </h2>
                <p className="text-secondary text-sm">
                  Konfigurasi durasi hari, transportasi, akomodasi, dan konsumsi
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Select
              label="Preset Profil Perjalanan"
              onChange={handlePresetSelect}
              defaultValue="bali-family-4d"
              helperText="Pilih simulasi standar industri atau sesuaikan manual"
            >
              <option value="weekend-getaway">Liburan Singkat Weekend (2 Hari 1 Malam)</option>
              <option value="backpacker-3d">Solo Backpacker Hemat (3 Hari 2 Malam)</option>
              <option value="jogja-culture-4d">Wisata Budaya Jogja (4 Hari 3 Malam)</option>
              <option value="bali-family-4d">Family Vacation Bali (4 Hari 3 Malam)</option>
              <option value="overseas-asia-6d">Trip Internasional Asia (6 Hari 5 Malam)</option>
            </Select>

            <Input
              label="Lama Liburan (Durasi Hari)"
              type="number"
              min={1}
              max={60}
              step={1}
              value={hari ?? ""}
              onChange={(e) =>
                setHari(e.target.value === "" ? null : Math.max(1, Number(e.target.value)))
              }
              suffix="Hari"
              helperText={`Durasi Menginap: ${totalMalam} Malam`}
            />

            <Input
              label="Tiket Pesawat / Transportasi PP"
              type="number"
              min={0}
              step={50000}
              value={tiket ?? ""}
              onChange={(e) =>
                setTiket(e.target.value === "" ? null : Number(e.target.value))
              }
              prefix="Rp"
              helperText={`Nominal: ${formatCurrency(tiket || 0)}`}
            />

            <Input
              label="Biaya Penginapan / Hotel per Malam"
              type="number"
              min={0}
              step={50000}
              value={hotel ?? ""}
              onChange={(e) =>
                setHotel(e.target.value === "" ? null : Number(e.target.value))
              }
              prefix="Rp"
              helperText={`Total ${totalMalam} Malam: ${formatCurrency(totalHotelCost)}`}
            />

            <Input
              label="Alokasi Makan & Konsumsi per Hari"
              type="number"
              min={0}
              step={25000}
              value={makan ?? ""}
              onChange={(e) =>
                setMakan(e.target.value === "" ? null : Number(e.target.value))
              }
              prefix="Rp"
              helperText={`Total ${hari || 0} Hari: ${formatCurrency(totalMakanCost)}`}
            />

            <Input
              label="Transportasi Lokal per Hari"
              type="number"
              min={0}
              step={25000}
              value={transport ?? ""}
              onChange={(e) =>
                setTransport(e.target.value === "" ? null : Number(e.target.value))
              }
              prefix="Rp"
              helperText={`Total ${hari || 0} Hari: ${formatCurrency(totalTransportCost)}`}
            />

            <div className="sm:col-span-2">
              <Input
                label="Total Tiket Masuk Wisata & Rekreasi"
                type="number"
                min={0}
                step={50000}
                value={wisata ?? ""}
                onChange={(e) =>
                  setWisata(e.target.value === "" ? null : Number(e.target.value))
                }
                prefix="Rp"
                helperText={`Akumulasi tiket destinasi & aktivitas: ${formatCurrency(wisata || 0)}`}
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={calculateBudget}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Hitung Budget Presisi
            </Button>
          </div>
        </Card>

        {/* Technical Assurance Card */}
        <Card className="bg-surface/50 border-border/60 text-secondary text-xs leading-relaxed flex items-start gap-3 p-4">
          <ShieldCheck className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-primary block mb-0.5">
              Parameter Teknis Terkalibrasi
            </span>
            Perhitungan memisahkan biaya tetap (*fixed costs* seperti tiket transportasi utama) dengan biaya variabel berbasis durasi hari dan malam (*variable daily costs*). Formulasi terkalibrasi secara akurat tanpa distorsi pembulatan.
          </div>
        </Card>
      </div>

      {/* Kolom Kanan: Output & Rincian Alokasi Finansial */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <OutputBox
          label="Total Estimasi Budget Liburan"
          value={totalBudget}
          prefix="Rp "
        />

        <OutputBox
          label="Rata-Rata Budget Harian"
          value={dailyAverage}
          prefix="Rp "
          suffix=" /hari"
        />

        {/* Matriks Rincian Pos Pengeluaran */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-accent" />
              Rincian Alokasi Finansial
            </h3>
            <span className="text-xs font-mono text-secondary">
              {hari || 0} Hari / {totalMalam} Malam
            </span>
          </div>

          <div className="flex flex-col gap-3.5 text-sm">
            {allocations.map((item) => {
              const IconComp = item.icon;
              return (
                <div key={item.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("p-1 rounded-md", item.bgLight, item.color)}>
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-secondary text-xs font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-primary">
                        {formatCurrency(item.nominal)}
                      </span>
                      <span className="text-[11px] font-mono text-secondary w-12 text-right">
                        ({item.percentage}%)
                      </span>
                    </div>
                  </div>
                  {/* Visual Allocation Bar */}
                  <div className="w-full bg-base rounded-full h-1.5 overflow-hidden border border-border/40">
                    <div
                      className="bg-accent h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="pt-3 border-t border-border flex justify-between items-center font-semibold">
              <span className="text-primary text-sm">Total Akumulasi:</span>
              <span className="font-mono text-accent text-lg">
                {formatCurrency(totalBudget)}
              </span>
            </div>
          </div>
        </Card>

        {/* Real-time State Synchronization Card */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            Data parameter tersinkronisasi <span className="text-primary font-medium">real-time</span> ke URL query. Anda dapat menyalin tautan URL peramban untuk membagikan rencana anggaran liburan secara presisi kepada rekan perjalanan Anda.
          </p>
        </div>
      </div>
    </div>
  );
}