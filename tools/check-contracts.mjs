import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

async function json(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function sha256File(path) {
  return createHash('sha256').update(await readFile(path)).digest('hex');
}

const request = await json('schemas/ci-voodoo.request.v1.schema.json');
const result = await json('schemas/ci-voodoo.result.v1.schema.json');
const receipt = await json('schemas/ci-voodoo.receipt.v1.schema.json');
const plugin = await json('plugin.json');

assert.equal(request.properties.schema.const, 'ci-voodoo.request.v1');
assert.equal(request.properties.mode.const, 'text');
assert.equal(request.properties.persist.const, false);
assert.equal(request.additionalProperties, false);
assert.equal(request.properties.incident_ref.pattern.includes('sha256'), true);
assert.equal(Object.hasOwn(request.properties, 'incident_summary'), false);

assert.equal(result.properties.schema.const, 'ci-voodoo.result.v1');
assert.equal(result.properties.engine.const, 'libinsult');
assert.equal(result.properties.engine_version.const, '0.6.2');
assert.equal(result.properties.generator_version.const, '0.2.0');
assert.equal(result.additionalProperties, false);
assert.equal(receipt.properties.schema.const, 'ci-voodoo.receipt.v1');
assert.equal(receipt.properties.engine.const, 'libinsult');
assert.equal(receipt.properties.engine_version.const, '0.6.2');
assert.equal(receipt.properties.generator_version.const, '0.2.0');
assert.equal(receipt.properties.status.const, 'COMPLETED');
assert.equal(receipt.additionalProperties, false);

assert.equal(plugin.name, 'ci-voodoo');
assert.match(plugin.version, /^0\.1\.2$/);

const workflow = await readFile('.github/workflows/canonical-ritual.yml', 'utf8');
const architecture = await readFile('docs/plugin-architecture.md', 'utf8');
const skill = await readFile('skills/ci-voodoo/SKILL.md', 'utf8');
assert.match(workflow, /pull_request:/);
assert.match(workflow, /workflow_dispatch:/);
assert.doesNotMatch(workflow, /- image/);
assert.match(workflow, /CI_VOODOO_INCIDENT_REF/);
assert.doesNotMatch(workflow, /incident_summary/i);
assert.match(workflow, /contents: read/);
assert.match(workflow, /python-version: \"3\.11\"/);
assert.doesNotMatch(architecture, /incident_summary/i);
assert.doesNotMatch(skill, /incident_summary/i);

assert.equal(await sha256File('vendor/libinsult/insult.py'), '1b9139a00f93dff1632752fe9c3b590dfded621d89371838d322b653afd8d596');
assert.equal(await sha256File('vendor/six/six.py'), 'c51c91f703d3d4b3696c923cb5fec213e05e75d9215393befac7f2fa6a3904df');
assert.equal(await sha256File('vendor/libinsult/COPYING'), await sha256File('LICENSE'));


process.stdout.write('CONTRACT_CHECK_PASS\n');
