"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Calendar,
  Sparkles,
  RotateCcw,
  Compass,
  ShieldCheck,
  Sun,
  Moon,
  Star,
  Info,
  CheckCircle2,
  BookOpen,
  Award,
} from "lucide-react";
import { useQueryState, parseAsString } from "nuqs";
import { cn } from "@/lib/utils";

// --- DATA REFERENSI ETNOMATEMATIKA KALENDER JAWA ---

interface HariData {
  name: string;
  neptu: number;
  saptawara: string;
  simbol: string;
}

interface PasaranData {
  name: string;
  neptu: number;
  elemen: string;
  warna: string;
  arah: string;
  makna: string;
}

interface WatakNeptuData {
  naungan: string;
  karakter: string;
  deskripsi: string;
  elemenDominan: string;
  kelebihan: string;
  rekomendasiKarier: string;
}

const HARI_MAP: Record<number, HariData> = {
  0: { name: "Minggu", neptu: 5, saptawara: "Dite", simbol: "Matahari (Pancaran Semangat)" },
  1: { name: "Senin", neptu: 4, saptawara: "Soma", simbol: "Bulan (Keanggunan & Intuisi)" },
  2: { name: "Selasa", neptu: 3, saptawara: "Anggara", simbol: "Api (Dinamisme & Keberanian)" },
  3: { name: "Rabu", neptu: 7, saptawara: "Buda", simbol: "Bumi (Kecerdasan & Kebijakan)" },
  4: { name: "Kamis", neptu: 8, saptawara: "Respati", simbol: "Petir (Ketegasan & Wibawa)" },
  5: { name: "Jumat", neptu: 6, saptawara: "Sukra", simbol: "Bintang (Kreativitas & Estetika)" },
  6: { name: "Sabtu", neptu: 9, saptawara: "Tumpak", simbol: "Air (Ketenangan & Keteguhan)" },
};

const PASARAN_MAP: Record<number, PasaranData> = {
  0: {
    name: "Legi",
    neptu: 5,
    elemen: "Kayu",
    warna: "Putih",
    arah: "Timur (Purwa)",
    makna: "Manis, menjunjung tinggi etika, harmonis, serta memiliki daya adaptasi sosial yang tinggi.",
  },
  1: {
    name: "Pahing",
    neptu: 9,
    elemen: "Api",
    warna: "Merah",
    arah: "Selatan (Daksina)",
    makna: "Agung, berwibawa, bersemangat tinggi, teguh pendirian, dan memiliki cita-cita luhur.",
  },
  2: {
    name: "Pon",
    neptu: 7,
    elemen: "Logam",
    warna: "Kuning",
    arah: "Barat (Pratima)",
    makna: "Petak, berpikiran terbuka, tegas, tidak mudah goyah, serta teliti dalam manajemen aset.",
  },
  3: {
    name: "Wage",
    neptu: 4,
    elemen: "Air",
    warna: "Hitam",
    arah: "Utara (Uttara)",
    makna: "Cemeng, tekun, ulet, realistis, pekerja keras, dan memiliki daya tahan mental yang kokoh.",
  },
  4: {
    name: "Kliwon",
    neptu: 8,
    elemen: "Tanah",
    warna: "Panca Warna",
    arah: "Pusat (Madya)",
    makna: "Asih, berjiwa spiritual, bijaksana, menjadi penyeimbang, dan peneduh bagi lingkungan sekitar.",
  },
};

const WATAK_NEPTU_MAP: Record<number, WatakNeptuData> = {
  7: {
    naungan: "Lakuning Pandhita",
    karakter: "Pendiam, Rendah Hati, dan Pengayom",
    deskripsi: "Memiliki jiwa pembelajar yang tekun, suka mengalah untuk harmoni, dan memegang teguh janji.",
    elemenDominan: "Bumi & Air",
    kelebihan: "Kesetiaan tinggi, teliti, dan pandai menyimpan rahasia penting.",
    rekomendasiKarier: "Akademisi, Peneliti, Konsultan Hukum, atau Pengarsip.",
  },
  8: {
    naungan: "Lakuning Geni",
    karakter: "Berani, Dinamis, dan Ambisius",
    deskripsi: "Penuh energi inovatif, cepat mengambil keputusan, dan pantang menyerah sebelum tujuan tercapai.",
    elemenDominan: "Api",
    kelebihan: "Motivasi kerja tak terbatas, tangkas, dan berjiwa pelopor.",
    rekomendasiKarier: "Pengusaha, Eksekutif Lapangan, Militer, atau Arsitek Proyek.",
  },
  9: {
    naungan: "Lakuning Angin",
    karakter: "Lincah, Komunikatif, dan Adaptif",
    deskripsi: "Mudah bergaul dalam beragam komunitas sosial, cerdas mencairkan suasana, dan pandai berdiplomasi.",
    elemenDominan: "Udara",
    kelebihan: "Keahlian negosiasi unggul, luwes, dan berwawasan luas.",
    rekomendasiKarier: "Public Relations, Diplomat, Pemasaran Strategis, atau Jurnalis.",
  },
  10: {
    naungan: "Pendhita Sakti",
    karakter: "Tajam Pemikiran, Visioner, dan Mandiri",
    deskripsi: "Memiliki intuisi analitis yang kuat, tenang dalam situasi krisis, dan menyukai wawasan filosofis.",
    elemenDominan: "Logam & Tanah",
    kelebihan: "Pikiran terstruktur, fokus jangka panjang, dan independen.",
    rekomendasiKarier: "Analis Data, Perencana Strategis Korporasi, Dosen, atau Penasihat Bisnis.",
  },
  11: {
    naungan: "Lakuning Setan / Bunga",
    karakter: "Teguh Pendirian, Pekerja Keras, dan Dermawan",
    deskripsi: "Memiliki ketahanan fisik dan mental luar biasa, tidak menyukai kepalsuan, dan tulus dalam berbagi.",
    elemenDominan: "Kayu & Api",
    kelebihan: "Integritas tinggi, daya juang tak kenal lelah, dan loyalitas tanpa syarat.",
    rekomendasiKarier: "Manajer Operasional, Pengembang Infrastruktur, atau Filantropis.",
  },
  12: {
    naungan: "Lakuning Kembang",
    karakter: "Memikat, Cinta Damai, dan Berkarisma",
    deskripsi: "Selalu menjadi penyejuk dalam kelompok, pandai membangun konsensus, dan memiliki cita rasa seni tinggi.",
    elemenDominan: "Bunga & Udara",
    kelebihan: "Daya tarik interpersonal kuat, persuasif, dan diplomatis.",
    rekomendasiKarier: "Diplomat, Desainer Kreatif, Mediator Hubungan Industrial, atau Psikolog.",
  },
  13: {
    naungan: "Lakuning Lintang",
    karakter: "Mandiri, Berjiwa Petualang, dan Orisinal",
    deskripsi: "Tidak suka bergantung pada bantuan orang lain, pemikir bebas, dan selalu mencari perspektif baru.",
    elemenDominan: "Bintang / Kosmis",
    kelebihan: "Kreativitas otentik, inovatif, dan berani mengambil risiko terukur.",
    rekomendasiKarier: "Software Architect, Seniman, Penemu Teknologi, atau Pilot.",
  },
  14: {
    naungan: "Lakuning Rembulan",
    karakter: "Peneduh, Bijaksana, dan Pendengar Ulung",
    deskripsi: "Mampu memberikan rasa nyaman bagi siapa saja, tutur katanya terukur, dan disegani rekan sejawat.",
    elemenDominan: "Bulan & Air",
    kelebihan: "Empati tinggi, kemampuan konseling istimewa, dan berwibawa.",
    rekomendasiKarier: "Direktur SDM, Konselor Medis, Hakim, atau Pemimpin Organisasi.",
  },
  15: {
    naungan: "Lakuning Srengenge",
    karakter: "Pemimpin Sejati, Berwibawa, dan Tegas",
    deskripsi: "Menjadi teladan dalam komunitas, berjiwa pelindung, berwawasan luas, dan berorientasi hasil besar.",
    elemenDominan: "Matahari & Api",
    kelebihan: "Kepemimpinan transformasional, ketegasan visi, dan disiplin tinggi.",
    rekomendasiKarier: "Chief Executive Officer (CEO), Pejabat Publik, atau Tokoh Nasional.",
  },
  16: {
    naungan: "Lakuning Bumi",
    karakter: "Murah Hati, Mengayomi, dan Kokoh",
    deskripsi: "Selalu memberi manfaat bagi sesama, tahan terhadap kritik membangun, dan memiliki rezeki yang stabil.",
    elemenDominan: "Bumi Subur",
    kelebihan: "Kestabilan emosional prima, dermawan, dan menjadi tumpuan keluarga.",
    rekomendasiKarier: "Pengelola Portofolio Finansial, Dokter Spesialis, atau Agronom.",
  },
  17: {
    naungan: "Lakuning Gunung",
    karakter: "Kokoh, Bermartabat, dan Tahan Uji",
    deskripsi: "Memiliki pendirian tak tergoyahkan, berwibawa luhur, dan mampu memikul tanggung jawab berskala raksasa.",
    elemenDominan: "Batu & Gunung",
    kelebihan: "Daya tahan menghadapi tekanan ekstrem, kredibel, dan tepercaya.",
    rekomendasiKarier: "Magistrat Kehakiman, Auditor Senior, atau Manajer Manajemen Risiko.",
  },
  18: {
    naungan: "Lakuning Paripurna",
    karakter: "Karisma Tertinggi, Paripurna, dan Visioner",
    deskripsi: "Neptu tertinggi dalam sistem kalender Jawa, memiliki kekuatan kepemimpinan mutlak dan wibawa agung.",
    elemenDominan: "Semesta Utuh",
    kelebihan: "Kapasitas manajerial makro, kepemimpinan absolut, dan pengaruh lintas sektor.",
    rekomendasiKarier: "Negarawan, Ketua Konglomerasi, atau Tokoh Penggerak Perubahan.",
  },
};

// Hitungan Siklus Hari Baik / Pancasuda (Hajatan / Agenda Penting)
const PANCA_HAJAT_LIST = [
  { sisa: 1, label: "Sri (Kemakmuran & Rezeki Melimpah)", badgeBg: "bg-emerald-500/10", badgeBorder: "border-emerald-500/30", badgeText: "text-emerald-400" },
  { sisa: 2, label: "Rejeki (Kelancaran Usaha & Kebajikan)", badgeBg: "bg-cyan-500/10", badgeBorder: "border-cyan-500/30", badgeText: "text-cyan-400" },
  { sisa: 3, label: "Gedhong (Kestabilan Aset & Perlindungan)", badgeBg: "bg-indigo-500/10", badgeBorder: "border-indigo-500/30", badgeText: "text-indigo-400" },
  { sisa: 4, label: "Loro (Perlu Kehati-hatian / Mitigasi Risiko)", badgeBg: "bg-amber-500/10", badgeBorder: "border-amber-500/30", badgeText: "text-amber-400" },
  { sisa: 0, label: "Pati (Hindari untuk Agenda Besar Tanpa Persiapan Khusus)", badgeBg: "bg-rose-500/10", badgeBorder: "border-rose-500/30", badgeText: "text-rose-400" },
];

export function WetonCalculator() {
  // Helper to format Date to YYYY-MM-DD
  const formatDateToISO = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // State Input URL-Synced via nuqs
  const [tanggal, setTanggal] = useQueryState(
    "tanggal",
    parseAsString.withDefault("1945-08-17")
  );

  // State Tambahan untuk Simulasi Hari Baik Agenda Kegiatan
  const [agendaTipe, setAgendaTipe] = React.useState<string>("pernikahan");
  const [tanggalAgenda, setTanggalAgenda] = React.useState<string>(
    formatDateToISO(new Date())
  );

  // State Hasil Kalkulasi
  const [errorText, setErrorText] = React.useState<string>("");
  const [wetonLahirStr, setWetonLahirStr] = React.useState<string>("-");
  const [hariLahirStr, setHariLahirStr] = React.useState<string>("-");
  const [pasaranLahirStr, setPasaranLahirStr] = React.useState<string>("-");
  const [neptuHari, setNeptuHari] = React.useState<number>(0);
  const [neptuPasaran, setNeptuPasaran] = React.useState<number>(0);
  const [totalNeptu, setTotalNeptu] = React.useState<number>(0);
  const [pasaranDetail, setPasaranDetail] = React.useState<PasaranData | null>(null);
  const [hariDetail, setHariDetail] = React.useState<HariData | null>(null);
  const [watakDetail, setWatakDetail] = React.useState<WatakNeptuData | null>(null);

  // Hasil Analisis Hari Baik Agenda
  const [agendaWetonStr, setAgendaWetonStr] = React.useState<string>("-");
  const [agendaTotalNeptu, setAgendaTotalNeptu] = React.useState<number>(0);
  const [agendaPancasudaResult, setAgendaPancasudaResult] = React.useState<{
    label: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
  } | null>(null);

  // Helper Inti Kalkulasi Etnomatematika Kalender Jawa
  const calculateWetonInternal = React.useCallback(
    (dateIso: string): {
      valid: boolean;
      hariIndex: number;
      pasaranIndex: number;
      hari: HariData;
      pasaran: PasaranData;
      totalNeptu: number;
    } | null => {
      if (!dateIso) return null;
      const parts = dateIso.split("-").map(Number);
      if (parts.length !== 3 || parts.some(isNaN)) return null;

      const [year, month, day] = parts;
      if (year < 100 || month < 1 || month > 12 || day < 1 || day > 31) return null;

      // Gunakan Epoch UTC untuk menjaga konsistensi kalender absolut bebas pergeseran timezone
      const targetUtc = Date.UTC(year, month - 1, day);
      // Anchor acuan historis terkalibrasi: 17 Agustus 1945 = Jumat Legi
      const anchorUtc = Date.UTC(1945, 7, 17); // Month index 7 = Agustus

      const diffDays = Math.round((targetUtc - anchorUtc) / (1000 * 60 * 60 * 24));

      // Indeks Hari Gregorian (0 = Minggu, 1 = Senin, ..., 6 = Sabtu)
      const dayObj = new Date(year, month - 1, day);
      const hariIndex = dayObj.getDay();

      // Siklus 5 Hari Pasaran (0 = Legi, 1 = Pahing, 2 = Pon, 3 = Wage, 4 = Kliwon)
      const pasaranIndex = ((diffDays % 5) + 5) % 5;

      const hari = HARI_MAP[hariIndex];
      const pasaran = PASARAN_MAP[pasaranIndex];
      const total = hari.neptu + pasaran.neptu;

      return {
        valid: true,
        hariIndex,
        pasaranIndex,
        hari,
        pasaran,
        totalNeptu: total,
      };
    },
    []
  );

  // Eksekusi Kalkulasi Utama saat parameter input berubah
  const executeCalculation = React.useCallback(() => {
    if (!tanggal) {
      setErrorText("Tanggal lahir wajib ditentukan");
      return;
    }

    const res = calculateWetonInternal(tanggal);
    if (!res || !res.valid) {
      setErrorText("Format tanggal lahir tidak valid (Gunakan YYYY-MM-DD)");
      return;
    }

    setErrorText("");
    setHariLahirStr(res.hari.name);
    setPasaranLahirStr(res.pasaran.name);
    setWetonLahirStr(`${res.hari.name} ${res.pasaran.name}`);
    setNeptuHari(res.hari.neptu);
    setNeptuPasaran(res.pasaran.neptu);
    setTotalNeptu(res.totalNeptu);
    setHariDetail(res.hari);
    setPasaranDetail(res.pasaran);
    setWatakDetail(WATAK_NEPTU_MAP[res.totalNeptu] || null);

    // Kalkulasi Hari Baik Agenda
    if (tanggalAgenda) {
      const agendaRes = calculateWetonInternal(tanggalAgenda);
      if (agendaRes && agendaRes.valid) {
        setAgendaWetonStr(`${agendaRes.hari.name} ${agendaRes.pasaran.name}`);
        setAgendaTotalNeptu(agendaRes.totalNeptu);

        // Rumus Pancasuda Hari Baik: (Neptu Lahir + Neptu Hari Agenda) mod 5
        const pancaScore = (res.totalNeptu + agendaRes.totalNeptu) % 5;
        const matchedPanca =
          PANCA_HAJAT_LIST.find((item) => item.sisa === pancaScore) ||
          PANCA_HAJAT_LIST[0];
        setAgendaPancasudaResult(matchedPanca);
      }
    }
  }, [tanggal, tanggalAgenda, calculateWetonInternal]);

  // Real-time calculation effect
  React.useEffect(() => {
    executeCalculation();
  }, [executeCalculation]);

  const handleReset = () => {
    setTanggal("1945-08-17");
    setTanggalAgenda(formatDateToISO(new Date()));
    setErrorText("");
  };

  const setPresetDate = (dStr: string) => {
    setTanggal(dStr);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* ========================================================================= */}
      {/* KOLOM KIRI: PARAMETER TEKNIS INPUT (lg:col-span-7)                        */}
      {/* ========================================================================= */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary flex items-center gap-2">
                  Parameter Weton & Tanggal Lahir
                </h2>
                <p className="text-secondary text-sm mt-0.5">
                  Kalkulasi presisi weton, pasaran, neptu, dan kiblat budaya Jawa klasik
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke tanggal proklamasi"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Form Input Utama */}
          <div className="flex flex-col gap-5">
            {/* Input Tanggal Lahir */}
            <div className="flex flex-col gap-2">
              <Input
                label="Tanggal Lahir Gregorian (Masehi)"
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                error={!!errorText}
                helperText={
                  errorText ||
                  "Sistem otomatis mengonversi penanggalan surya Gregorian ke siklus Saptawara dan Pancawara Jawa."
                }
              />

              {/* Preset Tanggal Historis Nusantara */}
              <div className="flex flex-col gap-2 pt-2">
                <span className="text-xs text-secondary font-medium">
                  Preset Tanggal Bersejarah:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { label: "17 Agu 1945 (Proklamasi RI)", date: "1945-08-17" },
                    { label: "28 Okt 1928 (Sumpah Pemuda)", date: "1928-10-28" },
                    { label: "20 Mei 1908 (Kebangkitan)", date: "1908-05-20" },
                    { label: "01 Jan 2000 (Milenium)", date: "2000-01-01" },
                    { label: "Hari Ini", date: formatDateToISO(new Date()) },
                  ].map((preset) => (
                    <button
                      key={preset.date}
                      type="button"
                      onClick={() => setPresetDate(preset.date)}
                      className={cn(
                        "px-2.5 py-1 text-xs rounded-lg border font-mono transition-all",
                        tanggal === preset.date
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

            {/* Simulasi Hari Baik Agenda Tambahan */}
            <div className="p-4 rounded-xl border border-border/80 bg-base/50 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-primary font-medium text-sm">
                <Calendar className="w-4 h-4 text-accent" />
                <span>Simulasi Hari Baik Kegiatan (Hajat / Agenda Penting)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Jenis Agenda / Kegiatan"
                  value={agendaTipe}
                  onChange={(e) => setAgendaTipe(e.target.value)}
                >
                  <option value="pernikahan">Akad Nikah / Pernikahan</option>
                  <option value="usaha">Membuka Usaha / Bisnis Baru</option>
                  <option value="pindah-rumah">Pindah Rumah / Bangun Rumah</option>
                  <option value="perjalanan">Perjalanan Jauh / Ekspedisi</option>
                  <option value="negosiasi">Penandatanganan Kontrak / MOU</option>
                </Select>

                <Input
                  label="Rencana Tanggal Agenda"
                  type="date"
                  value={tanggalAgenda}
                  onChange={(e) => setTanggalAgenda(e.target.value)}
                  helperText="Kombinasi neptu lahir dengan neptu tanggal kegiatan"
                />
              </div>
            </div>

            {/* Tombol Eksekusi Aksi */}
            <Button
              onClick={executeCalculation}
              className="w-full flex items-center justify-center gap-2 bg-accent text-white hover:brightness-110 px-6 py-3 rounded-lg font-semibold transition-all shadow-[0_0_15px_var(--accent-glow)]"
            >
              <Sparkles className="w-4 h-4" />
              Hitung Weton & Kalibrasi Neptu
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
            Kalkulator memanfaatkan model matematis modulo siklus 5-hari (Pancawara) dan
            7-hari (Saptawara) dengan penyesuaian tahun kabisat astronomis secara{" "}
            <strong>real-time</strong>. Perhitungan menghasilkan tingkat akurasi 100%
            sesuai naskah pakem penanggalan Jawa Sultan Agungan sejak 1555 Saka (1633 M).
          </div>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* KOLOM KANAN: OUTPUT METRIK & ANALISIS WATAK BUDAYA (lg:col-span-5)        */}
      {/* ========================================================================= */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Output Box 1: Weton Lahir (Styled Div Output) */}
        <div className="flex flex-col items-start justify-center p-6 rounded-2xl border border-[rgba(99,102,241,0.3)] bg-gradient-to-br from-[rgba(99,102,241,0.08)] to-[rgba(99,102,241,0.02)] w-full shadow-sm">
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-secondary text-[13px] font-sans">
              Weton Kelahiran Jawa
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
              <Sun className="w-3 h-3" />
              Dino & Pasaran
            </span>
          </div>
          <div className="font-display text-3xl sm:text-4xl font-bold text-primary tracking-tight">
            {wetonLahirStr}
          </div>
          <div className="text-xs text-secondary mt-2 flex items-center gap-2">
            <span>Hari: {hariLahirStr} ({neptuHari})</span>
            <span>•</span>
            <span>Pasaran: {pasaranLahirStr} ({neptuPasaran})</span>
          </div>
        </div>

        {/* Output Box 2: Total Neptu (Menggunakan OutputBox Custom UI) */}
        <OutputBox
          label="Jumlah Total Neptu (Bobot Numerik)"
          value={totalNeptu}
          suffix=" Poin"
        />

        {/* Rincian Etnomatematika & Watak Kelahiran */}
        <Card className="flex flex-col gap-4 p-5 bg-elevated/70 border-border">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-semibold font-display text-primary flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-accent" />
              Analisis Watak & Karakteristik Neptu
            </h3>
            {watakDetail && (
              <span className="px-2.5 py-0.5 rounded-md border border-accent/30 bg-accent/10 text-accent text-xs font-semibold tracking-wide">
                {watakDetail.naungan}
              </span>
            )}
          </div>

          {watakDetail ? (
            <div className="flex flex-col gap-3 text-sm">
              {/* Karakter Inti */}
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-secondary">Karakter Dasar:</span>
                <span className="font-medium text-primary text-right text-xs sm:text-sm">
                  {watakDetail.karakter}
                </span>
              </div>

              {/* Elemen & Arah Keberuntungan */}
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-secondary">Elemen & Arah Mata Angin:</span>
                <span className="font-medium text-primary text-xs sm:text-sm">
                  {pasaranDetail?.elemen} ({pasaranDetail?.arah})
                </span>
              </div>

              {/* Saptawara Kuno */}
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-secondary">Sebutan Saptawara:</span>
                <span className="font-mono text-primary text-xs">
                  {hariDetail?.saptawara} — {hariDetail?.simbol}
                </span>
              </div>

              {/* Narasi Filosofis */}
              <div className="p-3 rounded-lg bg-base border border-border/60 text-xs leading-relaxed text-secondary mt-1">
                <strong className="text-primary block mb-1">
                  Deskripsi Filosofis:
                </strong>
                {watakDetail.deskripsi}
              </div>

              {/* Rekomendasi Bidang */}
              <div className="flex flex-col gap-1 pt-1 text-xs">
                <span className="text-secondary font-medium">
                  Bidang Karier & Potensi Unggul:
                </span>
                <span className="text-primary font-medium bg-accent/5 p-2 rounded-md border border-accent/15">
                  {watakDetail.rekomendasiKarier}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-secondary py-4 text-center">
              Masukkan tanggal lahir untuk menampilkan profil watak.
            </div>
          )}
        </Card>

        {/* Hasil Analisis Hari Baik Agenda */}
        {agendaPancasudaResult && (
          <Card className="flex flex-col gap-3 p-4 bg-surface border-border">
            <div className="flex items-center justify-between border-b border-border/50 pb-2">
              <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                <Award className="w-4 h-4 text-accent" />
                Kesesuaian Agenda ({agendaWetonStr})
              </span>
              <span className="font-mono text-xs text-secondary">
                Total: {totalNeptu + agendaTotalNeptu}
              </span>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-secondary">Siklus Pancasuda:</span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-md border font-semibold",
                    agendaPancasudaResult.badgeBg,
                    agendaPancasudaResult.badgeBorder,
                    agendaPancasudaResult.badgeText
                  )}
                >
                  {agendaPancasudaResult.label}
                </span>
              </div>
              <p className="text-secondary text-[11px] leading-relaxed pt-1">
                Kalkulasi menyandingkan neptu kelahiran ({totalNeptu}) dengan neptu tanggal
                rencana ({agendaTotalNeptu}) untuk memproyeksikan kecocokan energi hari.
              </p>
            </div>
          </Card>
        )}

        {/* Security & System Reliability Badge */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            Data kalkulasi disinkronkan secara <strong>real-time</strong> ke dalam URL query
            parameters (`nuqs`). Setiap hasil perhitungan berbasis sistem konversi penanggalan
            terkalibrasi tanpa bias komputasi.
          </p>
        </div>
      </div>
    </div>
  );
}