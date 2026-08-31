"use client";

import React, { useMemo } from "react";
import { useQueryState, parseAsInteger, parseAsFloat } from "nuqs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OutputBox } from "@/components/ui/output-box";
import { Button } from "@/components/ui/button";

export function KerugianArisanGiftCalculator() {
  const [koinDikirim, setKoinDikirim] = useQueryState(
    "koinDikirim",
    parseAsInteger.withDefault(1000)
  );
  const [hargaKoinBeli, setHargaKoinBeli] = useQueryState(
    "hargaKoinBeli",
    parseAsFloat.withDefault(170)
  );

  const {
    uangDiterimaKembali,
    netLoss,
    persentaseKerugian,
  } = useMemo(() => {
    const koin = koinDikirim ?? 0;
    const harga = hargaKoinBeli ?? 0;

    const modalBeliKoin = koin * harga;
    const pencairanUsd = koin / 200;
    const uangKembali = pencairanUsd * 15500;
    const loss = modalBeliKoin - uangKembali;
    const persentase = modalBeliKoin > 0 ? (loss / modalBeliKoin) * 100 : 0;

    return {
      uangDiterimaKembali: uangKembali > 0 ? uangKembali : 0,
      netLoss: loss > 0 ? loss : 0,
      persentaseKerugian: persentase > 0 ? persentase : 0,
    };
  }, [koinDikirim, hargaKoinBeli]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      <Card className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-primary">Parameter Teknis Kalkulasi</h2>
          <p className="text-sm text-secondary">
            Masukkan jumlah koin dan harga beli untuk menghitung persentase kerugian (recycling loss) secara real-time berdasarkan standar platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            type="number"
            label="Koin Dikirim (Masuk & Keluar)"
            helperText="Jumlah koin yang Anda kirimkan dan dibalas teman"
            value={koinDikirim === null ? "" : koinDikirim}
            onChange={(e) => setKoinDikirim(e.target.value ? parseInt(e.target.value) : 0)}
            suffix="Koin"
            min={0}
          />
          <Input
            type="number"
            label="Harga Beli Koin (IDR)"
            helperText="Modal beli per koin (standar Rp170)"
            value={hargaKoinBeli === null ? "" : hargaKoinBeli}
            onChange={(e) => setHargaKoinBeli(e.target.value ? parseFloat(e.target.value) : 0)}
            prefix="Rp"
            min={0}
            step="0.01"
          />
        </div>

        <div className="flex justify-end">
          <Button 
            variant="secondary" 
            onClick={() => {
              setKoinDikirim(1000);
              setHargaKoinBeli(170);
            }}
          >
            Reset Parameter
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OutputBox
          label="Uang Diterima Kembali"
          value={uangDiterimaKembali}
          prefix="Rp "
        />
        <OutputBox
          label="Kerugian Bersih (Net Loss)"
          value={netLoss}
          prefix="Rp "
          className="border-danger/30 bg-danger/5 text-danger"
        />
        <OutputBox
          label="Persentase Uang Hangus"
          value={persentaseKerugian}
          suffix="%"
          decimals={2}
          className="border-danger/30 bg-danger/5 text-danger"
        />
      </div>
    </div>
  );
}