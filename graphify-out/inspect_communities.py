import json
from pathlib import Path

analysis = json.loads(Path("graphify-out/.graphify_analysis.json").read_text(encoding="utf-8"))
extract = json.loads(Path("graphify-out/.graphify_extract.json").read_text(encoding="utf-8"))

node_map = {n['id']: n for n in extract['nodes']}
communities = analysis['communities']

print(f"Total communities: {len(communities)}")
labels_dict = {}

for cid_str, members in list(communities.items())[:15]:
    member_labels = [node_map[m]['label'] for m in members if m in node_map]
    print(f"Community {cid_str} ({len(members)} nodes): {member_labels[:3]}")

