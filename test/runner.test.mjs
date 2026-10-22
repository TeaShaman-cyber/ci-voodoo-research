import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { runCanonical } from '../src/runner.mjs';

const request = {
  schema: 'ci-voodoo.request.v1',
  mode: 'text',
  target_class: 'SYSTEM',
  intensity: 3,
  ritual_style: 'cato',
  incident_ref: 'sha256:abcdef0123456789',
  seed: 'runner-fixture',
  persist: false
};

function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

test('canonical runner writes request, result, and verifiable receipt', async () => {
  const outDir = await mkdtemp(join(tmpdir(), 'ci-voodoo-'));
  const receipt = await runCanonical({ request, outDir, runnerRevision: 'test-revision' });

  const requestText = await readFile(join(outDir, 'request.json'), 'utf8');
  const resultText = await readFile(join(outDir, 'result.json'), 'utf8');
  const receiptText = await readFile(join(outDir, 'receipt.json'), 'utf8');
  const persistedReceipt = JSON.parse(receiptText);

  assert.equal(receipt.status, 'COMPLETED');
  assert.equal(persistedReceipt.request_hash, sha256(requestText));
  assert.equal(persistedReceipt.result_hash, sha256(resultText));
  assert.equal(persistedReceipt.runner_revision, 'test-revision');
  assert.equal(persistedReceipt.request_id, 'ci-' + persistedReceipt.request_hash.slice(0, 16));
  assert.equal(persistedReceipt.artifact_location, 'result.json');
});

test('same canonical request yields same request id and result hash', async () => {
  const outA = await mkdtemp(join(tmpdir(), 'ci-voodoo-a-'));
  const outB = await mkdtemp(join(tmpdir(), 'ci-voodoo-b-'));

  const a = await runCanonical({ request, outDir: outA, runnerRevision: 'rev-a' });
  const b = await runCanonical({ request, outDir: outB, runnerRevision: 'rev-b' });

  assert.equal(a.request_id, b.request_id);
  assert.equal(a.result_hash, b.result_hash);
});
