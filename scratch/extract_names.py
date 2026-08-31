import re
import json

slugs = ['numerologi-nama', 'biaya-bbm-perjalanan', 'jet-lag-zona-waktu', 'kompensasi-delay-pesawat']
for slug in slugs:
    with open(f'src/components/calculators/{slug}-calculator.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
        match = re.search(r'export\s+(?:default\s+)?function\s+([A-Za-z0-9_]+)', content)
        if match:
            print(f"{slug} -> {match.group(1)}")
