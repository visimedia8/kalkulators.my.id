import re

registry_path = 'src/components/calculators/calculator-registry.ts'
with open(registry_path, 'r', encoding='utf-8') as f:
    content = f.read()

batch13_str = """
  // Batch 13
  'gaji-host-streaming': dynamic(() => import('./gaji-host-streaming-calculator').then(mod => mod.GajiHostStreamingCalculator)),
  'sultan-sniper-pk': dynamic(() => import('./sultan-sniper-pk-calculator').then(mod => mod.SultanSniperPkCalculator)),
  'arbitrase-topup-koin': dynamic(() => import('./arbitrase-topup-koin-calculator').then(mod => mod.ArbitraseTopupKoinCalculator)),
  'kerugian-arisan-gift': dynamic(() => import('./kerugian-arisan-gift-calculator').then(mod => mod.KerugianArisanGiftCalculator)),
  'target-harian-agency': dynamic(() => import('./target-harian-agency-calculator').then(mod => mod.TargetHarianAgencyCalculator)),
"""

if '// Batch 13' not in content:
    content = content.replace('};', batch13_str + '};')
    with open(registry_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("calculator-registry.ts updated")
