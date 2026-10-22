import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const GENERATOR_VERSION = '0.2.0';
export const ENGINE = 'libinsult';
export const ENGINE_VERSION = '0.6.2';
export const POLICY_SNAPSHOT = 'x-public-2026-10-22';

const TARGETS = new Set(['BUG', 'SYSTEM', 'PROCESS', 'VENDOR_ABSTRACT', 'ROLE_ABSTRACT']);
const STYLES = new Set(['plain-rage', 'folk-curse', 'ci-voodoo', 'cato']);
const MODES = new Set(['text']);
const ADAPTER_PATH = fileURLToPath(new URL('./libinsult_adapter.py', import.meta.url));

function fail(message) {
  throw new TypeError(message);
}

export function validateRequest(request) {
  if (!request || typeof request !== 'object' || Array.isArray(request)) fail('request must be an object');
  if (request.schema !== 'ci-voodoo.request.v1') fail('schema must be ci-voodoo.request.v1');
  if (!MODES.has(request.mode)) fail('mode must be text');
  if (!TARGETS.has(request.target_class)) fail('invalid target_class');
  if (!Number.isInteger(request.intensity) || request.intensity < 0 || request.intensity > 3) {
    fail('intensity must be an integer from 0 to 3');
  }
  if (!STYLES.has(request.ritual_style)) fail('invalid ritual_style');
  if (typeof request.incident_ref !== 'string' || !/^sha256:[0-9a-f]{16,64}$/i.test(request.incident_ref)) {
    fail('incident_ref must be an opaque sha256 reference');
  }
  if (
    request.seed !== null &&
    request.seed !== undefined &&
    (typeof request.seed !== 'string' || request.seed.length === 0)
  ) {
    fail('seed must be a non-empty string or null');
  }
  if (request.persist !== false) fail('persist must be false in generation contract');
  if (request.target_class === 'ROLE_ABSTRACT') {
    if (request.ritual_style !== 'folk-curse') {
      fail('ROLE_ABSTRACT requires folk-curse ritual_style');
    }
    if (request.intensity > 2) {
      fail('ROLE_ABSTRACT intensity must be 0, 1, or 2');
    }
  }
  return request;
}

function stableKey(request) {
  return JSON.stringify({
    schema: request.schema,
    mode: request.mode,
    target_class: request.target_class,
    intensity: request.intensity,
    ritual_style: request.ritual_style,
    incident_ref: request.incident_ref,
    seed: request.seed ?? null,
    persist: request.persist
  });
}

function deriveEffectiveSeed(request) {
  if (request.seed !== null && request.seed !== undefined) return request.seed;
  return createHash('sha256')
    .update(stableKey({ ...request, seed: null }))
    .digest('hex')
    .slice(0, 16);
}

function renderWithLibInsult(request) {
  const python = process.env.CI_VOODOO_PYTHON || 'python3';
  const proc = spawnSync(python, [ADAPTER_PATH], {
    input: JSON.stringify(request),
    encoding: 'utf8',
    maxBuffer: 1024 * 1024
  });

  if (proc.error) {
    fail('LibInsult adapter failed to start: ' + proc.error.message);
  }
  if (proc.status !== 0) {
    fail('LibInsult adapter failed: ' + (proc.stderr || 'unknown error').trim());
  }

  let rendered;
  try {
    rendered = JSON.parse(proc.stdout);
  } catch {
    fail('LibInsult adapter returned invalid JSON');
  }

  if (
    rendered.engine !== ENGINE ||
    rendered.engine_version !== ENGINE_VERSION ||
    typeof rendered.text !== 'string' ||
    rendered.text.length === 0
  ) {
    fail('LibInsult adapter returned an invalid result');
  }
  if (rendered.text.length > 280) {
    fail('generated text exceeds the X character budget');
  }

  return rendered;
}

export function generateRitual(input) {
  const request = validateRequest(input);
  const effectiveSeed = deriveEffectiveSeed(request);
  const effectiveRequest = { ...request, seed: effectiveSeed };
  const rendered = renderWithLibInsult(effectiveRequest);
  const role = effectiveRequest.target_class === 'ROLE_ABSTRACT';
  const vendor = effectiveRequest.target_class === 'VENDOR_ABSTRACT';

  return {
    schema: 'ci-voodoo.result.v1',
    text: rendered.text,
    target_class: effectiveRequest.target_class,
    intensity: effectiveRequest.intensity,
    ritual_style: effectiveRequest.ritual_style,
    risk: role || vendor ? 'MEDIUM' : 'LOW',
    risk_reason: role
      ? 'Abstract-role folk satire only; no named person, threat, protected-class attack, or call for harassment.'
      : vendor
        ? 'Abstract vendor criticism; no named employee, threat, protected-class attack, or call for harassment.'
        : 'Profanity targets a software defect, system, or process.',
    policy_snapshot: POLICY_SNAPSHOT,
    seed: effectiveSeed,
    generator_version: GENERATOR_VERSION,
    engine: rendered.engine,
    engine_version: rendered.engine_version
  };
}
