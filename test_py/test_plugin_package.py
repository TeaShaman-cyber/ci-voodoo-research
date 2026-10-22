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
                        'skills/ci-voodoo/references/x-compatible-profanity-generator.md',
                    ],
                )
                manifest = json.loads(zf.read('plugin.json'))
                self.assertEqual(manifest['name'], 'ci-voodoo')
                self.assertEqual(manifest['version'], '0.1.0')
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
        self.assertIn('-> profanity/satire artifact', skill)
        self.assertIn('-> optional publication-ready X artifact', skill)
