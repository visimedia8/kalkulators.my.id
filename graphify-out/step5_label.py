import sys, json
from graphify.build import build_from_json
from graphify.cluster import score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from pathlib import Path

extraction = json.loads(Path('graphify-out/.graphify_extract.json').read_text(encoding="utf-8"))
detection  = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding="utf-8-sig"))
analysis   = json.loads(Path('graphify-out/.graphify_analysis.json').read_text(encoding="utf-8"))

G = build_from_json(extraction, root='.', directed=False)
communities = {int(k): v for k, v in analysis['communities'].items()}
cohesion = {int(k): v for k, v in analysis['cohesion'].items()}
tokens = {'input': extraction.get('input_tokens', 0), 'output': extraction.get('output_tokens', 0)}

node_map = {n['id']: n for n in extraction['nodes']}
labels_dict = {}

for cid, members in communities.items():
    member_labels = [node_map[m]['label'] for m in members if m in node_map]
    if len(member_labels) == 1:
        labels_dict[cid] = member_labels[0]
    elif len(member_labels) > 1:
        # Use first label or common prefix/theme
        first = member_labels[0]
        if len(first) > 40:
            first = first[:37] + "..."
        labels_dict[cid] = f"{first} ({len(members)} nodes)"
    else:
        labels_dict[cid] = f"Community {cid}"

questions = suggest_questions(G, communities, labels_dict)

report = generate(G, communities, cohesion, labels_dict, analysis['gods'], analysis['surprises'], detection, tokens, '.', suggested_questions=questions)
Path('graphify-out/GRAPH_REPORT.md').write_text(report, encoding="utf-8")
Path('graphify-out/.graphify_labels.json').write_text(json.dumps({str(k): v for k, v in labels_dict.items()}, ensure_ascii=False), encoding="utf-8")
print(f"Step 5 complete: Labeled {len(labels_dict)} communities and updated GRAPH_REPORT.md")
