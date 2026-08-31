"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Rocket,
  Calculator,
  RefreshCw,
  Info,
  ShieldAlert,
} from "lucide-react";
import { useQueryState, parseAsFloat, parseAsString } from "nuqs";

export function KinematikaFisikaCalculator() {
  const [v0, setV0] = useQueryState("v0", parseAsFloat);
  const [vt, setVt] = useQueryState("vt", parseAsFloat);
  const [a, setA] = useQueryState("a", parseAsFloat);
  const [t, setT] = useQueryState("t", parseAsFloat);
  const [s, setS] = useQueryState("s", parseAsFloat);

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [resV0, setResV0] = React.useState<number>(0);
  const [resVt, setResVt] = React.useState<number>(0);
  const [resA, setResA] = React.useState<number>(0);
  const [resT, setResT] = React.useState<number>(0);
  const [resS, setResS] = React.useState<number>(0);

  const calculateKinematika = React.useCallback(() => {
    let knownCount = 0;
    if (v0 !== null) knownCount++;
    if (vt !== null) knownCount++;
    if (a !== null) knownCount++;
    if (t !== null) knownCount++;
    if (s !== null) knownCount++;

    if (knownCount < 3) {
      setErrorMessage("Masukkan setidaknya 3 parameter untuk melakukan kalkulasi persamaan kinematika.");
      return;
    }
    if (knownCount > 3) {
      setErrorMessage("Hanya 3 parameter yang dibutuhkan. Kosongkan parameter lainnya.");
      return;
    }

    setErrorMessage(null);

    let calcV0 = v0, calcVt = vt, calcA = a, calcT = t, calcS = s;

    // Persamaan Kinematika GLBB:
    // 1. vt = v0 + at
    // 2. s = v0*t + 0.5*a*t^2
    // 3. vt^2 = v0^2 + 2*a*s
    // 4. s = ((v0 + vt)/2) * t

    if (v0 !== null && vt !== null && a !== null) {
      calcT = (vt - v0) / a;
      calcS = ((v0 + vt) / 2) * calcT;
    } else if (v0 !== null && vt !== null && t !== null) {
      calcA = (vt - v0) / t;
      calcS = ((v0 + vt) / 2) * t;
    } else if (v0 !== null && vt !== null && s !== null) {
      calcA = (vt * vt - v0 * v0) / (2 * s);
      calcT = (vt - v0) / calcA;
    } else if (v0 !== null && a !== null && t !== null) {
      calcVt = v0 + a * t;
      calcS = v0 * t + 0.5 * a * t * t;
    } else if (v0 !== null && a !== null && s !== null) {
      calcVt = Math.sqrt(v0 * v0 + 2 * a * s);
      calcT = (calcVt - v0) / a;
    } else if (v0 !== null && t !== null && s !== null) {
      calcVt = (2 * s) / t - v0;
      calcA = (calcVt - v0) / t;
    } else if (vt !== null && a !== null && t !== null) {
      calcV0 = vt - a * t;
      calcS = calcV0 * t + 0.5 * a * t * t;
    } else if (vt !== null && a !== null && s !== null) {
      calcV0 = Math.sqrt(vt * vt - 2 * a * s);
      calcT = (vt - calcV0) / a;
    } else if (vt !== null && t !== null && s !== null) {
      calcV0 = (2 * s) / t - vt;
      calcA = (vt - calcV0) / t;
    } else if (a !== null && t !== null && s !== null) {
      calcV0 = (s - 0.5 * a * t * t) / t;
      calcVt = calcV0 + a * t;
    }

    setResV0(calcV0 ?? 0);
    setResVt(calcVt ?? 0);
    setResA(calcA ?? 0);
    setResT(calcT ?? 0);
    setResS(calcS ?? 0);

  }, [v0, vt, a, t, s]);

  React.useEffect(() => {
    calculateKinematika();
  }, [calculateKinematika]);

  const handleReset = () => {
    setV0(null);
    setVt(null);
    setA(null);
    setT(null);
    setS(null);
    setErrorMessage(null);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Rocket className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Gerak Lurus Berubah Beraturan (GLBB)
                </h2>
                <p className="text-secondary text-sm">
                  Masukkan tepat 3 parameter untuk menghitung nilai lainnya secara otomatis.
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Kecepatan Awal (v0)"
              type="number"
              value={v0 ?? ""}
              onChange={(e) => setV0(e.target.value === "" ? null : Number(e.target.value))}
              suffix="m/s"
            />
            <Input
              label="Kecepatan Akhir (vt)"
              type="number"
              value={vt ?? ""}
              onChange={(e) => setVt(e.target.value === "" ? null : Number(e.target.value))}
              suffix="m/s"
            />
            <Input
              label="Percepatan (a)"
              type="number"
              value={a ?? ""}
              onChange={(e) => setA(e.target.value === "" ? null : Number(e.target.value))}
              suffix="m/s²"
            />
            <Input
              label="Waktu (t)"
              type="number"
              value={t ?? ""}
              onChange={(e) => setT(e.target.value === "" ? null : Number(e.target.value))}
              suffix="s"
            />
            <div className="sm:col-span-2">
              <Input
                label="Jarak / Perpindahan (s)"
                type="number"
                value={s ?? ""}
                onChange={(e) => setS(e.target.value === "" ? null : Number(e.target.value))}
                suffix="m"
              />
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
          <OutputBox label={`Kecepatan Awal (v0)`} value={resV0} decimals={4} suffix={` m/s`} />
          <OutputBox label={`Kecepatan Akhir (vt)`} value={resVt} decimals={4} suffix={` m/s`} />
          <OutputBox label={`Percepatan (a)`} value={resA} decimals={4} suffix={` m/s²`} />
          <OutputBox label={`Waktu Tempuh (t)`} value={resT} decimals={4} suffix={` s`} />
          <OutputBox label={`Jarak Tempuh (s)`} value={resS} decimals={4} suffix={` m`} />
        </div>
      </div>
    </div>
  );
}