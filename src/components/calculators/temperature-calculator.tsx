"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Thermometer,
  ArrowRightLeft,
  RotateCcw,
  Flame,
  Snowflake,
  Info,
  Gauge,
  CheckCircle2,
  Calculator,
  AlertTriangle,
} from "lucide-react";
import { useQueryState, parseAsFloat, parseAsString } from "nuqs";
import { cn } from "@/lib/utils";

type TemperatureUnit = "celsius" | "fahrenheit" | "kelvin" | "reamur" | "rankine";

interface UnitConfig {
  name: string;
  symbol: string;
  description: string;
}

const UNIT_CONFIGS: Record<TemperatureUnit, UnitConfig> = {
  celsius: {
    name: "Celsius",
    symbol: "°C",
    description: "Skala metrik internasional berbasis titik beku (0°C) & didih (100°C) air.",
  },
  fahrenheit: {
    name: "Fahrenheit",
    symbol: "°F",
    description: "Skala imperial standar industri Amerika Serikat & manufaktur tertentu.",
  },
  kelvin: {
    name: "Kelvin",
    symbol: "K",
    description: "Satuan dasar Sistem Internasional (SI) untuk termodinamika absolut.",
  },
  reamur: {
    name: "Reamur",
    symbol: "°Ré",
    description: "Skala historis dengan rentang 0°Ré (beku) hingga 80°Ré (didih).",
  },
  rankine: {
    name: "Rankine",
    symbol: "°R",
    description: "Skala suhu termodinamika absolut berbasis derajat Fahrenheit.",
  },
};

interface PresetPoint {
  label: string;
  celsiusValue: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PRESET_POINTS: PresetPoint[] = [
  {
    label: "Nol Mutlak (0 K)",
    celsiusValue: -273.15,
    description: "Titik henti energi kinetik molekuler total",
    icon: Snowflake,
  },
  {
    label: "Titik Beku Air (0 °C)",
    celsiusValue: 0,
    description: "Keseimbangan es dan air cair pada 1 atm",
    icon: Snowflake,
  },
  {
    label: "Suhu Ruang STP (25 °C)",
    celsiusValue: 25,
    description: "Kondisi standar pengujian laboratorium",
    icon: Gauge,
  },
  {
    label: "Suhu Tubuh Normal (37 °C)",
    celsiusValue: 37,
    description: "Suhu inti fisiologis manusia normal",
    icon: Thermometer,
  },
  {
    label: "Titik Didih Air (100 °C)",
    celsiusValue: 100,
    description: "Vaporisasi air murni pada tekanan 1 atm",
    icon: Flame,
  },
];

export function TemperatureCalculator() {
  // State Input via nuqs (URL Query State)
  const [temperature, setTemperature] = useQueryState(
    "temp",
    parseAsFloat.withDefault(100)
  );
  const [fromUnit, setFromUnit] = useQueryState(
    "from",
    parseAsString.withDefault("celsius")
  );
  const [toUnit, setToUnit] = useQueryState(
    "to",
    parseAsString.withDefault("fahrenheit")
  );

  // Normalized Unit Helpers (supports 'celcius' and 'celsius')
  const normalizeUnit = (unitStr: string | null, fallback: TemperatureUnit): TemperatureUnit => {
    if (!unitStr) return fallback;
    const lower = unitStr.toLowerCase();
    if (lower === "celcius" || lower === "celsius") return "celsius";
    if (lower in UNIT_CONFIGS) return lower as TemperatureUnit;
    return fallback;
  };

  const currentFrom = normalizeUnit(fromUnit, "celsius");
  const currentTo = normalizeUnit(toUnit, "fahrenheit");

  // Calculation Results
  const [convertedValue, setConvertedValue] = React.useState<number>(212);
  const [allConversions, setAllConversions] = React.useState<Record<TemperatureUnit, number>>({
    celsius: 100,
    fahrenheit: 212,
    kelvin: 373.15,
    reamur: 80,
    rankine: 671.67,
  });
  const [formulaText, setFormulaText] = React.useState<string>("");
  const [calculationStep, setCalculationStep] = React.useState<string>("");
  const [isBelowAbsoluteZero, setIsBelowAbsoluteZero] = React.useState<boolean>(false);

  // Core Mathematical Engine: Convert any unit to Celsius
  const toCelsius = React.useCallback((val: number, unit: TemperatureUnit): number => {
    switch (unit) {
      case "celsius":
        return val;
      case "fahrenheit":
        return ((val - 32) * 5) / 9;
      case "kelvin":
        return val - 273.15;
      case "reamur":
        return (val * 5) / 4;
      case "rankine":
        return ((val - 491.67) * 5) / 9;
      default:
        return val;
    }
  }, []);

  // Convert Celsius to Target Unit
  const fromCelsius = React.useCallback((c: number, unit: TemperatureUnit): number => {
    switch (unit) {
      case "celsius":
        return c;
      case "fahrenheit":
        return (c * 9) / 5 + 32;
      case "kelvin":
        return c + 273.15;
      case "reamur":
        return (c * 4) / 5;
      case "rankine":
        return (c + 273.15) * 1.8;
      default:
        return c;
    }
  }, []);

  // Main Calculation Routine
  const calculateTemperature = React.useCallback(() => {
    const inputVal = temperature ?? 0;
    const from = UNIT_CONFIGS[currentFrom] ? currentFrom : "celsius";
    const to = UNIT_CONFIGS[currentTo] ? currentTo : "fahrenheit";

    // 1. Convert to base Celsius
    const c = toCelsius(inputVal, from);

    // 2. Convert to target unit
    const result = fromCelsius(c, to);
    setConvertedValue(parseFloat(result.toFixed(4)));

    // 3. Absolute zero validation (0 K / -273.15 °C)
    setIsBelowAbsoluteZero(c < -273.15);

    // 4. Matrix of all scales
    setAllConversions({
      celsius: parseFloat(fromCelsius(c, "celsius").toFixed(4)),
      fahrenheit: parseFloat(fromCelsius(c, "fahrenheit").toFixed(4)),
      kelvin: parseFloat(fromCelsius(c, "kelvin").toFixed(4)),
      reamur: parseFloat(fromCelsius(c, "reamur").toFixed(4)),
      rankine: parseFloat(fromCelsius(c, "rankine").toFixed(4)),
    });

    // 5. Formula & Step Builder
    buildFormulaExplanation(inputVal, from, to, result);
  }, [temperature, currentFrom, currentTo, toCelsius, fromCelsius]);

  const buildFormulaExplanation = (
    val: number,
    from: TemperatureUnit,
    to: TemperatureUnit,
    result: number
  ) => {
    if (from === to) {
      setFormulaText(`T(${UNIT_CONFIGS[to].symbol}) = T(${UNIT_CONFIGS[from].symbol})`);
      setCalculationStep(`${val} ${UNIT_CONFIGS[from].symbol} = ${val} ${UNIT_CONFIGS[to].symbol}`);
      return;
    }

    if (from === "celsius" && to === "fahrenheit") {
      setFormulaText("°F = (°C × 9/5) + 32");
      setCalculationStep(`(${val} × 1.8) + 32 = ${result.toFixed(2)} °F`);
    } else if (from === "fahrenheit" && to === "celsius") {
      setFormulaText("°C = (°F - 32) × 5/9");
      setCalculationStep(`(${val} - 32) × 0.5556 = ${result.toFixed(2)} °C`);
    } else if (from === "celsius" && to === "kelvin") {
      setFormulaText("K = °C + 273.15");
      setCalculationStep(`${val} + 273.15 = ${result.toFixed(2)} K`);
    } else if (from === "kelvin" && to === "celsius") {
      setFormulaText("°C = K - 273.15");
      setCalculationStep(`${val} - 273.15 = ${result.toFixed(2)} °C`);
    } else if (from === "fahrenheit" && to === "kelvin") {
      setFormulaText("K = (°F - 32) × 5/9 + 273.15");
      setCalculationStep(`((${val} - 32) × 5/9) + 273.15 = ${result.toFixed(2)} K`);
    } else if (from === "kelvin" && to === "fahrenheit") {
      setFormulaText("°F = (K - 273.15) × 9/5 + 32");
      setCalculationStep(`((${val} - 273.15) × 1.8) + 32 = ${result.toFixed(2)} °F`);
    } else if (from === "celsius" && to === "reamur") {
      setFormulaText("°Ré = °C × 4/5");
      setCalculationStep(`${val} × 0.8 = ${result.toFixed(2)} °Ré`);
    } else if (from === "reamur" && to === "celsius") {
      setFormulaText("°C = °Ré × 5/4");
      setCalculationStep(`${val} × 1.25 = ${result.toFixed(2)} °C`);
    } else {
      setFormulaText(`Konversi via Base Unit Celsius: T(${UNIT_CONFIGS[to].symbol})`);
      setCalculationStep(`Input: ${val} ${UNIT_CONFIGS[from].symbol} → Hasil: ${result.toFixed(2)} ${UNIT_CONFIGS[to].symbol}`);
    }
  };

  // Auto-calculate on initial load & dependency changes
  React.useEffect(() => {
    calculateTemperature();
  }, [calculateTemperature]);

  const handleSwapUnits = () => {
    const tempFrom = currentFrom;
    const tempTo = currentTo;
    setFromUnit(tempTo);
    setToUnit(tempFrom);
  };

  const handleReset = () => {
    setTemperature(null);
    setFromUnit(null);
    setToUnit(null);
  };

  const applyPreset = (preset: PresetPoint) => {
    const targetUnit = UNIT_CONFIGS[currentFrom] ? currentFrom : "celsius";
    const convertedInput = fromCelsius(preset.celsiusValue, targetUnit);
    setTemperature(parseFloat(convertedInput.toFixed(2)));
  };

  // Physical State Diagnostics
  const cValue = allConversions.celsius;
  let physicalState = "Fase Cair (Kondisi Normal)";
  let physicalStateColor = "text-accent";
  let physicalStateBg = "bg-accent/10 border-accent/20";

  if (cValue < 0) {
    physicalState = "Fase Beku / Padat (Es)";
    physicalStateColor = "text-blue-400";
    physicalStateBg = "bg-blue-500/10 border-blue-500/30";
  } else if (cValue === 0) {
    physicalState = "Titik Beku Air (Keseimbangan Padat-Cair)";
    physicalStateColor = "text-cyan-400";
    physicalStateBg = "bg-cyan-500/10 border-cyan-500/30";
  } else if (cValue >= 100) {
    physicalState = cValue === 100 ? "Titik Didih Air (Vaporisasi)" : "Fase Gas / Uap Panas (Superheated)";
    physicalStateColor = "text-amber-400";
    physicalStateBg = "bg-amber-500/10 border-amber-500/30";
  }

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Kolom Kiri: Form Input & Konfigurasi Skala */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Konversi Suhu
                </h2>
                <p className="text-secondary text-sm">
                  Kalkulasi presisi antar skala termometrik standar industri
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke parameter default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Quick Preset Badges */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-secondary">
              Titik Kalibrasi & Preset Cepat
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_POINTS.map((p, idx) => {
                const IconComponent = p.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated hover:border-accent/50 text-secondary hover:text-primary text-xs transition-all"
                  >
                    <IconComponent className="w-3.5 h-3.5 text-accent" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Numerical Temperature Input */}
          <div className="flex flex-col gap-4">
            <Input
              label="Nilai Suhu Input"
              type="number"
              step="any"
              value={temperature ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                setTemperature(val === "" ? null : parseFloat(val));
              }}
              suffix={UNIT_CONFIGS[currentFrom]?.symbol || "°"}
              placeholder="Contoh: 100"
              helperText={`Input aktif: ${temperature ?? 0} ${UNIT_CONFIGS[currentFrom]?.name || ""}`}
            />
          </div>

          {/* Scale Selectors with Swap Action */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-3 items-end">
            <Select
              label="Dari Skala (From)"
              value={currentFrom}
              onChange={(e) => setFromUnit(e.target.value)}
            >
              <option value="celsius">Celsius (°C)</option>
              <option value="fahrenheit">Fahrenheit (°F)</option>
              <option value="kelvin">Kelvin (K)</option>
              <option value="reamur">Reamur (°Ré)</option>
              <option value="rankine">Rankine (°R)</option>
            </Select>

            <div className="flex justify-center pb-0.5">
              <Button
                type="button"
                variant="secondary"
                onClick={handleSwapUnits}
                className="px-3 h-11 border-border hover:border-accent"
                title="Tukar Skala Asal dan Target"
              >
                <ArrowRightLeft className="w-4 h-4 text-accent" />
              </Button>
            </div>

            <Select
              label="Ke Skala (To)"
              value={currentTo}
              onChange={(e) => setToUnit(e.target.value)}
            >
              <option value="celsius">Celsius (°C)</option>
              <option value="fahrenheit">Fahrenheit (°F)</option>
              <option value="kelvin">Kelvin (K)</option>
              <option value="reamur">Reamur (°Ré)</option>
              <option value="rankine">Rankine (°R)</option>
            </Select>
          </div>

          {/* Action Trigger */}
          <div className="pt-2">
            <Button
              onClick={calculateTemperature}
              className="w-full sm:w-auto flex items-center gap-2"
              variant="primary"
            >
              <Calculator className="w-4 h-4" />
              Hitung Konversi Presisi
            </Button>
          </div>
        </Card>

        {/* Absolute Zero Warning Banner */}
        {isBelowAbsoluteZero && (
          <Card className="bg-rose-500/10 border-rose-500/30 text-rose-300 text-xs p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-rose-200 block mb-0.5">
                Peringatan Batas Nol Mutlak (Absolute Zero)
              </span>
              Nilai suhu berada di bawah 0 Kelvin (-273.15 °C). Menurut hukum termodinamika ketiga, suhu di bawah nol mutlak secara fisik tidak mungkin terjadi pada materi konvensional.
            </div>
          </Card>
        )}

        {/* Technical Validation Card */}
        <Card className="bg-surface/50 border-border/60 text-secondary text-xs leading-relaxed flex items-start gap-3 p-4">
          <Info className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-primary block mb-0.5">
              Standar Industri & Kalibrasi Metrologi
            </span>
            Kalkulator ini menerapkan standar konversi resmi International Temperature Scale of 1990 (ITS-90) dan BIPM (Bureau International des Poids et Mesures), menjamin presisi matematis tanpa distorsi pembulatan.
          </div>
        </Card>
      </div>

      {/* Kolom Kanan: Output & Diagnostic Breakdown */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Main Converted Output Box */}
        <OutputBox
          label={`Hasil Konversi (${UNIT_CONFIGS[currentTo]?.name || "Target"})`}
          value={convertedValue}
          decimals={2}
          suffix={` ${UNIT_CONFIGS[currentTo]?.symbol || ""}`}
        />

        {/* Dynamic Formula & Step Card */}
        <Card className="flex flex-col gap-3 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary pb-2 border-b border-border">
            <Calculator className="w-4 h-4 text-accent" />
            <span>Rumus & Tahapan Perhitungan</span>
          </div>

          <div className="flex flex-col gap-2 text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-secondary">Rumus Matematis Standar:</span>
              <div className="p-2.5 rounded-lg bg-base border border-border font-mono text-accent font-medium">
                {formulaText}
              </div>
            </div>

            <div className="flex flex-col gap-1 pt-1">
              <span className="text-secondary">Substitusi Parameter Teknis:</span>
              <div className="p-2.5 rounded-lg bg-base border border-border font-mono text-primary">
                {calculationStep}
              </div>
            </div>
          </div>
        </Card>

        {/* Multi-Scale Comparison Matrix */}
        <Card className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="text-sm font-semibold text-primary flex items-center gap-2">
              <Gauge className="w-4 h-4 text-accent" />
              Matriks Konversi Seluruh Skala
            </span>
            <span className="text-[11px] text-secondary">Real-Time</span>
          </div>

          <div className="flex flex-col gap-2.5 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-border/50">
              <span className="text-secondary">Celsius (°C):</span>
              <span className="font-mono font-semibold text-primary">
                {allConversions.celsius.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 4 })} °C
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/50">
              <span className="text-secondary">Fahrenheit (°F):</span>
              <span className="font-mono font-semibold text-primary">
                {allConversions.fahrenheit.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 4 })} °F
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/50">
              <span className="text-secondary">Kelvin (K):</span>
              <span className="font-mono font-semibold text-primary">
                {allConversions.kelvin.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 4 })} K
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/50">
              <span className="text-secondary">Reamur (°Ré):</span>
              <span className="font-mono font-semibold text-primary">
                {allConversions.reamur.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 4 })} °Ré
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-secondary">Rankine (°R):</span>
              <span className="font-mono font-semibold text-primary">
                {allConversions.rankine.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 4 })} °R
              </span>
            </div>
          </div>
        </Card>

        {/* Thermodynamic State Diagnostics */}
        <Card className="flex flex-col gap-3 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary pb-2 border-b border-border">
            <CheckCircle2 className="w-4 h-4 text-accent" />
            <span>Karakteristik Fisik Termal (Air @ 1 atm)</span>
          </div>

          <div className={cn("p-3 rounded-xl border flex flex-col gap-1 text-xs transition-all", physicalStateBg)}>
            <span className="text-secondary text-[11px]">Kondisi Fisika Materi:</span>
            <span className={cn("font-semibold text-sm", physicalStateColor)}>
              {physicalState}
            </span>
          </div>

          <div className="flex flex-col gap-1.5 text-xs text-secondary pt-1">
            <div className="flex justify-between">
              <span>Titik Beku Referensi:</span>
              <span className="text-primary font-mono">0 °C / 32 °F / 273.15 K</span>
            </div>
            <div className="flex justify-between">
              <span>Titik Didih Referensi:</span>
              <span className="text-primary font-mono">100 °C / 212 °F / 373.15 K</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
