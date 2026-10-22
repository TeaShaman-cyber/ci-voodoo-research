import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function json(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

const request = await json('schemas/ci-voodoo.request.v1.schema.json');
const result = await json('schemas/ci-voodoo.result.v1.schema.json');
const receipt = await json('schemas/ci-voodoo.receipt.v1.schema.json');
const plugin = await json('plugin.json');

assert.equal(request.properties.schema.const, 'ci-voodoo.request.v1');
assert.equal(request.properties.persist.const, false);
assert.equal(request.additionalProperties, false);
assert.equal(request.properties.incident_ref.pattern.includes('sha256'), true);
assert.equal(Object.hasOwn(request.properties, 'incident_summary'), false);

assert.equal(result.properties.schema.const, 'ci-voodoo.result.v1');
assert.equal(result.additionalProperties, false);
assert.equal(receipt.properties.schema.const, 'ci-voodoo.receipt.v1');
assert.equal(receipt.properties.status.const, 'COMPLETED');
assert.equal(receipt.additionalProperties, false);

assert.equal(plugin.name, 'ci-voodoo');
assert.match(plugin.version, /^0\.1\.0$/);

const workflow = await readFile('.github/workflows/canonical-ritual.yml', 'utf8');
const architecture = await readFile('docs/plugin-architecture.md', 'utf8');
const skill = await readFile('skills/ci-voodoo/SKILL.md', 'utf8');
assert.match(workflow, /workflow_dispatch:/);
assert.match(workflow, /CI_VOODOO_INCIDENT_REF/);
assert.doesNotMatch(workflow, /incident_summary/i);
assert.match(workflow, /contents: read/);
assert.doesNotMatch(architecture, /incident_summary/i);
assert.doesNotMatch(skill, /incident_summary/i);

process.stdout.write('CONTRACT_CHECK_PASS\n');
