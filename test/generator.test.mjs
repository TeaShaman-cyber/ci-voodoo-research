import test from 'node:test';
import assert from 'node:assert/strict';
import { generateRitual, validateRequest } from '../src/generator.mjs';

const base = {
  schema: 'ci-voodoo.request.v1',
  mode: 'text',
  target_class: 'SYSTEM',
  intensity: 2,
  ritual_style: 'ci-voodoo',
  incident_ref: 'sha256:0123456789abcdef',
  seed: 'fixture-1',
  persist: false
};

test('accepts the canonical v1 request shape', () => {
  assert.deepEqual(validateRequest(base), base);
});

test('same request and seed produce the same result', () => {
  assert.deepEqual(generateRitual(base), generateRitual(base));
});

test('canonical output never echoes opaque incident_ref into public text', () => {
  const result = generateRitual(base);
  assert.equal(result.text.includes(base.incident_ref), false);
});

test('rejects persistence in the generation contract', () => {
  assert.throws(
    () => validateRequest({ ...base, persist: true }),
    /persist must be false/
  );
});

test('rejects named-person target classes', () => {
  assert.throws(
    () => validateRequest({ ...base, target_class: 'NAMED_PERSON_ATTACK' }),
    /target_class/
  );
});

test('ROLE_ABSTRACT is medium risk and remains nonviolent', () => {
  const result = generateRitual({ ...base, target_class: 'ROLE_ABSTRACT', ritual_style: 'folk-curse' });
  assert.equal(result.risk, 'MEDIUM');
  assert.match(result.text, /(ears|hiccup|CI|rollback|500)/i);
  assert.doesNotMatch(result.text, /(kill|death|disease|injur)/i);
});

test('result carries versioned provenance fields', () => {
  const result = generateRitual(base);
  assert.equal(result.schema, 'ci-voodoo.result.v1');
  assert.match(result.generator_version, /^0\.1\.0$/);
  assert.match(result.policy_snapshot, /^x-public-/);
  assert.equal(result.seed, base.seed);
});

test('ROLE_ABSTRACT rejects non-folk-curse styles', () => {
  assert.throws(
    () => validateRequest({ ...base, target_class: 'ROLE_ABSTRACT', ritual_style: 'plain-rage' }),
    /ROLE_ABSTRACT.*folk-curse/
  );
});

test('ROLE_ABSTRACT rejects intensity above 2', () => {
  assert.throws(
    () => validateRequest({ ...base, target_class: 'ROLE_ABSTRACT', ritual_style: 'folk-curse', intensity: 3 }),
    /ROLE_ABSTRACT.*intensity/
  );
});

test('empty explicit seed is rejected', () => {
  assert.throws(
    () => validateRequest({ ...base, seed: '' }),
    /seed must be a non-empty string or null/
  );
});

test('reported derived seed reproduces the exact generated text', () => {
  const request = {
    ...base,
    target_class: 'BUG',
    ritual_style: 'plain-rage',
    incident_ref: 'sha256:0000000000000000',
    seed: null
  };
  const first = generateRitual(request);
  const replay = generateRitual({ ...request, seed: first.seed });
  assert.equal(replay.text, first.text);
  assert.equal(replay.seed, first.seed);
});


test('generator output is English-first and fits an X post', () => {
  const styles = ['plain-rage', 'folk-curse', 'ci-voodoo', 'cato'];
  const targets = ['BUG', 'SYSTEM', 'PROCESS', 'VENDOR_ABSTRACT'];
  for (let n = 0; n < 100; n++) {
    for (const target_class of targets) {
      for (const ritual_style of styles) {
        const result = generateRitual({
          ...base,
          target_class,
          ritual_style,
          seed: 'x-' + n
        });
        assert.equal(result.text.length <= 280, true, result.text);
        assert.doesNotMatch(result.text, /[А-Яа-яЁё]/u);
      }
    }
  }
});
