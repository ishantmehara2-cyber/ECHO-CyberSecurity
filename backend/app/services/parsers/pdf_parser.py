import re
from typing import List, Dict, Any
from app.services.parsers.base_parser import BaseParser

class PdfParser(BaseParser):
    def can_parse(self, content: str, filename: str) -> bool:
        return filename.lower().endswith(".pdf") or "pdf" in content[:20].lower()

    def parse(self, content: str, filename: str) -> List[Dict[str, Any]]:
        results = []

        # Extract structured log patterns from PDF text stream
        lines = content.splitlines()
        for line in lines:
            clean = line.strip()
            if not clean or len(clean) < 5:
                continue

            # Check if line contains telemetry indicators (IPs, users, timestamps, events)
            ip_match = re.search(r'\b(?:\d{1,3}\.){3}\d{1,3}\b', clean)
            user_match = re.search(r'(?:user|username|account|login|entity)[=:\s]+([a-zA-Z0-9_\-\.\@]+)', clean, re.IGNORECASE)
            event_match = re.search(r'(?:event|action|status|type)[=:\s]+([a-zA-Z0-9_]+)', clean, re.IGNORECASE)
            time_match = re.search(r'\b\d{2}:\d{2}:\d{2}\b', clean)

            if ip_match or user_match or time_match or "log" in clean.lower() or "auth" in clean.lower():
                evt_dict = {
                    "raw_text": clean,
                    "filename": filename
                }
                if ip_match:
                    evt_dict["ip"] = ip_match.group(0)
                if user_match:
                    evt_dict["user"] = user_match.group(1)
                if event_match:
                    evt_dict["event"] = event_match.group(1)
                if time_match:
                    evt_dict["timestamp"] = time_match.group(0)
                else:
                    evt_dict["timestamp"] = "10:30:00"

                evt_dict["description"] = clean
                results.append(evt_dict)

        if not results:
            # Fallback reference entry only if no telemetry lines found
            results.append({
                "document_type": "PDF_REFERENCE_DOCUMENT",
                "filename": filename,
                "description": f"PDF reference document loaded: {filename}",
                "status": "REFERENCE_DOCUMENT_LOADED"
            })

        return results
