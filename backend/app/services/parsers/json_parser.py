import json
from typing import List, Dict, Any
from app.services.parsers.base_parser import BaseParser

class JsonParser(BaseParser):
    def can_parse(self, content: str, filename: str) -> bool:
        if filename.endswith(".json"):
            return True
        try:
            json.loads(content.strip())
            return True
        except Exception:
            return False

    def parse(self, content: str, filename: str) -> List[Dict[str, Any]]:
        data = json.loads(content.strip())
        if isinstance(data, list):
            return [dict(item) if isinstance(item, dict) else {"raw": item} for item in data]
        elif isinstance(data, dict):
            return [data]
        return []
