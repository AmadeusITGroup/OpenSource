#!/usr/bin/env python3
"""Validate OSPO evidence structure and scan text artifacts for unsafe material."""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from pathlib import Path
from typing import Any, Iterable

TEXT_SUFFIXES = {".csv", ".html", ".json", ".md", ".txt", ".yaml", ".yml"}
SECRET_PATTERNS = {
    "GitHub classic token": re.compile(r"\bgh[pousr]_[A-Za-z0-9]{20,}\b"),
    "GitHub fine-grained token": re.compile(r"\bgithub_pat_[A-Za-z0-9_]{20,}\b"),
    "authorization credential": re.compile(
        r"\bAuthorization\s*[:=]\s*(?:Bearer|token)\s+[A-Za-z0-9._~+/=-]{12,}", re.I
    ),
    "private key": re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
}
INTERNAL_PATTERNS = {
    "SharePoint reference": re.compile(r"https?://\S*sharepoint\S*", re.I),
    "Amadeus Workplace reference": re.compile(r"https?://\S*amadeusworkplace\S*", re.I),
}
DATE_IN_NAME = re.compile(r"20\d{2}-\d{2}-\d{2}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="+", type=Path, help="Evidence files or directories")
    parser.add_argument("--strict", action="store_true", help="Treat warnings as failures")
    return parser.parse_args()


def iter_files(paths: Iterable[Path]) -> Iterable[Path]:
    seen: set[Path] = set()
    for supplied in paths:
        path = supplied.resolve()
        if not path.exists():
            raise FileNotFoundError(path)
        candidates = [path] if path.is_file() else sorted(item for item in path.rglob("*") if item.is_file())
        for candidate in candidates:
            if candidate not in seen:
                seen.add(candidate)
                yield candidate


def nested(payload: dict[str, Any], *keys: str) -> Any:
    current: Any = payload
    for key in keys:
        if not isinstance(current, dict) or key not in current:
            return None
        current = current[key]
    return current


def scan_text(path: Path, errors: list[str], warnings: list[str]) -> None:
    if path.suffix.lower() not in TEXT_SUFFIXES:
        return
    try:
        with path.open("r", encoding="utf-8", errors="replace") as handle:
            for number, line in enumerate(handle, start=1):
                for label, pattern in SECRET_PATTERNS.items():
                    if pattern.search(line):
                        errors.append(f"{path}:{number}: credential-shaped text ({label})")
                for label, pattern in INTERNAL_PATTERNS.items():
                    if pattern.search(line):
                        errors.append(f"{path}:{number}: internal URL ({label})")
                if "/home/" in line or re.search(r"[A-Za-z]:\\\\Users\\\\", line):
                    warnings.append(f"{path}:{number}: local filesystem path needs review")
    except OSError as error:
        errors.append(f"{path}: could not scan text: {error}")


def validate_json(path: Path, errors: list[str]) -> Any:
    if path.suffix.lower() != ".json":
        return None
    try:
        with path.open("r", encoding="utf-8") as handle:
            return json.load(handle)
    except (OSError, json.JSONDecodeError) as error:
        errors.append(f"{path}: invalid JSON: {error}")
        return None


def validate_team_stats(
    path: Path,
    payload: dict[str, Any],
    errors: list[str],
    notices: list[str],
) -> None:
    member_count = payload.get("member_count")
    aggregate = payload.get("aggregated_metrics")
    if not isinstance(member_count, int) or member_count < 1:
        errors.append(f"{path}: member_count must be a positive integer")
    if not isinstance(aggregate, dict):
        errors.append(f"{path}: aggregated_metrics object is missing")
        return

    required = ("total_external_contributions", "total_external_prs", "total_merged_prs")
    for key in required:
        value = aggregate.get(key)
        if not isinstance(value, (int, float)) or value < 0:
            errors.append(f"{path}: aggregated_metrics.{key} must be a non-negative number")

    pull_requests = aggregate.get("total_external_prs")
    merged = aggregate.get("total_merged_prs")
    if isinstance(pull_requests, (int, float)) and isinstance(merged, (int, float)):
        if merged > pull_requests:
            errors.append(f"{path}: merged pull requests exceed external pull requests")

    team_rate = nested(payload, "team_insights", "quality_indicators", "team_merge_rate")
    if not isinstance(team_rate, (int, float)) or not 0 <= team_rate <= 100:
        errors.append(
            f"{path}: team_insights.quality_indicators.team_merge_rate must be between 0 and 100"
        )

    average_languages = nested(payload, "team_insights", "language_diversity", "avg_languages_per_member")
    if average_languages == 0:
        notices.append(
            f"{path}: avg_languages_per_member is the known zero stub and must not support a claim"
        )


def validate_aggregate_csv(path: Path, notices: list[str]) -> None:
    if path.name != "team_stats_aggregate.csv":
        return
    try:
        with path.open("r", encoding="utf-8", newline="") as handle:
            rows = list(csv.DictReader(handle))
    except OSError as error:
        notices.append(f"{path}: aggregate CSV could not be inspected: {error}")
        return
    for row in rows:
        for key, value in row.items():
            if "merge" in (key or "").lower() and value in {"0", "0.0", "0.00"}:
                notices.append(
                    f"{path}: zero merge-rate field is a known compatibility issue; use team_stats.json"
                )
                return


def main() -> int:
    args = parse_args()
    errors: list[str] = []
    warnings: list[str] = []
    notices: list[str] = []
    files = list(iter_files(args.paths))
    if not files:
        errors.append("No evidence files found")

    for path in files:
        scan_text(path, errors, warnings)
        payload = validate_json(path, errors)
        if path.name == "team_stats.json" and isinstance(payload, dict):
            validate_team_stats(path, payload, errors, notices)
        validate_aggregate_csv(path, notices)

    dated_inputs = [path for path in args.paths if DATE_IN_NAME.search(str(path))]
    if not dated_inputs:
        warnings.append("No supplied evidence path contains an ISO capture date")

    print(f"Evidence validation inspected {len(files)} file(s).")
    for notice in sorted(set(notices)):
        print(f"NOTICE: {notice}")
    for warning in sorted(set(warnings)):
        print(f"WARNING: {warning}")
    for error in sorted(set(errors)):
        print(f"ERROR: {error}", file=sys.stderr)

    if errors or (args.strict and warnings):
        print(
            f"Evidence validation failed with {len(set(errors))} error(s) and "
            f"{len(set(warnings))} warning(s); {len(set(notices))} known caveat(s).",
            file=sys.stderr,
        )
        return 1
    print(
        f"Evidence validation passed with {len(set(warnings))} warning(s) and "
        f"{len(set(notices))} known caveat(s)."
    )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (FileNotFoundError, OSError) as error:
        print(f"Evidence validation failed: {error}", file=sys.stderr)
        raise SystemExit(1) from error
