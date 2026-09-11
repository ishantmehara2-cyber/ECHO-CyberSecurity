from typing import List, Dict, Any
from app.services.parsers.base_parser import BaseParser

class PdfParser(BaseParser):
    def can_parse(self, content: str, filename: str) -> bool:
        if filename.endswith(".pdf"):
            return True
        return False

    def parse(self, content: str, filename: str) -> List[Dict[str, Any]]:
        # PDFs are reference documents unless parsed. Return reference log record
        return [{
            "document_type": "PDF_REFERENCE_DOCUMENT",
            "filename": filename,
            "description": f"Reference document loaded from {filename}",
            "status": "REFERENCE_DOCUMENT_LOADED"
        }]
