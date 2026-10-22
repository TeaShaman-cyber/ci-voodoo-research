import { runCanonical } from './runner.mjs';

function env(name, fallback = undefined) {
  const value = process.env[name];
  return value === undefined ? fallback : value;
}

const intensity = Number(env('CI_VOODOO_INTENSITY'));
if (!Number.isInteger(intensity)) {
  throw new TypeError('CI_VOODOO_INTENSITY must be an integer');
}

const seedValue = env('CI_VOODOO_SEED', '');

const request = {
  schema: 'ci-voodoo.request.v1',
  mode: env('CI_VOODOO_MODE'),
  target_class: env('CI_VOODOO_TARGET_CLASS'),
  intensity,
  ritual_style: env('CI_VOODOO_RITUAL_STYLE'),
  incident_ref: env('CI_VOODOO_INCIDENT_REF'),
  seed: seedValue === '' ? null : seedValue,
  persist: false
};

const outDir = env('CI_VOODOO_OUT_DIR', 'artifacts/canonical');
const runnerRevision = env('CI_VOODOO_RUNNER_REVISION', env('GITHUB_SHA', 'LOCAL'));

const receipt = await runCanonical({ request, outDir, runnerRevision });
process.stdout.write(JSON.stringify(receipt) + '\n');
