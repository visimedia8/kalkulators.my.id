'use client';

import React from 'react';
import { useQueryState, parseAsFloat } from 'nuqs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { OutputBox } from '@/components/ui/output-box';

export function TeganganSenarCalculator() {
  const [frekuensi, setFrekuensi] = useQueryState(
    'frekuensi',
    parseAsFloat.withDefault(82.41)
  );
  const [scaleLength, setScaleLength] = useQueryState(
    'scaleLength',
    parseAsFloat.withDefault(25.5)
  );
  const [unitWeight, setUnitWeight] = useQueryState(
    'unitWeight',
    parseAsFloat.withDefault(0.000244)
  );

  const calculateTension = () => {
    if (frekuensi > 0 && scaleLength > 0 && unitWeight > 0) {
      // Rumus: Tension (lbs) = (UnitWeight * (2 * ScaleLength * Frequency)^2) / 386.4
      return (unitWeight * Math.pow(2 * scaleLength * frekuensi, 2)) / 386.4;
    }
    return 0;
  };

  const tensionLbs = calculateTension();

  return (
    <Card className="p-6 w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Input
            label="Frekuensi (Hz)"
            type="number"
            value={frekuensi ?? ''}
            onChange={(e) => setFrekuensi(e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="Contoh: 82.41 (Low E)"
            helperText="Parameter teknis frekuensi nada yang dituju."
          />
        </div>

        <div className="space-y-2">
          <Input
            label="Scale Length (inch)"
            type="number"
            value={scaleLength ?? ''}
            onChange={(e) => setScaleLength(e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="Contoh: 25.5"
            helperText="Jarak presisi dari nut ke saddle instrumen."
          />
        </div>

        <div className="space-y-2">
          <Input
            label="Unit Weight (lbs/in)"
            type="number"
            step="0.000001"
            value={unitWeight ?? ''}
            onChange={(e) => setUnitWeight(e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="Contoh: 0.000244"
            helperText="Massa senar per inci standar industri."
          />
        </div>
      </div>

      <div className="pt-4 border-t">
        <OutputBox
          label="Tegangan Senar (lbs)"
          value={tensionLbs > 0 ? tensionLbs : 0}
          decimals={2}
        />
      </div>
    </Card>
  );
}
