import json
import os
import re

brain_dir = os.path.join(os.environ.get('USERPROFILE', ''), '.gemini', 'antigravity', 'brain')

def dump_tools(agent_id):
    log_file = os.path.join(brain_dir, agent_id, '.system_generated', 'logs', 'transcript_full.jsonl')
    with open(log_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # also check PLANNER_RESPONSE content
    for line in reversed(lines):
        try:
            data = json.loads(line)
            # Check PLANNER_RESPONSE
            if data.get('type') == 'PLANNER_RESPONSE' and data.get('content'):
                content = data['content']
                tsx_match = re.search(r'```(?:tsx|typescript|javascript|react)\s*(.*?)\s*```', content, re.DOTALL)
                json_match = re.search(r'```json\s*(.*?)\s*```', content, re.DOTALL)
                if tsx_match and json_match:
                    slug = json.loads(json_match.group(1)).get('slug')
                    if slug:
                        print(f'Extracted {slug} from PLANNER_RESPONSE')
                        with open(f'src/components/calculators/{slug}-calculator.tsx', 'w', encoding='utf-8') as out_tsx:
                            out_tsx.write(tsx_match.group(1))
                        with open(f'scratch/{slug}.json', 'w', encoding='utf-8') as out_json:
                            out_json.write(json_match.group(1))
                        return

            # Check send_message
            if 'tool_calls' in data:
                for tc in data['tool_calls']:
                    tc_name = tc.get('name') or tc.get('function', {}).get('name')
                    if tc_name in ['default_api:send_message', 'send_message']:
                        args = tc.get('args') or tc.get('arguments') or tc.get('function', {}).get('arguments')
                        if isinstance(args, str):
                            args = json.loads(args)
                        content = args.get('Message', '')
                        
                        tsx_match = re.search(r'```(?:tsx|typescript|javascript|react)\s*(.*?)\s*```', content, re.DOTALL)
                        json_match = re.search(r'```json\s*(.*?)\s*```', content, re.DOTALL)
                        
                        if tsx_match and json_match:
                            slug = json.loads(json_match.group(1)).get('slug')
                            print(f'Extracted {slug} from send_message')
                            with open(f'src/components/calculators/{slug}-calculator.tsx', 'w', encoding='utf-8') as out_tsx:
                                out_tsx.write(tsx_match.group(1))
                            with open(f'scratch/{slug}.json', 'w', encoding='utf-8') as out_json:
                                out_json.write(json_match.group(1))
                            return
        except Exception as e:
            pass

def extract_from_agent(agent_id, slug):
    print(f"=== {slug} ===")
    dump_tools(agent_id)

print("=== Batch 12 ===")
extract_from_agent("bd502738-f61a-4421-80df-ab88ccf34298", "numerologi-nama")
extract_from_agent("2e5cd9de-52fb-47f7-bad6-438fa67f8d91", "biaya-bbm-perjalanan")
extract_from_agent("65ccd7a2-659f-44b7-8880-197a3532eff0", "jet-lag-zona-waktu")
extract_from_agent("82542e66-8289-401e-8d1c-901780398a96", "kompensasi-delay-pesawat")

print("=== Batch 13 ===")
extract_from_agent("442b60e4-d22e-47b6-9840-56f8ccbdade5", "gaji-host-streaming")
extract_from_agent("68fcd190-a774-421a-b84e-146cfb9723a5", "sultan-sniper-pk")
extract_from_agent("55c4435a-ad7a-4b88-93f8-3472bc829d69", "arbitrase-topup-koin")
extract_from_agent("216bc083-ea23-4b57-b479-edeaa407d830", "kerugian-arisan-gift")
extract_from_agent("a501e21f-6e64-449c-94cb-d800c7713706", "target-harian-agency")
