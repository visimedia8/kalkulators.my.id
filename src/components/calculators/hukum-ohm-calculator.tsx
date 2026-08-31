"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Zap,
  Calculator,
  RefreshCw,
  Info,
  ShieldAlert,
  Sparkles,
  Layers,
  Battery,
} from "lucide-react";
import { useQueryState, parseAsFloat, parseAsString } from "nuqs";

export function HukumOhmCalculator() {
  const [tegangan, setTegangan] = useQueryState("v", parseAsFloat);
  const [arus, setArus] = useQueryState("i", parseAsFloat);
  const [hambatan, setHambatan] = useQueryState("r", parseAsFloat);
  const [daya, setDaya] = useQueryState("p", parseAsFloat);

  const [unitV, setUnitV] = useQueryState("uv", parseAsString.withDefault("V"));
  const [unitI, setUnitI] = useQueryState("ui", parseAsString.withDefault("A"));
  const [unitR, setUnitR] = useQueryState("ur", parseAsString.withDefault("Ohm"));
  const [unitP, setUnitP] = useQueryState("up", parseAsString.withDefault("W"));

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [resV, setResV] = React.useState<number>(0);
  const [resI, setResI] = React.useState<number>(0);
  const [resR, setResR] = React.useState<number>(0);
  const [resP, setResP] = React.useState<number>(0);

  // Multiplier helper
  const getMultiplier = (unit: string) => {
    switch (unit) {
      case "mV": case "mA": case "mOhm": case "mW": return 1e-3;
      case "V": case "A": case "Ohm": case "W": return 1;
      case "kV": case "kA": case "kOhm": case "kW": return 1e3;
      case "MV": case "MA": case "MOhm": case "MW": return 1e6;
      default: return 1;
    }
  };

  const calculateOhm = React.useCallback(() => {
    let knownCount = 0;
    if (tegangan !== null) knownCount++;
    if (arus !== null) knownCount++;
    if (hambatan !== null) knownCount++;
    if (daya !== null) knownCount++;

    if (knownCount < 2) {
      setErrorMessage("Masukkan setidaknya 2 nilai parameter teknis untuk melakukan kalkulasi.");
      setResV(0); setResI(0); setResR(0); setResP(0);
      return;
    }
    if (knownCount > 2) {
      setErrorMessage("Hanya 2 parameter teknis yang dibutuhkan. Kosongkan parameter lainnya.");
      setResV(0); setResI(0); setResR(0); setResP(0);
      return;
    }

    setErrorMessage(null);

    const vBase = tegangan !== null ? tegangan * getMultiplier(unitV) : null;
    const iBase = arus !== null ? arus * getMultiplier(unitI) : null;
    const rBase = hambatan !== null ? hambatan * getMultiplier(unitR) : null;
    const pBase = daya !== null ? daya * getMultiplier(unitP) : null;

    let vOut = 0, iOut = 0, rOut = 0, pOut = 0;

    if (vBase !== null && iBase !== null) {
      vOut = vBase;
      iOut = iBase;
      rOut = vBase / iBase;
      pOut = vBase * iBase;
    } else if (vBase !== null && rBase !== null) {
      vOut = vBase;
      rOut = rBase;
      iOut = vBase / rBase;
      pOut = (vBase * vBase) / rBase;
    } else if (vBase !== null && pBase !== null) {
      vOut = vBase;
      pOut = pBase;
      iOut = pBase / vBase;
      rOut = (vBase * vBase) / pBase;
    } else if (iBase !== null && rBase !== null) {
      iOut = iBase;
      rOut = rBase;
      vOut = iBase * rBase;
      pOut = (iBase * iBase) * rBase;
    } else if (iBase !== null && pBase !== null) {
      iOut = iBase;
      pOut = pBase;
      vOut = pBase / iBase;
      rOut = pBase / (iBase * iBase);
    } else if (rBase !== null && pBase !== null) {
      rOut = rBase;
      pOut = pBase;
      vOut = Math.sqrt(pBase * rBase);
      iOut = Math.sqrt(pBase / rBase);
    }

    setResV(vOut / getMultiplier(unitV));
    setResI(iOut / getMultiplier(unitI));
    setResR(rOut / getMultiplier(unitR));
    setResP(pOut / getMultiplier(unitP));
  }, [tegangan, arus, hambatan, daya, unitV, unitI, unitR, unitP]);

  React.useEffect(() => {
    calculateOhm();
  }, [calculateOhm]);

  const handleReset = () => {
    setTegangan(null);
    setArus(null);
    setHambatan(null);
    setDaya(null);
    setErrorMessage(null);
  };

  const handlePreset = (v: number, i: number, label: string) => {
    setTegangan(v);
    setArus(i);
    setHambatan(null);
    setDaya(null);
    setUnitV("V");
    setUnitI("A");
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Roda Hukum Ohm
                </h2>
                <p className="text-secondary text-sm">
                  Masukkan tepat 2 parameter untuk menghitung nilai lainnya secara presisi.
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-medium text-secondary">
              Preset Sirkuit Standar Industri:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handlePreset(5, 2, "USB Charger")}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                USB Charger (5V, 2A)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(12, 5, "Aki Motor")}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                Aki Motor (12V, 5A)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(220, 10, "Listrik Rumah PLN")}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-base hover:border-accent hover:text-accent transition-colors"
              >
                PLN Rumah (220V, 10A)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  label="Tegangan (V)"
                  type="number"
                  value={tegangan ?? ""}
                  onChange={(e) => setTegangan(e.target.value === "" ? null : Number(e.target.value))}
                />
              </div>
              <div className="w-24">
                <Select label="Unit" value={unitV} onChange={(e) => setUnitV(e.target.value)}>
                  <option value="mV">mV</option>
                  <option value="V">V</option>
                  <option value="kV">kV</option>
                  <option value="MV">MV</option>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  label="Arus (I)"
                  type="number"
                  value={arus ?? ""}
                  onChange={(e) => setArus(e.target.value === "" ? null : Number(e.target.value))}
                />
              </div>
              <div className="w-24">
                <Select label="Unit" value={unitI} onChange={(e) => setUnitI(e.target.value)}>
                  <option value="mA">mA</option>
                  <option value="A">A</option>
                  <option value="kA">kA</option>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  label="Hambatan (R)"
                  type="number"
                  value={hambatan ?? ""}
                  onChange={(e) => setHambatan(e.target.value === "" ? null : Number(e.target.value))}
                />
              </div>
              <div className="w-24">
                <Select label="Unit" value={unitR} onChange={(e) => setUnitR(e.target.value)}>
                  <option value="mOhm">mΩ</option>
                  <option value="Ohm">Ω</option>
                  <option value="kOhm">kΩ</option>
                  <option value="MOhm">MΩ</option>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  label="Daya (P)"
                  type="number"
                  value={daya ?? ""}
                  onChange={(e) => setDaya(e.target.value === "" ? null : Number(e.target.value))}
                />
              </div>
              <div className="w-24">
                <Select label="Unit" value={unitP} onChange={(e) => setUnitP(e.target.value)}>
                  <option value="mW">mW</option>
                  <option value="W">W</option>
                  <option value="kW">kW</option>
                  <option value="MW">MW</option>
                </Select>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl border border-danger/30 bg-danger/5 flex items-start gap-2.5 text-danger text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </Card>
      </div>

      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4">
          <OutputBox label={`Tegangan (V)`} value={resV} decimals={4} suffix={` ${unitV}`} />
          <OutputBox label={`Arus (I)`} value={resI} decimals={4} suffix={` ${unitI}`} />
          <OutputBox label={`Hambatan (R)`} value={resR} decimals={4} suffix={` ${unitR === "Ohm" ? "Ω" : unitR.replace("Ohm", "Ω")}`} />
          <OutputBox label={`Daya Listrik (P)`} value={resP} decimals={4} suffix={` ${unitP}`} />
        </div>
      </div>
    </div>
  );
}