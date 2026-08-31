"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Scale,
  RefreshCw,
  Calculator,
  Users,
  AlertCircle,
  CheckCircle2,
  FileText,
  ShieldAlert,
  Info,
  BookOpen,
} from "lucide-react";
import {
  useQueryState,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsBoolean,
} from "nuqs";

export interface HeirDistribution {
  id: string;
  name: string;
  count: number;
  shareDescription: string;
  fractionText: string;
  percentage: number;
  totalNominal: number;
  nominalPerPerson: number;
  statusType: "Ashabul Furudh" | "Asabah" | "Ashabul Furudh + Asabah" | "Radd" | "'Aul";
  fiqhNote: string;
}

export function WarisIslamCalculator() {
  // Query States (nuqs URL Parameters)
  const [harta, setHarta] = useQueryState(
    "harta",
    parseAsFloat.withDefault(500000000)
  );
  const [hutang, setHutang] = useQueryState(
    "hutang",
    parseAsFloat.withDefault(0)
  );
  const [wasiat, setWasiat] = useQueryState(
    "wasiat",
    parseAsFloat.withDefault(0)
  );
  const [tajhiz, setTajhiz] = useQueryState(
    "tajhiz",
    parseAsFloat.withDefault(5000000)
  );

  // Status Ahli Waris
  const [pasangan, setPasangan] = useQueryState(
    "pasangan",
    parseAsString.withDefault("istri")
  ); // "none" | "suami" | "istri"
  const [ayah, setAyah] = useQueryState(
    "ayah",
    parseAsBoolean.withDefault(true)
  );
  const [ibu, setIbu] = useQueryState(
    "ibu",
    parseAsBoolean.withDefault(true)
  );
  const [anakLk, setAnakLk] = useQueryState(
    "anak_lk",
    parseAsInteger.withDefault(1)
  );
  const [anakPr, setAnakPr] = useQueryState(
    "anak_pr",
    parseAsInteger.withDefault(1)
  );

  // Calculation Results
  const [hartaKotor, setHartaKotor] = React.useState<number>(0);
  const [totalPengurang, setTotalPengurang] = React.useState<number>(0);
  const [wasiatDiterima, setWasiatDiterima] = React.useState<number>(0);
  const [isWasiatCapped, setIsWasiatCapped] = React.useState<boolean>(false);
  const [maxWasiatAllowed, setMaxWasiatAllowed] = React.useState<number>(0);
  const [hartaBersih, setHartaBersih] = React.useState<number>(0);
  const [heirList, setHeirList] = React.useState<HeirDistribution[]>([]);
  const [faraidhStatus, setFaraidhStatus] = React.useState<{
    category: string;
    description: string;
  }>({
    category: "Normal (Adil)",
    description: "Seluruh porsi terbagi habis sesuai porsi furudh dan asabah standar syariah.",
  });

  const calculateFaraidh = React.useCallback(() => {
    const rawHarta = Math.max(0, harta || 0);
    const rawHutang = Math.max(0, hutang || 0);
    const rawTajhiz = Math.max(0, tajhiz || 0);
    const rawWasiat = Math.max(0, wasiat || 0);

    // 1. Hak Sebelum Waris: Tajhiz & Hutang didahulukan
    const sisaSebelumWasiat = Math.max(0, rawHarta - rawTajhiz - rawHutang);

    // Wasiat maksimal 1/3 dari harta sisa setelah hutang dan tajhiz
    const batasMaxWasiat = sisaSebelumWasiat / 3;
    const wasiatValid = Math.min(rawWasiat, batasMaxWasiat);
    const wasiatOver = rawWasiat > batasMaxWasiat && rawWasiat > 0;

    const netTirkah = Math.max(0, sisaSebelumWasiat - wasiatValid);
    const pengurang = rawTajhiz + rawHutang + wasiatValid;

    setHartaKotor(rawHarta);
    setTotalPengurang(pengurang);
    setWasiatDiterima(wasiatValid);
    setIsWasiatCapped(wasiatOver);
    setMaxWasiatAllowed(batasMaxWasiat);
    setHartaBersih(netTirkah);

    // 2. Analisis Ahli Waris
    const pasanganStatus = pasangan || "none";
    const ayahAda = ayah === true;
    const ibuAda = ibu === true;
    const countAnakLk = Math.max(0, anakLk ?? 0);
    const countAnakPr = Math.max(0, anakPr ?? 0);
    const totalAnak = countAnakLk + countAnakPr;
    const hasChildren = totalAnak > 0;
    const hasMaleChild = countAnakLk > 0;
    const hasFemaleChildOnly = countAnakLk === 0 && countAnakPr > 0;

    const totalHeirsCount =
      (pasanganStatus !== "none" ? 1 : 0) +
      (ayahAda ? 1 : 0) +
      (ibuAda ? 1 : 0) +
      countAnakLk +
      countAnakPr;

    if (totalHeirsCount === 0 || netTirkah === 0) {
      setHeirList([]);
      setFaraidhStatus({
        category: totalHeirsCount === 0 ? "Belum Ada Ahli Waris" : "Harta Bersih Nol",
        description:
          totalHeirsCount === 0
            ? "Tentukan minimal satu ahli waris yang masih hidup untuk melakukan kalkulasi."
            : "Total hutang, wasiat, dan biaya tajhiz menghabiskan seluruh harta peninggalan.",
      });
      return;
    }

    const distributions: HeirDistribution[] = [];

    // Kasus Spesial 1: Gharrawain / Umariyyatan (Hanya Pasangan + Ayah + Ibu, Tanpa Anak)
    if (!hasChildren && ayahAda && ibuAda && pasanganStatus !== "none") {
      if (pasanganStatus === "suami") {
        // Suami 1/2, Ibu 1/3 dari sisa (= 1/6), Ayah sisa (= 1/3)
        const suamiNominal = netTirkah * 0.5;
        const ibuNominal = netTirkah * (1 / 6);
        const ayahNominal = netTirkah * (1 / 3);

        distributions.push({
          id: "suami",
          name: "Suami",
          count: 1,
          shareDescription: "1/2 (Ashabul Furudh)",
          fractionText: "1/2",
          percentage: 50,
          totalNominal: Math.round(suamiNominal),
          nominalPerPerson: Math.round(suamiNominal),
          statusType: "Ashabul Furudh",
          fiqhNote: "Mendapat 1/2 karena pewaris tidak meninggalkan anak (QS. An-Nisa: 12).",
        });

        distributions.push({
          id: "ibu",
          name: "Ibu Kandung",
          count: 1,
          shareDescription: "1/3 dari Sisa / Tsulutsul Baqi (1/6 Total)",
          fractionText: "1/6",
          percentage: 16.67,
          totalNominal: Math.round(ibuNominal),
          nominalPerPerson: Math.round(ibuNominal),
          statusType: "Ashabul Furudh",
          fiqhNote: "Kasus Gharrawain: Ibu mendapat 1/3 dari sisa harta setelah hak suami terpenuhi.",
        });

        distributions.push({
          id: "ayah",
          name: "Ayah Kandung",
          count: 1,
          shareDescription: "Asabah (2/3 dari Sisa / 1/3 Total)",
          fractionText: "1/3",
          percentage: 33.33,
          totalNominal: Math.round(ayahNominal),
          nominalPerPerson: Math.round(ayahNominal),
          statusType: "Asabah",
          fiqhNote: "Kasus Gharrawain: Ayah mengambil seluruh sisa tirkah (mendapat 2x lipat bagian ibu).",
        });
      } else if (pasanganStatus === "istri") {
        // Istri 1/4, Ibu 1/3 dari sisa (= 1/4), Ayah sisa (= 1/2)
        const istriNominal = netTirkah * 0.25;
        const ibuNominal = netTirkah * 0.25;
        const ayahNominal = netTirkah * 0.5;

        distributions.push({
          id: "istri",
          name: "Istri",
          count: 1,
          shareDescription: "1/4 (Ashabul Furudh)",
          fractionText: "1/4",
          percentage: 25,
          totalNominal: Math.round(istriNominal),
          nominalPerPerson: Math.round(istriNominal),
          statusType: "Ashabul Furudh",
          fiqhNote: "Mendapat 1/4 karena pewaris tidak meninggalkan anak (QS. An-Nisa: 12).",
        });

        distributions.push({
          id: "ibu",
          name: "Ibu Kandung",
          count: 1,
          shareDescription: "1/3 dari Sisa / Tsulutsul Baqi (1/4 Total)",
          fractionText: "1/4",
          percentage: 25,
          totalNominal: Math.round(ibuNominal),
          nominalPerPerson: Math.round(ibuNominal),
          statusType: "Ashabul Furudh",
          fiqhNote: "Kasus Gharrawain: Ibu mendapat 1/3 dari sisa harta setelah hak istri terpenuhi.",
        });

        distributions.push({
          id: "ayah",
          name: "Ayah Kandung",
          count: 1,
          shareDescription: "Asabah (2/3 dari Sisa / 1/2 Total)",
          fractionText: "1/2",
          percentage: 50,
          totalNominal: Math.round(ayahNominal),
          nominalPerPerson: Math.round(ayahNominal),
          statusType: "Asabah",
          fiqhNote: "Kasus Gharrawain: Ayah mengambil seluruh sisa tirkah (mendapat 2x lipat bagian ibu).",
        });
      }

      setHeirList(distributions);
      setFaraidhStatus({
        category: "Kasus Khusus Gharrawain (Umariyyatan)",
        description:
          "Pewaris hanya meninggalkan pasangan dan kedua orang tua. Ibu memperoleh 1/3 dari sisa tirkah (Tsulutsul Baqi) agar bagian Ayah tetap 2x lipat bagian Ibu sesuai kaidah Syariat.",
      });
      return;
    }

    // 3. Algoritma Standar Faraidh
    // A. Tentukan Furudh Dasar (Porsi Pasti)
    let porsiPasangan = 0;
    let labelPasangan = "";
    let notePasangan = "";
    if (pasanganStatus === "suami") {
      porsiPasangan = hasChildren ? 0.25 : 0.5;
      labelPasangan = hasChildren ? "1/4" : "1/2";
      notePasangan = hasChildren
        ? "Mendapat 1/4 karena pewaris meninggalkan keturunan/anak (QS. An-Nisa: 12)."
        : "Mendapat 1/2 karena pewaris tidak meninggalkan keturunan/anak (QS. An-Nisa: 12).";
    } else if (pasanganStatus === "istri") {
      porsiPasangan = hasChildren ? 0.125 : 0.25;
      labelPasangan = hasChildren ? "1/8" : "1/4";
      notePasangan = hasChildren
        ? "Mendapat 1/8 karena pewaris meninggalkan keturunan/anak (QS. An-Nisa: 12)."
        : "Mendapat 1/4 karena pewaris tidak meninggalkan keturunan/anak (QS. An-Nisa: 12).";
    }

    let porsiIbu = 0;
    let labelIbu = "";
    let noteIbu = "";
    if (ibuAda) {
      porsiIbu = hasChildren ? 1 / 6 : 1 / 3;
      labelIbu = hasChildren ? "1/6" : "1/3";
      noteIbu = hasChildren
        ? "Mendapat 1/6 karena pewaris meninggalkan keturunan/anak (QS. An-Nisa: 11)."
        : "Mendapat 1/3 karena pewaris tidak meninggalkan keturunan/anak (QS. An-Nisa: 11).";
    }

    let porsiAyahDasar = 0;
    let labelAyah = "";
    let noteAyah = "";
    if (ayahAda) {
      if (hasMaleChild) {
        porsiAyahDasar = 1 / 6;
        labelAyah = "1/6";
        noteAyah = "Mendapat 1/6 sebagai Ashabul Furudh karena ada anak laki-laki (QS. An-Nisa: 11).";
      } else if (hasFemaleChildOnly) {
        porsiAyahDasar = 1 / 6;
        labelAyah = "1/6 + Asabah";
        noteAyah = "Mendapat 1/6 (Ashabul Furudh) ditambah sisa asabah jika ada (QS. An-Nisa: 11).";
      } else {
        porsiAyahDasar = 0; // Mengambil asabah penuh
        labelAyah = "Asabah (Sisa)";
        noteAyah = "Mengambil seluruh sisa harta sebagai Asabah binafsihi karena tidak ada keturunan.";
      }
    }

    let porsiAnakPrDasar = 0;
    let labelAnakPr = "";
    let noteAnakPr = "";
    if (hasFemaleChildOnly) {
      if (countAnakPr === 1) {
        porsiAnakPrDasar = 1 / 2;
        labelAnakPr = "1/2";
        noteAnakPr = "Mendapat 1/2 sebagai anak perempuan tunggal tanpa saudara laki-laki (QS. An-Nisa: 11).";
      } else {
        porsiAnakPrDasar = 2 / 3;
        labelAnakPr = "2/3 (Dibagi Rata)";
        noteAnakPr = `Mendapat 2/3 dibagi rata untuk ${countAnakPr} anak perempuan (QS. An-Nisa: 11).`;
      }
    }

    const totalFurudh = porsiPasangan + porsiIbu + porsiAyahDasar + porsiAnakPrDasar;

    // B. Pengecekan 'AUL (Total Furudh > 1)
    if (totalFurudh > 1.00001) {
      const aulFactor = totalFurudh;

      if (pasanganStatus !== "none") {
        const nominal = (porsiPasangan / aulFactor) * netTirkah;
        distributions.push({
          id: pasanganStatus,
          name: pasanganStatus === "suami" ? "Suami" : "Istri",
          count: 1,
          shareDescription: `${labelPasangan} (Terkoreksi 'Aul)`,
          fractionText: labelPasangan,
          percentage: Number(((porsiPasangan / aulFactor) * 100).toFixed(2)),
          totalNominal: Math.round(nominal),
          nominalPerPerson: Math.round(nominal),
          statusType: "'Aul",
          fiqhNote: `${notePasangan} Porsi berkurang proporsional karena total bagian melebihi angka 1 ('Aul).`,
        });
      }

      if (ibuAda) {
        const nominal = (porsiIbu / aulFactor) * netTirkah;
        distributions.push({
          id: "ibu",
          name: "Ibu Kandung",
          count: 1,
          shareDescription: `${labelIbu} (Terkoreksi 'Aul)`,
          fractionText: labelIbu,
          percentage: Number(((porsiIbu / aulFactor) * 100).toFixed(2)),
          totalNominal: Math.round(nominal),
          nominalPerPerson: Math.round(nominal),
          statusType: "'Aul",
          fiqhNote: `${noteIbu} Porsi berkurang proporsional karena terjadi 'Aul.`,
        });
      }

      if (ayahAda && porsiAyahDasar > 0) {
        const nominal = (porsiAyahDasar / aulFactor) * netTirkah;
        distributions.push({
          id: "ayah",
          name: "Ayah Kandung",
          count: 1,
          shareDescription: `${labelAyah} (Terkoreksi 'Aul)`,
          fractionText: labelAyah,
          percentage: Number(((porsiAyahDasar / aulFactor) * 100).toFixed(2)),
          totalNominal: Math.round(nominal),
          nominalPerPerson: Math.round(nominal),
          statusType: "'Aul",
          fiqhNote: `${noteAyah} Porsi berkurang proporsional karena terjadi 'Aul.`,
        });
      }

      if (hasFemaleChildOnly) {
        const nominal = (porsiAnakPrDasar / aulFactor) * netTirkah;
        distributions.push({
          id: "anak_pr",
          name: `Anak Perempuan (${countAnakPr} Orang)`,
          count: countAnakPr,
          shareDescription: `${labelAnakPr} (Terkoreksi 'Aul)`,
          fractionText: labelAnakPr,
          percentage: Number(((porsiAnakPrDasar / aulFactor) * 100).toFixed(2)),
          totalNominal: Math.round(nominal),
          nominalPerPerson: Math.round(nominal / countAnakPr),
          statusType: "'Aul",
          fiqhNote: `${noteAnakPr} Porsi berkurang proporsional akibat 'Aul.`,
        });
      }

      setHeirList(distributions);
      setFaraidhStatus({
        category: "Kondisi 'Aul (Total Saham Melebihi 1)",
        description:
          "Total bagian Ashabul Furudh melebihi total harta (100%). Porsi masing-masing ahli waris dikurangi secara adil dan proporsional untuk menutup defisit sesuai kaidah Fikih Faraidh.",
      });
      return;
    }

    // C. Pengecekan Kondisi Normal & Asabah
    const sisa = Math.max(0, 1 - totalFurudh);

    if (hasMaleChild) {
      // Ada Anak Laki-Laki -> Anak adalah Asabah (bil Ghair jika ada anak perempuan)
      const totalSahamAnak = countAnakLk * 2 + countAnakPr * 1;
      const nominalSisa = sisa * netTirkah;

      if (pasanganStatus !== "none") {
        const nominal = porsiPasangan * netTirkah;
        distributions.push({
          id: pasanganStatus,
          name: pasanganStatus === "suami" ? "Suami" : "Istri",
          count: 1,
          shareDescription: `${labelPasangan} (Ashabul Furudh)`,
          fractionText: labelPasangan,
          percentage: Number((porsiPasangan * 100).toFixed(2)),
          totalNominal: Math.round(nominal),
          nominalPerPerson: Math.round(nominal),
          statusType: "Ashabul Furudh",
          fiqhNote: notePasangan,
        });
      }

      if (ibuAda) {
        const nominal = porsiIbu * netTirkah;
        distributions.push({
          id: "ibu",
          name: "Ibu Kandung",
          count: 1,
          shareDescription: `${labelIbu} (Ashabul Furudh)`,
          fractionText: labelIbu,
          percentage: Number((porsiIbu * 100).toFixed(2)),
          totalNominal: Math.round(nominal),
          nominalPerPerson: Math.round(nominal),
          statusType: "Ashabul Furudh",
          fiqhNote: noteIbu,
        });
      }

      if (ayahAda) {
        const nominal = porsiAyahDasar * netTirkah;
        distributions.push({
          id: "ayah",
          name: "Ayah Kandung",
          count: 1,
          shareDescription: `${labelAyah} (Ashabul Furudh)`,
          fractionText: labelAyah,
          percentage: Number((porsiAyahDasar * 100).toFixed(2)),
          totalNominal: Math.round(nominal),
          nominalPerPerson: Math.round(nominal),
          statusType: "Ashabul Furudh",
          fiqhNote: noteAyah,
        });
      }

      // Bagian Anak Laki-Laki
      const porsiLkTotal = (countAnakLk * 2) / totalSahamAnak;
      const nominalLkTotal = porsiLkTotal * nominalSisa;
      const persentaseLk = (porsiLkTotal * sisa * 100);

      distributions.push({
        id: "anak_lk",
        name: `Anak Laki-Laki (${countAnakLk} Orang)`,
        count: countAnakLk,
        shareDescription: countAnakPr > 0 ? "Asabah bil Ghair (2 : 1)" : "Asabah binafsihi (Sisa Penuh)",
        fractionText: "2 Saham",
        percentage: Number(persentaseLk.toFixed(2)),
        totalNominal: Math.round(nominalLkTotal),
        nominalPerPerson: Math.round(nominalLkTotal / countAnakLk),
        statusType: "Asabah",
        fiqhNote:
          countAnakPr > 0
            ? "Mendapat 2 bagian untuk setiap 1 bagian anak perempuan dari sisa tirkah (QS. An-Nisa: 11)."
            : "Mengambil seluruh sisa harta waris dan dibagi rata sesama anak laki-laki.",
      });

      // Bagian Anak Perempuan (jika ada)
      if (countAnakPr > 0) {
        const porsiPrTotal = (countAnakPr * 1) / totalSahamAnak;
        const nominalPrTotal = porsiPrTotal * nominalSisa;
        const persentasePr = (porsiPrTotal * sisa * 100);

        distributions.push({
          id: "anak_pr",
          name: `Anak Perempuan (${countAnakPr} Orang)`,
          count: countAnakPr,
          shareDescription: "Asabah bil Ghair (2 : 1)",
          fractionText: "1 Saham",
          percentage: Number(persentasePr.toFixed(2)),
          totalNominal: Math.round(nominalPrTotal),
          nominalPerPerson: Math.round(nominalPrTotal / countAnakPr),
          statusType: "Asabah",
          fiqhNote: "Menjadi asabah bersama saudara laki-lakinya dengan perbandingan 1 : 2 (QS. An-Nisa: 11).",
        });
      }

      setHeirList(distributions);
      setFaraidhStatus({
        category: "Normal (Ashabul Furudh & Asabah)",
        description:
          "Porsi furudh terdistribusi secara presisi kepada pasangan dan orang tua, sedangkan sisa tirkah disalurkan kepada anak sebagai Asabah bil Ghair dengan rasio 2:1.",
      });
      return;
    }

    if (!hasMaleChild && ayahAda) {
      // Tidak ada anak laki-laki, tapi ada Ayah -> Ayah mengambil sisa harta (Asabah)
      if (pasanganStatus !== "none") {
        const nominal = porsiPasangan * netTirkah;
        distributions.push({
          id: pasanganStatus,
          name: pasanganStatus === "suami" ? "Suami" : "Istri",
          count: 1,
          shareDescription: `${labelPasangan} (Ashabul Furudh)`,
          fractionText: labelPasangan,
          percentage: Number((porsiPasangan * 100).toFixed(2)),
          totalNominal: Math.round(nominal),
          nominalPerPerson: Math.round(nominal),
          statusType: "Ashabul Furudh",
          fiqhNote: notePasangan,
        });
      }

      if (ibuAda) {
        const nominal = porsiIbu * netTirkah;
        distributions.push({
          id: "ibu",
          name: "Ibu Kandung",
          count: 1,
          shareDescription: `${labelIbu} (Ashabul Furudh)`,
          fractionText: labelIbu,
          percentage: Number((porsiIbu * 100).toFixed(2)),
          totalNominal: Math.round(nominal),
          nominalPerPerson: Math.round(nominal),
          statusType: "Ashabul Furudh",
          fiqhNote: noteIbu,
        });
      }

      if (hasFemaleChildOnly) {
        const nominal = porsiAnakPrDasar * netTirkah;
        distributions.push({
          id: "anak_pr",
          name: `Anak Perempuan (${countAnakPr} Orang)`,
          count: countAnakPr,
          shareDescription: `${labelAnakPr} (Ashabul Furudh)`,
          fractionText: labelAnakPr,
          percentage: Number((porsiAnakPrDasar * 100).toFixed(2)),
          totalNominal: Math.round(nominal),
          nominalPerPerson: Math.round(nominal / countAnakPr),
          statusType: "Ashabul Furudh",
          fiqhNote: noteAnakPr,
        });
      }

      // Ayah mengambil bagian dasarnya (jika ada) + seluruh sisa
      const totalPorsiAyah = porsiAyahDasar + sisa;
      const nominalAyah = totalPorsiAyah * netTirkah;
      distributions.push({
        id: "ayah",
        name: "Ayah Kandung",
        count: 1,
        shareDescription: hasFemaleChildOnly ? "1/6 + Asabah (Sisa)" : "Asabah Penuh (Sisa)",
        fractionText: hasFemaleChildOnly ? "1/6 + Sisa" : "Sisa",
        percentage: Number((totalPorsiAyah * 100).toFixed(2)),
        totalNominal: Math.round(nominalAyah),
        nominalPerPerson: Math.round(nominalAyah),
        statusType: hasFemaleChildOnly ? "Ashabul Furudh + Asabah" : "Asabah",
        fiqhNote: hasFemaleChildOnly
          ? "Menerima porsi tetap 1/6 ditambah seluruh sisa tirkah sebagai Asabah karena tidak ada anak laki-laki."
          : "Mengambil seluruh sisa harta sebagai Asabah binafsihi.",
      });

      setHeirList(distributions);
      setFaraidhStatus({
        category: "Normal (Asabah oleh Ayah)",
        description:
          "Seluruh sisa tirkah setelah Ashabul Furudh diserap secara sah oleh Ayah Kandung sebagai Asabah.",
      });
      return;
    }

    // D. Kondisi RADD (Tidak ada Asabah: Tidak ada Anak Laki-Laki & Tidak ada Ayah, dan ada sisa)
    if (!hasMaleChild && !ayahAda) {
      if (sisa > 0.0001) {
        // Radd dibagikan proporsional kepada kerabat nasabiah (Ibu dan/atau Anak Perempuan)
        const totalPorsiRadd = (ibuAda ? porsiIbu : 0) + (hasFemaleChildOnly ? porsiAnakPrDasar : 0);

        if (pasanganStatus !== "none") {
          const nominalPasangan = porsiPasangan * netTirkah;
          distributions.push({
            id: pasanganStatus,
            name: pasanganStatus === "suami" ? "Suami" : "Istri",
            count: 1,
            shareDescription: `${labelPasangan} (Ashabul Furudh)`,
            fractionText: labelPasangan,
            percentage: Number((porsiPasangan * 100).toFixed(2)),
            totalNominal: Math.round(nominalPasangan),
            nominalPerPerson: Math.round(nominalPasangan),
            statusType: "Ashabul Furudh",
            fiqhNote: `${notePasangan} (Pasangan tidak menerima tambahan Radd menurut pendapat mayoritas ulama & KHI).`,
          });
        }

        const sisaUntukRadd = (1 - porsiPasangan) * netTirkah;

        if (totalPorsiRadd > 0) {
          if (ibuAda) {
            const porsiProporsiIbu = porsiIbu / totalPorsiRadd;
            const nominalIbu = porsiProporsiIbu * sisaUntukRadd;
            const persenIbu = (nominalIbu / netTirkah) * 100;

            distributions.push({
              id: "ibu",
              name: "Ibu Kandung",
              count: 1,
              shareDescription: `${labelIbu} + Tambahan Radd`,
              fractionText: labelIbu,
              percentage: Number(persenIbu.toFixed(2)),
              totalNominal: Math.round(nominalIbu),
              nominalPerPerson: Math.round(nominalIbu),
              statusType: "Radd",
              fiqhNote: `${noteIbu} Mendapatkan pengembalian sisa harta (Radd) secara proporsional.`,
            });
          }

          if (hasFemaleChildOnly) {
            const porsiProporsiPr = porsiAnakPrDasar / totalPorsiRadd;
            const nominalPr = porsiProporsiPr * sisaUntukRadd;
            const persenPr = (nominalPr / netTirkah) * 100;

            distributions.push({
              id: "anak_pr",
              name: `Anak Perempuan (${countAnakPr} Orang)`,
              count: countAnakPr,
              shareDescription: `${labelAnakPr} + Tambahan Radd`,
              fractionText: labelAnakPr,
              percentage: Number(persenPr.toFixed(2)),
              totalNominal: Math.round(nominalPr),
              nominalPerPerson: Math.round(nominalPr / countAnakPr),
              statusType: "Radd",
              fiqhNote: `${noteAnakPr} Mendapatkan pengembalian sisa harta (Radd) secara proporsional.`,
            });
          }

          setHeirList(distributions);
          setFaraidhStatus({
            category: "Kondisi Radd (Pengembalian Sisa Harta)",
            description:
              "Tidak terdapat ahli waris Asabah sehingga sisa tirkah dikembalikan (Radd) secara proporsional kepada kerabat pertalian darah (Ibu dan Anak Perempuan).",
          });
          return;
        } else {
          // Hanya ada pasangan
          if (pasanganStatus !== "none") {
            setHeirList(distributions);
            setFaraidhStatus({
              category: "Hanya Ada Pasangan (Baitul Mal / Dzawil Arham)",
              description: `Pasangan menerima hak pastinya sebesar ${labelPasangan}. Sisa harta diserahkan kepada kerabat Dzawil Arham atau kas Baitul Mal.`,
            });
            return;
          }
        }
      } else {
        // Tepat 100%
        if (pasanganStatus !== "none") {
          const nominal = porsiPasangan * netTirkah;
          distributions.push({
            id: pasanganStatus,
            name: pasanganStatus === "suami" ? "Suami" : "Istri",
            count: 1,
            shareDescription: `${labelPasangan} (Ashabul Furudh)`,
            fractionText: labelPasangan,
            percentage: Number((porsiPasangan * 100).toFixed(2)),
            totalNominal: Math.round(nominal),
            nominalPerPerson: Math.round(nominal),
            statusType: "Ashabul Furudh",
            fiqhNote: notePasangan,
          });
        }
        if (ibuAda) {
          const nominal = porsiIbu * netTirkah;
          distributions.push({
            id: "ibu",
            name: "Ibu Kandung",
            count: 1,
            shareDescription: `${labelIbu} (Ashabul Furudh)`,
            fractionText: labelIbu,
            percentage: Number((porsiIbu * 100).toFixed(2)),
            totalNominal: Math.round(nominal),
            nominalPerPerson: Math.round(nominal),
            statusType: "Ashabul Furudh",
            fiqhNote: noteIbu,
          });
        }
        if (hasFemaleChildOnly) {
          const nominal = porsiAnakPrDasar * netTirkah;
          distributions.push({
            id: "anak_pr",
            name: `Anak Perempuan (${countAnakPr} Orang)`,
            count: countAnakPr,
            shareDescription: `${labelAnakPr} (Ashabul Furudh)`,
            fractionText: labelAnakPr,
            percentage: Number((porsiAnakPrDasar * 100).toFixed(2)),
            totalNominal: Math.round(nominal),
            nominalPerPerson: Math.round(nominal / countAnakPr),
            statusType: "Ashabul Furudh",
            fiqhNote: noteAnakPr,
          });
        }
        setHeirList(distributions);
        setFaraidhStatus({
          category: "Normal (Tepat 100%)",
          description: "Seluruh porsi Ashabul Furudh tepat menghabiskan seluruh harta waris bersih.",
        });
        return;
      }
    }
  }, [harta, hutang, wasiat, tajhiz, pasangan, ayah, ibu, anakLk, anakPr]);

  // Reactive calculation on parameter changes
  React.useEffect(() => {
    calculateFaraidh();
  }, [calculateFaraidh]);

  const handleReset = () => {
    setHarta(500000000);
    setHutang(0);
    setWasiat(0);
    setTajhiz(5000000);
    setPasangan("istri");
    setAyah(true);
    setIbu(true);
    setAnakLk(1);
    setAnakPr(1);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalDistributedNominal = React.useMemo(() => {
    return heirList.reduce((acc, curr) => acc + curr.totalNominal, 0);
  }, [heirList]);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Parameter Input Section */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Tirkah & Ahli Waris
                </h2>
                <p className="text-secondary text-sm">
                  Hitung pembagian waris Islam presisi standar Al-Qur'an, Sunnah & Kompilasi Hukum Islam (KHI)
                </p>
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

          {/* Bagian 1: Harta & Liabilitas Tirkah */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <BookOpen className="w-4 h-4 text-accent" />
              <span>1. Harta Peninggalan & Liabilitas Jenazah</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Harta Peninggalan Kotor (Tirkah)"
                type="number"
                min={0}
                step={10000000}
                value={harta ?? ""}
                onChange={(e) => setHarta(Number(e.target.value))}
                prefix="Rp"
                helperText={`Nominal: ${formatCurrency(harta || 0)}`}
              />

              <Input
                label="Biaya Pengurusan Jenazah (Tajhiz)"
                type="number"
                min={0}
                step={500000}
                value={tajhiz ?? ""}
                onChange={(e) => setTajhiz(Number(e.target.value))}
                prefix="Rp"
                helperText="Kafan, pemakaman, & ambulans (didahulukan)"
              />

              <Input
                label="Hutang Mayit (Liabilitas)"
                type="number"
                min={0}
                step={1000000}
                value={hutang ?? ""}
                onChange={(e) => setHutang(Number(e.target.value))}
                prefix="Rp"
                helperText="Hutang ke manusia & zakat/nazar terutang"
              />

              <Input
                label="Wasiat Mayit (Maksimal 1/3)"
                type="number"
                min={0}
                step={1000000}
                value={wasiat ?? ""}
                onChange={(e) => setWasiat(Number(e.target.value))}
                prefix="Rp"
                helperText={`Batas Maksimal 1/3: ${formatCurrency(maxWasiatAllowed)}`}
              />
            </div>

            {isWasiatCapped && (
              <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Peringatan Syariat Wasiat:</strong> Nominal wasiat yang Anda masukkan melampaui batas 1/3 dari harta bersih awal ({formatCurrency(maxWasiatAllowed)}). Sesuai kaidah Fikih, wasiat disesuaikan otomatis ke batas maksimal 1/3 kecuali seluruh ahli waris mengikhlaskannya.
                </div>
              </div>
            )}
          </div>

          {/* Bagian 2: Komposisi Ahli Waris */}
          <div className="flex flex-col gap-4 border-t border-border pt-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Users className="w-4 h-4 text-accent" />
              <span>2. Ahli Waris yang Masih Hidup</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Select
                  label="Status Pasangan yang Ditinggalkan"
                  value={pasangan || "none"}
                  onChange={(e) => setPasangan(e.target.value)}
                  helperText="Pilih status suami atau istri yang masih hidup saat pewaris wafat"
                >
                  <option value="none">Tidak Ada Pasangan Hidup / Sudah Wafat / Cerai</option>
                  <option value="suami">Suami (Pewaris adalah Istri yang Wafat)</option>
                  <option value="istri">Istri (Pewaris adalah Suami yang Wafat)</option>
                </Select>
              </div>

              <Select
                label="Status Ayah Kandung"
                value={ayah ? "true" : "false"}
                onChange={(e) => setAyah(e.target.value === "true")}
                helperText="Ayah kandung dari pewaris"
              >
                <option value="true">Ayah Kandung Masih Hidup</option>
                <option value="false">Ayah Kandung Sudah Wafat</option>
              </Select>

              <Select
                label="Status Ibu Kandung"
                value={ibu ? "true" : "false"}
                onChange={(e) => setIbu(e.target.value === "true")}
                helperText="Ibu kandung dari pewaris"
              >
                <option value="true">Ibu Kandung Masih Hidup</option>
                <option value="false">Ibu Kandung Sudah Wafat</option>
              </Select>

              <Input
                label="Jumlah Anak Laki-Laki"
                type="number"
                min={0}
                max={20}
                step={1}
                value={anakLk ?? 0}
                onChange={(e) => setAnakLk(Math.max(0, parseInt(e.target.value, 10) || 0))}
                suffix="Orang"
                helperText="Anak kandung laki-laki (Asabah)"
              />

              <Input
                label="Jumlah Anak Perempuan"
                type="number"
                min={0}
                max={20}
                step={1}
                value={anakPr ?? 0}
                onChange={(e) => setAnakPr(Math.max(0, parseInt(e.target.value, 10) || 0))}
                suffix="Orang"
                helperText="Anak kandung perempuan"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={calculateFaraidh} className="w-full sm:w-auto flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Hitung Pembagian Waris Presisi
            </Button>
          </div>
        </Card>
      </div>

      {/* Output & Rincian Pembagian Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Status Box */}
        <div className="p-4 rounded-2xl border bg-accent/5 border-accent/20 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-semibold text-primary">{faraidhStatus.category}</div>
            <div className="text-secondary text-xs mt-1 leading-relaxed">
              {faraidhStatus.description}
            </div>
          </div>
        </div>

        {/* Output Boxes */}
        <div className="grid grid-cols-1 gap-4">
          <OutputBox
            label="Total Harta Bersih Siap Waris (Tirkah Shahihah)"
            value={hartaBersih}
            prefix="Rp "
          />
        </div>

        {/* Tabel Daftar Ahli Waris */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" />
              Daftar Distribusi Hak Ahli Waris
            </h3>
            <span className="text-xs font-mono text-secondary">
              {heirList.length} Entitas Waris
            </span>
          </div>

          {heirList.length === 0 ? (
            <div className="py-8 text-center text-secondary text-sm flex flex-col items-center gap-2">
              <ShieldAlert className="w-8 h-8 text-secondary/40" />
              <span>Silakan masukkan parameter harta dan pilih ahli waris.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {heirList.map((heir) => (
                <div
                  key={heir.id}
                  className="p-3.5 rounded-xl border border-border bg-base/60 flex flex-col gap-2 transition-colors hover:border-accent/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-primary text-sm">
                        {heir.name}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20 text-accent font-medium">
                        {heir.shareDescription}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-accent text-sm">
                      {formatCurrency(heir.totalNominal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-secondary border-t border-border/40 pt-2">
                    <span>
                      Proporsi: <strong>{heir.percentage}%</strong>
                    </span>
                    {heir.count > 1 && (
                      <span className="font-mono text-primary font-medium">
                        Per Orang: {formatCurrency(heir.nominalPerPerson)}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-secondary/80 leading-relaxed italic">
                    {heir.fiqhNote}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Audit Ringkasan Angka */}
          <div className="border-t border-border pt-4 flex flex-col gap-2 text-xs">
            <div className="flex justify-between text-secondary">
              <span>Harta Kotor (Tirkah):</span>
              <span className="font-mono text-primary">{formatCurrency(hartaKotor)}</span>
            </div>
            <div className="flex justify-between text-secondary">
              <span>Biaya Pengurusan Jenazah:</span>
              <span className="font-mono text-danger">- {formatCurrency(tajhiz || 0)}</span>
            </div>
            <div className="flex justify-between text-secondary">
              <span>Pelunasan Hutang Mayit:</span>
              <span className="font-mono text-danger">- {formatCurrency(hutang || 0)}</span>
            </div>
            <div className="flex justify-between text-secondary">
              <span>Wasiat Disahkan Syariat:</span>
              <span className="font-mono text-danger">- {formatCurrency(wasiatDiterima)}</span>
            </div>
            <div className="flex justify-between border-t border-border/50 pt-2 font-semibold text-primary text-sm">
              <span>Total Terdistribusi:</span>
              <span className="font-mono text-accent">
                {formatCurrency(totalDistributedNominal)}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}