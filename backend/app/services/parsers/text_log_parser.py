import re
from typing import List, Dict, Any
from app.services.parsers.base_parser import BaseParser

class TextLogParser(BaseParser):
    def can_parse(self, content: str, filename: str) -> bool:
        if filename.endswith(".log") or filename.endswith(".txt"):
            return True
        return True

    def parse(self, content: str, filename: str) -> List[Dict[str, Any]]:
        results = []
        for line in content.splitlines():
            clean = line.strip()
            if not clean:
                continue

            # Key-value extraction regex (e.g. user=sarah ip=10.0.1.15 status=failed)
            kv_pairs = re.findall(r'(\w+)=["\']?([^"\'\s]+)["\']?', clean)
            if kv_pairs:
                dict_obj = {k.lower(): v for k, v in kv_pairs}
                dict_obj["raw_text"] = clean
                results.append(dict_obj)
            else:
                results.append({
                    "raw_text": clean,
                    "event": "unstructured_log",
                    "description": clean
                })

        return results
