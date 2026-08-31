import re

registry_path = 'src/components/calculators/calculator-registry.ts'
with open(registry_path, 'r', encoding='utf-8') as f:
    content = f.read()

batch12_str = """
  // Batch 12
  'numerologi-nama': dynamic(() => import('./numerologi-nama-calculator').then(mod => mod.NumerologiNamaCalculator)),
  'biaya-bbm-perjalanan': dynamic(() => import('./biaya-bbm-perjalanan-calculator').then(mod => mod.BiayaBbmPerjalananCalculator)),
  'jet-lag-zona-waktu': dynamic(() => import('./jet-lag-zona-waktu-calculator').then(mod => mod.JetLagZonaWaktuCalculator)),
  'kompensasi-delay-pesawat': dynamic(() => import('./kompensasi-delay-pesawat-calculator').then(mod => mod.KompensasiDelayPesawatCalculator)),
"""

if '// Batch 12' not in content:
    content = content.replace('};', batch12_str + '};')
    with open(registry_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("calculator-registry.ts updated")
