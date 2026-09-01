"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OutputBox } from "@/components/ui/output-box";
import { parseAsInteger, useQueryState } from "nuqs";

export function ShuKoperasiCalculator() {
  const [totalShu, setTotalShu] = useQueryState("shu", parseAsInteger.withDefault(100000000));
  const [persenJasaModal, setPersenJasaModal] = useQueryState("pjmodal", parseAsInteger.withDefault(20));
  const [persenJasaAnggota, setPersenJasaAnggota] = useQueryState("pjanggota", parseAsInteger.withDefault(25));
  
  const [totalSimpananKoperasi, setTotalSimpananKoperasi] = useQueryState("simpanankop", parseAsInteger.withDefault(500000000));
  const [totalTransaksiKoperasi, setTotalTransaksiKoperasi] = useQueryState("transaksikop", parseAsInteger.withDefault(1000000000));
  
  const [simpananAnggota, setSimpananAnggota] = useQueryState("simpanan", parseAsInteger.withDefault(5000000));
  const [transaksiAnggota, setTransaksiAnggota] = useQueryState("transaksi", parseAsInteger.withDefault(10000000));

  const result = useMemo(() => {
    // 1. Alokasi Total Dana
    const danaJasaModal = totalShu * (persenJasaModal / 100);
    const danaJasaAnggota = totalShu * (persenJasaAnggota / 100);
    
    // 2. Hak SHU Anggota Pribadi
    let shuModalPribadi = 0;
    if (totalSimpananKoperasi > 0) {
      shuModalPribadi = (simpananAnggota / totalSimpananKoperasi) * danaJasaModal;
    }
    
    let shuTransaksiPribadi = 0;
    if (totalTransaksiKoperasi > 0) {
      shuTransaksiPribadi = (transaksiAnggota / totalTransaksiKoperasi) * danaJasaAnggota;
    }
    
    const totalShuPribadi = shuModalPribadi + shuTransaksiPribadi;

    return {
      danaJasaModal,
      danaJasaAnggota,
      shuModalPribadi,
      shuTransaksiPribadi,
      totalShuPribadi
    };
  }, [totalShu, persenJasaModal, persenJasaAnggota, totalSimpananKoperasi, totalTransaksiKoperasi, simpananAnggota, transaksiAnggota]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6 flex flex-col gap-6">
        
        <div className="space-y-4">
          <h4 className="font-semibold text-primary text-sm border-b pb-2">Data Keuangan Koperasi (RAT)</h4>
          <div>
            <label className="block text-xs font-medium text-secondary mb-2">Total Laba/SHU Koperasi (Rp)</label>
            <Input type="number" value={totalShu || ""} onChange={(e) => setTotalShu(Number(e.target.value))} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Alokasi Jasa Modal (%)</label>
              <Input type="number" value={persenJasaModal || ""} onChange={(e) => setPersenJasaModal(Number(e.target.value))} max={100} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Alokasi Jasa Anggota (%)</label>
              <Input type="number" value={persenJasaAnggota || ""} onChange={(e) => setPersenJasaAnggota(Number(e.target.value))} max={100} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Total Simpanan Seluruh Anggota</label>
              <Input type="number" value={totalSimpananKoperasi || ""} onChange={(e) => setTotalSimpananKoperasi(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Total Omzet/Pinjaman Koperasi</label>
              <Input type="number" value={totalTransaksiKoperasi || ""} onChange={(e) => setTotalTransaksiKoperasi(Number(e.target.value))} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-primary text-sm border-b pb-2">Data Anggota Individu (Anda)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Simpanan Anda (Pokok+Wajib)</label>
              <Input type="number" value={simpananAnggota || ""} onChange={(e) => setSimpananAnggota(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Total Belanja/Pinjaman Anda</label>
              <Input type="number" value={transaksiAnggota || ""} onChange={(e) => setTransaksiAnggota(Number(e.target.value))} />
            </div>
          </div>
        </div>

      </Card>
      
      <Card className="p-6 flex flex-col gap-6 bg-surface/50 border-accent/20">
        <h3 className="text-lg font-semibold text-primary">Simulasi Perolehan SHU Anggota</h3>
        
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Dana Jasa Modal (Koperasi)</span>
            <span className="text-primary font-medium">Rp {result.danaJasaModal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Dana Jasa Anggota (Koperasi)</span>
            <span className="text-primary font-medium">Rp {result.danaJasaAnggota.toLocaleString("id-ID")}</span>
          </div>
          
          <div className="pt-4 mt-4">
            <h4 className="text-sm font-semibold text-primary mb-2">Hak Anda Pribadi:</h4>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Bagian dari Jasa Modal Anda</span>
            <span className="text-accent font-medium">+ Rp {Math.ceil(result.shuModalPribadi).toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Bagian dari Jasa Transaksi Anda</span>
            <span className="text-accent font-medium">+ Rp {Math.ceil(result.shuTransaksiPribadi).toLocaleString("id-ID")}</span>
          </div>
        </div>
        
        <OutputBox 
          label="Total SHU yang Diterima Anggota" 
          value={Math.ceil(result.totalShuPribadi)} 
          prefix="Rp "
        />
        
        <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg text-primary text-sm">
          <strong>Tip Koperasi:</strong> Semakin sering Anda bertransaksi/belanja di koperasi, dan semakin besar saldo simpanan wajib Anda, semakin besar pula porsi SHU yang akan dibagikan ke rekening Anda akhir tahun ini.
        </div>
      </Card>
    </div>
  );
}
