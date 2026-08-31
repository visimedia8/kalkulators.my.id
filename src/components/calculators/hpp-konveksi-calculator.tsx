'use client';

import React from 'react';
import { useQueryState, parseAsFloat } from 'nuqs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OutputBox } from '@/components/ui/output-box';

export function HppKonveksiCalculator() {
  const [biayaKain, setBiayaKain] = useQueryState('biayaKain', parseAsFloat.withDefault(0));
  const [biayaAksesoris, setBiayaAksesoris] = useQueryState('biayaAksesoris', parseAsFloat.withDefault(0));
  const [ongkosJahit, setOngkosJahit] = useQueryState('ongkosJahit', parseAsFloat.withDefault(0));
  const [ongkosPotong, setOngkosPotong] = useQueryState('ongkosPotong', parseAsFloat.withDefault(0));
  const [biayaLain, setBiayaLain] = useQueryState('biayaLain', parseAsFloat.withDefault(0));
  const [marginTarget, setMarginTarget] = useQueryState('marginTarget', parseAsFloat.withDefault(0));

  const hpp = biayaKain + biayaAksesoris + ongkosJahit + ongkosPotong + biayaLain;
  const hargaJual = hpp + (hpp * (marginTarget / 100));
  const laba = hargaJual - hpp;

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleReset = () => {
    setBiayaKain(0);
    setBiayaAksesoris(0);
    setOngkosJahit(0);
    setOngkosPotong(0);
    setBiayaLain(0);
    setMarginTarget(0);
  };

  return (
    <Card className="p-6 space-y-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <Input 
          label="Biaya Kain per Pcs (Rp)"
          type="number" 
          value={biayaKain || ''} 
          onChange={(e) => setBiayaKain(parseFloat(e.target.value) || 0)}
          placeholder="0"
        />
        <Input 
          label="Biaya Aksesoris per Pcs (Rp)"
          type="number" 
          value={biayaAksesoris || ''} 
          onChange={(e) => setBiayaAksesoris(parseFloat(e.target.value) || 0)}
          placeholder="0"
        />
        <Input 
          label="Ongkos Jahit per Pcs (Rp)"
          type="number" 
          value={ongkosJahit || ''} 
          onChange={(e) => setOngkosJahit(parseFloat(e.target.value) || 0)}
          placeholder="0"
        />
        <Input 
          label="Ongkos Potong per Pcs (Rp)"
          type="number" 
          value={ongkosPotong || ''} 
          onChange={(e) => setOngkosPotong(parseFloat(e.target.value) || 0)}
          placeholder="0"
        />
        <Input 
          label="Biaya Lain-lain (Rp)"
          type="number" 
          value={biayaLain || ''} 
          onChange={(e) => setBiayaLain(parseFloat(e.target.value) || 0)}
          placeholder="0"
        />
        <Input 
          label="Target Margin (%)"
          type="number" 
          value={marginTarget || ''} 
          onChange={(e) => setMarginTarget(parseFloat(e.target.value) || 0)}
          placeholder="0"
        />
      </div>

      <div className="space-y-4 pt-4 border-t">
        <OutputBox label="Harga Pokok Produksi (HPP)" value={hpp} prefix="Rp " />
        <OutputBox label="Rekomendasi Harga Jual" value={hargaJual} prefix="Rp " />
        <OutputBox label="Estimasi Laba per Pcs" value={laba} prefix="Rp " />
      </div>

      <Button onClick={handleReset} variant="secondary" className="w-full">
        Reset Kalkulator
      </Button>
    </Card>
  );
}
