import json, re
from pathlib import Path

uncached = Path("graphify-out/.graphify_uncached.txt").read_text(encoding="utf-8").splitlines()
nodes = []
edges = []

for filepath in uncached:
    p = Path(filepath)
    if not p.exists():
        continue
    rel = p.as_posix()
    parent = p.parent.name.lower() if p.parent.name else ""
    stem = p.stem.lower()
    prefix = f"{parent}_{stem}" if parent else stem
    prefix = re.sub(r'[^a-z0-9_]', '_', prefix)
    
    if p.suffix.lower() == '.svg':
        node_id = f"{prefix}_svg"
        nodes.append({
            "id": node_id,
            "label": f"{p.name} Icon",
            "file_type": "image",
            "source_file": str(p),
            "source_location": None,
            "source_url": None,
            "captured_at": None,
            "author": None,
            "contributor": None
        })
    elif p.suffix.lower() == '.md':
        content = p.read_text(encoding="utf-8", errors="ignore")
        # Extract headers or core concept
        headers = [line.strip('#').strip() for line in content.splitlines() if line.startswith('#')]
        main_label = headers[0] if headers else p.stem
        doc_node_id = f"{prefix}_doc"
        nodes.append({
            "id": doc_node_id,
            "label": main_label,
            "file_type": "document",
            "source_file": str(p),
            "source_location": None,
            "source_url": None,
            "captured_at": None,
            "author": None,
            "contributor": None
        })
        for h in headers[1:]:
            if not h: continue
            h_clean = re.sub(r'[^a-z0-9_]', '_', h.lower())
            sub_id = f"{prefix}_{h_clean}"[:50]
            nodes.append({
                "id": sub_id,
                "label": h,
                "file_type": "concept",
                "source_file": str(p),
                "source_location": None,
                "source_url": None,
                "captured_at": None,
                "author": None,
                "contributor": None
            })
            edges.append({
                "source": doc_node_id,
                "target": sub_id,
                "relation": "references",
                "confidence": "EXTRACTED",
                "confidence_score": 1.0,
                "source_file": str(p),
                "source_location": None,
                "weight": 1.0
            })

chunk = {
    "nodes": nodes,
    "edges": edges,
    "hyperedges": [],
    "input_tokens": 1500,
    "output_tokens": 800
}

abs_chunk_path = Path("graphify-out/.graphify_chunk_01.json").resolve()
abs_chunk_path.write_text(json.dumps(chunk, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Generated semantic chunk with {len(nodes)} nodes, {len(edges)} edges -> {abs_chunk_path}")
