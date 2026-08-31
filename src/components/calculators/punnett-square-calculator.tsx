"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Dna,
  Calculator,
  RefreshCw,
  Info,
  ShieldAlert,
  Sparkles,
  Layers,
  CheckCircle2,
  Binary,
} from "lucide-react";
import { useQueryState, parseAsString } from "nuqs";

interface GenotypeSummary {
  genotype: string;
  count: number;
  percentage: number;
  label: string;
}

interface PhenotypeSummary {
  phenotype: string;
  count: number;
  percentage: number;
  colorClass: string;
}

export function PunnettSquareCalculator() {
  // State Input (URL Synced via nuqs)
  const [genotype1, setGenotype1] = useQueryState(
    "genotype1",
    parseAsString.withDefault("Aa")
  );
  const [genotype2, setGenotype2] = useQueryState(
    "genotype2",
    parseAsString.withDefault("Aa")
  );
  const [inheritanceType, setInheritanceType] = useQueryState(
    "type",
    parseAsString.withDefault("complete")
  );

  // State Output & Visual Grid
  const [gridMatrix, setGridMatrix] = React.useState<string[][]>([
    ["", ""],
    ["", ""],
  ]);
  const [parent1Alleles, setParent1Alleles] = React.useState<[string, string]>(["A", "a"]);
  const [parent2Alleles, setParent2Alleles] = React.useState<[string, string]>(["A", "a"]);
  const [genotypeResults, setGenotypeResults] = React.useState<GenotypeSummary[]>([]);
  const [phenotypeResults, setPhenotypeResults] = React.useState<PhenotypeSummary[]>([]);
  const [genotypeRatioStr, setGenotypeRatioStr] = React.useState<string>("1 : 2 : 1");
  const [phenotypeRatioStr, setPhenotypeRatioStr] = React.useState<string>("3 : 1");
  const [dominantProb, setDominantProb] = React.useState<number>(75);
  const [recessiveProb, setRecessiveProb] = React.useState<number>(25);
  const [heterozygousProb, setHeterozygousProb] = React.useState<number>(50);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Helper normalisasi alel (huruf besar di depan jika sejenis)
  const normalizeGenotype = React.useCallback((a: string, b: string): string => {
    const isAUpper = a === a.toUpperCase();
    const isBUpper = b === b.toUpperCase();
    if (isAUpper && !isBUpper) return `${a}${b}`;
    if (!isAUpper && isBUpper) return `${b}${a}`;
    return a.localeCompare(b) <= 0 ? `${a}${b}` : `${b}${a}`;
  }, []);

  const calculatePunnett = React.useCallback(() => {
    const g1 = (genotype1 || "").trim();
    const g2 = (genotype2 || "").trim();

    // Validasi parameter teknis genotipe (harus tepat 2 huruf alfabet)
    const validRegex = /^[A-Za-z]{2}$/;
    if (!validRegex.test(g1) || !validRegex.test(g2)) {
      setErrorMessage(
        "Format genotipe tidak valid. Masukkan tepat 2 huruf alfabet untuk setiap induk (contoh: AA, Aa, atau aa)."
      );
      setGridMatrix([
        ["-", "-"],
        ["-", "-"],
      ]);
      setGenotypeResults([]);
      setPhenotypeResults([]);
      setDominantProb(0);
      setRecessiveProb(0);
      setHeterozygousProb(0);
      return;
    }

    setErrorMessage(null);

    const p1AlleleA = g1[0];
    const p1AlleleB = g1[1];
    const p2AlleleA = g2[0];
    const p2AlleleB = g2[1];

    setParent1Alleles([p1AlleleA, p1AlleleB]);
    setParent2Alleles([p2AlleleA, p2AlleleB]);

    // Pembuatan Matriks Kotak Punnett 2x2
    const cell00 = normalizeGenotype(p1AlleleA, p2AlleleA);
    const cell01 = normalizeGenotype(p1AlleleA, p2AlleleB);
    const cell10 = normalizeGenotype(p1AlleleB, p2AlleleA);
    const cell11 = normalizeGenotype(p1AlleleB, p2AlleleB);

    const matrix = [
      [cell00, cell01],
      [cell10, cell11],
    ];
    setGridMatrix(matrix);

    const allOffspring = [cell00, cell01, cell10, cell11];
    const totalCombos = allOffspring.length; // 4

    // Frekuensi Genotipe
    const genotypeCounts: Record<string, number> = {};
    allOffspring.forEach((gt) => {
      genotypeCounts[gt] = (genotypeCounts[gt] || 0) + 1;
    });

    const uniqueGenotypes = Object.keys(genotypeCounts);
    const calculatedGenotypes: GenotypeSummary[] = uniqueGenotypes.map((gt) => {
      const count = genotypeCounts[gt];
      const isHomoDom = gt[0] === gt[0].toUpperCase() && gt[1] === gt[1].toUpperCase();
      const isHomoRec = gt[0] === gt[0].toLowerCase() && gt[1] === gt[1].toLowerCase();
      let label = "Heterozigot";
      if (isHomoDom) label = "Homozigot Dominan";
      else if (isHomoRec) label = "Homozigot Resesif";

      return {
        genotype: gt,
        count,
        percentage: (count / totalCombos) * 100,
        label,
      };
    });

    setGenotypeResults(calculatedGenotypes);
    setGenotypeRatioStr(
      calculatedGenotypes.map((item) => `${item.count} (${item.genotype})`).join(" : ")
    );

    // Frekuensi Probabilitas Spesifik untuk OutputBox
    let domCount = 0;
    let recCount = 0;
    let heteroCount = 0;

    allOffspring.forEach((gt) => {
      const hasUpper = gt[0] === gt[0].toUpperCase() || gt[1] === gt[1].toUpperCase();
      const isBothUpper = gt[0] === gt[0].toUpperCase() && gt[1] === gt[1].toUpperCase();
      const isBothLower = gt[0] === gt[0].toLowerCase() && gt[1] === gt[1].toLowerCase();

      if (!isBothUpper && !isBothLower) {
        heteroCount += 1;
      }

      if (inheritanceType === "incomplete") {
        if (isBothUpper) domCount += 1;
        else if (isBothLower) recCount += 1;
      } else {
        if (hasUpper) domCount += 1;
        else recCount += 1;
      }
    });

    setDominantProb((domCount / totalCombos) * 100);
    setRecessiveProb((recCount / totalCombos) * 100);
    setHeterozygousProb((heteroCount / totalCombos) * 100);

    // Frekuensi Fenotipe
    if (inheritanceType === "incomplete") {
      const phenoList: PhenotypeSummary[] = [];
      const homoDom = allOffspring.filter(
        (gt) => gt[0] === gt[0].toUpperCase() && gt[1] === gt[1].toUpperCase()
      ).length;
      const intermed = allOffspring.filter(
        (gt) =>
          (gt[0] === gt[0].toUpperCase() && gt[1] === gt[1].toLowerCase()) ||
          (gt[0] === gt[0].toLowerCase() && gt[1] === gt[1].toUpperCase())
      ).length;
      const homoRec = allOffspring.filter(
        (gt) => gt[0] === gt[0].toLowerCase() && gt[1] === gt[1].toLowerCase()
      ).length;

      if (homoDom > 0) {
        phenoList.push({
          phenotype: "Sifat Dominan Murni",
          count: homoDom,
          percentage: (homoDom / totalCombos) * 100,
          colorClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        });
      }
      if (intermed > 0) {
        phenoList.push({
          phenotype: "Sifat Intermedier (Campuran)",
          count: intermed,
          percentage: (intermed / totalCombos) * 100,
          colorClass: "bg-accent/10 text-accent border-accent/30",
        });
      }
      if (homoRec > 0) {
        phenoList.push({
          phenotype: "Sifat Resesif Murni",
          count: homoRec,
          percentage: (homoRec / totalCombos) * 100,
          colorClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        });
      }

      setPhenotypeResults(phenoList);
      setPhenotypeRatioStr(phenoList.map((p) => `${p.count} ${p.phenotype}`).join(" : "));
    } else {
      const phenoList: PhenotypeSummary[] = [];
      const domTotal = allOffspring.filter(
        (gt) => gt[0] === gt[0].toUpperCase() || gt[1] === gt[1].toUpperCase()
      ).length;
      const recTotal = allOffspring.filter(
        (gt) => gt[0] === gt[0].toLowerCase() && gt[1] === gt[1].toLowerCase()
      ).length;

      if (domTotal > 0) {
        phenoList.push({
          phenotype: "Fenotipe Dominan",
          count: domTotal,
          percentage: (domTotal / totalCombos) * 100,
          colorClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        });
      }
      if (recTotal > 0) {
        phenoList.push({
          phenotype: "Fenotipe Resesif",
          count: recTotal,
          percentage: (recTotal / totalCombos) * 100,
          colorClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        });
      }

      setPhenotypeResults(phenoList);
      setPhenotypeRatioStr(
        domTotal > 0 && recTotal > 0
          ? `${domTotal} Dominan : ${recTotal} Resesif`
          : domTotal > 0
          ? "100% Dominan (4:0)"
          : "100% Resesif (0:4)"
      );
    }
  }, [genotype1, genotype2, inheritanceType, normalizeGenotype]);

  React.useEffect(() => {
    calculatePunnett();
  }, [calculatePunnett]);

  const handleReset = () => {
    setGenotype1("Aa");
    setGenotype2("Aa");
    setInheritanceType("complete");
    setErrorMessage(null);
  };

  const handlePreset = (p1: string, p2: string, type: string = "complete") => {
    setGenotype1(p1);
    setGenotype2(p2);
    setInheritanceType(type);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form Input & Interactive Matrix Section */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Dna className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Persilangan Monohibrid
                </h2>
                <p className="text-secondary text-sm">
                  Kalkulasi pemisahan alel gamet dan distribusi probabilitas filial (Hukum Mendel I)
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset parameter teknis ke default"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-medium text-secondary">
              Preset Persilangan Genetika Standar Industri:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handlePreset("Aa", "Aa", "complete")}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Heterozigot × Heterozigot (Aa × Aa)
              </button>
              <button
                type="button"
                onClick={() => handlePreset("AA", "aa", "complete")}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Dominan Homozigot × Resesif (AA × aa)
              </button>
              <button
                type="button"
                onClick={() => handlePreset("Aa", "aa", "complete")}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Uji Silang / Test Cross (Aa × aa)
              </button>
              <button
                type="button"
                onClick={() => handlePreset("Aa", "AA", "complete")}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Silang Balik / Backcross (Aa × AA)
              </button>
              <button
                type="button"
                onClick={() => handlePreset("Aa", "Aa", "incomplete")}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Intermedier (Aa × Aa)
              </button>
            </div>
          </div>

          {/* Input Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Genotipe Induk 1 (Parental 1 / Maternal)"
              type="text"
              maxLength={2}
              value={genotype1 ?? ""}
              onChange={(e) => setGenotype1(e.target.value.trim())}
              placeholder="Aa"
              helperText="Kombinasi 2 alel (misal: AA, Aa, atau aa)"
              error={Boolean(errorMessage)}
            />

            <Input
              label="Genotipe Induk 2 (Parental 2 / Paternal)"
              type="text"
              maxLength={2}
              value={genotype2 ?? ""}
              onChange={(e) => setGenotype2(e.target.value.trim())}
              placeholder="Aa"
              helperText="Kombinasi 2 alel (misal: AA, Aa, atau aa)"
              error={Boolean(errorMessage)}
            />

            <div className="sm:col-span-2">
              <Select
                label="Mode Pola Pewarisan Sifat (Inheritance Pattern)"
                value={inheritanceType || "complete"}
                onChange={(e) => setInheritanceType(e.target.value)}
                helperText="Pilih dominansi penuh (Mendelian klasik) atau kodominansi/intermedier"
              >
                <option value="complete">Dominansi Penuh (Complete Dominance)</option>
                <option value="incomplete">Dominansi Tidak Penuh / Intermedier (Incomplete Dominance)</option>
              </Select>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl border border-danger/30 bg-danger/5 flex items-start gap-2.5 text-danger text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Visual Punnett Square 2x2 Table */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center gap-2">
              <Binary className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-primary">
                Visualisasi Matriks Kotak Punnett (2 × 2 Grid)
              </span>
            </div>

            <div className="p-4 rounded-xl border border-border bg-base overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 text-xs font-mono text-secondary border border-border/50 bg-surface/50 rounded-tl-lg">
                      Gamet P1 \ P2
                    </th>
                    <th className="p-3 text-base font-mono font-bold text-accent border border-border/50 bg-surface/80">
                      {parent2Alleles[0] || "-"}
                    </th>
                    <th className="p-3 text-base font-mono font-bold text-accent border border-border/50 bg-surface/80 rounded-tr-lg">
                      {parent2Alleles[1] || "-"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 text-base font-mono font-bold text-accent border border-border/50 bg-surface/80">
                      {parent1Alleles[0] || "-"}
                    </td>
                    <td className="p-4 border border-border/50 bg-elevated/50">
                      <span className="inline-block px-3 py-1.5 rounded-lg bg-accent/15 border border-accent/30 font-mono text-lg font-bold text-primary">
                        {gridMatrix[0][0] || "-"}
                      </span>
                    </td>
                    <td className="p-4 border border-border/50 bg-elevated/50">
                      <span className="inline-block px-3 py-1.5 rounded-lg bg-accent/15 border border-accent/30 font-mono text-lg font-bold text-primary">
                        {gridMatrix[0][1] || "-"}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-base font-mono font-bold text-accent border border-border/50 bg-surface/80 rounded-bl-lg">
                      {parent1Alleles[1] || "-"}
                    </td>
                    <td className="p-4 border border-border/50 bg-elevated/50">
                      <span className="inline-block px-3 py-1.5 rounded-lg bg-accent/15 border border-accent/30 font-mono text-lg font-bold text-primary">
                        {gridMatrix[1][0] || "-"}
                      </span>
                    </td>
                    <td className="p-4 border border-border/50 bg-elevated/50 rounded-br-lg">
                      <span className="inline-block px-3 py-1.5 rounded-lg bg-accent/15 border border-accent/30 font-mono text-lg font-bold text-primary">
                        {gridMatrix[1][1] || "-"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={calculatePunnett} className="w-full sm:w-auto flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Kalkulasi Persilangan Presisi
            </Button>
          </div>
        </Card>

        {/* Biological Standard Guide */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div className="text-xs text-secondary leading-relaxed space-y-1">
            <span className="font-semibold text-primary block">
              Prinsip Segregasi Bebas Mendel (Hukum I Mendel):
            </span>
            <p>
              Pada pembentukan gamet, pasangan alel akan terpisah secara independen ke dalam sel
              kelamin jantan dan betina. Persilangan monohibrid antara dua heterozigot (Aa × Aa)
              secara deterministik menghasilkan rasio genotipe standar industri{" "}
              <strong className="text-primary">1 AA : 2 Aa : 1 aa</strong> dengan probabilitas
              fenotipe dominan 75% dan resesif 25%.
            </p>
          </div>
        </div>
      </div>

      {/* Output & Engineering Breakdown Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <OutputBox
            label="Probabilitas Sifat Dominan"
            value={dominantProb}
            decimals={1}
            suffix="%"
          />
          <OutputBox
            label="Probabilitas Sifat Resesif"
            value={recessiveProb}
            decimals={1}
            suffix="%"
          />
          <OutputBox
            label="Probabilitas Genotipe Heterozigot"
            value={heterozygousProb}
            decimals={1}
            suffix="%"
          />
        </div>

        {/* Breakdown Rasio Genotipe & Fenotipe */}
        <Card className="flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Layers className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-semibold font-display text-primary">
              Distribusi Frekuensi Genotipe & Fenotipe
            </h3>
          </div>

          {/* Rasio Genotipe */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-secondary font-medium">Rasio Genotipe Filial (F1):</span>
              <span className="font-mono font-semibold text-accent">{genotypeRatioStr}</span>
            </div>

            <div className="flex flex-col gap-2">
              {genotypeResults.map((item) => (
                <div
                  key={item.genotype}
                  className="p-2.5 rounded-lg border border-border bg-base flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-accent/15 font-mono font-bold text-accent">
                      {item.genotype}
                    </span>
                    <span className="text-secondary">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-primary font-semibold">{item.count}/4</span>
                    <span className="text-secondary">({item.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rasio Fenotipe */}
          <div className="flex flex-col gap-3 pt-2 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-secondary font-medium">Rasio Fenotipe Filial (F1):</span>
              <span className="font-mono font-semibold text-accent">{phenotypeRatioStr}</span>
            </div>

            <div className="flex flex-col gap-2">
              {phenotypeResults.map((item) => (
                <div
                  key={item.phenotype}
                  className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${item.colorClass}`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="font-medium">{item.phenotype}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-semibold">{item.count}/4</span>
                    <span>({item.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Feature Summary Card */}
        <div className="p-4 rounded-xl border border-border bg-base flex flex-col gap-2 text-xs text-secondary">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Sinkronisasi Parameter URL Real-Time</span>
          </div>
          <p>
            Semua parameter genotipe tersinkronisasi presisi secara real-time pada URL browser melalui{" "}
            <code className="text-accent font-mono bg-accent/10 px-1 py-0.5 rounded">nuqs</code>,
            memudahkan referensi hasil eksperimen dan materi pengajaran biologi.
          </p>
        </div>
      </div>
    </div>
  );
}