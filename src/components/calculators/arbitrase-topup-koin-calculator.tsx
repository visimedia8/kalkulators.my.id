"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Calculator, RefreshCw, Coins } from "lucide-react";
import { useQueryState, parseAsInteger } from "nuqs";

export function ArbitraseTopupKoinCalculator() {
  // State Input (URL Synced)
  const [jumlahKoin, setJumlahKoin] = useQueryState(
    "jumlahKoin",
    parseAsInteger.withDefault(100)
  );

  // State Output
  const [appStorePrice, setAppStorePrice] = React.useState<number>(0);
  const [webPrice, setWebPrice] = React.useState<number>(0);
  const [totalSavings, setTotalSavings] = React.useState<number>(0);

  const calculateArbitrase = React.useCallback(() => {
    const koin = Math.max(0, jumlahKoin || 0);

    // Formula sesuai spesifikasi
    const calcAppStorePrice = koin * 250;
    const calcWebPrice = koin * 170;
    const calcTotalSavings = calcAppStorePrice - calcWebPrice;

    setAppStorePrice(calcAppStorePrice);
    setWebPrice(calcWebPrice);
    setTotalSavings(calcTotalSavings);
  }, [jumlahKoin]);

  // Auto calculate on initial load & dependency changes
  React.useEffect(() => {
    calculateArbitrase();
  }, [calculateArbitrase]);

  const handleReset = () => {
    setJumlahKoin(null);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form Input Section */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Top-Up Koin
                </h2>
                <p className="text-secondary text-sm">
                  Hitung metrik perbandingan harga secara real-time
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset parameter teknis"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <Input
              label="Target Koin"
              type="number"
              min={1}
              step={1}
              value={jumlahKoin || ""}
              onChange={(e) => setJumlahKoin(Number(e.target.value))}
              suffix="Koin"
              helperText={`Jumlah koin virtual yang ingin dibeli`}
            />
          </div>

          <div className="pt-2">
            <Button
              onClick={calculateArbitrase}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Hitung Selisih Presisi
            </Button>
          </div>
        </Card>
      </div>

      {/* Output Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <OutputBox
          label="Total Uang Dihemat"
          value={totalSavings}
          prefix="Rp "
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <OutputBox
            label="Harga App/Play Store"
            value={appStorePrice}
            prefix="Rp "
          />
          <OutputBox
            label="Harga Web Resmi"
            value={webPrice}
            prefix="Rp "
          />
        </div>
      </div>
    </div>
  );
}