"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OutputBox } from "@/components/ui/output-box";
import { parseAsInteger, useQueryState } from "nuqs";

export function RoiFranchiseFbCalculator() {
  const [franchiseFee, setFranchiseFee] = useQueryState("fee", parseAsInteger.withDefault(50000000));
  const [sewaRuko, setSewaRuko] = useQueryState("sewa", parseAsInteger.withDefault(40000000));
  const [renovasiAlat, setRenovasiAlat] = useQueryState("alat", parseAsInteger.withDefault(30000000));
  
  const [hargaJual, setHargaJual] = useQueryState("harga", parseAsInteger.withDefault(10000));
  const [cogsPersen, setCogsPersen] = useQueryState("cogs", parseAsInteger.withDefault(45)); // HPP Bahan baku 45%
  const [targetCupHarian, setTargetCupHarian] = useQueryState("cup", parseAsInteger.withDefault(100));
  
  const [gajiKaryawan, setGajiKaryawan] = useQueryState("gaji", parseAsInteger.withDefault(4000000)); // Total gaji
  const [opsLain, setOpsLain] = useQueryState("ops", parseAsInteger.withDefault(1500000)); // Listrik air dll

  const result = useMemo(() => {
    // 1. Total CAPEX (Capital Expenditure / Modal Awal)
    const totalModal = franchiseFee + sewaRuko + renovasiAlat;

    // 2. Pendapatan & HPP Bulanan (Asumsi 30 hari)
    const omzetBulanan = hargaJual * targetCupHarian * 30;
    const hppBulanan = omzetBulanan * (cogsPersen / 100);
    const labaKotorBulanan = omzetBulanan - hppBulanan;

    // 3. OPEX (Operating Expenses Bulanan)
    // Sewa ruko dibagi 12 untuk pembebanan bulanan
    const bebanSewaBulanan = sewaRuko / 12;
    const totalOpexBulanan = bebanSewaBulanan + gajiKaryawan + opsLain;

    // 4. Laba Bersih & BEP
    const labaBersihBulanan = labaKotorBulanan - totalOpexBulanan;
    const bepBulan = labaBersihBulanan > 0 ? (totalModal / labaBersihBulanan) : 0;

    return {
      totalModal,
      omzetBulanan,
      labaKotorBulanan,
      totalOpexBulanan,
      labaBersihBulanan,
      bepBulan,
      isRugi: labaBersihBulanan <= 0
    };
  }, [franchiseFee, sewaRuko, renovasiAlat, hargaJual, cogsPersen, targetCupHarian, gajiKaryawan, opsLain]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6 flex flex-col gap-6">
        
        <div className="space-y-4">
          <h4 className="font-semibold text-primary text-sm border-b pb-2">1. Biaya Investasi Awal (CAPEX)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Franchise Fee (Rp)</label>
              <Input type="number" value={franchiseFee || ""} onChange={(e) => setFranchiseFee(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Sewa Ruko/Thn (Rp)</label>
              <Input type="number" value={sewaRuko || ""} onChange={(e) => setSewaRuko(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Renov & Alat (Rp)</label>
              <Input type="number" value={renovasiAlat || ""} onChange={(e) => setRenovasiAlat(Number(e.target.value))} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-primary text-sm border-b pb-2">2. Proyeksi Penjualan & HPP</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Harga Jual /Cup</label>
              <Input type="number" value={hargaJual || ""} onChange={(e) => setHargaJual(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">HPP Bahan (%)</label>
              <Input type="number" value={cogsPersen || ""} onChange={(e) => setCogsPersen(Number(e.target.value))} max={100} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Target Jual/Hari</label>
              <Input type="number" value={targetCupHarian || ""} onChange={(e) => setTargetCupHarian(Number(e.target.value))} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-primary text-sm border-b pb-2">3. Biaya Operasional / Bulan (OPEX)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Total Gaji Karyawan (Rp)</label>
              <Input type="number" value={gajiKaryawan || ""} onChange={(e) => setGajiKaryawan(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Listrik, Air, Dll (Rp)</label>
              <Input type="number" value={opsLain || ""} onChange={(e) => setOpsLain(Number(e.target.value))} />
            </div>
          </div>
        </div>

      </Card>
      
      <Card className="p-6 flex flex-col gap-6 bg-surface/50 border-accent/20">
        <h3 className="text-lg font-semibold text-primary">Analisis Kelayakan Bisnis (ROI)</h3>
        
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Total Modal Awal (Sewa 1 Thn)</span>
            <span className="text-primary font-medium">Rp {result.totalModal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Omzet Bulanan (Kotor)</span>
            <span className="text-primary font-medium">Rp {result.omzetBulanan.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Laba Kotor Bulanan (Stlh Bahan)</span>
            <span className="text-primary font-medium">Rp {result.labaKotorBulanan.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Total Beban Operasional/Bln</span>
            <span className="text-danger font-medium">- Rp {result.totalOpexBulanan.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border bg-accent/10 p-2 rounded">
            <span className="text-primary font-semibold text-sm">Laba Bersih Bulanan (Nett)</span>
            <span className={`font-bold ${result.isRugi ? "text-danger" : "text-primary"}`}>
              Rp {result.labaBersihBulanan.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
        
        <OutputBox 
          label={result.isRugi ? "Bisnis Rugi / Gagal BEP" : "Payback Period (Balik Modal Dalam)"} 
          value={result.isRugi ? 0 : result.bepBulan} 
          decimals={1}
          suffix=" Bulan"
        />
        
        {result.isRugi && (
          <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm">
            Hati-hati! Target penjualan Anda terlalu rendah atau biaya operasional terlalu bengkak. Bisnis ini akan membakar uang (Burn Rate) setiap bulannya.
          </div>
        )}
      </Card>
    </div>
  );
}
