import json
from graphify.build import build_from_json
from graphify.export import to_html
from pathlib import Path

extraction = json.loads(Path('graphify-out/.graphify_extract.json').read_text(encoding="utf-8"))
analysis   = json.loads(Path('graphify-out/.graphify_analysis.json').read_text(encoding="utf-8"))
labels     = json.loads(Path('graphify-out/.graphify_labels.json').read_text(encoding="utf-8"))

G = build_from_json(extraction, root='.', directed=False)
communities = {int(k): v for k, v in analysis['communities'].items()}
labels_dict = {int(k): v for k, v in labels.items()}

to_html(G, communities, labels_dict, 'graphify-out/graph.html')
print("Successfully generated graphify-out/graph.html")
