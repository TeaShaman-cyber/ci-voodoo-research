import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

test('CLI builds a canonical request only from bounded environment fields', async () => {
  const outDir = await mkdtemp(join(tmpdir(), 'ci-voodoo-cli-'));
  const proc = spawnSync(process.execPath, ['src/cli.mjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: {
      ...process.env,
      CI_VOODOO_MODE: 'text',
      CI_VOODOO_TARGET_CLASS: 'SYSTEM',
      CI_VOODOO_INTENSITY: '2',
      CI_VOODOO_RITUAL_STYLE: 'ci-voodoo',
      CI_VOODOO_INCIDENT_REF: 'sha256:fedcba9876543210',
      CI_VOODOO_SEED: 'cli-fixture',
      CI_VOODOO_OUT_DIR: outDir,
      CI_VOODOO_RUNNER_REVISION: 'cli-test'
    }
  });

  assert.equal(proc.status, 0, proc.stderr);
  const request = JSON.parse(await readFile(join(outDir, 'request.json'), 'utf8'));
  const receipt = JSON.parse(await readFile(join(outDir, 'receipt.json'), 'utf8'));

  assert.equal(request.incident_ref, 'sha256:fedcba9876543210');
  assert.equal(Object.hasOwn(request, 'incident_summary'), false);
  assert.equal(receipt.runner_revision, 'cli-test');
});
