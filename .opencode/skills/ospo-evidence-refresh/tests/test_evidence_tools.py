from __future__ import annotations

import importlib.util
import json
import subprocess
import sys
import tempfile
import types
import unittest
from pathlib import Path
from unittest import mock

SKILL_ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = SKILL_ROOT / "scripts"
REFRESH_SCRIPT = SCRIPTS / "refresh-evidence.py"
VALIDATOR_SCRIPT = SCRIPTS / "validate-evidence.py"
SAFE_TEAM_SCRIPT = SCRIPTS / "safe-team-capture.py"


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Could not load {path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


class RefreshEvidenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.refresh = load_module("ospo_refresh_evidence", REFRESH_SCRIPT)

    def test_plan_is_offline_and_writes_nothing(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            result = subprocess.run(
                [
                    sys.executable,
                    str(REFRESH_SCRIPT),
                    "--mode",
                    "team",
                    "--capture-date",
                    "2026-03-09",
                    "--evidence-dir",
                    directory,
                ],
                check=False,
                capture_output=True,
                text=True,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn("no network calls performed", result.stdout)
            self.assertEqual(list(Path(directory).iterdir()), [])

    def test_existing_output_is_refused(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            existing = Path(directory) / "capture.json"
            existing.write_text("{}\n", encoding="utf-8")
            with self.assertRaisesRegex(RuntimeError, "append-only"):
                self.refresh.refuse_existing([existing])

    def test_path_forming_inputs_reject_traversal(self) -> None:
        result = subprocess.run(
            [sys.executable, str(REFRESH_SCRIPT), "--capture-date", "../../public"],
            check=False,
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 2)
        self.assertIn("calendar-valid YYYY-MM-DD", result.stderr)

    def test_manifest_command_replaces_local_roots(self) -> None:
        analyzer = self.refresh.ROOT.parent / "github-activity-analyzer"
        with tempfile.TemporaryDirectory() as directory:
            staging = Path(directory)
            rendered = self.refresh.portable_command_text(
                [
                    "tool",
                    str(analyzer / "entry.py"),
                    str(self.refresh.ROOT / ".memories/evidence"),
                    str(staging / "capture.json"),
                ],
                analyzer,
                staging,
            )
            self.assertIn("${ANALYZER_DIR}", rendered)
            self.assertIn("${LANDING_PAGE_ROOT}", rendered)
            self.assertIn("${STAGING_DIR}", rendered)
            self.assertNotIn(str(Path.home()), rendered)

    def test_only_staged_outputs_are_published(self) -> None:
        with tempfile.TemporaryDirectory() as staging_dir, tempfile.TemporaryDirectory() as final_dir:
            final = {"org": [Path(final_dir) / "capture.json"]}
            staged = self.refresh.staged_outputs(final, Path(staging_dir))
            staged["org"][0].write_text('{"validated": true}\n', encoding="utf-8")
            self.refresh.publish_outputs(staged, final)
            self.assertEqual(final["org"][0].read_text(encoding="utf-8"), '{"validated": true}\n')
            self.assertFalse(staged["org"][0].exists())


class EvidenceValidatorTests(unittest.TestCase):
    @staticmethod
    def valid_team_stats() -> dict[str, object]:
        return {
            "member_count": 1,
            "aggregated_metrics": {
                "total_external_contributions": 2,
                "total_external_prs": 1,
                "total_merged_prs": 1,
            },
            "team_insights": {
                "quality_indicators": {"team_merge_rate": 100},
                "language_diversity": {"avg_languages_per_member": 0},
            },
        }

    def test_known_analyzer_stub_is_a_notice(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            capture = Path(directory) / "capture-2026-03-09"
            capture.mkdir()
            (capture / "team_stats.json").write_text(
                json.dumps(self.valid_team_stats()), encoding="utf-8"
            )
            result = subprocess.run(
                [sys.executable, str(VALIDATOR_SCRIPT), str(capture)],
                check=False,
                capture_output=True,
                text=True,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn("known zero stub", result.stdout)

    def test_credential_shaped_text_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            capture = Path(directory) / "capture-2026-03-09"
            capture.mkdir()
            (capture / "unsafe.md").write_text(
                "token: ghp_abcdefghijklmnopqrstuvwxyz\n", encoding="utf-8"
            )
            result = subprocess.run(
                [sys.executable, str(VALIDATOR_SCRIPT), str(capture)],
                check=False,
                capture_output=True,
                text=True,
            )
            self.assertEqual(result.returncode, 1)
            self.assertIn("credential-shaped text", result.stderr)


class SafeTeamCaptureTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        fake_package = types.ModuleType("github_activity_analyzer")
        fake_package.__path__ = []
        fake_team = types.ModuleType("github_activity_analyzer.team_analyzer")
        fake_team.GitHubTeamAnalyzer = type("GitHubTeamAnalyzer", (), {})
        with mock.patch.dict(
            sys.modules,
            {
                "github_activity_analyzer": fake_package,
                "github_activity_analyzer.team_analyzer": fake_team,
            },
        ):
            cls.safe_team = load_module("ospo_safe_team_capture", SAFE_TEAM_SCRIPT)

    def test_child_command_uses_fresh_cache_without_token_argument(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            member_dir = Path(directory) / "octocat-activity-report"
            member_dir.mkdir()
            expected = {"profile": {"username": "octocat"}}
            (member_dir / "complete_stats.json").write_text(
                json.dumps(expected), encoding="utf-8"
            )
            analyzer = self.safe_team.SafeTeamAnalyzer()
            with mock.patch.object(self.safe_team.subprocess, "run") as run:
                actual = analyzer.analyze_team_member("octocat", 2024, directory)

            self.assertEqual(actual, expected)
            command = run.call_args.args[0]
            self.assertNotIn("--token", command)
            self.assertEqual(command[command.index("--cache-ttl-hours") + 1], "0")

    def test_minimized_output_removes_people_and_named_repositories(self) -> None:
        payload = {
            "team_name": "example-team",
            "analysis_date": "2026-03-09T10:00:00",
            "member_count": 1,
            "members": [{"username": "octocat", "name": "Example Person"}],
            "aggregated_metrics": {
                "total_external_contributions": 2,
                "total_external_prs": 1,
                "total_external_issues": 1,
                "total_merged_prs": 1,
                "total_repositories": 3,
                "total_stars": 4,
                "total_forks": 5,
                "combined_languages": {"Python": 1},
                "combined_project_categories": {"Other": 2},
                "combined_external_repos": {"private-owner/private-name": 2},
                "years_range": {"min": 1, "max": 1},
                "member_profiles": [{"bio": "personal profile"}],
            },
            "team_insights": {
                "top_contributors": {"by_total_contributions": [{"username": "octocat"}]},
                "language_diversity": {
                    "total_languages": 1,
                    "avg_languages_per_member": 0,
                    "top_team_languages": {"Python": 1},
                },
                "project_coverage": {
                    "total_external_projects": 1,
                    "avg_projects_per_member": 1,
                    "most_collaborative_projects": {"private-owner/private-name": 2},
                },
                "collaboration_metrics": {
                    "collaborative_projects": 1,
                    "collaboration_rate": 100,
                    "top_collaborative_projects": {"private-owner/private-name": 2},
                },
                "quality_indicators": {
                    "team_merge_rate": 100,
                    "avg_member_merge_rate": 100,
                    "contribution_distribution": "100% from top 1 contributor(s)",
                    "experience_range": "1.0 - 1.0 years",
                },
            },
        }
        result = self.safe_team.minimize_team_stats(
            payload, organization="example", team="team", since_year=2024
        )
        serialized = json.dumps(result)
        self.assertNotIn("octocat", serialized)
        self.assertNotIn("Example Person", serialized)
        self.assertNotIn("private-owner/private-name", serialized)
        self.assertNotIn("personal profile", serialized)
        self.assertTrue(result["capture_scope"]["minimized"])

    def test_member_failure_stops_partial_capture(self) -> None:
        analyzer = self.safe_team.SafeTeamAnalyzer()
        failure = subprocess.CalledProcessError(1, ["python"])
        with tempfile.TemporaryDirectory() as directory:
            with mock.patch.object(self.safe_team.subprocess, "run", side_effect=failure):
                with self.assertRaisesRegex(RuntimeError, "partial aggregate"):
                    analyzer.analyze_team_member("octocat", 2024, directory)


if __name__ == "__main__":
    unittest.main()
