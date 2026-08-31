"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Plane,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Coffee,
  Utensils,
  Coins,
  RotateCcw,
  FileText,
  ShieldCheck,
  Users,
  Info,
  Sparkles,
  Hotel,
  Ticket,
  HelpCircle,
  Building2,
  XCircle,
} from "lucide-react";
import { useQueryState, parseAsInteger, parseAsFloat, parseAsString } from "nuqs";
import { cn } from "@/lib/utils";

// Definisi Kategori Kompensasi PM 89/2015
export interface DelayCategoryDetail {
  categoryNumber: number;
  categoryLabel: string;
  durationLabel: string;
  minMinutes: number;
  maxMinutes: number | null;
  isCancelled?: boolean;
  snack: boolean;
  drink: boolean;
  heavyMeal: boolean;
  cashCompensationPerPax: number;
  refundOrReroute: boolean;
  hotelAccommodation: boolean;
  summaryTitle: string;
  rightsSummary: string[];
  notes: string;
  severityColor: string;
  badgeBg: string;
}

export const DELAY_CATEGORIES: DelayCategoryDetail[] = [
  {
    categoryNumber: 1,
    categoryLabel: "Kategori 1 (30 - 60 Menit)",
    durationLabel: "30 s.d. 60 menit",
    minMinutes: 30,
    maxMinutes: 60,
    snack: false,
    drink: true,
    heavyMeal: false,
    cashCompensationPerPax: 0,
    refundOrReroute: false,
    hotelAccommodation: false,
    summaryTitle: "Penyediaan Minuman Ringan",
    rightsSummary: [
      "Minuman ringan (air mineral / teh / jus kemasan) gratis dari maskapai",
      "Pemberitahuan resmi alasan keterlambatan kepada seluruh penumpang",
    ],
    notes: "Disediakan selambat-lambatnya 30 menit setelah jadwal keberangkatan terlampaui.",
    severityColor: "text-blue-400",
    badgeBg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  },
  {
    categoryNumber: 2,
    categoryLabel: "Kategori 2 (61 - 120 Menit)",
    durationLabel: "61 s.d. 120 menit",
    minMinutes: 61,
    maxMinutes: 120,
    snack: true,
    drink: true,
    heavyMeal: false,
    cashCompensationPerPax: 0,
    refundOrReroute: false,
    hotelAccommodation: false,
    summaryTitle: "Makanan & Minuman Ringan (Snack Box)",
    rightsSummary: [
      "Minuman dan makanan ringan (snack box)",
      "Pembaruan status perkiraan jam keberangkatan setiap 30 menit",
      "Pemberian informasi ruang tunggu dan proses boarding",
    ],
    notes: "Disediakan di ruang tunggu sebelum penumpang diarahkan ke pesawat.",
    severityColor: "text-amber-400",
    badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  },
  {
    categoryNumber: 3,
    categoryLabel: "Kategori 3 (121 - 180 Menit)",
    durationLabel: "121 s.d. 180 menit",
    minMinutes: 121,
    maxMinutes: 180,
    snack: false,
    drink: true,
    heavyMeal: true,
    cashCompensationPerPax: 0,
    refundOrReroute: false,
    hotelAccommodation: false,
    summaryTitle: "Makanan Berat & Minuman (Heavy Meal)",
    rightsSummary: [
      "Makanan berat siap santap (nasi box / meal box restoran) dan minuman",
      "Opsi pengalihan penerbangan lain tanpa biaya tambahan jika tersedia kursi",
    ],
    notes: "Wajib disajikan dengan standar higienis dan porsi lengkap pada jam makan.",
    severityColor: "text-orange-400",
    badgeBg: "bg-orange-500/10 border-orange-500/30 text-orange-400",
  },
  {
    categoryNumber: 4,
    categoryLabel: "Kategori 4 (181 - 240 Menit)",
    durationLabel: "181 s.d. 240 menit",
    minMinutes: 181,
    maxMinutes: 240,
    snack: true,
    drink: true,
    heavyMeal: true,
    cashCompensationPerPax: 0,
    refundOrReroute: false,
    hotelAccommodation: false,
    summaryTitle: "Paket Lengkap Makanan Ringan, Berat, & Minuman",
    rightsSummary: [
      "Minuman, makanan ringan (snack), dan makanan berat (heavy meal)",
      "Layanan informasi prioritas dan pendampingan petugas darat maskapai",
      "Fasilitas pengembalian bagasi kabin jika penumpang membutuhkan obat/keperluan mendesak",
    ],
    notes: "Kombinasi layanan konsumsi penuh selama masa tunggu di bandara.",
    severityColor: "text-rose-400",
    badgeBg: "bg-rose-500/10 border-rose-500/30 text-rose-400",
  },
  {
    categoryNumber: 5,
    categoryLabel: "Kategori 5 (> 240 Menit)",
    durationLabel: "Lebih dari 240 menit (4+ Jam)",
    minMinutes: 241,
    maxMinutes: null,
    snack: true,
    drink: true,
    heavyMeal: true,
    cashCompensationPerPax: 300000,
    refundOrReroute: true,
    hotelAccommodation: false,
    summaryTitle: "Ganti Rugi Finansial Rp 300.000 / Pax + Hak Refund Penuh",
    rightsSummary: [
      "Ganti rugi tunai / transfer senilai Rp 300.000 per penumpang",
      "Pilihan: Pengembalian uang tiket 100% (Refund tanpa potongan) ATAU dialihkan ke penerbangan berikutnya",
      "Seluruh hak konsumsi Kategori 1 s.d. 4 tetap wajib diberikan maskapai",
      "Akomodasi hotel + transportasi bandara PP jika penerbangan dialihkan ke keesokan harinya",
    ],
    notes: "Kompensasi Rp 300.000 wajib diberikan tunai di bandara atau ditransfer maksimal 3x24 jam.",
    severityColor: "text-red-400",
    badgeBg: "bg-red-500/10 border-red-500/30 text-red-400",
  },
  {
    categoryNumber: 6,
    categoryLabel: "Kategori 6 (Pembatalan Penerbangan)",
    durationLabel: "Penerbangan Dibatalkan",
    minMinutes: 0,
    maxMinutes: null,
    isCancelled: true,
    snack: true,
    drink: true,
    heavyMeal: true,
    cashCompensationPerPax: 300000,
    refundOrReroute: true,
    hotelAccommodation: true,
    summaryTitle: "Refund 100% Penuh atau Reroute Bebas Biaya + Kompensasi",
    rightsSummary: [
      "Opsi A: Pengembalian 100% biaya tiket (Refund tunai/transfer tanpa biaya administrasi)",
      "Opsi B: Pengalihan rute/penerbangan berikutnya (Reroute) tanpa tambahan biaya (free rebooking)",
      "Ganti rugi uang tunai Rp 300.000 per penumpang (jika pembatalan karena faktor maskapai)",
      "Fasilitas penginapan (Hotel) + transportasi jika penerbangan pengganti di hari berikutnya",
    ],
    notes: "Berlaku penuh jika pembatalan diinformasikan kurang dari 7 hari sebelum keberangkatan.",
    severityColor: "text-purple-400",
    badgeBg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
  },
];

export const PRESET_OPTIONS = [
  { label: "30 - 60 Mnt (Kat 1)", delay: 45, isCancelled: false },
  { label: "61 - 120 Mnt (Kat 2)", delay: 90, isCancelled: false },
  { label: "121 - 180 Mnt (Kat 3)", delay: 150, isCancelled: false },
  { label: "181 - 240 Mnt (Kat 4)", delay: 210, isCancelled: false },
  { label: "> 240 Mnt / 4 Jam (Kat 5)", delay: 300, isCancelled: false },
  { label: "Batal Terbang (Kat 6)", delay: 0, isCancelled: true },
];

export function KompensasiDelayPesawatCalculator() {
  // 1. Nuqs URL Query States
  const [lamaDelay, setLamaDelay] = useQueryState(
    "lamaDelay",
    parseAsInteger.withDefault(45)
  );
  const [isCancelled, setIsCancelled] = useQueryState(
    "isCancelled",
    parseAsString.withDefault("false")
  );
  const [jumlahPenumpang, setJumlahPenumpang] = useQueryState(
    "jumlahPenumpang",
    parseAsInteger.withDefault(1)
  );
  const [hargaTiket, setHargaTiket] = useQueryState(
    "hargaTiket",
    parseAsFloat.withDefault(1200000)
  );
  const [penyebabDelay, setPenyebabDelay] = useQueryState(
    "penyebabDelay",
    parseAsString.withDefault("maskapai")
  );
  const [menginap, setMenginap] = useQueryState(
    "menginap",
    parseAsString.withDefault("false")
  );

  // 2. Computed Outputs
  const [activeCategory, setActiveCategory] = React.useState<DelayCategoryDetail | null>(null);
  const [totalKompensasiUang, setTotalKompensasiUang] = React.useState<number>(0);
  const [totalEstimasiRefund, setTotalEstimasiRefund] = React.useState<number>(0);
  const [durasiMenit, setDurasiMenit] = React.useState<number>(45);

  const calculateCompensation = React.useCallback(() => {
    const delay = Math.max(0, lamaDelay ?? 0);
    const pax = Math.max(1, jumlahPenumpang ?? 1);
    const ticketPrice = Math.max(0, hargaTiket ?? 0);
    const isFlightCancelled = isCancelled === "true";
    const isAirlineFault = penyebabDelay === "maskapai";

    setDurasiMenit(delay);

    let category: DelayCategoryDetail | null = null;

    if (isFlightCancelled) {
      category = DELAY_CATEGORIES.find((c) => c.categoryNumber === 6) || null;
    } else if (delay < 30) {
      category = null;
    } else if (delay >= 30 && delay <= 60) {
      category = DELAY_CATEGORIES.find((c) => c.categoryNumber === 1) || null;
    } else if (delay >= 61 && delay <= 120) {
      category = DELAY_CATEGORIES.find((c) => c.categoryNumber === 2) || null;
    } else if (delay >= 121 && delay <= 180) {
      category = DELAY_CATEGORIES.find((c) => c.categoryNumber === 3) || null;
    } else if (delay >= 181 && delay <= 240) {
      category = DELAY_CATEGORIES.find((c) => c.categoryNumber === 4) || null;
    } else {
      category = DELAY_CATEGORIES.find((c) => c.categoryNumber === 5) || null;
    }

    setActiveCategory(category);

    if (!category) {
      setTotalKompensasiUang(0);
      setTotalEstimasiRefund(0);
      return;
    }

    // Kompensasi uang tunai hanya wajib jika kesalahan internal maskapai (bukan force majeure cuaca)
    let cashPerPax = 0;
    if (isAirlineFault) {
      cashPerPax = category.cashCompensationPerPax;
    }

    const totalCash = cashPerPax * pax;
    const totalRefund = ticketPrice * pax;

    setTotalKompensasiUang(totalCash);
    setTotalEstimasiRefund(totalRefund);
  }, [lamaDelay, isCancelled, jumlahPenumpang, hargaTiket, penyebabDelay]);

  React.useEffect(() => {
    calculateCompensation();
  }, [calculateCompensation]);

  const handleReset = () => {
    setLamaDelay(45);
    setIsCancelled("false");
    setJumlahPenumpang(1);
    setHargaTiket(1200000);
    setPenyebabDelay("maskapai");
    setMenginap("false");
  };

  const handleApplyPreset = (presetDelay: number, cancelled: boolean) => {
    if (cancelled) {
      setIsCancelled("true");
      setLamaDelay(0);
    } else {
      setIsCancelled("false");
      setLamaDelay(presetDelay);
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Kolom Kiri: Form Parameter Input */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          {/* Header Card */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Plane className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Keterlambatan Penerbangan
                </h2>
                <p className="text-secondary text-sm">
                  Evaluasi hak kompensasi sesuai Peraturan Menteri Perhubungan No. PM 89 Tahun 2015
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset Formulir"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-secondary">
              Pilihan Cepat Kategori Durasi Delay:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_OPTIONS.map((opt, idx) => {
                const isSelected =
                  opt.isCancelled
                    ? isCancelled === "true"
                    : isCancelled === "false" &&
                      (lamaDelay ?? 0) >= (idx === 0 ? 30 : idx === 1 ? 61 : idx === 2 ? 121 : idx === 3 ? 181 : 241) &&
                      (lamaDelay ?? 0) <= (idx === 0 ? 60 : idx === 1 ? 120 : idx === 2 ? 180 : idx === 3 ? 240 : 9999);

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(opt.delay, opt.isCancelled)}
                    className={cn(
                      "text-xs px-3 py-2 rounded-lg border text-left font-medium transition-all duration-150 flex items-center justify-between",
                      isSelected
                        ? "bg-accent/15 border-accent text-accent font-semibold shadow-sm"
                        : "border-border bg-base text-secondary hover:text-primary hover:border-border/80"
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Status Penerbangan */}
            <Select
              label="Status Penerbangan"
              value={isCancelled ?? "false"}
              onChange={(e) => {
                setIsCancelled(e.target.value);
                if (e.target.value === "true") {
                  setLamaDelay(0);
                } else if ((lamaDelay ?? 0) < 30) {
                  setLamaDelay(45);
                }
              }}
              helperText="Pilih apakah penerbangan terlambat atau dibatalkan sepihak"
            >
              <option value="false">Pesawat Delay (Terlambat Berangkat)</option>
              <option value="true">Pesawat Batal Terbang (Cancelled / Kategori 6)</option>
            </Select>

            {/* Durasi Keterlambatan */}
            <Input
              type="number"
              label="Lama Keterlambatan (Menit)"
              placeholder="Contoh: 45, 90, 245"
              value={isCancelled === "true" ? 0 : (lamaDelay ?? "")}
              disabled={isCancelled === "true"}
              onChange={(e) => {
                const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                setLamaDelay(isNaN(val) ? 0 : val);
              }}
              suffix="Menit"
              helperText={
                isCancelled === "true"
                  ? "Penerbangan dibatalkan (Kategori 6)"
                  : (lamaDelay ?? 0) < 30
                  ? "Delay < 30 menit belum masuk ambang batas kompensasi PM 89/2015"
                  : `Setara ± ${((lamaDelay ?? 0) / 60).toFixed(1)} Jam keterlambatan`
              }
            />

            {/* Penyebab Delay (Faktor Maskapai vs Force Majeure) */}
            <Select
              label="Penyebab Keterlambatan"
              value={penyebabDelay ?? "maskapai"}
              onChange={(e) => setPenyebabDelay(e.target.value)}
              helperText="PM 89/2015 membedakan faktor manajemen maskapai vs cuaca/force majeure"
            >
              <option value="maskapai">Faktor Manajemen Maskapai (Operasional, Kru, Teknis Pesawat)</option>
              <option value="cuaca">Faktor Cuaca Buruk / Force Majeure (Hujan Lebat, Erupsi, Banjir)</option>
              <option value="bandara">Faktor Teknis Bandara / ATC (Antrean Runway, Slot Landing Ditutup)</option>
            </Select>

            {/* Jumlah Penumpang */}
            <Input
              type="number"
              label="Jumlah Penumpang Terdampak"
              placeholder="1"
              min={1}
              value={jumlahPenumpang ?? 1}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setJumlahPenumpang(isNaN(val) || val < 1 ? 1 : val);
              }}
              suffix="Orang"
              helperText="Untuk menghitung akumulasi total kompensasi & refund rombongan"
            />

            {/* Harga Tiket per Penumpang (Opsional untuk Refund) */}
            <Input
              type="number"
              label="Harga Tiket per Penumpang (Opsional)"
              placeholder="1200000"
              value={hargaTiket ?? 0}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setHargaTiket(isNaN(val) ? 0 : val);
              }}
              prefix="Rp"
              helperText="Digunakan untuk simulasi total refund 100% jika delay > 4 jam / batal"
            />

            {/* Opsi Menginap / Hari Berikutnya */}
            <Select
              label="Kebutuhan Menginap (Next Day)"
              value={menginap ?? "false"}
              onChange={(e) => setMenginap(e.target.value)}
              helperText="Apakah penerbangan pengganti dialihkan ke keesokan harinya?"
            >
              <option value="false">Tidak (Terbang di hari yang sama)</option>
              <option value="true">Ya (Terbang esok hari - Wajib Hotel & Transport)</option>
            </Select>
          </div>

          {/* Banner Informasi PM 89/2015 */}
          <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-start gap-3 text-xs text-secondary leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-primary block mb-0.5">
                Dasar Hukum: Peraturan Menteri Perhubungan Republik Indonesia No. PM 89 Tahun 2015
              </span>
              Maskapai penerbangan niaga berjadwal wajib memberikan kompensasi secara bertahap mulai dari keterlambatan 30 menit. Keterlambatan lebih dari 240 menit (4 jam) atau pembatalan sepihak mewajibkan ganti rugi uang tunai Rp 300.000 per penumpang di luar hak makanan/minuman dan pengembalian tiket.
            </div>
          </div>
        </Card>
      </div>

      {/* Kolom Kanan: Ringkasan Output & Daftar Hak Penumpang */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Output Boxes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <OutputBox
            label="Kategori Delay PM 89"
            value={activeCategory ? activeCategory.categoryNumber : 0}
            prefix="Kategori "
            suffix={activeCategory ? "" : " (Nihil)"}
            className="border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5"
          />

          <OutputBox
            label="Durasi Keterlambatan"
            value={isCancelled === "true" ? 0 : durasiMenit}
            suffix={isCancelled === "true" ? " (Batal)" : " Menit"}
            className="border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-sky-500/5"
          />

          <OutputBox
            label="Total Kompensasi Tunai"
            value={totalKompensasiUang}
            prefix="Rp "
            decimals={0}
            className={cn(
              "border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 sm:col-span-2",
              totalKompensasiUang > 0 ? "border-emerald-500/50" : ""
            )}
          />
        </div>

        {/* Status Hak Penumpang Card */}
        <Card className="flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-accent" />
              <h3 className="text-base font-semibold font-display text-primary">
                Hak Penumpang & Kewajiban Maskapai
              </h3>
            </div>
            {activeCategory ? (
              <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border", activeCategory.badgeBg)}>
                {activeCategory.categoryLabel}
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full border border-zinc-700 bg-zinc-800/50 text-secondary">
                Kurang dari 30 Mnt
              </span>
            )}
          </div>

          {/* Kondisi Jika Delay < 30 Menit */}
          {!activeCategory && (
            <div className="p-4 rounded-xl bg-base border border-border flex flex-col gap-2 text-sm text-secondary">
              <div className="flex items-center gap-2 text-primary font-medium">
                <Info className="w-4 h-4 text-secondary" />
                <span>Belum Ada Kewajiban Kompensasi Makanan / Finansial</span>
              </div>
              <p className="text-xs leading-relaxed">
                Berdasarkan Pasal 3 PM 89/2015, keterlambatan di bawah 30 menit (0–29 menit) masih dalam batas toleransi operasional wajar dan tidak mewajibkan maskapai memberikan kompensasi konsumsi atau ganti rugi uang. Maskapai hanya berkewajiban memberikan informasi jadwal.
              </p>
            </div>
          )}

          {/* Rincian Hak Fasilitas Matriks */}
          {activeCategory && (
            <div className="flex flex-col gap-4">
              <div className="text-sm font-semibold text-primary flex items-center justify-between">
                <span>{activeCategory.summaryTitle}</span>
                {activeCategory.cashCompensationPerPax > 0 && (
                  <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    + Rp 300.000 / Org
                  </span>
                )}
              </div>

              {/* Checklist Hak Fasilitas */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Minuman */}
                <div
                  className={cn(
                    "p-2.5 rounded-lg border flex items-center gap-2.5 text-xs transition-colors",
                    activeCategory.drink
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-medium"
                      : "bg-base/50 border-border/50 text-secondary/60 opacity-60"
                  )}
                >
                  <Coffee className="w-4 h-4 shrink-0" />
                  <span>Minuman Ringan</span>
                </div>

                {/* Makanan Ringan / Snack */}
                <div
                  className={cn(
                    "p-2.5 rounded-lg border flex items-center gap-2.5 text-xs transition-colors",
                    activeCategory.snack
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-medium"
                      : "bg-base/50 border-border/50 text-secondary/60 opacity-60"
                  )}
                >
                  <Utensils className="w-4 h-4 shrink-0" />
                  <span>Snack Box / Makanan Ringan</span>
                </div>

                {/* Makanan Berat */}
                <div
                  className={cn(
                    "p-2.5 rounded-lg border flex items-center gap-2.5 text-xs transition-colors",
                    activeCategory.heavyMeal
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-medium"
                      : "bg-base/50 border-border/50 text-secondary/60 opacity-60"
                  )}
                >
                  <Utensils className="w-4 h-4 shrink-0" />
                  <span>Makanan Berat (Meal Box)</span>
                </div>

                {/* Ganti Rugi Tunai */}
                <div
                  className={cn(
                    "p-2.5 rounded-lg border flex items-center gap-2.5 text-xs transition-colors",
                    activeCategory.cashCompensationPerPax > 0 && penyebabDelay === "maskapai"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-bold"
                      : "bg-base/50 border-border/50 text-secondary/60 opacity-60"
                  )}
                >
                  <Coins className="w-4 h-4 shrink-0" />
                  <span>Ganti Rugi Rp 300.000</span>
                </div>

                {/* Refund 100% / Reroute */}
                <div
                  className={cn(
                    "p-2.5 rounded-lg border flex items-center gap-2.5 text-xs transition-colors",
                    activeCategory.refundOrReroute
                      ? "bg-sky-500/10 border-sky-500/30 text-sky-300 font-medium"
                      : "bg-base/50 border-border/50 text-secondary/60 opacity-60"
                  )}
                >
                  <Ticket className="w-4 h-4 shrink-0" />
                  <span>Opsi Refund 100% / Reroute</span>
                </div>

                {/* Hotel & Penginapan */}
                <div
                  className={cn(
                    "p-2.5 rounded-lg border flex items-center gap-2.5 text-xs transition-colors",
                    menginap === "true" || activeCategory.categoryNumber === 6
                      ? "bg-purple-500/10 border-purple-500/30 text-purple-300 font-medium"
                      : "bg-base/50 border-border/50 text-secondary/60 opacity-60"
                  )}
                >
                  <Hotel className="w-4 h-4 shrink-0" />
                  <span>Akomodasi Hotel & Transport</span>
                </div>
              </div>

              {/* Rincian Poin Hak Legal */}
              <div className="flex flex-col gap-2 pt-2 border-t border-border/60">
                <span className="text-xs font-semibold text-secondary">
                  Daftar Hak Sesuai Pasal PM 89/2015:
                </span>
                <ul className="flex flex-col gap-1.5">
                  {activeCategory.rightsSummary.map((item, idx) => (
                    <li key={idx} className="text-xs text-primary flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                  {menginap === "true" && (
                    <li className="text-xs text-purple-300 flex items-start gap-2 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span>
                        Fasilitas hotel bintang/layak dan transportasi PP bandara-hotel (Pasal 11).
                      </span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Catatan Khusus Pengecualian / Force Majeure */}
              {penyebabDelay !== "maskapai" && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2 text-xs text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Pengecualian Ganti Rugi Finansial:</strong> Karena delay disebabkan oleh {penyebabDelay === "cuaca" ? "faktor cuaca buruk" : "masalah teknis bandara/ATC"}, maskapai dibebaskan dari kewajiban ganti rugi uang tunai Rp 300.000. Namun, hak konsumsi (makanan/minuman) serta hak refund/reroute tetap wajib diberikan jika delay melampaui batas waktu.
                  </span>
                </div>
              )}

              {/* Simulasi Hak Refund Total jika dibatalkan/ditolak terbang */}
              {activeCategory.refundOrReroute && totalEstimasiRefund > 0 && (
                <div className="p-3.5 rounded-xl bg-base border border-border flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-secondary font-medium">
                      Simulasi Total Refund 100% ({jumlahPenumpang} Penumpang)
                    </span>
                    <span className="text-xs text-secondary/70">
                      Pengembalian penuh tanpa potongan biaya administrasi
                    </span>
                  </div>
                  <span className="text-sm font-mono font-bold text-emerald-400">
                    {formatRupiah(totalEstimasiRefund)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Protokol Klaim Mandiri di Bandara */}
          <div className="p-3.5 rounded-xl bg-elevated/60 border border-border flex flex-col gap-2">
            <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-accent" />
              Langkah Cepat Klaim di Bandara:
            </span>
            <ol className="text-[11px] text-secondary flex flex-col gap-1 list-decimal pl-4 leading-relaxed">
              <li>Datangi loket Customer Service / Duty Manager maskapai di boarding gate.</li>
              <li>Minta surat keterangan resmi delay (*Delay Confirmation Letter*).</li>
              <li>Ambil voucher makanan/minuman di ruang tunggu bandara.</li>
              <li>Jika delay &gt; 4 jam, minta formulir klaim ganti rugi tunai Rp 300.000/pax.</li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
}