import importlib.util
import json
import pathlib
import tempfile
import unittest
import zipfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
MODULE = ROOT / 'tools' / 'build_plugin.py'

spec = importlib.util.spec_from_file_location('build_plugin', MODULE)
build_plugin = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build_plugin)


class PluginPackageTests(unittest.TestCase):
    def test_bundled_policy_reference_matches_canonical_spec(self):
        canonical = (ROOT / 'specs' / 'x-compatible-profanity-generator.md').read_bytes()
        bundled = (ROOT / 'skills' / 'ci-voodoo' / 'references' / 'x-compatible-profanity-generator.md').read_bytes()
        self.assertEqual(bundled, canonical)

    def test_skill_uses_package_local_policy_reference(self):
        skill = (ROOT / 'skills' / 'ci-voodoo' / 'SKILL.md').read_text(encoding='utf-8')
        self.assertIn('references/x-compatible-profanity-generator.md', skill)
        self.assertNotIn('specs/x-compatible-profanity-generator.md', skill)

    def test_bundled_request_schema_matches_canonical_schema(self):
        canonical = (ROOT / 'schemas' / 'ci-voodoo.request.v1.schema.json').read_bytes()
        bundled = (ROOT / 'skills' / 'ci-voodoo' / 'references' / 'ci-voodoo.request.v1.schema.json').read_bytes()
        self.assertEqual(bundled, canonical)

    def test_build_produces_minimal_self_contained_plugin_zip(self):
        with tempfile.TemporaryDirectory() as td:
            out = pathlib.Path(td) / 'ci-voodoo.zip'
            build_plugin.build(ROOT, out)
            with zipfile.ZipFile(out) as zf:
                names = zf.namelist()
                self.assertEqual(names, sorted(names))
                self.assertEqual(
                    names,
                    [
                        'plugin.json',
                        'skills/ci-voodoo/SKILL.md',
                        'skills/ci-voodoo/references/ci-voodoo.request.v1.schema.json',
                        'skills/ci-voodoo/references/x-compatible-profanity-generator.md',
                    ],
                )
                manifest = json.loads(zf.read('plugin.json'))
                self.assertEqual(manifest['name'], 'ci-voodoo')
                self.assertEqual(manifest['version'], '0.1.6')
                self.assertFalse(any(name.startswith(('.git/', 'src/', 'vendor/')) for name in names))
                self.assertFalse(any('..' in pathlib.PurePosixPath(name).parts for name in names))

    def test_repeated_build_is_byte_identical(self):
        with tempfile.TemporaryDirectory() as td:
            a = pathlib.Path(td) / 'a.zip'
            b = pathlib.Path(td) / 'b.zip'
            build_plugin.build(ROOT, a)
            build_plugin.build(ROOT, b)
            self.assertEqual(a.read_bytes(), b.read_bytes())


if __name__ == '__main__':
    unittest.main()

class MissionStatementTests(unittest.TestCase):
    def test_plugin_manifest_description_is_incident_first(self):
        manifest = json.loads((ROOT / 'plugin.json').read_text(encoding='utf-8'))
        description = manifest['description']
        self.assertIn('OpenAI/ChatGPT engineering incidents', description)
        self.assertIn('profanity/satire artifacts', description)
        self.assertIn('publication-ready X copy', description)

    def test_skill_description_leads_with_incident_use_case(self):
        skill = (ROOT / 'skills' / 'ci-voodoo' / 'SKILL.md').read_text(encoding='utf-8')
        frontmatter = skill.split('---', 2)[1]
        self.assertIn('OpenAI/ChatGPT engineering incident', frontmatter)
        self.assertIn('publication remains a separate authorized action', frontmatter)

    def test_skill_core_contract_starts_from_incident_not_artifact_format(self):
        skill = (ROOT / 'skills' / 'ci-voodoo' / 'SKILL.md').read_text(encoding='utf-8')
        self.assertIn('OpenAI/ChatGPT engineering failure\n    -> structured incident/target', skill)
        self.assertIn('-> run the canonical generator/runner', skill)
        self.assertIn('-> read back generated text + receipt', skill)
        self.assertIn('-> generate a companion CI-voodoo image', skill)
        self.assertIn('-> optionally prepare publication-ready X copy', skill)

class ExecutionPathTests(unittest.TestCase):
    def test_real_incident_path_uses_capability_gated_runner_routes(self):
        skill = (ROOT / 'skills' / 'ci-voodoo' / 'SKILL.md').read_text(encoding='utf-8')
        self.assertIn('native GitHub issue-comment ingress (#18)', skill)
        self.assertIn('/ci-voodoo', skill)
        self.assertIn('ci-voodoo-canonical-<comment_id>', skill)
        self.assertIn('workflow_dispatch', skill)
        self.assertIn('exe.dev', skill)
        self.assertIn('list_vms', skill)
        self.assertIn('Sprites', skill)
        self.assertIn('MarcoPolo', skill)
        self.assertIn('observed insufficiency', skill)
        self.assertIn('run the canonical generator/runner', skill)
        self.assertNotIn('otherwise use MarcoPolo', skill)
        self.assertNotIn('-> otherwise MarcoPolo', skill)

    def test_tool_capability_is_not_run_success_or_authority(self):
        skill = (ROOT / 'skills' / 'ci-voodoo' / 'SKILL.md').read_text(encoding='utf-8')
        self.assertIn('not workflow dispatch', skill)
        self.assertIn('receipt.json', skill)
        self.assertIn('generate != persist != publish', skill)
        self.assertIn('REPROBE_REQUIRED', skill)

    def test_skill_does_not_require_mcp_facade(self):
        skill = (ROOT / 'skills' / 'ci-voodoo' / 'SKILL.md').read_text(encoding='utf-8')
        self.assertNotIn('ritual.plan', skill)
        self.assertNotIn('ritual.run', skill)
        self.assertNotIn('ritual.status', skill)
        self.assertNotIn('ritual.artifact', skill)
        self.assertNotIn('Plugin MCP facade', skill)

    def test_incident_path_requests_companion_image_when_native_imagegen_exists(self):
        skill = (ROOT / 'skills' / 'ci-voodoo' / 'SKILL.md').read_text(encoding='utf-8')
        self.assertIn('generate a companion CI-voodoo image', skill)
        self.assertIn('native image generation', skill)
        self.assertIn('unless the user asks for text only', skill)


class NativeRequestPreflightTests(unittest.TestCase):
    def test_skill_requires_schema_preflight_before_native_github_write(self):
        skill = (ROOT / 'skills' / 'ci-voodoo' / 'SKILL.md').read_text(encoding='utf-8')
        self.assertIn('references/ci-voodoo.request.v1.schema.json', skill)
        self.assertIn('Before any GitHub comment write', skill)
        self.assertIn('mode` must be exactly `text`', skill)
        self.assertIn('incident_ref` must match `^sha256:[0-9a-fA-F]{16,64}$`', skill)
        self.assertIn('do not write the comment', skill)
