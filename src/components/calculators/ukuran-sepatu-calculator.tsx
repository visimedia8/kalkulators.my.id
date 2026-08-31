"use client";

import React from "react";
import { useQueryState, parseAsString } from "nuqs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";

export function UkuranSepatuCalculator() {
  const [panjangKakiStr, setPanjangKaki] = useQueryState(
    "panjangKaki",
    parseAsString.withDefault("26")
  );
  const [gender, setGender] = useQueryState(
    "gender",
    parseAsString.withDefault("Pria")
  );

  const panjangKaki = parseFloat(panjangKakiStr) || 0;

  // Formula konversi presisi standar industri
  const eu = panjangKaki > 0 ? panjangKaki / 0.667 : 0;
  const jp = panjangKaki > 0 ? panjangKaki : 0;
  
  const usMen = (panjangKaki / 2.54) * 3 - 22;
  const ukMen = usMen - 1;
  const usWomen = (panjangKaki / 2.54) * 3 - 21;
  const ukWomen = usWomen - 2;

  const us = panjangKaki > 0 ? (gender === "Pria" ? Math.max(0, usMen) : Math.max(0, usWomen)) : 0;
  const uk = panjangKaki > 0 ? (gender === "Pria" ? Math.max(0, ukMen) : Math.max(0, ukWomen)) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Panjang Kaki"
            type="number"
            value={panjangKakiStr}
            onChange={(e) => setPanjangKaki(e.target.value)}
            suffix="cm"
            placeholder="Masukkan parameter panjang kaki"
          />
          <Select
            label="Jenis Kelamin"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="Pria">Pria</option>
            <option value="Wanita">Wanita</option>
          </Select>
          <div className="col-span-1 md:col-span-2 pt-2">
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={() => {
                setPanjangKaki("26");
                setGender("Pria");
              }}
            >
              Reset Parameter
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <OutputBox label="Ukuran EU" value={eu} decimals={1} />
        <OutputBox label="Ukuran US" value={us} decimals={1} />
        <OutputBox label="Ukuran UK" value={uk} decimals={1} />
        <OutputBox label="Ukuran JP" value={jp} decimals={1} suffix=" cm" />
      </div>
    </div>
  );
}
