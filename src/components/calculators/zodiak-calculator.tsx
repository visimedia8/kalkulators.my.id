"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Sparkles,
  Sun,
  Moon,
  Compass,
  RotateCcw,
  Flame,
  Droplets,
  Mountain,
  Wind,
  Star,
  Info,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useQueryState, parseAsInteger } from "nuqs";
import { cn } from "@/lib/utils";

// --- DATA STRUKTUR ASTRONOMIS & ZODIAK TROPIS STANDAR INTERNASIONAL ---

export type ZodiacElement = "Api" | "Tanah" | "Udara" | "Air";
export type ModalityType = "Kardinal" | "Tetap" | "Fleksibel";

export interface ZodiacSignData {
  id: string;
  name: string;
  symbol: string;
  latinName: string;
  dateRangeStr: string;
  element: ZodiacElement;
  elementColor: string;
  elementBg: string;
  elementBorder: string;
  keywords: [string, string, string];
  rulingPlanet: string;
  modality: ModalityType;
  polarity: "Maskulin (Yang / Ekstrovert)" | "Feminin (Yin / Introvert)";
  orderNumber: number;
  eclipticDegreeStart: number;
  durationDays: number;
  strengths: string;
  growthAreas: string;
  compatibleSigns: string[];
  description: string;
}

export const ZODIAC_LIST: ZodiacSignData[] = [
  {
    id: "aries",
    name: "Aries",
    symbol: "♈",
    latinName: "Aries (The Ram)",
    dateRangeStr: "21 Maret – 19 April",
    element: "Api",
    elementColor: "text-rose-400",
    elementBg: "bg-rose-500/10",
    elementBorder: "border-rose-500/30",
    keywords: ["Berani", "Dinamis", "Pelopor"],
    rulingPlanet: "Mars",
    modality: "Kardinal",
    polarity: "Maskulin (Yang / Ekstrovert)",
    orderNumber: 1,
    eclipticDegreeStart: 0,
    durationDays: 30,
    strengths: "Inisiatif tinggi, kepemimpinan alami, keberanian bertindak, dan antusiasme tanpa batas.",
    growthAreas: "Manajemen kesabaran, pengendalian impulsivitas, dan perencanaan jangka panjang.",
    compatibleSigns: ["Leo", "Sagitarius", "Gemini", "Aquarius"],
    description: "Zodiak kardinal elemen Api yang menjadi tanda permulaan ekliptika baru. Memancarkan energi kepeloporan dan vitalitas proaktif.",
  },
  {
    id: "taurus",
    name: "Taurus",
    symbol: "♉",
    latinName: "Taurus (The Bull)",
    dateRangeStr: "20 April – 20 Mei",
    element: "Tanah",
    elementColor: "text-emerald-400",
    elementBg: "bg-emerald-500/10",
    elementBorder: "border-emerald-500/30",
    keywords: ["Stabil", "Sabar", "Praktis"],
    rulingPlanet: "Venus",
    modality: "Tetap",
    polarity: "Feminin (Yin / Introvert)",
    orderNumber: 2,
    eclipticDegreeStart: 30,
    durationDays: 31,
    strengths: "Ketekunan luar biasa, loyalitas kokoh, keandalan operasional, dan apresiasi estetika materi.",
    growthAreas: "Fleksibilitas terhadap perubahan mendadak dan keterbukaan terhadap paradigma baru.",
    compatibleSigns: ["Virgo", "Capricorn", "Cancer", "Pisces"],
    description: "Zodiak tetap elemen Tanah yang melambangkan stabilitas pondasi, produktivitas nyata, dan keteguhan prinsip tak tergoyahkan.",
  },
  {
    id: "gemini",
    name: "Gemini",
    symbol: "♊",
    latinName: "Gemini (The Twins)",
    dateRangeStr: "21 Mei – 20 Juni",
    element: "Udara",
    elementColor: "text-sky-400",
    elementBg: "bg-sky-500/10",
    elementBorder: "border-sky-500/30",
    keywords: ["Komunikatif", "Adaptif", "Intelektual"],
    rulingPlanet: "Merkurius",
    modality: "Fleksibel",
    polarity: "Maskulin (Yang / Ekstrovert)",
    orderNumber: 3,
    eclipticDegreeStart: 60,
    durationDays: 31,
    strengths: "Kelincahan mental, kemampuan artikulasi ide, pemrosesan informasi cepat, dan kecerdasan sosial.",
    growthAreas: "Fokus konsistensi eksekusi dan pendalaman konsentrasi pada satu target utama.",
    compatibleSigns: ["Libra", "Aquarius", "Aries", "Leo"],
    description: "Zodiak fleksibel elemen Udara yang menjadi motor penghubung gagasan, pertukaran informasi, dan adaptabilitas multi-disiplin.",
  },
  {
    id: "cancer",
    name: "Cancer",
    symbol: "♋",
    latinName: "Cancer (The Crab)",
    dateRangeStr: "21 Juni – 22 Juli",
    element: "Air",
    elementColor: "text-cyan-400",
    elementBg: "bg-cyan-500/10",
    elementBorder: "border-cyan-500/30",
    keywords: ["Intuitif", "Empatis", "Melindungi"],
    rulingPlanet: "Bulan",
    modality: "Kardinal",
    polarity: "Feminin (Yin / Introvert)",
    orderNumber: 4,
    eclipticDegreeStart: 90,
    durationDays: 32,
    strengths: "Kecerdasan emosional tinggi, insting protektif kuat, daya ingat mendalam, dan empati interpersonal.",
    growthAreas: "Regulasi batasan emosional diri dan ketahanan terhadap fluktuasi suasana hati lingkungan.",
    compatibleSigns: ["Scorpio", "Pisces", "Taurus", "Virgo"],
    description: "Zodiak kardinal elemen Air yang menguasai fondasi rasa aman, kedalaman intuisi batiniah, dan perlindungan lingkungan terdekat.",
  },
  {
    id: "leo",
    name: "Leo",
    symbol: "♌",
    latinName: "Leo (The Lion)",
    dateRangeStr: "23 Juli – 22 Agustus",
    element: "Api",
    elementColor: "text-amber-400",
    elementBg: "bg-amber-500/10",
    elementBorder: "border-amber-500/30",
    keywords: ["Percaya Diri", "Karismatik", "Dermawan"],
    rulingPlanet: "Matahari",
    modality: "Tetap",
    polarity: "Maskulin (Yang / Ekstrovert)",
    orderNumber: 5,
    eclipticDegreeStart: 120,
    durationDays: 31,
    strengths: "Daya pikat kepemimpinan berwibawa, keberanian berekspresi, kemurahan hati, dan optimisme kuat.",
    growthAreas: "Menerima umpan balik kritis secara objektif dan mendistribusikan sorotan panggung ke tim.",
    compatibleSigns: ["Aries", "Sagitarius", "Gemini", "Libra"],
    description: "Zodiak tetap elemen Api yang dinaungi oleh pusat tata surya. Memancarkan aura percaya diri otentik dan daya cipta terdepan.",
  },
  {
    id: "virgo",
    name: "Virgo",
    symbol: "♍",
    latinName: "Virgo (The Maiden)",
    dateRangeStr: "23 Agustus – 22 September",
    element: "Tanah",
    elementColor: "text-teal-400",
    elementBg: "bg-teal-500/10",
    elementBorder: "border-teal-500/30",
    keywords: ["Analitis", "Rapi", "Perfeksionis"],
    rulingPlanet: "Merkurius",
    modality: "Fleksibel",
    polarity: "Feminin (Yin / Introvert)",
    orderNumber: 6,
    eclipticDegreeStart: 150,
    durationDays: 31,
    strengths: "Akurasi observasi detail, metodologi kerja sistematis, efisiensi praktis, dan dedikasi solusi.",
    growthAreas: "Meredam ekspektasi perfeksionisme berlebih dan menjaga keseimbangan beban kerja mental.",
    compatibleSigns: ["Taurus", "Capricorn", "Cancer", "Scorpio"],
    description: "Zodiak fleksibel elemen Tanah yang berfokus pada optimasi sistem, ketepatan kalkulasi, dan pengabdian mutu berstandar tinggi.",
  },
  {
    id: "libra",
    name: "Libra",
    symbol: "♎",
    latinName: "Libra (The Scales)",
    dateRangeStr: "23 September – 22 Oktober",
    element: "Udara",
    elementColor: "text-indigo-400",
    elementBg: "bg-indigo-500/10",
    elementBorder: "border-indigo-500/30",
    keywords: ["Harmonis", "Diplomatis", "Adil"],
    rulingPlanet: "Venus",
    modality: "Kardinal",
    polarity: "Maskulin (Yang / Ekstrovert)",
    orderNumber: 7,
    eclipticDegreeStart: 180,
    durationDays: 30,
    strengths: "Keahlian negosiasi objektif, rasa keadilan seimbang, daya tarik sosial, dan kepekaan harmoni estetika.",
    growthAreas: "Kecepatan pengambilan keputusan saat terjadi konflik kepentingan yang mendesak.",
    compatibleSigns: ["Gemini", "Aquarius", "Leo", "Sagitarius"],
    description: "Zodiak kardinal elemen Udara yang menjadi lambang kesetimbangan, mediasi konflik beradab, dan standardisasi keadilan sosial.",
  },
  {
    id: "scorpio",
    name: "Scorpio",
    symbol: "♏",
    latinName: "Scorpio (The Scorpion)",
    dateRangeStr: "23 Oktober – 21 November",
    element: "Air",
    elementColor: "text-purple-400",
    elementBg: "bg-purple-500/10",
    elementBorder: "border-purple-500/30",
    keywords: ["Intens", "Loyal", "Visioner"],
    rulingPlanet: "Pluto & Mars",
    modality: "Tetap",
    polarity: "Feminin (Yin / Introvert)",
    orderNumber: 8,
    eclipticDegreeStart: 210,
    durationDays: 30,
    strengths: "Daya fokus tembus pandang, ketahanan psikologis luar biasa, integritas loyalitas, dan pemikiran strategis.",
    growthAreas: "Keterbukaan dalam berbagi kendali dan melepaskan kewaspadaan defensif yang berlebih.",
    compatibleSigns: ["Cancer", "Pisces", "Virgo", "Capricorn"],
    description: "Zodiak tetap elemen Air yang menguasai transformasi mendalam, daya tahan mental tak terpecahkan, dan ketajaman wawasan substansial.",
  },
  {
    id: "sagitarius",
    name: "Sagitarius",
    symbol: "♐",
    latinName: "Sagittarius (The Archer)",
    dateRangeStr: "22 November – 21 Desember",
    element: "Api",
    elementColor: "text-orange-400",
    elementBg: "bg-orange-500/10",
    elementBorder: "border-orange-500/30",
    keywords: ["Optimis", "Filosofis", "Berjiwa Bebas"],
    rulingPlanet: "Jupiter",
    modality: "Fleksibel",
    polarity: "Maskulin (Yang / Ekstrovert)",
    orderNumber: 9,
    eclipticDegreeStart: 240,
    durationDays: 30,
    strengths: "Visi jangka panjang luas, kejujuran lugas, antusiasme eksplorasi wawasan, dan ketahanan optimisme.",
    growthAreas: "Ketelitian pada parameter mikro operasional dan komitmen terhadap rutinitas terstruktur.",
    compatibleSigns: ["Aries", "Leo", "Libra", "Aquarius"],
    description: "Zodiak fleksibel elemen Api yang digerakkan oleh pencarian kebenaran universal, ekspansi wawasan luas, dan kemerdekaan berpikir.",
  },
  {
    id: "capricorn",
    name: "Capricorn",
    symbol: "♑",
    latinName: "Capricorn (The Sea-Goat)",
    dateRangeStr: "22 Desember – 19 Januari",
    element: "Tanah",
    elementColor: "text-lime-400",
    elementBg: "bg-lime-500/10",
    elementBorder: "border-lime-500/30",
    keywords: ["Disiplin", "Ambisius", "Tanggung Jawab"],
    rulingPlanet: "Saturnus",
    modality: "Kardinal",
    polarity: "Feminin (Yin / Introvert)",
    orderNumber: 10,
    eclipticDegreeStart: 270,
    durationDays: 29,
    strengths: "Manajemen strategis jangka panjang, disiplin eksekusi tanpa kompromi, ketahanan beban tinggi, dan kepemimpinan matang.",
    growthAreas: "Spontanitas emosional dan meluangkan waktu relaksasi di luar target target produktivitas.",
    compatibleSigns: ["Taurus", "Virgo", "Scorpio", "Pisces"],
    description: "Zodiak kardinal elemen Tanah yang merepresentasikan arsitektur pencapaian puncak, keteguhan profesional, dan tata kelola terstruktur.",
  },
  {
    id: "aquarius",
    name: "Aquarius",
    symbol: "♒",
    latinName: "Aquarius (The Water Bearer)",
    dateRangeStr: "20 Januari – 18 Februari",
    element: "Udara",
    elementColor: "text-blue-400",
    elementBg: "bg-blue-500/10",
    elementBorder: "border-blue-500/30",
    keywords: ["Inovatif", "Humanis", "Independen"],
    rulingPlanet: "Uranus & Saturnus",
    modality: "Tetap",
    polarity: "Maskulin (Yang / Ekstrovert)",
    orderNumber: 11,
    eclipticDegreeStart: 300,
    durationDays: 30,
    strengths: "Pemikiran terobosan futuristik, idealisme kemanusiaan, kemandirian intelektual, dan orisinalitas konsep.",
    growthAreas: "Koneksi kehangatan emosional personal dan kesabaran menghadapi tahapan konvensional.",
    compatibleSigns: ["Gemini", "Libra", "Aries", "Sagitarius"],
    description: "Zodiak tetap elemen Udara yang memelopori inovasi progresif, pemikiran out-of-the-box, dan transformasi komunitas berbasis visi masa depan.",
  },
  {
    id: "pisces",
    name: "Pisces",
    symbol: "♓",
    latinName: "Pisces (The Fish)",
    dateRangeStr: "19 Februari – 20 Maret",
    element: "Air",
    elementColor: "text-violet-400",
    elementBg: "bg-violet-500/10",
    elementBorder: "border-violet-500/30",
    keywords: ["Penuh Empati", "Kreatif", "Spiritual"],
    rulingPlanet: "Neptunus & Jupiter",
    modality: "Fleksibel",
    polarity: "Feminin (Yin / Introvert)",
    orderNumber: 12,
    eclipticDegreeStart: 330,
    durationDays: 30,
    strengths: "Imajinasi artistik mendalam, kepekaan intuisi holistik, welas asih tulus, dan kapasitas adaptasi emosional.",
    growthAreas: "Penegakan batas realitas praktis dan ketegasan dalam manajemen prioritas personal.",
    compatibleSigns: ["Cancer", "Scorpio", "Taurus", "Capricorn"],
    description: "Zodiak penutup siklus ekliptika berunsur Air. Menghimpun sintesis kebijaksanaan spiritual, kepekaan transendental, dan daya kreasi murni.",
  },
];

const MONTH_DAYS_MAX = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

// Helper Penentu Tanda Zodiak Barat Berdasarkan Lookup Tanggal & Bulan Lahir
export function determineZodiacSign(day: number, month: number): ZodiacSignData {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return ZODIAC_LIST[0]; // Aries
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return ZODIAC_LIST[1]; // Taurus
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return ZODIAC_LIST[2]; // Gemini
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return ZODIAC_LIST[3]; // Cancer
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZODIAC_LIST[4]; // Leo
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZODIAC_LIST[5]; // Virgo
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return ZODIAC_LIST[6]; // Libra
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return ZODIAC_LIST[7]; // Scorpio
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return ZODIAC_LIST[8]; // Sagitarius
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return ZODIAC_LIST[9]; // Capricorn
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return ZODIAC_LIST[10]; // Aquarius
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return ZODIAC_LIST[11]; // Pisces
  return ZODIAC_LIST[0];
}

export function ZodiakCalculator() {
  // ---------------------------------------------------------------------------
  // 1. URL State Synchronized via nuqs
  // ---------------------------------------------------------------------------
  const [tanggalLahir, setTanggalLahir] = useQueryState(
    "tanggalLahir",
    parseAsInteger.withDefault(21)
  );
  const [bulanLahir, setBulanLahir] = useQueryState(
    "bulanLahir",
    parseAsInteger.withDefault(3)
  );
  const [jamLahir, setJamLahir] = useQueryState(
    "jamLahir",
    parseAsInteger.withDefault(6)
  );
  const [tahunLahir, setTahunLahir] = useQueryState(
    "tahunLahir",
    parseAsInteger.withDefault(2000)
  );

  // ---------------------------------------------------------------------------
  // 2. State & Dynamic Computation
  // ---------------------------------------------------------------------------
  const [sunSign, setSunSign] = React.useState<ZodiacSignData>(ZODIAC_LIST[0]);
  const [moonSign, setMoonSign] = React.useState<ZodiacSignData>(ZODIAC_LIST[3]);
  const [risingSign, setRisingSign] = React.useState<ZodiacSignData>(ZODIAC_LIST[0]);
  
  const [eclipticDegree, setEclipticDegree] = React.useState<number>(0.5);
  const [elementAffinityScore, setElementAffinityScore] = React.useState<number>(95);
  const [dayProgressInSign, setDayProgressInSign] = React.useState<number>(1);
  const [errorMsg, setErrorMsg] = React.useState<string>("");

  const calculateZodiacProfile = React.useCallback(() => {
    const rawDay = tanggalLahir ?? 21;
    const rawMonth = bulanLahir ?? 3;
    const rawHour = Math.min(23, Math.max(0, jamLahir ?? 6));
    const rawYear = Math.min(2100, Math.max(1900, tahunLahir ?? 2000));

    // Validasi Rentang Hari Berdasarkan Bulan
    const safeMonth = Math.min(12, Math.max(1, rawMonth));
    const maxDays = MONTH_DAYS_MAX[safeMonth - 1];
    const safeDay = Math.min(maxDays, Math.max(1, rawDay));

    if (rawDay > maxDays) {
      setErrorMsg(`Bulan ${MONTH_NAMES[safeMonth - 1]} hanya memiliki ${maxDays} hari.`);
    } else {
      setErrorMsg("");
    }

    // 1. Kalkulasi Sun Sign Utama
    const resolvedSun = determineZodiacSign(safeDay, safeMonth);
    setSunSign(resolvedSun);

    // 2. Kalkulasi Derajat Ekliptika ($0^\circ - 360^\circ$)
    // Hari ke-n dalam setahun
    const daysBeforeMonth = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    const dayOfYear = daysBeforeMonth[safeMonth - 1] + safeDay;
    // Titik Nol Ekliptika (Equinox Musim Semi ~21 Maret = Hari ke-80)
    const normalizedEclipticDays = (dayOfYear - 80 + 365) % 365;
    const computedDegree = Number(((normalizedEclipticDays / 365) * 360).toFixed(1));
    setEclipticDegree(computedDegree);

    // 3. Kalkulasi Rising Sign (Ascendant) Berdasarkan Waktu Rotasi 24 Jam
    // Sunrise standar ekuator diestimasikan pukul 06:00 (Ascendant = Sun Sign)
    // Setiap 2 jam, horizon timur bergeser 1 zodiak (30 derajat)
    const hourOffset = ((rawHour - 6 + 24) % 24) / 2;
    const risingShiftIndex = Math.floor(hourOffset);
    const risingIndex = (resolvedSun.orderNumber - 1 + risingShiftIndex) % 12;
    setRisingSign(ZODIAC_LIST[risingIndex]);

    // 4. Kalkulasi Moon Sign (Aproksimasi Siklus Tropis Bulan 27.32 Hari)
    const moonPhaseShift = Math.floor(((dayOfYear + (rawYear % 19) * 11) % 27.32) / 2.28);
    const moonIndex = (moonPhaseShift + 3) % 12;
    setMoonSign(ZODIAC_LIST[moonIndex]);

    // 5. Skor Afinitas Elemen Harmonis Internal
    // Evaluasi sinergi antara Sun Sign & Rising Sign
    const isSameElement = resolvedSun.element === ZODIAC_LIST[risingIndex].element;
    const isComplementary =
      (resolvedSun.element === "Api" && ZODIAC_LIST[risingIndex].element === "Udara") ||
      (resolvedSun.element === "Udara" && ZODIAC_LIST[risingIndex].element === "Api") ||
      (resolvedSun.element === "Tanah" && ZODIAC_LIST[risingIndex].element === "Air") ||
      (resolvedSun.element === "Air" && ZODIAC_LIST[risingIndex].element === "Tanah");

    if (isSameElement) {
      setElementAffinityScore(98);
    } else if (isComplementary) {
      setElementAffinityScore(88);
    } else {
      setElementAffinityScore(74);
    }

    setDayProgressInSign(Math.max(1, Math.min(resolvedSun.durationDays, safeDay % 30 || 1)));
  }, [tanggalLahir, bulanLahir, jamLahir, tahunLahir]);

  React.useEffect(() => {
    calculateZodiacProfile();
  }, [calculateZodiacProfile]);

  const handleReset = () => {
    setTanggalLahir(21);
    setBulanLahir(3);
    setJamLahir(6);
    setTahunLahir(2000);
  };

  const handlePresetSelect = (day: number, month: number) => {
    setTanggalLahir(day);
    setBulanLahir(month);
  };

  const renderElementIcon = (element: ZodiacElement, className?: string) => {
    switch (element) {
      case "Api":
        return <Flame className={cn("w-4 h-4 text-rose-400", className)} />;
      case "Tanah":
        return <Mountain className={cn("w-4 h-4 text-emerald-400", className)} />;
      case "Udara":
        return <Wind className={cn("w-4 h-4 text-sky-400", className)} />;
      case "Air":
        return <Droplets className={cn("w-4 h-4 text-cyan-400", className)} />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* ------------------------------------------------------------------ */}
      {/* KARTU FORMULIR PARAMETER INPUT REAL-TIME */}
      {/* ------------------------------------------------------------------ */}
      <Card className="p-6 md:p-8 bg-surface border-border">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">
                  Parameter Kelahiran & Ekliptika
                </h2>
                <p className="text-xs text-secondary">
                  Sinkronisasi parameter tanggal dan waktu real-time melalui URL Query State
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={handleReset}
              className="text-secondary hover:text-primary gap-1.5 text-xs h-9 px-3"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
          </div>

          {/* Grid Input Parameter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Input Tanggal Lahir (1 - 31) */}
            <Input
              type="number"
              label="Tanggal Lahir (1 – 31)"
              min={1}
              max={31}
              value={tanggalLahir ?? 21}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setTanggalLahir(isNaN(val) ? 1 : Math.min(31, Math.max(1, val)));
              }}
              helperText={errorMsg || "Hari kalender Masehi"}
              error={Boolean(errorMsg)}
            />

            {/* Select Bulan Lahir (1 - 12) */}
            <Select
              label="Bulan Lahir (1 – 12)"
              value={bulanLahir ?? 3}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setBulanLahir(isNaN(val) ? 1 : val);
              }}
              helperText="Siklus orbit matahari tahunan"
            >
              {MONTH_NAMES.map((name, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {idx + 1} — {name}
                </option>
              ))}
            </Select>

            {/* Input Jam Lahir (0 - 23) untuk Rising Sign / Ascendant */}
            <Input
              type="number"
              label="Jam Lahir (0 – 23 WIB/Lokal)"
              min={0}
              max={23}
              value={jamLahir ?? 6}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setJamLahir(isNaN(val) ? 0 : Math.min(23, Math.max(0, val)));
              }}
              helperText="Untuk kalkulasi Rising Sign (Ascendant)"
              prefix=""
              suffix="WIB"
            />

            {/* Input Tahun Lahir (1900 - 2100) */}
            <Input
              type="number"
              label="Tahun Lahir"
              min={1900}
              max={2100}
              value={tahunLahir ?? 2000}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setTahunLahir(isNaN(val) ? 2000 : val);
              }}
              helperText="Kalkulasi estimasi orbit lunar"
            />
          </div>

          {/* Quick Preset Selector 12 Zodiak */}
          <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
            <span className="text-xs font-medium text-secondary flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              Pilih Cepat Berdasarkan 12 Tanda Rasi:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ZODIAC_LIST.map((z) => {
                const isSelected = sunSign.id === z.id;
                return (
                  <button
                    key={z.id}
                    onClick={() => {
                      const matchMonth = z.orderNumber === 1 ? 3 : z.orderNumber === 2 ? 4 : z.orderNumber === 3 ? 5 : z.orderNumber === 4 ? 6 : z.orderNumber === 5 ? 7 : z.orderNumber === 6 ? 8 : z.orderNumber === 7 ? 9 : z.orderNumber === 8 ? 10 : z.orderNumber === 9 ? 11 : z.orderNumber === 10 ? 12 : z.orderNumber === 11 ? 1 : 2;
                      const matchDay = 22;
                      handlePresetSelect(matchDay, matchMonth);
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5",
                      isSelected
                        ? "bg-accent text-white border-accent shadow-[0_0_12px_var(--accent-glow)]"
                        : "bg-base/60 text-secondary border-border hover:border-accent/50 hover:text-primary"
                    )}
                  >
                    <span>{z.symbol}</span>
                    <span>{z.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* METRIK NUMERIK OUTPUT UTAMA (OutputBox) */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <OutputBox
          label="Urutan Zodiak Astronomis"
          value={sunSign.orderNumber}
          prefix="Sektor #"
          suffix="/ 12"
          decimals={0}
        />
        <OutputBox
          label="Derajat Longitudo Ekliptika"
          value={eclipticDegree}
          suffix="°"
          decimals={1}
        />
        <OutputBox
          label="Afinitas Harmoni Elemen"
          value={elementAffinityScore}
          suffix="%"
          decimals={0}
        />
        <OutputBox
          label="Rentang Hari Konstelasi"
          value={sunSign.durationDays}
          suffix=" Hari"
          decimals={0}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* HASIL UTAMA: KARTU PROFIL SUN SIGN & KARAKTERISTIK */}
      {/* ------------------------------------------------------------------ */}
      <Card className="p-6 md:p-8 bg-gradient-to-br from-surface to-elevated border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl font-serif pointer-events-none select-none">
          {sunSign.symbol}
        </div>

        <div className="flex flex-col gap-6 relative z-10">
          {/* Header Profil Zodiak */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-4xl shadow-inner">
                {sunSign.symbol}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
                    {sunSign.name}
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold border bg-base/80 text-secondary border-border">
                    {sunSign.latinName}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-secondary mt-0.5">
                  Periode Ekliptika Terstandarisasi: <span className="font-semibold text-primary">{sunSign.dateRangeStr}</span>
                </p>
              </div>
            </div>

            {/* Elemen & Modalitas Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div
                className={cn(
                  "px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold",
                  sunSign.elementBg,
                  sunSign.elementBorder,
                  sunSign.elementColor
                )}
              >
                {renderElementIcon(sunSign.element)}
                <span>Elemen {sunSign.element}</span>
              </div>

              <div className="px-3 py-1.5 rounded-xl border bg-base/70 border-border text-secondary text-xs font-semibold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-accent" />
                <span>Modalitas {sunSign.modality}</span>
              </div>

              <div className="px-3 py-1.5 rounded-xl border bg-base/70 border-border text-secondary text-xs font-semibold flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span>Penguasa: {sunSign.rulingPlanet}</span>
              </div>
            </div>
          </div>

          {/* 3 KATA KUNCI KARAKTERISTIK UTAMA */}
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-secondary">
              3 Pilar Karakteristik Utama (Core Keywords):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sunSign.keywords.map((kw, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-border bg-base/60 flex items-center gap-3 transition-colors hover:border-accent/40"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-sm font-bold">
                    0{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary">{kw}</h4>
                    <p className="text-[11px] text-secondary">Parameter Karakter Esensial</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deskripsi & Ringkasan Kepribadian */}
          <div className="p-4 rounded-xl border border-border/80 bg-base/40 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <Info className="w-4 h-4 text-accent" />
              <span>Deskripsi Esensial Karakter:</span>
            </div>
            <p className="text-xs md:text-sm text-secondary leading-relaxed">
              {sunSign.description}
            </p>
          </div>

          {/* Kekuatan Alami & Potensi Pengembangan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col gap-2">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Kekuatan Alami Terkalibrasi:
              </span>
              <p className="text-xs text-secondary leading-relaxed">
                {sunSign.strengths}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex flex-col gap-2">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                Area Fokus Pengembangan:
              </span>
              <p className="text-xs text-secondary leading-relaxed">
                {sunSign.growthAreas}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* THE BIG THREE ASTROLOGI: SUN, MOON, & RISING SIGN (ASCENDANT) */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-primary">
              Matriks Tiga Serangkai (The Big Three)
            </h3>
            <p className="text-xs text-secondary">
              Kombinasi komprehensif identitas inti (Matahari), dunia emosional (Bulan), dan persona sosial (Rising/Ascendant)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. SUN SIGN CARD */}
          <Card className="p-5 bg-surface border-border flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                    Sun Sign (Matahari)
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                  Inti Diri
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-3xl font-serif text-primary">{sunSign.symbol}</div>
                <div>
                  <h4 className="text-lg font-bold text-primary">{sunSign.name}</h4>
                  <p className="text-xs text-secondary">Elemen {sunSign.element} • {sunSign.modality}</p>
                </div>
              </div>

              <p className="text-xs text-secondary leading-relaxed">
                Merepresentasikan ego dasar, identitas esensial, tujuan hidup, dan energi vital sadar yang Anda pancarkan ke dunia.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-base/60 border border-border text-[11px] text-secondary">
              Kata Kunci: <span className="font-semibold text-primary">{sunSign.keywords.join(", ")}</span>
            </div>
          </Card>

          {/* 2. MOON SIGN CARD */}
          <Card className="p-5 bg-surface border-border flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                    Moon Sign (Bulan)
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                  Emosi & Intuisi
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-3xl font-serif text-primary">{moonSign.symbol}</div>
                <div>
                  <h4 className="text-lg font-bold text-primary">{moonSign.name}</h4>
                  <p className="text-xs text-secondary">Elemen {moonSign.element} • {moonSign.modality}</p>
                </div>
              </div>

              <p className="text-xs text-secondary leading-relaxed">
                Mengatur respons naluriah bawah sadar, kebutuhan rasa aman emosional, memori batin, dan kenyamanan privat.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-base/60 border border-border text-[11px] text-secondary">
              Kata Kunci: <span className="font-semibold text-primary">{moonSign.keywords.join(", ")}</span>
            </div>
          </Card>

          {/* 3. RISING SIGN (ASCENDANT) CARD */}
          <Card className="p-5 bg-surface border-border flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                    Rising Sign (Ascendant)
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                  Persona Luar
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-3xl font-serif text-primary">{risingSign.symbol}</div>
                <div>
                  <h4 className="text-lg font-bold text-primary">{risingSign.name}</h4>
                  <p className="text-xs text-secondary">Elemen {risingSign.element} • Jam {jamLahir ?? 6}:00</p>
                </div>
              </div>

              <p className="text-xs text-secondary leading-relaxed">
                Topeng sosial dan kesan pertama yang dilihat orang lain pada perjumpaan awal, serta cara Anda merespons stimulus lingkungan baru.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-base/60 border border-border text-[11px] text-secondary">
              Kata Kunci: <span className="font-semibold text-primary">{risingSign.keywords.join(", ")}</span>
            </div>
          </Card>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TABEL KOMPATIBILITAS & AFINITAS ZODIAK PASANGAN */}
      {/* ------------------------------------------------------------------ */}
      <Card className="p-6 md:p-8 bg-surface border-border flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary">
                Matriks Kompatibilitas Elemen & Zodiak Selaras
              </h3>
              <p className="text-xs text-secondary">
                Daftar tanda zodiak dengan afinitas resonansi energi paling harmonis
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sunSign.compatibleSigns.map((signName, idx) => {
            const matched = ZODIAC_LIST.find((z) => z.name === signName);
            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-border bg-base/50 flex items-center justify-between hover:border-accent/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-serif text-primary">
                    {matched?.symbol || "★"}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-primary">{signName}</h4>
                    <p className="text-[11px] text-secondary">Elemen {matched?.element}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/20">
                  Harmonis
                </span>
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-xl border border-border/80 bg-base/40 text-xs text-secondary leading-relaxed">
          <strong className="text-primary">Panduan Interaksi Elemen:</strong> Zodiak berelemen{" "}
          <strong className="text-primary">{sunSign.element}</strong> memiliki resonansi alami paling kuat saat berinteraksi dengan sesama tanda {sunSign.element} serta elemen komplementernya ({sunSign.element === "Api" || sunSign.element === "Udara" ? "Api & Udara" : "Tanah & Air"}). Kombinasi ini menghasilkan dinamika komunikasi lancar dan keselarasan visi hidup jangka panjang.
        </div>
      </Card>
    </div>
  );
}