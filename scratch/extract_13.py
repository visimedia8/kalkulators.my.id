import re
import json

slugs = ['gaji-host-streaming', 'sultan-sniper-pk', 'arbitrase-topup-koin', 'kerugian-arisan-gift', 'target-harian-agency']
print("=== Slugs and Export Names ===")
imports = []
for slug in slugs:
    tsx_file = f'src/components/calculators/{slug}-calculator.tsx'
    try:
        with open(tsx_file, 'r', encoding='utf-8') as file:
            content = file.read()
            match = re.search(r'export\s+(?:default\s+)?function\s+([A-Za-z0-9_]+)', content)
            if match:
                export_name = match.group(1)
                print(f"{slug} -> {export_name}")
                imports.append(f"  '{slug}': dynamic(() => import('./{slug}-calculator').then(mod => mod.{export_name})),")
            else:
                print(f"{slug} -> NOT FOUND")
    except Exception as e:
        print(f"Error reading {tsx_file}: {e}")

print("\n// Batch 13")
print("\n".join(imports))
