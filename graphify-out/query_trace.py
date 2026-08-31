import json
import networkx as nx
from pathlib import Path
from graphify.build import build_from_json

graph_data = json.loads(Path('graphify-out/graph.json').read_text(encoding="utf-8"))

# Load nodes & edges
nodes = {n['id']: n for n in graph_data.get('nodes', [])}
edges = graph_data.get('edges', [])

print(f"Total graph nodes: {len(nodes)}, total edges: {len(edges)}")

# Find nodes matching generateMetadata or generateStaticParams
targets = [nid for nid, n in nodes.items() if 'generatemetadata' in nid or 'generatestaticparams' in nid]
print("Target nodes found:", targets)

for t in targets:
    node_info = nodes.get(t, {})
    print(f"Node: {t} | Label: {node_info.get('label')} | Source: {node_info.get('source_file')}")
