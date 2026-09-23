#!/usr/bin/env python3
"""Plan or execute immutable OSPO evidence captures.

The script deliberately keeps collected material under the ignored .memories tree.
It never accepts a token argument and never updates public site content.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shlex
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[4]
DEFAULT_ANALYZER = ROOT.parent / "github-activity-analyzer"
DEFAULT_EVIDENCE = ROOT / ".memories" / "evidence"
VALIDATOR = Path(__file__).with_name("validate-evidence.py")
SAFE_TEAM_CAPTURE = Path(__file__).with_name("safe-team-capture.py")
GITHUB_NAME = re.compile(r"[A-Za-z0-9_.-]+")


def iso_date(value: str) -> str:
    try:
        parsed = datetime.strptime(value, "%Y-%m-%d").date()
    except ValueError as error:
        raise argparse.ArgumentTypeError("use a calendar-valid YYYY-MM-DD date") from error
    if parsed.isoformat() != value:
        raise argparse.ArgumentTypeError("use a zero-padded YYYY-MM-DD date")
    return value


def github_name(value: str) -> str:
    if not GITHUB_NAME.fullmatch(value) or value in {".", ".."}:
        raise argparse.ArgumentTypeError(
            "use only letters, numbers, dots, underscores and hyphens"
        )
    return value


def github_repository(value: str) -> str:
    parts = value.split("/")
    if len(parts) != 2 or any(github_name(part) != part for part in parts):
        raise argparse.ArgumentTypeError("use the GitHub owner/repository format")
    return value


def current_quarter() -> int:
    return ((datetime.now(timezone.utc).month - 1) // 3) + 1


def command_text(command: list[str]) -> str:
    return shlex.join(command)


def portable_command_text(
    command: list[str], analyzer_dir: Path, staging_dir: Path | None = None
) -> str:
    text = command_text(command)
    replacements = [(analyzer_dir, "${ANALYZER_DIR}"), (ROOT, "${LANDING_PAGE_ROOT}")]
    if staging_dir:
        replacements.insert(0, (staging_dir, "${STAGING_DIR}"))
    for path, placeholder in replacements:
        text = text.replace(str(path), placeholder)
    return text


def run(command: list[str], *, cwd: Path | None = None, capture: bool = False) -> str:
    print(f"$ {command_text(command)}")
    result = subprocess.run(
        command,
        cwd=cwd,
        check=True,
        text=True,
        stdout=subprocess.PIPE if capture else None,
    )
    return result.stdout if capture else ""


def require_command(name: str) -> None:
    if shutil.which(name) is None:
        raise RuntimeError(f"Required command not found: {name}")


def refuse_existing(paths: list[Path]) -> None:
    existing = [path for path in paths if path.exists()]
    if existing:
        formatted = "\n".join(f"- {path}" for path in existing)
        raise RuntimeError(
            "Evidence captures are append-only. Choose another capture date or remove an "
            f"unapproved partial run manually:\n{formatted}"
        )


def flatten_pages(payload: Any) -> list[dict[str, Any]]:
    if not isinstance(payload, list):
        raise RuntimeError("GitHub repository response was not a JSON array")
    if payload and isinstance(payload[0], list):
        return [item for page in payload for item in page if isinstance(item, dict)]
    return [item for item in payload if isinstance(item, dict)]


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def analyzer_revision(analyzer_dir: Path) -> str:
    return run(["git", "rev-parse", "HEAD"], cwd=analyzer_dir, capture=True).strip()


def parse_args() -> argparse.Namespace:
    now = datetime.now(timezone.utc)
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mode", choices=("all", "org", "board", "team"), default="all")
    parser.add_argument("--execute", action="store_true", help="Perform authenticated network calls")
    parser.add_argument("--capture-date", type=iso_date, default=now.date().isoformat())
    parser.add_argument("--org", type=github_name, default="AmadeusITGroup")
    parser.add_argument("--team", type=github_name, default="os_contributors")
    parser.add_argument(
        "--board-repo", type=github_repository, default="AmadeusITGroup/OpenSourceBoard"
    )
    parser.add_argument("--project-number", type=int, default=7)
    parser.add_argument("--year", type=int, default=now.year)
    parser.add_argument("--quarter", type=int, choices=(1, 2, 3, 4), default=current_quarter())
    parser.add_argument("--since", type=int, default=2024)
    parser.add_argument(
        "--analyzer-dir",
        type=Path,
        default=Path(os.environ.get("ANALYZER_DIR", DEFAULT_ANALYZER)),
    )
    parser.add_argument(
        "--evidence-dir",
        type=Path,
        default=Path(os.environ.get("EVIDENCE_DIR", DEFAULT_EVIDENCE)),
    )
    return parser.parse_args()


def planned_outputs(args: argparse.Namespace) -> dict[str, list[Path]]:
    evidence = args.evidence_dir.resolve()
    result: dict[str, list[Path]] = {}
    if args.mode in {"all", "org"}:
        result["org"] = [evidence / f"org-inventory-summary-{args.capture_date}.json"]
    if args.mode in {"all", "board"}:
        prefix = evidence / f"osboard-{args.year}-Q{args.quarter}-{args.capture_date}"
        result["board"] = [
            prefix.with_suffix(".md"),
            prefix.with_suffix(".json"),
            evidence / f"board-project-fields-{args.capture_date}.json",
        ]
    if args.mode in {"all", "team"}:
        result["team"] = [
            evidence / f"{args.org}-{args.team}-team-analysis-{args.capture_date}"
        ]
    result["manifest"] = [evidence / f"refresh-manifest-{args.capture_date}.json"]
    return result


def staged_outputs(outputs: dict[str, list[Path]], staging_dir: Path) -> dict[str, list[Path]]:
    return {
        group: [staging_dir / path.name for path in paths]
        for group, paths in outputs.items()
    }


def publish_outputs(
    staged: dict[str, list[Path]], final: dict[str, list[Path]]
) -> None:
    for group, staged_paths in staged.items():
        for staged_path, final_path in zip(staged_paths, final[group], strict=True):
            final_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(staged_path), str(final_path))


def print_plan(args: argparse.Namespace, outputs: dict[str, list[Path]]) -> None:
    print("Evidence refresh plan (no network calls performed):")
    print(f"- mode: {args.mode}")
    print(f"- capture date: {args.capture_date}")
    print(f"- analyzer: {args.analyzer_dir.resolve()}")
    print(f"- evidence directory: {args.evidence_dir.resolve()}")
    if "org" in outputs:
        print(f"- organization inventory: {args.org}")
    if "board" in outputs:
        print(f"- Board: {args.board_repo}, {args.year} Q{args.quarter}")
    if "team" in outputs:
        print(f"- contributor team: {args.org}/{args.team}, activity since {args.since}")
    print("- outputs:")
    for paths in outputs.values():
        for path in paths:
            print(f"  - {path}")
    print("Run again with --execute only after scope, access and ownership are confirmed.")


def collect_org(args: argparse.Namespace, output: Path) -> list[list[str]]:
    command = [
        "gh",
        "api",
        f"orgs/{args.org}/repos?per_page=100&type=all&sort=updated",
        "--paginate",
        "--slurp",
    ]
    repositories = flatten_pages(json.loads(run(command, capture=True)))
    summary = {
        "capture_date": args.capture_date,
        "evidence_class": "Observed",
        "organization": args.org,
        "source": "GitHub REST API organization repositories",
        "scope_note": "Inventory counts only; repository names are intentionally omitted.",
        "total_repositories": len(repositories),
        "non_forks": sum(not bool(repo.get("fork")) for repo in repositories),
        "forks": sum(bool(repo.get("fork")) for repo in repositories),
        "public_repositories": sum(not bool(repo.get("private")) for repo in repositories),
        "private_repositories": sum(bool(repo.get("private")) for repo in repositories),
    }
    write_json(output, summary)
    return [command]


def collect_board(args: argparse.Namespace, outputs: list[Path], analyzer_dir: Path) -> list[list[str]]:
    markdown_output, json_output, fields_output = outputs
    report_command = [
        "uv",
        "run",
        "python",
        "-m",
        "github_activity_analyzer.osboard_github_report",
        "--repo",
        args.board_repo,
        "--year",
        str(args.year),
        "--quarter",
        str(args.quarter),
        "--output",
        str(markdown_output),
        "--json-output",
        str(json_output),
    ]
    run(report_command, cwd=analyzer_dir)
    fields_command = [
        "gh",
        "project",
        "field-list",
        str(args.project_number),
        "--owner",
        args.org,
        "--format",
        "json",
    ]
    fields = json.loads(run(fields_command, capture=True))
    write_json(fields_output, fields)
    return [report_command, fields_command]


def collect_team(args: argparse.Namespace, output: Path, analyzer_dir: Path) -> list[list[str]]:
    adapter = os.path.relpath(SAFE_TEAM_CAPTURE, analyzer_dir)
    command = [
        "uv",
        "run",
        "python",
        adapter,
        args.org,
        args.team,
        "--since",
        str(args.since),
        "--output",
        str(output),
    ]
    run(command, cwd=analyzer_dir)
    return [command]


def main() -> int:
    args = parse_args()
    args.analyzer_dir = args.analyzer_dir.resolve()
    args.evidence_dir = args.evidence_dir.resolve()
    outputs = planned_outputs(args)
    print_plan(args, outputs)
    if not args.execute:
        return 0

    if args.evidence_dir != DEFAULT_EVIDENCE.resolve():
        print("Warning: evidence output is outside the default ignored .memories/evidence path.")
    refuse_existing([path for paths in outputs.values() for path in paths])
    for command in ("git", "gh", "uv", "python3"):
        require_command(command)
    if not args.analyzer_dir.is_dir():
        raise RuntimeError(f"Analyzer checkout not found: {args.analyzer_dir}")
    if not (args.analyzer_dir / "pyproject.toml").is_file():
        raise RuntimeError(f"Analyzer pyproject.toml not found: {args.analyzer_dir}")

    run(["gh", "auth", "status"])
    revision = analyzer_revision(args.analyzer_dir)
    with tempfile.TemporaryDirectory(prefix="ospo-evidence-refresh-") as staging:
        staging_dir = Path(staging)
        staged = staged_outputs(outputs, staging_dir)
        commands: list[list[str]] = []
        validation_targets: list[Path] = []

        if "org" in staged:
            commands.extend(collect_org(args, staged["org"][0]))
            validation_targets.extend(staged["org"])
        if "board" in staged:
            commands.extend(collect_board(args, staged["board"], args.analyzer_dir))
            validation_targets.extend(staged["board"])
        if "team" in staged:
            commands.extend(collect_team(args, staged["team"][0], args.analyzer_dir))
            validation_targets.extend(staged["team"])

        published_outputs = [
            path
            for group, paths in outputs.items()
            if group != "manifest"
            for path in paths
        ]
        manifest = {
            "analyzer_revision": revision,
            "analyzer_source": "https://github.com/Amadeus-xDLC/coe.github-activity-analyzer",
            "capture_date": args.capture_date,
            "captured_at_utc": datetime.now(timezone.utc).isoformat(),
            "commands": [
                portable_command_text(command, args.analyzer_dir, staging_dir)
                for command in commands
            ],
            "mode": args.mode,
            "outputs": [str(path.relative_to(args.evidence_dir)) for path in published_outputs],
            "public_content_updated": False,
        }
        write_json(staged["manifest"][0], manifest)
        validation_targets.append(staged["manifest"][0])
        run([sys.executable, str(VALIDATOR), *map(str, validation_targets)])
        publish_outputs(staged, outputs)
    print("Evidence capture complete. Review the delta and update the ledger before drafting public claims.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, RuntimeError, subprocess.CalledProcessError, json.JSONDecodeError) as error:
        print(f"Evidence refresh failed: {error}", file=sys.stderr)
        raise SystemExit(1) from error
