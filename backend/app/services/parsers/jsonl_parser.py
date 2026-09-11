import json
from typing import List, Dict, Any
from app.services.parsers.base_parser import BaseParser

class JsonlParser(BaseParser):
    def can_parse(self, content: str, filename: str) -> bool:
        if filename.endswith(".jsonl") or filename.endswith(".ndjson"):
            return True
        lines = [line.strip() for line in content.splitlines() if line.strip()]
        if len(lines) > 0 and lines[0].startswith("{") and lines[0].endswith("}"):
            try:
                json.loads(lines[0])
                return True
            except Exception:
                pass
        return False

    def parse(self, content: str, filename: str) -> List[Dict[str, Any]]:
        results = []
        for line in content.splitlines():
            clean = line.strip()
            if clean:
                try:
                    obj = json.loads(clean)
                    if isinstance(obj, dict):
                        results.append(obj)
                    else:
                        results.append({"raw": obj})
                except Exception:
                    continue
        return results
