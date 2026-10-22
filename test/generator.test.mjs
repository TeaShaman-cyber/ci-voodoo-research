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
  assert.match(result.text, /(уши|икн|CI|rollback|500)/i);
  assert.doesNotMatch(result.text, /(уб(ей|ить)|смерт|болезн|травм)/i);
});

test('result carries versioned provenance fields', () => {
  const result = generateRitual(base);
  assert.equal(result.schema, 'ci-voodoo.result.v1');
  assert.match(result.generator_version, /^0\.1\.0$/);
  assert.match(result.policy_snapshot, /^x-public-/);
  assert.equal(result.seed, base.seed);
});
