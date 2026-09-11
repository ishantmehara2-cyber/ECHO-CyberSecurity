from typing import List, Dict, Any, Tuple
from app.services.parsers.json_parser import JsonParser
from app.services.parsers.jsonl_parser import JsonlParser
from app.services.parsers.csv_parser import CsvParser
from app.services.parsers.text_log_parser import TextLogParser
from app.services.parsers.source_classifier import classify_event_source

PARSERS = [
    ("JSON", JsonParser()),
    ("JSONL", JsonlParser()),
    ("CSV", CsvParser()),
    ("LOG", TextLogParser()),
]

def parse_and_classify_file(content: str, filename: str) -> Tuple[str, str, List[Dict[str, Any]]]:
    format_detected = "UNKNOWN"
    parsed_events = []

    for fmt_name, parser in PARSERS:
        if parser.can_parse(content, filename):
            try:
                events = parser.parse(content, filename)
                if events:
                    format_detected = fmt_name
                    parsed_events = events
                    break
            except Exception:
                continue

    if not parsed_events:
        format_detected = "TEXT"
        parsed_events = [{"raw_text": line, "description": line} for line in content.splitlines() if line.strip()]

    source_detected = "unknown"
    if parsed_events:
        source_detected = classify_event_source(parsed_events[0], filename)

    return format_detected, source_detected, parsed_events
