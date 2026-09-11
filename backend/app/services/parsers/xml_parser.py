import xml.etree.ElementTree as ET
from typing import List, Dict, Any
from app.services.parsers.base_parser import BaseParser

class XmlParser(BaseParser):
    def can_parse(self, content: str, filename: str) -> bool:
        if filename.endswith(".xml"):
            return True
        clean = content.strip()
        if clean.startswith("<?xml") or clean.startswith("<"):
            try:
                ET.fromstring(clean)
                return True
            except Exception:
                return False
        return False

    def parse(self, content: str, filename: str) -> List[Dict[str, Any]]:
        results = []
        try:
            root = ET.fromstring(content.strip())
            # Find all child elements
            for child in root:
                item_dict = {}
                for elem in child.iter():
                    if elem.text and elem.text.strip():
                        tag_name = elem.tag.split("}")[-1]  # Strip XML namespace if present
                        item_dict[tag_name.lower()] = elem.text.strip()
                if item_dict:
                    results.append(item_dict)
            if not results and root.text:
                results.append({"raw_xml": content.strip()})
        except Exception:
            results.append({"raw_xml": content.strip()})
        return results
