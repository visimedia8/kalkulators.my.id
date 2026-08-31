import json
import os
import re
import sys

brain_dir = os.path.join(os.environ.get('USERPROFILE', ''), '.gemini', 'antigravity', 'brain')

def extract_from_agent(agent_id):
    log_file = os.path.join(brain_dir, agent_id, '.system_generated', 'logs', 'transcript_full.jsonl')
    
    if not os.path.exists(log_file):
        print(f"File not found: {log_file}")
        return
        
    with open(log_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    content_found = False
    for line in reversed(lines):
        try:
            data = json.loads(line)
            if data.get('type') == 'PLANNER_RESPONSE' and data.get('content'):
                content = data['content']
                tsx_match = re.search(r'```(?:tsx|typescript|javascript|react)\s*(.*?)\s*```', content, re.DOTALL)
                json_match = re.search(r'```json\s*(.*?)\s*```', content, re.DOTALL)
                
                if tsx_match and json_match:
                    content_found = True
                    tsx_code = tsx_match.group(1)
                    json_code = json_match.group(1)
                    
                    try:
                        json_data = json.loads(json_code)
                        slug = json_data.get('slug')
                        if slug:
                            # write tsx
                            with open(f"src/components/calculators/{slug}-calculator.tsx", "w", encoding="utf-8") as out_tsx:
                                out_tsx.write(tsx_code)
                            # write json
                            with open(f"scratch/{slug}.json", "w", encoding="utf-8") as out_json:
                                out_json.write(json_code)
                            print(f"Extracted {slug}")
                            break
                    except Exception as e:
                        print(f"JSON parse error in {agent_id}: {e}")
        except Exception:
            pass
            
    if not content_found:
        print(f"No valid tsx/json blocks found for {agent_id}")

agent_ids = [
    "ceb2c60f-53e8-4e59-afc0-c51a2695718f",
    "498e0f61-75d2-450f-b788-25e265e16f02",
    "aa7ff33c-d198-43ab-8fdf-84b14e0e8c24"
]

for aid in agent_ids:
    extract_from_agent(aid)
