"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import { cn } from "@/lib/utils";
import {
  Compass,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Flame,
  Droplets,
  Mountain,
  Sun,
  Award,
  CheckCircle2,
  AlertTriangle,
  Heart,
  TrendingUp,
  Briefcase,
  Layers,
  Info,
  Calendar,
  Zap,
} from "lucide-react";

// =============================================================================
// STRUKTUR DATA & PARAMETER TEKNIS BA ZHAI FENG SHUI
// =============================================================================

export type GenderType = "pria" | "wanita";

export interface DirectionDetail {
  direction: string;
  nameChinese: string;
  category: string;
  description: string;
  recommendation: string;
  type: "positive" | "negative";
  energyLevel: string;
}

export interface KuaProfile {
  number: number;
  originalCalculatedNumber: number;
  isTransformed: boolean;
  trigramChinese: string;
  trigramSymbol: string;
  name: string;
  element: "Air" | "Tanah" | "Kayu" | "Logam" | "Api";
  group: "Kelompok Timur (Dong Si Ming)" | "Kelompok Barat (Xi Si Ming)";
  groupSimple: "Timur" | "Barat";
  baseDirection: string;
  elementColor: string;
  elementBg: string;
  elementBorder: string;
  auspiciousDirections: {
    shengChi: DirectionDetail;
    tianYi: DirectionDetail;
    yanNian: DirectionDetail;
    fuWei: DirectionDetail;
  };
  inauspiciousDirections: {
    huoHai: DirectionDetail;
    wuGui: DirectionDetail;
    liuSha: DirectionDetail;
    jueMing: DirectionDetail;
  };
  favorableColors: string[];
  unfavorableColors: string[];
  compatibleKua: number[];
  careerAffinities: string[];
  personalityTraits: string;
  fengShuiAdvice: string;
}

export const KUA_DATA_MAP: Record<number, Omit<KuaProfile, "originalCalculatedNumber" | "isTransformed">> = {
  1: {
    number: 1,
    trigramChinese: "坎 (Kǎn)",
    trigramSymbol: "☵",
    name: "Kan",
    element: "Air",
    group: "Kelompok Timur (Dong Si Ming)",
    groupSimple: "Timur",
    baseDirection: "Utara",
    elementColor: "text-sky-400",
    elementBg: "bg-sky-500/10",
    elementBorder: "border-sky-500/30",
    auspiciousDirections: {
      shengChi: {
        direction: "Tenggara",
        nameChinese: "Sheng Chi (生氣)",
        category: "Kemakmuran & Vitalitas",
        description: "Menstimulasi arus kas rezeki, kemajuan bisnis, dan akselerasi reputasi kepemimpinan.",
        recommendation: "Arahkan meja kerja utama atau pintu gerbang unit usaha ke Tenggara.",
        type: "positive",
        energyLevel: "+100% (Energi Vitalitas Tertinggi)",
      },
      tianYi: {
        direction: "Timur",
        nameChinese: "Tian Yi (天醫)",
        category: "Kesehatan & Vitalitas",
        description: "Mendukung pemulihan fisik, keseimbangan imunitas tubuh, dan kejernihan batin.",
        recommendation: "Posisikan kepala ranjang tidur atau ruang istirahat menghadap Timur.",
        type: "positive",
        energyLevel: "+80% (Dokter Surgawi)",
      },
      yanNian: {
        direction: "Selatan",
        nameChinese: "Yan Nian (延年)",
        category: "Harmoni & Relasi",
        description: "Memperkokoh keharmonisan rumah tangga, hubungan interpersonal, dan diplomasi bisnis.",
        recommendation: "Fungsikan sektor Selatan sebagai ruang interaksi keluarga atau ruang rapat.",
        type: "positive",
        energyLevel: "+70% (Panjang Umur & Harmoni)",
      },
      fuWei: {
        direction: "Utara",
        nameChinese: "Fu Wei (伏位)",
        category: "Stabilitas & Kebijaksanaan",
        description: "Menumbuhkan kedamaian emosional, konsentrasi belajar, dan stabilitas aset.",
        recommendation: "Ideal untuk sudut meditasi, ruang baca, atau meja belajar anak.",
        type: "positive",
        energyLevel: "+60% (Pengembangan Diri)",
      },
    },
    inauspiciousDirections: {
      huoHai: {
        direction: "Barat",
        nameChinese: "Huo Hai (禍害)",
        category: "Hambatan Ringan",
        description: "Memicu miskomunikasi, salah paham kecil, dan penundaan jadwal proyek.",
        recommendation: "Hindari menghadap Barat saat berdiskusi penting atau negosiasi harga.",
        type: "negative",
        energyLevel: "-50% (Potensi Gangguan Minor)",
      },
      wuGui: {
        direction: "Timur Laut",
        nameChinese: "Wu Gui (五鬼)",
        category: "Konflik & Lima Hantu",
        description: "Memicu kecurigaan internal tim, perselisihan rekan kongsi, dan kebocoran anggaran.",
        recommendation: "Jangan letakkan meja administrasi keuangan menghadap Timur Laut.",
        type: "negative",
        energyLevel: "-70% (Energi Lima Setan)",
      },
      liuSha: {
        direction: "Barat Laut",
        nameChinese: "Liu Sha (六煞)",
        category: "Masalah Hukum & Skandal",
        description: "Berpotensi menimbulkan sengketa perizinan, masalah hukum, atau skandal relasi.",
        recommendation: "Netralkan area Barat Laut dengan pencahayaan tenang dan elemen peredam.",
        type: "negative",
        energyLevel: "-80% (Enam Pembunuh)",
      },
      jueMing: {
        direction: "Barat Daya",
        nameChinese: "Jue Ming (絕命)",
        category: "Malapetaka & Bahaya Fatal",
        description: "Titik energi paling destruktif; berpotensi memicu kegagalan finansial dan krisis fisik.",
        recommendation: "Sangat dilarang untuk pintu utama atau kamar tidur. Fungsikan untuk toilet/gudang.",
        type: "negative",
        energyLevel: "-100% (Bahaya Total / Malapetaka)",
      },
    },
    favorableColors: ["Biru Tua", "Hitam", "Abu-abu Gelap", "Putih", "Perak"],
    unfavorableColors: ["Kuning Oker", "Cokelat Tanah", "Beige"],
    compatibleKua: [1, 3, 4, 9],
    careerAffinities: ["Diplomat", "Peneliti Kelautan & Logistik", "Konsultan Strategis", "Analis Keuangan", "Jurnalis"],
    personalityTraits: "Adaptif, fleksibel laksana air mengalir, analitis, tenang dalam krisis, dan pandai berdiplomasi.",
    fengShuiAdvice: "Tempatkan dekorasi air mengalir (akuarium atau air mancur mini) di area Utara atau Tenggara.",
  },
  2: {
    number: 2,
    trigramChinese: "坤 (Kūn)",
    trigramSymbol: "☷",
    name: "Kun",
    element: "Tanah",
    group: "Kelompok Barat (Xi Si Ming)",
    groupSimple: "Barat",
    baseDirection: "Barat Daya",
    elementColor: "text-amber-400",
    elementBg: "bg-amber-500/10",
    elementBorder: "border-amber-500/30",
    auspiciousDirections: {
      shengChi: {
        direction: "Timur Laut",
        nameChinese: "Sheng Chi (生氣)",
        category: "Kemakmuran & Vitalitas",
        description: "Memicu akumulasi kekayaan aset riil yang stabil dan kenaikan karir terukur.",
        recommendation: "Posisikan meja kerja utama atau meja direksi menghadap Timur Laut.",
        type: "positive",
        energyLevel: "+100% (Energi Vitalitas Tertinggi)",
      },
      tianYi: {
        direction: "Barat",
        nameChinese: "Tian Yi (天醫)",
        category: "Kesehatan & Vitalitas",
        description: "Meningkatkan daya tahan tubuh, stabilitas psikologis, dan kesegaran stamina.",
        recommendation: "Arahkan kepala ranjang tidur menghadap Barat.",
        type: "positive",
        energyLevel: "+80% (Dokter Surgawi)",
      },
      yanNian: {
        direction: "Barat Laut",
        nameChinese: "Yan Nian (延年)",
        category: "Harmoni & Relasi",
        description: "Membangun ikatan kemitraan kokoh, loyalitas karyawan, dan keharmonisan keluarga.",
        recommendation: "Gunakan arah Barat Laut untuk ruang negosiasi atau ruang keluarga.",
        type: "positive",
        energyLevel: "+70% (Panjang Umur & Harmoni)",
      },
      fuWei: {
        direction: "Barat Daya",
        nameChinese: "Fu Wei (伏位)",
        category: "Stabilitas & Kebijaksanaan",
        description: "Memperkuat kesabaran, integritas batin, dan kehati-hatian dalam manajemen risiko.",
        recommendation: "Tempatkan ruang kontemplasi atau ruang santai menghadap Barat Daya.",
        type: "positive",
        energyLevel: "+60% (Pengembangan Diri)",
      },
    },
    inauspiciousDirections: {
      huoHai: {
        direction: "Timur",
        nameChinese: "Huo Hai (禍害)",
        category: "Hambatan Ringan",
        description: "Menimbulkan miskomunikasi berulang dan keletihan fisik tanpa sebab yang jelas.",
        recommendation: "Hindari duduk menghadap Timur dalam durasi kerja yang panjang.",
        type: "negative",
        energyLevel: "-50% (Potensi Gangguan Minor)",
      },
      wuGui: {
        direction: "Tenggara",
        nameChinese: "Wu Gui (五鬼)",
        category: "Konflik & Lima Hantu",
        description: "Memicu friksi internal tim dan kebocoran anggaran operasional tak terduga.",
        recommendation: "Jangan letakkan brankas atau tempat penyimpanan kas menghadap Tenggara.",
        type: "negative",
        energyLevel: "-70% (Energi Lima Setan)",
      },
      liuSha: {
        direction: "Selatan",
        nameChinese: "Liu Sha (六煞)",
        category: "Masalah Hukum & Skandal",
        description: "Memicu gesekan emosional yang intens dan risiko perselisihan kontrak kerja.",
        recommendation: "Gunakan partisi atau tanaman peneduh jika ruangan menghadap Selatan.",
        type: "negative",
        energyLevel: "-80% (Enam Pembunuh)",
      },
      jueMing: {
        direction: "Utara",
        nameChinese: "Jue Ming (絕命)",
        category: "Malapetaka & Bahaya Fatal",
        description: "Benturan chi negatif yang dapat mengikis kesehatan dan kestabilan finansial.",
        recommendation: "Hindari pintu utama menghadap Utara; fungsikan untuk area servis atau gudang.",
        type: "negative",
        energyLevel: "-100% (Bahaya Total / Malapetaka)",
      },
    },
    favorableColors: ["Kuning Oker", "Cokelat Tanah", "Terakota", "Beige", "Merah Bata", "Oranye"],
    unfavorableColors: ["Hijau Daun", "Hijau Tua", "Cokelat Kayu"],
    compatibleKua: [2, 6, 7, 8],
    careerAffinities: ["Pengembang Properti", "Praktisi Pendidikan", "Manajer SDM", "Agribisnis", "Tenaga Medis"],
    personalityTraits: "Penuh dedikasi, sabar, suportif, teliti, mengayomi, dan mengutamakan fondasi jangka panjang.",
    fengShuiAdvice: "Gunakan ornamen keramik, batu kristal kuarsa kuning, atau vas terakota di sudut Barat Daya.",
  },
  3: {
    number: 3,
    trigramChinese: "震 (Zhèn)",
    trigramSymbol: "☳",
    name: "Zhen",
    element: "Kayu",
    group: "Kelompok Timur (Dong Si Ming)",
    groupSimple: "Timur",
    baseDirection: "Timur",
    elementColor: "text-emerald-400",
    elementBg: "bg-emerald-500/10",
    elementBorder: "border-emerald-500/30",
    auspiciousDirections: {
      shengChi: {
        direction: "Selatan",
        nameChinese: "Sheng Chi (生氣)",
        category: "Kemakmuran & Vitalitas",
        description: "Mendorong ekspansi bisnis agresif, promosi jabatan cepat, dan inovasi terobosan.",
        recommendation: "Hadapkan meja kerja atau pintu masuk unit bisnis ke Selatan.",
        type: "positive",
        energyLevel: "+100% (Energi Vitalitas Tertinggi)",
      },
      tianYi: {
        direction: "Utara",
        nameChinese: "Tian Yi (天醫)",
        category: "Kesehatan & Vitalitas",
        description: "Menutrisi vitalitas fisik, mempercepat pemulihan energi, dan mencegah stres berlebih.",
        recommendation: "Posisikan kepala ranjang tidur menghadap Utara.",
        type: "positive",
        energyLevel: "+80% (Dokter Surgawi)",
      },
      yanNian: {
        direction: "Tenggara",
        nameChinese: "Yan Nian (延年)",
        category: "Harmoni & Relasi",
        description: "Menciptakan daya tarik magnetis dalam relasi profesional dan kehangatan asmara.",
        recommendation: "Arahkan area kerja kolaboratif menghadap Tenggara.",
        type: "positive",
        energyLevel: "+70% (Panjang Umur & Harmoni)",
      },
      fuWei: {
        direction: "Timur",
        nameChinese: "Fu Wei (伏位)",
        category: "Stabilitas & Kebijaksanaan",
        description: "Mempertajam fokus analitis, ketenangan strategi, dan kedisiplinan eksekusi.",
        recommendation: "Cocok untuk meja riset, perpustakaan pribadi, atau ruang strategi.",
        type: "positive",
        energyLevel: "+60% (Pengembangan Diri)",
      },
    },
    inauspiciousDirections: {
      huoHai: {
        direction: "Barat Daya",
        nameChinese: "Huo Hai (禍害)",
        category: "Hambatan Ringan",
        description: "Hambatan logistik harian dan penundaan jadwal kerja yang berulang.",
        recommendation: "Hindari memposisikan monitor kerja membelakangi arah Barat Daya.",
        type: "negative",
        energyLevel: "-50% (Potensi Gangguan Minor)",
      },
      wuGui: {
        direction: "Barat Laut",
        nameChinese: "Wu Gui (五鬼)",
        category: "Konflik & Lima Hantu",
        description: "Ketidaksepakatan tajam dengan figur otoritas atau perselisihan rekan kongsi.",
        recommendation: "Hindari penempatan ruang manajerial menghadap Barat Laut.",
        type: "negative",
        energyLevel: "-70% (Energi Lima Setan)",
      },
      liuSha: {
        direction: "Timur Laut",
        nameChinese: "Liu Sha (六煞)",
        category: "Masalah Hukum & Skandal",
        description: "Risiko distorsi komunikasi yang berujung pada gugatan atau komplain pelanggan.",
        recommendation: "Pasang elemen penyeimbang air tenang di sektor Timur Laut.",
        type: "negative",
        energyLevel: "-80% (Enam Pembunuh)",
      },
      jueMing: {
        direction: "Barat",
        nameChinese: "Jue Ming (絕命)",
        category: "Malapetaka & Bahaya Fatal",
        description: "Benturan energi Logam keras yang mengancam kesejahteraan finansial.",
        recommendation: "Blokir bukaan utama ke arah Barat; gunakan sektor ini untuk tangga atau toilet.",
        type: "negative",
        energyLevel: "-100% (Bahaya Total / Malapetaka)",
      },
    },
    favorableColors: ["Hijau Zamrud", "Hijau Daun", "Toska", "Cokelat Kayu", "Biru Tua", "Hitam"],
    unfavorableColors: ["Putih Metalik", "Perak", "Emas"],
    compatibleKua: [1, 3, 4, 9],
    careerAffinities: ["Founder Startup", "Advokat", "Atlet Profesional", "Kontraktor Proyek", "Manufaktur"],
    personalityTraits: "Dinamis, penuh inisiatif terobosan, berani mengambil risiko, tangguh, dan berjiwa pelopor.",
    fengShuiAdvice: "Pajang tanaman hijau berdaun rimbun (Pachira atau Monstera) di sektor Timur hunian/kantor.",
  },
  4: {
    number: 4,
    trigramChinese: "巽 (Xùn)",
    trigramSymbol: "☴",
    name: "Xun",
    element: "Kayu",
    group: "Kelompok Timur (Dong Si Ming)",
    groupSimple: "Timur",
    baseDirection: "Tenggara",
    elementColor: "text-teal-400",
    elementBg: "bg-teal-500/10",
    elementBorder: "border-teal-500/30",
    auspiciousDirections: {
      shengChi: {
        direction: "Utara",
        nameChinese: "Sheng Chi (生氣)",
        category: "Kemakmuran & Vitalitas",
        description: "Membuka peluang ekspansi pasar baru, kenaikan omzet, dan kemakmuran finansial.",
        recommendation: "Hadapkan meja direksi atau meja kerja utama ke Utara.",
        type: "positive",
        energyLevel: "+100% (Energi Vitalitas Tertinggi)",
      },
      tianYi: {
        direction: "Selatan",
        nameChinese: "Tian Yi (天醫)",
        category: "Kesehatan & Vitalitas",
        description: "Menjaga keseimbangan energi vital tubuh, imunitas peredaran darah, dan kesehatan mental.",
        recommendation: "Arahkan sandaran tempat tidur menghadap Selatan.",
        type: "positive",
        energyLevel: "+80% (Dokter Surgawi)",
      },
      yanNian: {
        direction: "Timur",
        nameChinese: "Yan Nian (延年)",
        category: "Harmoni & Relasi",
        description: "Menumbuhkan empati tinggi, daya persuasi negosiasi, dan keharmonisan keluarga.",
        recommendation: "Jadikan arah Timur sebagai fokus ruang diskusi atau ruang keluarga.",
        type: "positive",
        energyLevel: "+70% (Panjang Umur & Harmoni)",
      },
      fuWei: {
        direction: "Tenggara",
        nameChinese: "Fu Wei (伏位)",
        category: "Stabilitas & Kebijaksanaan",
        description: "Memperkaya inspirasi kreatif, kedalaman wawasan ilmiah, dan ketelitian kerja artistik.",
        recommendation: "Ideal untuk studio desain, ruang tulis, atau ruang perencanaan produk.",
        type: "positive",
        energyLevel: "+60% (Pengembangan Diri)",
      },
    },
    inauspiciousDirections: {
      huoHai: {
        direction: "Barat Laut",
        nameChinese: "Huo Hai (禍害)",
        category: "Hambatan Ringan",
        description: "Kebingungan prioritas kerja dan gangguan konsentrasi dari hal-hal remeh.",
        recommendation: "Hindari sudut kerja yang menghadap langsung ke Barat Laut.",
        type: "negative",
        energyLevel: "-50% (Potensi Gangguan Minor)",
      },
      wuGui: {
        direction: "Barat Daya",
        nameChinese: "Wu Gui (五鬼)",
        category: "Konflik & Lima Hantu",
        description: "Perselisihan personal yang menguras energi dan risiko pemborosan tak terduga.",
        recommendation: "Jangan letakkan tempat transaksi kasir menghadap Barat Daya.",
        type: "negative",
        energyLevel: "-70% (Energi Lima Setan)",
      },
      liuSha: {
        direction: "Barat",
        nameChinese: "Liu Sha (六煞)",
        category: "Masalah Hukum & Skandal",
        description: "Benturan energi tajam yang memicu kecemasan dan ketidakpastian karir.",
        recommendation: "Batasi jendela besar tanpa tirai di sektor Barat.",
        type: "negative",
        energyLevel: "-80% (Enam Pembunuh)",
      },
      jueMing: {
        direction: "Timur Laut",
        nameChinese: "Jue Ming (絕命)",
        category: "Malapetaka & Bahaya Fatal",
        description: "Penghambatan total pada aliran rezeki dan ancaman krisis finansial.",
        recommendation: "Pastikan sektor Timur Laut tidak dijadikan pintu masuk utama hunian.",
        type: "negative",
        energyLevel: "-100% (Bahaya Total / Malapetaka)",
      },
    },
    favorableColors: ["Hijau Muda", "Toska", "Pastel", "Cokelat Kayu", "Biru Aqua"],
    unfavorableColors: ["Putih Metalik", "Perak", "Abu-abu Mengkilap"],
    compatibleKua: [1, 3, 4, 9],
    careerAffinities: ["Arsitek & Desainer", "Penulis & Penerbit", "Konsultan Komunikasi", "Akademisi", "Eksportir"],
    personalityTraits: "Fleksibel, santun, imajinatif, artistik, analitis, dan memiliki daya adaptasi sosial tinggi.",
    fengShuiAdvice: "Pajang karya seni bertema alam atau lukisan hutan bambu di sudut Tenggara ruangan.",
  },
  6: {
    number: 6,
    trigramChinese: "乾 (Qián)",
    trigramSymbol: "☰",
    name: "Qian",
    element: "Logam",
    group: "Kelompok Barat (Xi Si Ming)",
    groupSimple: "Barat",
    baseDirection: "Barat Laut",
    elementColor: "text-slate-200",
    elementBg: "bg-slate-500/10",
    elementBorder: "border-slate-500/30",
    auspiciousDirections: {
      shengChi: {
        direction: "Barat",
        nameChinese: "Sheng Chi (生氣)",
        category: "Kemakmuran & Vitalitas",
        description: "Memperkuat wibawa eksekutif, kemenangan dalam tender besar, dan kepemimpinan visioner.",
        recommendation: "Posisikan kursi kepemimpinan dan meja kerja menghadap Barat.",
        type: "positive",
        energyLevel: "+100% (Energi Vitalitas Tertinggi)",
      },
      tianYi: {
        direction: "Timur Laut",
        nameChinese: "Tian Yi (天醫)",
        category: "Kesehatan & Vitalitas",
        description: "Menjaga stamina kepemimpinan prima, kesehatan pernapasan, dan stabilitas emosional.",
        recommendation: "Posisikan kepala ranjang tidur menghadap Timur Laut.",
        type: "positive",
        energyLevel: "+80% (Dokter Surgawi)",
      },
      yanNian: {
        direction: "Barat Daya",
        nameChinese: "Yan Nian (延年)",
        category: "Harmoni & Relasi",
        description: "Memperkuat loyalitas bawahan, respek mitra bisnis, dan keharmonisan pernikahan.",
        recommendation: "Arahkan ruang dewan direksi atau ruang tamu ke Barat Daya.",
        type: "positive",
        energyLevel: "+70% (Panjang Umur & Harmoni)",
      },
      fuWei: {
        direction: "Barat Laut",
        nameChinese: "Fu Wei (伏位)",
        category: "Stabilitas & Kebijaksanaan",
        description: "Mempertajam ketegasan pengambilan keputusan strategis dan ketenangan manajerial.",
        recommendation: "Gunakan arah Barat Laut untuk ruang audit atau meja perencana eksekutif.",
        type: "positive",
        energyLevel: "+60% (Pengembangan Diri)",
      },
    },
    inauspiciousDirections: {
      huoHai: {
        direction: "Tenggara",
        nameChinese: "Huo Hai (禍害)",
        category: "Hambatan Ringan",
        description: "Perselisihan administratif dan friksi dengan staf pelaksana operasional.",
        recommendation: "Hindari penataan meja administrasi utama menghadap Tenggara.",
        type: "negative",
        energyLevel: "-50% (Potensi Gangguan Minor)",
      },
      wuGui: {
        direction: "Timur",
        nameChinese: "Wu Gui (五鬼)",
        category: "Konflik & Lima Hantu",
        description: "Risiko sabotase persaingan usaha dan ketidakjujuran rekanan kerja.",
        recommendation: "Jangan letakkan dokumen rahasia perusahaan di sudut Timur.",
        type: "negative",
        energyLevel: "-70% (Energi Lima Setan)",
      },
      liuSha: {
        direction: "Utara",
        nameChinese: "Liu Sha (六煞)",
        category: "Masalah Hukum & Skandal",
        description: "Potensi sengketa finansial atau beban hutang tak terduga yang menguras likuiditas.",
        recommendation: "Gunakan elemen dekorasi tanah kering di sektor Utara untuk menetralkan chi.",
        type: "negative",
        energyLevel: "-80% (Enam Pembunuh)",
      },
      jueMing: {
        direction: "Selatan",
        nameChinese: "Jue Ming (絕命)",
        category: "Malapetaka & Bahaya Fatal",
        description: "Benturan langsung energi Api ekstrem yang dapat meruntuhkan reputasi dan memicu krisis bisnis.",
        recommendation: "Sangat dilarang menempatkan pintu utama atau kamar tidur menghadap Selatan.",
        type: "negative",
        energyLevel: "-100% (Bahaya Total / Malapetaka)",
      },
    },
    favorableColors: ["Putih", "Emas", "Perak", "Abu-abu Terang", "Kuning Oker", "Cokelat Tanah"],
    unfavorableColors: ["Merah Terang", "Oranye Pekat", "Ungu Menyala"],
    compatibleKua: [2, 6, 7, 8],
    careerAffinities: ["CEO / Direktur Utama", "Bankir Investasi", "Hakim / Penegak Hukum", "Perwira Militer", "Industri Berat"],
    personalityTraits: "Pemimpin alami, berwibawa, disiplin tinggi, tegas, berprinsip kokoh, dan visioner.",
    fengShuiAdvice: "Gantungkan lonceng angin logam 6 batang di sektor Barat Laut untuk mengaktivasi chi perlindungan.",
  },
  7: {
    number: 7,
    trigramChinese: "兌 (Duì)",
    trigramSymbol: "☱",
    name: "Dui",
    element: "Logam",
    group: "Kelompok Barat (Xi Si Ming)",
    groupSimple: "Barat",
    baseDirection: "Barat",
    elementColor: "text-zinc-300",
    elementBg: "bg-zinc-500/10",
    elementBorder: "border-zinc-500/30",
    auspiciousDirections: {
      shengChi: {
        direction: "Barat Laut",
        nameChinese: "Sheng Chi (生氣)",
        category: "Kemakmuran & Vitalitas",
        description: "Meningkatkan daya pikat komersial, ledakan penjualan, dan kesuksesan pemasaran publik.",
        recommendation: "Arahkan meja presentasi atau meja kerja ke Barat Laut.",
        type: "positive",
        energyLevel: "+100% (Energi Vitalitas Tertinggi)",
      },
      tianYi: {
        direction: "Barat Daya",
        nameChinese: "Tian Yi (天醫)",
        category: "Kesehatan & Vitalitas",
        description: "Menjaga kesehatan pita suara, sistem pencernaan, dan keceriaan suasana batin.",
        recommendation: "Hadapkan kepala tempat tidur menghadap Barat Daya.",
        type: "positive",
        energyLevel: "+80% (Dokter Surgawi)",
      },
      yanNian: {
        direction: "Timur Laut",
        nameChinese: "Yan Nian (延年)",
        category: "Harmoni & Relasi",
        description: "Memperluas jejaring koneksi sosial elit, persahabatan tulus, dan romantisme asmara.",
        recommendation: "Gunakan arah Timur Laut untuk area resepsi tamu atau ruang makan.",
        type: "positive",
        energyLevel: "+70% (Panjang Umur & Harmoni)",
      },
      fuWei: {
        direction: "Barat",
        nameChinese: "Fu Wei (伏位)",
        category: "Stabilitas & Kebijaksanaan",
        description: "Menumbuhkan kepiawaian komunikasi persuasif, kecerdasan retorika, dan ketenangan diri.",
        recommendation: "Sangat cocok untuk meja persiapan presentasi atau podcast studio.",
        type: "positive",
        energyLevel: "+60% (Pengembangan Diri)",
      },
    },
    inauspiciousDirections: {
      huoHai: {
        direction: "Utara",
        nameChinese: "Huo Hai (禍害)",
        category: "Hambatan Ringan",
        description: "Kritik tajam tak beralasan dan kegagalan closing transaksi akibat salah paham.",
        recommendation: "Hindari bernegosiasi dengan posisi duduk menghadap Utara.",
        type: "negative",
        energyLevel: "-50% (Potensi Gangguan Minor)",
      },
      wuGui: {
        direction: "Selatan",
        nameChinese: "Wu Gui (五鬼)",
        category: "Konflik & Lima Hantu",
        description: "Pertengkaran sengit di lingkungan kerja dan kerugian reputasi di ranah publik.",
        recommendation: "Hindari pencahayaan merah mencolok di sektor Selatan.",
        type: "negative",
        energyLevel: "-70% (Energi Lima Setan)",
      },
      liuSha: {
        direction: "Tenggara",
        nameChinese: "Liu Sha (六煞)",
        category: "Masalah Hukum & Skandal",
        description: "Peluang manipulasi kontrak dagang atau keterlibatan dalam konflik rekan bisnis.",
        recommendation: "Tempatkan partisi netral di sektor Tenggara.",
        type: "negative",
        energyLevel: "-80% (Enam Pembunuh)",
      },
      jueMing: {
        direction: "Timur",
        nameChinese: "Jue Ming (絕命)",
        category: "Malapetaka & Bahaya Fatal",
        description: "Keruntuhan stabilitas pendapatan dan risiko cedera fisik yang parah.",
        recommendation: "Jangan posisikan pintu masuk utama menghadap Timur.",
        type: "negative",
        energyLevel: "-100% (Bahaya Total / Malapetaka)",
      },
    },
    favorableColors: ["Putih Mutiara", "Perak", "Abu-abu Metalik", "Emas", "Krem"],
    unfavorableColors: ["Merah Menyala", "Magenta", "Oranye Terang"],
    compatibleKua: [2, 6, 7, 8],
    careerAffinities: ["Public Speaker", "Marketer & Influencer", "Pengacara Negosiasi", "Pengusaha Kuliner", "Artis"],
    personalityTraits: "Ekspresif, ceria, komunikator ulung, persuasif, menyenangkan, dan berwawasan lincah.",
    fengShuiAdvice: "Letakkan mangkuk kristal atau ornamen logam bundar di sektor Barat untuk mengundang energi rezeki.",
  },
  8: {
    number: 8,
    trigramChinese: "艮 (Gèn)",
    trigramSymbol: "☶",
    name: "Gen",
    element: "Tanah",
    group: "Kelompok Barat (Xi Si Ming)",
    groupSimple: "Barat",
    baseDirection: "Timur Laut",
    elementColor: "text-yellow-400",
    elementBg: "bg-yellow-500/10",
    elementBorder: "border-yellow-500/30",
    auspiciousDirections: {
      shengChi: {
        direction: "Barat Daya",
        nameChinese: "Sheng Chi (生氣)",
        category: "Kemakmuran & Vitalitas",
        description: "Mendorong akumulasi aset properti, keuntungan investasi jangka panjang, dan rezeki melimpah.",
        recommendation: "Arahkan meja kerja utama atau ruang investasi ke Barat Daya.",
        type: "positive",
        energyLevel: "+100% (Energi Vitalitas Tertinggi)",
      },
      tianYi: {
        direction: "Barat Laut",
        nameChinese: "Tian Yi (天醫)",
        category: "Kesehatan & Vitalitas",
        description: "Memperkuat struktur tulang sendi, vitalitas fisik kokoh, dan ketahanan terhadap penyakit.",
        recommendation: "Posisikan kepala ranjang tidur menghadap Barat Laut.",
        type: "positive",
        energyLevel: "+80% (Dokter Surgawi)",
      },
      yanNian: {
        direction: "Barat",
        nameChinese: "Yan Nian (延年)",
        category: "Harmoni & Relasi",
        description: "Menumbuhkan kesetiaan dalam ikatan perkawinan dan reputasi kejujuran di mata klien.",
        recommendation: "Arahkan ruang pertemuan keluarga menghadap Barat.",
        type: "positive",
        energyLevel: "+70% (Panjang Umur & Harmoni)",
      },
      fuWei: {
        direction: "Timur Laut",
        nameChinese: "Fu Wei (伏位)",
        category: "Stabilitas & Kebijaksanaan",
        description: "Memperdalam kejernihan batin, ketajaman riset akademik, dan ketenangan kontemplatif.",
        recommendation: "Ideal untuk perpustakaan pribadi, meja riset, atau ruang meditasi.",
        type: "positive",
        energyLevel: "+60% (Pengembangan Diri)",
      },
    },
    inauspiciousDirections: {
      huoHai: {
        direction: "Selatan",
        nameChinese: "Huo Hai (禍害)",
        category: "Hambatan Ringan",
        description: "Rasa malas, penundaan eksekusi tugas, dan perdebatan internal yang melelahkan.",
        recommendation: "Hindari menghadap Selatan saat menyusun rencana keuangan penting.",
        type: "negative",
        energyLevel: "-50% (Potensi Gangguan Minor)",
      },
      wuGui: {
        direction: "Utara",
        nameChinese: "Wu Gui (五鬼)",
        category: "Konflik & Lima Hantu",
        description: "Risiko penipuan finansial online atau pencurian data penting yang merugikan aset.",
        recommendation: "Jangan letakkan server komputer atau brankas menghadap Utara.",
        type: "negative",
        energyLevel: "-70% (Energi Lima Setan)",
      },
      liuSha: {
        direction: "Barat",
        nameChinese: "Liu Sha (六煞)",
        category: "Masalah Hukum & Skandal",
        description: "Hambatan hubungan personal yang memicu isolasi diri dan kecemasan mental.",
        recommendation: "Redam sektor Barat dengan ornamen keramik bumi.",
        type: "negative",
        energyLevel: "-80% (Enam Pembunuh)",
      },
      jueMing: {
        direction: "Tenggara",
        nameChinese: "Jue Ming (絕命)",
        category: "Malapetaka & Bahaya Fatal",
        description: "Kehilangan aset properti secara drastis atau kegagalan bisnis keluarga yang fatal.",
        recommendation: "Pastikan sektor Tenggara difungsikan murni untuk area servis atau kamar mandi.",
        type: "negative",
        energyLevel: "-100% (Bahaya Total / Malapetaka)",
      },
    },
    favorableColors: ["Cokelat Tanah", "Krem", "Kuning Mustard", "Oranye Bata", "Merah Marun"],
    unfavorableColors: ["Hijau Tua", "Hijau Daun", "Cokelat Kayu"],
    compatibleKua: [2, 6, 7, 8],
    careerAffinities: ["Investor Properti", "Akuntan Publik", "Peneliti Ilmiah", "Konsultan Keuangan", "Geolog"],
    personalityTraits: "Kokoh laksana gunung, teguh memegang janji, tenang menghadapi badai, metodis, dan bijaksana.",
    fengShuiAdvice: "Pajang geoda kristal alami atau lukisan pegunungan tanpa air di sektor Timur Laut.",
  },
  9: {
    number: 9,
    trigramChinese: "離 (Lí)",
    trigramSymbol: "☲",
    name: "Li",
    element: "Api",
    group: "Kelompok Timur (Dong Si Ming)",
    groupSimple: "Timur",
    baseDirection: "Selatan",
    elementColor: "text-rose-400",
    elementBg: "bg-rose-500/10",
    elementBorder: "border-rose-500/30",
    auspiciousDirections: {
      shengChi: {
        direction: "Timur",
        nameChinese: "Sheng Chi (生氣)",
        category: "Kemakmuran & Vitalitas",
        description: "Memicu popularitas publik meluas, ketenaran brand, dan pertumbuhan bisnis yang meledak.",
        recommendation: "Hadapkan meja kerja atau pintu utama ruko/kantor ke Timur.",
        type: "positive",
        energyLevel: "+100% (Energi Vitalitas Tertinggi)",
      },
      tianYi: {
        direction: "Tenggara",
        nameChinese: "Tian Yi (天醫)",
        category: "Kesehatan & Vitalitas",
        description: "Menyehatkan sistem kardiovaskular, mata, dan menjaga gairah semangat hidup membara.",
        recommendation: "Posisikan kepala ranjang tidur menghadap Tenggara.",
        type: "positive",
        energyLevel: "+80% (Dokter Surgawi)",
      },
      yanNian: {
        direction: "Utara",
        nameChinese: "Yan Nian (延年)",
        category: "Harmoni & Relasi",
        description: "Menarik relasi bisnis tingkat tinggi yang saling menguntungkan dan daya pesona asmara.",
        recommendation: "Gunakan arah Utara untuk ruang negosiasi VIP atau ruang keluarga.",
        type: "positive",
        energyLevel: "+70% (Panjang Umur & Harmoni)",
      },
      fuWei: {
        direction: "Selatan",
        nameChinese: "Fu Wei (伏位)",
        category: "Stabilitas & Kebijaksanaan",
        description: "Menjernihkan wawasan visi masa depan, kecemerlangan ide branding, dan ketenangan reputasi.",
        recommendation: "Sangat tepat untuk studio konten, meja desain kreatif, atau ruang pamer.",
        type: "positive",
        energyLevel: "+60% (Pengembangan Diri)",
      },
    },
    inauspiciousDirections: {
      huoHai: {
        direction: "Timur Laut",
        nameChinese: "Huo Hai (禍害)",
        category: "Hambatan Ringan",
        description: "Kemarahan mendadak yang memicu perselisihan argumen dan pemborosan uang saku.",
        recommendation: "Hindari menghadap Timur Laut saat bernegosiasi harga.",
        type: "negative",
        energyLevel: "-50% (Potensi Gangguan Minor)",
      },
      wuGui: {
        direction: "Barat",
        nameChinese: "Wu Gui (五鬼)",
        category: "Konflik & Lima Hantu",
        description: "Kecemburuan rekan kerja dan risiko pelanggaran hak cipta atau pencurian ide orisinal.",
        recommendation: "Jangan posisikan karya konsep menghadap langsung ke Barat.",
        type: "negative",
        energyLevel: "-70% (Energi Lima Setan)",
      },
      liuSha: {
        direction: "Barat Daya",
        nameChinese: "Liu Sha (六煞)",
        category: "Masalah Hukum & Skandal",
        description: "Kekisruhan dalam hubungan personal atau fitnah media yang mencoreng citra.",
        recommendation: "Pasang pencahayaan hangat dan ornamen kayu di sektor Barat Daya.",
        type: "negative",
        energyLevel: "-80% (Enam Pembunuh)",
      },
      jueMing: {
        direction: "Barat Laut",
        nameChinese: "Jue Ming (絕命)",
        category: "Malapetaka & Bahaya Fatal",
        description: "Kehilangan pengaruh kepemimpinan secara tiba-tiba dan kebangkrutan usaha fatal.",
        recommendation: "Hindari penempatan pintu utama atau meja pimpinan menghadap Barat Laut.",
        type: "negative",
        energyLevel: "-100% (Bahaya Total / Malapetaka)",
      },
    },
    favorableColors: ["Merah Menyala", "Oranye Terang", "Ungu Tua", "Pink Magenta", "Hijau Daun"],
    unfavorableColors: ["Biru Tua", "Hitam", "Abu-abu Gelap"],
    compatibleKua: [1, 3, 4, 9],
    careerAffinities: ["Digital Marketer", "Sutradara Media", "Public Relations", "Pengusaha Kreatif", "Konsultan Branding"],
    personalityTraits: "Karismatik, penuh inspirasi, dinamis, cerdas menarik atensi publik, hangat, dan visioner.",
    fengShuiAdvice: "Pasang lampu bercahaya hangat atau ornamen kayu piramida merah di sektor Selatan.",
  },
};

// =============================================================================
// HELPER PERHITUNGAN MATEMATIS KUA NUMBER FENG SHUI
// =============================================================================

function reduceToSingleDigit(num: number): number {
  let val = Math.abs(num);
  while (val > 9) {
    val = val
      .toString()
      .split("")
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return val;
}

export function computeKuaProfile(year: number, gender: GenderType): KuaProfile {
  const safeYear = Math.max(1900, Math.min(2099, year));
  const lastTwoDigits = safeYear % 100;
  const reducedSum = reduceToSingleDigit(lastTwoDigits);

  let rawKua = 0;
  if (gender === "pria") {
    if (safeYear < 2000) {
      rawKua = 10 - reducedSum;
    } else {
      rawKua = 9 - reducedSum;
    }
  } else {
    if (safeYear < 2000) {
      rawKua = 5 + reducedSum;
    } else {
      rawKua = 6 + reducedSum;
    }
  }

  let finalNumber = reduceToSingleDigit(rawKua);
  if (finalNumber === 0) {
    finalNumber = 9;
  }

  const originalCalculatedNumber = finalNumber;
  let isTransformed = false;

  // Kasus Khusus Kua 5 (Aturan Klasik Ba Zhai):
  if (finalNumber === 5) {
    isTransformed = true;
    if (gender === "pria") {
      finalNumber = 2; // Pria Kua 5 mengadopsi Kua 2 (Kun)
    } else {
      finalNumber = 8; // Wanita Kua 5 mengadopsi Kua 8 (Gen)
    }
  }

  const baseData = KUA_DATA_MAP[finalNumber] || KUA_DATA_MAP[1];

  return {
    ...baseData,
    number: finalNumber,
    originalCalculatedNumber,
    isTransformed,
  };
}

// =============================================================================
// KOMPONEN UTAMA KALKULATOR KUA NUMBER
// =============================================================================

export function KuaNumberCalculator() {
  // 1. Sinkronisasi URL Query State dengan nuqs
  const [tahunLahir, setTahunLahir] = useQueryState(
    "tahunLahir",
    parseAsInteger.withDefault(1990)
  );
  const [gender, setGender] = useQueryState(
    "gender",
    parseAsString.withDefault("pria")
  );

  // 2. State Lokal untuk Hasil Kalkulasi & UI
  const [activeTab, setActiveTab] = React.useState<"auspicious" | "inauspicious" | "advice">("auspicious");
  const [errorText, setErrorText] = React.useState<string>("");

  const selectedYear = tahunLahir ?? 1990;
  const selectedGender = (gender === "wanita" ? "wanita" : "pria") as GenderType;

  // 3. Eksekusi Perhitungan Real-Time
  const profile = React.useMemo(() => {
    return computeKuaProfile(selectedYear, selectedGender);
  }, [selectedYear, selectedGender]);

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      setTahunLahir(1990);
      setErrorText("Tahun kelahiran wajib berupa angka valid.");
    } else if (val < 1900 || val > 2099) {
      setTahunLahir(val);
      setErrorText("Rentang tahun kalender solar valid adalah 1900 - 2099.");
    } else {
      setErrorText("");
      setTahunLahir(val);
    }
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGender(e.target.value);
  };

  const handleReset = () => {
    setTahunLahir(1990);
    setGender("pria");
    setErrorText("");
  };

  const setPreset = (yr: number, g: GenderType) => {
    setTahunLahir(yr);
    setGender(g);
    setErrorText("");
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* ======================================================================= */}
      {/* KOLOM KIRI: PARAMETER INPUT & KONTROL TEKNIS (lg:col-span-5)           */}
      {/* ======================================================================= */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          {/* Header Parameter */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Kelahiran
                </h2>
                <p className="text-secondary text-xs mt-0.5">
                  Kalkulasi Ba Zhai presisi berdasarkan kalender surya Hsia
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={handleReset}
              className="px-3 py-1.5 text-xs h-auto min-h-0 flex items-center gap-1.5"
              title="Reset ke parameter default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
          </div>

          {/* Form Input */}
          <div className="flex flex-col gap-5">
            {/* Input Tahun Lahir */}
            <div className="flex flex-col gap-2">
              <Input
                label="Tahun Kelahiran (Kalender Solar Hsia)"
                type="number"
                min={1900}
                max={2099}
                value={selectedYear}
                onChange={handleYearChange}
                error={!!errorText}
                helperText={
                  errorText ||
                  "Gunakan tahun Masehi. Jika Anda lahir antara 1 Jan - 4 Feb (sebelum Li Chun), kurangi 1 tahun."
                }
              />

              {/* Preset Cepat Pengujian */}
              <div className="flex flex-col gap-2 pt-2">
                <span className="text-xs text-secondary font-medium">
                  Preset Kalender Referensi:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { label: "1988 (Pria)", year: 1988, g: "pria" as GenderType },
                    { label: "1990 (Wanita - Kua 5)", year: 1990, g: "wanita" as GenderType },
                    { label: "1995 (Pria - Kua 5)", year: 1995, g: "pria" as GenderType },
                    { label: "2000 (Milenium)", year: 2000, g: "pria" as GenderType },
                    { label: "2008 (Wanita)", year: 2008, g: "wanita" as GenderType },
                  ].map((preset) => (
                    <button
                      key={`${preset.year}-${preset.g}`}
                      type="button"
                      onClick={() => setPreset(preset.year, preset.g)}
                      className={cn(
                        "px-2.5 py-1 text-xs rounded-lg border font-mono transition-all",
                        selectedYear === preset.year && selectedGender === preset.g
                          ? "bg-accent/15 border-accent text-accent font-semibold shadow-[0_0_10px_var(--accent-glow)]"
                          : "bg-base border-border text-secondary hover:text-primary hover:bg-elevated"
                      )}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input Jenis Kelamin Biologis */}
            <Select
              label="Jenis Kelamin Biologis"
              value={selectedGender}
              onChange={handleGenderChange}
              helperText="Rumus reduksi matematika Kua dibedakan secara matematis untuk pria dan wanita."
            >
              <option value="pria">Pria (Male)</option>
              <option value="wanita">Wanita (Female)</option>
            </Select>

            {/* Kotak Catatan Pergantian Tahun Solar (Li Chun) */}
            <div className="p-4 rounded-xl border border-border/80 bg-base/50 flex flex-col gap-2 text-xs text-secondary leading-relaxed">
              <div className="flex items-center gap-2 text-primary font-medium">
                <Calendar className="w-4 h-4 text-accent shrink-0" />
                <span>Aturan Batas Penanggalan Solar (Li Chun)</span>
              </div>
              <p>
                Tahun Feng Shui dihitung berdasarkan <strong>Kalender Solar Hsia</strong> yang selalu dimulai pada tanggal <strong>4 Februari (Li Chun / Awal Musim Semi)</strong>, bukan 1 Januari Masehi ataupun Tahun Baru Imlek Imlek Lunar.
              </p>
              <p className="text-accent font-mono">
                Contoh: Lahir 15 Januari 1990 → Gunakan tahun 1989.
              </p>
            </div>
          </div>
        </Card>

        {/* Ringkasan Elemen & Trigram */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Layers className="w-4 h-4 text-accent" />
            <span>Karakteristik Elemen & Trigram</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-base border border-border flex flex-col gap-1">
              <span className="text-xs text-secondary">Trigram Bagua</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-mono text-primary">{profile.trigramSymbol}</span>
                <span className="text-sm font-semibold text-primary">{profile.trigramChinese}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-base border border-border flex flex-col gap-1">
              <span className="text-xs text-secondary">Elemen Lima Unsur</span>
              <div className="flex items-center gap-2">
                {profile.element === "Air" && <Droplets className="w-4 h-4 text-sky-400" />}
                {profile.element === "Tanah" && <Mountain className="w-4 h-4 text-amber-400" />}
                {profile.element === "Kayu" && <Sparkles className="w-4 h-4 text-emerald-400" />}
                {profile.element === "Logam" && <ShieldCheck className="w-4 h-4 text-slate-300" />}
                {profile.element === "Api" && <Flame className="w-4 h-4 text-rose-400" />}
                <span className={cn("text-sm font-semibold", profile.elementColor)}>
                  {profile.element}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-base border border-border flex flex-col gap-1">
              <span className="text-xs text-secondary">Kelompok Energi</span>
              <span className="text-sm font-semibold text-primary">{profile.groupSimple}</span>
            </div>

            <div className="p-3 rounded-xl bg-base border border-border flex flex-col gap-1">
              <span className="text-xs text-secondary">Arah Dasar Asal</span>
              <span className="text-sm font-semibold text-primary">{profile.baseDirection}</span>
            </div>
          </div>

          <div className="text-xs text-secondary leading-relaxed pt-2 border-t border-border">
            <strong>Karakter Bawaan:</strong> {profile.personalityTraits}
          </div>
        </Card>
      </div>

      {/* ======================================================================= */}
      {/* KOLOM KANAN: OUTPUT UTAMA & ANALISIS 8 ARAH FENG SHUI (lg:col-span-7)  */}
      {/* ======================================================================= */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {/* Output Box Utama Angka Kua */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6">
            <OutputBox
              label="Angka Kua Feng Shui Utama"
              value={profile.number}
              prefix="Kua "
              decimals={0}
              className="h-full"
            />
          </div>

          <Card className="sm:col-span-6 flex flex-col justify-center gap-2 p-5">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-secondary font-semibold">
                Klasifikasi Ba Zhai
              </span>
              <span
                className={cn(
                  "px-2 py-0.5 text-[11px] font-semibold rounded-full border",
                  profile.elementBg,
                  profile.elementBorder,
                  profile.elementColor
                )}
              >
                {profile.groupSimple} Group
              </span>
            </div>
            <div className="text-lg font-bold text-primary font-display flex items-center gap-2">
              <span>{profile.name}</span>
              <span className="text-secondary font-normal text-sm font-sans">
                ({profile.element})
              </span>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              Tergolong dalam <strong>{profile.group}</strong>. Arah terbaik untuk kesuksesan rezeki adalah <strong>{profile.auspiciousDirections.shengChi.direction}</strong>.
            </p>
          </Card>
        </div>

        {/* Notifikasi Transformasi Kua 5 (Jika Relevan) */}
        {profile.isTransformed && (
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3 text-xs leading-relaxed text-amber-200">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">
                Catatan Transformasi Kua 5 (Aturan Klasik Ba Zhai):
              </p>
              <p className="mt-0.5 text-secondary">
                Hasil reduksi matematis Anda adalah <strong>Kua 5</strong> (Pusat / Netral). Karena pusat tidak memiliki orientasi arah mata angin luar pada kompas Bagua, aturan klasik menetapkan bahwa <strong>Pria Kua 5 mengadopsi Kua 2 (Kun - Barat Daya)</strong> dan <strong>Wanita Kua 5 mengadopsi Kua 8 (Gen - Timur Laut)</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Tab Navigasi Analisis Arah */}
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("auspicious")}
            className={cn(
              "px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2",
              activeTab === "auspicious"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                : "text-secondary hover:text-primary hover:bg-elevated"
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            4 Arah Keberuntungan (+Chi)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inauspicious")}
            className={cn(
              "px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2",
              activeTab === "inauspicious"
                ? "bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.2)]"
                : "text-secondary hover:text-primary hover:bg-elevated"
            )}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            4 Arah Pantangan (-Chi)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("advice")}
            className={cn(
              "px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2",
              activeTab === "advice"
                ? "bg-accent/15 text-accent border border-accent/30 shadow-[0_0_12px_var(--accent-glow)]"
                : "text-secondary hover:text-primary hover:bg-elevated"
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Panduan Tata Ruang
          </button>
        </div>

        {/* Tab 1: 4 Arah Keberuntungan */}
        {activeTab === "auspicious" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sheng Chi */}
            <Card className="flex flex-col gap-2 p-4 border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-emerald-300">
                    {profile.auspiciousDirections.shengChi.nameChinese}
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  {profile.auspiciousDirections.shengChi.direction}
                </span>
              </div>
              <p className="text-xs font-medium text-primary">
                {profile.auspiciousDirections.shengChi.category}
              </p>
              <p className="text-xs text-secondary leading-relaxed">
                {profile.auspiciousDirections.shengChi.description}
              </p>
              <div className="mt-2 pt-2 border-t border-emerald-500/20 text-[11px] text-emerald-400/90 font-medium">
                💡 <strong>Rekomendasi:</strong> {profile.auspiciousDirections.shengChi.recommendation}
              </div>
            </Card>

            {/* Tian Yi */}
            <Card className="flex flex-col gap-2 p-4 border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Heart className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-emerald-300">
                    {profile.auspiciousDirections.tianYi.nameChinese}
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  {profile.auspiciousDirections.tianYi.direction}
                </span>
              </div>
              <p className="text-xs font-medium text-primary">
                {profile.auspiciousDirections.tianYi.category}
              </p>
              <p className="text-xs text-secondary leading-relaxed">
                {profile.auspiciousDirections.tianYi.description}
              </p>
              <div className="mt-2 pt-2 border-t border-emerald-500/20 text-[11px] text-emerald-400/90 font-medium">
                💡 <strong>Rekomendasi:</strong> {profile.auspiciousDirections.tianYi.recommendation}
              </div>
            </Card>

            {/* Yan Nian */}
            <Card className="flex flex-col gap-2 p-4 border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-emerald-300">
                    {profile.auspiciousDirections.yanNian.nameChinese}
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  {profile.auspiciousDirections.yanNian.direction}
                </span>
              </div>
              <p className="text-xs font-medium text-primary">
                {profile.auspiciousDirections.yanNian.category}
              </p>
              <p className="text-xs text-secondary leading-relaxed">
                {profile.auspiciousDirections.yanNian.description}
              </p>
              <div className="mt-2 pt-2 border-t border-emerald-500/20 text-[11px] text-emerald-400/90 font-medium">
                💡 <strong>Rekomendasi:</strong> {profile.auspiciousDirections.yanNian.recommendation}
              </div>
            </Card>

            {/* Fu Wei */}
            <Card className="flex flex-col gap-2 p-4 border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-emerald-300">
                    {profile.auspiciousDirections.fuWei.nameChinese}
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  {profile.auspiciousDirections.fuWei.direction}
                </span>
              </div>
              <p className="text-xs font-medium text-primary">
                {profile.auspiciousDirections.fuWei.category}
              </p>
              <p className="text-xs text-secondary leading-relaxed">
                {profile.auspiciousDirections.fuWei.description}
              </p>
              <div className="mt-2 pt-2 border-t border-emerald-500/20 text-[11px] text-emerald-400/90 font-medium">
                💡 <strong>Rekomendasi:</strong> {profile.auspiciousDirections.fuWei.recommendation}
              </div>
            </Card>
          </div>
        )}

        {/* Tab 2: 4 Arah Pantangan */}
        {activeTab === "inauspicious" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Huo Hai */}
            <Card className="flex flex-col gap-2 p-4 border-rose-500/30 bg-rose-500/5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-rose-300">
                  {profile.inauspiciousDirections.huoHai.nameChinese}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
                  {profile.inauspiciousDirections.huoHai.direction}
                </span>
              </div>
              <p className="text-xs font-medium text-primary">
                {profile.inauspiciousDirections.huoHai.category}
              </p>
              <p className="text-xs text-secondary leading-relaxed">
                {profile.inauspiciousDirections.huoHai.description}
              </p>
              <div className="mt-2 pt-2 border-t border-rose-500/20 text-[11px] text-rose-400/90">
                ⚠️ <strong>Pantangan:</strong> {profile.inauspiciousDirections.huoHai.recommendation}
              </div>
            </Card>

            {/* Wu Gui */}
            <Card className="flex flex-col gap-2 p-4 border-rose-500/30 bg-rose-500/5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-rose-300">
                  {profile.inauspiciousDirections.wuGui.nameChinese}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
                  {profile.inauspiciousDirections.wuGui.direction}
                </span>
              </div>
              <p className="text-xs font-medium text-primary">
                {profile.inauspiciousDirections.wuGui.category}
              </p>
              <p className="text-xs text-secondary leading-relaxed">
                {profile.inauspiciousDirections.wuGui.description}
              </p>
              <div className="mt-2 pt-2 border-t border-rose-500/20 text-[11px] text-rose-400/90">
                ⚠️ <strong>Pantangan:</strong> {profile.inauspiciousDirections.wuGui.recommendation}
              </div>
            </Card>

            {/* Liu Sha */}
            <Card className="flex flex-col gap-2 p-4 border-rose-500/30 bg-rose-500/5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-rose-300">
                  {profile.inauspiciousDirections.liuSha.nameChinese}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
                  {profile.inauspiciousDirections.liuSha.direction}
                </span>
              </div>
              <p className="text-xs font-medium text-primary">
                {profile.inauspiciousDirections.liuSha.category}
              </p>
              <p className="text-xs text-secondary leading-relaxed">
                {profile.inauspiciousDirections.liuSha.description}
              </p>
              <div className="mt-2 pt-2 border-t border-rose-500/20 text-[11px] text-rose-400/90">
                ⚠️ <strong>Pantangan:</strong> {profile.inauspiciousDirections.liuSha.recommendation}
              </div>
            </Card>

            {/* Jue Ming */}
            <Card className="flex flex-col gap-2 p-4 border-rose-500/30 bg-rose-500/5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-rose-300">
                  {profile.inauspiciousDirections.jueMing.nameChinese}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
                  {profile.inauspiciousDirections.jueMing.direction}
                </span>
              </div>
              <p className="text-xs font-medium text-primary">
                {profile.inauspiciousDirections.jueMing.category}
              </p>
              <p className="text-xs text-secondary leading-relaxed">
                {profile.inauspiciousDirections.jueMing.description}
              </p>
              <div className="mt-2 pt-2 border-t border-rose-500/20 text-[11px] text-rose-400/90">
                ⚠️ <strong>Pantangan:</strong> {profile.inauspiciousDirections.jueMing.recommendation}
              </div>
            </Card>
          </div>
        )}

        {/* Tab 3: Panduan Penataan Ruang & Feng Shui Praktis */}
        {activeTab === "advice" && (
          <Card className="flex flex-col gap-5 p-5">
            <div>
              <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                Rekomendasi Tata Ruang Hunian & Ruang Kerja
              </h3>
              <p className="text-xs text-secondary mt-1">
                Optimasi penataan spasial berdasarkan arah aliran chi Kua {profile.number}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-base border border-border flex flex-col gap-1.5">
                <span className="text-xs font-medium text-primary flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-accent" />
                  Posisi Meja Kerja & Pintu Kantor
                </span>
                <p className="text-xs text-secondary leading-relaxed">
                  Hadapkan meja kerja ke <strong>{profile.auspiciousDirections.shengChi.direction} (Sheng Chi)</strong> untuk memaksimalkan kepemimpinan, atau ke <strong>{profile.auspiciousDirections.fuWei.direction} (Fu Wei)</strong> untuk fokus analitis.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-base border border-border flex flex-col gap-1.5">
                <span className="text-xs font-medium text-primary flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  Arah Kepala Tempat Tidur
                </span>
                <p className="text-xs text-secondary leading-relaxed">
                  Posisikan sandaran kepala ranjang menghadap <strong>{profile.auspiciousDirections.tianYi.direction} (Tian Yi)</strong> untuk imunitas dan pemulihan, atau ke <strong>{profile.auspiciousDirections.yanNian.direction} (Yan Nian)</strong> untuk keharmonisan asmara.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-base border border-border flex flex-col gap-1.5">
                <span className="text-xs font-medium text-primary flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Warna Ruangan & Ornamen
                </span>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {profile.favorableColors.map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 text-[11px] rounded-md bg-accent/10 text-accent border border-accent/20"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-base border border-border flex flex-col gap-1.5">
                <span className="text-xs font-medium text-primary flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  Angka Kua Kompatibel
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  {profile.compatibleKua.map((num) => (
                    <span
                      key={num}
                      className="w-7 h-7 rounded-lg bg-base border border-border flex items-center justify-center text-xs font-mono font-bold text-primary"
                    >
                      {num}
                    </span>
                  ))}
                  <span className="text-[11px] text-secondary">
                    (Sesama {profile.groupSimple})
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-accent/5 border border-accent/20 text-xs text-secondary leading-relaxed">
              <strong>Saran Ahli:</strong> {profile.fengShuiAdvice}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default KuaNumberCalculator;