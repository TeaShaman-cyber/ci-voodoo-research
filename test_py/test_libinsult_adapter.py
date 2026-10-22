import importlib.util
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('libinsult_adapter', ROOT / 'src' / 'libinsult_adapter.py')
adapter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(adapter)


class AdapterTests(unittest.TestCase):
    def base(self, **updates):
        req = {
            'seed': 'fixture-1',
            'ritual_style': 'ci-voodoo',
            'target_class': 'SYSTEM',
            'intensity': 3,
        }
        req.update(updates)
        return req

    def test_seeded_output_is_deterministic(self):
        self.assertEqual(adapter.render(self.base()), adapter.render(self.base()))

    def test_engine_provenance(self):
        result = adapter.render(self.base())
        self.assertEqual(result['engine'], 'libinsult')
        self.assertEqual(result['engine_version'], '0.6.2')

    def test_role_target_uses_only_folk_curse_template(self):
        result = adapter.render(self.base(target_class='ROLE_ABSTRACT', ritual_style='folk-curse', intensity=2))
        self.assertIn('owner', result['text'])
        self.assertIn('ears burn', result['text'])

    def test_100_seeds_fit_x_character_budget(self):
        for n in range(100):
            result = adapter.render(self.base(seed=f'seed-{n}'))
            self.assertLessEqual(len(result['text']), 280, result['text'])


if __name__ == '__main__':
    unittest.main()
