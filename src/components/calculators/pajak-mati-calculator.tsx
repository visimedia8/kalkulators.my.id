"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import { parseAsInteger, useQueryState } from "nuqs";

export function PajakMatiCalculator() {
  const [pkb, setPkb] = useQueryState("pkb", parseAsInteger.withDefault(300000));
  const [jenis, setJenis] = useQueryState("jenis", { defaultValue: "motor" });
  const [telatTahun, setTelatTahun] = useQueryState("telatTahun", parseAsInteger.withDefault(2));

  const result = useMemo(() => {
    const swdklljPokok = jenis === "motor" ? 35000 : 143000;
    const swdklljDenda = jenis === "motor" ? 32000 : 100000;
    const pajakBerjalan = pkb + swdklljPokok;

    if (telatTahun <= 0) {
      return { pokokTunggakan: 0, dendaPkb: 0, dendaSwdkllj: 0, pajakBerjalan, total: pajakBerjalan };
    }

    const pokokTunggakanTotal = (pkb * telatTahun) + (swdklljPokok * telatTahun);
    const dendaPkbTotal = pkb * 0.25 * telatTahun;
    const dendaSwdklljTotal = swdklljDenda * telatTahun;
    const total = pajakBerjalan + pokokTunggakanTotal + dendaPkbTotal + dendaSwdklljTotal;

    return {
      pokokTunggakan: pokokTunggakanTotal,
      dendaPkb: dendaPkbTotal,
      dendaSwdkllj: dendaSwdklljTotal,
      pajakBerjalan,
      total
    };
  }, [pkb, jenis, telatTahun]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6 flex flex-col gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Jenis Kendaraan</label>
            <Select value={jenis} onChange={(e) => setJenis(e.target.value)} className="w-full">
              <option value="motor">Sepeda Motor</option>
              <option value="mobil">Mobil</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">PKB Pokok (Tertera di STNK) - Rp</label>
            <Input type="number" value={pkb || ""} onChange={(e) => setPkb(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Lama Menunggak (Tahun)</label>
            <Input type="number" value={telatTahun || ""} onChange={(e) => setTelatTahun(Number(e.target.value))} min={0} />
          </div>
        </div>
      </Card>
      <Card className="p-6 flex flex-col gap-6 bg-surface/50 border-accent/20">
        <h3 className="text-lg font-semibold text-primary">Estimasi Biaya Perpanjangan</h3>
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Pajak Tahun Berjalan</span>
            <span className="text-primary font-medium">Rp {result.pajakBerjalan.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Pokok Tunggakan ({telatTahun} Thn)</span>
            <span className="text-danger font-medium">+ Rp {result.pokokTunggakan.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Denda PKB (Estimasi 25%/thn)</span>
            <span className="text-danger font-medium">+ Rp {result.dendaPkb.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Denda SWDKLLJ</span>
            <span className="text-danger font-medium">+ Rp {result.dendaSwdkllj.toLocaleString("id-ID")}</span>
          </div>
        </div>
        <OutputBox label="Total Estimasi yang Harus Dibayar" value={result.total} prefix="Rp " />
      </Card>
    </div>
  );
}
