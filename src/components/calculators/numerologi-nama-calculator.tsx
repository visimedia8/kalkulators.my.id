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
  User,
  Heart,
  Shield,
  BookOpen,
  Award,
  Info,
  CheckCircle2,
  Copy,
  Check,
  Hash,
  Compass,
  Star,
  Zap,
} from "lucide-react";
import { useQueryState, parseAsString } from "nuqs";
import { cn } from "@/lib/utils";

// --- MATRIKS SISTEM NUMEROLOGI PYTHAGORAS ---

const PYTHAGOREAN_TABLE: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9,
};

const VOWEL_SET = new Set(["A", "E", "I", "O", "U"]);

export interface LetterBreakdown {
  char: string;
  value: number;
  isVowel: boolean;
}

export interface NumerologyInterpretation {
  archetype: string;
  title: string;
  destinySummary: string;
  soulUrgeSummary: string;
  personalitySummary: string;
  strengths: string[];
  growthAreas: string[];
  color: string;
  badgeBg: string;
  badgeBorder: string;
}

export const NUMEROLOGY_INTERPRETATIONS: Record<number, NumerologyInterpretation> = {
  1: {
    archetype: "Sang Pelopor & Pemimpin Mandiri",
    title: "Inisiator Visioner",
    destinySummary:
      "Tujuan hidup berpusat pada kepemimpinan mandiri, inovasi orisinal, keberanian merintis jalur baru, dan menjadi pionir di bidang keahlian.",
    soulUrgeSummary:
      "Hasrat batin terdalam adalah kebebasan mutlak untuk mengambil inisiatif, diakui atas gagasan otentik, dan tidak berada di bawah dominasi orang lain.",
    personalitySummary:
      "Dipandang oleh lingkungan luar sebagai figur yang tegas, berkarisma kuat, percaya diri, dinamis, dan memiliki determinasi tinggi.",
    strengths: ["Kepemimpinan proaktif", "Kemandirian berpikir", "Daya cipta orisinal", "Determinasi kokoh"],
    growthAreas: ["Mengurangi dominasi sepihak", "Meningkatkan kesabaran terhadap proses delegasi"],
    color: "text-rose-400",
    badgeBg: "bg-rose-500/10",
    badgeBorder: "border-rose-500/30",
  },
  2: {
    archetype: "Sang Diplomat & Pembawa Damai",
    title: "Kolega Harmonis",
    destinySummary:
      "Misi eksistensial berakar pada mediasi, fasilitasi kerja sama tim, diplomasi interpersonal, dan penciptaan keselarasan dalam kemitraan.",
    soulUrgeSummary:
      "Jiwa mendambakan kedamaian batin, hubungan emosional yang erat, lingkungan tanpa konflik, dan apresiasi terhadap empati tulus.",
    personalitySummary:
      "Dikenal sebagai pribadi yang santun, ramah, pendengar yang bijak, mudah didekati, dan memiliki sensitivitas sosial tinggi.",
    strengths: ["Diplomasi alami", "Intuisi relasional", "Daya adaptasi kolaboratif", "Empati mendalam"],
    growthAreas: ["Menghindari oversensitivitas", "Lebih berani menyampaikan pendirian secara tegas"],
    color: "text-sky-400",
    badgeBg: "bg-sky-500/10",
    badgeBorder: "border-sky-500/30",
  },
  3: {
    archetype: "Sang Komunikator Kreatif & Ekspresif",
    title: "Kreator Inspiratif",
    destinySummary:
      "Panggilan hidup berorientasi pada ekspresi artistik, komunikasi massa, membangkitkan optimisme, dan menyalurkan kreativitas lintas media.",
    soulUrgeSummary:
      "Dorongan batin merindukan kebebasan mengekspresikan imajinasi, menghibur sesama, dan lingkungan sosial yang penuh kehangatan serta kegembiraan.",
    personalitySummary:
      "Tampil di hadapan publik sebagai figur yang karismatik, humoris, memikat, pandai berbicara, dan menyebarkan atmosfer positif.",
    strengths: ["Kecakapan verbal", "Imajinasi artistik", "Daya magnetik sosial", "Optimisme menular"],
    growthAreas: ["Fokus pada penyelesaian proyek panjang", "Manajemen kedisiplinan waktu"],
    color: "text-amber-400",
    badgeBg: "bg-amber-500/10",
    badgeBorder: "border-amber-500/30",
  },
  4: {
    archetype: "Sang Pembangun Fondasi & Praktisi Metodis",
    title: "Arsitek Sistem",
    destinySummary:
      "Misi hidup difokuskan pada perancangan sistem yang stabil, manajemen aset yang teliti, penegakan integritas proses, dan ketekunan jangka panjang.",
    soulUrgeSummary:
      "Hasrat internal mendambakan rasa aman struktural, keteraturan operasional yang jelas, stabilitas finansial, dan prediktabilitas terukur.",
    personalitySummary:
      "Dipandang sebagai individu yang andal, berdisiplin tinggi, memegang teguh komitmen, teliti, dan pragmatis dalam eksekusi tugas.",
    strengths: ["Organisasi sistematis", "Keandalan integritas", "Ketekunan operasional", "Manajemen risiko"],
    growthAreas: ["Keterbukaan terhadap fleksibilitas", "Menghindari resistensi berlebih terhadap inovasi mendadak"],
    color: "text-emerald-400",
    badgeBg: "bg-emerald-500/10",
    badgeBorder: "border-emerald-500/30",
  },
  5: {
    archetype: "Sang Petualang Dinamis & Katalisator Perubahan",
    title: "Eksplorator Progresif",
    destinySummary:
      "Tujuan eksistensial adalah merangkul keragaman pengalaman, mendorong reformasi progresif, mempromosikan kebebasan berpikir, dan adaptasi cepat.",
    soulUrgeSummary:
      "Jiwa senantiasa merindukan petualangan intelektual, variasi kehidupan, eksplorasi tanpa sekat dogma, dan ruang gerak fleksibel.",
    personalitySummary:
      "Dilihat oleh khalayak sebagai sosok yang berjiwa muda, energetik, serba bisa, memikat, dan memiliki wawasan multikultural luas.",
    strengths: ["Agilitas mental tinggi", "Resiliensi adaptif", "Komunikasi persuasif", "Keberanian eksplorasi"],
    growthAreas: ["Konsistensi pada satu fokus utama", "Manajemen impulsivitas keputusan"],
    color: "text-indigo-400",
    badgeBg: "bg-indigo-500/10",
    badgeBorder: "border-indigo-500/30",
  },
  6: {
    archetype: "Sang Pengasuh Bertanggung Jawab & Harmonis",
    title: "Pilar Kebajikan",
    destinySummary:
      "Misi hidup berlandaskan pelayanan masyarakat, tanggung jawab keluarga, penyembuhan sosial, dan penegakan estetika harmonis.",
    soulUrgeSummary:
      "Hasrat batin terdalam adalah menciptakan kehangatan rumah tangga, melindungi mereka yang membutuhkan, dan menjaga kedamaian komunitas.",
    personalitySummary:
      "Mencerminkan aura keibuan/kebapakan yang protektif, penuh welas asih, estetis dalam penampilan, dan menjadi tempat bersandar.",
    strengths: ["Tanggung jawab moral", "Loyalitas tanpa pamrih", "Sensitivitas estetika", "Kapasitas proteksi"],
    growthAreas: ["Menghindari rasa memikul beban semua pihak", "Memberi ruang privasi bagi kemandirian orang lain"],
    color: "text-teal-400",
    badgeBg: "bg-teal-500/10",
    badgeBorder: "border-teal-500/30",
  },
  7: {
    archetype: "Sang Pemikir Analitis & Peneliti Kebenaran",
    title: "Filsuf Penyelidik",
    destinySummary:
      "Panggilan hidup berakar pada riset mendalam, eksplorasi sains atau metafisika, pembuktian fakta objektif, dan sintesis kebijaksanaan filosofis.",
    soulUrgeSummary:
      "Dorongan jiwa merindukan kesunyian kontemplatif, pemahaman hakikat alam semesta, privasi intelektual, dan kebebasan berpikir analitis.",
    personalitySummary:
      "Dipandang sebagai figur yang berwibawa, intelektual, misterius, tenang, cermat mengamati detail, dan berorientasi pada mutu substansial.",
    strengths: ["Kecerdasan analitis tajam", "Intuisi riset", "Konsentrasi mendalam", "Otentisitas intelektual"],
    growthAreas: ["Membangun keterbukaan emosional", "Menghindari kecenderungan isolasi sosial berkepanjangan"],
    color: "text-purple-400",
    badgeBg: "bg-purple-500/10",
    badgeBorder: "border-purple-500/30",
  },
  8: {
    archetype: "Sang Eksekutif Otoritas & Pengelola Kekuatan",
    title: "Strategis Berwibawa",
    destinySummary:
      "Tujuan hidup difokuskan pada kepemimpinan skala makro, penguasaan tata kelola materi dan finansial, serta eksekusi proyek berkapasitas besar.",
    soulUrgeSummary:
      "Hasrat batin mendambakan pencapaian signifikan, penguasaan efisiensi struktural, kemandirian finansial penuh, dan pengakuan otoritas nyata.",
    personalitySummary:
      "Tampil dengan citra profesional eksekutif yang berwibawa, berwawasan bisnis strategis, percaya diri, dan memiliki aura kepemimpinan alami.",
    strengths: ["Visi strategis bisnis", "Keahlian manajemen finansial", "Kepemimpinan terarah", "Ketahanan mental tinggi"],
    growthAreas: ["Menyeimbangkan ambisi dengan empati", "Mencegah kecenderungan kontrol mikromanajerial"],
    color: "text-amber-500",
    badgeBg: "bg-amber-500/10",
    badgeBorder: "border-amber-500/30",
  },
  9: {
    archetype: "Sang Humanis Universal & Filantropis Global",
    title: "Pemberi Inspirasi Universal",
    destinySummary:
      "Misi eksistensial adalah mengabdi bagi kemaslahatan umat manusia, menjembatani perbedaan budaya, dan menuntaskan siklus kebijaksanaan hidup.",
    soulUrgeSummary:
      "Jiwa mendambakan terciptanya keadilan global, transformasi peradaban yang beradab, dan mewariskan dampak positif tanpa batas ego.",
    personalitySummary:
      "Dipandang sebagai pribadi yang bijaksana, karismatik secara universal, toleran, berjiwa lapang, dan bersahabat dengan semua lapisan masyarakat.",
    strengths: ["Visi humanitarian global", "Toleransi luas", "Kedermawanan batin", "Karisma inspiratif"],
    growthAreas: ["Menghindari kekecewaan atas idealisme berlebih", "Menetapkan batasan batas energi pribadi"],
    color: "text-fuchsia-400",
    badgeBg: "bg-fuchsia-500/10",
    badgeBorder: "border-fuchsia-500/30",
  },
  11: {
    archetype: "Master Number 11: Sang Pencerah & Visioner Spiritual",
    title: "Inspirasi Transendental (Master 11)",
    destinySummary:
      "Panggilan tingkat tinggi untuk menjadi saluran wawasan spiritual, intuisi tajam, penerang kesadaran kolektif, dan katalisator kebangkitan batin.",
    soulUrgeSummary:
      "Dorongan jiwa mendambakan harmoni transendental, pencerahan rohani mendalam, dan menuntun sesama menuju pemahaman yang lebih luhur.",
    personalitySummary:
      "Memancarkan magnetisme spiritual yang khas, aura intuitif, daya pikat inspiratif, dan pandangan mata yang menembus batas kesadaran biasa.",
    strengths: ["Intuisi сверх-sensitif", "Kekuatan inspirasi rohani", "Visioner masa depan", "Kedalaman empati kosmis"],
    growthAreas: ["Manajemen kecemasan akibat kepekaan saraf", "Menjaga keterikatan membumi dengan realitas praktis"],
    color: "text-yellow-400",
    badgeBg: "bg-yellow-500/10",
    badgeBorder: "border-yellow-500/30",
  },
  22: {
    archetype: "Master Number 22: Sang Pembangun Utama (Master Builder)",
    title: "Arsitek Peradaban (Master 22)",
    destinySummary:
      "Misi raksasa untuk menerjemahkan visi filosofis luhur menjadi struktur fisik, institusi, atau teknologi konkret berskala peradaban abadi.",
    soulUrgeSummary:
      "Hasrat terdalam jiwa adalah mewujudkan warisan monumental yang memberikan manfaat nyata dan berkesinambungan bagi jutaan umat manusia.",
    personalitySummary:
      "Dipandang sebagai figur berkekuatan eksekusi luar biasa, perencana berwibawa tinggi, tenang di tengah krisis, dan arsitek strategi ulung.",
    strengths: ["Kapasitas eksekusi masif", "Penggabungan visi luhur dan aksi praktis", "Kepemimpinan peradaban", "Ketahanan mental baja"],
    growthAreas: ["Mencegah keletihan ekstrem akibat ekspektasi raksasa", "Membagi beban kerja kepada tim pendukung"],
    color: "text-emerald-400",
    badgeBg: "bg-emerald-500/10",
    badgeBorder: "border-emerald-500/30",
  },
  33: {
    archetype: "Master Number 33: Sang Pendidik Utama (Master Teacher)",
    title: "Penuntun Welas Asih (Master 33)",
    destinySummary:
      "Tingkat pengabdian tertinggi yang mengintegrasikan cinta tanpa syarat, pengorbanan suci, bimbingan moral agung, dan penyembuhan spiritual universal.",
    soulUrgeSummary:
      "Jiwa terpanggil untuk menyembuhkan luka batin kemanusiaan, mendidik tanpa pamrih, dan mengalirkan kasih sayang ilahiah dalam tindakan nyata.",
    personalitySummary:
      "Mencerminkan kehadiran yang sangat menenangkan, penuh martabat kasih, disegani tanpa rasa takut, dan memancarkan kemurnian moral.",
    strengths: ["Welas asih universal mutlak", "Otoritas bimbingan spiritual", "Penyembuhan emosional", "Keteladanan moral sejati"],
    growthAreas: ["Mencegah pengorbanan diri yang berlebihan (martyrdom)", "Menjaga batas kesehatan fisik dan mental pribadi"],
    color: "text-cyan-400",
    badgeBg: "bg-cyan-500/10",
    badgeBorder: "border-cyan-500/30",
  },
};

// --- FUNGSI REDUKSI NUMEROLOGI STANDAR PYTHAGORAS ---

function reduceToSingleOrMaster(sum: number): { finalValue: number; steps: number[] } {
  if (sum <= 0) return { finalValue: 0, steps: [0] };
  const steps: number[] = [sum];
  let current = sum;

  while (current > 9 && current !== 11 && current !== 22 && current !== 33) {
    current = current
      .toString()
      .split("")
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    steps.push(current);
  }

  return { finalValue: current, steps };
}

const PRESET_NAMES = [
  { label: "Budi Prasetyo", name: "BUDI PRASETYO", category: "Pengguna Umum" },
  { label: "Soekarno", name: "SOEKARNO", category: "Tokoh Nasional" },
  { label: "Albert Einstein", name: "ALBERT EINSTEIN", category: "Sains & Fisika" },
  { label: "Nikola Tesla", name: "NIKOLA TESLA", category: "Inovator Teknik" },
  { label: "Leonardo da Vinci", name: "LEONARDO DA VINCI", category: "Polimatik Renaisans" },
  { label: "Marie Curie", name: "MARIE CURIE", category: "Ilmuwan Nobel" },
];

export function NumerologiNamaCalculator() {
  // 1. URL Query State via nuqs
  const [namaLengkap, setNamaLengkap] = useQueryState(
    "namaLengkap",
    parseAsString.withDefault("BUDI PRASETYO")
  );

  // 2. Local State untuk Tab Tampilan dan Notifikasi Salin
  const [activeTab, setActiveTab] = React.useState<"overview" | "matrix" | "masters">("overview");
  const [copied, setCopied] = React.useState(false);

  // 3. Normalisasi & Validasi Karakter
  const cleanName = React.useMemo(() => {
    return (namaLengkap || "").toUpperCase().replace(/[^A-Z]/g, "");
  }, [namaLengkap]);

  // 4. Analisis Dekomposisi Huruf Per Kata & Karakter
  const letterBreakdown = React.useMemo<LetterBreakdown[]>(() => {
    const list: LetterBreakdown[] = [];
    for (const char of cleanName) {
      if (PYTHAGOREAN_TABLE[char] !== undefined) {
        list.push({
          char,
          value: PYTHAGOREAN_TABLE[char],
          isVowel: VOWEL_SET.has(char),
        });
      }
    }
    return list;
  }, [cleanName]);

  // 5. Kalkulasi Tiga Parameter Utama
  const calculation = React.useMemo(() => {
    let rawDestinySum = 0;
    let rawSoulUrgeSum = 0;
    let rawPersonalitySum = 0;

    let vowelCount = 0;
    let consonantCount = 0;

    for (const item of letterBreakdown) {
      rawDestinySum += item.value;
      if (item.isVowel) {
        rawSoulUrgeSum += item.value;
        vowelCount++;
      } else {
        rawPersonalitySum += item.value;
        consonantCount++;
      }
    }

    const destiny = reduceToSingleOrMaster(rawDestinySum);
    const soulUrge = reduceToSingleOrMaster(rawSoulUrgeSum);
    const personality = reduceToSingleOrMaster(rawPersonalitySum);

    return {
      rawDestinySum,
      rawSoulUrgeSum,
      rawPersonalitySum,
      vowelCount,
      consonantCount,
      totalLetters: letterBreakdown.length,
      destiny,
      soulUrge,
      personality,
    };
  }, [letterBreakdown]);

  // 6. Ambil Data Interpretasi
  const destinyInfo = NUMEROLOGY_INTERPRETATIONS[calculation.destiny.finalValue] || NUMEROLOGY_INTERPRETATIONS[1];
  const soulUrgeInfo = NUMEROLOGY_INTERPRETATIONS[calculation.soulUrge.finalValue] || NUMEROLOGY_INTERPRETATIONS[1];
  const personalityInfo = NUMEROLOGY_INTERPRETATIONS[calculation.personality.finalValue] || NUMEROLOGY_INTERPRETATIONS[1];

  const handleReset = () => {
    setNamaLengkap("BUDI PRASETYO");
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      {/* CARD UTAMA: KONTROL INPUT NAMA & PRESET */}
      <Card className="p-6 md:p-8 flex flex-col gap-6 shadow-lg bg-surface border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-primary">Parameter Nama Lengkap</h2>
              <p className="text-xs md:text-sm text-secondary">
                Konversi alfabet ke nilai numerik sistem Pythagoras (A=1 s.d. Z=8)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={handleReset}
              className="text-xs h-9 px-3 flex items-center gap-1.5"
              title="Reset ke nama default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
            <Button
              variant="secondary"
              onClick={handleCopyLink}
              className="text-xs h-9 px-3 flex items-center gap-1.5 text-accent hover:text-accent"
              title="Salin tautan kalkulasi tersimpan"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Tersalin!" : "Bagikan"}
            </Button>
          </div>
        </div>

        {/* Form Input Nama Lengkap */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <Input
              label="Nama Lengkap (Sesuai Akta / Identitas Resmi)"
              placeholder="Contoh: BUDI PRASETYO"
              value={namaLengkap || ""}
              onChange={(e) => setNamaLengkap(e.target.value)}
              helperText="Huruf dianalisis tanpa memperhatikan spasi dan tanda baca khusus."
              prefix=""
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <Select
              label="Pilih Preset Tokoh / Contoh"
              onChange={(e) => {
                if (e.target.value) {
                  setNamaLengkap(e.target.value);
                }
              }}
              value=""
            >
              <option value="" disabled>
                -- Pilih Contoh Nama --
              </option>
              {PRESET_NAMES.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.label} ({item.category})
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Statistik Dekomposisi Cepat */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 p-3.5 rounded-xl bg-base border border-border text-center">
          <div className="flex flex-col">
            <span className="text-[11px] md:text-xs text-secondary font-medium">Total Huruf Aktif</span>
            <span className="text-base md:text-lg font-bold text-primary font-mono">{calculation.totalLetters}</span>
          </div>
          <div className="flex flex-col border-x border-border">
            <span className="text-[11px] md:text-xs text-secondary font-medium">Huruf Vokal (A,E,I,O,U)</span>
            <span className="text-base md:text-lg font-bold text-sky-400 font-mono">{calculation.vowelCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] md:text-xs text-secondary font-medium">Huruf Konsonan</span>
            <span className="text-base md:text-lg font-bold text-amber-400 font-mono">{calculation.consonantCount}</span>
          </div>
        </div>
      </Card>

      {/* TAMPILAN KELUARAN 3 OUTPUT BOX UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Output 1: Destiny Number */}
        <div className="relative group flex flex-col">
          <OutputBox
            label="Destiny Number (Angka Takdir)"
            value={calculation.destiny.finalValue}
            suffix={
              [11, 22, 33].includes(calculation.destiny.finalValue) ? " (Master)" : ""
            }
          />
          <div className="mt-2 p-3 rounded-xl bg-surface border border-border flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-accent" />
                {destinyInfo.title}
              </span>
              <span className="text-[10px] font-mono text-secondary">
                Total: {calculation.rawDestinySum} → {calculation.destiny.steps.join(" → ")}
              </span>
            </div>
            <p className="text-[12px] text-secondary leading-snug line-clamp-2">
              {destinyInfo.destinySummary}
            </p>
          </div>
        </div>

        {/* Output 2: Soul Urge Number */}
        <div className="relative group flex flex-col">
          <OutputBox
            label="Soul Urge (Hasrat Jiwa)"
            value={calculation.soulUrge.finalValue}
            suffix={
              [11, 22, 33].includes(calculation.soulUrge.finalValue) ? " (Master)" : ""
            }
          />
          <div className="mt-2 p-3 rounded-xl bg-surface border border-border flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-sky-400 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-sky-400" />
                {soulUrgeInfo.title}
              </span>
              <span className="text-[10px] font-mono text-secondary">
                Vokal: {calculation.rawSoulUrgeSum} → {calculation.soulUrge.steps.join(" → ")}
              </span>
            </div>
            <p className="text-[12px] text-secondary leading-snug line-clamp-2">
              {soulUrgeInfo.soulUrgeSummary}
            </p>
          </div>
        </div>

        {/* Output 3: Personality Number */}
        <div className="relative group flex flex-col">
          <OutputBox
            label="Personality (Citra Luar)"
            value={calculation.personality.finalValue}
            suffix={
              [11, 22, 33].includes(calculation.personality.finalValue) ? " (Master)" : ""
            }
          />
          <div className="mt-2 p-3 rounded-xl bg-surface border border-border flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                {personalityInfo.title}
              </span>
              <span className="text-[10px] font-mono text-secondary">
                Konsonan: {calculation.rawPersonalitySum} → {calculation.personality.steps.join(" → ")}
              </span>
            </div>
            <p className="text-[12px] text-secondary leading-snug line-clamp-2">
              {personalityInfo.personalitySummary}
            </p>
          </div>
        </div>
      </div>

      {/* MASTER NUMBER ALERT BADGE (JIKA ADA 11, 22, ATAU 33) */}
      {([calculation.destiny.finalValue, calculation.soulUrge.finalValue, calculation.personality.finalValue].some(
        (v) => v === 11 || v === 22 || v === 33
      )) && (
        <Card className="p-4 bg-gradient-to-r from-amber-500/10 via-accent/10 to-purple-500/10 border border-amber-500/30 flex items-start gap-3">
          <Award className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-bold text-primary flex items-center gap-2">
              Terdeteksi Master Number (Angka Induk Transendental)
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                11 / 22 / 33
              </span>
            </h3>
            <p className="text-xs text-secondary leading-relaxed">
              Dalam sistem numerologi Pythagoras, angka 11, 22, dan 33 memiliki frekuensi getaran tingkat tinggi (Master Vibration) yang tidak direduksi menjadi digit tunggal karena melambangkan potensi kepemimpinan visioner, daya bangun raksasa, atau kapasitas pengajaran spiritual.
            </p>
          </div>
        </Card>
      )}

      {/* TAB NAVIGATOR: DETAIL INTERPRETASI, MATRIKS HURUF & PANDUAN */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2 overflow-x-auto">
          <Button
            variant={activeTab === "overview" ? "primary" : "ghost"}
            onClick={() => setActiveTab("overview")}
            className="text-xs md:text-sm h-10 px-4 whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Sintesis Profil & Interpretasi Lengkap
          </Button>
          <Button
            variant={activeTab === "matrix" ? "primary" : "ghost"}
            onClick={() => setActiveTab("matrix")}
            className="text-xs md:text-sm h-10 px-4 whitespace-nowrap"
          >
            <Hash className="w-4 h-4 mr-2" />
            Matriks Dekomposisi Alfabet (A-Z)
          </Button>
          <Button
            variant={activeTab === "masters" ? "primary" : "ghost"}
            onClick={() => setActiveTab("masters")}
            className="text-xs md:text-sm h-10 px-4 whitespace-nowrap"
          >
            <Star className="w-4 h-4 mr-2" />
            Katalog 1-9 & Master Numbers
          </Button>
        </div>

        {/* TAB 1: SINTESIS TIGA ANGKA LENGKAP */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Kartu Destiny */}
            <Card className="p-5 flex flex-col gap-4 bg-surface border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-secondary uppercase tracking-wider">
                    Angka Takdir (Destiny)
                  </span>
                  <h4 className="text-base font-bold text-primary flex items-center gap-1.5">
                    Angka {calculation.destiny.finalValue}
                    <span className="text-xs font-normal text-secondary">({destinyInfo.title})</span>
                  </h4>
                </div>
              </div>

              <p className="text-xs text-secondary leading-relaxed">{destinyInfo.destinySummary}</p>

              <div className="flex flex-col gap-2 pt-2 border-t border-border/60">
                <span className="text-[11px] font-semibold text-primary">Kekuatan Alami Inti:</span>
                <div className="flex flex-wrap gap-1.5">
                  {destinyInfo.strengths.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[11px] rounded-md bg-elevated border border-border text-secondary font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Kartu Soul Urge */}
            <Card className="p-5 flex flex-col gap-4 bg-surface border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-secondary uppercase tracking-wider">
                    Hasrat Jiwa (Soul Urge)
                  </span>
                  <h4 className="text-base font-bold text-sky-400 flex items-center gap-1.5">
                    Angka {calculation.soulUrge.finalValue}
                    <span className="text-xs font-normal text-secondary">({soulUrgeInfo.title})</span>
                  </h4>
                </div>
              </div>

              <p className="text-xs text-secondary leading-relaxed">{soulUrgeInfo.soulUrgeSummary}</p>

              <div className="flex flex-col gap-2 pt-2 border-t border-border/60">
                <span className="text-[11px] font-semibold text-primary">Fokus Pertumbuhan:</span>
                <div className="flex flex-wrap gap-1.5">
                  {soulUrgeInfo.growthAreas.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[11px] rounded-md bg-elevated border border-border text-secondary font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Kartu Personality */}
            <Card className="p-5 flex flex-col gap-4 bg-surface border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-secondary uppercase tracking-wider">
                    Kepribadian (Personality)
                  </span>
                  <h4 className="text-base font-bold text-amber-400 flex items-center gap-1.5">
                    Angka {calculation.personality.finalValue}
                    <span className="text-xs font-normal text-secondary">({personalityInfo.title})</span>
                  </h4>
                </div>
              </div>

              <p className="text-xs text-secondary leading-relaxed">{personalityInfo.personalitySummary}</p>

              <div className="flex flex-col gap-2 pt-2 border-t border-border/60">
                <span className="text-[11px] font-semibold text-primary">Citra Sosial Eksternal:</span>
                <div className="p-2 rounded-lg bg-base border border-border/70 text-[11px] text-secondary">
                  Lingkungan memandang Anda melalui arketipe <span className="font-semibold text-primary">{personalityInfo.archetype}</span>.
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 2: MATRIKS DEKOMPOSISI ALFABET LENGKAP */}
        {activeTab === "matrix" && (
          <Card className="p-6 flex flex-col gap-6 bg-surface border-border">
            <div>
              <h3 className="text-base font-bold text-primary flex items-center gap-2">
                <Hash className="w-4 h-4 text-accent" />
                Dekomposisi Huruf Per Karakter Nama: &quot;{namaLengkap}&quot;
              </h3>
              <p className="text-xs text-secondary mt-1">
                Setiap karakter diklasifikasikan sebagai Vokal (pembentuk Soul Urge) atau Konsonan (pembentuk Personality).
              </p>
            </div>

            {letterBreakdown.length === 0 ? (
              <div className="p-8 text-center text-secondary text-sm border border-dashed border-border rounded-xl">
                Silakan ketik nama lengkap pada kolom input di atas untuk menampilkan matriks.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {letterBreakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-xl border min-w-[54px] transition-all",
                      item.isVowel
                        ? "bg-sky-500/10 border-sky-500/30 text-sky-300"
                        : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                    )}
                  >
                    <span className="text-lg font-bold font-mono text-primary">{item.char}</span>
                    <span className="text-xs font-mono font-bold">{item.value}</span>
                    <span className="text-[9px] uppercase tracking-wider opacity-70 mt-0.5">
                      {item.isVowel ? "Vokal" : "Kons"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tabel Referensi Standar Pythagoras */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border/80">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                Tabel Konversi Standar Angka Pythagoras (1-9)
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                  const chars = Object.entries(PYTHAGOREAN_TABLE)
                    .filter(([, v]) => v === num)
                    .map(([k]) => k)
                    .join(", ");
                  return (
                    <div
                      key={num}
                      className="flex flex-col items-center justify-center p-2 rounded-lg bg-base border border-border"
                    >
                      <span className="text-sm font-bold text-accent font-mono">{num}</span>
                      <span className="text-[11px] font-semibold text-secondary">{chars}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        )}

        {/* TAB 3: KATALOG ARKETIPE 1-9 & MASTER NUMBERS */}
        {activeTab === "masters" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].map((num) => {
              const info = NUMEROLOGY_INTERPRETATIONS[num];
              const isMaster = [11, 22, 33].includes(num);
              return (
                <Card
                  key={num}
                  className={cn(
                    "p-4 flex flex-col gap-2 bg-surface border-border",
                    isMaster && "border-amber-500/40 bg-amber-500/5"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs",
                          info.badgeBg,
                          info.badgeBorder,
                          info.color,
                          "border"
                        )}
                      >
                        {num}
                      </span>
                      <h4 className="text-sm font-bold text-primary">{info.title}</h4>
                    </div>
                    {isMaster && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        Master Number
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">{info.destinySummary}</p>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}