import csv
import io
from typing import List, Dict, Any
from app.services.parsers.base_parser import BaseParser

class CsvParser(BaseParser):
    def can_parse(self, content: str, filename: str) -> bool:
        if filename.endswith(".csv"):
            return True
        lines = [line for line in content.splitlines() if line.strip()]
        if len(lines) > 1 and "," in lines[0]:
            return True
        return False

    def parse(self, content: str, filename: str) -> List[Dict[str, Any]]:
        results = []
        reader = csv.DictReader(io.StringIO(content))
        for row in reader:
            clean_row = {k.strip(): v.strip() for k, v in row.items() if k}
            results.append(clean_row)
        return results
