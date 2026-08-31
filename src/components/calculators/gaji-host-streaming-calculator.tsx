"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import { RotateCcw, Wallet, Info } from "lucide-react";
import { useQueryState, parseAsFloat, parseAsString } from "nuqs";

type PlatformType = "tiktok" | "bigo" | "snack";

const PLATFORM_CONFIGS: Record<PlatformType, { name: string; poinName: string; rate: number }> = {
  tiktok: { name: "TikTok", poinName: "Diamonds", rate: 200 },
  bigo: { name: "Bigo Live", poinName: "Beans", rate: 210 },
  snack: { name: "Snack Video", poinName: "Diamonds", rate: 100 },
};

export function GajiHostStreamingCalculator() {
  const [platform, setPlatform] = useQueryState("platform", parseAsString.withDefault("tiktok"));
  const [jumlahPoin, setJumlahPoin] = useQueryState("poin", parseAsFloat.withDefault(10000));
  const [agencyCut, setAgencyCut] = useQueryState("cut", parseAsFloat.withDefault(10));
  const [usdRate, setUsdRate] = useQueryState("usd", parseAsFloat.withDefault(15500));

  const currentPlatform = (PLATFORM_CONFIGS[platform as PlatformType] ? platform : "tiktok") as PlatformType;
  const config = PLATFORM_CONFIGS[currentPlatform];

  const safePoin = jumlahPoin ?? 0;
  const safeCut = agencyCut ?? 0;
  const safeUsd = usdRate ?? 15500;

  const grossUsd = safePoin / config.rate;
  const potonganUsd = grossUsd * (safeCut / 100);
  const netUsd = grossUsd - potonganUsd;

  const netIdr = netUsd * safeUsd;
  const potonganIdr = potonganUsd * safeUsd;

  const handleReset = () => {
    setPlatform("tiktok");
    setJumlahPoin(10000);
    setAgencyCut(10);
    setUsdRate(15500);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6 p-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">Parameter Penghasilan</h2>
                <p className="text-secondary text-sm">Hitung konversi {config.poinName} ke uang tunai</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <Select
              label="Platform Streaming"
              value={currentPlatform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              <option value="tiktok">TikTok (200 Diamonds = $1)</option>
              <option value="bigo">Bigo Live (210 Beans = $1)</option>
              <option value="snack">Snack Video (100 Diamonds = $1)</option>
            </Select>

            <Input
              label={`Jumlah ${config.poinName}`}
              type="number"
              value={jumlahPoin ?? ""}
              onChange={(e) => setJumlahPoin(e.target.value ? parseFloat(e.target.value) : null)}
              placeholder={`Masukkan jumlah ${config.poinName}`}
            />

            <Input
              label="Potongan Agensi (%)"
              type="number"
              value={agencyCut ?? ""}
              onChange={(e) => setAgencyCut(e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="Contoh: 10"
              suffix="%"
            />

            <Input
              label="Kurs USD ke IDR"
              type="number"
              value={usdRate ?? ""}
              onChange={(e) => setUsdRate(e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="Contoh: 15500"
              prefix="Rp"
            />
          </div>
        </Card>
        
        <Card className="bg-surface/50 border-border/60 text-secondary text-xs leading-relaxed flex items-start gap-3 p-4">
          <Info className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-primary block mb-0.5">
              Info Kurs Platform
            </span>
            Nilai konversi koin ke USD merupakan standar baku masing-masing platform (TikTok 200:1, Bigo 210:1, Snack 100:1). Kurs penarikan ke rupiah bisa bervariasi bergantung pada bank atau e-wallet tujuan.
          </div>
        </Card>
      </div>

      <div className="lg:col-span-5 flex flex-col gap-6">
        <OutputBox
          label="Take Home Pay (IDR)"
          value={netIdr}
          prefix="Rp "
        />
        <OutputBox
          label="Take Home Pay (USD)"
          value={netUsd}
          decimals={2}
          prefix="$ "
        />
        <OutputBox
          label="Total Potongan Agensi (IDR)"
          value={potonganIdr}
          prefix="Rp "
        />
      </div>
    </div>
  );
}