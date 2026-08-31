import os

seed_path = r"scripts\seed.ts"

with open(seed_path, "r", encoding="utf-8") as f:
    content = f.read()

# The incorrect records are at the very end. Let's find them.
marker = "  // -- BATCH 12 NEW CALCULATORS --"
idx = content.find(marker)
if idx != -1:
    records = content[idx:]
    content = content[:idx] # remove from end
    
    # find where to insert
    insert_marker = "  await seedContent(numerologiNamaCalc.id,"
    insert_idx = content.find(insert_marker)
    
    if insert_idx != -1:
        content = content[:insert_idx] + records.strip() + "\n\n" + content[insert_idx:]
        
    with open(seed_path, "w", encoding="utf-8") as f:
        f.write(content)
        print("seed.ts fixed")
else:
    print("marker not found")
