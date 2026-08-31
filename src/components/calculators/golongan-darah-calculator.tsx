"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Heart,
  Baby,
  Dna,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Info,
  Activity,
  Sparkles,
  HelpCircle,
  Stethoscope,
  Users,
} from "lucide-react";
import { useQueryState, parseAsString } from "nuqs";
import { cn } from "@/lib/utils";

type BloodType = "A" | "B" | "AB" | "O";
type RhesusType = "+" | "-";

interface PunnettCell {
  motherAllele: string;
  fatherAllele: string;
  genotype: string;
  phenotype: BloodType;
}

interface BloodTypeProbability {
  type: BloodType;
  percentage: number;
  possible: boolean;
  color: string;
  bgLight: string;
  borderClass: string;
}

export function GolonganDarahCalculator() {
  // ---------------------------------------------------------------------------
  // 1. URL Query State Sync (nuqs)
  // ---------------------------------------------------------------------------
  const [golDarahIbu, setGolDarahIbu] = useQueryState(
    "golDarahIbu",
    parseAsString.withDefault("A")
  );
  const [rhesusIbu, setRhesusIbu] = useQueryState(
    "rhesusIbu",
    parseAsString.withDefault("+")
  );
  const [golDarahAyah, setGolDarahAyah] = useQueryState(
    "golDarahAyah",
    parseAsString.withDefault("B")
  );
  const [rhesusAyah, setRhesusAyah] = useQueryState(
    "rhesusAyah",
    parseAsString.withDefault("+")
  );

  // ---------------------------------------------------------------------------
  // 2. State & Calculation Outputs
  // ---------------------------------------------------------------------------
  const [probabilities, setProbabilities] = React.useState<BloodTypeProbability[]>([
    { type: "A", percentage: 25, possible: true, color: "text-emerald-400", bgLight: "bg-emerald-500/10", borderClass: "border-emerald-500/30" },
    { type: "B", percentage: 25, possible: true, color: "text-blue-400", bgLight: "bg-blue-500/10", borderClass: "border-blue-500/30" },
    { type: "AB", percentage: 25, possible: true, color: "text-purple-400", bgLight: "bg-purple-500/10", borderClass: "border-purple-500/30" },
    { type: "O", percentage: 25, possible: true, color: "text-amber-400", bgLight: "bg-amber-500/10", borderClass: "border-amber-500/30" },
  ]);

  const [punnettGrid, setPunnettGrid] = React.useState<PunnettCell[][]>([]);
  const [motherAllelesDisplay, setMotherAllelesDisplay] = React.useState<string[]>(["A", "O"]);
  const [fatherAllelesDisplay, setFatherAllelesDisplay] = React.useState<string[]>(["B", "O"]);

  const [probA, setProbA] = React.useState<number>(25);
  const [probB, setProbB] = React.useState<number>(25);
  const [probAB, setProbAB] = React.useState<number>(25);
  const [probO, setProbO] = React.useState<number>(25);

  const [rhPosProb, setRhPosProb] = React.useState<string>("75% - 100%");
  const [rhNegProb, setRhNegProb] = React.useState<string>("0% - 25%");
  const [hasRhIncompatibilityRisk, setHasRhIncompatibilityRisk] = React.useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // 3. Genetics Calculation Logic (Mendelian ABO & Rh System)
  // ---------------------------------------------------------------------------
  const calculateGenetics = React.useCallback(() => {
    const motherType = (golDarahIbu as BloodType) || "A";
    const fatherType = (golDarahAyah as BloodType) || "B";
    const motherRh = (rhesusIbu as RhesusType) || "+";
    const fatherRh = (rhesusAyah as RhesusType) || "+";

    // Representasi alel gamet potensial
    const getAlleles = (type: BloodType): [string, string] => {
      switch (type) {
        case "A":
          return ["A", "O"]; // Model heterozigot / populasi umum
        case "B":
          return ["B", "O"];
        case "AB":
          return ["A", "B"];
        case "O":
          return ["O", "O"];
        default:
          return ["O", "O"];
      }
    };

    const mAlleles = getAlleles(motherType);
    const fAlleles = getAlleles(fatherType);

    setMotherAllelesDisplay(mAlleles);
    setFatherAllelesDisplay(fAlleles);

    // Pemetaan fenotipe dari kombinasi 2 alel
    const resolvePhenotype = (al1: string, al2: string): { genotype: string; phenotype: BloodType } => {
      const pair = [al1, al2].sort().join("");
      if (pair === "AA" || pair === "AO") return { genotype: pair, phenotype: "A" };
      if (pair === "BB" || pair === "BO") return { genotype: pair, phenotype: "B" };
      if (pair === "AB") return { genotype: pair, phenotype: "AB" };
      return { genotype: "OO", phenotype: "O" };
    };

    // Matriks Punnett Square 2x2
    const grid: PunnettCell[][] = [];
    const counts: Record<BloodType, number> = { A: 0, B: 0, AB: 0, O: 0 };

    for (let i = 0; i < mAlleles.length; i++) {
      const row: PunnettCell[] = [];
      for (let j = 0; j < fAlleles.length; j++) {
        const res = resolvePhenotype(mAlleles[i], fAlleles[j]);
        row.push({
          motherAllele: mAlleles[i],
          fatherAllele: fAlleles[j],
          genotype: res.genotype,
          phenotype: res.phenotype,
        });
        counts[res.phenotype] += 1;
      }
      grid.push(row);
    }

    setPunnettGrid(grid);

    // Perhitungan Probabilitas ABO
    const totalCombos = 4;
    const pA = Math.round((counts.A / totalCombos) * 100);
    const pB = Math.round((counts.B / totalCombos) * 100);
    const pAB = Math.round((counts.AB / totalCombos) * 100);
    const pO = Math.round((counts.O / totalCombos) * 100);

    setProbA(pA);
    setProbB(pB);
    setProbAB(pAB);
    setProbO(pO);

    setProbabilities([
      {
        type: "A",
        percentage: pA,
        possible: pA > 0,
        color: "text-emerald-400",
        bgLight: "bg-emerald-500/10",
        borderClass: "border-emerald-500/30",
      },
      {
        type: "B",
        percentage: pB,
        possible: pB > 0,
        color: "text-blue-400",
        bgLight: "bg-blue-500/10",
        borderClass: "border-blue-500/30",
      },
      {
        type: "AB",
        percentage: pAB,
        possible: pAB > 0,
        color: "text-purple-400",
        bgLight: "bg-purple-500/10",
        borderClass: "border-purple-500/30",
      },
      {
        type: "O",
        percentage: pO,
        possible: pO > 0,
        color: "text-amber-400",
        bgLight: "bg-amber-500/10",
        borderClass: "border-amber-500/30",
      },
    ]);

    // Analisis Rhesus & Inkompatibilitas Maternal-Fetal
    if (motherRh === "-" && fatherRh === "+") {
      setHasRhIncompatibilityRisk(true);
      setRhPosProb("50% - 100%");
      setRhNegProb("0% - 50%");
    } else if (motherRh === "-" && fatherRh === "-") {
      setHasRhIncompatibilityRisk(false);
      setRhPosProb("0%");
      setRhNegProb("100%");
    } else if (motherRh === "+" && fatherRh === "-") {
      setHasRhIncompatibilityRisk(false);
      setRhPosProb("50% - 100%");
      setRhNegProb("0% - 50%");
    } else {
      // Ibu (+) & Ayah (+)
      setHasRhIncompatibilityRisk(false);
      setRhPosProb("75% - 100%");
      setRhNegProb("0% - 25%");
    }
  }, [golDarahIbu, golDarahAyah, rhesusIbu, rhesusAyah]);

  React.useEffect(() => {
    calculateGenetics();
  }, [calculateGenetics]);

  const handleReset = () => {
    setGolDarahIbu("A");
    setRhesusIbu("+");
    setGolDarahAyah("B");
    setRhesusAyah("+");
  };

  const possibleList = probabilities.filter((p) => p.possible);
  const impossibleList = probabilities.filter((p) => !p.possible);

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto py-2">
      {/* Header Info */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
            <Heart className="w-5 h-5 fill-red-500/30 text-red-400" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Medis & Parenting • Parameter Teknis Terkalibrasi
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
          Kalkulator Prediksi Golongan Darah Anak
        </h1>
        <p className="text-sm text-secondary leading-relaxed">
          Hitung probabilitas pewarisan golongan darah sistem ABO dan analisis risiko inkompatibilitas
          Rhesus secara presisi menggunakan hukum genetika Mendel dan standar industri medis.
        </p>
      </div>

      {/* Input Parameters Form */}
      <Card className="flex flex-col gap-6 p-6 border-border/80 bg-surface shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-accent" />
            <h2 className="text-base font-semibold text-primary">
              Parameter Golongan Darah Orang Tua
            </h2>
          </div>
          <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-secondary hover:text-primary"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Default
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kolom Profil Ibu */}
          <div className="flex flex-col gap-4 p-4 rounded-xl border border-border/60 bg-base/50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
              <span className="text-sm font-semibold text-primary">Data Biologis Ibu (Maternal)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Golongan Darah ABO"
                value={golDarahIbu || "A"}
                onChange={(e) => setGolDarahIbu(e.target.value)}
              >
                <option value="A">Golongan Darah A</option>
                <option value="B">Golongan Darah B</option>
                <option value="AB">Golongan Darah AB</option>
                <option value="O">Golongan Darah O</option>
              </Select>

              <Select
                label="Faktor Rhesus"
                value={rhesusIbu || "+"}
                onChange={(e) => setRhesusIbu(e.target.value)}
              >
                <option value="+">Rhesus Positif (Rh+)</option>
                <option value="-">Rhesus Negatif (Rh-)</option>
              </Select>
            </div>
            <p className="text-[12px] text-secondary">
              Alel gen maternal: <span className="font-mono font-medium text-primary">[{motherAllelesDisplay.join(", ")}]</span> Rh: <span className="font-mono font-medium text-primary">({rhesusIbu})</span>
            </p>
          </div>

          {/* Kolom Profil Ayah */}
          <div className="flex flex-col gap-4 p-4 rounded-xl border border-border/60 bg-base/50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <span className="text-sm font-semibold text-primary">Data Biologis Ayah (Paternal)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Golongan Darah ABO"
                value={golDarahAyah || "B"}
                onChange={(e) => setGolDarahAyah(e.target.value)}
              >
                <option value="A">Golongan Darah A</option>
                <option value="B">Golongan Darah B</option>
                <option value="AB">Golongan Darah AB</option>
                <option value="O">Golongan Darah O</option>
              </Select>

              <Select
                label="Faktor Rhesus"
                value={rhesusAyah || "+"}
                onChange={(e) => setRhesusAyah(e.target.value)}
              >
                <option value="+">Rhesus Positif (Rh+)</option>
                <option value="-">Rhesus Negatif (Rh-)</option>
              </Select>
            </div>
            <p className="text-[12px] text-secondary">
              Alel gen paternal: <span className="font-mono font-medium text-primary">[{fatherAllelesDisplay.join(", ")}]</span> Rh: <span className="font-mono font-medium text-primary">({rhesusAyah})</span>
            </p>
          </div>
        </div>
      </Card>

      {/* Output Probabilitas ABO */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-primary">
            Probabilitas Golongan Darah Anak (Sistem ABO)
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <OutputBox
            label="Golongan Darah A"
            value={probA}
            suffix="%"
            className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/02"
          />
          <OutputBox
            label="Golongan Darah B"
            value={probB}
            suffix="%"
            className="border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-blue-500/02"
          />
          <OutputBox
            label="Golongan Darah AB"
            value={probAB}
            suffix="%"
            className="border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-purple-500/02"
          />
          <OutputBox
            label="Golongan Darah O"
            value={probO}
            suffix="%"
            className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-500/02"
          />
        </div>
      </div>

      {/* Rhesus Alert & Status Card */}
      <Card
        className={cn(
          "p-6 transition-all duration-200 border",
          hasRhIncompatibilityRisk
            ? "border-amber-500/50 bg-amber-500/10"
            : "border-emerald-500/30 bg-emerald-500/05"
        )}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {hasRhIncompatibilityRisk ? (
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-base/70 border border-border">
                    Status Inkompatibilitas Rhesus
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded-md",
                      hasRhIncompatibilityRisk
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-emerald-500/20 text-emerald-300"
                    )}
                  >
                    {hasRhIncompatibilityRisk ? "Perlu Pemantauan Medis Khusus" : "Kompatibel / Risiko Sangat Rendah"}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-primary">
                  {hasRhIncompatibilityRisk
                    ? "Waspada: Potensi Inkompatibilitas Rhesus Maternal-Fetal"
                    : "Kompatibilitas Imunologis Maternal-Fetal Optimal"}
                </h3>
              </div>
            </div>
          </div>

          <p className="text-sm text-secondary leading-relaxed">
            {hasRhIncompatibilityRisk
              ? "Kombinasi Ibu Rhesus Negatif (Rh-) dan Ayah Rhesus Positif (Rh+) berpotensi menghasilkan janin dengan Rhesus Positif (Rh+). Jika darah janin terpapar ke sirkulasi darah ibu (terutama saat persalinan), tubuh ibu dapat membentuk antibodi anti-D (sensitisasi Rhesus) yang berisiko memicu Erythroblastosis Fetalis / Penyakit Hemolitik pada kehamilan berikutnya."
              : "Kombinasi Rhesus maternal dan paternal ini aman dari risiko destruksi sel darah merah janin akibat sensitisasi antibodi anti-D. Sistem imun maternal tidak akan mengenali antigen janin sebagai benda asing terkait faktor Rh(D)."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-border/40">
            <div className="p-3 rounded-lg bg-base/60 border border-border/50">
              <span className="text-[12px] text-secondary block mb-1">Prediksi Rhesus Positif (Rh+)</span>
              <span className="font-mono text-base font-bold text-primary">{rhPosProb}</span>
            </div>
            <div className="p-3 rounded-lg bg-base/60 border border-border/50">
              <span className="text-[12px] text-secondary block mb-1">Prediksi Rhesus Negatif (Rh-)</span>
              <span className="font-mono text-base font-bold text-primary">{rhNegProb}</span>
            </div>
            <div className="p-3 rounded-lg bg-base/60 border border-border/50 sm:col-span-2 md:col-span-1">
              <span className="text-[12px] text-secondary block mb-1">Tindakan Medis Rekomendasi</span>
              <span className="text-xs font-semibold text-primary">
                {hasRhIncompatibilityRisk ? "Skrining Indirect Coombs & Injeksi Anti-D (RhoGAM)" : "Pemeriksaan Antenatal Standar Rutin"}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Analisis Rinci: Fenotipe Mungkin vs Mustahil & Matriks Punnett */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ringkasan Kemungkinan Fenotipe */}
        <Card className="p-6 flex flex-col gap-4 border-border/80 bg-surface">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Dna className="w-5 h-5 text-accent" />
            <h3 className="text-base font-semibold text-primary">
              Klasifikasi Pewarisan Fenotipe
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 block">
                ✓ Golongan Darah yang Mungkin Dimiliki Anak:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {possibleList.map((item) => (
                  <div
                    key={item.type}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border",
                      item.borderClass,
                      item.bgLight
                    )}
                  >
                    <span className="text-sm font-bold text-primary">
                      Golongan {item.type}
                    </span>
                    <span className="font-mono text-sm font-semibold text-primary">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {impossibleList.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 block">
                  ✕ Golongan Darah yang Mustahil (0%):
                </span>
                <div className="flex flex-wrap gap-2">
                  {impossibleList.map((item) => (
                    <span
                      key={item.type}
                      className="px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-xs font-medium text-red-300"
                    >
                      Golongan {item.type} (0%)
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Matriks Punnett Square */}
        <Card className="p-6 flex flex-col gap-4 border-border/80 bg-surface">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <h3 className="text-base font-semibold text-primary">
                Matriks Persilangan Punnett Square 2×2
              </h3>
            </div>
            <span className="text-[11px] text-secondary font-mono">Hukum Mendel</span>
          </div>

          <div className="overflow-x-auto py-2">
            <table className="w-full text-center border-collapse text-xs">
              <thead>
                <tr>
                  <th className="p-2 text-secondary font-normal border border-border/40 bg-base/60">
                    Ibu \ Ayah
                  </th>
                  {fatherAllelesDisplay.map((fa, idx) => (
                    <th
                      key={idx}
                      className="p-2 font-bold text-blue-400 border border-border/40 bg-blue-500/10"
                    >
                      Alel Ayah: {fa}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {punnettGrid.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <th className="p-2 font-bold text-pink-400 border border-border/40 bg-pink-500/10">
                      Alel Ibu: {motherAllelesDisplay[rIdx]}
                    </th>
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className="p-3 border border-border/60 bg-base/40 font-mono"
                      >
                        <div className="font-bold text-sm text-primary">
                          {cell.genotype}
                        </div>
                        <div className="text-[11px] text-accent font-sans mt-0.5">
                          Gol. {cell.phenotype}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-secondary text-center">
            Setiap sel Punnett merepresentasikan 25% probabilitas kombinasi genotipe zigot.
          </p>
        </Card>
      </div>

      {/* Protokol Medis & Catatan Klinis */}
      <Card className="p-6 border-border/80 bg-surface flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-accent" />
          <h3 className="text-base font-semibold text-primary">
            Panduan Klinis & Rekomendasi Standar Industri
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-secondary leading-relaxed">
          <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-base/50 border border-border/60">
            <span className="font-semibold text-primary flex items-center gap-1.5">
              <Info className="w-4 h-4 text-accent" />
              Verifikasi Golongan Darah Konfirmasi Laboratorium
            </span>
            <p>
              Prediksi di atas dihitung berdasarkan kombinasi alel dominan dan resesif standar. Dalam
              kondisi medis nyata (misalnya fenotipe Bombay atau mutasi alel langka), pemeriksaan
              aglutinasi serum laboratorium tetap menjadi standar emas kepastian golongan darah.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-base/50 border border-border/60">
            <span className="font-semibold text-primary flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Prosedur Profilaksis Inkompatibilitas Rhesus
            </span>
            <p>
              Bagi ibu dengan Rhesus negatif yang mengandung janin Rhesus positif, pemberian injeksi
              Anti-D Immunoglobulin (RhoGAM) dianjurkan pada usia gestasi 28 minggu dan dalam tempo
              72 jam pasca persalinan untuk mencegah komplikasi sensitisasi maternal pada kehamilan selanjutnya.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}