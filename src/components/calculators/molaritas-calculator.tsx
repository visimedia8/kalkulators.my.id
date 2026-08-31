"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  FlaskConical,
  Droplets,
  Calculator,
  RefreshCw,
  Info,
  ShieldAlert,
  Sparkles,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { useQueryState, parseAsFloat, parseAsString } from "nuqs";

export function MolaritasCalculator() {
  // State Input (URL Synced via nuqs)
  const [m1, setM1] = useQueryState("m1", parseAsFloat.withDefault(1.0));
  const [v1, setV1] = useQueryState("v1", parseAsFloat.withDefault(50));
  const [v1Unit, setV1Unit] = useQueryState("v1Unit", parseAsString.withDefault("mL"));
  const [m2, setM2] = useQueryState("m2", parseAsFloat.withDefault(0.1));

  // State Output
  const [v2, setV2] = React.useState<number>(0);
  const [vSolvent, setVSolvent] = React.useState<number>(0);
  const [dilutionFactor, setDilutionFactor] = React.useState<number>(0);
  const [totalMolesMmol, setTotalMolesMmol] = React.useState<number>(0);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const calculateDilution = React.useCallback(() => {
    // Validasi parameter teknis
    if (m1 === null || v1 === null || m2 === null || m1 <= 0 || v1 <= 0 || m2 <= 0) {
      setErrorMessage("Semua parameter teknis harus berupa angka positif lebih dari nol.");
      setV2(0);
      setVSolvent(0);
      setDilutionFactor(0);
      setTotalMolesMmol(0);
      return;
    }

    if (m2 >= m1) {
      setErrorMessage(
        "Molaritas target (M2) harus lebih kecil dari molaritas awal (M1) untuk proses pengenceran presisi."
      );
      setV2(0);
      setVSolvent(0);
      setDilutionFactor(0);
      setTotalMolesMmol(0);
      return;
    }

    setErrorMessage(null);

    // V2 = (V1 * M1) / M2
    const targetV2 = (v1 * m1) / m2;
    const solventNeeded = targetV2 - v1;
    const df = m1 / m2;

    // Perhitungan mol (mmol jika mL, mol jika L)
    const moles = v1Unit === "mL" ? v1 * m1 : v1 * m1 * 1000;

    setV2(parseFloat(targetV2.toFixed(4)));
    setVSolvent(parseFloat(solventNeeded.toFixed(4)));
    setDilutionFactor(parseFloat(df.toFixed(2)));
    setTotalMolesMmol(parseFloat(moles.toFixed(4)));
  }, [m1, v1, v1Unit, m2]);

  React.useEffect(() => {
    calculateDilution();
  }, [calculateDilution]);

  const handleReset = () => {
    setM1(1.0);
    setV1(50);
    setV1Unit("mL");
    setM2(0.1);
    setErrorMessage(null);
  };

  const handlePreset = (
    presetM1: number,
    presetV1: number,
    presetUnit: string,
    presetM2: number
  ) => {
    setM1(presetM1);
    setV1(presetV1);
    setV1Unit(presetUnit);
    setM2(presetM2);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form Input Section */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Pengenceran Larutan
                </h2>
                <p className="text-secondary text-sm">
                  Kalkulasi stoikiometri pengenceran larutan terkalibrasi (V1 x M1 = V2 x M2)
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
              Preset Larutan Laboratorium Standar:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handlePreset(12.0, 10, "mL", 0.1)}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                HCl Pekat (12 M → 0.1 M)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(1.0, 25, "mL", 0.05)}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                NaOH Stok (1 M → 0.05 M)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(10.0, 50, "mL", 1.0)}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Buffer Stok 10x (10 M → 1 M)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(0.5, 20, "mL", 0.02)}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Larutan Titrasi (0.5 M → 0.02 M)
              </button>
            </div>
          </div>

          {/* Input Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Molaritas Awal Larutan Stok (M1)"
              type="number"
              min={0.0001}
              step={0.01}
              value={m1 ?? ""}
              onChange={(e) => setM1(e.target.value === "" ? null : Number(e.target.value))}
              suffix="M"
              helperText="Konsentrasi larutan pekat (mol/L)"
              error={Boolean(errorMessage && m2 !== null && m1 !== null && m2 >= m1)}
            />

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <Input
                  label="Volume Awal Stok (V1)"
                  type="number"
                  min={0.0001}
                  step={0.1}
                  value={v1 ?? ""}
                  onChange={(e) => setV1(e.target.value === "" ? null : Number(e.target.value))}
                  helperText="Volume larutan yang dipipet"
                />
              </div>
              <div className="col-span-1">
                <Select
                  label="Satuan"
                  value={v1Unit || "mL"}
                  onChange={(e) => setV1Unit(e.target.value)}
                >
                  <option value="mL">mL</option>
                  <option value="L">L</option>
                </Select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Molaritas Larutan Target (M2)"
                type="number"
                min={0.0001}
                step={0.01}
                value={m2 ?? ""}
                onChange={(e) => setM2(e.target.value === "" ? null : Number(e.target.value))}
                suffix="M"
                helperText="Konsentrasi akhir larutan yang diinginkan (M2 < M1)"
                error={Boolean(errorMessage && m2 !== null && m1 !== null && m2 >= m1)}
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl border border-danger/30 bg-danger/5 flex items-start gap-2.5 text-danger text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="pt-2">
            <Button onClick={calculateDilution} className="w-full sm:w-auto flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Kalkulasi Pengenceran Presisi
            </Button>
          </div>
        </Card>

        {/* Safety Protocol Card */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div className="text-xs text-secondary leading-relaxed space-y-1">
            <span className="font-semibold text-primary block">
              Protokol Keamanan Laboratorium Standar Industri:
            </span>
            <p>
              Saat mengencerkan asam pekat (misal H₂SO₄, HCl, HNO₃), selalu tambahkan{" "}
              <strong className="text-primary">asam ke dalam air</strong> (
              <em>Acid into Water</em>), bukan air ke dalam asam. Reaksi hidrasi asam bersifat
              sangat eksotermik dan dapat memicu percikan berbahaya jika dilakukan terbalik.
            </p>
          </div>
        </div>
      </div>

      {/* Output & Engineering Breakdown Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <OutputBox
            label="Volume Akhir Total Larutan (V2)"
            value={v2}
            decimals={2}
            suffix={` ${v1Unit}`}
          />
          <OutputBox
            label="Volume Pelarut Ditambahkan (Air / Aquades)"
            value={vSolvent}
            decimals={2}
            suffix={` ${v1Unit}`}
          />
        </div>

        {/* Summary Card */}
        <Card className="flex flex-col gap-4 border-accent/30 bg-accent/5">
          <div className="flex items-center gap-2.5 text-accent">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-sm font-semibold font-display tracking-wide uppercase">
              Rangkuman Formulasi Stoikiometri
            </h3>
          </div>

          <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-accent/20 bg-base">
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary font-medium">Faktor Pengenceran (DF):</span>
              <span className="text-base font-bold font-mono text-accent">
                {dilutionFactor > 0 ? `${dilutionFactor}x` : "-"}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary font-medium">Rasio Campuran:</span>
              <span className="font-mono text-primary font-semibold">
                {dilutionFactor > 1
                  ? `1 Bagian Stok : ${(dilutionFactor - 1).toFixed(2)} Bagian Pelarut`
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary font-medium">Jumlah Zat Terlarut Tetap (n):</span>
              <span className="font-mono text-primary font-semibold">
                {totalMolesMmol > 0 ? `${totalMolesMmol} mmol` : "-"}
              </span>
            </div>
          </div>
        </Card>

        {/* Technical Breakdown */}
        <Card className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase border-b border-border pb-2 flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent" />
            Verifikasi Parameter Teknis
          </h3>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-secondary">Konsentrasi Awal (M1):</span>
              <span className="font-mono text-primary font-medium">{m1 ?? 0} M</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Volume Terpakai (V1):</span>
              <span className="font-mono text-primary font-medium">
                {v1 ?? 0} {v1Unit}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Konsentrasi Target (M2):</span>
              <span className="font-mono text-primary font-medium">{m2 ?? 0} M</span>
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-center">
              <span className="text-secondary">Konversi Liter (V2):</span>
              <span className="font-mono text-secondary font-medium">
                {v1Unit === "mL" ? (v2 / 1000).toFixed(4) : v2.toFixed(4)} L
              </span>
            </div>

            <div className="flex justify-between items-center font-semibold">
              <span className="text-primary flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Air Tambahan (V2 - V1):
              </span>
              <span className="font-mono text-accent text-base">
                {vSolvent} {v1Unit}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}