from typing import List, Dict, Any, Tuple
from app.services.parsers.json_parser import JsonParser
from app.services.parsers.jsonl_parser import JsonlParser
from app.services.parsers.csv_parser import CsvParser
from app.services.parsers.xml_parser import XmlParser
from app.services.parsers.pdf_parser import PdfParser
from app.services.parsers.text_log_parser import TextLogParser
from app.services.parsers.source_classifier import classify_event_source

PARSERS = [
    ("JSON", JsonParser()),
    ("JSONL", JsonlParser()),
    ("CSV", CsvParser()),
    ("XML", XmlParser()),
    ("PDF", PdfParser()),
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


def parse_and_classify_file_with_diagnostics(
    content: str, filename: str
) -> Tuple[str, str, List[Dict[str, Any]], Dict[str, Any]]:
    """Parse one upload without converting malformed structured data into fake events."""
    diagnostics: Dict[str, Any] = {"warnings": [], "error": None}
    if not content.strip():
        diagnostics["error"] = "Uploaded file is empty."
        return "UNKNOWN", "unknown", [], diagnostics

    lower_name = filename.lower()
    structured_suffixes = (".json", ".jsonl", ".ndjson", ".csv", ".xml", ".pdf")
    for fmt_name, parser in PARSERS:
        if not parser.can_parse(content, filename):
            continue
        try:
            events = parser.parse(content, filename)
        except Exception as exc:
            diagnostics["error"] = f"{fmt_name} parsing failed: {exc}"
            return fmt_name, "unknown", [], diagnostics
        if events:
            return fmt_name, classify_event_source(events[0], filename), events, diagnostics
        if lower_name.endswith(structured_suffixes):
            diagnostics["error"] = f"{fmt_name} contained no telemetry records."
            return fmt_name, "unknown", [], diagnostics

    if lower_name.endswith(structured_suffixes):
        diagnostics["error"] = "No supported telemetry structure was detected."
        return "UNKNOWN", "unknown", [], diagnostics
    events = [{"raw_text": line, "description": line} for line in content.splitlines() if line.strip()]
    if not events:
        diagnostics["error"] = "No telemetry records were found."
        return "TEXT", "unknown", [], diagnostics
    return "TEXT", classify_event_source(events[0], filename), events, diagnostics
