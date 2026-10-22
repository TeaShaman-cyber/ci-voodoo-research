import { createHash } from 'node:crypto';

export const GENERATOR_VERSION = '0.1.0';
export const POLICY_SNAPSHOT = 'x-public-2026-10-22';

const TARGETS = new Set(['BUG', 'SYSTEM', 'PROCESS', 'VENDOR_ABSTRACT', 'ROLE_ABSTRACT']);
const STYLES = new Set(['plain-rage', 'folk-curse', 'ci-voodoo', 'cato']);
const MODES = new Set(['text']);

const TARGET_LABELS = {
  BUG: ['regression', 'bug', 'flaky test'],
  SYSTEM: ['frontend', 'orchestrator', 'runtime'],
  PROCESS: ['rollout', 'release process', 'feature flag'],
  VENDOR_ABSTRACT: ['platform', 'service', 'vendor runtime'],
  ROLE_ABSTRACT: ['rollout', 'feature flag', 'release']
};

const TEMPLATES = {
  'plain-rage': [
    ({ target, swear }) => `This ${swear}${target} is testing our faith in rollback again.`,
    ({ target, swear }) => `This ${swear}${target}: fix the system, not the user's patience.`,
    ({ target, swear }) => `This ${swear}${target} escaped into production before common sense did.`
  ],
  'folk-curse': [
    ({ target, role }) => role
      ? `May the ${target} owner have their ears burn at every 500 until they remember rollback.`
      : `May this ${target} hiccup on every flaky check until it remembers the stable branch.`,
    ({ target, role }) => role
      ? `May the keeper of this ${target} dream of red CI until the canary finally passes.`
      : `May the CI candle burn over this ${target} until the postcondition is observable.`,
    ({ target, role }) => role
      ? `May the ${target} owner hiccup exactly once for every forgotten rollback.`
      : `May this ${target} hiccup three times and stop pretending to be stable.`
  ],
  'ci-voodoo': [
    ({ target, swear }) => `This ${swear}${target}: the rollback candle is lit; show yourself in the logs and name the guilty commit.`,
    ({ target, swear }) => `May git bisect descend upon this ${swear}${target} until the regression names itself.`,
    ({ target, swear }) => `This ${swear}${target}: CI is summoned, the receipt is forming, and the flaky-build spirit is being expelled.`
  ],
  cato: [
    ({ target, swear }) => `Ceterum censeo: this ${swear}${target} must be fixed.`,
    ({ target, swear }) => `Ceterum censeo: stability beats magical latest; this ${swear}${target} belongs in repair.`,
    ({ target, swear }) => `Ceterum censeo: rollback is not decorative; fix this ${swear}${target}.`
  ]
};

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

function deterministicIndex(request, size) {
  const digest = createHash('sha256').update(stableKey(request)).digest();
  return digest.readUInt32BE(0) % size;
}

function profanityPrefix(intensity) {
  if (intensity <= 0) return '';
  if (intensity === 1) return 'damn ';
  if (intensity === 2) return 'fucking ';
  return 'goddamn fucking ';
}

export function generateRitual(input) {
  const request = validateRequest(input);
  const effectiveSeed = deriveEffectiveSeed(request);
  const effectiveRequest = { ...request, seed: effectiveSeed };
  const role = effectiveRequest.target_class === 'ROLE_ABSTRACT';
  const vendor = effectiveRequest.target_class === 'VENDOR_ABSTRACT';

  const labels = TARGET_LABELS[effectiveRequest.target_class];
  const label = labels[deterministicIndex(effectiveRequest, labels.length)];
  const templates = TEMPLATES[effectiveRequest.ritual_style];
  const template = templates[deterministicIndex({ ...effectiveRequest, seed: `${effectiveSeed}:template` }, templates.length)];
  const text = template({
    target: label,
    role,
    swear: profanityPrefix(effectiveRequest.intensity)
  });

  return {
    schema: 'ci-voodoo.result.v1',
    text,
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
    generator_version: GENERATOR_VERSION
  };
}
