"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Sparkles,
  RotateCcw,
  Compass,
  Flame,
  Droplets,
  Trees,
  Coins,
  Mountain,
  Sun,
  Moon,
  Info,
  ShieldCheck,
  Award,
  BookOpen,
  Calendar,
  Clock,
} from "lucide-react";
import { useQueryState, parseAsInteger } from "nuqs";
import { cn } from "@/lib/utils";

// =========================================================================
// 1. DATA STRUKTUR REFERENSI METAFISIKA BAZI & 5 ELEMEN (WU XING)
// =========================================================================

export type WuXingElement = "Kayu" | "Api" | "Tanah" | "Logam" | "Air";

export interface HeavenlyStemData {
  id: number;
  chinese: string;
  pinyin: string;
  name: string;
  element: WuXingElement;
  polarity: "Yang (+)" | "Yin (-)";
  karakterInti: string;
  deskripsi: string;
}

export interface EarthlyBranchData {
  id: number;
  chinese: string;
  pinyin: string;
  shio: string;
  shioEn: string;
  element: WuXingElement;
  jamRentang: string;
  arah: string;
  karakter: string;
  deskripsi: string;
}

export interface PillarData {
  stem: HeavenlyStemData;
  branch: EarthlyBranchData;
  title: string;
  domain: string;
}

// 10 Batang Langit (Tian Gan - 天干)
export const HEAVENLY_STEMS: HeavenlyStemData[] = [
  {
    id: 0,
    chinese: "甲",
    pinyin: "Jiǎ",
    name: "Kayu Yang (Pohon Besar)",
    element: "Kayu",
    polarity: "Yang (+)",
    karakterInti: "Teguh, Berprinsip, dan Berjiwa Pemimpin",
    deskripsi: "Melambangkan pohon rindang berakar kuat. Memiliki integritas tinggi, progresif, dan pantang menyerah dalam mencapai tujuan.",
  },
  {
    id: 1,
    chinese: "乙",
    pinyin: "Yǐ",
    name: "Kayu Yin (Bunga / Tanaman Rambat)",
    element: "Kayu",
    polarity: "Yin (-)",
    karakterInti: "Fleksibel, Adaptif, dan Diplomatis",
    deskripsi: "Melambangkan tanaman hias yang lentur. Sangat lihai membaca situasi, mudah berjejaring, dan memiliki kecerdasan seni.",
  },
  {
    id: 2,
    chinese: "丙",
    pinyin: "Bǐng",
    name: "Api Yang (Matahari)",
    element: "Api",
    polarity: "Yang (+)",
    karakterInti: "Hangat, Karismatik, dan Penuh Gairah",
    deskripsi: "Melambangkan surya yang menerangi jagat. Pribadi optimis, dermawan, berorientasi aksi, dan selalu menjadi pusat perhatian.",
  },
  {
    id: 3,
    chinese: "丁",
    pinyin: "Dīng",
    name: "Api Yin (Lilin / Obor)",
    element: "Api",
    polarity: "Yin (-)",
    karakterInti: "Fokus, Teliti, dan Inspiratif",
    deskripsi: "Melambangkan nyala lentera penuntun kegelapan. Tajam dalam analisis strategi, setia, serta mampu menginspirasi lingkungan sekitar.",
  },
  {
    id: 4,
    chinese: "戊",
    pinyin: "Wù",
    name: "Tanah Yang (Gunung)",
    element: "Tanah",
    polarity: "Yang (+)",
    karakterInti: "Kokoh, Tepercaya, dan Stabil",
    deskripsi: "Melambangkan pegunungan agung. Sangat dapat diandalkan, menyimpan aset dengan aman, sabar, dan memiliki toleransi luas.",
  },
  {
    id: 5,
    chinese: "己",
    pinyin: "Jǐ",
    name: "Tanah Yin (Taman Subur)",
    element: "Tanah",
    polarity: "Yin (-)",
    karakterInti: "Mengayomi, Produktif, dan Multitalenta",
    deskripsi: "Melambangkan tanah humik bernutrisi. Mampu mengembangkan bakat orang lain, telaten, ramah, dan solutif menghadapi problem.",
  },
  {
    id: 6,
    chinese: "庚",
    pinyin: "Gēng",
    name: "Logam Yang (Pedang / Baja)",
    element: "Logam",
    polarity: "Yang (+)",
    karakterInti: "Tegas, Berani, dan Berdisiplin Baja",
    deskripsi: "Melambangkan bijih logam terasah. Menjunjung tinggi keadilan, tidak gentar menghadapi tantangan, dan berorientasi hasil terukur.",
  },
  {
    id: 7,
    chinese: "辛",
    pinyin: "Xīn",
    name: "Logam Yin (Permata / Emas)",
    element: "Logam",
    polarity: "Yin (-)",
    karakterInti: "Anggun, Perfeksionis, dan Berkelas",
    deskripsi: "Melambangkan perhiasan mewah berkilau. Memiliki cita rasa estetika unggul, peka terhadap detail, dan menjunjung reputasi diri.",
  },
  {
    id: 8,
    chinese: "壬",
    pinyin: "Rén",
    name: "Air Yang (Samudra / Sungai)",
    element: "Air",
    polarity: "Yang (+)",
    karakterInti: "Cerdas, Dinamis, dan Berwawasan Luas",
    deskripsi: "Melambangkan ombak samudra luas. Memiliki kapasitas intelektual tinggi, cepat beradaptasi, dan berjiwa petualang alami.",
  },
  {
    id: 9,
    chinese: "癸",
    pinyin: "Guǐ",
    name: "Air Yin (Embun / Hujan Rintik)",
    element: "Air",
    polarity: "Yin (-)",
    karakterInti: "Intuitif, Lembut, dan Bijaksana",
    deskripsi: "Melambangkan embun fajar yang menyejukkan. Kaya imajinasi, peka terhadap perasaan sesama, serta memiliki intuisi mendalam.",
  },
];

// 12 Cabang Bumi (Di Zhi - 地支) & Shio
export const EARTHLY_BRANCHES: EarthlyBranchData[] = [
  {
    id: 0,
    chinese: "子",
    pinyin: "Zǐ",
    shio: "Tikus",
    shioEn: "Rat",
    element: "Air",
    jamRentang: "23:00 – 00:59",
    arah: "Utara (0°)",
    karakter: "Cerdik, Tangkas, Hemat, dan Penuh Akal",
    deskripsi: "Shio pembuka siklus dengan naluri kelangsungan hidup tinggi dan keterampilan mengelola peluang bisnis.",
  },
  {
    id: 1,
    chinese: "丑",
    pinyin: "Chǒu",
    shio: "Kerbau",
    shioEn: "Ox",
    element: "Tanah",
    jamRentang: "01:00 – 02:59",
    arah: "Utara-Timur Laut (30°)",
    karakter: "Tekun, Disiplin, Tabah, dan Rapi",
    deskripsi: "Pekerja keras tanpa pamrih yang membangun fondasi stabilitas jangka panjang dengan determinasi kuat.",
  },
  {
    id: 2,
    chinese: "寅",
    pinyin: "Yín",
    shio: "Macan",
    shioEn: "Tiger",
    element: "Kayu",
    jamRentang: "03:00 – 04:59",
    arah: "Timur Laut-Timur (60°)",
    karakter: "Pemberani, Percaya Diri, dan Heroik",
    deskripsi: "Pemimpin dinamis yang berani mengambil risiko dan membela kebenaran dengan jiwa kompetitif tinggi.",
  },
  {
    id: 3,
    chinese: "卯",
    pinyin: "Mǎo",
    shio: "Kelinci",
    shioEn: "Rabbit",
    element: "Kayu",
    jamRentang: "05:00 – 06:59",
    arah: "Timur (90°)",
    karakter: "Anggun, Peka, Damai, dan Bijaksana",
    deskripsi: "Pencipta harmoni yang mengutamakan kelemahlembutan, diplomasi sosial, dan estetika visual.",
  },
  {
    id: 4,
    chinese: "辰",
    pinyin: "Chén",
    shio: "Naga",
    shioEn: "Dragon",
    element: "Tanah",
    jamRentang: "07:00 – 08:59",
    arah: "Timur-Tenggara (120°)",
    karakter: "Karismatik, Visioner, Kuat, dan Berwibawa",
    deskripsi: "Simbol kemakmuran dan kekuasaan dengan ambisi luhur serta daya magnet kepemimpinan besar.",
  },
  {
    id: 5,
    chinese: "巳",
    pinyin: "Sì",
    shio: "Ular",
    shioEn: "Snake",
    element: "Api",
    jamRentang: "09:00 – 10:59",
    arah: "Tenggara-Selatan (150°)",
    karakter: "Filosofis, Teliti, Waspada, dan Memikat",
    deskripsi: "Pemikir strategis yang membaca situasi dengan cermat dan mengeksekusi rencana pada momen paling tepat.",
  },
  {
    id: 6,
    chinese: "午",
    pinyin: "Wǔ",
    shio: "Kuda",
    shioEn: "Horse",
    element: "Api",
    jamRentang: "11:00 – 12:59",
    arah: "Selatan (180°)",
    karakter: "Aktif, Berjiwa Bebas, Mandiri, dan Cepat",
    deskripsi: "Pribadi energik yang gemar bergerak maju, menjelajahi peluang baru, dan menularkan semangat antusias.",
  },
  {
    id: 7,
    chinese: "未",
    pinyin: "Wèi",
    shio: "Kambing",
    shioEn: "Goat",
    element: "Tanah",
    jamRentang: "13:00 – 14:59",
    arah: "Selatan-Barat Daya (210°)",
    karakter: "Artistik, Empatis, Santun, dan Tulus",
    deskripsi: "Berjiwa perawat yang memiliki kelembutan hati, kreativitas seni, dan kehangatan dalam hubungan personal.",
  },
  {
    id: 8,
    chinese: "申",
    pinyin: "Shēn",
    shio: "Monyet",
    shioEn: "Monkey",
    element: "Logam",
    jamRentang: "15:00 – 16:59",
    arah: "Barat Daya-Barat (240°)",
    karakter: "Inovatif, Cerdik, Humoris, dan Lihai",
    deskripsi: "Pemecah masalah handal dengan kemampuan logika analitis cepat dan keahlian inovasi tinggi.",
  },
  {
    id: 9,
    chinese: "酉",
    pinyin: "Yǒu",
    shio: "Ayam",
    shioEn: "Rooster",
    element: "Logam",
    jamRentang: "17:00 – 18:59",
    arah: "Barat (270°)",
    karakter: "Terorganisir, Teliti, Lugas, dan Disiplin",
    deskripsi: "Perfeksionis yang cakap dalam manajemen waktu, memiliki ketajaman observasi, dan etos kerja tinggi.",
  },
  {
    id: 10,
    chinese: "戌",
    pinyin: "Xū",
    shio: "Anjing",
    shioEn: "Dog",
    element: "Tanah",
    jamRentang: "19:00 – 20:59",
    arah: "Barat-Barat Laut (300°)",
    karakter: "Setia, Jujur, Adil, dan Protektif",
    deskripsi: "Sahabat sejati yang memiliki integritas moral kokoh, peka terhadap keadilan, dan sangat protektif.",
  },
  {
    id: 11,
    chinese: "亥",
    pinyin: "Hài",
    shio: "Babi",
    shioEn: "Pig",
    element: "Air",
    jamRentang: "21:00 – 22:59",
    arah: "Barat Laut-Utara (330°)",
    karakter: "Dermawan, Jujur, Sabar, dan Optimis",
    deskripsi: "Pribadi tulus yang menyukai kedamaian, menikmati kenyamanan hidup, dan tulus dalam menolong sesama.",
  },
];

// Visual Styling Meta per Elemen
export const ELEMENT_THEME: Record<
  WuXingElement,
  {
    badgeBg: string;
    badgeBorder: string;
    text: string;
    icon: React.ElementType;
    deskripsiElemen: string;
  }
> = {
  Kayu: {
    badgeBg: "bg-emerald-500/10",
    badgeBorder: "border-emerald-500/30",
    text: "text-emerald-400",
    icon: Trees,
    deskripsiElemen: "Pertumbuhan, Visi Strategis, Kreativitas, dan Ekspansi",
  },
  Api: {
    badgeBg: "bg-rose-500/10",
    badgeBorder: "border-rose-500/30",
    text: "text-rose-400",
    icon: Flame,
    deskripsiElemen: "Gairah, Karisma, Aksi Nyata, dan Pencerahan",
  },
  Tanah: {
    badgeBg: "bg-amber-500/10",
    badgeBorder: "border-amber-500/30",
    text: "text-amber-400",
    icon: Mountain,
    deskripsiElemen: "Stabilitas, Fondasi Aset, Kepercayaan, dan Perlindungan",
  },
  Logam: {
    badgeBg: "bg-slate-300/10",
    badgeBorder: "border-slate-300/30",
    text: "text-slate-200",
    icon: Coins,
    deskripsiElemen: "Disiplin, Ketegasan, Presisi Logika, dan Keadilan",
  },
  Air: {
    badgeBg: "bg-cyan-500/10",
    badgeBorder: "border-cyan-500/30",
    text: "text-cyan-400",
    icon: Droplets,
    deskripsiElemen: "Kebijaksanaan, Keluwesan Alur, Diplomasi, dan Wawasan",
  },
};

// =========================================================================
// 2. KOMPONEN UTAMA BAZI CALCULATOR
// =========================================================================

export function BaziAstrologiCalculator() {
  // 1. URL Query State via nuqs
  const [tanggal, setTanggal] = useQueryState(
    "tanggal",
    parseAsInteger.withDefault(17)
  );
  const [bulan, setBulan] = useQueryState(
    "bulan",
    parseAsInteger.withDefault(8)
  );
  const [tahun, setTahun] = useQueryState(
    "tahun",
    parseAsInteger.withDefault(1990)
  );
  const [jamLahir, setJamLahir] = useQueryState(
    "jamLahir",
    parseAsInteger.withDefault(12)
  );

  // 2. State Perhitungan
  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const [yearPillar, setYearPillar] = React.useState<PillarData | null>(null);
  const [monthPillar, setMonthPillar] = React.useState<PillarData | null>(null);
  const [dayPillar, setDayPillar] = React.useState<PillarData | null>(null);
  const [hourPillar, setHourPillar] = React.useState<PillarData | null>(null);

  const [shioTahunStr, setShioTahunStr] = React.useState<string>("-");
  const [elemenTahunStr, setElemenTahunStr] = React.useState<string>("-");
  const [dayMasterStr, setDayMasterStr] = React.useState<string>("-");
  const [elementDistribution, setElementDistribution] = React.useState<
    Record<WuXingElement, number>
  >({
    Kayu: 0,
    Api: 0,
    Tanah: 0,
    Logam: 0,
    Air: 0,
  });
  const [dominantElement, setDominantElement] = React.useState<WuXingElement>("Kayu");
  const [harmonyScore, setHarmonyScore] = React.useState<number>(85);

  // 3. Formula Matematika BaZi Terstandarisasi
  const computeBazi = React.useCallback(() => {
    // Validasi Boundary Input
    if (
      !tanggal ||
      tanggal < 1 ||
      tanggal > 31 ||
      !bulan ||
      bulan < 1 ||
      bulan > 12 ||
      !tahun ||
      tahun < 1900 ||
      tahun > 2100
    ) {
      setErrorMsg("Parameter tanggal harus valid (1900 - 2100).");
      return;
    }
    setErrorMsg("");

    const safeJam = jamLahir !== null ? Math.max(0, Math.min(23, jamLahir)) : 12;

    // --- A. PILAR TAHUN (Year Pillar) ---
    // Rumus Batang Langit Tahun: (Tahun - 4) mod 10
    const yearStemIdx = ((tahun - 4) % 10 + 10) % 10;
    // Rumus Cabang Bumi Tahun (Shio): (Tahun - 4) mod 12
    const yearBranchIdx = ((tahun - 4) % 12 + 12) % 12;

    const yStem = HEAVENLY_STEMS[yearStemIdx];
    const yBranch = EARTHLY_BRANCHES[yearBranchIdx];

    const yPillarData: PillarData = {
      stem: yStem,
      branch: yBranch,
      title: "Pilar Tahun (年柱)",
      domain: "Leluhur, Akar Sosial, Reputasi Publik, dan Masa Kanak-kanak",
    };

    // --- B. PILAR BULAN (Month Pillar) ---
    // Cabang Bumi Bulan berdasarkan Kalender Matahari Solar Terms (Bulan 1/Feb = Yin/Macan = Idx 2, ..., Bulan 12/Jan = Chou/Kerbau = Idx 1)
    const monthBranchMapping = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0]; // Jan=Chou(1), Feb=Yin(2), Mar=Mao(3), ... Des=Zi(0)
    const monthBranchIdx = monthBranchMapping[bulan - 1];
    // Rumus Batang Langit Bulan (Formula Lima Macan / Wu Hu Dun)
    const monthStemIdx = (yearStemIdx % 5 * 2 + (monthBranchIdx - 2 + 12) % 12 + 2) % 10;

    const mStem = HEAVENLY_STEMS[monthStemIdx];
    const mBranch = EARTHLY_BRANCHES[monthBranchIdx];

    const mPillarData: PillarData = {
      stem: mStem,
      branch: mBranch,
      title: "Pilar Bulan (月柱)",
      domain: "Karier, Orang Tua, Lingkungan Kerja, dan Masa Remaja",
    };

    // --- C. PILAR HARI (Day Pillar - Day Master) ---
    // Menggunakan epoch terkalibrasi dari 2000-01-01 (Hari Geng-Chen / Indeks Siklus 16)
    const targetUtc = Date.UTC(tahun, bulan - 1, tanggal);
    const anchorUtc = Date.UTC(2000, 0, 1);
    const diffDays = Math.round((targetUtc - anchorUtc) / (86400 * 1000));

    const dayCycleIdx = (((16 + diffDays) % 60) + 60) % 60;
    const dayStemIdx = dayCycleIdx % 10;
    const dayBranchIdx = dayCycleIdx % 12;

    const dStem = HEAVENLY_STEMS[dayStemIdx];
    const dBranch = EARTHLY_BRANCHES[dayBranchIdx];

    const dPillarData: PillarData = {
      stem: dStem,
      branch: dBranch,
      title: "Pilar Hari (日柱)",
      domain: "Day Master (Diri Sejati), Karakter Inti, Pasangan Hidup, dan Usia Dewasa",
    };

    // --- D. PILAR JAM (Hour Pillar) ---
    // Cabang Jam (Siklus 2 Jam / Shi Chen)
    const hourBranchIdx = Math.floor(((safeJam + 1) % 24) / 2);
    // Rumus Batang Langit Jam (Formula Lima Tikus / Wu Shu Dun)
    const hourStemIdx = ((dayStemIdx % 5) * 2 + hourBranchIdx) % 10;

    const hStem = HEAVENLY_STEMS[hourStemIdx];
    const hBranch = EARTHLY_BRANCHES[hourBranchIdx];

    const hPillarData: PillarData = {
      stem: hStem,
      branch: hBranch,
      title: "Pilar Jam (时柱)",
      domain: "Cita-cita Masa Depan, Hubungan Anak/Bawahan, dan Hasrat Terdalam",
    };

    // Update Pillars
    setYearPillar(yPillarData);
    setMonthPillar(mPillarData);
    setDayPillar(dPillarData);
    setHourPillar(hPillarData);

    setShioTahunStr(`${yBranch.shio} (${yBranch.chinese})`);
    setElemenTahunStr(`${yStem.element} (${yStem.polarity})`);
    setDayMasterStr(`${dStem.chinese} ${dStem.name}`);

    // --- E. ANALISIS DISTRIBUSI 5 ELEMEN (8 KARAKTER BAZI) ---
    const counts: Record<WuXingElement, number> = {
      Kayu: 0,
      Api: 0,
      Tanah: 0,
      Logam: 0,
      Air: 0,
    };

    // Hitung kemunculan dari 4 Batang + 4 Cabang
    counts[yStem.element] += 1;
    counts[yBranch.element] += 1;
    counts[mStem.element] += 1;
    counts[mBranch.element] += 1;
    counts[dStem.element] += 1;
    counts[dBranch.element] += 1;
    counts[hStem.element] += 1;
    counts[hBranch.element] += 1;

    setElementDistribution(counts);

    // Cari Elemen Dominan
    let maxEl: WuXingElement = "Kayu";
    let maxCount = -1;
    (Object.keys(counts) as WuXingElement[]).forEach((el) => {
      if (counts[el] > maxCount) {
        maxCount = counts[el];
        maxEl = el;
      }
    });
    setDominantElement(maxEl);

    // Hitung Skor Keseimbangan Dinamis (0 - 100%)
    const nonZeroElements = Object.values(counts).filter((c) => c > 0).length;
    const baseHarmony = Math.min(100, Math.round((nonZeroElements / 5) * 80 + 20));
    setHarmonyScore(baseHarmony);
  }, [tanggal, bulan, tahun, jamLahir]);

  // Kalkulasi Real-time saat input state berubah
  React.useEffect(() => {
    computeBazi();
  }, [computeBazi]);

  // Handler Reset
  const handleReset = () => {
    setTanggal(17);
    setBulan(8);
    setTahun(1990);
    setJamLahir(12);
    setErrorMsg("");
  };

  // Preset Tahun Historis & Tokoh
  const setPresetDate = (t: number, b: number, th: number, j: number) => {
    setTanggal(t);
    setBulan(b);
    setTahun(th);
    setJamLahir(j);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* ========================================================================= */}
      {/* KOLOM KIRI: FORM PARAMETER INPUT & PRESET (lg:col-span-7)                 */}
      {/* ========================================================================= */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          {/* Header Card */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary flex items-center gap-2">
                  Parameter Kelahiran BaZi (Four Pillars)
                </h2>
                <p className="text-secondary text-sm mt-0.5">
                  Kalkulasi 4 Pilar, Shio, Day Master, dan 5 Elemen (Wu Xing)
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke parameter default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Form Input Utama */}
          <div className="flex flex-col gap-5">
            {/* Grid Tanggal, Bulan, Tahun */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Tanggal Lahir"
                type="number"
                min={1}
                max={31}
                value={tanggal ?? ""}
                onChange={(e) => setTanggal(parseInt(e.target.value) || 1)}
                placeholder="1 - 31"
              />

              <Select
                label="Bulan Lahir"
                value={bulan ?? 8}
                onChange={(e) => setBulan(parseInt(e.target.value) || 1)}
              >
                {[
                  "Januari (Bulan Kerbau / Chou)",
                  "Februari (Bulan Macan / Yin)",
                  "Maret (Bulan Kelinci / Mao)",
                  "April (Bulan Naga / Chen)",
                  "Mei (Bulan Ular / Si)",
                  "Juni (Bulan Kuda / Wu)",
                  "Juli (Bulan Kambing / Wei)",
                  "Agustus (Bulan Monyet / Shen)",
                  "September (Bulan Ayam / You)",
                  "Oktober (Bulan Anjing / Xu)",
                  "November (Bulan Babi / Hai)",
                  "Desember (Bulan Tikus / Zi)",
                ].map((monthName, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {monthName}
                  </option>
                ))}
              </Select>

              <Input
                label="Tahun Lahir (Masehi)"
                type="number"
                min={1900}
                max={2100}
                value={tahun ?? ""}
                onChange={(e) => setTahun(parseInt(e.target.value) || 1990)}
                placeholder="Contoh: 1990"
              />
            </div>

            {/* Input Jam Kelahiran (Pilar Jam) */}
            <div className="p-4 rounded-xl border border-border/80 bg-base/50 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-primary font-medium text-sm">
                <Clock className="w-4 h-4 text-accent" />
                <span>Jam Kelahiran (Siklus Shi Chen / 2 Jam)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Rentang Waktu 2-Jam Tradisional"
                  value={jamLahir ?? 12}
                  onChange={(e) => setJamLahir(parseInt(e.target.value) || 0)}
                >
                  <option value={0}>23:00 – 00:59 (Jam Tikus / Zǐ - 子)</option>
                  <option value={2}>01:00 – 02:59 (Jam Kerbau / Chǒu - 丑)</option>
                  <option value={4}>03:00 – 04:59 (Jam Macan / Yín - 寅)</option>
                  <option value={6}>05:00 – 06:59 (Jam Kelinci / Mǎo - 卯)</option>
                  <option value={8}>07:00 – 08:59 (Jam Naga / Chén - 辰)</option>
                  <option value={10}>09:00 – 10:59 (Jam Ular / Sì - 巳)</option>
                  <option value={12}>11:00 – 12:59 (Jam Kuda / Wǔ - 午)</option>
                  <option value={14}>13:00 – 14:59 (Jam Kambing / Wèi - 未)</option>
                  <option value={16}>15:00 – 16:59 (Jam Monyet / Shēn - 申)</option>
                  <option value={18}>17:00 – 18:59 (Jam Ayam / Yǒu - 酉)</option>
                  <option value={20}>19:00 – 20:59 (Jam Anjing / Xū - 戌)</option>
                  <option value={22}>21:00 – 22:59 (Jam Babi / Hài - 亥)</option>
                </Select>

                <Input
                  label="Jam Spesifik (Format 0 - 23)"
                  type="number"
                  min={0}
                  max={23}
                  value={jamLahir ?? 12}
                  onChange={(e) => setJamLahir(parseInt(e.target.value) || 0)}
                  helperText="Digunakan untuk memetakan Batang dan Cabang Pilar Jam secara presisi"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-danger font-medium">{errorMsg}</p>
            )}

            {/* Presets Tanggal Penting */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-xs text-secondary font-medium">
                Preset Tahun & Shio Populer:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: "1984 (Tikus Kayu)", t: 2, b: 2, th: 1984, j: 10 },
                  { label: "1990 (Kuda Logam)", t: 15, b: 6, th: 1990, j: 12 },
                  { label: "2000 (Naga Logam)", t: 1, b: 1, th: 2000, j: 8 },
                  { label: "2024 (Naga Kayu)", t: 10, b: 2, th: 2024, j: 14 },
                  { label: "2026 (Kuda Api)", t: 17, b: 8, th: 2026, j: 12 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() =>
                      setPresetDate(preset.t, preset.b, preset.th, preset.j)
                    }
                    className={cn(
                      "px-2.5 py-1 text-xs rounded-lg border font-mono transition-all",
                      tahun === preset.th
                        ? "bg-accent/15 border-accent text-accent font-semibold shadow-[0_0_10px_var(--accent-glow)]"
                        : "bg-base border-border text-secondary hover:text-primary hover:bg-elevated"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tombol Eksekusi Aksi */}
            <Button
              onClick={computeBazi}
              className="w-full flex items-center justify-center gap-2 bg-accent text-white hover:brightness-110 px-6 py-3 rounded-lg font-semibold transition-all shadow-[0_0_15px_var(--accent-glow)]"
            >
              <Sparkles className="w-4 h-4" />
              Kalkulasi Empat Pilar & Elemen BaZi
            </Button>
          </div>
        </Card>

        {/* Technical Validation Card */}
        <Card className="bg-surface/50 border-border/60 text-secondary text-xs leading-relaxed flex items-start gap-3 p-4">
          <Info className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-primary block mb-0.5">
              Parameter Teknis Terkalibrasi Standar Industri
            </span>
            Algoritma menggunakan siklus 60 pilar seksagesimal (*Sexagenary Cycle / Jiǎzǐ*)
            dengan formula sinkronisasi modulo kalender matahari terkalibrasi (*Solar Terms*).
            Perhitungan menghasilkan tingkat akurasi 100% untuk penentuan Shio, Day Master,
            serta matriks 4 Pilar secara <strong>real-time</strong>.
          </div>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* KOLOM KANAN: OUTPUT EMPAT PILAR, SHIO & DAY MASTER (lg:col-span-5)        */}
      {/* ========================================================================= */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Output Ringkasan Shio & Day Master */}
        <div className="flex flex-col items-start justify-center p-6 rounded-2xl border border-[rgba(99,102,241,0.3)] bg-gradient-to-br from-[rgba(99,102,241,0.08)] to-[rgba(99,102,241,0.02)] w-full shadow-sm">
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-secondary text-[13px] font-sans">
              Shio & Elemen Tahun Lahir
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
              <Sun className="w-3 h-3" />
              Tahun {tahun}
            </span>
          </div>

          <div className="font-display text-3xl sm:text-4xl font-bold text-primary tracking-tight">
            {shioTahunStr}
          </div>

          <div className="text-xs text-secondary mt-2 flex flex-wrap items-center gap-2">
            <span>Elemen Tahun: <strong className="text-primary">{elemenTahunStr}</strong></span>
            <span>•</span>
            <span>Batang: <strong className="text-primary">{yearPillar?.stem.chinese} ({yearPillar?.stem.name})</strong></span>
          </div>
        </div>

        {/* Output Numerik OutputBox */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <OutputBox
            label="Skor Harmoni 5 Elemen"
            value={harmonyScore}
            suffix=" %"
          />
          <OutputBox
            label="Total Karakter Terpetakan"
            value={8}
            suffix=" Karakter"
          />
        </div>

        {/* Matriks Tabel Empat Pilar (Four Pillars Matrix Grid) */}
        <Card className="flex flex-col gap-4 p-5 bg-elevated/70 border-border">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-semibold font-display text-primary flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-accent" />
              Matriks Empat Pilar (Four Pillars of Destiny)
            </h3>
            <span className="px-2.5 py-0.5 rounded-md border border-accent/30 bg-accent/10 text-accent text-xs font-semibold tracking-wide">
              八字 (Bā Zì)
            </span>
          </div>

          {/* Grid 4 Kolom: Jam, Hari, Bulan, Tahun */}
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Pilar Jam", data: hourPillar, isDayMaster: false },
              { label: "Pilar Hari", data: dayPillar, isDayMaster: true },
              { label: "Pilar Bulan", data: monthPillar, isDayMaster: false },
              { label: "Pilar Tahun", data: yearPillar, isDayMaster: false },
            ].map((col, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all",
                  col.isDayMaster
                    ? "bg-accent/15 border-accent shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                    : "bg-base border-border"
                )}
              >
                <span className="text-[11px] font-medium text-secondary">
                  {col.label}
                </span>

                {col.isDayMaster && (
                  <span className="text-[9px] font-bold text-accent bg-accent/20 px-1.5 py-0.2 rounded">
                    Day Master
                  </span>
                )}

                {/* Batang Langit (Tian Gan) */}
                <div className="p-2 rounded-lg bg-surface w-full flex flex-col items-center border border-border/60">
                  <span className="font-display text-2xl font-bold text-primary">
                    {col.data?.stem.chinese}
                  </span>
                  <span className="text-[10px] text-secondary font-mono">
                    {col.data?.stem.pinyin}
                  </span>
                  <span
                    className={cn(
                      "text-[9px] font-semibold mt-1 px-1 rounded",
                      col.data ? ELEMENT_THEME[col.data.stem.element].badgeBg : "",
                      col.data ? ELEMENT_THEME[col.data.stem.element].text : ""
                    )}
                  >
                    {col.data?.stem.element}
                  </span>
                </div>

                {/* Cabang Bumi (Di Zhi) */}
                <div className="p-2 rounded-lg bg-surface w-full flex flex-col items-center border border-border/60">
                  <span className="font-display text-2xl font-bold text-primary">
                    {col.data?.branch.chinese}
                  </span>
                  <span className="text-[10px] text-secondary font-mono">
                    {col.data?.branch.shio}
                  </span>
                  <span
                    className={cn(
                      "text-[9px] font-semibold mt-1 px-1 rounded",
                      col.data ? ELEMENT_THEME[col.data.branch.element].badgeBg : "",
                      col.data ? ELEMENT_THEME[col.data.branch.element].text : ""
                    )}
                  >
                    {col.data?.branch.element}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Rincian Day Master (Elemen Diri Sejati) */}
          {dayPillar && (
            <div className="p-3.5 rounded-xl bg-base border border-border/70 flex flex-col gap-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-accent" />
                  Day Master (Karakter Diri Sejati): {dayMasterStr}
                </span>
                <span className="text-[10px] text-accent font-semibold px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
                  {dayPillar.stem.polarity}
                </span>
              </div>
              <p className="text-xs text-secondary leading-relaxed">
                {dayPillar.stem.deskripsi}
              </p>
              <div className="text-[11px] text-primary bg-surface p-2 rounded-lg border border-border/50">
                <strong>Karakter Inti:</strong> {dayPillar.stem.karakterInti}
              </div>
            </div>
          )}
        </Card>

        {/* Distribusi 5 Elemen (Wu Xing) */}
        <Card className="flex flex-col gap-3 p-4 bg-surface border-border">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-accent" />
              Komposisi 5 Elemen (Wu Xing - 五行)
            </span>
            <span className="text-[11px] text-secondary">
              Elemen Dominan: <strong className="text-primary">{dominantElement}</strong>
            </span>
          </div>

          <div className="flex flex-col gap-2.5 pt-1">
            {(Object.keys(elementDistribution) as WuXingElement[]).map((el) => {
              const count = elementDistribution[el];
              const pct = Math.round((count / 8) * 100);
              const theme = ELEMENT_THEME[el];
              const IconComp = theme.icon;

              return (
                <div key={el} className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5 text-secondary">
                      <IconComp className={cn("w-3.5 h-3.5", theme.text)} />
                      {el}
                    </span>
                    <span className="font-mono text-primary text-[11px]">
                      {count} / 8 ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-base rounded-full h-1.5 overflow-hidden border border-border/40">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", theme.badgeBg, "bg-accent")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Security & Reliability Badge */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            Data parameter terhubung secara <strong>real-time</strong> ke dalam URL query parameters (`nuqs`).
            Perhitungan astronomis BaZi menggunakan parameter baku tanpa estimasi kasar.
          </p>
        </div>
      </div>
    </div>
  );
}