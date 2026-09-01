"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import { parseAsFloat, parseAsInteger, useQueryState } from "nuqs";

export function KomisiMarketplaceCalculator() {
  const [hargaJual, setHargaJual] = useQueryState("harga", parseAsInteger.withDefault(500000));
  const [persenAdmin, setPersenAdmin] = useQueryState("admin", parseAsFloat.withDefault(4.5)); // Rata-rata Tokped/Shopee non-star
  const [bebanFreeOngkir, setBebanFreeOngkir] = useQueryState("bebasongkir", parseAsFloat.withDefault(3.0)); // Beban fitur gratis ongkir
  
  const [ikutGratisOngkir, setIkutGratisOngkir] = useQueryState("ikut", { defaultValue: "ya" });

  const result = useMemo(() => {
    // Potongan Admin Dasar
    const potonganAdmin = hargaJual * (persenAdmin / 100);
    
    // Potongan Layanan Gratis Ongkir
    const potonganGratisOngkir = ikutGratisOngkir === "ya" ? hargaJual * (bebanFreeOngkir / 100) : 0;
    
    // Total Potongan
    const totalPotongan = potonganAdmin + potonganGratisOngkir;
    
    // Uang Diterima Penjual
    const saldoDiterima = hargaJual - totalPotongan;

    return {
      potonganAdmin,
      potonganGratisOngkir,
      totalPotongan,
      saldoDiterima
    };
  }, [hargaJual, persenAdmin, bebanFreeOngkir, ikutGratisOngkir]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6 flex flex-col gap-6">
        
        <div className="space-y-4">
          <h4 className="font-semibold text-primary text-sm border-b pb-2">Detail Transaksi</h4>
          <div>
            <label className="block text-xs font-medium text-secondary mb-2">Harga Jual Barang (Rp)</label>
            <Input type="number" value={hargaJual || ""} onChange={(e) => setHargaJual(Number(e.target.value))} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Biaya Admin Platform (%)</label>
              <Input type="number" value={persenAdmin || ""} onChange={(e) => setPersenAdmin(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Fitur Bebas Ongkir (%)</label>
              <Input type="number" value={bebanFreeOngkir || ""} onChange={(e) => setBebanFreeOngkir(Number(e.target.value))} />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Ikut Program Gratis Ongkir?</label>
            <Select value={ikutGratisOngkir} onChange={(e) => setIkutGratisOngkir(e.target.value)} className="w-full">
              <option value="ya">Ya, ikut (Terkena potongan ekstra)</option>
              <option value="tidak">Tidak ikut (Pembeli bayar ongkir full)</option>
            </Select>
          </div>
        </div>

      </Card>
      
      <Card className="p-6 flex flex-col gap-6 bg-surface/50 border-accent/20">
        <h3 className="text-lg font-semibold text-primary">Saldo Masuk (Net Seller)</h3>
        
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary text-sm">Biaya Admin ({persenAdmin}%)</span>
            <span className="text-danger font-medium">- Rp {Math.ceil(result.potonganAdmin).toLocaleString("id-ID")}</span>
          </div>
          {ikutGratisOngkir === "ya" && (
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-secondary text-sm">Layanan Bebas Ongkir ({bebanFreeOngkir}%)</span>
              <span className="text-danger font-medium">- Rp {Math.ceil(result.potonganGratisOngkir).toLocaleString("id-ID")}</span>
            </div>
          )}
          <div className="flex justify-between items-center pb-2 border-b border-border bg-danger/10 p-2 rounded">
            <span className="text-danger font-semibold text-sm">Total Potongan Marketplace</span>
            <span className="font-bold text-danger">Rp {Math.ceil(result.totalPotongan).toLocaleString("id-ID")}</span>
          </div>
        </div>
        
        <OutputBox 
          label="Saldo Diterima ke Rekening" 
          value={Math.ceil(result.saldoDiterima)} 
          prefix="Rp "
        />
        
        <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg text-primary text-sm">
          <strong>Insight Rekber:</strong> Jika Anda menjual barang second dari grup Facebook/OLX lewat <em>link marketplace</em> kuning/hijau (sebagai rekber aman), jangan lupa menaikkan harga sebesar <strong>{ikutGratisOngkir === "ya" ? persenAdmin + bebanFreeOngkir : persenAdmin}%</strong> agar Anda tidak rugi nombok admin.
        </div>
      </Card>
    </div>
  );
}
