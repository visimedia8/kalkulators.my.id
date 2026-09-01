"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import { parseAsInteger, useQueryState } from "nuqs";

export function KemitraanMinimarketCalculator() {
  const [modalAwal, setModalAwal] = useQueryState("modal", parseAsInteger.withDefault(400000000));
  const [salesHarian, setSalesHarian] = useQueryState("sales", parseAsInteger.withDefault(10000000));
  const [marginKotor, setMarginKotor] = useQueryState("margin", parseAsInteger.withDefault(12)); // Persen margin rata-rata
  const [tipeRoyalti, setTipeRoyalti] = useQueryState("royalti", { defaultValue: "bertingkat" });

  const result = useMemo(() => {
    // 1. Omzet & Margin
    const omzetBulanan = salesHarian * 30;
    const labaKotorBulanan = omzetBulanan * (marginKotor / 100);

    // 2. Royalti Fee
    let royaltiFee = 0;
    if (tipeRoyalti === "flat2") {
      royaltiFee = labaKotorBulanan * 0.02; // Flat 2% dr laba kotor
    } else {
      // Simulasi Sistem Bertingkat khas minimarket besar:
      // Penjualan < 150jt = 0%
      // 150jt - 175jt = 10% dari selisih
      // 175jt - 200jt = 15% dari selisih
      // > 200jt = 20%
      let o = omzetBulanan;
      if (o > 200000000) {
        royaltiFee += (o - 200000000) * 0.20;
        o = 200000000;
      }
      if (o > 175000000) {
        royaltiFee += (o - 175000000) * 0.15;
        o = 175000000;
      }
      if (o > 150000000) {
        royaltiFee += (o - 150000000) * 0.10;
      }
    }

    // 3. Opex Toko (Asumsi standar)
    // Gaji 6 karyawan @ 3jt, Listrik 4jt, Internet & Lain 2jt -> ~24jt
    const opexBulanan = 24000000;

    // 4. Laba Bersih
    const labaSebelumPajak = labaKotorBulanan - royaltiFee - opexBulanan;
    const labaBersih = labaSebelumPajak > 0 ? labaSebelumPajak * 0.9 : labaSebelumPajak; // Asumsi pajak final dll
    
    const bepBulan = labaBersih > 0 ? modalAwal / labaBersih : 0;

    return {
      omzetBulanan,
      labaKotorBulanan,
      royaltiFee,
      opexBulanan,
      labaBersih,
      bepBulan,
      isRugi: labaBersih <= 0
    };
  }, [modalAwal, salesHarian, marginKotor, tipeRoyalti]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6 flex flex-col gap-6">
        <div className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Nilai Investasi (Modal Awal Rp)</label>
            <Input type="number" value={modalAwal || ""} onChange={(e) => setModalAwal(Number(e.target.value))} />
            <p className="text-xs text-secondary mt-1">Estimasi biaya lisensi, renovasi, dan stok barang pembuka.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Target Penjualan Harian (Rp)</label>
            <Input type="number" value={salesHarian || ""} onChange={(e) => setSalesHarian(Number(e.target.value))} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Skema Royalty Fee</label>
              <Select value={tipeRoyalti} onChange={(e) => setTipeRoyalti(e.target.value)} className="w-full">
                <option value="bertingkat">Bertingkat (Omzet)</option>
                <option value="flat2">Flat 2% (Laba Kotor)</option>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Margin Kotor (% rata-rata)</label>
              <Input type="number" value={marginKotor || ""} onChange={(e) => setMarginKotor(Number(e.target.value))} max={40} />
            </div>
          </div>
          
        </div>
      </Card>
      
      <Card className="p-6 flex flex-col gap-6 bg-surface/50 border-accent/20">
        <h3 className="text-lg font-semibold text-primary">Proyeksi Passive Income Mitra</h3>
        
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Omzet Toko Bulanan</span>
            <span className="text-primary font-medium">Rp {result.omzetBulanan.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Laba Kotor (Margin {marginKotor}%)</span>
            <span className="text-primary font-medium">Rp {result.labaKotorBulanan.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Royalti Fee Pusat</span>
            <span className="text-danger font-medium">- Rp {result.royaltiFee.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Opex Toko (Estimasi Gaji, Listrik)</span>
            <span className="text-danger font-medium">- Rp {result.opexBulanan.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border bg-accent/10 p-2 rounded">
            <span className="text-primary font-semibold text-sm">Passive Income Bersih / Bulan</span>
            <span className={`font-bold ${result.isRugi ? "text-danger" : "text-primary"}`}>
              Rp {result.labaBersih.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
        
        <OutputBox 
          label={result.isRugi ? "Toko Merugi" : "Estimasi BEP / Balik Modal"} 
          value={result.isRugi ? 0 : result.bepBulan} 
          decimals={1}
          suffix=" Bulan"
        />
        
        <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg text-primary text-sm">
          <strong>Catatan:</strong> Kalkulasi ini bersifat simulasi kasar berdasarkan margin rata-rata ritel dan belum memperhitungkan <em>shrinkage</em> (barang hilang/rusak) secara spesifik.
        </div>
      </Card>
    </div>
  );
}
