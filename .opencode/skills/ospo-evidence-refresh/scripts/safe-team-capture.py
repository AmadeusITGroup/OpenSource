#!/usr/bin/env python3
"""Run the external team analyzer without forwarding GitHub tokens in child arguments."""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any

from github_activity_analyzer.team_analyzer import GitHubTeamAnalyzer

AGGREGATE_KEYS = (
    "total_external_contributions",
    "total_external_prs",
    "total_external_issues",
    "total_merged_prs",
    "total_repositories",
    "total_stars",
    "total_forks",
    "combined_languages",
    "combined_project_categories",
    "years_range",
)
INSIGHT_KEYS = {
    "language_diversity": (
        "total_languages",
        "avg_languages_per_member",
        "top_team_languages",
    ),
    "project_coverage": ("total_external_projects", "avg_projects_per_member"),
    "collaboration_metrics": ("collaborative_projects", "collaboration_rate"),
    "quality_indicators": (
        "team_merge_rate",
        "avg_member_merge_rate",
        "contribution_distribution",
        "experience_range",
    ),
}


def selected(mapping: Any, keys: tuple[str, ...]) -> dict[str, Any]:
    if not isinstance(mapping, dict):
        raise RuntimeError("Analyzer aggregate has an unexpected structure")
    missing = [key for key in keys if key not in mapping]
    if missing:
        raise RuntimeError(f"Analyzer aggregate is missing fields: {', '.join(missing)}")
    return {key: mapping[key] for key in keys}


def minimize_team_stats(
    payload: Any, *, organization: str, team: str, since_year: int
) -> dict[str, Any]:
    """Remove member profiles and named repositories from the retained evidence."""
    if not isinstance(payload, dict):
        raise RuntimeError("Analyzer team_stats.json is not a JSON object")
    aggregate = selected(payload.get("aggregated_metrics"), AGGREGATE_KEYS)
    insights = payload.get("team_insights")
    if not isinstance(insights, dict):
        raise RuntimeError("Analyzer team_stats.json is missing team_insights")
    required = ("member_count", "analysis_date")
    if any(key not in payload for key in required):
        raise RuntimeError("Analyzer team_stats.json is missing required aggregate fields")

    return {
        "capture_scope": {
            "organization": organization,
            "team": team,
            "since_year": since_year,
            "source": "GitHub API via github-activity-analyzer",
            "minimized": True,
        },
        "team_name": payload.get("team_name", f"{organization}-{team}"),
        "analysis_date": payload["analysis_date"],
        "member_count": payload["member_count"],
        "aggregated_metrics": aggregate,
        "team_insights": {
            section: selected(insights.get(section), keys)
            for section, keys in INSIGHT_KEYS.items()
        },
    }


class SafeTeamAnalyzer(GitHubTeamAnalyzer):
    """Keep authentication in the environment or gh credential store."""

    def get_team_members(self, org: str, team: str) -> list[str]:
        """Fetch a team without printing member identities to logs."""
        members: list[dict[str, Any]] = []
        page = 1
        while True:
            response = self.safe_api_call(
                f"https://api.github.com/orgs/{org}/teams/{team}/members",
                {"page": page, "per_page": 100},
            )
            if response is None or response.status_code != 200:
                status = response.status_code if response is not None else "no response"
                raise RuntimeError(f"Could not fetch team membership: HTTP {status}")
            current = response.json()
            if not isinstance(current, list):
                raise RuntimeError("Team membership response was not a JSON array")
            members.extend(item for item in current if isinstance(item, dict))
            if not current or 'rel="next"' not in response.headers.get("Link", ""):
                break
            page += 1

        usernames = [item["login"] for item in members if isinstance(item.get("login"), str)]
        print(f"Fetched {len(usernames)} team members; identities are omitted from logs.")
        return usernames

    def analyze_team_member(
        self,
        username: str,
        since_year: int,
        output_base_dir: str,
        verbose: bool = False,
    ) -> dict[str, Any]:
        member_output_dir = Path(output_base_dir) / f"{username}-activity-report"
        command = [
            sys.executable,
            "-m",
            "github_activity_analyzer.github_analyzer",
            username,
            "--since",
            str(since_year),
            "--output-dir",
            str(member_output_dir),
            "--cache-ttl-hours",
            "0",
        ]
        print("Analyzing one team member; identity is omitted from logs.")
        try:
            subprocess.run(
                command,
                check=True,
                capture_output=True,
                text=True,
            )
        except subprocess.CalledProcessError as error:
            raise RuntimeError(
                f"A member analysis failed with exit code {error.returncode}; "
                "the team capture was stopped to avoid a partial aggregate"
            ) from error

        stats_file = member_output_dir / "complete_stats.json"
        if not stats_file.is_file():
            raise RuntimeError(
                "A member analysis output is missing; "
                "the team capture was stopped to avoid a partial aggregate"
            )
        with stats_file.open("r", encoding="utf-8") as handle:
            return json.load(handle)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("org")
    parser.add_argument("team")
    parser.add_argument("--since", type=int, default=2024)
    parser.add_argument("--output", type=Path, required=True)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    output = args.output.resolve()
    if output.exists():
        raise RuntimeError(f"Output already exists: {output}")
    if os.environ.get("GITHUB_TOKEN"):
        print("Using GITHUB_TOKEN from the environment; token value will not be logged.")
    else:
        print("Using existing gh authentication when available; token value will not be logged.")

    analyzer = SafeTeamAnalyzer()
    with tempfile.TemporaryDirectory(prefix="ospo-team-evidence-") as staging:
        result = analyzer.analyze_team(
            org=args.org,
            team=args.team,
            since_year=args.since,
            output_dir=staging,
        )
        if not result:
            raise RuntimeError("Analyzer did not produce team statistics")
        with Path(result).open("r", encoding="utf-8") as handle:
            minimized = minimize_team_stats(
                json.load(handle),
                organization=args.org,
                team=args.team,
                since_year=args.since,
            )

    output.mkdir(parents=True)
    (output / "team_stats.json").write_text(
        json.dumps(minimized, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    print(f"Minimized team evidence saved: {output / 'team_stats.json'}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, RuntimeError, ValueError) as error:
        print(f"Safe team capture failed: {error}", file=sys.stderr)
        raise SystemExit(1) from error
