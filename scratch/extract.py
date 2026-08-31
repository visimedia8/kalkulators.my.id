import json
import re
import os

conversations = [
    "ceb2c60f-53e8-4e59-afc0-c51a2695718f", # Waris
    "20c84248-65f6-4540-ace1-d2efc156c532", # Fidyah
    "498e0f61-75d2-450f-b788-25e265e16f02", # Zodiak
    "aa7ff33c-d198-43ab-8fdf-84b14e0e8c24", # Split Bill
    "e30613e9-9e8f-4102-b735-873905ab9240"  # Budget Pernikahan
]

base_dir = r"C:\Users\johan\.gemini\antigravity\brain"
workspace_dir = r"E:\general workspace\kalkulators.my.id"

for cid in conversations:
    log_file = os.path.join(base_dir, cid, ".system_generated", "logs", "transcript_full.jsonl")
    if not os.path.exists(log_file):
        print(f"Skipping {cid}, file not found")
        continue

    content = ""
    with open(log_file, "r", encoding="utf-8") as f:
        for line in f:
            data = json.loads(line)
            if data.get("type") == "PLANNER_RESPONSE":
                text = data.get("content", "")
                if "```tsx" in text and "```json" in text:
                    content = text

    if content:
        # Extract TSX
        tsx_match = re.search(r"```tsx(.*?)```", content, re.DOTALL)
        # Extract JSON
        json_match = re.search(r"```json(.*?)```", content, re.DOTALL)

        if tsx_match and json_match:
            tsx_code = tsx_match.group(1).strip()
            json_code = json_match.group(1).strip()
            
            # Find slug
            slug = None
            try:
                j = json.loads(json_code)
                slug = j.get("slug")
            except:
                pass
            
            if slug:
                tsx_path = os.path.join(workspace_dir, "src", "components", "calculators", f"{slug}-calculator.tsx")
                json_path = os.path.join(workspace_dir, "scratch", f"{slug}.json")
                
                with open(tsx_path, "w", encoding="utf-8") as f:
                    f.write(tsx_code)
                with open(json_path, "w", encoding="utf-8") as f:
                    f.write(json_code)
                print(f"Extracted {slug}")
            else:
                print(f"Slug not found for {cid}")
        else:
            print(f"Code blocks not found for {cid}")
    else:
        print(f"No content found for {cid}")

